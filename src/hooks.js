import { useEffect, useState } from "react";
import { MOBILE_WINDOW_TRESHOLD } from "./constants";
import { httpClient } from "./httpClient";

export const useWindowSize = () => {
  const getSize = () => ({
    width: window.innerWidth,
    height: window.innerHeight,
    scale: 0.8,
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

export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(
    window.innerWidth <= MOBILE_WINDOW_TRESHOLD
  );

  useEffect(() => {
    // Function to check screen width
    const handleResize = () => {
      setIsMobile(window.innerWidth <= MOBILE_WINDOW_TRESHOLD);
    };

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Cleanup function to remove event listener
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return isMobile;
};
