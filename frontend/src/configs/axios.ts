import axios from "axios";
import { store } from "../store";
import { setCredentials, logout } from "@/store/authSlice";
import { refreshAccessToken } from "@/services/auth";

const api = axios.create({
  baseURL: "http://localhost:3001",
  withCredentials: true, // send cookies (refresh token) automatically
});

// Request interceptor to attach access token
api.interceptors.request.use((config) => {
  const state = store.getState();
  const token = state.auth.accessToken;
  if (token && config.headers) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle 401 and refresh token
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;
    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const data = await refreshAccessToken();
        store.dispatch(
          setCredentials({
            accessToken: data.accessToken,
            username: store.getState().auth.username!,
          })
        );
        originalRequest.headers["Authorization"] = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch (e) {
        store.dispatch(logout());
        return Promise.reject(e);
      }
    }
    return Promise.reject(err);
  }
);

export default api;
