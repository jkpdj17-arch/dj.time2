'use client';

import React from 'react';
import {
  School,
  Phone,
  Printer,
  MapPin,
  Globe,
  CheckCircle2,
  GraduationCap,
} from 'lucide-react';
import { DAEJIN_SCHOOL_INFO } from '@/lib/school-info';

export function SchoolInfoFooter() {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs mt-16 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-slate-800">
          {/* Col 1: School Identity */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-base">
              <GraduationCap className="w-5 h-5 text-blue-400" />
              <span>{DAEJIN_SCHOOL_INFO.schoolName}</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              {DAEJIN_SCHOOL_INFO.englishName}
              <br />
              {DAEJIN_SCHOOL_INFO.officeName} 지정 {DAEJIN_SCHOOL_INFO.schoolType} (1995년 개교)
            </p>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>NEIS 표준 학교코드: {DAEJIN_SCHOOL_INFO.schoolCode} (C10)</span>
            </div>
          </div>

          {/* Col 2: Contact & Location */}
          <div className="space-y-2.5">
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider">
              학교 안내 및 위치
            </h4>
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <span>
                우편번호 {DAEJIN_SCHOOL_INFO.postalCode}
                <br />
                {DAEJIN_SCHOOL_INFO.address}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-blue-400 shrink-0" />
              <span>대표전화: {DAEJIN_SCHOOL_INFO.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Printer className="w-4 h-4 text-blue-400 shrink-0" />
              <span>팩스: {DAEJIN_SCHOOL_INFO.fax}</span>
            </div>
          </div>

          {/* Col 3: System & NEIS Info */}
          <div className="space-y-2.5">
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider">
              시스템 연동 정보
            </h4>
            <p className="text-slate-400">
              본 시스템은 교육부 NEIS Open API 고등학교 시간표 서비스(OPEN18620200826103326268120) 규격 및 대진전자통신고 2026학년도 정규 교육과정 기준에 맞추어 제작되었습니다.
            </p>
            <div className="pt-1">
              <a
                href={DAEJIN_SCHOOL_INFO.homepage}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors"
              >
                <Globe className="w-3.5 h-3.5 text-blue-400" />
                <span>학교 공식 홈페이지 방문</span>
              </a>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500">
          <p>© 2026 Daejin High School of Electronics & Communication. All rights reserved.</p>
          <p>시간표 조회 (1~10반) · 실시간 교시 알림 · 로컬스토리지 과제 제출 포털</p>
        </div>
      </div>
    </footer>
  );
}
