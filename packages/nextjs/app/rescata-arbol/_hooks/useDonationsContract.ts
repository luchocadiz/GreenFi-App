import { useCallback, useEffect, useState } from "react";
import type { Donation, DonationData, TreeProject } from "../_types";
import { parseEther } from "viem";
import { useAccount, useContractRead, useContractWrite, usePublicClient, useWaitForTransaction } from "wagmi";
import { sampleProjects } from "../_data/sampleProjects";
import deployedContracts from "~~/contracts/deployedContracts";
import { notification } from "~~/utils/scaffold-eth";

// ABI del contrato NGODonations (funciones principales)
const DONATIONS_ABI = [
  "function getProject(uint256 projectId) external view returns (tuple(uint256 id, string projectName, string ngoName, address ngoWallet, uint256 targetAmount, uint256 raisedAmount, bool active, uint256 createdAt))",
  "function getProjectDonations(uint256 projectId) external view returns (tuple(uint256 amount, string donorName, string message, uint256 time, address donorAddress)[])",
  "function donateToProject(uint256 projectId, string calldata donorName, string calldata message) external payable",
  "function nextProjectId() external view returns (uint256)",
  "event DonationReceived(uint256 indexed projectId, address indexed donor, uint256 amount)",
  "event ProjectCreated(uint256 indexed projectId, string projectName, address indexed ngoWallet, uint256 targetAmount)",
] as const;

// Obtener la configuración del contrato NGODonations
const getContractConfig = () => {
  // Verificar si existe la configuración del contrato en las redes disponibles
  const liskSepoliaConfig = deployedContracts[4202] as any;
  const localhostConfig = deployedContracts[31337] as any;
  
  const config = liskSepoliaConfig?.NGODonations || localhostConfig?.NGODonations;
  return config;
};

const contractConfig = getContractConfig();
const DONATIONS_CONTRACT_ADDRESS = contractConfig?.address || "0x0000000000000000000000000000000000000000";

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
  const [projects, setProjects] = useState<TreeProject[]>(sampleProjects); // Inicializar con proyectos de ejemplo
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useSampleData, setUseSampleData] = useState(true); // Flag para usar datos de ejemplo

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
    abi: contractConfig?.abi || DONATIONS_ABI,
    functionName: "donateToProject",
    onSuccess: () => {
      notification.success("¡Donación enviada exitosamente!");
    },
    onError: (error) => {
      console.error("Error al realizar donación:", error);
      notification.error("Error al procesar la donación");
    },
  });

  // Esperar a que se confirme la transacción
  const { isLoading: isConfirming, isSuccess: isDonationSuccess } = useWaitForTransaction({
    hash: donateData?.hash,
    onSuccess: (data) => {
      notification.success("¡Donación confirmada en blockchain!");
      // Actualizar los datos del proyecto después de una donación exitosa
      if (useSampleData) {
        // Si estamos usando datos de ejemplo, simular la actualización
        setTimeout(() => {
          loadProjects();
        }, 1000);
      }
    },
  });

  // Cargar un proyecto específico
  const loadProject = useCallback(
    async (projectId: number): Promise<TreeProject | null> => {
      try {
        if (!publicClient) {
          console.warn("Public client no disponible");
          return null;
        }

        if (!DONATIONS_CONTRACT_ADDRESS || DONATIONS_CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000") {
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
    // Si no hay contrato disponible o no hay proyectos, usar datos de ejemplo
    if (!contractConfig || !nextProjectId || nextProjectId === 0n) {
      console.log("Usando proyectos de ejemplo");
      setProjects(sampleProjects);
      setUseSampleData(true);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    setUseSampleData(false);

    try {
      const projectPromises: Promise<TreeProject | null>[] = [];

      // Crear promesas para cargar cada proyecto
      for (let i = 1; i < Number(nextProjectId); i++) {
        projectPromises.push(loadProject(i));
      }

      const loadedProjects = await Promise.all(projectPromises);
      const validProjects = loadedProjects.filter((project): project is TreeProject => project !== null);

      if (validProjects.length === 0) {
        // Si no hay proyectos válidos del contrato, usar datos de ejemplo
        console.log("No hay proyectos válidos del contrato, usando datos de ejemplo");
        setProjects(sampleProjects);
        setUseSampleData(true);
      } else {
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
        setUseSampleData(false);
        console.log(`Proyectos del contrato cargados: ${enrichedProjects.length}`);
      }
    } catch (err) {
      console.error("Error loading projects:", err);
      // En caso de error, usar datos de ejemplo
      console.log("Error al cargar proyectos del contrato, usando datos de ejemplo");
      setProjects(sampleProjects);
      setUseSampleData(true);
      setError(null); // No mostrar error, solo usar datos de ejemplo
    } finally {
      setIsLoading(false);
    }
  }, [nextProjectId, loadProject, contractConfig]);

  // Cargar donaciones de un proyecto
  const loadProjectDonations = useCallback(
    async (projectId: number): Promise<Donation[]> => {
      try {
        if (!publicClient) {
          console.warn("Public client no disponible");
          return [];
        }

        if (!DONATIONS_CONTRACT_ADDRESS || DONATIONS_CONTRACT_ADDRESS === "0x0000000000000000000000000000000000000000") {
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
        notification.error("Por favor conecta tu wallet");
        throw new Error("Usuario no conectado");
      }

      if (!donationData.amount || parseFloat(donationData.amount) <= 0) {
        notification.error("Monto de donación inválido");
        throw new Error("Monto de donación inválido");
      }

      if (!donationData.donorName || donationData.donorName.trim() === "") {
        notification.error("Nombre del donante es requerido");
        throw new Error("Nombre del donante es requerido");
      }

      // Si estamos usando datos de ejemplo, simular la donación
      if (useSampleData) {
        notification.info("Modo demo: Simulando donación...");
        
        // Simular delay de transacción
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Actualizar el proyecto localmente para simular la donación
        setProjects(prevProjects => 
          prevProjects.map(project => {
            if (project.id === donationData.projectId) {
              const currentRaised = parseFloat(project.raisedAmount);
              const donationAmount = parseFloat(donationData.amount) * 1e18; // Convertir a wei
              const newRaised = currentRaised + donationAmount;
              
              return {
                ...project,
                raisedAmount: newRaised.toString()
              };
            }
            return project;
          })
        );
        
        notification.success(`¡Donación simulada exitosamente! Gracias ${donationData.donorName}`);
        return;
      }

      // Donación real al contrato
      if (!donate) {
        notification.error("Contrato no disponible");
        throw new Error("Contrato no disponible");
      }

      try {
        const amountInWei = parseEther(donationData.amount);

        await donate({
          args: [BigInt(donationData.projectId), donationData.donorName, donationData.message || ""],
          value: amountInWei,
        });
      } catch (err) {
        console.error("Error making donation:", err);
        notification.error("Error al procesar la donación");
        throw new Error("Error al procesar la donación");
      }
    },
    [donate, userAddress, useSampleData],
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
    useSampleData,

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
    contractAddress: DONATIONS_CONTRACT_ADDRESS,
  };
};
