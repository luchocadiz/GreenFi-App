import { TreeProject } from "../_types";
import { parseEther } from "viem";

// Hardcoded sample projects - Only 3 main projects
export const sampleProjects: TreeProject[] = [
  {
    id: 1,
    projectName: "Centenary Ceiba Rescue",
    ngoName: "Native Forests Foundation",
    ngoWallet: "0x742d35Cc6634C0532925a3b8D0B251E3fE4d8D8D",
    targetAmount: parseEther("2.5").toString(),
    raisedAmount: parseEther("0.8").toString(),
    active: true,
    createdAt: Math.floor(Date.now() / 1000) - 86400 * 7, // 7 días atrás
    // Campos adicionales para la UI
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1000&auto=format&fit=crop",
    description:
      "A majestic ceiba tree over 200 years old is in danger due to urban expansion. We need funds for its protection and relocation.",
    location: "Córdoba, Argentina",
    impact: "Natural heritage preservation",
    co2Capture: "3.2 tons/year",
    urgency: "high",
  },
  {
    id: 2,
    projectName: "Misiones Rainforest in Danger",
    ngoName: "Green Misiones",
    ngoWallet: "0x4B0897b0513fdC7C541B6d9D7E929C4e5364D2dB",
    targetAmount: parseEther("4.5").toString(),
    raisedAmount: parseEther("2.1").toString(),
    active: true,
    createdAt: Math.floor(Date.now() / 1000) - 86400 * 3, // 3 días atrás
    image: "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=1000&auto=format&fit=crop",
    description: "Preservation of 20 hectares of native rainforest with unique species from the Misiones region.",
    location: "Misiones, Argentina",
    impact: "Green lung protection",
    co2Capture: "5.5 tons/year",
    urgency: "high",
  },
  {
    id: 3,
    projectName: "Chaco Quebracho Trees",
    ngoName: "Sustainable Chaco",
    ngoWallet: "0xdD870fA1b7C4700F2BD7f44238821C26f7392148",
    targetAmount: parseEther("2.8").toString(),
    raisedAmount: parseEther("0.5").toString(),
    active: true,
    createdAt: Math.floor(Date.now() / 1000) - 86400 * 12, // 12 días atrás
    image: "https://images.unsplash.com/photo-1440342359743-84fcb8c21f21?q=80&w=1000&auto=format&fit=crop",
    description: "Protection of the last red quebracho trees in the Gran Chaco against deforestation.",
    location: "Chaco, Argentina",
    impact: "Biodiversity preservation",
    co2Capture: "2.7 tons/year",
    urgency: "high",
  },
];

// Function to get a sample project by ID
export const getSampleProjectById = (id: number): TreeProject | undefined => {
  return sampleProjects.find(project => project.id === id);
};

// Function to get projects filtered by urgency
export const getSampleProjectsByUrgency = (urgency: "low" | "medium" | "high"): TreeProject[] => {
  return sampleProjects.filter(project => project.urgency === urgency);
};

// Function to get active projects
export const getActiveSampleProjects = (): TreeProject[] => {
  return sampleProjects.filter(project => project.active);
};
