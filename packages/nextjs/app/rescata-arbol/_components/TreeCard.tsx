"use client";

import { useState } from "react";
import Image from "next/image";
import type { TreeProject } from "../_types";

interface TreeCardProps {
  project: TreeProject;
  onRescue: (project: TreeProject) => void;
}

export const TreeCard = ({ project, onRescue }: TreeCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  // Convertir BigNumber strings a números para cálculos
  const targetAmount = parseFloat(project.targetAmount) / 1e18; // Convertir de wei a ETH
  const raisedAmount = parseFloat(project.raisedAmount) / 1e18; // Convertir de wei a ETH
  const progressPercentage = Math.min((raisedAmount / targetAmount) * 100, 100);

  // Calcular monto restante
  const remainingAmount = targetAmount - raisedAmount;

  // Determinar color de urgencia
  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "text-red-600 bg-red-100";
      case "medium":
        return "text-yellow-600 bg-yellow-100";
      case "low":
        return "text-green-600 bg-green-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  // Determinar texto de urgencia
  const getUrgencyText = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "Alta Urgencia";
      case "medium":
        return "Urgencia Media";
      case "low":
        return "Baja Urgencia";
      default:
        return "Urgencia Media";
    }
  };

  return (
    <div
      className={`relative bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 transform ${
        isHovered ? "scale-105 shadow-xl" : "hover:shadow-xl"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Imagen del proyecto */}
      <div className="relative h-48 overflow-hidden">
        {project.image ? (
          <Image
            src={project.image}
            alt={project.projectName}
            fill
            className="object-cover transition-transform duration-300 hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={() => {
              // En caso de error, mostrar fallback
              console.log(`Error cargando imagen para ${project.projectName}`);
            }}
          />
        ) : (
          // Fallback con emoji si no hay imagen
          <div className="w-full h-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
            <div className="text-6xl">🌳</div>
          </div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-20" />

        {/* Badge de urgencia */}
        <div
          className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${getUrgencyColor(
            project.urgency || "medium",
          )}`}
        >
          {getUrgencyText(project.urgency || "medium")}
        </div>

        {/* Badge de estado */}
        <div
          className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold ${
            project.active ? "text-green-600 bg-green-100" : "text-red-600 bg-red-100"
          }`}
        >
          {project.active ? "Activo" : "Inactivo"}
        </div>
      </div>

      {/* Contenido de la tarjeta */}
      <div className="p-6">
        {/* Título y ONG */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-800 mb-2">{project.projectName}</h3>
          <p className="text-sm text-gray-600">by {project.ngoName}</p>
        </div>

        {/* Descripción */}
        <p className="text-gray-700 mb-4 line-clamp-2">{project.description}</p>

        {/* Ubicación */}
        <div className="flex items-center text-sm text-gray-600 mb-4">
          <span className="mr-2">📍</span>
          <span>{project.location}</span>
        </div>

        {/* Impacto y CO2 */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl mb-1">🌱</div>
            <div className="text-sm font-medium text-green-800">Impact</div>
            <div className="text-xs text-green-600">{project.impact}</div>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl mb-1">🌍</div>
            <div className="text-sm font-medium text-blue-800">CO2 capture</div>
            <div className="text-xs text-blue-600">{project.co2Capture}</div>
          </div>
        </div>

        {/* Progreso de recaudación */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Collected: {raisedAmount.toFixed(2)} ETH</span>
            <span>Goal: {targetAmount.toFixed(2)} ETH</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="text-xs text-gray-500 mt-1">{progressPercentage.toFixed(1)}% completed</div>
        </div>

        {/* Monto restante */}
        <div className="text-center mb-4">
          <div className="text-lg font-bold text-green-600">Missing {remainingAmount.toFixed(2)} ETH</div>
          <div className="text-sm text-gray-600">to complete the project</div>
        </div>

        {/* Botón de rescate */}
        <button
          onClick={() => onRescue(project)}
          disabled={!project.active || remainingAmount <= 0}
          className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all duration-300 ${
            !project.active || remainingAmount <= 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700 transform hover:scale-105"
          }`}
        >
          {!project.active ? "Inactive Project" : remainingAmount <= 0 ? "¡Project Completed!" : "Rescue Now"}
        </button>

        {/* Información adicional */}
        <div className="mt-4 text-center">
          <div className="text-xs text-gray-500">💚 100% transparent • 🔒 Protected data • 🌍 Verifiable impact</div>
        </div>

        {/* Fecha de creación */}
        <div className="mt-3 text-center">
          <div className="text-xs text-gray-400">
            Created: {new Date(project.createdAt * 1000).toLocaleDateString("es-AR")}
          </div>
        </div>
      </div>

      {/* Efectos de hover */}
      {isHovered && <div className="absolute inset-0 bg-green-500 bg-opacity-5 pointer-events-none" />}
    </div>
  );
};
