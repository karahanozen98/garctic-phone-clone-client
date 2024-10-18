import "../App.css";
import "react-toastify/dist/ReactToastify.css";
import { useAppSore } from "../store/appStore";
import CircularProgressWithBackdrop from "./CircularProgressWithBackdrop";
import { ToastContainer } from "react-toastify";

export function PageWrapper({ children }) {
  const isLoading = useAppSore((state) => state.isLoading);

  return (
    <div className="app">
      <CircularProgressWithBackdrop isLoading={isLoading} />
      <ToastContainer />
      {children}
    </div>
  );
}
