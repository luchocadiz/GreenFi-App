"use client";

import { useState, useEffect } from "react";
import type { DonationData } from "../_types";

interface ConfirmationModalProps {
  donationData: DonationData;
  isOpen: boolean;
  onClose: () => void;
}

export const ConfirmationModal = ({ 
  donationData, 
  isOpen, 
  onClose 
}: ConfirmationModalProps) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [showNFT, setShowNFT] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
      
      setTimeout(() => setShowNFT(true), 1000);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleViewBlockchain = () => {
    // En producción, esto abriría el explorer de Lisk
    window.open(`https://sepolia-blockscout.lisk.com/tx/${donationData.transactionHash}`, '_blank');
  };

  const handleViewFilecoin = () => {
    // En producción, esto abriría el explorer de Filecoin
    if (donationData.filecoinCid) {
      window.open(`https://filfox.info/en/ipfs/${donationData.filecoinCid}`, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto relative">
        {/* Confeti animado */}
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-bounce"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${1 + Math.random() * 2}s`
                }}
              >
                {['🎉', '🎊', '✨', '🌟', '💫'][Math.floor(Math.random() * 5)]}
              </div>
            ))}
          </div>
        )}

        {/* Header */}
        <div className="p-6 border-b border-gray-100 text-center">
          <div className="text-6xl mb-4 animate-bounce">🎉</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            ¡Gracias por tu donación!
          </h2>
          <p className="text-gray-600">
            Has ayudado a rescatar un <span className="font-semibold text-green-600">{donationData.treeName}</span> 🌳
          </p>
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-6">
          {/* Resumen de la donación */}
          <div className="bg-green-50 rounded-xl p-4 border border-green-100">
            <h3 className="font-semibold text-green-800 mb-3">Resumen de tu Rescate</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-green-700">Árbol rescatado:</span>
                <span className="font-medium">{donationData.treeName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">Monto donado:</span>
                <span className="font-bold text-green-800">${donationData.amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">Método de pago:</span>
                <span className="font-medium">
                  {donationData.paymentMethod === 'card' ? '💳 Tarjeta' : '📱 QR'}
                </span>
              </div>
            </div>
          </div>

          {/* NFT de logro */}
          {showNFT && (
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100 animate-fade-in">
              <div className="text-center">
                <div className="text-4xl mb-2">🏆</div>
                <h4 className="font-semibold text-purple-800 mb-2">¡Logro Desbloqueado!</h4>
                <p className="text-sm text-purple-600 mb-3">
                  "Rescatador de {donationData.treeName}"
                </p>
                <div className="bg-white rounded-lg p-3 inline-block">
                  <div className="text-2xl">🌱</div>
                  <div className="text-xs text-gray-600">NFT de Logro</div>
                </div>
              </div>
            </div>
          )}

          {/* Enlaces a blockchain */}
          <div className="space-y-3">
            <button
              onClick={handleViewBlockchain}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors flex items-center justify-center space-x-2"
            >
              <span>🔗</span>
              <span>Ver transacción en Lisk Explorer</span>
            </button>
            
            {donationData.filecoinCid && (
              <button
                onClick={handleViewFilecoin}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors flex items-center justify-center space-x-2"
              >
                <span>📁</span>
                <span>Ver evidencia en Filecoin</span>
              </button>
            )}
          </div>

          {/* Información de transparencia */}
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
            <div className="flex items-start space-x-3">
              <div className="text-blue-600 text-lg">🌐</div>
              <div>
                <p className="text-sm text-blue-800 font-medium">
                  Transparencia Garantizada
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  Tu donación está registrada en blockchain y es completamente verificable. 
                  Los fondos se destinan directamente a la conservación del árbol.
                </p>
              </div>
            </div>
          </div>

          {/* Impacto ambiental */}
          <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
            <div className="flex items-center space-x-3">
              <div className="text-emerald-600 text-2xl">🌍</div>
              <div>
                <p className="text-sm text-emerald-800 font-medium">
                  Impacto Ambiental
                </p>
                <p className="text-xs text-emerald-600 mt-1">
                  Con tu donación, contribuís a la captura de CO2 y la preservación 
                  de la biodiversidad local. ¡Cada árbol cuenta!
                </p>
              </div>
            </div>
          </div>

          {/* Botón de cierre */}
          <button
            onClick={onClose}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
          >
            Continuar Rescatando Árboles
          </button>

          {/* Información adicional */}
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-2">
              Recibirás un email con el comprobante de tu donación
            </p>
            <p className="text-xs text-gray-400">
              💚 Gracias por hacer del mundo un lugar mejor
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
