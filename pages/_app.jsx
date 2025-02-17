import "@/styles/globals.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function MyApp({ Component, pageProps }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      setIsAuthenticated(!!token);

      const protectedRoutes = ["/", "/profile"];

      if (!token && protectedRoutes.includes(router.pathname)) {
        router.push("/login");
      }
    }
  }, [router]);

  return <Component {...pageProps} isAuthenticated={isAuthenticated} />;
}
