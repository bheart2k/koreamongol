'use client';

import { SessionProvider } from 'next-auth/react';

export function AuthProvider({ children, session }) {
  return (
    <SessionProvider basePath="/api/auth" session={session}>
      {children}
    </SessionProvider>
  );
}
