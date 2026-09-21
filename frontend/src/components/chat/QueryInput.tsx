'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ArrowUp, Square, ShieldCheck, Coins } from 'lucide-react';
import { useLegalStore } from '@/stores/useLegalStore';

export const QueryInput: React.FC = () => {
  const { options, setOptions, sendQuery, isStreaming, stopGeneration } = useLegalStore();
  const [query, setQuery] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [query]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim() || isStreaming) return;
    sendQuery(query);
    setQuery('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 pb-5 pt-2">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm focus-within:border-slate-400 focus-within:shadow-md transition-all p-3 space-y-2.5">
        <textarea
          ref={textareaRef}
          rows={1}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isStreaming}
          placeholder="Hỏi về điều luật, mức phạt giao thông, tranh chấp đất đai hoặc hợp đồng..."
          className="w-full resize-none bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none max-h-36 min-h-[44px] leading-relaxed"
        />

        {/* Bottom bar with options & send */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            {/* Strict mode toggle */}
            <button
              type="button"
              onClick={() => setOptions({ strict_citation: !options.strict_citation })}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs transition-all border ${
                options.strict_citation
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : 'bg-slate-50 text-slate-500 border-slate-200 hover:text-slate-700'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Trích dẫn chuẩn</span>
            </button>

            {/* Penalty mode toggle */}
            <button
              type="button"
              onClick={() => setOptions({ include_penalties: !options.include_penalties })}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs transition-all border ${
                options.include_penalties
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : 'bg-slate-50 text-slate-500 border-slate-200 hover:text-slate-700'
              }`}
            >
              <Coins className="w-3.5 h-3.5" />
              <span>Kèm mức phạt</span>
            </button>
          </div>

          <div>
            {isStreaming ? (
              <button
                type="button"
                onClick={stopGeneration}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center justify-center transition-all"
                title="Dừng sinh câu trả lời"
              >
                <Square className="w-3.5 h-3.5 fill-slate-800" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleSubmit()}
                disabled={!query.trim()}
                className="w-8 h-8 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-30 disabled:pointer-events-none text-white flex items-center justify-center transition-all shadow-xs"
                title="Gửi câu hỏi"
              >
                <ArrowUp className="w-4 h-4 stroke-[2.5]" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="text-center text-[11px] text-slate-400 mt-2">
        LegalRAG tham chiếu từ kho văn bản quy phạm pháp luật đã lập chỉ mục.
      </div>
    </div>
  );
};
