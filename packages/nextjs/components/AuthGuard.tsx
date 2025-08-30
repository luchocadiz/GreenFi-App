"use client";

import { useEffect, useState } from "react";
import { useAccount, useNetwork } from "wagmi";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

interface AuthGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const AuthGuard = ({ children, redirectTo = "/login" }: AuthGuardProps) => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const router = useRouter();

  // Lisk Sepolia chain ID
  const LISK_SEPOLIA_CHAIN_ID = 4202;

  useEffect(() => {
    const checkAuth = () => {
      if (!isConnected || !address) {
        setIsAuthorized(false);
        setIsLoading(false);
        router.push(redirectTo);
        return;
      }

      if (chain?.id !== LISK_SEPOLIA_CHAIN_ID) {
        setIsAuthorized(false);
        setIsLoading(false);
        toast.error("Debes estar conectado a Lisk Sepolia para acceder a esta página");
        router.push(redirectTo);
        return;
      }

      setIsAuthorized(true);
      setIsLoading(false);
    };

    // Pequeño delay para asegurar que wagmi esté completamente inicializado
    const timer = setTimeout(checkAuth, 100);
    return () => clearTimeout(timer);
  }, [isConnected, address, chain, router, redirectTo]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
};

export default AuthGuard;
