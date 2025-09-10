import { useDispatch } from "react-redux";
import { showSuccess, showError } from "@/store/notificationSlice";

export const useNotifications = () => {
  const dispatch = useDispatch();

  const notify = {
    success: (message: string) => dispatch(showSuccess(message)),
    error: (message: string) => dispatch(showError(message)),
  };

  return notify;
};

export default useNotifications;
