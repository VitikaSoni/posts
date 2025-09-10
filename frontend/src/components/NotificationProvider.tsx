import React, { useEffect } from "react";
import {
  Snackbar,
  Alert,
  IconButton,
  Slide,
  type SlideProps,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import { type RootState } from "@/store";
import { removeNotification } from "@/store/notificationSlice";

function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="up" />;
}

const NotificationProvider: React.FC = () => {
  const dispatch = useDispatch();
  const notifications = useSelector(
    (state: RootState) => state.notifications.notifications
  );

  const handleClose = (id: string) => {
    dispatch(removeNotification(id));
  };

  // Auto-remove notifications after their duration
  useEffect(() => {
    notifications.forEach((notification) => {
      if (notification.duration && notification.duration > 0) {
        const timer = setTimeout(() => {
          dispatch(removeNotification(notification.id));
        }, notification.duration);

        return () => clearTimeout(timer);
      }
    });
  }, [notifications, dispatch]);

  return (
    <>
      {notifications.map((notification) => (
        <Snackbar
          key={notification.id}
          open={true}
          autoHideDuration={notification.duration || null}
          onClose={() => handleClose(notification.id)}
          TransitionComponent={SlideTransition}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          sx={{
            position: "fixed",
            bottom: 16,
            right: 16,
            zIndex: 9999,
          }}
        >
          <Alert
            severity={notification.type}
            variant="outlined"
            onClose={() => handleClose(notification.id)}
            action={
              <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={() => handleClose(notification.id)}
                sx={{ opacity: 0.7 }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            }
            sx={{
              minWidth: 280,
              maxWidth: 400,
              borderRadius: 2,
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              "& .MuiAlert-message": {
                fontSize: "0.875rem",
                fontWeight: 500,
              },
            }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      ))}
    </>
  );
};

export default NotificationProvider;
