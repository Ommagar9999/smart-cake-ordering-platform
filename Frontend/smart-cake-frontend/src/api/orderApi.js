import apiRequest from "./apiClient";

export const createOrder = async (data) => {
  return apiRequest("/api/orders", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const getOrders = async () => {
  return apiRequest("/api/orders");
};

export const getOrderById = async (id) => {
  return apiRequest(`/api/orders/${id}`);
};

export const cancelOrder = async (id) => {
  return apiRequest(`/api/orders/${id}/cancel`, {
    method: "PUT",
  });
};