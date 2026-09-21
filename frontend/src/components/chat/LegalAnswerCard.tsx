'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Scale,
  BookOpen,
  CheckCircle,
  Copy,
  Check,
  Coins,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';
import { LegalAnswerSection, CitationChunk } from '@/types/legal';
import { useLegalStore } from '@/stores/useLegalStore';

interface LegalAnswerCardProps {
  answer: LegalAnswerSection;
  citations?: CitationChunk[];
  isStreaming?: boolean;
}

export const LegalAnswerCard: React.FC<LegalAnswerCardProps> = ({
  answer,
  isStreaming = false,
}) => {
  const { inspectCitationById } = useLegalStore();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const fullText = `CĂN CỨ PHÁP LÝ:\n${answer.legal_grounds
      .map((g) => `- ${g.label}: ${g.clause || g.article}`)
      .join('\n')}\n\nLẬP LUẬN:\n${answer.deductive_analysis}\n\nKẾT LUẬN & LỜI KHUYÊN:\n${
      answer.conclusion_advice
    }${answer.penalty_summary ? `\n\nCHẾ TÀI ÁP DỤNG:\n${answer.penalty_summary}` : ''}`;

    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-5 transition-all text-slate-900">
      {/* Top action: Copy */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center">
            <Scale className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-semibold text-slate-800">
            Ý kiến Tư vấn Pháp lý
          </span>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-700 transition-colors p-1 rounded hover:bg-slate-100"
          title="Sao chép nội dung"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-600">Đã chép</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Sao chép</span>
            </>
          )}
        </button>
      </div>

      {/* 1. CĂN CỨ PHÁP LÝ */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
          <BookOpen className="w-3.5 h-3.5 text-blue-600" />
          <span>Căn cứ pháp lý áp dụng</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {answer.legal_grounds && answer.legal_grounds.length > 0 ? (
            answer.legal_grounds.map((ground, idx) => (
              <button
                key={idx}
                onClick={() => inspectCitationById(ground.citation_id)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-blue-50 text-slate-800 hover:text-blue-700 text-xs font-medium border border-slate-200 hover:border-blue-200 transition-all shadow-2xs group"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 group-hover:scale-125 transition-transform" />
                <span>{ground.label}</span>
                {ground.clause && (
                  <span className="text-[11px] text-slate-500 font-normal">
                    ({ground.clause})
                  </span>
                )}
                <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-blue-600 ml-0.5" />
              </button>
            ))
          ) : (
            <div className="text-xs text-slate-400 italic">Đang tổng hợp điều khoản...</div>
          )}
        </div>
      </div>

      {/* 2. LẬP LUẬN PHÁP LÝ */}
      <div className="space-y-2">
        <div className="text-xs font-semibold text-slate-700">Phân tích & Lập luận</div>
        <div className="text-sm text-slate-700 leading-relaxed prose-legal">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              p: ({ children }) => <p className="mb-2 leading-relaxed text-slate-700">{children}</p>,
              strong: ({ children }) => (
                <strong className="font-semibold text-slate-900">{children}</strong>
              ),
              ul: ({ children }) => <ul className="list-disc pl-5 space-y-1 mb-2 text-slate-700">{children}</ul>,
              li: ({ children }) => <li className="text-slate-700">{children}</li>,
              h3: ({ children }) => (
                <h3 className="text-xs font-bold text-slate-900 mt-3 mb-1">{children}</h3>
              ),
            }}
          >
            {answer.deductive_analysis}
          </ReactMarkdown>

          {isStreaming && (
            <span className="inline-block w-2 h-4 bg-blue-600 animate-pulse ml-1 align-middle" />
          )}
        </div>
      </div>

      {/* 3. KẾT LUẬN & LỜI KHUYÊN */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
          <span>Kết luận & Khuyến nghị</span>
        </div>
        <div className="text-xs text-slate-700 leading-relaxed">
          {answer.conclusion_advice}
        </div>

        {answer.penalty_summary && (
          <div className="pt-2 border-t border-slate-200/80 flex items-start gap-2 text-xs text-amber-800">
            <Coins className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">Mức chế tài xác định: </span>
              <span>{answer.penalty_summary}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
