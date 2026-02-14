import { create } from 'zustand';

let lastFetchTime = 0;
const MIN_INTERVAL = 30000; // 최소 30초 간격

export const useAdminNotifications = create((set, get) => ({
  inbox: 0,
  loading: false,

  // 알림 카운트 조회 (30초 디바운스)
  fetchNotifications: async (force = false) => {
    if (get().loading) return;

    const now = Date.now();
    if (!force && now - lastFetchTime < MIN_INTERVAL) return;
    lastFetchTime = now;

    set({ loading: true });
    try {
      const res = await fetch('/api/admin/notifications');
      if (res.ok) {
        const data = await res.json();
        set({ inbox: data.inbox });
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      set({ loading: false });
    }
  },

  // inbox 카운트 감소 (상태 변경 시)
  decrementInbox: () => {
    set((state) => ({ inbox: Math.max(0, state.inbox - 1) }));
  },
}));
