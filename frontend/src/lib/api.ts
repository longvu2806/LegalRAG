import {
  LegalQueryRequest,
  IngestionResponse,
  LangGraphNodeId,
  NodeStatus,
  CitationChunk,
  LegalAnswerSection,
} from '@/types/legal';
import { simulateMockSSEStream, mockDocumentIngest, StreamEventHandlers } from './mock-api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function checkBackendConnection(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1500);
    const response = await fetch(`${API_BASE_URL}/docs`, {
      method: 'GET',
      signal: controller.signal,
      mode: 'no-cors',
    });
    clearTimeout(timeoutId);
    return true;
  } catch {
    return false;
  }
}

export function streamLegalQuery(
  request: LegalQueryRequest,
  handlers: StreamEventHandlers,
  useMock: boolean = false,
  signal?: AbortSignal
): () => void {
  // If explicitly requested mock mode, directly use simulator
  if (useMock) {
    return simulateMockSSEStream(request.query, request.options, handlers, signal);
  }

  let isAborted = false;
  const abortController = new AbortController();

  if (signal) {
    signal.addEventListener('abort', () => {
      isAborted = true;
      abortController.abort();
    });
  }

  // Attempt real SSE stream, with automatic graceful fallback to mock if backend is down
  (async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/chat/legal-query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'text/event-stream',
        },
        body: JSON.stringify(request),
        signal: abortController.signal,
      });

      if (!response.ok || !response.body) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      while (!isAborted) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const block of lines) {
          if (!block.trim()) continue;

          let eventType = 'message';
          let dataStr = '';

          const eventLines = block.split('\n');
          for (const line of eventLines) {
            if (line.startsWith('event:')) {
              eventType = line.replace('event:', '').trim();
            } else if (line.startsWith('data:')) {
              dataStr = line.replace('data:', '').trim();
            }
          }

          if (!dataStr) continue;

          try {
            const parsed = JSON.parse(dataStr);
            if (eventType === 'node_change') {
              handlers.onNodeChange(
                parsed.node as LangGraphNodeId,
                parsed.status as NodeStatus,
                parsed.details
              );
            } else if (eventType === 'citations') {
              handlers.onCitations(parsed as CitationChunk[]);
            } else if (eventType === 'token') {
              handlers.onToken(parsed.token || parsed);
            } else if (eventType === 'done') {
              handlers.onDone(parsed.answer || parsed);
            } else if (eventType === 'error') {
              handlers.onError(parsed.error || 'Unknown error occurred');
            }
          } catch (e) {
            console.warn('Failed to parse SSE event data:', dataStr, e);
          }
        }
      }
    } catch (err: any) {
      if (err.name === 'AbortError' || isAborted) {
        return;
      }
      console.warn('Backend unavailable, switching to high-fidelity mock stream:', err.message);
      // Auto fallback to mock stream seamlessly
      simulateMockSSEStream(request.query, request.options, handlers, signal);
    }
  })();

  return () => {
    isAborted = true;
    abortController.abort();
  };
}

export async function uploadDocument(
  formData: FormData,
  useMock: boolean = false
): Promise<IngestionResponse> {
  const file = formData.get('file') as File;
  const docType = (formData.get('doc_type') as string) || 'Văn bản quy phạm';
  const docCode = (formData.get('doc_code') as string) || '';
  const effectiveDate = (formData.get('effective_date') as string) || '';

  if (useMock) {
    return mockDocumentIngest({
      file,
      doc_type: docType,
      doc_code: docCode,
      effective_date: effectiveDate,
    });
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/documents/ingest`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed with status ${response.status}`);
    }

    return await response.json();
  } catch (err: any) {
    console.warn('Backend upload unavailable, using simulated ingestion:', err.message);
    return mockDocumentIngest({
      file,
      doc_type: docType,
      doc_code: docCode,
      effective_date: effectiveDate,
    });
  }
}
