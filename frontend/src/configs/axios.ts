import axios from "axios";
import { store } from "../store";
import { setCredentials, logout } from "@/store/authSlice";
import { AuthService } from "@/services/auth";
import { showError, showSuccess } from "@/store/notificationSlice";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // send cookies (refresh token) automatically
});

// Flag to prevent multiple simultaneous refresh attempts
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

// Request interceptor to attach access token
api.interceptors.request.use((config) => {
  const state = store.getState();
  const token = state.auth.accessToken;
  if (token && config.headers) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// Helper function to process failed queue
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });

  failedQueue = [];
};

// Response interceptor to handle 401, refresh token, and show notifications
api.interceptors.response.use(
  (res) => {
    // Show success notification for successful operations (except GET requests)
    // Only show if the backend explicitly provides a message
    if (res.config.method !== "get" && res.data?.message) {
      store.dispatch(showSuccess(res.data.message));
    }
    return res;
  },
  async (err) => {
    const originalRequest = err.config;

    // Don't retry refresh token endpoint to prevent infinite loops
    if (originalRequest.url?.includes("/refresh_token")) {
      return Promise.reject(err);
    }

    if (err.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const data = await AuthService.refreshAccessToken();
        store.dispatch(
          setCredentials({
            accessToken: data.accessToken,
          })
        );

        processQueue(null, data.accessToken);
        originalRequest.headers["Authorization"] = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch (e) {
        processQueue(e, null);
        store.dispatch(logout());
        return Promise.reject(e);
      } finally {
        isRefreshing = false;
      }
    }

    // Show error notification for API errors
    const errorMessage =
      err.response?.data?.message ||
      err.response?.data?.error ||
      err.message ||
      "An unexpected error occurred";

    store.dispatch(showError(errorMessage));

    return Promise.reject(err);
  }
);

export default api;
