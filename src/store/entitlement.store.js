// src/store/entitlement.store.js
//
// Mirrors GET /api/payments/entitlement. Call fetch() once after sign-in,
// and again right after a successful payment (see features/payments) so
// the UI reflects paid status immediately without a full reload.

import { create } from 'zustand';
import { api } from '../lib/api.js';

export const useEntitlementStore = create((set) => ({
  isPaid: false,
  entitlement: null, // { planType, paidUntil } | null
  isLoading: false,
  hasFetched: false, // false until the first check completes — needed
                      // because isPaid:false alone can't tell "not
                      // checked yet" from "confirmed unpaid"

  fetch: async () => {
    set({ isLoading: true });
    try {
      const { isPaid, entitlement } = await api.get('/payments/entitlement');
      set({ isPaid, entitlement, isLoading: false, hasFetched: true });
    } catch (err) {
      console.error('Failed to fetch entitlement:', err);
      set({ isLoading: false, hasFetched: true });
    }
  },

  reset: () => set({ isPaid: false, entitlement: null, hasFetched: false }),
}));