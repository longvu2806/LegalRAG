'use client';

import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Copy,
  Check,
  ShieldCheck,
  Coins,
  Sparkles,
  Calendar,
} from 'lucide-react';
import { useLegalStore } from '@/stores/useLegalStore';
import { getStatusDetails, formatSimpleDate } from '@/lib/utils';

export const CitationDetailModal: React.FC = () => {
  const { detailCitation, setDetailCitation } = useLegalStore();
  const [copied, setCopied] = useState(false);

  if (!detailCitation) return null;

  const statusInfo = getStatusDetails(detailCitation.status);

  const handleCopy = () => {
    navigator.clipboard.writeText(detailCitation.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col scale-in-95 duration-200">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-900">
                {detailCitation.article} {detailCitation.clause ? `• ${detailCitation.clause}` : ''}
              </div>
              <div className="text-[11px] text-slate-500 font-mono">{detailCitation.doc_code}</div>
            </div>
          </div>

          <button
            onClick={() => setDetailCitation(null)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Status & Match */}
          <div className="flex items-center justify-between">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusInfo.bg}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`} />
              {statusInfo.label}
            </span>

            <span className="text-xs font-semibold text-blue-600 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Độ tương đồng: {detailCitation.similarity_score}%
            </span>
          </div>

          {/* Title */}
          <div className="text-xs font-semibold text-slate-800 leading-snug">
            {detailCitation.title}
          </div>

          {/* Penalty range */}
          {detailCitation.penalty_range && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-amber-800">
                <Coins className="w-3.5 h-3.5 text-amber-600" />
                <span>Khung hình phạt luật định:</span>
              </div>
              <div className="text-amber-900 leading-relaxed font-medium">
                {detailCitation.penalty_range}
              </div>
            </div>
          )}

          {/* Verbatim Content */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <span>Nguyên văn điều luật:</span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-slate-500 hover:text-slate-800 text-xs font-normal"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600">Đã sao chép</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Sao chép</span>
                  </>
                )}
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 leading-relaxed font-mono whitespace-pre-wrap">
              {detailCitation.content}
            </div>
          </div>

          {/* Relevance reason */}
          {detailCitation.relevance_reason && (
            <div className="text-xs text-slate-600 bg-blue-50/40 p-3 rounded-xl border border-blue-100 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-800">Ghi chú xác thực: </span>
                {detailCitation.relevance_reason}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
