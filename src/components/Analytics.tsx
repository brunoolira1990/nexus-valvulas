import { useEffect } from "react";
import { useLocation } from "react-router-dom";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export const Analytics = () => {
  const location = useLocation();

  useEffect(() => {
    // Google Analytics 4
    if (window.gtag) {
      window.gtag("config", "G-YOUR-GA4-ID", {
        page_path: location.pathname + location.search,
      });
    }
  }, [location]);

  return null;
};
