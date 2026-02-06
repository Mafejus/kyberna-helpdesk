import api from "@/lib/api";

export const NotificationService = {
  getAll: async (unreadOnly?: boolean) => {
    const params = unreadOnly ? { unreadOnly: true } : {};
    const response = await api.get('/notifications', { params });
    return response.data;
  },

  getUnreadCount: async () => {
    const response = await api.get('/notifications/unread-count');
    return response.data.count;
  },

  markRead: async (id: string) => {
    const response = await api.post(`/notifications/${id}/read`);
    return response.data;
  },

  markAllRead: async () => {
    const response = await api.post('/notifications/read-all');
    return response.data;
  }
};
