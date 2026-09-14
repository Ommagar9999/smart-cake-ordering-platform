import apiRequest from "./apiClient";

// ==========================================
// USERS
// ==========================================

export const getAdminUsers = async () => {
  return apiRequest("/api/admin/users");
};

export const deleteUser = async (id) => {
  return apiRequest(`/api/admin/users/${id}`, {
    method: "DELETE",
  });
};

// ==========================================
// CAKES
// ==========================================

export const getAdminCakes = async () => {
  return apiRequest("/api/cakes");
};

export const createCake = async (data) => {
  return apiRequest("/api/cakes", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const updateCake = async (id, data) => {
  return apiRequest(`/api/cakes/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const deleteCake = async (id) => {
  return apiRequest(`/api/cakes/${id}`, {
    method: "DELETE",
  });
};

// ==========================================
// ORDERS
// ==========================================

export const getAdminOrders = async () => {
  return apiRequest("/api/orders");
};

export const getAdminOrderById = async (id) => {
  return apiRequest(`/api/orders/${id}`);
};

export const cancelOrder = async (id) => {
  return apiRequest(`/api/orders/${id}/cancel`, {
    method: "PUT",
  });
};

export const updateOrderStatus = async (id, status) => {
  return apiRequest(
    `/api/orders/${id}/status?status=${encodeURIComponent(status)}`,
    {
      method: "PUT",
    }
  );
};