"use client";

import { useState } from "react";
import type { Tree } from "../_types";

interface TreeCardProps {
  tree: Tree;
  onRescue: (tree: Tree) => void;
}

export const TreeCard = ({ tree, onRescue }: TreeCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "Alta":
        return "bg-red-100 text-red-800 border-red-200";
      case "Media":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Baja":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case "Alta":
        return "🚨";
      case "Media":
        return "⚠️";
      case "Baja":
        return "✅";
      default:
        return "ℹ️";
    }
  };

  return (
    <div
      className={`bg-white rounded-2xl shadow-lg border border-green-100 overflow-hidden transition-all duration-300 transform ${
        isHovered ? "scale-105 shadow-xl" : "hover:scale-102"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Imagen del árbol */}
      <div className="relative h-48 bg-gradient-to-br from-green-100 to-emerald-100">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-6xl opacity-60">🌳</div>
        </div>
        <div className="absolute top-3 right-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getUrgencyColor(tree.urgency)}`}>
            {getUrgencyIcon(tree.urgency)} {tree.urgency}
          </span>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-800 mb-2">{tree.name}</h3>
          <p className="text-sm text-gray-600 italic mb-2">{tree.species}</p>
          <p className="text-sm text-gray-500 mb-3">📍 {tree.location}</p>
        </div>

        <p className="text-gray-700 text-sm mb-4 line-clamp-3">{tree.description}</p>

        {/* Impacto y Captura de CO2 */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-green-50 rounded-lg p-3">
            <div className="text-xs text-green-600 font-medium mb-1">Impacto</div>
            <div className="text-sm text-gray-800">{tree.impact}</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="text-xs text-blue-600 font-medium mb-1">Captura CO2</div>
            <div className="text-sm text-gray-800">{tree.carbonCapture}</div>
          </div>
        </div>

        {/* Monto de rescate */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">${tree.rescueAmount}</div>
            <div className="text-xs text-gray-500">para rescatar</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-600">Tu donación se registra en</div>
            <div className="text-xs text-blue-600 font-medium">Lisk Blockchain</div>
          </div>
        </div>

        {/* Botón de rescate */}
        <button
          onClick={() => onRescue(tree)}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          🌱 Rescatar Ahora
        </button>

        {/* Información adicional */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">💚 100% transparente • 🔒 Datos protegidos • 🌍 Impacto verificable</p>
        </div>
      </div>
    </div>
  );
};
