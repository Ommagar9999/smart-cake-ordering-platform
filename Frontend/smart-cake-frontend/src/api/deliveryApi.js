
import apiRequest from "./apiClient";

// ==========================================
// GET DELIVERIES BY DELIVERY PERSON
// ==========================================

export const getDeliveriesByPerson = async (deliveryPersonId) => {
  return apiRequest(`/api/deliveries/person/${deliveryPersonId}`);
};

// ==========================================
// GET DELIVERY BY ID
// ==========================================

export const getDeliveryById = async (deliveryId) => {
  return apiRequest(`/api/deliveries/${deliveryId}`);
};

// ==========================================
// GET DELIVERY BY ORDER ID
// ==========================================

export const getDeliveryByOrderId = async (orderId) => {
  return apiRequest(`/api/deliveries/order/${orderId}`);
};

// ==========================================
// START DELIVERY
// ==========================================

export const startDelivery = async (deliveryId) => {
  return apiRequest(`/api/deliveries/${deliveryId}/start`, {
    method: "PUT",
  });
};

// ==========================================
// VERIFY OTP / COMPLETE DELIVERY
// ==========================================

export const verifyDeliveryOtp = async (deliveryId, otp) => {
  return apiRequest(
    `/api/deliveries/${deliveryId}/verify-otp?otp=${encodeURIComponent(otp)}`,
    {
      method: "PUT",
    }
  );
};

