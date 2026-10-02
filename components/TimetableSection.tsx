'use client';

import React, { useState, useEffect } from 'react';
import {
  CalendarDays,
  Clock,
  BookOpen,
  Send,
  RefreshCw,
  Sparkles,
  Layers,
  CheckCircle,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import {
  ALLOWED_CLASSES,
  ALLOWED_GRADES,
  CLASS_DEPARTMENTS,
  getCurrentPeriodStatus,
} from '@/lib/school-info';
import {
  WeeklyTimetableResult,
  DayTimetable,
  TimetablePeriodItem,
  getStandardCurriculumTimetable,
  PERIOD_TIMES,
} from '@/lib/curriculum-data';

interface TimetableSectionProps {
  selectedGrade: number;
  onGradeChange: (g: number) => void;
  selectedClass: number;
  onClassChange: (c: number) => void;
  onQuickSubmit: (grade: number, classNum: number, subject: string) => void;
}

export function TimetableSection({
  selectedGrade,
  onGradeChange,
  selectedClass,
  onClassChange,
  onQuickSubmit,
}: TimetableSectionProps) {
  const [timetable, setTimetable] = useState<WeeklyTimetableResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeDayTab, setActiveDayTab] = useState<number>(() => {
    const day = new Date().getDay();
    return day >= 1 && day <= 5 ? day : 1;
  });
  const [viewMode, setViewMode] = useState<'weekly' | 'daily'>('weekly');
  const [currentPeriodNum, setCurrentPeriodNum] = useState<number | null>(null);

  // Load timetable from API route
  const fetchTimetable = async (grade: number, classNum: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/timetable?grade=${grade}&classNm=${classNum}`);
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          setTimetable(json.data);
          setLoading(false);
          return;
        }
      }
    } catch (err) {
      console.warn('API error, using local fallback:', err);
    }
    // Fallback
    setTimetable(getStandardCurriculumTimetable(grade, classNum));
    setLoading(false);
  };

  useEffect(() => {
    fetchTimetable(selectedGrade, selectedClass);
  }, [selectedGrade, selectedClass]);

  // Track current period
  useEffect(() => {
    const updatePeriod = () => {
      const status = getCurrentPeriodStatus(new Date());
      if (status.activeSlot && status.activeSlot.type === 'class') {
        setCurrentPeriodNum(status.activeSlot.period);
      } else {
        setCurrentPeriodNum(null);
      }
    };
    updatePeriod();
    const interval = setInterval(updatePeriod, 5000);
    return () => clearInterval(interval);
  }, []);

  const departmentName = CLASS_DEPARTMENTS[selectedClass] || '스마트전자과';

  return (
    <section className="space-y-6">
      {/* Top Filter Controls: Grade & Class Bar (Strictly 1~10반) */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-4">
        {/* Grade Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              학년 선택
            </span>
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
              {ALLOWED_GRADES.map((g) => (
                <button
                  key={g}
                  onClick={() => onGradeChange(g)}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    selectedGrade === g
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                  }`}
                >
                  {g}학년
                </button>
              ))}
            </div>
          </div>

          {/* Department badge & View mode toggle */}
          <div className="flex items-center justify-between sm:justify-end gap-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-100 text-blue-800 text-xs font-medium">
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              <span>{departmentName}</span>
            </div>

            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
              <button
                onClick={() => setViewMode('weekly')}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
                  viewMode === 'weekly'
                    ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                주간 전체
              </button>
              <button
                onClick={() => setViewMode('daily')}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
                  viewMode === 'daily'
                    ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                요일별
              </button>
            </div>
          </div>
        </div>

        {/* Class Selector Bar: 1반 ~ 10반 Only (User requirement: 10반 까지만) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              학급 선택 (1반 ~ 10반)
            </span>
            <span className="text-xs text-slate-400">
              현재 선택: <strong className="text-blue-600 font-bold">{selectedGrade}학년 {selectedClass}반</strong>
            </span>
          </div>

          <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5">
            {ALLOWED_CLASSES.map((c) => {
              const isSelected = selectedClass === c;
              return (
                <button
                  key={c}
                  onClick={() => onClassChange(c)}
                  className={`py-2 px-1 text-center rounded-xl text-xs font-bold transition-all border ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs scale-102'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/80 hover:border-slate-300'
                  }`}
                >
                  <span className="block text-sm">{c}반</span>
                  <span
                    className={`block text-[10px] font-normal truncate mt-0.5 ${
                      isSelected ? 'text-blue-100' : 'text-slate-400'
                    }`}
                  >
                    {c <= 3 ? '전자' : c <= 6 ? '통신' : c <= 8 ? 'SW' : 'AI'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Timetable Display Area */}
      {loading ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-700">
            {selectedGrade}학년 {selectedClass}반 NEIS 시간표를 불러오는 중입니다...
          </p>
        </div>
      ) : !timetable ? null : viewMode === 'weekly' ? (
        /* Weekly Grid View */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          {/* Grid Header Info */}
          <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">
                {selectedGrade}학년 {selectedClass}반 주간 시간표 ({timetable.department})
              </h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-medium border border-emerald-200/60">
                {timetable.source === 'neis' ? 'NEIS 실시간' : '정규 편성표'}
              </span>
            </div>

            <button
              onClick={() => fetchTimetable(selectedGrade, selectedClass)}
              className="text-xs text-slate-500 hover:text-blue-600 flex items-center gap-1 font-medium"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>새로고침</span>
            </button>
          </div>

          {/* 5-Day Weekly Grid for Desktop & Horizontal Scroll for Mobile */}
          <div className="overflow-x-auto">
            <div className="min-w-[700px] grid grid-cols-5 divide-x divide-slate-200">
              {timetable.days.map((day) => {
                const isToday = new Date().getDay() === day.dayOfWeek;

                return (
                  <div key={day.dayOfWeek} className="flex flex-col">
                    {/* Day Column Header */}
                    <div
                      className={`p-3 text-center border-b border-slate-200 ${
                        isToday ? 'bg-blue-50/80 text-blue-900 font-bold' : 'bg-slate-100/70 text-slate-700'
                      }`}
                    >
                      <div className="text-sm font-bold flex items-center justify-center gap-1">
                        <span>{day.dayName}</span>
                        {isToday && (
                          <span className="text-[10px] bg-blue-600 text-white px-1.5 py-0.2 rounded-full">
                            오늘
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-500 font-normal">
                        1~7교시 (08:50 ~ 16:30)
                      </span>
                    </div>

                    {/* Periods 1~7 */}
                    <div className="p-2 space-y-2 flex-1 bg-slate-50/30">
                      {day.periods.map((item) => {
                        const isCurrentPeriod = isToday && currentPeriodNum === item.period;
                        const isVocational = item.category === 'vocational';
                        const isActivity = item.category === 'activity';

                        return (
                          <div
                            key={item.period}
                            className={`p-2.5 rounded-xl border transition-all relative group ${
                              isCurrentPeriod
                                ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-300'
                                : isVocational
                                ? 'bg-white hover:bg-blue-50/40 border-blue-100/80 shadow-2xs'
                                : isActivity
                                ? 'bg-amber-50/40 hover:bg-amber-50/70 border-amber-100'
                                : 'bg-white hover:bg-slate-50 border-slate-200/80 shadow-2xs'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span
                                className={`text-[11px] font-bold ${
                                  isCurrentPeriod ? 'text-blue-100' : 'text-slate-400'
                                }`}
                              >
                                {item.period}교시
                              </span>
                              {/* Start and End Time Display */}
                              <span
                                className={`text-[11px] font-mono font-medium ${
                                  isCurrentPeriod ? 'text-blue-100' : 'text-slate-500'
                                }`}
                              >
                                {item.startTime}~{item.endTime}
                              </span>
                            </div>

                            <div className="my-1">
                              <span
                                className={`text-xs font-bold block truncate ${
                                  isCurrentPeriod ? 'text-white' : 'text-slate-900'
                                }`}
                              >
                                {item.subject}
                              </span>
                              <span
                                className={`text-[10px] block ${
                                  isCurrentPeriod
                                    ? 'text-blue-200'
                                    : isVocational
                                    ? 'text-blue-600 font-medium'
                                    : isActivity
                                    ? 'text-amber-600 font-medium'
                                    : 'text-slate-400'
                                }`}
                              >
                                {isVocational ? '전공 실무' : isActivity ? '창체 활동' : '일반 교과'}
                              </span>
                            </div>

                            {/* Quick Submit Button */}
                            <button
                              onClick={() =>
                                onQuickSubmit(selectedGrade, selectedClass, item.subject)
                              }
                              className={`mt-1.5 w-full py-1 px-1.5 rounded-lg text-[10px] font-semibold flex items-center justify-center gap-1 transition-colors ${
                                isCurrentPeriod
                                  ? 'bg-white text-blue-700 hover:bg-blue-50'
                                  : 'bg-slate-100 hover:bg-blue-600 text-slate-700 hover:text-white'
                              }`}
                            >
                              <Send className="w-3 h-3" />
                              <span>과제 올리기</span>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* Daily View (Mobile Optimized Tabs) */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          {/* Day Selector Tabs */}
          <div className="p-2 bg-slate-100 flex items-center justify-between gap-1 border-b border-slate-200">
            {timetable.days.map((day) => {
              const isSelected = activeDayTab === day.dayOfWeek;
              const isToday = new Date().getDay() === day.dayOfWeek;

              return (
                <button
                  key={day.dayOfWeek}
                  onClick={() => setActiveDayTab(day.dayOfWeek)}
                  className={`flex-1 py-2 px-1 text-center rounded-xl text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-white text-blue-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>{day.shortDay}요일</span>
                  {isToday && (
                    <span className="block text-[9px] text-blue-500 font-normal">
                      오늘
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Active Day Period Cards */}
          {(() => {
            const currentDayData =
              timetable.days.find((d) => d.dayOfWeek === activeDayTab) || timetable.days[0];
            const isToday = new Date().getDay() === currentDayData.dayOfWeek;

            return (
              <div className="p-4 sm:p-6 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h4 className="text-sm font-bold text-slate-800">
                    {currentDayData.dayName} 일과 시간표 ({selectedGrade}학년 {selectedClass}반)
                  </h4>
                  <span className="text-xs text-slate-500">
                    총 7교시 (08:50 ~ 16:30)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentDayData.periods.map((item) => {
                    const isCurrentPeriod = isToday && currentPeriodNum === item.period;
                    const isVocational = item.category === 'vocational';

                    return (
                      <div
                        key={item.period}
                        className={`p-4 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                          isCurrentPeriod
                            ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-300'
                            : 'bg-white hover:bg-slate-50/80 border-slate-200 shadow-2xs'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                              isCurrentPeriod
                                ? 'bg-white/20 text-white'
                                : 'bg-blue-50 text-blue-700'
                            }`}
                          >
                            {item.period}
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <h5
                                className={`text-sm font-bold ${
                                  isCurrentPeriod ? 'text-white' : 'text-slate-900'
                                }`}
                              >
                                {item.subject}
                              </h5>
                              <span
                                className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                                  isCurrentPeriod
                                    ? 'bg-white/20 text-blue-100'
                                    : isVocational
                                    ? 'bg-blue-50 text-blue-700'
                                    : 'bg-slate-100 text-slate-600'
                                }`}
                              >
                                {isVocational ? '전공' : '일반'}
                              </span>
                            </div>

                            {/* Start and End Time clearly told */}
                            <p
                              className={`text-xs font-mono mt-0.5 ${
                                isCurrentPeriod ? 'text-blue-100' : 'text-slate-500'
                              }`}
                            >
                              시작: {item.startTime} ~ 종료: {item.endTime} (50분 수업)
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() =>
                            onQuickSubmit(selectedGrade, selectedClass, item.subject)
                          }
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 flex items-center gap-1 transition-all ${
                            isCurrentPeriod
                              ? 'bg-white text-blue-700 hover:bg-blue-50 shadow-xs'
                              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                          }`}
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>과제 올리기</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </section>
  );
}
