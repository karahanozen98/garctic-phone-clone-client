import axios from "axios";
import { useAppStore } from "./store/appStore";
import { toast } from "react-toastify";

export const httpClient = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
  withCredentials: true,
});

const setLoading = useAppStore.getState().setLoading;

httpClient.interceptors.request.use((value) => {
  setLoading(true);
  return value;
});

httpClient.interceptors.response.use(
  (value) => {
    setLoading(false);
    return value;
  },
  (error) => {
    setLoading(false);
    toast.error(error.response?.data?.result ?? error.message);
    return Promise.reject(error);
  }
);
