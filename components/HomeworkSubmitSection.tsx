'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  Image as ImageIcon,
  Link as LinkIcon,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  User,
  GraduationCap,
  Paperclip,
} from 'lucide-react';
import {
  ALLOWED_CLASSES,
  ALLOWED_GRADES,
  CLASS_DEPARTMENTS,
} from '@/lib/school-info';
import {
  saveSubmission,
  getStoredStudentProfile,
  saveStoredStudentProfile,
  readFileAsDataUrl,
  AttachmentItem,
  HomeworkTaskNotice,
  getStoredTasks,
} from '@/lib/homework-storage';

interface HomeworkSubmitSectionProps {
  initialGrade?: number;
  initialClass?: number;
  initialSubject?: string;
  initialTaskId?: string;
  onSubmissionSuccess: () => void;
}

export function HomeworkSubmitSection({
  initialGrade = 1,
  initialClass = 2,
  initialSubject = '',
  initialTaskId,
  onSubmissionSuccess,
}: HomeworkSubmitSectionProps) {
  // Form States
  const [grade, setGrade] = useState<number>(initialGrade);
  const [classNum, setClassNum] = useState<number>(initialClass);
  const [studentId, setStudentId] = useState<string>('');
  const [studentName, setStudentName] = useState<string>('');
  const [subject, setSubject] = useState<string>(initialSubject || '전자회로');
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [linkInput, setLinkInput] = useState<string>('');
  const [links, setLinks] = useState<string[]>([]);
  const [attachments, setAttachments] = useState<AttachmentItem[]>([]);
  const [rememberProfile, setRememberProfile] = useState<boolean>(true);

  const [tasks, setTasks] = useState<HomeworkTaskNotice[]>([]);
  const [selectedTask, setSelectedTask] = useState<HomeworkTaskNotice | null>(null);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load profile and tasks on mount
  useEffect(() => {
    const profile = getStoredStudentProfile();
    if (profile.studentId) setStudentId(profile.studentId);
    if (profile.studentName) setStudentName(profile.studentName);
    if (!initialGrade && profile.grade) setGrade(profile.grade);
    if (!initialClass && profile.classNum) setClassNum(profile.classNum);

    const loadedTasks = getStoredTasks();
    setTasks(loadedTasks);

    if (initialTaskId) {
      const task = loadedTasks.find((t) => t.id === initialTaskId);
      if (task) {
        setSelectedTask(task);
        setGrade(task.grade);
        setClassNum(task.classNum);
        setSubject(task.subject);
        setTitle(`[제출] ${task.title}`);
      }
    }
  }, [initialTaskId, initialGrade, initialClass]);

  useEffect(() => {
    if (initialSubject) {
      setSubject(initialSubject);
    }
  }, [initialSubject]);

  // Quick subject suggestions based on department
  const subjectSuggestions: Record<number, string[]> = {
    1: ['전자회로', '공업일반', '전기기초', '전자CAD', '국어', '수학', '영어'],
    2: ['전자회로', '전기기초', '디지털논리', '한국사', '통합과학', '수학', '체육'],
    3: ['전자CAD', '전자회로', '정보통신', '프로그래밍', '수학', '영어', '물리학'],
    4: ['정보통신', '네트워크구축', '통신시스템', '공업일반', '국어', '수학', '영어'],
    5: ['네트워크구축', '네트워크보안', '서버구축', '통합과학', '한국사', '수학'],
    6: ['광통신실습', '유무선통신', '정보통신', '영어', '수학', '진로활동'],
    7: ['프로그래밍', '웹개발', '자바프로그래밍', '데이터베이스', '수학', '한국사'],
    8: ['스마트앱개발', '자료구조', '오픈소스프로젝트', '국어', '영어', '체육'],
    9: ['센서공학', '자동제어', 'PLC제어', '로봇제어', '공업일반', '수학'],
    10: ['아두이노', '스마트팩토리', 'AI제어', '임베디드', '영어', '한국사'],
  };

  const currentSuggestions = subjectSuggestions[classNum] || subjectSuggestions[1];

  // Handle File Selection
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newAttachments: AttachmentItem[] = [...attachments];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // Size limit: 5MB per file for localStorage safety
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage(`파일 '${file.name}'의 크기가 5MB를 초과하여 제외되었습니다.`);
        continue;
      }

      try {
        const dataUrl = await readFileAsDataUrl(file);
        newAttachments.push({
          id: `att-${Date.now()}-${i}`,
          name: file.name,
          size: file.size,
          type: file.type,
          dataUrl,
        });
      } catch (err) {
        console.error('File read error:', err);
      }
    }

    setAttachments(newAttachments);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeAttachment = (id: string) => {
    setAttachments(attachments.filter((a) => a.id !== id));
  };

  const addLink = () => {
    if (!linkInput.trim()) return;
    let url = linkInput.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    setLinks([...links, url]);
    setLinkInput('');
  };

  const removeLink = (index: number) => {
    setLinks(links.filter((_, idx) => idx !== index));
  };

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!studentId.trim()) {
      setErrorMessage('학번(예: 10215)을 입력해주세요.');
      return;
    }
    if (!studentName.trim()) {
      setErrorMessage('학생 이름을 입력해주세요.');
      return;
    }
    if (!subject.trim()) {
      setErrorMessage('과목명을 선택하거나 입력해주세요.');
      return;
    }
    if (!title.trim()) {
      setErrorMessage('과제 제목을 입력해주세요.');
      return;
    }
    if (!content.trim() && attachments.length === 0 && links.length === 0) {
      setErrorMessage('과제 내용이나 첨부 파일, 링크 중 하나 이상을 입력해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Save Profile if remember checked
      if (rememberProfile) {
        saveStoredStudentProfile({
          grade,
          classNum,
          studentId: studentId.trim(),
          studentName: studentName.trim(),
        });
      }

      // Save submission to localStorage
      saveSubmission({
        grade,
        classNum,
        studentId: studentId.trim(),
        studentName: studentName.trim(),
        subject: subject.trim(),
        title: title.trim(),
        content: content.trim(),
        links,
        attachments,
        assignmentId: selectedTask?.id,
      });

      setSuccessMessage('과제가 로컬스토리지에 성공적으로 등록되었습니다!');
      setIsSubmitting(false);

      // Trigger callback after brief confirmation
      setTimeout(() => {
        onSubmissionSuccess();
      }, 1200);
    } catch (err: any) {
      console.error('Submission error:', err);
      setErrorMessage('과제 저장 중 오류가 발생했습니다: ' + (err?.message || '용량 초과'));
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top Banner Card */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-2xl p-5 sm:p-6 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/20">
            <UploadCloud className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight">
              학생 과제 올리기 (로컬 스토리지 자동 저장)
            </h2>
            <p className="text-xs sm:text-sm text-blue-100 mt-1">
              대진전자통신고 학생들을 위한 과제 제출 포털입니다. PC와 모바일에서 사진, 보고서, 소스코드 링크를 간편하게 제출하세요.
            </p>
          </div>
        </div>
      </div>

      {/* Task notice link if selected */}
      {selectedTask && (
        <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 flex items-start justify-between gap-3 text-xs">
          <div>
            <span className="font-bold text-blue-900 block text-sm">
              선택된 과제 공지: {selectedTask.title}
            </span>
            <p className="text-blue-700 mt-0.5">{selectedTask.description}</p>
            <span className="text-blue-500 mt-1 block">
              마감일: {selectedTask.dueDate} · 담당: {selectedTask.teacherName}
            </span>
          </div>
          <button
            onClick={() => setSelectedTask(null)}
            className="text-blue-400 hover:text-blue-700 font-medium"
          >
            선택 해제
          </button>
        </div>
      )}

      {/* Main Submission Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl p-5 sm:p-8 border border-slate-200 shadow-xs space-y-6"
      >
        {/* Error and Success Alerts */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2.5 text-xs text-red-800">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2.5 text-xs font-semibold text-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* 1. Grade and Class Selector (1~10반 strictly) */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            1. 학년 및 학급 선택 (1반 ~ 10반)
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Grade Tabs */}
            <div>
              <span className="text-xs text-slate-500 block mb-1.5 font-medium">학년</span>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl">
                {ALLOWED_GRADES.map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGrade(g)}
                    className={`py-2 text-xs font-bold rounded-lg transition-all ${
                      grade === g
                        ? 'bg-white text-blue-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {g}학년
                  </button>
                ))}
              </div>
            </div>

            {/* Department indicator */}
            <div>
              <span className="text-xs text-slate-500 block mb-1.5 font-medium">학과 구분</span>
              <div className="py-2.5 px-3 bg-blue-50/70 border border-blue-100 rounded-xl text-xs font-bold text-blue-900 flex items-center justify-between">
                <span>{CLASS_DEPARTMENTS[classNum]}</span>
                <span className="text-[11px] font-normal text-blue-600">
                  {classNum}반 전공
                </span>
              </div>
            </div>
          </div>

          {/* 10 Classes Selector */}
          <div>
            <span className="text-xs text-slate-500 block mb-1.5 font-medium">
              학급 (1반 ~ 10반 원터치 선택)
            </span>
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5">
              {ALLOWED_CLASSES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setClassNum(c)}
                  className={`py-2 text-center rounded-xl text-xs font-bold transition-all border ${
                    classNum === c
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs scale-102'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {c}반
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 2. Student Info (Student ID & Name) */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            2. 학생 정보 입력
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-600 mb-1 font-medium">
                학번 (5자리)
              </label>
              <input
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="예: 10215 (1학년 2반 15번)"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-xs text-slate-600 mb-1 font-medium">
                학생 이름
              </label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="예: 홍길동"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                required
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="rememberProfile"
              checked={rememberProfile}
              onChange={(e) => setRememberProfile(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
            />
            <label
              htmlFor="rememberProfile"
              className="text-xs text-slate-600 cursor-pointer"
            >
              이 기기에 내 학번과 이름을 저장하여 다음에도 자동으로 입력하기
            </label>
          </div>
        </div>

        {/* 3. Subject and Title */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            3. 과목 및 과제 제목
          </label>

          <div>
            <label className="block text-xs text-slate-600 mb-1.5 font-medium">
              과목 선택 (빠른 선택 또는 직접 입력)
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {currentSuggestions.map((sub) => (
                <button
                  key={sub}
                  type="button"
                  onClick={() => setSubject(sub)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
                    subject === sub
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="과목명 직접 입력 (예: 전자회로)"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              required
            />
          </div>

          <div>
            <label className="block text-xs text-slate-600 mb-1 font-medium">
              과제 제목
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예: 옴의 법칙 및 멀티미터 측정 실험 보고서"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              required
            />
          </div>
        </div>

        {/* 4. Content & Description */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            4. 과제 내용 및 실습 설명
          </label>
          <textarea
            rows={5}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="실험 결과, 소스코드 설명, 문제 풀이 또는 과제 요약 내용을 자세히 작성해주세요..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 resize-y"
          />
        </div>

        {/* 5. External Links (GitHub, Notion, etc.) */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            5. 참고 링크 첨부 (깃허브 / 노션 / 구글 드라이브)
          </label>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={linkInput}
                onChange={(e) => setLinkInput(e.target.value)}
                placeholder="https://github.com/... 또는 공유 URL"
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-mono"
              />
            </div>
            <button
              type="button"
              onClick={addLink}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold shrink-0"
            >
              추가
            </button>
          </div>

          {links.length > 0 && (
            <div className="space-y-1.5 mt-2">
              {links.map((link, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-blue-700 font-mono"
                >
                  <a
                    href={link}
                    target="_blank"
                    rel="noreferrer"
                    className="truncate hover:underline"
                  >
                    {link}
                  </a>
                  <button
                    type="button"
                    onClick={() => removeLink(idx)}
                    className="text-slate-400 hover:text-red-600 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 6. File Attachments (Images, PDF, Code, .pkt) */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            6. 파일 첨부 (사진, 보고서, 실습 파일)
          </label>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            multiple
            className="hidden"
            accept="image/*,.pdf,.txt,.zip,.c,.cpp,.py,.java,.pkt,.vhd,.doc,.docx,.hwp"
          />

          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 hover:border-blue-500 bg-slate-50/50 hover:bg-blue-50/30 rounded-2xl p-6 text-center cursor-pointer transition-all"
          >
            <UploadCloud className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-xs sm:text-sm font-bold text-slate-700">
              클릭하거나 파일을 이곳에 드래그하여 업로드
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              이미지(PNG/JPG), PDF, 회로 캡처, 소스코드(.py, .c, .pkt) 지원 (개별 파일 최대 5MB)
            </p>
          </div>

          {/* Attachment Preview List */}
          {attachments.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
              {attachments.map((att) => (
                <div
                  key={att.id}
                  className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 bg-white shadow-2xs gap-2"
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    {att.type.startsWith('image/') && att.dataUrl ? (
                      <img
                        src={att.dataUrl}
                        alt={att.name}
                        className="w-10 h-10 object-cover rounded-lg border border-slate-200 shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                    )}

                    <div className="overflow-hidden">
                      <span className="text-xs font-semibold text-slate-800 block truncate">
                        {att.name}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {(att.size / 1024).toFixed(1)} KB
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeAttachment(att.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-bold text-sm shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <UploadCloud className="w-4 h-4" />
            <span>{isSubmitting ? '저장 중...' : '과제 제출하기'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
