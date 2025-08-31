import { useCallback, useEffect, useState } from "react";
import type { Donation, DonationData, TreeProject } from "../_types";
import { parseEther } from "viem";
import { useAccount, useContractRead, useContractWrite, usePublicClient, useWaitForTransaction } from "wagmi";

// ABI del contrato NGODonations (funciones principales)
const DONATIONS_ABI = [
  "function getProject(uint256 projectId) external view returns (tuple(uint256 id, string projectName, string ngoName, address ngoWallet, uint256 targetAmount, uint256 raisedAmount, bool active, uint256 createdAt))",
  "function getProjectDonations(uint256 projectId) external view returns (tuple(uint256 amount, string donorName, string message, uint256 time, address donorAddress)[])",
  "function donateToProject(uint256 projectId, string calldata donorName, string calldata message) external payable",
  "function nextProjectId() external view returns (uint256)",
  "event DonationReceived(uint256 indexed projectId, address indexed donor, uint256 amount)",
  "event ProjectCreated(uint256 indexed projectId, string projectName, address indexed ngoWallet, uint256 targetAmount)",
] as const;

// Dirección del contrato (se debe configurar después del deploy)
const DONATIONS_CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_DONATIONS_CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000";

// Tipos para los datos del contrato
type ContractProjectData = {
  id: bigint;
  projectName: string;
  ngoName: string;
  ngoWallet: `0x${string}`;
  targetAmount: bigint;
  raisedAmount: bigint;
  active: boolean;
  createdAt: bigint;
};

type ContractDonationData = {
  amount: bigint;
  donorName: string;
  message: string;
  time: bigint;
  donorAddress: `0x${string}`;
};

export const useDonationsContract = () => {
  const { address: userAddress } = useAccount();
  const publicClient = usePublicClient();
  const [projects, setProjects] = useState<TreeProject[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Obtener el número total de proyectos
  const { data: nextProjectId } = useContractRead({
    address: DONATIONS_CONTRACT_ADDRESS as `0x${string}`,
    abi: DONATIONS_ABI,
    functionName: "nextProjectId",
    watch: true,
  });

  // Hook para hacer donaciones
  const {
    data: donateData,
    write: donate,
    isLoading: isDonating,
  } = useContractWrite({
    address: DONATIONS_CONTRACT_ADDRESS as `0x${string}`,
    abi: DONATIONS_ABI,
    functionName: "donateToProject",
  });

  // Esperar a que se confirme la transacción
  const { isLoading: isConfirming, isSuccess: isDonationSuccess } = useWaitForTransaction({
    hash: donateData?.hash,
  });

  // Cargar un proyecto específico
  const loadProject = useCallback(
    async (projectId: number): Promise<TreeProject | null> => {
      try {
        if (!publicClient) {
          console.warn("Public client no disponible");
          return null;
        }

        if (
          !DONATIONS_CONTRACT_ADDRESS ||
          DONATIONS_CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000"
        ) {
          console.warn("Dirección del contrato no configurada");
          return null;
        }

        const project = (await publicClient.readContract({
          address: DONATIONS_CONTRACT_ADDRESS as `0x${string}`,
          abi: DONATIONS_ABI,
          functionName: "getProject",
          args: [BigInt(projectId)],
        })) as ContractProjectData;

        if (!project || project.id === 0n) return null;

        return {
          id: Number(project.id),
          projectName: project.projectName,
          ngoName: project.ngoName,
          ngoWallet: project.ngoWallet,
          targetAmount: project.targetAmount.toString(),
          raisedAmount: project.raisedAmount.toString(),
          active: project.active,
          createdAt: Number(project.createdAt),
        };
      } catch (err) {
        console.error(`Error loading project ${projectId}:`, err);
        return null;
      }
    },
    [publicClient],
  );

  // Cargar todos los proyectos
  const loadProjects = useCallback(async () => {
    if (!nextProjectId || nextProjectId === 0n) {
      console.log("No hay proyectos disponibles");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const projectPromises: Promise<TreeProject | null>[] = [];

      // Crear promesas para cargar cada proyecto
      for (let i = 1; i < Number(nextProjectId); i++) {
        projectPromises.push(loadProject(i));
      }

      const loadedProjects = await Promise.all(projectPromises);
      const validProjects = loadedProjects.filter((project): project is TreeProject => project !== null);

      // Enriquecer con datos adicionales para la UI
      const enrichedProjects = validProjects.map(project => ({
        ...project,
        image: getProjectImage(project.projectName),
        description: getProjectDescription(project.projectName),
        location: getProjectLocation(project.projectName),
        impact: getProjectImpact(project.projectName),
        co2Capture: getProjectCO2Capture(project.projectName),
        urgency: getProjectUrgency(project.projectName),
      }));

      setProjects(enrichedProjects);
      console.log(`Proyectos cargados: ${enrichedProjects.length}`);
    } catch (err) {
      console.error("Error loading projects:", err);
      setError("Error al cargar los proyectos");
    } finally {
      setIsLoading(false);
    }
  }, [nextProjectId, loadProject]);

  // Cargar donaciones de un proyecto
  const loadProjectDonations = useCallback(
    async (projectId: number): Promise<Donation[]> => {
      try {
        if (!publicClient) {
          console.warn("Public client no disponible");
          return [];
        }

        if (
          !DONATIONS_CONTRACT_ADDRESS ||
          DONATIONS_CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000"
        ) {
          console.warn("Dirección del contrato no configurada");
          return [];
        }

        const donations = (await publicClient.readContract({
          address: DONATIONS_CONTRACT_ADDRESS as `0x${string}`,
          abi: DONATIONS_ABI,
          functionName: "getProjectDonations",
          args: [BigInt(projectId)],
        })) as ContractDonationData[];

        return donations.map(donation => ({
          amount: donation.amount.toString(),
          donorName: donation.donorName,
          message: donation.message,
          time: Number(donation.time),
          donorAddress: donation.donorAddress,
        }));
      } catch (err) {
        console.error(`Error loading donations for project ${projectId}:`, err);
        return [];
      }
    },
    [publicClient],
  );

  // Hacer una donación
  const makeDonation = useCallback(
    async (donationData: DonationData) => {
      if (!userAddress) {
        throw new Error("Usuario no conectado");
      }

      if (!donate) {
        throw new Error("Contrato no disponible");
      }

      if (!donationData.amount || parseFloat(donationData.amount) <= 0) {
        throw new Error("Monto de donación inválido");
      }

      if (!donationData.donorName || donationData.donorName.trim() === "") {
        throw new Error("Nombre del donante es requerido");
      }

      try {
        const amountInWei = parseEther(donationData.amount);

        await donate({
          args: [BigInt(donationData.projectId), donationData.donorName, donationData.message || ""],
          value: amountInWei,
        });
      } catch (err) {
        console.error("Error making donation:", err);
        throw new Error("Error al procesar la donación");
      }
    },
    [donate, userAddress],
  );

  // Cargar proyectos cuando cambie nextProjectId
  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  // Funciones auxiliares para enriquecer los datos de los proyectos
  const getProjectImage = (projectName: string): string => {
    // Mapear nombres de proyectos a imágenes
    const imageMap: Record<string, string> = {
      "Rescate de Árboles Centenarios": "/images/tree-1.jpg",
      "Reforestación del Bosque Nativo": "/images/tree-2.jpg",
      "Protección de Biodiversidad": "/images/tree-3.jpg",
      "Rescate de Árboles en Córdoba": "/images/tree-4.jpg",
      "Conservación del Amazonas": "/images/tree-5.jpg",
    };
    return imageMap[projectName] || "/images/default-tree.jpg";
  };

  const getProjectDescription = (projectName: string): string => {
    const descriptionMap: Record<string, string> = {
      "Rescate de Árboles Centenarios": "Protegiendo árboles centenarios que son patrimonio natural de la región.",
      "Reforestación del Bosque Nativo": "Recuperando áreas degradadas con especies nativas autóctonas.",
      "Protección de Biodiversidad": "Conservando la diversidad biológica de nuestros ecosistemas.",
      "Rescate de Árboles en Córdoba": "Salvando árboles urbanos y rurales de la provincia de Córdoba.",
      "Conservación del Amazonas": "Protegiendo la selva amazónica y sus especies únicas.",
    };
    return descriptionMap[projectName] || "Proyecto de conservación ambiental.";
  };

  const getProjectLocation = (projectName: string): string => {
    const locationMap: Record<string, string> = {
      "Rescate de Árboles Centenarios": "Córdoba, Argentina",
      "Reforestación del Bosque Nativo": "Patagonia, Argentina",
      "Protección de Biodiversidad": "Misiones, Argentina",
      "Rescate de Árboles en Córdoba": "Córdoba, Argentina",
      "Conservación del Amazonas": "Amazonas, Brasil",
    };
    return locationMap[projectName] || "Argentina";
  };

  const getProjectImpact = (projectName: string): string => {
    const impactMap: Record<string, string> = {
      "Rescate de Árboles Centenarios": "Preservación de patrimonio natural",
      "Reforestación del Bosque Nativo": "Recuperación de ecosistemas",
      "Protección de Biodiversidad": "Conservación de especies",
      "Rescate de Árboles en Córdoba": "Mejora del paisaje urbano",
      "Conservación del Amazonas": "Protección del pulmón del planeta",
    };
    return impactMap[projectName] || "Conservación ambiental";
  };

  const getProjectCO2Capture = (projectName: string): string => {
    const co2Map: Record<string, string> = {
      "Rescate de Árboles Centenarios": "2.5 toneladas/año",
      "Reforestación del Bosque Nativo": "1.8 toneladas/año",
      "Protección de Biodiversidad": "1.2 toneladas/año",
      "Rescate de Árboles en Córdoba": "1.5 toneladas/año",
      "Conservación del Amazonas": "5.0 toneladas/año",
    };
    return co2Map[projectName] || "1.0 toneladas/año";
  };

  const getProjectUrgency = (projectName: string): "low" | "medium" | "high" => {
    const urgencyMap: Record<string, "low" | "medium" | "high"> = {
      "Rescate de Árboles Centenarios": "high",
      "Reforestación del Bosque Nativo": "medium",
      "Protección de Biodiversidad": "high",
      "Rescate de Árboles en Córdoba": "medium",
      "Conservación del Amazonas": "high",
    };
    return urgencyMap[projectName] || "medium";
  };

  return {
    // Estado
    projects,
    isLoading,
    error,

    // Acciones
    loadProjects,
    loadProject,
    loadProjectDonations,
    makeDonation,

    // Estado de transacciones
    isDonating,
    isConfirming,
    isDonationSuccess,
    donationHash: donateData?.hash,

    // Utilidades
    refreshProjects: loadProjects,
  };
};
