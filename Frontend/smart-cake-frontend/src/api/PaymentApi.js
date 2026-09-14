
import apiRequest from "./apiClient";

// ==========================================
// CREATE RAZORPAY ORDER
// ==========================================

export const createPayment = async (data) => {
  return apiRequest("/api/payments/create", {
    method: "POST",
    body: JSON.stringify(data),
  });
};


// ==========================================
// VERIFY RAZORPAY PAYMENT
// ==========================================

export const verifyPayment = async (data) => {
  return apiRequest("/api/payments/verify", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

