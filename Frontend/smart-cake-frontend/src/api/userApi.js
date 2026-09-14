import axios from "axios";

const API_URL = "http://localhost:8080/api/users";

export const getUserByEmail = async (email) => {

  const token = localStorage.getItem("token");

  const response = await axios.get(
    `${API_URL}/by-email`,
    {
      params: {
        email,
      },

      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};