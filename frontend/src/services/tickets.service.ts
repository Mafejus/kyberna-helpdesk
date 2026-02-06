
import api from "@/lib/api";

export interface TicketListParams {
  status?: string;
  filter?: string; // 'assigned' etc.
  limit?: number;
  cursor?: string;
}

export const TicketsService = {
  list: async (params: TicketListParams) => {
    const response = await api.get('/tickets', { params });
    // Normalize response: legacy endpoint returned array, new one returns { items, nextCursor }
    // But if we only updated backend to always return object now? 
    // Yes, backend change was: return { items, nextCursor }
    // So we assume valid new structure.
    return response.data;
  },
  
  // Keep other methods if we were refactoring fully, but strictly requested just 'list' for now
  // to support pagination task.
};
