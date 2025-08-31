"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useDisconnect } from "wagmi";
import { useAuth } from "~~/hooks/useAuth";

export const Header = () => {
  const { isAuthenticated, userAddress } = useAuth();
  const router = useRouter();
  const { disconnect } = useDisconnect();

  const handleDisconnect = () => {
    disconnect();
    toast.success("Wallet desconectada exitosamente 👋");
    // Redirigir al login después de un breve delay
    setTimeout(() => {
      router.push("/login");
    }, 1000);
  };

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-green-100 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo y Título */}
          <Link href="/rescata-arbol" className="flex items-center space-x-3">
            <Image src="/image201.png" alt="GreenFi Logo" width={150} height={150} />
          </Link>

          {/* Navegación */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/rescata-arbol" className="text-gray-700 hover:text-green-600 transition-colors font-medium">
              Inicio
            </Link>
            <Link
              href="/rescata-arbol#trees"
              className="text-gray-700 hover:text-green-600 transition-colors font-medium"
            >
              Árboles
            </Link>
            <Link
              href="/rescata-arbol#impact"
              className="text-gray-700 hover:text-green-600 transition-colors font-medium"
            >
              Impacto
            </Link>
            <Link
              href="/rescata-arbol#about"
              className="text-gray-700 hover:text-green-600 transition-colors font-medium"
            >
              Nosotros
            </Link>
          </nav>

          {/* Estado de Autenticación */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-800">Conectado a Lisk</div>
                  <div className="text-xs text-gray-500">
                    {userAddress?.slice(0, 6)}...{userAddress?.slice(-4)}
                  </div>
                </div>
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              </div>
            ) : (
              <div className="text-sm text-gray-500">No conectado</div>
            )}

            {/* Botón de Desconectar */}
            <button
              onClick={handleDisconnect}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors font-medium flex items-center space-x-2"
            >
              <span>🔌</span>
              <span>Desconectar</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
