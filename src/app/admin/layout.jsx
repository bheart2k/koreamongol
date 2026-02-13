import { auth, isAdmin } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { AdminShell } from '@/components/admin/AdminShell';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { AuthProvider } from '@/components/providers/auth-provider';
import { Toaster } from '@/components/ui/sonner';

export const metadata = {
  title: '관리자 - KoreaMongol',
  description: 'KoreaMongol 관리자 페이지',
};

export default async function AdminLayout({ children }) {
  // TODO: 임시 인증 우회 — Google OAuth 설정 완료 후 원복 필요
  // const session = await auth();
  // if (!session?.user) {
  //   redirect('/api/auth/signin?callbackUrl=/admin');
  // }
  // if (!isAdmin(session)) {
  //   redirect('/');
  // }
  const session = { user: { name: 'Dev', nickname: 'Dev', grade: 1, image: null } };

  return (
    <AuthProvider>
      <ThemeProvider>
        <AdminShell session={session}>{children}</AdminShell>
        <Toaster position="top-right" richColors />
      </ThemeProvider>
    </AuthProvider>
  );
}
