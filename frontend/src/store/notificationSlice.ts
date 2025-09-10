import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface Notification {
  id: string;
  message: string;
  type: "success" | "error" | "warning" | "info";
  duration?: number; // in milliseconds, 0 means no auto-dismiss
}

interface NotificationState {
  notifications: Notification[];
}

const initialState: NotificationState = {
  notifications: [],
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
    },
    clearAllNotifications: (state) => {
      state.notifications = [];
    },
    // Convenience actions for different notification types
    showSuccess: (state, action: PayloadAction<string>) => {
      const id = Math.random().toString(36).substr(2, 9);
      const notification: Notification = {
        id,
        message: action.payload,
        type: "success",
        duration: 4000,
      };

      // Add new notification to the beginning of the array (newest first)
      state.notifications.unshift(notification);

      // Limit to maximum 5 notifications to prevent screen overflow
      if (state.notifications.length > 5) {
        state.notifications = state.notifications.slice(0, 5);
      }
    },
    showError: (state, action: PayloadAction<string>) => {
      const id = Math.random().toString(36).substr(2, 9);
      const notification: Notification = {
        id,
        message: action.payload,
        type: "error",
        duration: 8000, // Errors stay longer
      };

      // Add new notification to the beginning of the array (newest first)
      state.notifications.unshift(notification);

      // Limit to maximum 5 notifications to prevent screen overflow
      if (state.notifications.length > 5) {
        state.notifications = state.notifications.slice(0, 5);
      }
    },
  },
});

export const {
  removeNotification,
  clearAllNotifications,
  showSuccess,
  showError,
} = notificationSlice.actions;

export default notificationSlice.reducer;
