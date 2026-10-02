// LocalStorage Homework & Assignment Management Engine

export interface AttachmentItem {
  id: string;
  name: string;
  size: number; // in bytes
  type: string;
  dataUrl: string; // base64 data url for preview/download
}

export interface HomeworkSubmission {
  id: string;
  grade: number;        // 1, 2, 3
  classNum: number;     // 1 ~ 10
  studentId: string;    // e.g., "10214"
  studentName: string;  // e.g., "김대진"
  subject: string;      // e.g., "전자회로"
  title: string;        // e.g., "옴의 법칙 및 키르히호프 법칙 측정 실험 보고서"
  content: string;      // Detailed description or code
  links: string[];      // GitHub, Notion, Drive links
  attachments: AttachmentItem[];
  createdAt: string;    // ISO string
  updatedAt?: string;
  status: 'submitted' | 'reviewed' | 'needs_revision';
  teacherFeedback?: string;
  assignmentId?: string; // Optional reference to a teacher assigned task
}

export interface HomeworkTaskNotice {
  id: string;
  grade: number;
  classNum: number;
  subject: string;
  title: string;
  description: string;
  dueDate: string;      // YYYY-MM-DD or YYYY-MM-DD HH:mm
  teacherName: string;
  createdAt: string;
  requiredAttachments?: string;
}

export interface StudentProfile {
  grade: number;
  classNum: number;
  studentId: string;
  studentName: string;
}

const STORAGE_KEYS = {
  SUBMISSIONS: 'daejin_homework_submissions_v2',
  TASKS: 'daejin_homework_tasks_v2',
  PROFILE: 'daejin_student_profile_v2',
};

// Initial Seed Tasks for Daejin High School
const INITIAL_TASKS: HomeworkTaskNotice[] = [
  {
    id: 'task-102-elec',
    grade: 1,
    classNum: 2,
    subject: '전자회로',
    title: '옴의 법칙 및 키르히호프 전압/전류 법칙 멀티미터 측정 보고서',
    description: '브레드보드에 1kΩ, 2.2kΩ 저항을 직병렬 연결하고 디지털 멀티미터로 전압 강하 및 전류를 측정한 데이터표와 오차 분석 보고서를 제출하세요.',
    dueDate: '2026-10-15 23:59',
    teacherName: '박준호 선생님',
    createdAt: '2026-10-01',
    requiredAttachments: '측정 회로 사진 및 PDF 보고서',
  },
  {
    id: 'task-205-net',
    grade: 2,
    classNum: 5,
    subject: '네트워크구축',
    title: '패킷 트레이서(Packet Tracer) VLAN 분할 및 OSPF 라우팅 실습',
    description: '3개의 스위치와 2개의 라우터 환경에서 부서별 VLAN (10, 20, 30) 구성 및 서브넷 마스크 계산 내역과 .pkt 파일을 압축하여 업로드하세요.',
    dueDate: '2026-10-18 18:00',
    teacherName: '이영수 선생님',
    createdAt: '2026-10-02',
    requiredAttachments: '.pkt 파일 또는 캡처 스크린샷',
  },
  {
    id: 'task-307-sw',
    grade: 3,
    classNum: 7,
    subject: '프로그래밍',
    title: 'Next.js & TypeScript 기반 포트폴리오 웹사이트 구현 및 깃허브 링크 제출',
    description: '본인의 3개년 전공 실습 작품을 소개하는 반응형 웹사이트를 제작하고, 깃허브 저장소 주소와 배포 링크(Vercel/Cloud Run)를 작성하여 제출하세요.',
    dueDate: '2026-10-25 23:59',
    teacherName: '정민기 선생님',
    createdAt: '2026-10-02',
    requiredAttachments: 'README.md 스크린샷 및 깃허브 링크',
  },
  {
    id: 'task-109-ai',
    grade: 1,
    classNum: 9,
    subject: '센서공학',
    title: '초음파 거리 측정 센서(HC-SR04)와 아두이노 인터페이스 측정 실습',
    description: '초음파 센서로 10cm, 30cm, 50cm 거리의 반사 음파 시간을 측정하여 계산한 거리값과 실제 자로 측정한 오차율 그래프를 작성하세요.',
    dueDate: '2026-10-16 17:00',
    teacherName: '최동욱 선생님',
    createdAt: '2026-10-01',
    requiredAttachments: '아두이노 소스코드 및 측정 데이터 캡처',
  },
];

// Initial Seed Submissions for quick out-of-the-box demonstration
const INITIAL_SUBMISSIONS: HomeworkSubmission[] = [
  {
    id: 'sub-sample-1',
    grade: 1,
    classNum: 2,
    studentId: '10215',
    studentName: '강민우',
    subject: '전자회로',
    title: '1학년 2반 강민우 옴의 법칙 멀티미터 측정 실험 보고서 제출합니다.',
    content: '실제 저항값 측정 결과 1kΩ 저항은 0.992kΩ, 2.2kΩ 저항은 2.18kΩ로 측정되어 허용 오차 ±5% 이내였습니다. 직렬 연결 시 총 저항은 이론치 3.2kΩ에 근접한 3.172kΩ였습니다.',
    links: ['https://github.com/daejin-circuit/lab-report'],
    attachments: [
      {
        id: 'att-1',
        name: 'circuit_measurement_10215.png',
        size: 245000,
        type: 'image/png',
        dataUrl: '', // generated or empty fallback
      },
    ],
    createdAt: '2026-10-02T08:45:00.000Z',
    status: 'reviewed',
    teacherFeedback: '오차 분석 계산이 매우 꼼꼼하며 계측기 결선 사진이 훌륭합니다. A+!',
    assignmentId: 'task-102-elec',
  },
  {
    id: 'sub-sample-2',
    grade: 2,
    classNum: 5,
    studentId: '20508',
    studentName: '윤서아',
    subject: '네트워크구축',
    title: 'VLAN 10/20/30 트렁킹 및 OSPF 단일 영역 라우팅 설정 완료',
    content: 'FastEthernet 0/1 포트에 switchport mode trunk 인캡슐레이션을 지정하고 native vlan 99를 적용했습니다. 라우터 인터페이스 서브인터페이스(encapsulation dot1Q) 설정을 통해 통신 성공을 확인했습니다.',
    links: ['https://packet-tracer-share.local/yoonseoa'],
    attachments: [
      {
        id: 'att-2',
        name: 'vlan_topology_capture.png',
        size: 312000,
        type: 'image/png',
        dataUrl: '',
      },
    ],
    createdAt: '2026-10-02T09:12:00.000Z',
    status: 'submitted',
    assignmentId: 'task-205-net',
  },
];

// Safety check for browser environment
function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

/**
 * Load all submissions from LocalStorage
 */
export function getStoredSubmissions(): HomeworkSubmission[] {
  if (!isBrowser()) return INITIAL_SUBMISSIONS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SUBMISSIONS);
    if (!raw) {
      // Seed with initial data
      localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(INITIAL_SUBMISSIONS));
      return INITIAL_SUBMISSIONS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_SUBMISSIONS;
  } catch (err) {
    console.error('Failed to parse submissions from localStorage:', err);
    return INITIAL_SUBMISSIONS;
  }
}

/**
 * Save new submission
 */
export function saveSubmission(submission: Omit<HomeworkSubmission, 'id' | 'createdAt' | 'status'> & { id?: string }): HomeworkSubmission {
  const all = getStoredSubmissions();
  const newSubmission: HomeworkSubmission = {
    ...submission,
    id: submission.id || `sub-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    createdAt: new Date().toISOString(),
    status: 'submitted',
  };

  const updated = [newSubmission, ...all];
  if (isBrowser()) {
    try {
      localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(updated));
    } catch (e: any) {
      // If localstorage quota exceeded due to large attachments
      if (e.name === 'QuotaExceededError') {
        // Strip large dataUrl attachments if needed to preserve text metadata
        const slimmed = updated.map((item) => ({
          ...item,
          attachments: item.attachments.map((att) => ({
            ...att,
            dataUrl: att.size > 500000 ? '' : att.dataUrl,
          })),
        }));
        localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(slimmed));
      }
    }
  }
  return newSubmission;
}

/**
 * Delete a submission
 */
export function deleteSubmission(id: string): boolean {
  if (!isBrowser()) return false;
  const all = getStoredSubmissions();
  const filtered = all.filter((s) => s.id !== id);
  localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(filtered));
  return true;
}

/**
 * Update feedback or status on submission
 */
export function updateSubmissionStatus(id: string, status: HomeworkSubmission['status'], feedback?: string): boolean {
  if (!isBrowser()) return false;
  const all = getStoredSubmissions();
  const index = all.findIndex((s) => s.id === id);
  if (index === -1) return false;

  all[index] = {
    ...all[index],
    status,
    teacherFeedback: feedback !== undefined ? feedback : all[index].teacherFeedback,
    updatedAt: new Date().toISOString(),
  };

  localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(all));
  return true;
}

/**
 * Load all homework tasks / notices
 */
export function getStoredTasks(): HomeworkTaskNotice[] {
  if (!isBrowser()) return INITIAL_TASKS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TASKS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(INITIAL_TASKS));
      return INITIAL_TASKS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_TASKS;
  } catch (err) {
    return INITIAL_TASKS;
  }
}

/**
 * Add a new homework assignment task (teacher / class president notice)
 */
export function saveHomeworkTask(task: Omit<HomeworkTaskNotice, 'id' | 'createdAt'>): HomeworkTaskNotice {
  const all = getStoredTasks();
  const newTask: HomeworkTaskNotice = {
    ...task,
    id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    createdAt: new Date().toISOString(),
  };

  const updated = [newTask, ...all];
  if (isBrowser()) {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(updated));
  }
  return newTask;
}

/**
 * Delete homework task
 */
export function deleteHomeworkTask(id: string): boolean {
  if (!isBrowser()) return false;
  const all = getStoredTasks();
  const filtered = all.filter((t) => t.id !== id);
  localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(filtered));
  return true;
}

/**
 * Remember student profile on device
 */
export function getStoredStudentProfile(): StudentProfile {
  const defaultProfile: StudentProfile = {
    grade: 1,
    classNum: 2,
    studentId: '',
    studentName: '',
  };
  if (!isBrowser()) return defaultProfile;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (!raw) return defaultProfile;
    return { ...defaultProfile, ...JSON.parse(raw) };
  } catch {
    return defaultProfile;
  }
}

export function saveStoredStudentProfile(profile: Partial<StudentProfile>): void {
  if (!isBrowser()) return;
  const current = getStoredStudentProfile();
  const updated = { ...current, ...profile };
  localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(updated));
}

/**
 * Reset local storage to initial sample state
 */
export function resetHomeworkStorage(): void {
  if (!isBrowser()) return;
  localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(INITIAL_SUBMISSIONS));
  localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(INITIAL_TASKS));
}

/**
 * Helper to convert File to base64 DataURL
 */
export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}
