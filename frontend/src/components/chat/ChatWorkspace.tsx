'use client';

import React, { useRef, useEffect } from 'react';
import { Scale, User, Sparkles } from 'lucide-react';
import { useLegalStore } from '@/stores/useLegalStore';
import { AgentProgressStepper } from './AgentProgressStepper';
import { LegalAnswerCard } from './LegalAnswerCard';
import { QueryInput } from './QueryInput';
import { WelcomeState } from './WelcomeState';
import { CitationDetailModal } from './CitationDetailModal';

export const ChatWorkspace: React.FC = () => {
  const {
    sessions,
    activeSessionId,
    isStreaming,
    activeNode,
    nodeStates,
    streamedTokens,
  } = useLegalStore();

  const scrollBottomRef = useRef<HTMLDivElement>(null);
  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0];

  useEffect(() => {
    scrollBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeSession?.messages, streamedTokens, isStreaming]);

  const messages = activeSession?.messages || [];

  return (
    <div className="flex-1 flex flex-col h-full bg-white overflow-hidden relative">
      {/* Top Subtle Bar */}
      <div className="h-11 border-b border-slate-100 px-6 flex items-center justify-between shrink-0 bg-white">
        <span className="text-xs font-medium text-slate-600 truncate">
          {activeSession?.title || 'Cuộc trò chuyện mới'}
        </span>
      </div>

      {/* Messages Stream Container */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.length === 0 ? (
            <WelcomeState />
          ) : (
            messages.map((message) => {
              const isUser = message.role === 'user';

              if (isUser) {
                return (
                  <div key={message.id} className="flex items-start justify-end gap-3">
                    <div className="max-w-xl">
                      <div className="p-3.5 rounded-2xl rounded-tr-xs bg-slate-100 text-slate-900 text-sm font-normal leading-relaxed">
                        {message.content}
                      </div>
                    </div>
                  </div>
                );
              }

              // Assistant message
              const isCurrentlyStreaming = message.status === 'streaming';

              return (
                <div key={message.id} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0 mt-1 border border-blue-100">
                    <Scale className="w-4 h-4" />
                  </div>

                  <div className="flex-1 min-w-0 space-y-3">
                    {/* Stepper active while streaming or if has nodes */}
                    {(isCurrentlyStreaming || isStreaming) && (
                      <AgentProgressStepper
                        nodes={nodeStates}
                        activeNode={activeNode}
                        isStreaming={isStreaming}
                      />
                    )}

                    {/* Intermediate streamed tokens before full answer completion */}
                    {isCurrentlyStreaming && streamedTokens && (
                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-700 leading-relaxed font-sans">
                        <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-2">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Đang tổng hợp lập luận...</span>
                        </div>
                        <div className="whitespace-pre-wrap">{streamedTokens}</div>
                        <span className="inline-block w-2 h-4 bg-blue-600 animate-pulse ml-1 align-middle" />
                      </div>
                    )}

                    {/* Completed Partitioned Answer Card */}
                    {message.answer && (
                      <LegalAnswerCard
                        answer={message.answer}
                        citations={message.citations}
                        isStreaming={false}
                      />
                    )}

                    {/* Error state */}
                    {message.status === 'error' && (
                      <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                        Đã có lỗi xảy ra trong quá trình xử lý: {message.error}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
          <div ref={scrollBottomRef} />
        </div>
      </div>

      {/* Bottom Query Input */}
      <QueryInput />

      {/* Popover / Modal for Citation Details when clicked */}
      <CitationDetailModal />
    </div>
  );
};
