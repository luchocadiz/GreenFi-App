"use client";

import { useAuth } from "~~/hooks/useAuth";
import AuthGuard from "~~/components/AuthGuard";

const DashboardPage = () => {
  const { userAddress, networkName, isAuthenticated } = useAuth();

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-blue-900 to-purple-900 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              🚀 Dashboard de Lisk
            </h1>
            <p className="text-xl text-gray-300">
              Bienvenido a tu panel de control personalizado
            </p>
          </div>

          {isAuthenticated && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Tarjeta de Estado de Conexión */}
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <h3 className="text-lg font-semibold text-white">Estado de Conexión</h3>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-300">
                    <span className="text-green-400">✓ Conectado</span>
                  </p>
                  <p className="text-gray-300">
                    Red: <span className="text-blue-400">{networkName}</span>
                  </p>
                  <p className="text-gray-300">
                    Dirección: <span className="text-purple-400 font-mono">
                      {userAddress?.slice(0, 6)}...{userAddress?.slice(-4)}
                    </span>
                  </p>
                </div>
              </div>

              {/* Tarjeta de Balance */}
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">💰</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white">Balance</h3>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-yellow-400 mb-2">--</p>
                  <p className="text-gray-400 text-sm">ETH en Lisk Sepolia</p>
                </div>
              </div>

              {/* Tarjeta de Actividad Reciente */}
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">📊</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white">Actividad Reciente</h3>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-400 text-sm">No hay transacciones recientes</p>
                </div>
              </div>

              {/* Tarjeta de Contratos */}
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">📜</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white">Contratos Desplegados</h3>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-400 text-sm">No hay contratos desplegados</p>
                </div>
              </div>

              {/* Tarjeta de NFTs */}
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">🖼️</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white">NFTs</h3>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-400 text-sm">No hay NFTs en tu wallet</p>
                </div>
              </div>

              {/* Tarjeta de Configuración */}
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-gray-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">⚙️</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white">Configuración</h3>
                </div>
                <div className="space-y-2">
                  <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors">
                    Configurar Wallet
                  </button>
                  <button className="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors">
                    Preferencias
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Mensaje de bienvenida */}
          <div className="mt-12 text-center">
            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-8 border border-white/10">
              <h2 className="text-2xl font-semibold text-white mb-4">
                🎉 ¡Felicidades!
              </h2>
              <p className="text-gray-300 mb-6">
                Has logrado conectarte exitosamente a la testnet de Lisk Sepolia. 
                Ahora puedes explorar todas las funcionalidades de la blockchain.
              </p>
              <div className="flex justify-center space-x-4">
                <button className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105">
                  Explorar Contratos
                </button>
                <button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105">
                  Ver Transacciones
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
};

export default DashboardPage;
