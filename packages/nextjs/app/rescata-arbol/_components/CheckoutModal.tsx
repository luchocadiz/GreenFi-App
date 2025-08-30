"use client";

import { useState } from "react";
import type { Tree, DonationData, PaymentMethod } from "../_types";

interface CheckoutModalProps {
  tree: Tree;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: DonationData) => void;
  isProcessing: boolean;
}

const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: "card",
    name: "Tarjeta de Crédito/Débito",
    icon: "💳",
    description: "Pago seguro con Stripe"
  },
  {
    id: "qr",
    name: "Pago con QR",
    icon: "📱",
    description: "Mercado Pago, Ualá, etc."
  }
];

const QUICK_AMOUNTS = [1, 3, 5, 10, 20];

export const CheckoutModal = ({ 
  tree, 
  isOpen, 
  onClose, 
  onComplete, 
  isProcessing 
}: CheckoutModalProps) => {
  const [selectedAmount, setSelectedAmount] = useState(tree.rescueAmount);
  const [customAmount, setCustomAmount] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>(PAYMENT_METHODS[0]);
  const [isCustomAmount, setIsCustomAmount] = useState(false);

  if (!isOpen) return null;

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setIsCustomAmount(false);
    setCustomAmount("");
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    if (value) {
      setIsCustomAmount(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const finalAmount = isCustomAmount ? parseFloat(customAmount) : selectedAmount;
    
    if (finalAmount <= 0) {
      alert("Por favor ingresa un monto válido");
      return;
    }

    const donationData: DonationData = {
      treeId: tree.id,
      treeName: tree.name,
      amount: finalAmount,
      paymentMethod: selectedPaymentMethod.id as "card" | "qr",
      treeImage: tree.image,
      receipt: `Recibo_${tree.name}_${Date.now()}.pdf`
    };

    onComplete(donationData);
  };

  const finalAmount = isCustomAmount ? parseFloat(customAmount) || 0 : selectedAmount;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800">🌱 Rescatar {tree.name}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>
          </div>
          
          <div className="bg-green-50 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <div className="text-3xl">🌳</div>
              <div>
                <p className="text-sm text-gray-600">{tree.species}</p>
                <p className="text-xs text-gray-500">{tree.location}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Selección de monto */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Seleccioná el monto de tu donación:
            </label>
            
            {/* Montos rápidos */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              {QUICK_AMOUNTS.map((amount) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => handleAmountSelect(amount)}
                  className={`py-3 px-4 rounded-xl border-2 transition-all ${
                    selectedAmount === amount && !isCustomAmount
                      ? "border-green-500 bg-green-50 text-green-700"
                      : "border-gray-200 hover:border-green-300 text-gray-700"
                  }`}
                >
                  <div className="text-lg font-bold">${amount}</div>
                  <div className="text-xs text-gray-500">USD</div>
                </button>
              ))}
            </div>

            {/* Monto personalizado */}
            <div className="flex items-center space-x-3">
              <input
                type="number"
                placeholder="Otro monto"
                value={customAmount}
                onChange={(e) => handleCustomAmountChange(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                min="0.01"
                step="0.01"
              />
              <span className="text-gray-500">USD</span>
            </div>
          </div>

          {/* Método de pago */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Método de pago:
            </label>
            <div className="space-y-3">
              {PAYMENT_METHODS.map((method) => (
                <label
                  key={method.id}
                  className={`flex items-center space-x-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedPaymentMethod.id === method.id
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:border-green-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.id}
                    checked={selectedPaymentMethod.id === method.id}
                    onChange={() => setSelectedPaymentMethod(method)}
                    className="text-green-600 focus:ring-green-500"
                  />
                  <div className="text-2xl">{method.icon}</div>
                  <div>
                    <div className="font-medium text-gray-800">{method.name}</div>
                    <div className="text-sm text-gray-500">{method.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Información de transparencia */}
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
            <div className="flex items-start space-x-3">
              <div className="text-blue-600 text-lg">🔒</div>
              <div>
                <p className="text-sm text-blue-800 font-medium">
                  Tu identidad está protegida
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  Tu donación se registra automáticamente en blockchain para máxima transparencia, 
                  sin que tengas que entender la tecnología.
                </p>
              </div>
            </div>
          </div>

          {/* Resumen */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Monto de donación:</span>
              <span className="text-lg font-bold text-gray-800">${finalAmount}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Árbol a rescatar:</span>
              <span className="font-medium text-gray-800">{tree.name}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Método de pago:</span>
              <span className="font-medium text-gray-800">{selectedPaymentMethod.name}</span>
            </div>
          </div>

          {/* Botón de confirmación */}
          <button
            type="submit"
            disabled={isProcessing || finalAmount <= 0}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed shadow-lg"
          >
            {isProcessing ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Procesando...</span>
              </div>
            ) : (
              `🌱 Confirmar Rescate - $${finalAmount}`
            )}
          </button>

          {/* Información adicional */}
          <p className="text-xs text-gray-500 text-center">
            Al confirmar, aceptás nuestros términos y condiciones. 
            Tu donación se procesará de forma segura.
          </p>
        </form>
      </div>
    </div>
  );
};
