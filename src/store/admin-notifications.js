import { create } from 'zustand';

export const useAdminNotifications = create((set, get) => ({
  contacts: 0,
  feedback: 0,
  loading: false,

  // 알림 카운트 조회
  fetchNotifications: async () => {
    if (get().loading) return;

    set({ loading: true });
    try {
      const res = await fetch('/api/admin/notifications');
      if (res.ok) {
        const data = await res.json();
        set({ contacts: data.contacts, feedback: data.feedback });
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      set({ loading: false });
    }
  },

  // 문의 카운트 감소 (상태 변경 시)
  decrementContacts: () => {
    set((state) => ({ contacts: Math.max(0, state.contacts - 1) }));
  },

  // 피드백 카운트 감소 (상태 변경 시)
  decrementFeedback: () => {
    set((state) => ({ feedback: Math.max(0, state.feedback - 1) }));
  },
}));
