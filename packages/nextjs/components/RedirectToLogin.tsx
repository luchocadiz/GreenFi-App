"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const RedirectToLogin = () => {
  const router = useRouter();

  useEffect(() => {
    router.push("/login");
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-blue-900 to-purple-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-white text-lg">Redirecting to login...</p>
      </div>
    </div>
  );
};

export default RedirectToLogin;
