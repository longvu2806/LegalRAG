'use client';

import React, { useState, useRef } from 'react';
import {
  X,
  UploadCloud,
  FileText,
  Trash2,
  Calendar,
  CheckCircle2,
  FolderOpen,
  Loader2,
  Sparkles,
  Plus,
} from 'lucide-react';
import { useLegalStore } from '@/stores/useLegalStore';
import { formatSimpleDate } from '@/lib/utils';
import { uploadDocument } from '@/lib/api';

export const UserDocumentsModal: React.FC = () => {
  const {
    isUserDocsModalOpen,
    setUserDocsModalOpen,
    userDocuments,
    addUserDocument,
    deleteUserDocument,
    useMockMode,
  } = useLegalStore();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [docType, setDocType] = useState('Văn bản quy phạm');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isUserDocsModalOpen) return null;

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSet(e.dataTransfer.files[0]);
    }
  };

  const validateAndSet = (file: File) => {
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext === 'pdf' || ext === 'docx') {
      setSelectedFile(file);
      setUploadSuccess(null);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || isUploading) return;

    setIsUploading(true);
    setUploadSuccess(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('doc_type', docType);
      formData.append('doc_code', selectedFile.name.replace(/\.[^/.]+$/, ''));
      formData.append('effective_date', new Date().toISOString().split('T')[0]);

      const res = await uploadDocument(formData, useMockMode);

      addUserDocument({
        id: `doc-${Date.now()}`,
        name: selectedFile.name,
        size: `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`,
        uploaded_at: new Date().toISOString(),
        chunks_count: res.chunks_indexed || 24,
        doc_type: docType,
        doc_code: res.doc_code,
        status: 'indexed',
      });

      setSelectedFile(null);
      setUploadSuccess(`Đã nạp thành công "${selectedFile.name}" vào kho tìm kiếm vector.`);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
              <FolderOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900">Kho tài liệu của bạn</h3>
              <p className="text-xs text-slate-500">
                Các văn bản pháp luật, nghị định, hồ sơ đã tải lên phục vụ tra cứu
              </p>
            </div>
          </div>

          <button
            onClick={() => setUserDocsModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Quick Upload Dropzone */}
          <form onSubmit={handleUpload} className="space-y-3">
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleFileDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
                selectedFile
                  ? 'border-blue-500 bg-blue-50/30'
                  : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx"
                onChange={(e) => e.target.files?.[0] && validateAndSet(e.target.files[0])}
                className="hidden"
              />

              {selectedFile ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-left">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-900">{selectedFile.name}</div>
                      <div className="text-xs text-slate-500">
                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isUploading}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUpload(e);
                    }}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Đang nạp...</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>Tải lên ngay</span>
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <UploadCloud className="w-6 h-6 text-slate-400 mx-auto" />
                  <div className="text-xs font-medium text-slate-700">
                    Kéo thả tài liệu vào đây, hoặc <span className="text-blue-600 font-semibold">chọn từ máy tính</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Hỗ trợ file văn bản .PDF, .DOCX để tự động trích xuất và nhúng vector
                  </div>
                </div>
              )}
            </div>

            {uploadSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{uploadSuccess}</span>
              </div>
            )}
          </form>

          {/* Documents List */}
          <div className="space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center justify-between">
              <span>Danh sách tài liệu đã nạp ({userDocuments.length})</span>
            </div>

            {userDocuments.length === 0 ? (
              <div className="text-center py-10 text-xs text-slate-400">
                Chưa có tài liệu nào. Hãy tải tài liệu đầu tiên lên để hệ thống phân tích.
              </div>
            ) : (
              <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden bg-white">
                {userDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-3.5 flex items-center justify-between gap-3 hover:bg-slate-50/80 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-slate-800 truncate">{doc.name}</div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                          <span>{doc.size}</span>
                          <span>•</span>
                          <span>{doc.chunks_count} đoạn điều khoản</span>
                          <span>•</span>
                          <span>{formatSimpleDate(doc.uploaded_at)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" />
                        Đã lập chỉ mục
                      </span>

                      <button
                        onClick={() => deleteUserDocument(doc.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Xóa tài liệu này"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
