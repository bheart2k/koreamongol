import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function SettingsPage() {
  const session = await auth();

  // grade 1만 접근 가능
  if (session?.user?.grade !== 1) {
    redirect('/admin');
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">설정</h1>
      <div className="rounded-xl border bg-card p-6">
        <p className="text-muted-foreground">
          최고 관리자 전용 설정 페이지입니다.
        </p>
        <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
          <li>• 사용자 권한 관리</li>
          <li>• 시스템 설정</li>
        </ul>
      </div>
    </div>
  );
}
