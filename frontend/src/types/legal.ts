export type LangGraphNodeId =
  | 'decomposing_query'
  | 'retrieving_chunks'
  | 'grading_relevance'
  | 'synthesizing_answer';

export type NodeStatus = 'pending' | 'running' | 'completed' | 'error';

export interface AgentNodeState {
  id: LangGraphNodeId;
  label: string;
  description: string;
  status: NodeStatus;
  startedAt?: number;
  durationMs?: number;
  details?: string;
}

export type StatuteStatus = 'active' | 'amended' | 'expired';

export interface StatutoryDocument {
  id: string;
  doc_code: string;
  title: string;
  issuing_authority: string;
  effective_date: string;
  status: StatuteStatus;
  article_count: number;
  summary: string;
  tags: string[];
}

export interface CitationChunk {
  id: string;
  doc_code: string;
  article: string;
  clause?: string;
  title: string;
  content: string;
  status: StatuteStatus;
  similarity_score: number; // Percentage 0 - 100
  relevance_reason?: string;
  penalty_range?: string;
  effective_date?: string;
}

export interface LegalGround {
  doc_code: string;
  article: string;
  clause?: string;
  citation_id: string;
  label: string;
}

export interface LegalAnswerSection {
  legal_grounds: LegalGround[];
  deductive_analysis: string; // Markdown text
  conclusion_advice: string;
  penalty_summary?: string;
}

export interface LegalQueryOptions {
  strict_citation: boolean;
  include_penalties: boolean;
}

export interface LegalQueryRequest {
  session_id: string;
  query: string;
  options: LegalQueryOptions;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content?: string;
  created_at: string;
  options?: LegalQueryOptions;
  status?: 'streaming' | 'completed' | 'error';
  activeNode?: LangGraphNodeId;
  nodes?: AgentNodeState[];
  citations?: CitationChunk[];
  answer?: LegalAnswerSection;
  raw_tokens?: string;
  error?: string;
}

export interface ConsultationSession {
  id: string;
  title: string;
  created_at: string;
  messages: ChatMessage[];
}

export interface IngestionPayload {
  file: File;
  doc_type: string;
  doc_code: string;
  effective_date: string;
}

export interface IngestionResponse {
  success: boolean;
  message: string;
  chunks_indexed: number;
  doc_code: string;
  document?: StatutoryDocument;
}

export type SSEEvent =
  | { event: 'node_change'; data: { node: LangGraphNodeId; status: NodeStatus; details?: string } }
  | { event: 'citations'; data: { citations: CitationChunk[] } }
  | { event: 'token'; data: { token: string } }
  | { event: 'done'; data: { answer: LegalAnswerSection } }
  | { event: 'error'; data: { error: string } };
