import Link from 'next/link';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full text-center space-y-4 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900">페이지를 찾을 수 없습니다</h2>
        <p className="text-sm text-slate-500">
          요청하신 페이지가 존재하지 않거나 경로가 변경되었습니다.
        </p>
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm"
          >
            <Home className="w-4 h-4" />
            <span>메인으로 이동</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
