'use client';

import React from 'react';
import { Loader2, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { LangGraphNodeId, NodeStatus, AgentNodeState } from '@/types/legal';

interface AgentProgressStepperProps {
  nodes: Record<LangGraphNodeId, AgentNodeState>;
  activeNode: LangGraphNodeId | null;
  isStreaming: boolean;
}

export const AgentProgressStepper: React.FC<AgentProgressStepperProps> = ({
  nodes,
  activeNode,
  isStreaming,
}) => {
  const nodeList: LangGraphNodeId[] = [
    'decomposing_query',
    'retrieving_chunks',
    'grading_relevance',
    'synthesizing_answer',
  ];

  const activeNodeData = activeNode ? nodes[activeNode] : null;

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 mb-3 text-xs">
      <div className="flex items-center gap-2 mb-2 text-slate-700 font-medium">
        <Sparkles className="w-3.5 h-3.5 text-blue-600" />
        <span>Chuỗi phân tích suy luận (Agent Reasoning)</span>
        {isStreaming && (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-normal">
            Đang xử lý...
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {nodeList.map((nodeId) => {
          const item = nodes[nodeId];
          const isRunning = item.status === 'running';
          const isCompleted = item.status === 'completed';

          return (
            <div
              key={nodeId}
              className={`p-2 rounded-lg border text-xs flex items-center gap-2 transition-all ${
                isRunning
                  ? 'bg-blue-50 border-blue-200 text-blue-800 shadow-2xs'
                  : isCompleted
                  ? 'bg-white border-slate-200 text-slate-700'
                  : 'bg-slate-100/60 border-slate-200/60 text-slate-400'
              }`}
            >
              {isRunning ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600 shrink-0" />
              ) : isCompleted ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              ) : (
                <div className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0" />
              )}
              <span className="truncate text-[11px] font-medium">{item.label}</span>
            </div>
          );
        })}
      </div>

      {activeNodeData?.details && (
        <div className="mt-2 text-[11px] text-slate-500 italic pl-1">
          {activeNodeData.details}
        </div>
      )}
    </div>
  );
};
