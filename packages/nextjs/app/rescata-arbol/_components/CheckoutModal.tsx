"use client";

import { useState } from "react";
import type { DonationData, PaymentMethod, TreeProject } from "../_types";

interface CheckoutModalProps {
  project: TreeProject;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (donationData: DonationData) => void;
  isProcessing: boolean;
}

export const CheckoutModal = ({ project, isOpen, onClose, onComplete, isProcessing }: CheckoutModalProps) => {
  const [selectedAmount, setSelectedAmount] = useState<string>("0.01");
  const [customAmount, setCustomAmount] = useState<string>("");
  const [donorName, setDonorName] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  // Removido: método de pago ya no es necesario

  // Montos rápidos en ETH
  const quickAmounts = ["0.01", "0.05", "0.1", "0.5", "1.0"];

  // Convertir BigNumber strings a números para cálculos
  const targetAmount = parseFloat(project.targetAmount) / 1e18; // Convertir de wei a ETH
  const raisedAmount = parseFloat(project.raisedAmount) / 1e18; // Convertir de wei a ETH
  const remainingAmount = targetAmount - raisedAmount;

  // Validar que el monto no exceda lo necesario
  const isValidAmount = (amount: string) => {
    const numAmount = parseFloat(amount);
    return numAmount > 0 && numAmount <= remainingAmount;
  };

  // Obtener el monto final (seleccionado o personalizado)
  const getFinalAmount = () => {
    if (customAmount && parseFloat(customAmount) > 0) {
      return customAmount;
    }
    return selectedAmount;
  };

  // Manejar cambio de monto
  const handleAmountChange = (amount: string) => {
    setSelectedAmount(amount);
    setCustomAmount(""); // Limpiar monto personalizado
  };

  // Manejar cambio de monto personalizado
  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomAmount(value);
    setSelectedAmount(""); // Limpiar monto seleccionado
  };

  // Removido: manejo de método de pago

  // Manejar envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const finalAmount = getFinalAmount();

    if (!isValidAmount(finalAmount)) {
      alert("Por favor, ingresa un monto válido");
      return;
    }

    if (!donorName.trim()) {
      alert("Por favor, ingresa tu nombre");
      return;
    }

    const donationData: DonationData = {
      projectId: project.id,
      treeName: project.projectName,
      amount: finalAmount,
      donorName: donorName.trim(),
      message: message.trim() || "¡Salvemos este árbol!",
      // paymentMethod es opcional, se usa blockchain por defecto
    };

    onComplete(donationData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">Rescatar {project.projectName}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Información del proyecto */}
          <div className="mb-6 p-4 bg-green-50 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-2">Proyecto: {project.projectName}</h3>
            <p className="text-sm text-green-700 mb-2">ONG: {project.ngoName}</p>
            <div className="text-sm text-green-600">
              <span className="font-medium">Meta:</span> {targetAmount.toFixed(2)} ETH
              <br />
              <span className="font-medium">Recaudado:</span> {raisedAmount.toFixed(2)} ETH
              <br />
              <span className="font-medium">Faltan:</span> {remainingAmount.toFixed(2)} ETH
            </div>
          </div>

          {/* Nombre del donante */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Tu nombre *</label>
            <input
              type="text"
              value={donorName}
              onChange={e => setDonorName(e.target.value)}
              placeholder="Ingresa tu nombre completo"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>

          {/* Mensaje personalizado */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Mensaje (opcional)</label>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Escribe un mensaje para este proyecto..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Selección de monto */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Seleccioná el monto de tu donación:</label>

            {/* Montos rápidos */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              {quickAmounts.map(amount => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => handleAmountChange(amount)}
                  className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    selectedAmount === amount && !customAmount
                      ? "bg-green-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {amount} ETH
                </button>
              ))}
            </div>

            {/* Monto personalizado */}
            <div className="relative">
              <input
                type="number"
                value={customAmount}
                onChange={handleCustomAmountChange}
                placeholder="O ingresa un monto personalizado"
                step="0.01"
                min="0.001"
                max={remainingAmount}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">ETH</span>
            </div>

            {/* Validación de monto */}
            {customAmount && !isValidAmount(customAmount) && (
              <p className="text-red-500 text-sm mt-1">
                El monto debe ser mayor a 0 y no exceder {remainingAmount.toFixed(2)} ETH
              </p>
            )}
          </div>

          {/* Método de pago removido */}

          {/* Resumen */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">Resumen de tu donación</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Proyecto:</span>
                <span className="font-medium">{project.projectName}</span>
              </div>
              <div className="flex justify-between">
                <span>Monto:</span>
                <span className="font-medium text-green-600">{getFinalAmount()} ETH</span>
              </div>
              <div className="flex justify-between">
                <span>Método:</span>
                <span className="font-medium">⛓️ Blockchain</span>
              </div>
            </div>
          </div>

          {/* Mensaje de transparencia */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start">
              <div className="text-blue-600 text-lg mr-3">⛓️</div>
              <div>
                <p className="text-sm text-blue-800 font-medium">Transacción Real en Blockchain</p>
                <p className="text-xs text-blue-600 mt-1">
                  ⚠️ Esta es una donación REAL con ETH real. Tu MetaMask procesará la transacción en la blockchain de Lisk.
                </p>
              </div>
            </div>
          </div>

          {/* Estado de procesamiento */}
          {isProcessing && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-600 mr-3"></div>
                <div>
                  <p className="text-sm text-yellow-800 font-medium">Procesando transacción...</p>
                  <p className="text-xs text-yellow-600 mt-1">
                    Por favor confirma la transacción en tu wallet y espera la confirmación.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Botón de confirmación */}
          <button
            type="submit"
            disabled={isProcessing || !isValidAmount(getFinalAmount()) || !donorName.trim()}
            className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all duration-300 ${
              isProcessing || !isValidAmount(getFinalAmount()) || !donorName.trim()
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 transform hover:scale-105"
            }`}
          >
            {isProcessing ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Enviando a Blockchain...
              </div>
            ) : (
              "🌳 Rescatar con Blockchain"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
