'use client';

import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { ChatWorkspace } from '@/components/chat/ChatWorkspace';
import { UserDocumentsModal } from '@/components/documents/UserDocumentsModal';

export default function Home() {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white text-slate-900">
      {/* Cột 1 Bên trái: Lịch sử trò chuyện & Góc trái cuối xem kho tài liệu đã tải lên */}
      <Sidebar />

      {/* Ở giữa: Khung chat và thanh nhập câu hỏi */}
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-white">
        <ChatWorkspace />
      </main>

      {/* Modal xem kho tài liệu đã tải lên của người dùng (kích hoạt từ góc trái cuối) */}
      <UserDocumentsModal />
    </div>
  );
}
