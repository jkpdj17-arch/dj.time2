'use client';

import React from 'react';
import {
  CalendarDays,
  Clock,
  FileCheck2,
  UploadCloud,
  GraduationCap,
} from 'lucide-react';
import { DAEJIN_SCHOOL_INFO } from '@/lib/school-info';

export type NavTab = 'timetable' | 'schedule' | 'submit' | 'list';

interface HeaderProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  submissionCount: number;
}

export function Header({ currentTab, onTabChange, submissionCount }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Brand Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20 shrink-0">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 tracking-tight text-base sm:text-lg">
                  {DAEJIN_SCHOOL_INFO.schoolName}
                </span>
                <span className="hidden sm:inline-block text-xs font-semibold px-2 py-0.5 rounded-sm bg-blue-50 text-blue-700 border border-blue-100">
                  NEIS 연동
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                학년·학급별(1~10반) 시간표 & 교시 알리미 & 과제 포털
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60">
            <button
              onClick={() => onTabChange('timetable')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
                currentTab === 'timetable'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CalendarDays className="w-4 h-4" />
              <span>시간표 조회</span>
            </button>

            <button
              onClick={() => onTabChange('schedule')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
                currentTab === 'schedule'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>교시 시작·종료 일과표</span>
            </button>

            <button
              onClick={() => onTabChange('submit')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
                currentTab === 'submit'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UploadCloud className="w-4 h-4" />
              <span>과제 올리기</span>
            </button>

            <button
              onClick={() => onTabChange('list')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all relative ${
                currentTab === 'list'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileCheck2 className="w-4 h-4" />
              <span>제출된 과제함</span>
              {submissionCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[11px] font-bold flex items-center justify-center ml-0.5">
                  {submissionCount}
                </span>
              )}
            </button>
          </nav>

          {/* Right Action / Mobile quick status */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onTabChange('submit')}
              className="md:hidden flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 text-white active:scale-95 transition-all shadow-xs"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>과제 올리기</span>
            </button>
            <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-500 pl-2 border-l border-slate-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>NEIS API 연동 가동 중</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Tab Bar */}
      <div className="md:hidden flex items-center justify-around px-2 py-1.5 bg-slate-50 border-t border-slate-200/80">
        <button
          onClick={() => onTabChange('timetable')}
          className={`flex-1 py-1.5 px-2 text-center text-xs font-medium rounded-lg flex flex-col items-center gap-1 transition-colors ${
            currentTab === 'timetable'
              ? 'text-blue-700 font-semibold bg-white shadow-xs'
              : 'text-slate-600'
          }`}
        >
          <CalendarDays className="w-4 h-4" />
          <span>시간표</span>
        </button>

        <button
          onClick={() => onTabChange('schedule')}
          className={`flex-1 py-1.5 px-2 text-center text-xs font-medium rounded-lg flex flex-col items-center gap-1 transition-colors ${
            currentTab === 'schedule'
              ? 'text-blue-700 font-semibold bg-white shadow-xs'
              : 'text-slate-600'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>일과시간</span>
        </button>

        <button
          onClick={() => onTabChange('submit')}
          className={`flex-1 py-1.5 px-2 text-center text-xs font-medium rounded-lg flex flex-col items-center gap-1 transition-colors ${
            currentTab === 'submit'
              ? 'text-blue-700 font-semibold bg-white shadow-xs'
              : 'text-slate-600'
          }`}
        >
          <UploadCloud className="w-4 h-4" />
          <span>과제제출</span>
        </button>

        <button
          onClick={() => onTabChange('list')}
          className={`flex-1 py-1.5 px-2 text-center text-xs font-medium rounded-lg flex flex-col items-center gap-1 transition-colors relative ${
            currentTab === 'list'
              ? 'text-blue-700 font-semibold bg-white shadow-xs'
              : 'text-slate-600'
          }`}
        >
          <FileCheck2 className="w-4 h-4" />
          <span>과제함</span>
          {submissionCount > 0 && (
            <span className="absolute top-1 right-2 w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">
              {submissionCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
