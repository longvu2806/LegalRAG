'use client';

import React from 'react';
import { Scale, Car, Home, Briefcase, ArrowUpRight } from 'lucide-react';
import { useLegalStore } from '@/stores/useLegalStore';

export const WelcomeState: React.FC = () => {
  const { sendQuery } = useLegalStore();

  const suggestions = [
    {
      icon: <Car className="w-4 h-4 text-blue-600" />,
      title: 'Mức phạt nồng độ cồn kịch khung',
      description: 'Quy định đối với xe ô tô theo Nghị định 100 và Nghị định 123',
      query: 'Mức phạt nồng độ cồn kịch khung đối với người điều khiển xe ô tô theo Nghị định 100 và Nghị định 123 hiện nay là bao nhiêu?',
    },
    {
      icon: <Car className="w-4 h-4 text-blue-600" />,
      title: 'Nồng độ cồn xe máy trên 0,4 mg/l',
      description: 'Mức phạt tiền và thời hạn tước giấy phép lái xe',
      query: 'Điều khiển xe máy mà nồng độ cồn vượt quá 0,4 miligam/lít khí thở thì bị xử phạt tiền và tước giấy phép lái xe bao lâu?',
    },
    {
      icon: <Home className="w-4 h-4 text-emerald-600" />,
      title: 'Hiệu lực mua bán đất viết tay',
      description: 'Điều kiện công chứng và rủi ro theo Luật Đất đai 2024',
      query: 'Hợp đồng chuyển nhượng quyền sử dụng đất viết tay không công chứng có giá trị pháp lý theo Luật Đất đai 2024 không?',
    },
    {
      icon: <Briefcase className="w-4 h-4 text-purple-600" />,
      title: 'Đơn phương chấm dứt hợp đồng',
      description: 'Căn cứ áp dụng của doanh nghiệp theo Bộ luật Lao động 2019',
      query: 'Người sử dụng lao động được quyền đơn phương chấm dứt hợp đồng lao động trong những trường hợp nào theo Bộ luật Lao động 2019?',
    },
  ];

  return (
    <div className="max-w-2xl mx-auto py-16 px-4 text-center space-y-8">
      {/* Hero Icon & Title */}
      <div className="space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto border border-blue-100 shadow-xs">
          <Scale className="w-6 h-6" />
        </div>
        <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">
          Hỏi đáp & Tra cứu Pháp lý
        </h1>
        <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
          Tra cứu nhanh các quy định, điều luật hiện hành và nhận lập luận suy diễn pháp lý có căn cứ chính xác.
        </p>
      </div>

      {/* Suggestion Cards */}
      <div className="grid sm:grid-cols-2 gap-3 text-left">
        {suggestions.map((item, idx) => (
          <button
            key={idx}
            onClick={() => sendQuery(item.query)}
            className="group p-4 rounded-xl bg-slate-50/80 hover:bg-slate-100/90 border border-slate-200/80 text-left transition-all hover:shadow-xs flex flex-col justify-between space-y-3"
          >
            <div className="flex items-center justify-between w-full">
              <div className="p-1.5 rounded-lg bg-white border border-slate-200/60">
                {item.icon}
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
            </div>

            <div>
              <div className="text-xs font-semibold text-slate-800 leading-snug">
                {item.title}
              </div>
              <div className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                {item.description}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
