import { create } from 'zustand';
import {
  ConsultationSession,
  ChatMessage,
  CitationChunk,
  LangGraphNodeId,
  AgentNodeState,
  StatutoryDocument,
  LegalAnswerSection,
  LegalQueryOptions,
} from '@/types/legal';
import { INITIAL_STATUTES, MOCK_CHUNKS } from '@/lib/mock-api';
import { streamLegalQuery } from '@/lib/api';

export interface UserUploadedDocument {
  id: string;
  name: string;
  size: string;
  uploaded_at: string;
  chunks_count: number;
  doc_type: string;
  doc_code?: string;
  status: 'indexed' | 'processing';
}

const DEFAULT_NODES: Record<LangGraphNodeId, AgentNodeState> = {
  decomposing_query: {
    id: 'decomposing_query',
    label: 'Phân rã câu hỏi',
    description: 'Bóc tách đối tượng và hành vi pháp lý',
    status: 'pending',
  },
  retrieving_chunks: {
    id: 'retrieving_chunks',
    label: 'Truy xuất điều luật',
    description: 'Tìm kiếm các điều khoản liên quan trong kho luật',
    status: 'pending',
  },
  grading_relevance: {
    id: 'grading_relevance',
    label: 'Đánh giá độ phù hợp',
    description: 'Kiểm tra tính hiệu lực và sự tương thích',
    status: 'pending',
  },
  synthesizing_answer: {
    id: 'synthesizing_answer',
    label: 'Tổng hợp câu trả lời',
    description: 'Lập luận suy diễn 3 phần theo chuẩn mực pháp lý',
    status: 'pending',
  },
};

const initialUserDocuments: UserUploadedDocument[] = [
  {
    id: 'doc-user-1',
    name: 'Nghị định 100-2019-NĐ-CP Giao thông đường bộ.pdf',
    size: '1.8 MB',
    uploaded_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    chunks_count: 86,
    doc_type: 'Nghị định',
    doc_code: '100/2019/NĐ-CP',
    status: 'indexed',
  },
  {
    id: 'doc-user-2',
    name: 'Luật Đất đai 2024 số 31-2024-QH15.docx',
    size: '2.4 MB',
    uploaded_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    chunks_count: 260,
    doc_type: 'Luật',
    doc_code: '31/2024/QH15',
    status: 'indexed',
  },
  {
    id: 'doc-user-3',
    name: 'Bộ luật Lao động 2019.pdf',
    size: '1.2 MB',
    uploaded_at: new Date(Date.now() - 86400000 * 10).toISOString(),
    chunks_count: 220,
    doc_type: 'Bộ luật',
    doc_code: '45/2019/QH14',
    status: 'indexed',
  },
];

interface LegalStore {
  // Sessions
  sessions: ConsultationSession[];
  activeSessionId: string;
  createNewSession: () => string;
  selectSession: (id: string) => void;
  deleteSession: (id: string) => void;

  // Streaming State
  isStreaming: boolean;
  activeNode: LangGraphNodeId | null;
  nodeStates: Record<LangGraphNodeId, AgentNodeState>;
  streamedTokens: string;
  abortFn: (() => void) | null;

  // Lightweight Citation Detail Modal
  detailCitation: CitationChunk | null;
  setDetailCitation: (citation: CitationChunk | null) => void;
  inspectCitationById: (id: string) => void;

  // User Uploaded Documents
  userDocuments: UserUploadedDocument[];
  addUserDocument: (doc: UserUploadedDocument) => void;
  deleteUserDocument: (id: string) => void;
  isUserDocsModalOpen: boolean;
  setUserDocsModalOpen: (open: boolean) => void;

  // Query Options
  options: LegalQueryOptions;
  setOptions: (options: Partial<LegalQueryOptions>) => void;

  // Backend / Mock Mode
  useMockMode: boolean;
  setUseMockMode: (val: boolean) => void;

  // Core Actions
  sendQuery: (query: string) => Promise<void>;
  stopGeneration: () => void;
}

const initialSessionId = 'session-default-1';

const initialSession: ConsultationSession = {
  id: initialSessionId,
  title: 'Mức phạt nồng độ cồn ô tô kịch khung',
  created_at: new Date(Date.now() - 3600000).toISOString(),
  messages: [
    {
      id: 'msg-u1',
      role: 'user',
      content: 'Mức phạt nồng độ cồn kịch khung đối với xe ô tô hiện nay là bao nhiêu?',
      created_at: new Date(Date.now() - 3600000).toISOString(),
      options: { strict_citation: true, include_penalties: true },
    },
    {
      id: 'msg-a1',
      role: 'assistant',
      created_at: new Date(Date.now() - 3590000).toISOString(),
      status: 'completed',
      options: { strict_citation: true, include_penalties: true },
      citations: [
        MOCK_CHUNKS['chunk-nd100-d5-k10'],
        MOCK_CHUNKS['chunk-nd100-d5-k8'],
        MOCK_CHUNKS['chunk-lgt-d8-k8'],
      ],
      answer: {
        legal_grounds: [
          {
            doc_code: '100/2019/NĐ-CP (sửa đổi bởi 123/2021/NĐ-CP)',
            article: 'Điều 5, Khoản 10, Điểm a',
            clause: 'Mức phạt kịch khung nồng độ cồn ô tô',
            citation_id: 'chunk-nd100-d5-k10',
            label: 'NĐ 100/2019 - Điều 5.10.a',
          },
          {
            doc_code: '100/2019/NĐ-CP',
            article: 'Điều 5, Khoản 8, Điểm a',
            clause: 'Khung nồng độ cồn mức 2',
            citation_id: 'chunk-nd100-d5-k8',
            label: 'NĐ 100/2019 - Điều 5.8.a',
          },
          {
            doc_code: '23/2008/QH12',
            article: 'Điều 8, Khoản 8',
            clause: 'Hành vi bị nghiêm cấm',
            citation_id: 'chunk-lgt-d8-k8',
            label: 'Luật GTĐB - Điều 8.8',
          },
        ],
        deductive_analysis: `### Phân tích pháp lý:

1. **Nguyên tắc nghiêm cấm:**
   Theo **Điều 8 Khoản 8 Luật Giao thông đường bộ 2008** (đã được sửa đổi bởi Luật Phòng, chống tác hại của rượu, bia 2019), pháp luật Việt Nam nghiêm cấm tuyệt đối mọi hành vi điều khiển phương tiện giao thông trên đường mà trong máu hoặc hơi thở có nồng độ cồn.

2. **Mức phạt kịch khung đối với xe ô tô:**
   Căn cứ theo **Điểm a Khoản 10 Điều 5 Nghị định 100/2019/NĐ-CP** (được sửa đổi bởi Nghị định 123/2021/NĐ-CP), người điều khiển xe ô tô mà trong máu hoặc hơi thở có nồng độ cồn **vượt quá 80 miligam/100 mililít máu hoặc vượt quá 0,4 miligam/1 lít khí thở** (hoặc không chấp hành kiểm tra) sẽ bị áp dụng chế tài:
   - **Phạt tiền:** Từ **30.000.000 đồng đến 40.000.000 đồng**.
   - **Tước giấy phép lái xe:** Từ **22 tháng đến 24 tháng**.

3. **Biện pháp ngăn chặn kèm theo:**
   Căn cứ Điều 82 Nghị định 100/2019/NĐ-CP, phương tiện vi phạm bị **tạm giữ tối đa 07 ngày** trước khi ra quyết định xử phạt.`,
        conclusion_advice:
          'Người điều khiển xe ô tô có nồng độ cồn kịch khung (> 0.4 mg/lít khí thở) sẽ bị phạt tiền từ 30.000.000 đến 40.000.000 đồng, tước bằng lái xe từ 22 đến 24 tháng và tạm giữ xe 7 ngày. Lời khuyên: Tuyệt đối không tự lái xe khi đã sử dụng đồ uống có cồn.',
        penalty_summary:
          'Phạt tiền: 30.000.000đ - 40.000.000đ | Tước GPLX: 22 - 24 tháng | Tạm giữ xe: 7 ngày',
      },
    },
  ],
};

export const useLegalStore = create<LegalStore>((set, get) => ({
  sessions: [initialSession],
  activeSessionId: initialSessionId,

  createNewSession: () => {
    const newId = `session-${Date.now()}`;
    const newSession: ConsultationSession = {
      id: newId,
      title: 'Cuộc trò chuyện mới',
      created_at: new Date().toISOString(),
      messages: [],
    };
    set((state) => ({
      sessions: [newSession, ...state.sessions],
      activeSessionId: newId,
      streamedTokens: '',
      activeNode: null,
      nodeStates: { ...DEFAULT_NODES },
    }));
    return newId;
  },

  selectSession: (id: string) => {
    set({
      activeSessionId: id,
      streamedTokens: '',
      activeNode: null,
    });
  },

  deleteSession: (id: string) => {
    set((state) => {
      const filtered = state.sessions.filter((s) => s.id !== id);
      const nextActive = filtered.length > 0 ? filtered[0].id : '';
      return {
        sessions: filtered,
        activeSessionId: nextActive,
      };
    });
  },

  // Streaming State
  isStreaming: false,
  activeNode: null,
  nodeStates: { ...DEFAULT_NODES },
  streamedTokens: '',
  abortFn: null,

  // Detail Modal for Citations
  detailCitation: null,
  setDetailCitation: (citation) => set({ detailCitation: citation }),
  inspectCitationById: (id: string) => {
    const citation =
      MOCK_CHUNKS[id] ||
      Object.values(MOCK_CHUNKS).find(
        (c) => c.article.toLowerCase().includes(id.toLowerCase()) || c.id.includes(id)
      );
    if (citation) {
      set({ detailCitation: citation });
    }
  },

  // User Documents
  userDocuments: initialUserDocuments,
  addUserDocument: (doc) =>
    set((state) => ({ userDocuments: [doc, ...state.userDocuments] })),
  deleteUserDocument: (id) =>
    set((state) => ({
      userDocuments: state.userDocuments.filter((d) => d.id !== id),
    })),
  isUserDocsModalOpen: false,
  setUserDocsModalOpen: (open) => set({ isUserDocsModalOpen: open }),

  // Query Options
  options: {
    strict_citation: true,
    include_penalties: true,
  },
  setOptions: (opts) =>
    set((state) => ({ options: { ...state.options, ...opts } })),

  // Backend / Mock Mode
  useMockMode: false,
  setUseMockMode: (val: boolean) => set({ useMockMode: val }),

  // Core Actions
  sendQuery: async (queryText: string) => {
    const { activeSessionId, options, useMockMode, sessions } = get();
    if (!queryText.trim() || get().isStreaming) return;

    // Reset node states
    const resetNodes = { ...DEFAULT_NODES };
    Object.keys(resetNodes).forEach((k) => {
      const key = k as LangGraphNodeId;
      resetNodes[key] = { ...resetNodes[key], status: 'pending', details: undefined };
    });

    const userMsgId = `msg-u-${Date.now()}`;
    const assistantMsgId = `msg-a-${Date.now()}`;

    const userMessage: ChatMessage = {
      id: userMsgId,
      role: 'user',
      content: queryText,
      created_at: new Date().toISOString(),
      options: { ...options },
    };

    const initialAssistantMessage: ChatMessage = {
      id: assistantMsgId,
      role: 'assistant',
      created_at: new Date().toISOString(),
      status: 'streaming',
      options: { ...options },
      nodes: Object.values(resetNodes),
      citations: [],
      raw_tokens: '',
    };

    // Update title if first message
    const targetSession = sessions.find((s) => s.id === activeSessionId);
    const updatedTitle =
      targetSession && targetSession.messages.length === 0
        ? queryText.slice(0, 36) + (queryText.length > 36 ? '...' : '')
        : targetSession?.title || 'Cuộc trò chuyện';

    set((state) => ({
      isStreaming: true,
      activeNode: 'decomposing_query',
      nodeStates: resetNodes,
      streamedTokens: '',
      sessions: state.sessions.map((s) =>
        s.id === activeSessionId
          ? {
              ...s,
              title: updatedTitle,
              messages: [...s.messages, userMessage, initialAssistantMessage],
            }
          : s
      ),
    }));

    const abort = streamLegalQuery(
      {
        session_id: activeSessionId,
        query: queryText,
        options,
      },
      {
        onNodeChange: (nodeId, status, details) => {
          set((state) => {
            const updatedNodes = { ...state.nodeStates };
            if (updatedNodes[nodeId]) {
              updatedNodes[nodeId] = {
                ...updatedNodes[nodeId],
                status,
                details: details || updatedNodes[nodeId].details,
              };
            }
            return {
              activeNode: status === 'running' ? nodeId : state.activeNode,
              nodeStates: updatedNodes,
            };
          });
        },
        onCitations: (citations) => {
          set((state) => ({
            sessions: state.sessions.map((s) =>
              s.id === activeSessionId
                ? {
                    ...s,
                    messages: s.messages.map((m) =>
                      m.id === assistantMsgId ? { ...m, citations } : m
                    ),
                  }
                : s
            ),
          }));
        },
        onToken: (token) => {
          set((state) => {
            const nextTokens = state.streamedTokens + token;
            return {
              streamedTokens: nextTokens,
              sessions: state.sessions.map((s) =>
                s.id === activeSessionId
                  ? {
                      ...s,
                      messages: s.messages.map((m) =>
                        m.id === assistantMsgId
                          ? { ...m, raw_tokens: nextTokens }
                          : m
                      ),
                    }
                  : s
              ),
            };
          });
        },
        onDone: (answer: LegalAnswerSection) => {
          set((state) => ({
            isStreaming: false,
            activeNode: null,
            abortFn: null,
            sessions: state.sessions.map((s) =>
              s.id === activeSessionId
                ? {
                    ...s,
                    messages: s.messages.map((m) =>
                      m.id === assistantMsgId
                        ? {
                            ...m,
                            status: 'completed',
                            answer,
                          }
                        : m
                    ),
                  }
                : s
            ),
          }));
        },
        onError: (err) => {
          set((state) => ({
            isStreaming: false,
            activeNode: null,
            abortFn: null,
            sessions: state.sessions.map((s) =>
              s.id === activeSessionId
                ? {
                    ...s,
                    messages: s.messages.map((m) =>
                      m.id === assistantMsgId
                        ? {
                            ...m,
                            status: 'error',
                            error: err,
                          }
                        : m
                    ),
                  }
                : s
            ),
          }));
        },
      },
      useMockMode
    );

    set({ abortFn: abort });
  },

  stopGeneration: () => {
    const { abortFn } = get();
    if (abortFn) {
      abortFn();
    }
    set({
      isStreaming: false,
      activeNode: null,
      abortFn: null,
    });
  },
}));
