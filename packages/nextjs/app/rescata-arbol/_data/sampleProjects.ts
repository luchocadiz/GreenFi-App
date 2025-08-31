import { TreeProject } from "../_types";
import { parseEther } from "viem";

// Proyectos de ejemplo hardcodeados - Solo 3 proyectos principales
export const sampleProjects: TreeProject[] = [
  {
    id: 1,
    projectName: "Rescate de Ceiba Centenaria",
    ngoName: "Fundación Bosques Nativos",
    ngoWallet: "0x742d35Cc6634C0532925a3b8D0B251E3fE4d8D8D",
    targetAmount: parseEther("2.5").toString(),
    raisedAmount: parseEther("0.8").toString(),
    active: true,
    createdAt: Math.floor(Date.now() / 1000) - 86400 * 7, // 7 días atrás
    // Campos adicionales para la UI
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1000&auto=format&fit=crop",
    description: "Una majestuosa ceiba de más de 200 años está en peligro por la expansión urbana. Necesitamos fondos para su protección y reubicación.",
    location: "Córdoba, Argentina",
    impact: "Preservación de patrimonio natural",
    co2Capture: "3.2 toneladas/año",
    urgency: "high"
  },
  {
    id: 2,
    projectName: "Selva Misionera en Peligro",
    ngoName: "Misiones Verde",
    ngoWallet: "0x4B0897b0513fdC7C541B6d9D7E929C4e5364D2dB",
    targetAmount: parseEther("4.5").toString(),
    raisedAmount: parseEther("2.1").toString(),
    active: true,
    createdAt: Math.floor(Date.now() / 1000) - 86400 * 3, // 3 días atrás
    image: "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=1000&auto=format&fit=crop",
    description: "Preservación de 20 hectáreas de selva nativa con especies únicas de la región misionera.",
    location: "Misiones, Argentina",
    impact: "Protección del pulmón verde",
    co2Capture: "5.5 toneladas/año",
    urgency: "high"
  },
  {
    id: 3,
    projectName: "Quebrachos del Chaco",
    ngoName: "Chaco Sustentable",
    ngoWallet: "0xdD870fA1b7C4700F2BD7f44238821C26f7392148",
    targetAmount: parseEther("2.8").toString(),
    raisedAmount: parseEther("0.5").toString(),
    active: true,
    createdAt: Math.floor(Date.now() / 1000) - 86400 * 12, // 12 días atrás
    image: "https://images.unsplash.com/photo-1440342359743-84fcb8c21f21?q=80&w=1000&auto=format&fit=crop",
    description: "Protección de los últimos quebrachos colorados del Gran Chaco ante la deforestación.",
    location: "Chaco, Argentina",
    impact: "Preservación de biodiversidad",
    co2Capture: "2.7 toneladas/año",
    urgency: "high"
  }
];

// Función para obtener un proyecto de ejemplo por ID
export const getSampleProjectById = (id: number): TreeProject | undefined => {
  return sampleProjects.find(project => project.id === id);
};

// Función para obtener proyectos filtrados por urgencia
export const getSampleProjectsByUrgency = (urgency: "low" | "medium" | "high"): TreeProject[] => {
  return sampleProjects.filter(project => project.urgency === urgency);
};

// Función para obtener proyectos activos
export const getActiveSampleProjects = (): TreeProject[] => {
  return sampleProjects.filter(project => project.active);
};
