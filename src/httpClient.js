import axios from "axios";
import { useAppSore } from "./store/appStore";

export const httpClient = axios.create({
  baseURL: "http://localhost:4000",
  withCredentials: true,
});

const setLoading = useAppSore.getState().setLoading;

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
    return Promise.reject(error);
  }
);
