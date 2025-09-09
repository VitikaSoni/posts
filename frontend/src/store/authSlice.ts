// src/store/authSlice.ts
import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import axios from "axios";

interface AuthState {
  accessToken: string | null;
  username: string | null;
}

const initialState: AuthState = { accessToken: null, username: null };

export const logout = createAsyncThunk("auth/logout", async () => {
  await axios.post(
    "http://localhost:3001/auth/logout",
    {},
    { withCredentials: true }
  );
  return null;
});

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
    builder.addCase(logout.fulfilled, (state) => {
      state.accessToken = null;
      state.username = null;
    });
  },
});

export const { setCredentials } = authSlice.actions;
export default authSlice.reducer;
