'use client';

import React, { useState, useEffect } from 'react';
import { Header, NavTab } from '@/components/Header';
import { LivePeriodBanner } from '@/components/LivePeriodBanner';
import { TimetableSection } from '@/components/TimetableSection';
import { HomeworkSubmitSection } from '@/components/HomeworkSubmitSection';
import { HomeworkListSection } from '@/components/HomeworkListSection';
import { PeriodScheduleModal } from '@/components/PeriodScheduleModal';
import { SchoolInfoFooter } from '@/components/SchoolInfoFooter';
import { getStoredSubmissions } from '@/lib/homework-storage';
import {
  STANDARD_BELL_SCHEDULE,
  DAEJIN_SCHOOL_INFO,
  CLASS_DEPARTMENTS,
  ALLOWED_CLASSES,
} from '@/lib/school-info';
import {
  CalendarDays,
  Clock,
  UploadCloud,
  FileCheck2,
  BookOpen,
  CheckCircle2,
  Info,
  Layers,
  ArrowRight,
} from 'lucide-react';

export default function HomePage() {
  const [currentTab, setCurrentTab] = useState<NavTab>('timetable');
  const [selectedGrade, setSelectedGrade] = useState<number>(1);
  const [selectedClass, setSelectedClass] = useState<number>(1);
  const [submitSubject, setSubmitSubject] = useState<string>('');
  const [submitTaskId, setSubmitTaskId] = useState<string | undefined>(undefined);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState<boolean>(false);
  const [submissionCount, setSubmissionCount] = useState<number>(0);

  // Update submission count
  const updateCount = () => {
    const list = getStoredSubmissions();
    setSubmissionCount(list.length);
  };

  useEffect(() => {
    updateCount();
  }, [currentTab]);

  // Handler for quick submit from timetable period card
  const handleQuickSubmit = (grade: number, classNum: number, subject: string) => {
    setSelectedGrade(grade);
    setSelectedClass(classNum);
    setSubmitSubject(subject);
    setSubmitTaskId(undefined);
    setCurrentTab('submit');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handler for submit from task notice card
  const handleTaskSubmit = (
    grade?: number,
    classNum?: number,
    subject?: string,
    taskId?: string
  ) => {
    if (grade) setSelectedGrade(grade);
    if (classNum) setSelectedClass(classNum);
    if (subject) setSubmitSubject(subject);
    setSubmitTaskId(taskId);
    setCurrentTab('submit');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmissionSuccess = () => {
    updateCount();
    setCurrentTab('list');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white">
      {/* Top Header */}
      <Header
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        submissionCount={submissionCount}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Real-time Bell & Period Tracker Banner */}
        <LivePeriodBanner
          onOpenScheduleModal={() => setIsScheduleModalOpen(true)}
        />

        {/* Tab 1: Timetable Section */}
        {currentTab === 'timetable' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                  {DAEJIN_SCHOOL_INFO.schoolName} 학년·학급별 시간표
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  1~3학년 및 1반~10반 교시별(08:50 ~ 16:30) 시작·종료 시간과 과목 편성표를 확인하세요.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentTab('submit')}
                  className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>과제 올리기</span>
                </button>
              </div>
            </div>

            <TimetableSection
              selectedGrade={selectedGrade}
              onGradeChange={setSelectedGrade}
              selectedClass={selectedClass}
              onClassChange={setSelectedClass}
              onQuickSubmit={handleQuickSubmit}
            />
          </div>
        )}

        {/* Tab 2: Full Bell Schedule Breakdown */}
        {currentTab === 'schedule' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                  <Clock className="w-6 h-6 text-blue-600" />
                  <span>대진전자통신고 교시별 시작 및 종료 시간 일과표</span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  1교시부터 7교시까지 매 교시의 정확한 시작 시각과 끝나는 시각, 점심시간 및 쉬는시간 일과표입니다.
                </p>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-100">
                  <span className="text-xs text-blue-600 font-medium">1교시 시작</span>
                  <p className="text-lg font-bold text-blue-950 font-mono mt-0.5">08:50</p>
                  <span className="text-[11px] text-blue-500">아침조회 08:30~08:50</span>
                </div>

                <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-100">
                  <span className="text-xs text-emerald-600 font-medium">점심 시간</span>
                  <p className="text-lg font-bold text-emerald-950 font-mono mt-0.5">12:40 ~ 13:40</p>
                  <span className="text-[11px] text-emerald-600">60분 급식 & 휴식</span>
                </div>

                <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-100">
                  <span className="text-xs text-indigo-600 font-medium">7교시 종료</span>
                  <p className="text-lg font-bold text-indigo-950 font-mono mt-0.5">16:30</p>
                  <span className="text-[11px] text-indigo-500">종례 및 청소 16:30~17:00</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-100 border border-slate-200">
                  <span className="text-xs text-slate-600 font-medium">수업 및 휴식</span>
                  <p className="text-lg font-bold text-slate-900 font-mono mt-0.5">50분 / 10분</p>
                  <span className="text-[11px] text-slate-500">정규 7교시 편성</span>
                </div>
              </div>

              {/* Complete Schedule Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold">
                      <th className="py-3 px-4">교시 / 구분</th>
                      <th className="py-3 px-4">시작 시각</th>
                      <th className="py-3 px-4">종료 시각</th>
                      <th className="py-3 px-4">수업·휴식 시간</th>
                      <th className="py-3 px-4 hidden sm:table-cell">상세 비고</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {STANDARD_BELL_SCHEDULE.map((slot) => {
                      const isBreak = slot.type === 'break';
                      const isLunch = slot.type === 'lunch';
                      const isClass = slot.type === 'class';

                      return (
                        <tr
                          key={slot.startTime + slot.name}
                          className={`hover:bg-slate-50 transition-colors ${
                            isLunch
                              ? 'bg-emerald-50/40 font-semibold text-emerald-950'
                              : isBreak
                              ? 'bg-slate-50/60 text-slate-500'
                              : isClass
                              ? 'text-slate-800'
                              : 'text-slate-700'
                          }`}
                        >
                          <td className="py-3 px-4 font-semibold">{slot.name}</td>
                          <td className="py-3 px-4 font-mono font-bold text-blue-700">
                            {slot.startTime}
                          </td>
                          <td className="py-3 px-4 font-mono font-bold text-slate-700">
                            {slot.endTime}
                          </td>
                          <td className="py-3 px-4">{slot.durationMinutes}분</td>
                          <td className="py-3 px-4 text-slate-500 hidden sm:table-cell">
                            {isClass
                              ? `${slot.shortName} 전공 및 일반 교과 수업`
                              : isLunch
                              ? '학교 식당 급식 및 자율 휴식'
                              : isBreak
                              ? '교과 교실 이동 및 쉬는 시간'
                              : slot.name}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Homework Submit Section */}
        {currentTab === 'submit' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <HomeworkSubmitSection
              initialGrade={selectedGrade}
              initialClass={selectedClass}
              initialSubject={submitSubject}
              initialTaskId={submitTaskId}
              onSubmissionSuccess={handleSubmissionSuccess}
            />
          </div>
        )}

        {/* Tab 4: Homework List Section */}
        {currentTab === 'list' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <HomeworkListSection onGoToSubmit={handleTaskSubmit} />
          </div>
        )}
      </main>

      {/* Bell Schedule Modal */}
      <PeriodScheduleModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
      />

      {/* School Information Footer */}
      <SchoolInfoFooter />
    </div>
  );
}
