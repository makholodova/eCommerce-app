import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
const defaultOptions = {
  autoClose: 3000,
  position: toast.POSITION.TOP_RIGHT,
  theme: toast.THEME.LIGHT,
  transition: toast.TRANSITIONS.SLIDE,
};
export const showSuccess = (message: string): void => {
  toast.success(message, defaultOptions);
};

export const showError = (message: string): void => {
  toast.error(message, defaultOptions);
};
