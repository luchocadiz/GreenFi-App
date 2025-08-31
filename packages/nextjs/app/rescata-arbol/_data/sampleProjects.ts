import { TreeProject } from "../_types";
import { parseEther } from "viem";

// Proyectos de ejemplo hardcodeados para mostrar cuando no hay proyectos del contrato
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
    image: "/images/trees/ceiba.jpg",
    description: "Una majestuosa ceiba de más de 200 años está en peligro por la expansión urbana. Necesitamos fondos para su protección y reubicación.",
    location: "Córdoba, Argentina",
    impact: "Preservación de patrimonio natural",
    co2Capture: "3.2 toneladas/año",
    urgency: "high"
  },
  {
    id: 2,
    projectName: "Bosque Nativo del Litoral",
    ngoName: "Verde Esperanza",
    ngoWallet: "0x8ba1f109551bD432803012645Hac136c30f04D5B",
    targetAmount: parseEther("1.8").toString(),
    raisedAmount: parseEther("0.3").toString(),
    active: true,
    createdAt: Math.floor(Date.now() / 1000) - 86400 * 5, // 5 días atrás
    image: "/images/trees/litoral.jpg",
    description: "Reforestación de 10 hectáreas con especies nativas del litoral argentino para recuperar el ecosistema perdido.",
    location: "Entre Ríos, Argentina",
    impact: "Recuperación de ecosistemas",
    co2Capture: "1.8 toneladas/año",
    urgency: "medium"
  },
  {
    id: 3,
    projectName: "Algarrobos de la Patagonia",
    ngoName: "Conservación Patagónica",
    ngoWallet: "0x1CBd3b2770909D4e10f157cABC84C7264073C9Ec",
    targetAmount: parseEther("3.0").toString(),
    raisedAmount: parseEther("1.2").toString(),
    active: true,
    createdAt: Math.floor(Date.now() / 1000) - 86400 * 10, // 10 días atrás
    image: "/images/trees/algarrobo.jpg",
    description: "Protección de un bosque de algarrobos centenarios amenazados por la sequía y el cambio climático.",
    location: "Neuquén, Argentina",
    impact: "Conservación de especies",
    co2Capture: "2.1 toneladas/año",
    urgency: "high"
  },
  {
    id: 4,
    projectName: "Selva Misionera en Peligro",
    ngoName: "Misiones Verde",
    ngoWallet: "0x4B0897b0513fdC7C541B6d9D7E929C4e5364D2dB",
    targetAmount: parseEther("4.5").toString(),
    raisedAmount: parseEther("2.1").toString(),
    active: true,
    createdAt: Math.floor(Date.now() / 1000) - 86400 * 3, // 3 días atrás
    image: "/images/trees/selva.jpg",
    description: "Preservación de 20 hectáreas de selva nativa con especies únicas de la región misionera.",
    location: "Misiones, Argentina",
    impact: "Protección del pulmón verde",
    co2Capture: "5.5 toneladas/año",
    urgency: "high"
  },
  {
    id: 5,
    projectName: "Palmeras del Delta",
    ngoName: "Delta Sustentable",
    ngoWallet: "0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed",
    targetAmount: parseEther("1.2").toString(),
    raisedAmount: parseEther("0.9").toString(),
    active: true,
    createdAt: Math.floor(Date.now() / 1000) - 86400 * 2, // 2 días atrás
    image: "/images/trees/palmeras.jpg",
    description: "Restauración del hábitat natural de palmeras nativas en el Delta del Paraná.",
    location: "Buenos Aires, Argentina",
    impact: "Restauración de humedales",
    co2Capture: "1.3 toneladas/año",
    urgency: "medium"
  },
  {
    id: 6,
    projectName: "Quebrachos del Chaco",
    ngoName: "Chaco Sustentable",
    ngoWallet: "0xdD870fA1b7C4700F2BD7f44238821C26f7392148",
    targetAmount: parseEther("2.8").toString(),
    raisedAmount: parseEther("0.5").toString(),
    active: true,
    createdAt: Math.floor(Date.now() / 1000) - 86400 * 12, // 12 días atrás
    image: "/images/trees/quebracho.jpg",
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
