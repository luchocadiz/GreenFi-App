"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useAccount, useConnect, useDisconnect, useNetwork, useSwitchNetwork } from "wagmi";
import { GreenSpinnerLight } from "~~/components/GreenSpinner";

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
      toast.success("¡Bienvenido al rescate de árboles! 🌳");
      // Redirigir a rescata-arbol después de 2 segundos
      setTimeout(() => {
        router.push("/rescata-arbol");
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
      if (!window.ethereum) {
        toast.error("MetaMask no está disponible");
        return;
      }

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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute -top-4 -right-4 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-2000"></div>
        
        {/* Árboles flotantes decorativos */}
        <div className="absolute top-20 left-10 text-4xl opacity-20 animate-bounce delay-500">🌲</div>
        <div className="absolute top-32 right-16 text-3xl opacity-15 animate-bounce delay-1000">🌳</div>
        <div className="absolute bottom-40 left-8 text-5xl opacity-10 animate-bounce delay-1500">🌴</div>
        <div className="absolute bottom-20 right-12 text-4xl opacity-20 animate-bounce delay-2000">🌿</div>
        <div className="absolute top-40 left-1/2 text-2xl opacity-25 animate-bounce delay-2500">🍃</div>
      </div>

      <div className="relative bg-white/90 backdrop-blur-lg rounded-3xl p-8 max-w-md w-full border border-green-100 shadow-2xl">
        {/* Encabezado con temática de árboles */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4 animate-bounce">🌳</div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Rescatá un Árbol</h1>
          <p className="text-lg text-gray-600 mb-2">Conectá tu wallet para comenzar</p>
          <p className="text-sm text-green-600">🌱 Cada donación cuenta para salvar nuestros bosques</p>
        </div>

        {!isConnected ? (
          <div className="space-y-6">
            {/* Estadísticas de impacto */}
            <div className="bg-green-50 rounded-2xl p-4 border border-green-100">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl mb-1">🌳</div>
                  <div className="text-lg font-bold text-green-700">3</div>
                  <div className="text-xs text-green-600">Proyectos</div>
                </div>
                <div>
                  <div className="text-2xl mb-1">💚</div>
                  <div className="text-lg font-bold text-green-700">9.8</div>
                  <div className="text-xs text-green-600">ETH Objetivo</div>
                </div>
                <div>
                  <div className="text-2xl mb-1">🌍</div>
                  <div className="text-lg font-bold text-green-700">11.4</div>
                  <div className="text-xs text-green-600">Ton CO2/año</div>
                </div>
              </div>
            </div>

            <button
              onClick={handleConnect}
              disabled={isConnecting || isConnectingWallet}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {isConnecting || isConnectingWallet ? (
                <div className="flex items-center justify-center">
                  <GreenSpinnerLight size="md" className="mr-2" />
                  Conectando wallet...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <span className="mr-2">🦊</span>
                  Conectar con MetaMask
                </div>
              )}
            </button>

            <button
              onClick={addLiskSepoliaToMetaMask}
              className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-md"
            >
              <div className="flex items-center justify-center">
                <span className="mr-2">⚙️</span>
                Configurar Red Lisk
              </div>
            </button>

            <div className="text-center text-sm text-gray-500 mt-4 bg-gray-50 rounded-xl p-4">
              <p className="mb-2">¿No tienes MetaMask?</p>
              <a
                href="https://metamask.io/download/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:text-green-700 underline font-semibold"
              >
                📥 Descárgalo gratis aquí
              </a>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Estado de conexión exitosa */}
            <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">🎉</div>
                <h3 className="text-xl font-bold text-green-800">¡Wallet Conectada!</h3>
              </div>
              
              <div className="flex items-center justify-center space-x-2 text-green-700 mb-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-semibold">Conectado exitosamente</span>
              </div>
              
              <div className="bg-white rounded-xl p-3 border border-green-100">
                <p className="text-sm text-gray-600 text-center">
                  <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                    {address?.slice(0, 6)}...{address?.slice(-4)}
                  </span>
                </p>
              </div>
            </div>

            {chain?.id !== LISK_SEPOLIA_CHAIN_ID ? (
              <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6">
                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">⚠️</div>
                  <h3 className="text-xl font-bold text-orange-800">Red Incorrecta</h3>
                </div>
                
                <div className="flex items-center justify-center space-x-2 text-orange-700 mb-3">
                  <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
                  <span className="font-semibold">Cambio de red requerido</span>
                </div>
                
                <p className="text-sm text-orange-700 mb-4 text-center">
                  Conectado a: <strong>{chain?.name || "red desconocida"}</strong><br/>
                  Necesitas cambiar a <strong>Lisk Sepolia</strong> para rescatar árboles.
                </p>
                
                <button
                  onClick={handleSwitchToLiskSepolia}
                  className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-3 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105"
                >
                  🔄 Cambiar a Lisk Sepolia
                </button>
              </div>
            ) : (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">✅</div>
                  <h3 className="text-xl font-bold text-emerald-800">¡Todo Listo!</h3>
                </div>
                
                <div className="flex items-center justify-center space-x-2 text-emerald-700 mb-3">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="font-semibold">Lisk Sepolia Testnet</span>
                </div>
                
                <p className="text-sm text-emerald-700 text-center">
                  🌳 Ya podés comenzar a rescatar árboles
                </p>
              </div>
            )}

            <button
              onClick={handleDisconnect}
              className="w-full bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105"
            >
              🔌 Desconectar Wallet
            </button>
          </div>
        )}

        {isAuthenticated && (
          <div className="mt-6 text-center">
            <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl p-6 border border-green-200">
              <div className="animate-bounce mb-3">
                <span className="text-5xl">🌳</span>
              </div>
              <div className="animate-pulse">
                <p className="text-green-800 font-bold text-lg mb-2">¡Bienvenido al rescate!</p>
                <p className="text-green-600 text-sm">Redirigiendo a los proyectos de árboles...</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
