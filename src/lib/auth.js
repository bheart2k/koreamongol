import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import { db, users, points } from '@/lib/db';
import { eq } from 'drizzle-orm';

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account.provider === 'google') {
        try {
          const [existingUser] = await db.select().from(users).where(eq(users.email, user.email)).limit(1);

          if (existingUser) {
            // 기존 사용자: lastLoginAt만 업데이트 (커스텀 프로필 이미지 유지)
            const updateData = { lastLoginAt: new Date(), updatedAt: new Date() };
            if (!existingUser.image) {
              updateData.image = user.image;
            }
            await db.update(users).set(updateData).where(eq(users.id, existingUser.id));
          } else {
            // 새 사용자 생성 (회원가입 보너스 100P 포함)
            const [newUser] = await db.insert(users).values({
              email: user.email,
              name: user.name,
              image: user.image,
              provider: 'google',
              providerId: account.providerAccountId,
              grade: 99,
              points: 100,
              totalPoints: 100,
              level: 1,
            }).returning();

            // 포인트 내역 기록
            await db.insert(points).values({
              userId: newUser.id,
              type: 'signup',
              points: 100,
              description: '회원가입 보너스',
              balanceAfter: 100,
            });
          }
          return true;
        } catch (error) {
          console.error('SignIn error:', error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account, trigger, session: updateSession }) {
      // 초기 로그인 시
      if (account && user) {
        const [dbUser] = await db.select().from(users).where(eq(users.email, user.email)).limit(1);
        if (dbUser) {
          token.grade = dbUser.grade;
          token.userId = String(dbUser.id);
          token.image = dbUser.image;
          token.nickname = dbUser.nickname;
        }
      }

      // 세션 업데이트 시 (update() 호출)
      if (trigger === 'update' && updateSession) {
        if (updateSession.image !== undefined) {
          token.image = updateSession.image;
        }
        if (updateSession.nickname !== undefined) {
          token.nickname = updateSession.nickname;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.grade = token.grade;
        session.user.id = token.userId;
        if (token.image) {
          session.user.image = token.image;
        }
        if (token.nickname) {
          session.user.nickname = token.nickname;
        }
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});

// 권한 체크 유틸
export function isDev(session) {
  if (!session?.user?.grade) return false;
  return session.user.grade <= 10;
}

export function isAdmin(session) {
  if (!session?.user?.grade) return false;
  return session.user.grade <= 20;
}

export function isLoggedIn(session) {
  return !!session?.user;
}

export const GRADE = {
  DEV_MAX: 10,
  ADMIN_MAX: 20,
  DEFAULT: 99,
};
