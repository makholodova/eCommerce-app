import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
const defaultOptions = {
  autoClose: 3000,
  position: toast.POSITION.TOP_RIGHT,
  theme: toast.THEME.LIGHT,
  transition: toast.TRANSITIONS.SLIDE,
};
export const showSuccess = (message: string, onClose?: () => void): void => {
  toast.success(message, { ...defaultOptions, onClose });
};

export const showError = (message: string, onClose?: () => void): void => {
  toast.error(message, { ...defaultOptions, onClose });
};
