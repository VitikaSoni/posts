import axios from "axios";

// Use your backend URL
const API_URL = "http://localhost:3001/auth";

export interface LoginResponse {
  accessToken: string;
}

export const registerUser = async (
  username: string,
  password: string,
  role?: string
) => {
  const res = await axios.post(`${API_URL}/register`, {
    username,
    password,
    role,
  });
  return res.data;
};

export const loginUser = async (
  username: string,
  password: string
): Promise<LoginResponse> => {
  const res = await axios.post(
    `${API_URL}/login`,
    { username, password },
    { withCredentials: true }
  );
  // withCredentials:true ensures cookies (refresh token) are sent
  return res.data;
};

export const refreshAccessToken = async (): Promise<LoginResponse> => {
  const res = await axios.post(
    `${API_URL}/refresh_token`,
    {},
    { withCredentials: true }
  );
  return res.data;
};
