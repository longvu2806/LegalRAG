import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { StatuteStatus } from '@/types/legal';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return dateString;
  }
}

export function formatSimpleDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
}

export function getStatusDetails(status: StatuteStatus) {
  switch (status) {
    case 'active':
      return {
        label: 'Còn hiệu lực',
        bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
        dot: 'bg-emerald-500',
      };
    case 'amended':
      return {
        label: 'Sửa đổi/Bổ sung',
        bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
        dot: 'bg-amber-500',
      };
    case 'expired':
      return {
        label: 'Hết hiệu lực',
        bg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30',
        dot: 'bg-rose-500',
      };
    default:
      return {
        label: 'Không xác định',
        bg: 'bg-slate-500/10 text-slate-500 border-slate-500/30',
        dot: 'bg-slate-400',
      };
  }
}
