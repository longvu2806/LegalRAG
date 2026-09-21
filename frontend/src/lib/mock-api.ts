import {
  StatutoryDocument,
  CitationChunk,
  LegalAnswerSection,
  LangGraphNodeId,
  NodeStatus,
  IngestionResponse,
} from '@/types/legal';

export const INITIAL_STATUTES: StatutoryDocument[] = [
  {
    id: 'statute-1',
    doc_code: '100/2019/NĐ-CP',
    title: 'Nghị định quy định xử phạt vi phạm hành chính trong lĩnh vực giao thông đường bộ và đường sắt',
    issuing_authority: 'Chính phủ',
    effective_date: '2020-01-01',
    status: 'amended',
    article_count: 86,
    summary: 'Quy định các hành vi vi phạm, hình thức xử phạt, mức xử phạt, biện pháp khắc phục hậu quả vi phạm hành chính trong lĩnh vực giao thông.',
    tags: ['Giao thông', 'Hành chính', 'Xử phạt', 'Nồng độ cồn'],
  },
  {
    id: 'statute-2',
    doc_code: '123/2021/NĐ-CP',
    title: 'Nghị định sửa đổi, bổ sung một số điều của các Nghị định quy định xử phạt vi phạm hành chính lĩnh vực hàng hải, giao thông',
    issuing_authority: 'Chính phủ',
    effective_date: '2022-01-01',
    status: 'active',
    article_count: 42,
    summary: 'Sửa đổi, tăng nặng mức xử phạt đối với nhiều hành vi nguy hiểm như vi phạm tốc độ, nồng độ cồn, không chấp hành hiệu lệnh.',
    tags: ['Giao thông', 'Sửa đổi', 'Xử phạt'],
  },
  {
    id: 'statute-3',
    doc_code: '23/2008/QH12',
    title: 'Luật Giao thông đường bộ 2008',
    issuing_authority: 'Quốc hội',
    effective_date: '2009-07-01',
    status: 'active',
    article_count: 89,
    summary: 'Quy định về quy tắc giao thông đường bộ; kết cấu hạ tầng giao thông đường bộ; phương tiện và người tham gia giao thông.',
    tags: ['Luật', 'Giao thông', 'Quy tắc'],
  },
  {
    id: 'statute-4',
    doc_code: '31/2024/QH15',
    title: 'Luật Đất đai 2024',
    issuing_authority: 'Quốc hội',
    effective_date: '2024-08-01',
    status: 'active',
    article_count: 260,
    summary: 'Quy định về chế độ sở hữu đất đai, quyền hạn và trách nhiệm của Nhà nước, chế độ quản lý và sử dụng đất đai.',
    tags: ['Đất đai', 'Bất động sản', 'Quyền sử dụng đất'],
  },
  {
    id: 'statute-5',
    doc_code: '45/2019/QH14',
    title: 'Bộ luật Lao động 2019',
    issuing_authority: 'Quốc hội',
    effective_date: '2021-01-01',
    status: 'active',
    article_count: 220,
    summary: 'Quy định tiêu chuẩn lao động; quyền, nghĩa vụ, trách nhiệm của người lao động, người sử dụng lao động trong quan hệ lao động.',
    tags: ['Lao động', 'Hợp đồng', 'Bảo hiểm'],
  },
  {
    id: 'statute-6',
    doc_code: '91/2015/QH13',
    title: 'Bộ luật Dân sự 2015',
    issuing_authority: 'Quốc hội',
    effective_date: '2017-01-01',
    status: 'active',
    article_count: 689,
    summary: 'Quy định địa vị pháp lý, chuẩn mực pháp lý về cách ứng xử của cá nhân, pháp nhân; quyền, nghĩa vụ về nhân thân và tài sản.',
    tags: ['Dân sự', 'Hợp đồng', 'Bồi thường thiệt hại'],
  },
];

export const MOCK_CHUNKS: Record<string, CitationChunk> = {
  'chunk-nd100-d5-k8': {
    id: 'chunk-nd100-d5-k8',
    doc_code: '100/2019/NĐ-CP (Sửa đổi bởi 123/2021/NĐ-CP)',
    article: 'Điều 5',
    clause: 'Khoản 8, Điểm a',
    title: 'Xử phạt người điều khiển xe ô tô vi phạm quy tắc giao thông đường bộ',
    content:
      'Phạt tiền từ 16.000.000 đồng đến 18.000.000 đồng đối với người điều khiển xe thực hiện một trong các hành vi vi phạm sau đây: Điều khiển xe trên đường mà trong máu hoặc hơi thở có nồng độ cồn vượt quá 50 miligam đến 80 miligam/100 mililít máu hoặc vượt quá 0,25 miligam đến 0,4 miligam/1 lít khí thở.',
    status: 'amended',
    similarity_score: 96,
    relevance_reason: 'Quy định cụ thể mức định lượng nồng độ cồn bậc 2 đối với người điều khiển phương tiện ô tô.',
    penalty_range: '16.000.000đ - 18.000.000đ | Tước GPLX từ 16 - 18 tháng',
    effective_date: '2022-01-01',
  },
  'chunk-nd100-d5-k10': {
    id: 'chunk-nd100-d5-k10',
    doc_code: '100/2019/NĐ-CP (Sửa đổi bởi 123/2021/NĐ-CP)',
    article: 'Điều 5',
    clause: 'Khoản 10, Điểm a',
    title: 'Khung hình phạt cao nhất đối với nồng độ cồn xe ô tô (Kịch khung)',
    content:
      'Phạt tiền từ 30.000.000 đồng đến 40.000.000 đồng đối với người điều khiển xe thực hiện hành vi vi phạm: Điều khiển xe trên đường mà trong máu hoặc hơi thở có nồng độ cồn vượt quá 80 miligam/100 mililít máu hoặc vượt quá 0,4 miligam/1 lít khí thở; hoặc không chấp hành yêu cầu kiểm tra về nồng độ cồn của người thi hành công vụ.',
    status: 'amended',
    similarity_score: 99,
    relevance_reason: 'Căn cứ áp dụng mức xử phạt kịch khung đối với vi phạm nồng độ cồn trên 0,4 mg/lít khí thở của ô tô.',
    penalty_range: '30.000.000đ - 40.000.000đ | Tước GPLX từ 22 - 24 tháng | Tạm giữ phương tiện đến 7 ngày',
    effective_date: '2022-01-01',
  },
  'chunk-nd100-d6-k8': {
    id: 'chunk-nd100-d6-k8',
    doc_code: '100/2019/NĐ-CP',
    article: 'Điều 6',
    clause: 'Khoản 8, Điểm e',
    title: 'Xử phạt nồng độ cồn kịch khung đối với người điều khiển xe mô tô, xe gắn máy',
    content:
      'Phạt tiền từ 6.000.000 đồng đến 8.000.000 đồng đối với người điều khiển xe mô tô, xe gắn máy (kể cả xe máy điện) thực hiện hành vi: Điều khiển xe trên đường mà trong máu hoặc hơi thở có nồng độ cồn vượt quá 80 miligam/100 mililít máu hoặc vượt quá 0,4 miligam/1 lít khí thở; hoặc không chấp hành yêu cầu kiểm tra nồng độ cồn.',
    status: 'active',
    similarity_score: 95,
    relevance_reason: 'Mức phạt kịch khung cho xe máy vi phạm nồng độ cồn trên 0,4 mg/lít khí thở.',
    penalty_range: '6.000.000đ - 8.000.000đ | Tước GPLX từ 22 - 24 tháng',
    effective_date: '2020-01-01',
  },
  'chunk-lgt-d8-k8': {
    id: 'chunk-lgt-d8-k8',
    doc_code: '23/2008/QH12',
    article: 'Điều 8',
    clause: 'Khoản 8',
    title: 'Các hành vi bị nghiêm cấm trong giao thông đường bộ',
    content:
      'Nghiêm cấm hành vi: Điều khiển phương tiện tham gia giao thông đường bộ mà trong máu hoặc hơi thở có nồng độ cồn (được sửa đổi bổ sung bởi Luật Phòng, chống tác hại của rượu, bia 2019 nghiêm cấm tuyệt đối nồng độ cồn khi lái xe).',
    status: 'active',
    similarity_score: 92,
    relevance_reason: 'Nguyên tắc cấm tuyệt đối việc điều khiển phương tiện khi có nồng độ cồn trong máu hoặc hơi thở.',
    effective_date: '2009-07-01',
  },
  'chunk-ldd-d167-k3': {
    id: 'chunk-ldd-d167-k3',
    doc_code: '31/2024/QH15',
    article: 'Điều 167',
    clause: 'Khoản 3',
    title: 'Điều kiện công chứng, chứng thực hợp đồng chuyển nhượng quyền sử dụng đất',
    content:
      'Hợp đồng chuyển nhượng, tặng cho, thế chấp, góp vốn bằng quyền sử dụng đất, quyền sử dụng đất và tài sản gắn liền với đất phải được công chứng hoặc chứng thực, trừ trường hợp kinh doanh bất động sản quy định tại điểm b khoản này.',
    status: 'active',
    similarity_score: 94,
    relevance_reason: 'Quy định bắt buộc về hình thức văn bản công chứng đối với giao dịch chuyển nhượng bất động sản.',
    effective_date: '2024-08-01',
  },
  'chunk-bllđ-d36-k1': {
    id: 'chunk-bllđ-d36-k1',
    doc_code: '45/2019/QH14',
    article: 'Điều 36',
    clause: 'Khoản 1',
    title: 'Quyền đơn phương chấm dứt hợp đồng lao động của người sử dụng lao động',
    content:
      'Người sử dụng lao động có quyền đơn phương chấm dứt hợp đồng lao động trong trường hợp: Người lao động thường xuyên không hoàn thành công việc theo hợp đồng lao động; hoặc người lao động bị ốm đau, tai nạn đã điều trị liên tục mà khả năng lao động chưa hồi phục theo thời hạn luật định.',
    status: 'active',
    similarity_score: 91,
    relevance_reason: 'Căn cứ đánh giá tính hợp pháp khi doanh nghiệp cho thôi việc người lao động.',
    effective_date: '2021-01-01',
  },
};

export interface MockScenarioResponse {
  citations: CitationChunk[];
  answer: LegalAnswerSection;
}

export function getMockLegalResponse(
  query: string,
  options: { strict_citation: boolean; include_penalties: boolean }
): MockScenarioResponse {
  const normalized = query.toLowerCase();

  if (normalized.includes('nồng độ cồn') || normalized.includes('rượu bia') || normalized.includes('say')) {
    const isCar = normalized.includes('ô tô') || normalized.includes('oto') || !normalized.includes('xe máy');

    if (isCar) {
      return {
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
          deductive_analysis: `### Phân tích pháp lý đa bước:

1. **Nguyên tắc nghiêm cấm điều khiển phương tiện:**
   Theo quy định tại **Điều 8 Khoản 8 Luật Giao thông đường bộ 2008** (đã được sửa đổi, bổ sung bởi Luật Phòng, chống tác hại của rượu, bia 2019), pháp luật Việt Nam hiện hành áp dụng nguyên tắc **Zero Tolerance** - cấm tuyệt đối mọi hành vi điều khiển phương tiện giao thông trên đường mà trong máu hoặc hơi thở có nồng độ cồn.

2. **Xác định hành vi vi phạm & mức phạt đối với xe ô tô:**
   Căn cứ theo **Nghị định 100/2019/NĐ-CP** (được sửa đổi, bổ sung bởi **Nghị định 123/2021/NĐ-CP**), hành vi vi phạm nồng độ cồn của người điều khiển xe ô tô được chia thành 3 khung xử phạt:
   - **Khung 1 (≤ 50 mg/100ml máu hoặc ≤ 0.25 mg/1l khí thở):** Phạt tiền từ **6.000.000 - 8.000.000 VNĐ**, tước GPLX 10 - 12 tháng.
   - **Khung 2 (> 50 đến 80 mg/100ml máu hoặc > 0.25 đến 0.4 mg/1l khí thở):** Phạt tiền từ **16.000.000 - 18.000.000 VNĐ** *(Khoản 8 Điều 5)*, tước GPLX 16 - 18 tháng.
   - **Khung 3 - Mức kịch khung (> 80 mg/100ml máu hoặc > 0.4 mg/1l khí thở; hoặc không chấp hành kiểm tra):** Phạt tiền từ **30.000.000 - 40.000.000 VNĐ** *(Điểm a Khoản 10 Điều 5)*, tước GPLX 22 - 24 tháng.

3. **Biện pháp ngăn chặn hành chính kèm theo:**
   Căn cứ Điều 82 Nghị định 100/2019/NĐ-CP, để ngăn chặn ngay hành vi vi phạm nguy hiểm, người có thẩm quyền xử phạt được phép **tạm giữ phương tiện tối đa 07 ngày** trước khi ra quyết định xử phạt.`,
          conclusion_advice:
            'Người điều khiển xe ô tô có nồng độ cồn kịch khung (> 0.4 mg/lít khí thở) sẽ bị phạt tiền từ 30.000.000 đến 40.000.000 đồng, tước quyền sử dụng Giấy phép lái xe từ 22 đến 24 tháng và tạm giữ xe đến 7 ngày. Lời khuyên: Tuyệt đối không điều khiển phương tiện sau khi uống rượu bia; chủ động sử dụng phương tiện công cộng hoặc dịch vụ lái xe hộ để tránh rủi ro pháp lý và an toàn tính mạng.',
          penalty_summary: options.include_penalties
            ? 'Phạt tiền: 30.000.000đ - 40.000.000đ | Tước GPLX: 22 - 24 tháng | Tạm giữ phương tiện: 7 ngày'
            : undefined,
        },
      };
    } else {
      return {
        citations: [MOCK_CHUNKS['chunk-nd100-d6-k8'], MOCK_CHUNKS['chunk-lgt-d8-k8']],
        answer: {
          legal_grounds: [
            {
              doc_code: '100/2019/NĐ-CP',
              article: 'Điều 6, Khoản 8, Điểm e',
              clause: 'Mức phạt nồng độ cồn kịch khung xe mô tô, xe máy',
              citation_id: 'chunk-nd100-d6-k8',
              label: 'NĐ 100/2019 - Điều 6.8.e',
            },
            {
              doc_code: '23/2008/QH12',
              article: 'Điều 8, Khoản 8',
              clause: 'Cấm nồng độ cồn',
              citation_id: 'chunk-lgt-d8-k8',
              label: 'Luật GTĐB - Điều 8.8',
            },
          ],
          deductive_analysis: `### Phân tích căn cứ pháp lý xử phạt xe máy:

1. **Nguyên tắc xử lý vi phạm:**
   Khoản 8 Điều 8 Luật Giao thông đường bộ nghiêm cấm việc điều khiển xe máy trên đường khi có nồng độ cồn trong cơ thể.

2. **Mức phạt theo Nghị định 100/2019/NĐ-CP:**
   Đối với xe mô tô, xe gắn máy (kể cả xe máy điện), mức xử phạt khi nồng độ cồn vượt quá 0,4 mg/lít khí thở hoặc vượt quá 80 mg/100ml máu là:
   - **Phạt tiền:** Từ **6.000.000 đồng đến 8.000.000 đồng** (theo Điểm e Khoản 8 Điều 6).
   - **Hình thức xử phạt bổ sung:** Bị **tước quyền sử dụng Giấy phép lái xe từ 22 tháng đến 24 tháng**.
   - **Biện pháp ngăn chặn:** Tạm giữ xe mô tô vi phạm tới **07 ngày làm việc**.`,
          conclusion_advice:
            'Vi phạm nồng độ cồn mức cao nhất đối với xe máy bị phạt tiền từ 6.000.000 đến 8.000.000 đồng, tước bằng lái 22-24 tháng và tạm giữ phương tiện 7 ngày.',
          penalty_summary: options.include_penalties
            ? 'Phạt tiền: 6.000.000đ - 8.000.000đ | Tước GPLX: 22 - 24 tháng | Tạm giữ xe máy: 7 ngày'
            : undefined,
        },
      };
    }
  }

  if (normalized.includes('đất') || normalized.includes('sổ đỏ') || normalized.includes('nhà đất')) {
    return {
      citations: [MOCK_CHUNKS['chunk-ldd-d167-k3']],
      answer: {
        legal_grounds: [
          {
            doc_code: '31/2024/QH15',
            article: 'Điều 167, Khoản 3',
            clause: 'Hiệu lực hợp đồng công chứng chuyển nhượng quyền sử dụng đất',
            citation_id: 'chunk-ldd-d167-k3',
            label: 'Luật Đất đai 2024 - Điều 167.3',
          },
        ],
        deductive_analysis: `### Phân tích điều kiện pháp lý hợp đồng chuyển nhượng quyền sử dụng đất:

1. **Điều kiện về hình thức hợp đồng:**
   Căn cứ **Khoản 3 Điều 167 Luật Đất đai 2024**, hợp đồng chuyển nhượng quyền sử dụng đất và tài sản gắn liền với đất bắt buộc phải được công chứng tại Văn phòng/Phòng Công chứng hoặc chứng thực tại Ủy ban nhân dân cấp xã/phường có thẩm quyền.

2. **Hệ quả của giao dịch viết tay không công chứng:**
   Hợp đồng mua bán đất chỉ lập giấy viết tay hoặc vi bằng không có giá trị pháp lý để sang tên cấp Giấy chứng nhận quyền sử dụng đất (Sổ đỏ). Giao dịch này có nguy cơ vô hiệu do không tuân thủ quy định về hình thức theo Bộ luật Dân sự, dẫn đến việc các bên phải hoàn trả cho nhau những gì đã nhận.`,
        conclusion_advice:
          'Mọi giao dịch mua bán, chuyển nhượng đất đai bắt buộc phải lập thành văn bản có công chứng hoặc chứng thực hợp pháp để đảm bảo hiệu lực và tiến hành thủ tục đăng ký biến động tại Văn phòng Đăng ký đất đai.',
        penalty_summary: options.include_penalties
          ? 'Hợp đồng không công chứng có nguy cơ bị tuyên vô hiệu; phạt tiền vi phạm đăng ký biến động chậm từ 2.000.000đ - 5.000.000đ'
          : undefined,
      },
    };
  }

  // Default Fallback Legal Analysis
  return {
    citations: [MOCK_CHUNKS['chunk-nd100-d5-k8'], MOCK_CHUNKS['chunk-lgt-d8-k8']],
    answer: {
      legal_grounds: [
        {
          doc_code: '100/2019/NĐ-CP',
          article: 'Điều 5, Khoản 8',
          clause: 'Căn cứ xác định hành vi vi phạm giao thông',
          citation_id: 'chunk-nd100-d5-k8',
          label: 'NĐ 100/2019 - Điều 5.8',
        },
        {
          doc_code: '23/2008/QH12',
          article: 'Điều 8',
          clause: 'Quy tắc an toàn đường bộ',
          citation_id: 'chunk-lgt-d8-k8',
          label: 'Luật GTĐB - Điều 8',
        },
      ],
      deductive_analysis: `### Đánh giá pháp lý sơ bộ theo yêu cầu tư vấn:

Dựa trên dữ liệu tra cứu văn bản quy phạm pháp luật hiện hành đối với câu hỏi "${query}":

1. **Xác định quan hệ pháp luật:**
   Yêu cầu của bạn thuộc lĩnh vực điều chỉnh của văn bản quy phạm pháp luật chuyên ngành về giao thông đường bộ và xử lý vi phạm hành chính.

2. **Căn cứ áp dụng:**
   - Hệ thống đối chiếu các quy định pháp luật hiện hành và các văn bản sửa đổi bổ sung gần nhất.
   - Khi có sự xung đột giữa văn bản cũ và văn bản mới ban hành, nguyên tắc áp dụng văn bản ban hành sau được ưu tiên thi hành.`,
      conclusion_advice:
        'Bạn nên kiểm tra kỹ các tình tiết thực tế, thời điểm xảy ra sự việc và các biên bản giấy tờ liên quan để áp dụng đúng mức chế tài theo văn bản quy phạm pháp luật đang có hiệu lực thi hành.',
      penalty_summary: options.include_penalties
        ? 'Tùy mức độ vi phạm, chế tài bao gồm: Cảnh cáo, phạt tiền theo khung luật định và các biện pháp khắc phục hậu quả.'
        : undefined,
    },
  };
}

export interface StreamEventHandlers {
  onNodeChange: (node: LangGraphNodeId, status: NodeStatus, details?: string) => void;
  onCitations: (citations: CitationChunk[]) => void;
  onToken: (token: string) => void;
  onDone: (answer: LegalAnswerSection) => void;
  onError: (error: string) => void;
}

export function simulateMockSSEStream(
  query: string,
  options: { strict_citation: boolean; include_penalties: boolean },
  handlers: StreamEventHandlers,
  signal?: AbortSignal
): () => void {
  let isAborted = false;
  const timeouts: NodeJS.Timeout[] = [];

  const abort = () => {
    isAborted = true;
    timeouts.forEach((t) => clearTimeout(t));
  };

  if (signal) {
    signal.addEventListener('abort', abort);
  }

  const result = getMockLegalResponse(query, options);

  // Stepper timeline
  // 1. Decomposing Query
  timeouts.push(
    setTimeout(() => {
      if (isAborted) return;
      handlers.onNodeChange('decomposing_query', 'running', 'Đang bóc tách thực thể pháp lý, định danh loại phương tiện & hành vi...');
    }, 200)
  );

  timeouts.push(
    setTimeout(() => {
      if (isAborted) return;
      handlers.onNodeChange('decomposing_query', 'completed', 'Đã phân tích 3 tiểu mục: Chủ thể, Hành vi vi phạm, Khung áp dụng');
      // 2. Retrieving Chunks
      handlers.onNodeChange('retrieving_chunks', 'running', 'Đang quét vector store Qdrant và đối chiếu cơ sở dữ liệu Nghị định...');
    }, 900)
  );

  timeouts.push(
    setTimeout(() => {
      if (isAborted) return;
      handlers.onNodeChange('retrieving_chunks', 'completed', `Đã truy xuất ${result.citations.length} đoạn điều khoản phù hợp`);
      handlers.onCitations(result.citations);
      // 3. Grading Relevance
      handlers.onNodeChange('grading_relevance', 'running', 'Đang kiểm định chéo độ hiệu lực văn bản và loại trừ điều khoản hết hiệu lực...');
    }, 1800)
  );

  timeouts.push(
    setTimeout(() => {
      if (isAborted) return;
      handlers.onNodeChange('grading_relevance', 'completed', 'Độ tin cậy xác thực đạt 98.4% (Không phát hiện mâu thuẫn pháp lý)');
      // 4. Synthesizing Answer
      handlers.onNodeChange('synthesizing_answer', 'running', 'Đang tổng hợp lập luận suy diễn và kết luận theo cấu trúc 3 phần...');

      // Stream deductive tokens progressively
      const fullText = result.answer.deductive_analysis;
      const words = fullText.split(' ');
      let currentWordIndex = 0;

      const streamInterval = setInterval(() => {
        if (isAborted) {
          clearInterval(streamInterval);
          return;
        }
        if (currentWordIndex < words.length) {
          const chunk = words.slice(currentWordIndex, currentWordIndex + 3).join(' ') + ' ';
          handlers.onToken(chunk);
          currentWordIndex += 3;
        } else {
          clearInterval(streamInterval);
          handlers.onNodeChange('synthesizing_answer', 'completed', 'Hoàn tất lập luận pháp lý');
          handlers.onDone(result.answer);
        }
      }, 35);
    }, 2700)
  );

  return abort;
}

export async function mockDocumentIngest(
  payload: { file: File; doc_type: string; doc_code: string; effective_date: string }
): Promise<IngestionResponse> {
  // Simulate network latency for ingestion
  await new Promise((res) => setTimeout(res, 1500));

  const newDoc: StatutoryDocument = {
    id: `statute-${Date.now()}`,
    doc_code: payload.doc_code || `${Math.floor(Math.random() * 200)}/2024/NĐ-CP`,
    title: payload.file.name.replace(/\.[^/.]+$/, ''),
    issuing_authority: 'Cơ quan có thẩm quyền',
    effective_date: payload.effective_date || new Date().toISOString().split('T')[0],
    status: 'active',
    article_count: Math.floor(Math.random() * 40) + 15,
    summary: `Văn bản được nạp từ tệp tin ${payload.file.name}. Đã qua phân tách và nhúng vector ngữ nghĩa.`,
    tags: [payload.doc_type || 'Văn bản quy phạm', 'Nạp mới'],
  };

  return {
    success: true,
    message: `Đã nạp và lập chỉ mục thành công tệp ${payload.file.name}`,
    chunks_indexed: Math.floor(Math.random() * 25) + 8,
    doc_code: newDoc.doc_code,
    document: newDoc,
  };
}
