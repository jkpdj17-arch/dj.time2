// School Information and Bell Schedule definition for Daejin High School of Electronics & Communication

export interface SchoolMeta {
  officeCode: string; // ATPT_OFCDC_SC_CODE
  officeName: string;
  schoolCode: string; // SD_SCHUL_CODE
  schoolName: string;
  englishName: string;
  schoolType: string;
  establishmentType: string;
  postalCode: string;
  address: string;
  phone: string;
  fax: string;
  homepage: string;
  gender: string;
  foundedDate: string;
}

export const DAEJIN_SCHOOL_INFO: SchoolMeta = {
  officeCode: 'C10',
  officeName: '부산광역시교육청',
  schoolCode: '7150597',
  schoolName: '대진전자통신고등학교',
  englishName: 'Daejin High School of Electronics & Communication',
  schoolType: '고등학교 (특성화고)',
  establishmentType: '사립 / 남여공학',
  postalCode: '46247',
  address: '부산광역시 금정구 수림로 92 (장전동)',
  phone: '051-582-8100',
  fax: '051-582-8120',
  homepage: 'http://pdj.hs.kr',
  gender: '남녀공학',
  foundedDate: '1995.10.30',
};

export interface PeriodSlot {
  period: number; // 0 for morning, 1~7 for periods, 8 for lunch, 9 for dismissal
  name: string;
  shortName: string;
  startTime: string; // "HH:MM"
  endTime: string;   // "HH:MM"
  type: 'morning' | 'class' | 'break' | 'lunch' | 'dismissal' | 'afterschool';
  durationMinutes: number;
}

// Standard 50-minute class schedule (표준 50분 수업 일과표)
export const STANDARD_BELL_SCHEDULE: PeriodSlot[] = [
  {
    period: 0,
    name: '아침 조회 및 독서',
    shortName: '조회',
    startTime: '08:30',
    endTime: '08:50',
    type: 'morning',
    durationMinutes: 20,
  },
  {
    period: 1,
    name: '1교시',
    shortName: '1교시',
    startTime: '08:50',
    endTime: '09:40',
    type: 'class',
    durationMinutes: 50,
  },
  {
    period: 101,
    name: '쉬는 시간 (1-2교시)',
    shortName: '쉬는시간',
    startTime: '09:40',
    endTime: '09:50',
    type: 'break',
    durationMinutes: 10,
  },
  {
    period: 2,
    name: '2교시',
    shortName: '2교시',
    startTime: '09:50',
    endTime: '10:40',
    type: 'class',
    durationMinutes: 50,
  },
  {
    period: 102,
    name: '쉬는 시간 (2-3교시)',
    shortName: '쉬는시간',
    startTime: '10:40',
    endTime: '10:50',
    type: 'break',
    durationMinutes: 10,
  },
  {
    period: 3,
    name: '3교시',
    shortName: '3교시',
    startTime: '10:50',
    endTime: '11:40',
    type: 'class',
    durationMinutes: 50,
  },
  {
    period: 103,
    name: '쉬는 시간 (3-4교시)',
    shortName: '쉬는시간',
    startTime: '11:40',
    endTime: '11:50',
    type: 'break',
    durationMinutes: 10,
  },
  {
    period: 4,
    name: '4교시',
    shortName: '4교시',
    startTime: '11:50',
    endTime: '12:40',
    type: 'class',
    durationMinutes: 50,
  },
  {
    period: 800,
    name: '점심 시간 & 급식',
    shortName: '점심시간',
    startTime: '12:40',
    endTime: '13:40',
    type: 'lunch',
    durationMinutes: 60,
  },
  {
    period: 5,
    name: '5교시',
    shortName: '5교시',
    startTime: '13:40',
    endTime: '14:30',
    type: 'class',
    durationMinutes: 50,
  },
  {
    period: 105,
    name: '쉬는 시간 (5-6교시)',
    shortName: '쉬는시간',
    startTime: '14:30',
    endTime: '14:40',
    type: 'break',
    durationMinutes: 10,
  },
  {
    period: 6,
    name: '6교시',
    shortName: '6교시',
    startTime: '14:40',
    endTime: '15:30',
    type: 'class',
    durationMinutes: 50,
  },
  {
    period: 106,
    name: '쉬는 시간 (6-7교시)',
    shortName: '쉬는시간',
    startTime: '15:30',
    endTime: '15:40',
    type: 'break',
    durationMinutes: 10,
  },
  {
    period: 7,
    name: '7교시',
    shortName: '7교시',
    startTime: '15:40',
    endTime: '16:30',
    type: 'class',
    durationMinutes: 50,
  },
  {
    period: 900,
    name: '종례 및 교실 청소',
    shortName: '종례',
    startTime: '16:30',
    endTime: '17:00',
    type: 'dismissal',
    durationMinutes: 30,
  },
  {
    period: 901,
    name: '방과후 수업 및 전공동아리',
    shortName: '방과후',
    startTime: '17:00',
    endTime: '20:00',
    type: 'afterschool',
    durationMinutes: 180,
  },
];

// Helper to convert "HH:MM" to seconds since midnight
export function timeStringToSeconds(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return (hours || 0) * 3600 + (minutes || 0) * 60;
}

export interface CurrentPeriodStatus {
  activeSlot: PeriodSlot | null;
  nextSlot: PeriodSlot | null;
  remainingSeconds: number;
  elapsedSeconds: number;
  totalDurationSeconds: number;
  progressPercent: number;
  isSchoolDay: boolean;
  statusText: string;
}

/**
 * Calculates current period status given a Date object
 */
export function getCurrentPeriodStatus(now: Date = new Date()): CurrentPeriodStatus {
  const day = now.getDay(); // 0 is Sunday, 6 is Saturday
  const isWeekend = day === 0 || day === 6;

  const currentSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();

  if (isWeekend) {
    return {
      activeSlot: null,
      nextSlot: STANDARD_BELL_SCHEDULE[0],
      remainingSeconds: 0,
      elapsedSeconds: 0,
      totalDurationSeconds: 0,
      progressPercent: 0,
      isSchoolDay: false,
      statusText: '즐거운 주말입니다 (월요일 08:30 조회 시작)',
    };
  }

  // Find matching slot in standard schedule
  for (let i = 0; i < STANDARD_BELL_SCHEDULE.length; i++) {
    const slot = STANDARD_BELL_SCHEDULE[i];
    const startSec = timeStringToSeconds(slot.startTime);
    const endSec = timeStringToSeconds(slot.endTime);

    if (currentSeconds >= startSec && currentSeconds < endSec) {
      const remainingSeconds = endSec - currentSeconds;
      const elapsedSeconds = currentSeconds - startSec;
      const totalDurationSeconds = endSec - startSec;
      const progressPercent = Math.min(100, Math.max(0, Math.round((elapsedSeconds / totalDurationSeconds) * 100)));

      const nextSlot = i + 1 < STANDARD_BELL_SCHEDULE.length ? STANDARD_BELL_SCHEDULE[i + 1] : null;

      let statusText = '';
      const minRem = Math.floor(remainingSeconds / 60);
      const secRem = remainingSeconds % 60;
      const timeRemStr = minRem > 0 ? `${minRem}분 ${secRem}초` : `${secRem}초`;

      if (slot.type === 'class') {
        statusText = `현재 ${slot.name} 진행 중 (종료까지 ${timeRemStr} 남음)`;
      } else if (slot.type === 'break') {
        const nextClass = nextSlot?.type === 'class' ? nextSlot.name : '다음 시간';
        statusText = `쉬는 시간 (${nextClass} 시작까지 ${timeRemStr} 남음)`;
      } else if (slot.type === 'lunch') {
        statusText = `점심 시간 (5교시 시작까지 ${timeRemStr} 남음)`;
      } else if (slot.type === 'morning') {
        statusText = `아침 조회 중 (1교시 시작까지 ${timeRemStr} 남음)`;
      } else if (slot.type === 'dismissal') {
        statusText = `종례 시간 (하교까지 ${timeRemStr} 남음)`;
      } else {
        statusText = `${slot.name} 진행 중`;
      }

      return {
        activeSlot: slot,
        nextSlot,
        remainingSeconds,
        elapsedSeconds,
        totalDurationSeconds,
        progressPercent,
        isSchoolDay: true,
        statusText,
      };
    }
  }

  // If before school start
  const firstSlot = STANDARD_BELL_SCHEDULE[0];
  const firstStartSec = timeStringToSeconds(firstSlot.startTime);
  if (currentSeconds < firstStartSec) {
    const remainingSeconds = firstStartSec - currentSeconds;
    const hours = Math.floor(remainingSeconds / 3600);
    const mins = Math.floor((remainingSeconds % 3600) / 60);
    return {
      activeSlot: null,
      nextSlot: firstSlot,
      remainingSeconds,
      elapsedSeconds: 0,
      totalDurationSeconds: firstStartSec,
      progressPercent: 0,
      isSchoolDay: true,
      statusText: `등교 전입니다 (08:30 조회까지 ${hours > 0 ? `${hours}시간 ` : ''}${mins}분 남음)`,
    };
  }

  // After school
  return {
    activeSlot: null,
    nextSlot: firstSlot,
    remainingSeconds: 0,
    elapsedSeconds: 0,
    totalDurationSeconds: 0,
    progressPercent: 100,
    isSchoolDay: true,
    statusText: '오늘의 정규 일과가 모두 종료되었습니다 (내일 08:30 등교)',
  };
}

// 1반부터 10반까지 정의 (User request: "10반 까지만 만들어줘")
export const ALLOWED_CLASSES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
export const ALLOWED_GRADES = [1, 2, 3];

// Academic Departments for Daejin High School
export const CLASS_DEPARTMENTS: Record<number, string> = {
  1: '스마트전자과',
  2: '스마트전자과',
  3: '스마트전자과',
  4: '전자통신네트워크과',
  5: '전자통신네트워크과',
  6: '전자통신네트워크과',
  7: '컴퓨터소프트웨어과',
  8: '컴퓨터소프트웨어과',
  9: 'AI전자제어과',
  10: 'AI전자제어과',
};
