// src/features/payments/usePayment.js
//
// Orchestrates the full payment flow: create order -> open Razorpay
// Checkout -> verify on success -> refresh the entitlement store so the
// rest of the app immediately reflects paid status, no reload needed.

import { useState } from "react";
import { loadRazorpayScript } from "./loadRazorpay.js";
import { createOrder, verifyPayment } from "./payments.api.js";
import { useEntitlementStore } from "../../store/entitlement.store.js";
import { useAuthStore } from "../../store/auth.store.js";

export function usePayment() {
  const [status, setStatus] = useState("idle"); // idle | processing | error
  const [error, setError] = useState(null);
  const fetchEntitlement = useEntitlementStore((s) => s.fetch);
  const user = useAuthStore((s) => s.user);

  const pay = async ({ planType, couponCode }) => {
    setStatus("processing");
    setError(null);

    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded)
        throw new Error(
          "Could not load payment gateway. Check your connection.",
        );

      const order = await createOrder({ planType, couponCode });

      await new Promise((resolve, reject) => {
        const rzp = new window.Razorpay({
          key: order.razorpayKeyId,
          amount: order.amountPaise,
          currency: "INR",
          order_id: order.razorpayOrderId,
          name: "Take the Floor",
          prefill: {
            email: user?.email,
            name: user?.name,
            // only if you actually store this — omit otherwise
          },
          readonly: {
            email: true, // lock it to the logged-in user's email, don't let it be edited
          },
          hidden: {
            contact: true, // This will now work
          },
          theme: { color: "#8b5cf6" },
          handler: async (response) => {
            try {
              await verifyPayment(response);
              await fetchEntitlement();
              resolve();
            } catch (err) {
              reject(err);
            }
          },
          modal: {
            ondismiss: () => reject(new Error("Payment cancelled")),
          },
        });

        rzp.on("payment.failed", () =>
          reject(new Error("Payment failed. Please try again.")),
        );
        rzp.open();
      });

      setStatus("idle");
      return true;
    } catch (err) {
      console.error("Payment failed:", err);
      setStatus("error");
      setError(err.message || "Payment failed. Please try again.");
      return false;
    }
  };

  return { pay, status, error };
}
