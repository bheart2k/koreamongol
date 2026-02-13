import { auth } from '@/lib/auth';
import { Users, FileText, Image, TrendingUp } from 'lucide-react';

export default async function AdminDashboard() {
  const session = await auth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">대시보드</h1>
        <p className="text-muted-foreground">
          안녕하세요, {session?.user?.name}님
        </p>
      </div>

      {/* 통계 카드 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="전체 회원"
          value="-"
          icon={Users}
          description="준비 중"
        />
        <StatCard
          title="오늘 방문"
          value="-"
          icon={TrendingUp}
          description="준비 중"
        />
        <StatCard
          title="콘텐츠"
          value="-"
          icon={FileText}
          description="준비 중"
        />
        <StatCard
          title="이미지"
          value="-"
          icon={Image}
          description="준비 중"
        />
      </div>

      {/* 빠른 액션 */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">빠른 액션</h2>
          <div className="space-y-2 text-muted-foreground">
            <p>• 고객 관리 → 회원 목록 확인</p>
            <p>• 이미지 관리 → 캐릭터/일반 이미지 업로드</p>
            <p>• 콘텐츠 → 학습 자료/문구 관리</p>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">내 정보</h2>
          <div className="space-y-2 text-sm">
            <p><span className="text-muted-foreground">이메일:</span> {session?.user?.email}</p>
            <p><span className="text-muted-foreground">등급:</span> Grade {session?.user?.grade}</p>
            <p><span className="text-muted-foreground">권한:</span> {getGradeLabel(session?.user?.grade)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, description }) {
  return (
    <div className="rounded-xl border bg-card p-6">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <Icon className="size-4 text-muted-foreground" />
      </div>
      <div className="mt-2">
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

function getGradeLabel(grade) {
  if (grade <= 10) return '개발자';
  if (grade <= 20) return '관리자';
  return '일반';
}
