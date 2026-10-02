import { NextRequest, NextResponse } from 'next/server';
import { DAEJIN_SCHOOL_INFO } from '@/lib/school-info';
import {
  getStandardCurriculumTimetable,
  PERIOD_TIMES,
  WeeklyTimetableResult,
  DayTimetable,
  TimetablePeriodItem,
} from '@/lib/curriculum-data';

export const runtime = 'nodejs';

interface NeisRow {
  ATPT_OFCDC_SC_CODE: string;
  ATPT_OFCDC_SC_NM: string;
  SD_SCHUL_CODE: string;
  SCHUL_NM: string;
  AY: string;
  SEM: string;
  ALL_TI_YMD: string;
  DGHT_CRSE_SC_NM?: string;
  ORD_SC_NM?: string;
  DDDEP_NM?: string;
  GRADE: string;
  CLRM_NM?: string;
  CLASS_NM: string;
  PERIO: string;
  ITRT_CNTNT: string;
  LOAD_DTM?: string;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const gradeStr = searchParams.get('grade') || '1';
  const classStr = searchParams.get('classNm') || '1';
  const dateStr = searchParams.get('date'); // optional YYYYMMDD or from/to
  const fromYmd = searchParams.get('fromYmd');
  const toYmd = searchParams.get('toYmd');
  const userApiKey = searchParams.get('apiKey');

  const grade = Math.min(3, Math.max(1, parseInt(gradeStr, 10) || 1));
  const classNum = Math.min(10, Math.max(1, parseInt(classStr, 10) || 1)); // Enforce 10반 max

  // Default fallback curriculum
  const standardCurriculum = getStandardCurriculumTimetable(grade, classNum);

  try {
    // Determine academic year & dates if not specified
    const now = new Date();
    const year = now.getFullYear().toString();
    const month = now.getMonth() + 1;
    const semester = month >= 3 && month <= 7 ? '1' : '2';

    // Build NEIS URL
    const neisUrl = new URL('https://open.neis.go.kr/hub/hisTimetable');
    neisUrl.searchParams.set('Type', 'json');
    neisUrl.searchParams.set('pIndex', '1');
    neisUrl.searchParams.set('pSize', '100');
    neisUrl.searchParams.set('ATPT_OFCDC_SC_CODE', DAEJIN_SCHOOL_INFO.officeCode); // C10
    neisUrl.searchParams.set('SD_SCHUL_CODE', DAEJIN_SCHOOL_INFO.schoolCode);     // 7150597
    neisUrl.searchParams.set('AY', year);
    neisUrl.searchParams.set('SEM', semester);
    neisUrl.searchParams.set('GRADE', grade.toString());
    neisUrl.searchParams.set('CLASS_NM', classNum.toString());

    if (process.env.NEIS_API_KEY || userApiKey) {
      neisUrl.searchParams.set('KEY', (process.env.NEIS_API_KEY || userApiKey || '').trim());
    }

    if (dateStr) {
      neisUrl.searchParams.set('ALL_TI_YMD', dateStr);
    } else if (fromYmd && toYmd) {
      neisUrl.searchParams.set('TI_FROM_YMD', fromYmd);
      neisUrl.searchParams.set('TI_TO_YMD', toYmd);
    }

    // Attempt fetch with short timeout so client is never blocked
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(neisUrl.toString(), {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        Accept: 'application/json',
      },
      next: { revalidate: 300 }, // 5 min cache
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();

      // Check if hisTimetable returned valid rows
      if (data && data.hisTimetable && data.hisTimetable[1] && data.hisTimetable[1].row) {
        const rows: NeisRow[] = data.hisTimetable[1].row;

        if (rows.length > 0) {
          // Group rows by day / date
          // For weekly view, map day of week
          const dayMap: Record<number, TimetablePeriodItem[]> = {};

          rows.forEach((row) => {
            const perioNum = parseInt(row.PERIO, 10);
            if (!perioNum || perioNum < 1 || perioNum > 7) return;

            const ymd = row.ALL_TI_YMD;
            // Parse YYYYMMDD to Date to get day of week (1=Mon, 5=Fri)
            const y = parseInt(ymd.substring(0, 4), 10);
            const m = parseInt(ymd.substring(4, 6), 10) - 1;
            const d = parseInt(ymd.substring(6, 8), 10);
            const rowDate = new Date(y, m, d);
            const dayOfWeek = rowDate.getDay(); // 1~5

            if (dayOfWeek >= 1 && dayOfWeek <= 5) {
              if (!dayMap[dayOfWeek]) {
                dayMap[dayOfWeek] = [];
              }

              const times = PERIOD_TIMES[perioNum] || { start: '08:50', end: '09:40' };
              dayMap[dayOfWeek].push({
                period: perioNum,
                subject: row.ITRT_CNTNT || '자율학습',
                category: 'vocational',
                startTime: times.start,
                endTime: times.end,
              });
            }
          });

          // Check if we got enough periods
          const dayCount = Object.keys(dayMap).length;
          if (dayCount > 0) {
            // Merge into weekly timetable structure
            const days: DayTimetable[] = standardCurriculum.days.map((stdDay) => {
              const neisPeriods = dayMap[stdDay.dayOfWeek];
              if (neisPeriods && neisPeriods.length > 0) {
                // sort by period
                neisPeriods.sort((a, b) => a.period - b.period);
                return {
                  ...stdDay,
                  periods: neisPeriods,
                };
              }
              return stdDay;
            });

            const result: WeeklyTimetableResult = {
              grade,
              classNum,
              department: standardCurriculum.department,
              days,
              source: 'neis',
              lastUpdated: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
            };

            return NextResponse.json({
              success: true,
              data: result,
              message: 'NEIS Open API에서 실시간 시간표를 성공적으로 수신했습니다.',
            });
          }
        }
      }
    }
  } catch (err: any) {
    // Graceful fallback on network timeout or CORS/rate-limit
    console.warn('NEIS API fetch warning, fallback to Daejin curriculum:', err?.message);
  }

  // Return standard curriculum with clear metadata
  return NextResponse.json({
    success: true,
    data: standardCurriculum,
    message: '대진전자통신고등학교 2026학년도 정규 교육과정 편성표 기준 시간표입니다.',
  });
}
