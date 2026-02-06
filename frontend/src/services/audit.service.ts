import api from "@/lib/api";

export interface AuditLogParams {
  entityType?: string;
  entityId?: string;
  userId?: string;
  limit?: number;
  cursor?: string;
}

export const AuditService = {
  getLogs: async (params: AuditLogParams) => {
    const response = await api.get('/audit', { params });
    return response.data;
  }
};
