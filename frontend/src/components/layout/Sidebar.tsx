'use client';

import React from 'react';
import {
  MessageSquare,
  Plus,
  Trash2,
  FolderArchive,
  Scale,
  ChevronRight,
} from 'lucide-react';
import { useLegalStore } from '@/stores/useLegalStore';

export const Sidebar: React.FC = () => {
  const {
    sessions,
    activeSessionId,
    createNewSession,
    selectSession,
    deleteSession,
    userDocuments,
    setUserDocsModalOpen,
  } = useLegalStore();

  return (
    <aside className="w-64 border-r border-slate-200 bg-slate-50/70 flex flex-col h-full shrink-0 select-none">
      {/* Brand & New Chat */}
      <div className="p-3 space-y-3">
        {/* Brand */}
        <div className="flex items-center gap-2.5 px-2 py-1">
          <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm">
            <Scale className="w-4 h-4" />
          </div>
          <span className="font-semibold text-sm text-slate-900 tracking-tight">LegalRAG</span>
        </div>

        {/* New Chat Button */}
        <button
          onClick={createNewSession}
          className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200/90 text-slate-800 text-xs font-semibold shadow-xs transition-all active:scale-[0.98]"
        >
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4 text-blue-600" />
            <span>Cuộc trò chuyện mới</span>
          </div>
        </button>
      </div>

      {/* History List */}
      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5">
        <div className="px-3 py-1.5 text-[11px] font-medium text-slate-400 uppercase tracking-wider">
          Lịch sử trò chuyện
        </div>

        {sessions.length === 0 ? (
          <div className="text-center py-6 text-xs text-slate-400 px-3">
            Chưa có cuộc trò chuyện nào
          </div>
        ) : (
          sessions.map((session) => {
            const isActive = session.id === activeSessionId;
            return (
              <div
                key={session.id}
                onClick={() => selectSession(session.id)}
                className={`group relative flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer text-xs transition-all ${
                  isActive
                    ? 'bg-white text-slate-900 font-medium shadow-xs border border-slate-200/80'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0 pr-6">
                  <MessageSquare
                    className={`w-3.5 h-3.5 shrink-0 ${
                      isActive ? 'text-blue-600' : 'text-slate-400'
                    }`}
                  />
                  <span className="truncate">{session.title || 'Cuộc trò chuyện'}</span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteSession(session.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded hover:text-rose-600 text-slate-400 transition-opacity"
                  title="Xoá cuộc trò chuyện"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Bottom-left: User Uploaded Documents Library */}
      <div className="p-3 border-t border-slate-200/80 bg-slate-50">
        <button
          onClick={() => setUserDocsModalOpen(true)}
          className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white hover:bg-slate-100/80 border border-slate-200 text-slate-700 hover:text-slate-900 transition-all text-xs shadow-xs group"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
              <FolderArchive className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className="font-semibold text-slate-800">Kho tài liệu của tôi</div>
              <div className="text-[11px] text-slate-400">{userDocuments.length} tài liệu đã tải lên</div>
            </div>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </aside>
  );
};
