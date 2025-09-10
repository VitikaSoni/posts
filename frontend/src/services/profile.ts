import api from "@/configs/axios";

export interface ProfileResponse {
  name: string;
  username: string;
  role: "admin" | "user";
}

export interface UpdateProfileRequest {
  name: string;
}

const BASE_PATH = "/profile";

export const ProfileService = {
  getProfile: async function (): Promise<ProfileResponse> {
    const res = await api.get(`${BASE_PATH}`);
    return res.data;
  },
  updateProfile: async function (
    data: UpdateProfileRequest
  ): Promise<ProfileResponse> {
    const res = await api.put(`${BASE_PATH}`, data);
    return res.data;
  },
};
