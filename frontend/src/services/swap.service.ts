import api from "@/lib/api";

export const SwapService = {
  listOffers: async (week?: string) => {
    const params = week ? { week } : {};
    const response = await api.get('/schedule/swaps', { params });
    return response.data;
  },

  createOffer: async (date: string, lesson: number) => {
    const response = await api.post('/schedule/swaps', { date, lesson });
    return response.data;
  },

  acceptOffer: async (swapId: string) => {
    const response = await api.post(`/schedule/swaps/${swapId}/accept`);
    return response.data;
  },

  cancelOffer: async (swapId: string) => {
    const response = await api.post(`/schedule/swaps/${swapId}/cancel`);
    return response.data;
  }
};
