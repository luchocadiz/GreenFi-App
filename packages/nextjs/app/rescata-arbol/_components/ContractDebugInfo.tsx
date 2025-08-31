"use client";

import { useState } from "react";

interface ContractDebugInfoProps {
  contractAddress: string;
  isContractReady: boolean;
  userAddress?: string;
}

export const ContractDebugInfo = ({ contractAddress, isContractReady, userAddress }: ContractDebugInfoProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (process.env.NODE_ENV === "production") {
    return null; // No mostrar en producción
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="bg-gray-800 text-white px-3 py-2 rounded-lg text-xs hover:bg-gray-700 transition-colors"
      >
        🔧 Debug
      </button>

      {isExpanded && (
        <div className="absolute bottom-12 right-0 bg-gray-900 text-white p-4 rounded-lg shadow-xl max-w-sm text-xs">
          <h3 className="font-bold mb-2 text-yellow-400">Estado del Contrato</h3>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Modo:</span>
              <span className="text-green-400">⛓️ Blockchain REAL</span>
            </div>

            <div className="flex justify-between">
              <span>Wallet:</span>
              <span className={userAddress ? "text-green-400" : "text-red-400"}>
                {userAddress ? "✅ Conectada" : "❌ Desconectada"}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Contrato:</span>
              <span className={isContractReady ? "text-green-400" : "text-red-400"}>
                {isContractReady ? "✅ Listo" : "❌ No listo"}
              </span>
            </div>

            {contractAddress && (
              <div className="mt-2 pt-2 border-t border-gray-700">
                <div className="text-gray-400">Dirección:</div>
                <div className="font-mono break-all text-xs">{contractAddress}</div>
              </div>
            )}

            {userAddress && (
              <div className="mt-2 pt-2 border-t border-gray-700">
                <div className="text-gray-400">Usuario:</div>
                <div className="font-mono break-all text-xs">{userAddress}</div>
              </div>
            )}

            <div className="mt-2 pt-2 border-t border-gray-700 text-gray-400">
              <div className="mb-2">🚀 Donaciones REALES</div>
              <div className="text-xs">
                • UI muestra proyectos de ejemplo
                <br />
                • Donaciones van al contrato real
                <br />
                • MetaMask procesa transacciones
                <br />• ETH real se envía a blockchain
              </div>
            </div>

            <div className="mt-2 pt-2 border-t border-gray-700 text-gray-400">
              💡 Abre DevTools para ver logs detallados
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
