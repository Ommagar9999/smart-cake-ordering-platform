import apiRequest from "./apiClient";

export const registerUser = async (data) => {
  return apiRequest("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const loginUser = async (data) => {
  return apiRequest("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
};