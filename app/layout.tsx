import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '대진전자통신고등학교 시간표 & 과제 포털',
  description: '대진전자통신고등학교 NEIS 연동 학년·학급별(1~10반) 시간표 조회, 실시간 교시별 시작/종료 시간 안내, 로컬스토리지 과제 제출 및 관리 시스템',
  openGraph: {
    title: '대진전자통신고등학교 시간표 & 과제 포털',
    description: 'NEIS 시간표 조회, 실시간 교시 안내 및 로컬스토리지 학생 과제 제출 포털',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '대진전자통신고등학교 시간표 & 과제 포털',
    description: 'NEIS 시간표 조회, 실시간 교시 안내 및 로컬스토리지 학생 과제 제출 포털',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#1e3a8a',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className="h-full antialiased scroll-smooth">
      <body className="min-h-full bg-slate-50 text-slate-900 font-sans selection:bg-blue-600 selection:text-white" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
