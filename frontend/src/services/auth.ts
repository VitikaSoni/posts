import api from "@/configs/axios";

export interface LoginResponse {
  accessToken: string;
}

const BASE_PATH = "/auth";

export const AuthService = {
  registerUser: async function (
    username: string,
    password: string,
    role?: string
  ) {
    api.post(`${BASE_PATH}/register`, {
      username,
      password,
      role,
    });
  },

  loginUser: async function (
    username: string,
    password: string
  ): Promise<LoginResponse> {
    const res = await api.post(`${BASE_PATH}/login`, {
      username,
      password,
    });
    // withCredentials:true ensures cookies (refresh token) are sent
    return res.data;
  },
  refreshAccessToken: async function (): Promise<LoginResponse> {
    const res = await api.post(`${BASE_PATH}/refresh_token`, {});
    return res.data;
  },
  logoutUser: async function () {
    await api.post(`${BASE_PATH}/logout`, {});
  },
};
