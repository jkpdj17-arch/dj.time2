// Daejin High School Curriculum & Timetable Data Engine
// Supports Grades 1-3, Classes 1-10, Periods 1-7, Mon-Fri

export interface TimetablePeriodItem {
  period: number;
  subject: string;
  teacher?: string;
  classroom?: string;
  category: 'vocational' | 'general' | 'activity';
  startTime: string;
  endTime: string;
}

export interface DayTimetable {
  dayOfWeek: number; // 1: Monday, 2: Tuesday, ..., 5: Friday
  dayName: string;   // '월요일', '화요일', ...
  shortDay: string;  // '월', '화', ...
  periods: TimetablePeriodItem[];
}

export interface WeeklyTimetableResult {
  grade: number;
  classNum: number;
  department: string;
  days: DayTimetable[];
  source: 'neis' | 'curriculum';
  lastUpdated?: string;
}

// Period start and end times for standard 1~7 periods
export const PERIOD_TIMES: Record<number, { start: string; end: string }> = {
  1: { start: '08:50', end: '09:40' },
  2: { start: '09:50', end: '10:40' },
  3: { start: '10:50', end: '11:40' },
  4: { start: '11:50', end: '12:40' },
  5: { start: '13:40', end: '14:30' },
  6: { start: '14:40', end: '15:30' },
  7: { start: '15:40', end: '16:30' },
};

// Department mapping for 10 classes
export const DEPARTMENTS_BY_CLASS: Record<number, { name: string; focus: string }> = {
  1: { name: '스마트전자과', focus: '전자회로 및 하드웨어' },
  2: { name: '스마트전자과', focus: '전자회로 및 하드웨어' },
  3: { name: '스마트전자과', focus: '전자부품 및 PCB제작' },
  4: { name: '전자통신네트워크과', focus: '유무선 통신 및 네트워크' },
  5: { name: '전자통신네트워크과', focus: '네트워크 보안 및 패킷분석' },
  6: { name: '전자통신네트워크과', focus: '정보통신 시스템 구축' },
  7: { name: '컴퓨터소프트웨어과', focus: 'Python & Web 프로그래밍' },
  8: { name: '컴퓨터소프트웨어과', focus: '응용SW 및 데이터베이스' },
  9: { name: 'AI전자제어과', focus: '로봇 자동화 및 센서제어' },
  10: { name: 'AI전자제어과', focus: '스마트팩토리 & 임베디드' },
};

// Curriculum presets by Grade and Track
// Grade 1: Foundation (기초 교과 + 직업 기초 소양)
// Grade 2: Applied (전공 실무 심화 + 공통 교과)
// Grade 3: Advanced (프로젝트 실습, 현장 실무, 진로 캡스톤)

const GRADE_1_SUBJECT_POOLS = {
  electronics: {
    // 1~3반
    1: ['공업일반', '국어', '수학', '통합사회', '전자회로', '전자회로', '체육'],
    2: ['영어', '전기기초', '전기기초', '한국사', '수학', '통합과학', '자율활동'],
    3: ['국어', '통합과학', '전자CAD', '전자CAD', '영어', '정보통신', '정보통신'],
    4: ['수학', '한국사', '전자회로', '공업일반', '체육', '국어', '진로활동'],
    5: ['영어', '프로그래밍', '프로그래밍', '수학', '동아리', '동아리', '자율활동'],
  },
  telecom: {
    // 4~6반
    1: ['공업일반', '국어', '수학', '정보통신', '정보통신', '영어', '체육'],
    2: ['수학', '네트워크기초', '네트워크기초', '통합과학', '국어', '한국사', '자율활동'],
    3: ['영어', '통합사회', '통합사회', '수학', '전자회로', '전자회로', '체육'],
    4: ['국어', '한국사', '통합과학', '프로그래밍', '프로그래밍', '공업일반', '진로활동'],
    5: ['수학', '네트워크기초', '영어', '국어', '동아리', '동아리', '자율활동'],
  },
  software: {
    // 7~8반
    1: ['프로그래밍', '프로그래밍', '국어', '수학', '영어', '통합과학', '체육'],
    2: ['수학', '컴퓨터구조', '컴퓨터구조', '한국사', '국어', '통합사회', '자율활동'],
    3: ['영어', '파이썬실습', '파이썬실습', '수학', '공업일반', '국어', '체육'],
    4: ['통합과학', '웹프로그래밍', '웹프로그래밍', '수학', '한국사', '영어', '진로활동'],
    5: ['국어', '자료구조', '자료구조', '영어', '동아리', '동아리', '자율활동'],
  },
  ai_control: {
    // 9~10반
    1: ['공업일반', '국어', '수학', '센서공학', '센서공학', '영어', '체육'],
    2: ['수학', '자동제어기초', '자동제어기초', '통합사회', '한국사', '국어', '자율활동'],
    3: ['영어', '마이크로비트', '마이크로비트', '통합과학', '수학', '국어', '체육'],
    4: ['한국사', '프로그래밍', '프로그래밍', '수학', '통합과학', '공업일반', '진로활동'],
    5: ['국어', '로봇제어', '로봇제어', '영어', '동아리', '동아리', '자율활동'],
  },
};

const GRADE_2_SUBJECT_POOLS = {
  electronics: {
    1: ['전자회로설계', '전자회로설계', '수학Ⅰ', '문학', '영어Ⅰ', '물리학', '체육'],
    2: ['디지털논리', '디지털논리', 'PCB설계', 'PCB설계', '수학Ⅰ', '성공적인직업생활', '자율활동'],
    3: ['영어Ⅰ', '문학', '전자회로실습', '전자회로실습', '한국지리', '수학Ⅰ', '체육'],
    4: ['임베디드시스템', '임베디드시스템', '수학Ⅰ', '영어Ⅰ', '문학', '물리학', '진로활동'],
    5: ['전자측정실무', '전자측정실무', '문학', '수학Ⅰ', '동아리', '동아리', '자율활동'],
  },
  telecom: {
    1: ['네트워크구축', '네트워크구축', '수학Ⅰ', '문학', '영어Ⅰ', '정보통신', '체육'],
    2: ['광통신실습', '광통신실습', '유무선통신', '유무선통신', '수학Ⅰ', '성공적인직업생활', '자율활동'],
    3: ['문학', '영어Ⅰ', '네트워크보안', '네트워크보안', '한국지리', '수학Ⅰ', '체육'],
    4: ['통신시스템', '통신시스템', '수학Ⅰ', '영어Ⅰ', '문학', '물리학', '진로활동'],
    5: ['서버구축실무', '서버구축실무', '문학', '수학Ⅰ', '동아리', '동아리', '자율활동'],
  },
  software: {
    1: ['자바프로그래밍', '자바프로그래밍', '수학Ⅰ', '문학', '영어Ⅰ', '웹개발', '체육'],
    2: ['데이터베이스', '데이터베이스', '스마트앱개발', '스마트앱개발', '수학Ⅰ', '성공적직업생활', '자율활동'],
    3: ['문학', '영어Ⅰ', '자료구조알고리즘', '자료구조알고리즘', '한국지리', '수학Ⅰ', '체육'],
    4: ['풀스택웹실습', '풀스택웹실습', '수학Ⅰ', '영어Ⅰ', '문학', '물리학', '진로활동'],
    5: ['오픈소스프로젝트', '오픈소스프로젝트', '문학', '수학Ⅰ', '동아리', '동아리', '자율활동'],
  },
  ai_control: {
    1: ['PLC제어실습', 'PLC제어실습', '수학Ⅰ', '문학', '영어Ⅰ', '자동제어', '체육'],
    2: ['아두이노임베디드', '아두이노임베디드', '센서신호처리', '센서신호처리', '수학Ⅰ', '성공적직업생활', '자율활동'],
    3: ['문학', '영어Ⅰ', '모터제어', '모터제어', '한국지리', '수학Ⅰ', '체육'],
    4: ['로봇프로그래밍', '로봇프로그래밍', '수학Ⅰ', '영어Ⅰ', '문학', '물리학', '진로활동'],
    5: ['스마트센서응용', '스마트센서응용', '문학', '수학Ⅰ', '동아리', '동아리', '자율활동'],
  },
};

const GRADE_3_SUBJECT_POOLS = {
  electronics: {
    1: ['전자캡스톤디자인', '전자캡스톤디자인', '실용영어', '취업실무', '수학과제탐구', '직업윤리', '체육'],
    2: ['스마트기기개발', '스마트기기개발', 'PCB제작실무', 'PCB제작실무', '화법과작문', '취업실무', '자율활동'],
    3: ['실용영어', '화법과작문', '전자계측제어', '전자계측제어', '수학과제탐구', '직무기초', '체육'],
    4: ['프로젝트실습', '프로젝트실습', '실용영어', '화법과작문', '수학실무', '자기소개서코칭', '진로활동'],
    5: ['포트폴리오제작', '포트폴리오제작', '직무종합평가', '실용영어', '동아리', '동아리', '자율활동'],
  },
  telecom: {
    1: ['네트워크실무프로젝트', '네트워크실무프로젝트', '실용영어', '취업실무', '수학과제탐구', '직업윤리', '체육'],
    2: ['클라우드시스템구축', '클라우드시스템구축', '네트워크진단', '네트워크진단', '화법과작문', '취업실무', '자율활동'],
    3: ['실용영어', '화법과작문', '무선통신실무', '무선통신실무', '수학과제탐구', '직무기초', '체육'],
    4: ['보안관제실무', '보안관제실무', '실용영어', '화법과작문', '수학실무', '모의면접실습', '진로활동'],
    5: ['통신네트워크캡스톤', '통신네트워크캡스톤', '직무종합평가', '실용영어', '동아리', '동아리', '자율활동'],
  },
  software: {
    1: ['산학협력소프트웨어프로젝트', '산학협력소프트웨어프로젝트', '실용영어', '취업실무', '수학과제탐구', '직업윤리', '체육'],
    2: ['클라우드풀스택개발', '클라우드풀스택개발', '알고리즘코딩테스트', '알고리즘코딩테스트', '화법과작문', '취업실무', '자율활동'],
    3: ['실용영어', '화법과작문', '인공지능서비스개발', '인공지능서비스개발', '수학과제탐구', '직무기초', '체육'],
    4: ['모바일앱출시프로젝트', '모바일앱출시프로젝트', '실용영어', '화법과작문', '수학실무', '기술면접코칭', '진로활동'],
    5: ['SW포트폴리오발표', 'SW포트폴리오발표', '코드리뷰실무', '실용영어', '동아리', '동아리', '자율활동'],
  },
  ai_control: {
    1: ['로봇자동화시스템프로젝트', '로봇자동화시스템프로젝트', '실용영어', '취업실무', '수학과제탐구', '직업윤리', '체육'],
    2: ['스마트팩토리운용', '스마트팩토리운용', '산업용로봇티칭', '산업용로봇티칭', '화법과작문', '취업실무', '자율활동'],
    3: ['실용영어', '화법과작문', 'PLC응용제어', 'PLC응용제어', '수학과제탐구', '직무기초', '체육'],
    4: ['인공지능비전제어', '인공지능비전제어', '실용영어', '화법과작문', '수학실무', '모의면접실습', '진로활동'],
    5: ['AI제어캡스톤디자인', 'AI제어캡스톤디자인', '직무종합평가', '실용영어', '동아리', '동아리', '자율활동'],
  },
};

const DAY_NAMES = [
  { dayOfWeek: 1, dayName: '월요일', shortDay: '월' },
  { dayOfWeek: 2, dayName: '화요일', shortDay: '화' },
  { dayOfWeek: 3, dayName: '수요일', shortDay: '수' },
  { dayOfWeek: 4, dayName: '목요일', shortDay: '목' },
  { dayOfWeek: 5, dayName: '금요일', shortDay: '금' },
];

function getCategory(subject: string): 'vocational' | 'general' | 'activity' {
  if (['자율활동', '진로활동', '동아리'].includes(subject)) return 'activity';
  if (
    [
      '국어', '수학', '영어', '한국사', '통합사회', '통합과학', '체육', '음악', '미술',
      '수학Ⅰ', '문학', '영어Ⅰ', '물리학', '한국지리', '화법과작문', '실용영어', '수학과제탐구',
    ].includes(subject)
  ) {
    return 'general';
  }
  return 'vocational';
}

/**
 * Returns standard curriculum weekly timetable for a given grade and class (1~10)
 */
export function getStandardCurriculumTimetable(grade: number, classNum: number): WeeklyTimetableResult {
  const safeGrade = Math.min(3, Math.max(1, grade || 1));
  const safeClass = Math.min(10, Math.max(1, classNum || 1));

  let trackKey: 'electronics' | 'telecom' | 'software' | 'ai_control' = 'electronics';
  if (safeClass >= 1 && safeClass <= 3) trackKey = 'electronics';
  else if (safeClass >= 4 && safeClass <= 6) trackKey = 'telecom';
  else if (safeClass >= 7 && safeClass <= 8) trackKey = 'software';
  else trackKey = 'ai_control';

  let pool: any = GRADE_1_SUBJECT_POOLS[trackKey];
  if (safeGrade === 2) pool = GRADE_2_SUBJECT_POOLS[trackKey];
  if (safeGrade === 3) pool = GRADE_3_SUBJECT_POOLS[trackKey];

  const dept = DEPARTMENTS_BY_CLASS[safeClass]?.name || '스마트전자과';

  const days: DayTimetable[] = DAY_NAMES.map(({ dayOfWeek, dayName, shortDay }) => {
    const rawSubjects: string[] = pool[dayOfWeek] || pool[1];
    
    // Slight shift by class number so different classes in the same track don't look 100% clone
    const offset = (safeClass - 1) % 3;
    const adjustedSubjects = [...rawSubjects];
    if (offset > 0 && dayOfWeek < 5) {
      // Swap two adjacent periods
      const temp = adjustedSubjects[1];
      adjustedSubjects[1] = adjustedSubjects[3];
      adjustedSubjects[3] = temp;
    }

    const periods: TimetablePeriodItem[] = adjustedSubjects.map((sub, idx) => {
      const periodNum = idx + 1;
      const times = PERIOD_TIMES[periodNum] || { start: '08:50', end: '09:40' };
      return {
        period: periodNum,
        subject: sub,
        category: getCategory(sub),
        startTime: times.start,
        endTime: times.end,
      };
    });

    return {
      dayOfWeek,
      dayName,
      shortDay,
      periods,
    };
  });

  return {
    grade: safeGrade,
    classNum: safeClass,
    department: dept,
    days,
    source: 'curriculum',
    lastUpdated: new Date().toLocaleDateString('ko-KR'),
  };
}
