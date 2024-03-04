import { Slide, toast } from "react-toastify";

export const successTost = (message: string) => {
  toast.success(message, {
    position: "top-center",
    autoClose: 2000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: 0,
    theme: "light",
    transition: Slide,
  });
};

export const errorTost = (message: string) => {
  toast.error(message, {
    position: "top-center",
    autoClose: 2000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: 0,
    theme: "light",
    transition: Slide,
  });
};

export const warningTost = (message: string) => {
  toast.warning(message, {
    position: "top-center",
    autoClose: 2000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: 0,
    theme: "light",
    transition: Slide,
  });
};
