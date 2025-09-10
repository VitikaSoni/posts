// src/store/authSlice.ts
import { AuthService } from "@/services/auth";
import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";

interface AuthState {
  accessToken: string | null;
  username: string | null;
}

const initialState: AuthState = { accessToken: null, username: null };

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
    setCredentials: (
      state,
      action: PayloadAction<{ accessToken: string; username: string }>
    ) => {
      state.accessToken = action.payload.accessToken;
      state.username = action.payload.username;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(logout.fulfilled, (state) => {
        state.accessToken = null;
        state.username = null;
      })
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken;
        // Keep the existing username, don't update it on refresh
      })
      .addCase(refreshAccessToken.rejected, (state) => {
        // If refresh fails, clear the auth state
        state.accessToken = null;
        state.username = null;
      });
  },
});

export const { setCredentials } = authSlice.actions;
export default authSlice.reducer;
