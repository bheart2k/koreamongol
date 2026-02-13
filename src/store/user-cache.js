import { create } from 'zustand';

// 유저 정보 캐시 (깜빡임 방지용)
// 컴포넌트가 언마운트되어도 유지됨
export const useUserCache = create((set) => ({
  user: null,
  isAdmin: false,
  setUser: (user) => set({
    user,
    isAdmin: user?.grade <= 20
  }),
}));
