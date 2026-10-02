'use client';

import React, { useState, useEffect } from 'react';
import {
  FileCheck2,
  Search,
  Filter,
  Trash2,
  Eye,
  Download,
  ExternalLink,
  Layers,
  Calendar,
  User,
  Paperclip,
  CheckCircle,
  RotateCcw,
  Sparkles,
  MessageSquare,
  PlusCircle,
  X,
  Plus,
} from 'lucide-react';
import {
  HomeworkSubmission,
  HomeworkTaskNotice,
  getStoredSubmissions,
  getStoredTasks,
  deleteSubmission,
  resetHomeworkStorage,
  updateSubmissionStatus,
  saveHomeworkTask,
} from '@/lib/homework-storage';
import {
  ALLOWED_CLASSES,
  ALLOWED_GRADES,
  CLASS_DEPARTMENTS,
} from '@/lib/school-info';

interface HomeworkListSectionProps {
  onGoToSubmit: (grade?: number, classNum?: number, subject?: string, taskId?: string) => void;
}

export function HomeworkListSection({ onGoToSubmit }: HomeworkListSectionProps) {
  const [submissions, setSubmissions] = useState<HomeworkSubmission[]>([]);
  const [tasks, setTasks] = useState<HomeworkTaskNotice[]>([]);
  const [selectedGrade, setSelectedGrade] = useState<number | 'all'>('all');
  const [selectedClass, setSelectedClass] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected submission for detail modal
  const [activeSubmission, setActiveSubmission] = useState<HomeworkSubmission | null>(null);

  // New task notice modal state
  const [isTaskModalOpen, setIsTaskModalOpen] = useState<boolean>(false);
  const [newTaskGrade, setNewTaskGrade] = useState<number>(1);
  const [newTaskClass, setNewTaskClass] = useState<number>(2);
  const [newTaskSubject, setNewTaskSubject] = useState<string>('전자회로');
  const [newTaskTitle, setNewTaskTitle] = useState<string>('');
  const [newTaskDesc, setNewTaskDesc] = useState<string>('');
  const [newTaskDue, setNewTaskDue] = useState<string>('2026-10-20 23:59');
  const [newTaskTeacher, setNewTaskTeacher] = useState<string>('선생님');

  const refreshData = () => {
    setSubmissions(getStoredSubmissions());
    setTasks(getStoredTasks());
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Filter submissions
  const filteredSubmissions = submissions.filter((item) => {
    if (selectedGrade !== 'all' && item.grade !== selectedGrade) return false;
    if (selectedClass !== 'all' && item.classNum !== selectedClass) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchName = item.studentName.toLowerCase().includes(q);
      const matchId = item.studentId.toLowerCase().includes(q);
      const matchSub = item.subject.toLowerCase().includes(q);
      if (!matchTitle && !matchName && !matchId && !matchSub) return false;
    }
    return true;
  });

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('이 과제 제출 내역을 정말 삭제하시겠습니까?')) {
      deleteSubmission(id);
      refreshData();
      if (activeSubmission?.id === id) setActiveSubmission(null);
    }
  };

  const handleResetData = () => {
    if (confirm('과제 및 공지 데이터를 초기 샘플 상태로 복원하시겠습니까?')) {
      resetHomeworkStorage();
      refreshData();
    }
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    saveHomeworkTask({
      grade: newTaskGrade,
      classNum: newTaskClass,
      subject: newTaskSubject,
      title: newTaskTitle.trim(),
      description: newTaskDesc.trim(),
      dueDate: newTaskDue,
      teacherName: newTaskTeacher.trim(),
    });
    setIsTaskModalOpen(false);
    setNewTaskTitle('');
    setNewTaskDesc('');
    refreshData();
  };

  return (
    <div className="space-y-6">
      {/* 1. Assigned Task Notices (선생님이 등록한 과제 공지) */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900">
              학급별 과제 공지 및 마감일 안내
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsTaskModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-semibold flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>새 과제 공지 등록</span>
            </button>
          </div>
        </div>

        {/* Task Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-blue-50/30 transition-all flex flex-col justify-between gap-3"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                      {task.grade}학년 {task.classNum}반
                    </span>
                    <span className="font-semibold text-slate-700">{task.subject}</span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-500">{CLASS_DEPARTMENTS[task.classNum]}</span>
                  </div>
                  <span className="text-[11px] font-mono text-red-600 font-semibold bg-red-50 px-2 py-0.5 rounded">
                    마감: {task.dueDate}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900 line-clamp-1">{task.title}</h4>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2">{task.description}</p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-xs">
                <span className="text-slate-400">출제: {task.teacherName}</span>
                <button
                  onClick={() =>
                    onGoToSubmit(task.grade, task.classNum, task.subject, task.id)
                  }
                  className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shadow-2xs"
                >
                  이 과제 제출하기 →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Submitted Assignments Board */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-5">
        {/* Header & Filter Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-blue-600" />
              <span>로컬 스토리지 제출 과제함</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold">
                총 {filteredSubmissions.length}건
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              이 브라우저 로컬 스토리지에 안전하게 보관된 학생 제출 내역입니다.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetData}
              className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium px-2.5 py-1.5 rounded-lg border border-slate-200"
              title="샘플 데이터 복원"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>샘플 복원</span>
            </button>
          </div>
        </div>

        {/* Filters Row: Grade, Class (1~10반), Search */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200/70">
          {/* Grade filter */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">학년 필터</label>
            <select
              value={selectedGrade}
              onChange={(e) =>
                setSelectedGrade(e.target.value === 'all' ? 'all' : Number(e.target.value))
              }
              className="w-full text-xs font-semibold px-2.5 py-2 rounded-lg bg-white border border-slate-300 focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">전체 학년 (1~3학년)</option>
              <option value="1">1학년</option>
              <option value="2">2학년</option>
              <option value="3">3학년</option>
            </select>
          </div>

          {/* Class filter (1~10반) */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">
              학급 필터 (1반 ~ 10반)
            </label>
            <select
              value={selectedClass}
              onChange={(e) =>
                setSelectedClass(e.target.value === 'all' ? 'all' : Number(e.target.value))
              }
              className="w-full text-xs font-semibold px-2.5 py-2 rounded-lg bg-white border border-slate-300 focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">전체 학급 (1~10반)</option>
              {ALLOWED_CLASSES.map((c) => (
                <option key={c} value={c}>
                  {c}반 ({CLASS_DEPARTMENTS[c]})
                </option>
              ))}
            </select>
          </div>

          {/* Search Query */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-1">검색</label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="제목, 학생명, 학번, 과목..."
                className="w-full text-xs pl-8 pr-3 py-2 rounded-lg bg-white border border-slate-300 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Submissions List / Cards */}
        {filteredSubmissions.length === 0 ? (
          <div className="py-12 text-center border-2 border-dashed border-slate-200 rounded-2xl">
            <FileCheck2 className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">제출된 과제가 없습니다.</p>
            <p className="text-xs text-slate-400 mt-1">
              상단의 &apos;과제 올리기&apos; 탭에서 과제를 등록해보세요.
            </p>
            <button
              onClick={() => onGoToSubmit()}
              className="mt-3 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs"
            >
              과제 제출하러 가기
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredSubmissions.map((sub) => (
              <div
                key={sub.id}
                onClick={() => setActiveSubmission(sub)}
                className="p-4 rounded-xl border border-slate-200 hover:border-blue-400 bg-white hover:bg-blue-50/20 transition-all cursor-pointer shadow-2xs space-y-2 group"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                      {sub.grade}학년 {sub.classNum}반
                    </span>
                    <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                      {sub.subject}
                    </span>
                    <span className="text-xs font-medium text-slate-600">
                      {sub.studentName} ({sub.studentId})
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-slate-400">
                      {new Date(sub.createdAt).toLocaleDateString('ko-KR')}
                    </span>
                    <button
                      onClick={(e) => handleDelete(sub.id, e)}
                      className="text-slate-300 hover:text-red-600 p-1 transition-colors"
                      title="삭제"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                  {sub.title}
                </h4>

                <p className="text-xs text-slate-600 line-clamp-2">{sub.content}</p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
                  <div className="flex items-center gap-3">
                    {sub.attachments.length > 0 && (
                      <span className="flex items-center gap-1 text-slate-600">
                        <Paperclip className="w-3.5 h-3.5" />
                        <span>첨부파일 {sub.attachments.length}개</span>
                      </span>
                    )}
                    {sub.links.length > 0 && (
                      <span className="flex items-center gap-1 text-blue-600">
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>링크 {sub.links.length}개</span>
                      </span>
                    )}
                  </div>

                  {sub.teacherFeedback ? (
                    <span className="flex items-center gap-1 text-emerald-700 font-medium">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>피드백 도착</span>
                    </span>
                  ) : (
                    <span className="text-slate-400">상세보기 →</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. Detail Submission Modal */}
      {activeSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50">
              <div>
                <div className="flex items-center gap-2 text-xs text-blue-700 font-bold mb-1">
                  <span>{activeSubmission.grade}학년 {activeSubmission.classNum}반</span>
                  <span>·</span>
                  <span>{activeSubmission.subject}</span>
                  <span>·</span>
                  <span>{activeSubmission.studentName} ({activeSubmission.studentId})</span>
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  {activeSubmission.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveSubmission(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto p-5 sm:p-6 space-y-4 text-xs sm:text-sm">
              <div>
                <span className="text-xs font-bold text-slate-500 block mb-1">과제 내용</span>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 whitespace-pre-wrap leading-relaxed font-sans">
                  {activeSubmission.content || '(작성된 내용이 없습니다)'}
                </div>
              </div>

              {/* Links */}
              {activeSubmission.links.length > 0 && (
                <div>
                  <span className="text-xs font-bold text-slate-500 block mb-1">참고 링크</span>
                  <div className="space-y-1">
                    {activeSubmission.links.map((link, idx) => (
                      <a
                        key={idx}
                        href={link}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 p-2 rounded-lg bg-blue-50/70 border border-blue-100 text-blue-700 font-mono text-xs hover:underline truncate"
                      >
                        <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{link}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Attachments */}
              {activeSubmission.attachments.length > 0 && (
                <div>
                  <span className="text-xs font-bold text-slate-500 block mb-1.5">
                    첨부 파일 ({activeSubmission.attachments.length}개)
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {activeSubmission.attachments.map((att) => (
                      <div
                        key={att.id}
                        className="p-2.5 rounded-xl border border-slate-200 bg-white flex flex-col gap-2"
                      >
                        <div className="flex items-center gap-2 overflow-hidden">
                          <Paperclip className="w-4 h-4 text-blue-600 shrink-0" />
                          <span className="text-xs font-semibold text-slate-800 truncate">
                            {att.name}
                          </span>
                        </div>

                        {att.dataUrl && att.type.startsWith('image/') && (
                          <img
                            src={att.dataUrl}
                            alt={att.name}
                            className="w-full h-32 object-cover rounded-lg border border-slate-100"
                          />
                        )}

                        {att.dataUrl && (
                          <a
                            href={att.dataUrl}
                            download={att.name}
                            className="mt-1 w-full py-1 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-center text-xs font-semibold flex items-center justify-center gap-1"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>다운로드</span>
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Teacher feedback */}
              {activeSubmission.teacherFeedback && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
                  <span className="text-xs font-bold text-emerald-900 block mb-1">
                    선생님 피드백
                  </span>
                  <p className="text-xs text-emerald-800">
                    {activeSubmission.teacherFeedback}
                  </p>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                제출일시: {new Date(activeSubmission.createdAt).toLocaleString('ko-KR')}
              </span>
              <button
                onClick={() => setActiveSubmission(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. New Task Notice Modal */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">새 과제 공지 등록</h3>
              <button
                onClick={() => setIsTaskModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">학년</label>
                  <select
                    value={newTaskGrade}
                    onChange={(e) => setNewTaskGrade(Number(e.target.value))}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300"
                  >
                    <option value="1">1학년</option>
                    <option value="2">2학년</option>
                    <option value="3">3학년</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">학급 (1~10반)</label>
                  <select
                    value={newTaskClass}
                    onChange={(e) => setNewTaskClass(Number(e.target.value))}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300"
                  >
                    {ALLOWED_CLASSES.map((c) => (
                      <option key={c} value={c}>
                        {c}반 ({CLASS_DEPARTMENTS[c]})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">과목명</label>
                <input
                  type="text"
                  value={newTaskSubject}
                  onChange={(e) => setNewTaskSubject(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">과제 공지 제목</label>
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="예: 3주차 회로 실습 보고서 제출"
                  className="w-full text-xs p-2 rounded-lg border border-slate-300"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">과제 안내 내용</label>
                <textarea
                  rows={3}
                  value={newTaskDesc}
                  onChange={(e) => setNewTaskDesc(e.target.value)}
                  placeholder="과제 요구사항 및 제출 요령 작성..."
                  className="w-full text-xs p-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">마감일시</label>
                  <input
                    type="text"
                    value={newTaskDue}
                    onChange={(e) => setNewTaskDue(e.target.value)}
                    placeholder="YYYY-MM-DD HH:mm"
                    className="w-full text-xs p-2 rounded-lg border border-slate-300 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">담당 교사명</label>
                  <input
                    type="text"
                    value={newTaskTeacher}
                    onChange={(e) => setNewTaskTeacher(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsTaskModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white"
                >
                  등록하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
