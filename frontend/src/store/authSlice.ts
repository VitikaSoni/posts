// src/store/authSlice.ts
import { AuthService } from "@/services/auth";
import { decodeJWT } from "@/utils/jwt";
import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";

interface AuthState {
  accessToken: string | null;
  username: string | null;
  role: string | null;
}

const initialState: AuthState = {
  accessToken: null,
  username: null,
  role: null,
};

export const logout = createAsyncThunk("auth/logout", async () => {
  await AuthService.logoutUser();
  return null;
});

export const refreshAccessToken = createAsyncThunk(
  "auth/refreshAccessToken",
  async () => {
    const data = await AuthService.refreshAccessToken();
    return data;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ accessToken: string }>) => {
      state.accessToken = action.payload.accessToken;

      // Extract role from JWT token
      const decoded = decodeJWT(action.payload.accessToken);
      state.role = decoded?.role || null;
      state.username = decoded?.username || null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(logout.fulfilled, (state) => {
        state.accessToken = null;
        state.username = null;
        state.role = null;
      })
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken;

        // Extract role from new token
        const decoded = decodeJWT(action.payload.accessToken);
        state.role = decoded?.role || null;
        state.username = decoded?.username || null;
      })
      .addCase(refreshAccessToken.rejected, (state) => {
        // If refresh fails, clear the auth state
        state.accessToken = null;
        state.username = null;
        state.role = null;
      });
  },
});

export const { setCredentials } = authSlice.actions;
export default authSlice.reducer;
