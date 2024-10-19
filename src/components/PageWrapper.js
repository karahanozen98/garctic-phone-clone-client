import "../App.css";
import "react-toastify/dist/ReactToastify.css";
import { useAppStore } from "../store/appStore";
import CircularProgressWithBackdrop from "./CircularProgressWithBackdrop";
import { ToastContainer } from "react-toastify";
import { useEffect } from "react";
import { useAuthSore } from "../store/authStore";

export function PageWrapper({ isPrivate, children }) {
  const isLoading = useAppStore((state) => state.isLoading);
  const backgroundColor = useAppStore((state) => state.backgroundColor);
  const user = useAuthSore((state) => state.user);
  const handleAuthentication = useAuthSore(
    (state) => state.handleAuthentication
  );

  useEffect(() => {
    if (isPrivate) {
      handleAuthentication();
    }
  }, []);

  return (
    <div className={backgroundColor}>
      <CircularProgressWithBackdrop isLoading={isLoading} />
      <ToastContainer />
      {(user || !isPrivate) && children}
    </div>
  );
}
