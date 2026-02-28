
import api from "@/lib/api";

export interface TicketListParams {
  status?: string;
  filter?: string; // 'assigned' etc.
  technicianId?: string;
  limit?: number;
  cursor?: string;
}

export const TicketsService = {
  list: async (params: TicketListParams) => {
    const response = await api.get('/tickets', { params });
    const d = response.data;

    // Backend returns page-based { data, meta } — normalize to { items, nextCursor }
    // so usePaginatedList hook can consume it correctly.
    if (d && Array.isArray(d.data)) {
      const { data: items, meta } = d;
      // Derive a simple cursor: if current page < lastPage, pass next page number as string cursor
      const nextCursor =
        meta && meta.page < meta.lastPage ? String(meta.page + 1) : null;
      return { items, nextCursor };
    }

    // Already in { items, nextCursor } shape (future-proof)
    if (d && Array.isArray(d.items)) {
      return d;
    }

    // Bare array fallback
    if (Array.isArray(d)) {
      return { items: d, nextCursor: null };
    }

    return { items: [], nextCursor: null };
  },
};
