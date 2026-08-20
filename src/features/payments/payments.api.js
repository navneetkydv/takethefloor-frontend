// src/features/payments/payments.api.js

import { api } from '../../lib/api.js';

export function createOrder({ planType, couponCode }) {
  return api.post('/payments/order', { planType, couponCode });
}

export function verifyPayment(razorpayResponse) {
  return api.post('/payments/verify', razorpayResponse);
}