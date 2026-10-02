'use client';

import React, { useState, useEffect } from 'react';
import {
  Clock,
  BellRing,
  Sparkles,
  Coffee,
  Utensils,
  BookOpen,
  ArrowRight,
  ListChecks,
} from 'lucide-react';
import {
  getCurrentPeriodStatus,
  CurrentPeriodStatus,
  STANDARD_BELL_SCHEDULE,
} from '@/lib/school-info';

interface LivePeriodBannerProps {
  onOpenScheduleModal: () => void;
}

export function LivePeriodBanner({ onOpenScheduleModal }: LivePeriodBannerProps) {
  const [status, setStatus] = useState<CurrentPeriodStatus | null>(null);
  const [currentTimeStr, setCurrentTimeStr] = useState<string>('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setStatus(getCurrentPeriodStatus(now));
      setCurrentTimeStr(
        now.toLocaleTimeString('ko-KR', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        })
      );
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!status) return null;

  const { activeSlot, nextSlot, remainingSeconds, progressPercent } = status;
  const remMinutes = Math.floor(remainingSeconds / 60);
  const remSecs = remainingSeconds % 60;

  const getSlotIcon = (type?: string) => {
    switch (type) {
      case 'class':
        return <BookOpen className="w-5 h-5 text-blue-600" />;
      case 'break':
        return <Coffee className="w-5 h-5 text-amber-600" />;
      case 'lunch':
        return <Utensils className="w-5 h-5 text-emerald-600" />;
      case 'morning':
        return <BellRing className="w-5 h-5 text-indigo-600" />;
      default:
        return <Clock className="w-5 h-5 text-slate-600" />;
    }
  };

  return (
    <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-2xl p-4 sm:p-6 shadow-md border border-blue-900/40 relative overflow-hidden">
      {/* Background glow styling */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-8 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left: Current period status */}
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-2 text-xs text-blue-200">
            <span className="font-mono bg-blue-900/60 px-2 py-0.5 rounded text-blue-300 font-semibold tracking-wider">
              {currentTimeStr || '00:00:00'} KST
            </span>
            <span>·</span>
            <span>대진전자통신고 일과 알리미</span>
            {activeSlot && (
              <>
                <span>·</span>
                <span className="font-medium text-emerald-400">
                  {activeSlot.startTime} ~ {activeSlot.endTime} (
                  {activeSlot.durationMinutes}분)
                </span>
              </>
            )}
          </div>

          <div className="flex items-start sm:items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 shrink-0">
              {getSlotIcon(activeSlot?.type)}
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
                {activeSlot ? (
                  <>
                    <span>{activeSlot.name}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 font-normal">
                      {activeSlot.startTime} 시작 · {activeSlot.endTime} 종료
                    </span>
                  </>
                ) : (
                  <span>정규 수업 일과 시간 외</span>
                )}
              </h2>

              <p className="text-sm text-slate-300 mt-0.5">
                {status.statusText}
              </p>
            </div>
          </div>

          {/* Progress bar when in active slot */}
          {activeSlot && (
            <div className="mt-3.5 max-w-xl">
              <div className="flex justify-between items-center text-xs text-blue-200/80 mb-1 font-mono">
                <span>{activeSlot.startTime}</span>
                <span className="font-semibold text-blue-300">
                  {remMinutes}분 {remSecs < 10 ? `0${remSecs}` : remSecs}초 남음 ({progressPercent}%)
                </span>
                <span>{activeSlot.endTime}</span>
              </div>
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-blue-400 to-indigo-300 rounded-full transition-all duration-1000 ease-linear"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Right: Next period & Action buttons */}
        <div className="flex flex-row sm:flex-col lg:flex-row items-center gap-2.5 pt-3 lg:pt-0 border-t lg:border-t-0 border-white/10 shrink-0">
          {nextSlot && (
            <div className="hidden sm:block text-right px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
              <span className="text-[11px] text-slate-400 block">다음 교시</span>
              <span className="text-xs font-semibold text-blue-200">
                {nextSlot.name} ({nextSlot.startTime} ~ {nextSlot.endTime})
              </span>
            </div>
          )}

          <button
            onClick={onOpenScheduleModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 text-xs font-semibold text-white transition-all border border-white/15 cursor-pointer whitespace-nowrap"
          >
            <ListChecks className="w-4 h-4 text-blue-300" />
            <span>전체 일과표 보기 (1~7교시)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
