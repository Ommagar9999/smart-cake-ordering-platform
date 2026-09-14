import apiRequest from "./apiClient";

export const getAllCakes = async () => {
  return apiRequest("/api/cakes");
};

export const getCakeById = async (id) => {
  return apiRequest(`/api/cakes/${id}`);
};

export const searchCakes = async (name) => {
  return apiRequest(
    `/api/cakes/search?name=${encodeURIComponent(name)}`
  );
};

export const getCakesByCategory = async (category) => {
  return apiRequest(
    `/api/cakes/category/${encodeURIComponent(category)}`
  );
};

export const getAvailableCakes = async () => {
  return apiRequest("/api/cakes/available");
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