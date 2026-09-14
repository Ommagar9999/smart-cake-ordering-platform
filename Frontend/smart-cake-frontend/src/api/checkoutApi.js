import apiRequest from "./apiClient";

export const createOrder = async (data) => {
  return apiRequest("/api/orders", {
    method: "POST",
    body: JSON.stringify(data),
  });
};