"use client";

import { useState } from "react";
import { useDisconnect, useSwitchNetwork } from "wagmi";
import { useRouter } from "next/navigation";
import { useAuth } from "~~/hooks/useAuth";
import { toast } from "react-hot-toast";

const AuthButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { disconnect } = useDisconnect();
  const { switchNetwork } = useSwitchNetwork();
  const router = useRouter();
  const { isAuthenticated, isConnected, isCorrectNetwork, userAddress, networkName } = useAuth();

  // Lisk Sepolia chain ID
  const LISK_SEPOLIA_CHAIN_ID = 4202;

  const handleLogin = () => {
    router.push("/login");
  };

  const handleLogout = () => {
    disconnect();
    toast.success("Desconectado exitosamente");
  };

  const handleSwitchNetwork = async () => {
    if (switchNetwork) {
      setIsLoading(true);
      try {
        await switchNetwork(LISK_SEPOLIA_CHAIN_ID);
        toast.success("Cambiando a Lisk Sepolia...");
      } catch (error) {
        console.error("Error al cambiar de red:", error);
        toast.error("Error al cambiar a Lisk Sepolia");
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (!isConnected) {
    return (
      <button
        onClick={handleLogin}
        className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
      >
        Conectar Wallet
      </button>
    );
  }

  if (!isCorrectNetwork) {
    return (
      <div className="flex items-center space-x-2">
        <span className="text-yellow-400 text-sm">
          {networkName}
        </span>
        <button
          onClick={handleSwitchNetwork}
          disabled={isLoading}
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-3 rounded-lg transition-colors disabled:opacity-50"
        >
          {isLoading ? "..." : "Cambiar"}
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-3">
      <div className="text-green-400 text-sm">
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span>Lisk Sepolia</span>
        </div>
        <div className="text-xs text-gray-400">
          {userAddress?.slice(0, 6)}...{userAddress?.slice(-4)}
        </div>
      </div>
      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-3 rounded-lg transition-colors"
      >
        Desconectar
      </button>
    </div>
  );
};

export default AuthButton;
