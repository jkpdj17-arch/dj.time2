'use client';

import React from 'react';
import {
  X,
  Clock,
  BookOpen,
  Coffee,
  Utensils,
  BellRing,
  Info,
  CheckCircle2,
} from 'lucide-react';
import {
  STANDARD_BELL_SCHEDULE,
  PeriodSlot,
  getCurrentPeriodStatus,
  DAEJIN_SCHOOL_INFO,
} from '@/lib/school-info';

interface PeriodScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PeriodScheduleModal({ isOpen, onClose }: PeriodScheduleModalProps) {
  if (!isOpen) return null;

  const currentStatus = getCurrentPeriodStatus(new Date());
  const activeSlot = currentStatus.activeSlot;

  const getSlotBadge = (type: PeriodSlot['type']) => {
    switch (type) {
      case 'class':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
            <BookOpen className="w-3.5 h-3.5" /> 정규 수업 (50분)
          </span>
        );
      case 'break':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-100">
            <Coffee className="w-3.5 h-3.5" /> 쉬는 시간 (10분)
          </span>
        );
      case 'lunch':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
            <Utensils className="w-3.5 h-3.5" /> 점심 및 급식 (60분)
          </span>
        );
      case 'morning':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
            <BellRing className="w-3.5 h-3.5" /> 아침 조회 (20분)
          </span>
        );
      case 'dismissal':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full">
            종례 및 청소 (30분)
          </span>
        );
      case 'afterschool':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-100">
            방과후/동아리
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                {DAEJIN_SCHOOL_INFO.schoolName} 표준 일과표
              </h3>
              <p className="text-xs text-slate-500">
                교시별 시작 및 종료 시간 상세 안내 (월~금 정규 일과)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            aria-label="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Table */}
        <div className="overflow-y-auto p-4 sm:p-6 space-y-4">
          <div className="flex items-center gap-2 p-3 bg-blue-50/60 border border-blue-100 rounded-xl text-xs text-blue-900">
            <Info className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              대진전자통신고등학교는 1교시 08:50 시작, 7교시 16:30 종료(점심 12:40~13:40)로 운영됩니다.
            </span>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-semibold">
                  <th className="py-2.5 px-3 sm:px-4">구분</th>
                  <th className="py-2.5 px-3 sm:px-4">시작 시간</th>
                  <th className="py-2.5 px-3 sm:px-4">종료 시간</th>
                  <th className="py-2.5 px-3 sm:px-4">소요 시간</th>
                  <th className="py-2.5 px-3 sm:px-4 hidden sm:table-cell">유형</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {STANDARD_BELL_SCHEDULE.map((slot) => {
                  const isActive = activeSlot?.name === slot.name;
                  const isBreak = slot.type === 'break';

                  return (
                    <tr
                      key={slot.startTime + slot.name}
                      className={`transition-colors ${
                        isActive
                          ? 'bg-blue-50 font-semibold text-blue-950 border-l-4 border-l-blue-600'
                          : isBreak
                          ? 'bg-slate-50/50 text-slate-500'
                          : 'hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      <td className="py-2.5 px-3 sm:px-4 font-medium flex items-center gap-1.5">
                        {isActive && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        )}
                        <span>{slot.name}</span>
                      </td>
                      <td className="py-2.5 px-3 sm:px-4 font-mono font-semibold text-blue-700">
                        {slot.startTime}
                      </td>
                      <td className="py-2.5 px-3 sm:px-4 font-mono font-semibold text-slate-700">
                        {slot.endTime}
                      </td>
                      <td className="py-2.5 px-3 sm:px-4 text-slate-600">
                        {slot.durationMinutes}분
                      </td>
                      <td className="py-2.5 px-3 sm:px-4 hidden sm:table-cell">
                        {getSlotBadge(slot.type)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            학교 전화: {DAEJIN_SCHOOL_INFO.phone} (교무실)
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-all"
          >
            확인 및 닫기
          </button>
        </div>
      </div>
    </div>
  );
}
