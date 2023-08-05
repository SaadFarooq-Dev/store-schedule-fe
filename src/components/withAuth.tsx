"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function withAuth(Component: any) {
  return function ProtectedRoute({ ...props }) {
    const router = useRouter();
    const token = typeof window !== "undefined" ?  localStorage.getItem("token") : null;

    //Debugging, Auth is enabled by default
    // const userIsAuthenticated = true;
    const userIsAuthenticated = token !== null;

    useEffect(() => {
      if (!userIsAuthenticated) {
        router.push("/login");
      }
    }, [userIsAuthenticated, router]);

    return userIsAuthenticated ? <Component {...props} token={token} /> : null;
  };
}
