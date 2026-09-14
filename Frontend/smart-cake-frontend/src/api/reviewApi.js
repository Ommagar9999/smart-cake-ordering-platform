import apiRequest from "./apiClient";

export const getReviews = async (cakeId) => {
  return apiRequest(`/api/reviews/cake/${cakeId}`);
};

export const addReview = async (data) => {
  return apiRequest("/api/reviews", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const deleteReview = async (id) => {
  return apiRequest(`/api/reviews/${id}`, {
    method: "DELETE",
  });
};