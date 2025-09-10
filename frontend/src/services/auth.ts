import api from "@/configs/axios";

export interface LoginResponse {
  accessToken: string;
}

export interface RefreshResponse {
  accessToken: string;
  username: string;
}

const BASE_PATH = "/auth";

export const AuthService = {
  registerUser: async function (
    name: string,
    username: string,
    password: string,
    role?: string
  ) {
    const res = await api.post(`${BASE_PATH}/register`, {
      name,
      username,
      password,
      role,
    });
    return res.data;
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
  refreshAccessToken: async function (): Promise<RefreshResponse> {
    const res = await api.post(`${BASE_PATH}/refresh_token`, {});
    return res.data;
  },
  logoutUser: async function () {
    await api.post(`${BASE_PATH}/logout`, {});
  },
};
