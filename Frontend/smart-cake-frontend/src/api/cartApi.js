import apiRequest from "./apiClient";

export const getCart = async () => {
  return apiRequest("/api/cart");
};

export const addToCart = async (data) => {
  return apiRequest("/api/cart", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const updateCartItem = async (id, quantity) => {
  return apiRequest(`/api/cart/${id}?quantity=${quantity}`, {
    method: "PUT",
  });
};

export const removeCartItem = async (id) => {
  return apiRequest(`/api/cart/${id}`, {
    method: "DELETE",
  });
};

export const clearCart = async () => {
  return apiRequest("/api/cart", {
    method: "DELETE",
  });
};