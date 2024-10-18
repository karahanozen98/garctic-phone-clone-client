import { useEffect, useState } from "react";
import { CANVAS_WIDTH } from "./constants";
import { httpClient } from "./httpClient";

export const useWindowSize = () => {
  const getSize = () => ({
    width: window.innerWidth,
    height: window.innerHeight,
    scale: window.innerWidth <= 640 ? 1 : 0.9,
  });

  const [size, setSize] = useState(getSize);

  const onResize = () => setSize(getSize);

  useEffect(() => {
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return size;
};

export const useUser = () => {
  const [user, setUser] = useState();
  const fetchUser = async () => {
    try {
      const response = await httpClient.get("/authentication/me");
      setUser(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUser();
  });

  return user;
};
