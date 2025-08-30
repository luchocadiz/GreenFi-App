"use client";

import { useState, useEffect } from "react";
import { useAccount, useConnect, useDisconnect, useNetwork, useSwitchNetwork } from "wagmi";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

const LoginPage = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { address, isConnected } = useAccount();
  const { connect, connectors, isLoading: isConnectingWallet } = useConnect();
  const { disconnect } = useDisconnect();
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();
  const router = useRouter();

  // Lisk Sepolia chain ID
  const LISK_SEPOLIA_CHAIN_ID = 4202;

  useEffect(() => {
    if (isConnected && address && chain?.id === LISK_SEPOLIA_CHAIN_ID) {
      setIsAuthenticated(true);
      toast.success("¡Conectado exitosamente a Lisk Sepolia!");
      // Redirigir al dashboard después de 2 segundos
      setTimeout(() => {
        router.push("/");
      }, 2000);
    }
  }, [isConnected, address, chain, router]);

  const handleConnect = async () => {
    setIsConnecting(true);
    
    try {
      // Buscar el conector de MetaMask
      const metaMaskConnector = connectors.find(connector => connector.id === "metaMask");
      
      if (!metaMaskConnector) {
        toast.error("MetaMask no está disponible");
        return;
      }

      // Conectar a MetaMask
      await connect({ connector: metaMaskConnector });
      
    } catch (error) {
      console.error("Error al conectar:", error);
      toast.error("Error al conectar con MetaMask");
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSwitchToLiskSepolia = async () => {
    if (switchNetwork) {
      try {
        await switchNetwork(LISK_SEPOLIA_CHAIN_ID);
        toast.success("Cambiando a Lisk Sepolia...");
      } catch (error) {
        console.error("Error al cambiar de red:", error);
        toast.error("Error al cambiar a Lisk Sepolia");
      }
    }
  };

  const handleDisconnect = () => {
    disconnect();
    setIsAuthenticated(false);
    toast.success("Desconectado exitosamente");
  };

  const addLiskSepoliaToMetaMask = async () => {
    try {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: "0x106A", // 4202 en hexadecimal
            chainName: "Lisk Sepolia Testnet",
            nativeCurrency: {
              name: "Ether",
              symbol: "ETH",
              decimals: 18,
            },
            rpcUrls: ["https://rpc.sepolia-api.lisk.com"],
            blockExplorerUrls: ["https://sepolia-blockscout.lisk.com"],
          },
        ],
      });
      toast.success("Lisk Sepolia agregada a MetaMask");
    } catch (error) {
      console.error("Error al agregar la red:", error);
      toast.error("Error al agregar Lisk Sepolia a MetaMask");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md w-full border border-white/20 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Bienvenido a Lisk</h1>
          <p className="text-gray-300">Conecta tu wallet para continuar</p>
        </div>

        {!isConnected ? (
          <div className="space-y-4">
            <button
              onClick={handleConnect}
              disabled={isConnecting || isConnectingWallet}
              className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isConnecting || isConnectingWallet ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Conectando...
                </div>
              ) : (
                "Conectar con MetaMask"
              )}
            </button>

            <button
              onClick={addLiskSepoliaToMetaMask}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              Agregar Lisk Sepolia a MetaMask
            </button>

            <div className="text-center text-sm text-gray-400 mt-4">
              <p>¿No tienes MetaMask?</p>
              <a
                href="https://metamask.io/download/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline"
              >
                Descárgalo aquí
              </a>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4">
              <div className="flex items-center space-x-2 text-green-400">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="font-semibold">Conectado</span>
              </div>
              <p className="text-sm text-gray-300 mt-1">
                Dirección: {address?.slice(0, 6)}...{address?.slice(-4)}
              </p>
            </div>

            {chain?.id !== LISK_SEPOLIA_CHAIN_ID ? (
              <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4">
                <div className="flex items-center space-x-2 text-yellow-400 mb-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="font-semibold">Red incorrecta</span>
                </div>
                <p className="text-sm text-gray-300 mb-3">
                  Estás conectado a {chain?.name || "una red desconocida"}. 
                  Necesitas cambiar a Lisk Sepolia.
                </p>
                <button
                  onClick={handleSwitchToLiskSepolia}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  Cambiar a Lisk Sepolia
                </button>
              </div>
            ) : (
              <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4">
                <div className="flex items-center space-x-2 text-green-400">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="font-semibold">Red correcta</span>
                </div>
                <p className="text-sm text-gray-300">
                  Estás conectado a Lisk Sepolia Testnet
                </p>
              </div>
            )}

            <button
              onClick={handleDisconnect}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Desconectar
            </button>
          </div>
        )}

        {isAuthenticated && (
          <div className="mt-6 text-center">
            <div className="animate-pulse">
              <p className="text-green-400 font-semibold">
                ¡Autenticación exitosa! Redirigiendo...
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
