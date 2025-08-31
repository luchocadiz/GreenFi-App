import { useCallback, useEffect, useState } from "react";
import { sampleProjects } from "../_data/sampleProjects";
import type { Donation, DonationData, TreeProject } from "../_types";
import { parseEther } from "viem";
import { useAccount, useContractRead, useContractWrite, usePublicClient, useWaitForTransaction } from "wagmi";
import deployedContracts from "~~/contracts/deployedContracts";
import { notification } from "~~/utils/scaffold-eth";

// ABI del contrato NGODonations (funciones principales)
// Nota: Estos ABIs coinciden exactamente con el contrato Donations.sol
const DONATIONS_ABI = [
  "function getProject(uint256 projectId) external view returns (tuple(uint256 id, string projectName, string ngoName, address ngoWallet, uint256 targetAmount, uint256 raisedAmount, bool active, uint256 createdAt))",
  "function getProjectDonations(uint256 projectId) external view returns (tuple(uint256 amount, string donorName, string message, uint256 time, address donorAddress)[])",
  "function donateToProject(uint256 projectId, string calldata donorName, string calldata message) external payable",
  "function nextProjectId() external view returns (uint256)",
  "function withdrawFunds(uint256 projectId) external",
  "function owner() external view returns (address)",
  "event DonationReceived(uint256 indexed projectId, address indexed donor, uint256 amount)",
  "event ProjectCreated(uint256 indexed projectId, string projectName, address indexed ngoWallet, uint256 targetAmount)",
  "event FundsWithdrawn(uint256 indexed projectId, uint256 amount)",
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
  const [projects, setProjects] = useState<TreeProject[]>(sampleProjects); // Mostrar proyectos de ejemplo como UI
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useSampleData, setUseSampleData] = useState(false); // SIEMPRE usar blockchain real

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
    onError: error => {
      console.error("Error al realizar donación:", error);
      notification.error("Error al procesar la donación");
    },
  });

  // Esperar a que se confirme la transacción
  const { isLoading: isConfirming, isSuccess: isDonationSuccess } = useWaitForTransaction({
    hash: donateData?.hash,
    onSuccess: data => {
      console.log("🎉 Transacción confirmada:", data);

      // Buscar el evento DonationReceived en los logs para obtener información adicional
      const donationEvent = data.logs?.find(
        (log: any) => log.topics && log.topics[0] && log.topics[0].includes("DonationReceived"),
      );

      if (donationEvent) {
        console.log("📧 Evento de donación encontrado:", donationEvent);
        notification.success("¡Donación confirmada en blockchain! 🎉");
      } else {
        notification.success("¡Donación procesada exitosamente!");
      }

      // Actualizar los datos del proyecto después de una donación exitosa
      if (!useSampleData) {
        // Recargar proyectos desde el contrato para obtener los datos actualizados
        setTimeout(() => {
          console.log("🔄 Recargando proyectos desde el contrato...");
          loadProjects();
        }, 2000);
      }
    },
    onError: error => {
      console.error("❌ Error en la confirmación de transacción:", error);
      notification.error("Error al confirmar la transacción");
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
    console.log("🔄 Cargando proyectos...");

    // SIEMPRE mostrar proyectos de ejemplo como UI, pero SIEMPRE usar blockchain para donaciones
    setProjects(sampleProjects);
    setUseSampleData(false); // NUNCA simular, siempre usar blockchain real
    setIsLoading(false);
    setError(null);

    // Si hay contrato disponible, intentar cargar proyectos reales también
    if (contractConfig && nextProjectId && Number(nextProjectId) > 0) {
      console.log("🔗 Intentando cargar proyectos del contrato...");
      setIsLoading(true);

      try {
        const projectPromises: Promise<TreeProject | null>[] = [];

        // Crear promesas para cargar cada proyecto
        for (let i = 1; i < Number(nextProjectId); i++) {
          projectPromises.push(loadProject(i));
        }

        const loadedProjects = await Promise.all(projectPromises);
        const validProjects = loadedProjects.filter((project): project is TreeProject => project !== null);

        if (validProjects.length > 0) {
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

          // Combinar proyectos del contrato con los de ejemplo
          setProjects([...enrichedProjects, ...sampleProjects]);
          console.log(`✅ Proyectos del contrato cargados: ${enrichedProjects.length}`);
        }
      } catch (err) {
        console.error("❌ Error loading contract projects:", err);
        // Mantener solo los proyectos de ejemplo
      } finally {
        setIsLoading(false);
      }
    } else {
      console.log("📋 No hay proyectos en el contrato, usando solo proyectos de ejemplo para UI");
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

  // Hacer una donación - SIEMPRE usa blockchain real
  const makeDonation = useCallback(
    async (donationData: DonationData) => {
      console.log("🚀 Iniciando donación REAL en blockchain:", donationData);

      if (!userAddress) {
        notification.error("Por favor conecta tu wallet con MetaMask");
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

      // SIEMPRE procesar donación real en blockchain
      console.log("⛓️ Procesando donación REAL en blockchain...");
      console.log("📋 Datos del contrato:", {
        address: DONATIONS_CONTRACT_ADDRESS,
        contractConfig: !!contractConfig,
        donateFunction: !!donate,
        userAddress: userAddress,
      });

      if (!contractConfig || !contractConfig.address) {
        notification.error("Contrato no configurado. Verifica que el contrato NGODonations esté desplegado.");
        throw new Error("Contrato no configurado");
      }

      if (!donate) {
        notification.error("Función de donación no disponible. Verifica tu conexión a MetaMask.");
        throw new Error("Función de donación no disponible");
      }

      try {
        const amountInWei = parseEther(donationData.amount);
        console.log("💰 Monto en wei:", amountInWei.toString());
        console.log("📝 Argumentos del contrato:", {
          projectId: BigInt(donationData.projectId),
          donorName: donationData.donorName,
          message: donationData.message || "¡Salvemos este árbol!",
          value: amountInWei.toString(),
        });

        notification.info("🔄 Enviando transacción a blockchain... Confirma en MetaMask");

        const tx = await donate({
          args: [
            BigInt(donationData.projectId),
            donationData.donorName,
            donationData.message || "¡Salvemos este árbol!",
          ],
          value: amountInWei,
        });

        console.log("✅ Transacción enviada a blockchain:", tx);
        notification.success("🎉 Transacción enviada! Esperando confirmación...");
      } catch (err: any) {
        console.error("❌ Error making donation:", err);

        // Manejar diferentes tipos de errores
        if (err?.message?.includes("User rejected") || err?.message?.includes("user rejected")) {
          notification.error("❌ Transacción cancelada por el usuario");
        } else if (err?.message?.includes("insufficient funds")) {
          notification.error("❌ Fondos insuficientes en la wallet");
        } else if (err?.message?.includes("OnlyOwner")) {
          notification.error("❌ Solo el propietario puede crear proyectos");
        } else if (err?.message?.includes("ProjectNotFound")) {
          notification.error("❌ Proyecto no encontrado en el contrato");
        } else if (err?.message?.includes("InsufficientFunds")) {
          notification.error("❌ El monto enviado es 0 o inválido");
        } else if (err?.message?.includes("InvalidArguments")) {
          notification.error("❌ Argumentos inválidos enviados al contrato");
        } else {
          notification.error(`❌ Error: ${err?.message || "Error desconocido en blockchain"}`);
        }

        throw err;
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

  // Debug: Información del contrato para verificar configuración
  useEffect(() => {
    console.log("🔧 Configuración del contrato NGODonations:");
    console.log("📍 Dirección:", DONATIONS_CONTRACT_ADDRESS);
    console.log("⚙️ Config disponible:", !!contractConfig);
    console.log("🌐 Usuario conectado:", !!userAddress);
    console.log("⛓️ Modo blockchain REAL:", !useSampleData);
    if (contractConfig) {
      console.log("📋 ABI disponible:", !!contractConfig.abi);
      console.log("🚀 LISTO para donaciones reales!");
    } else {
      console.warn("⚠️ Contrato no configurado - verifica el deployment");
    }
  }, [userAddress, useSampleData]);

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

    // Debug info
    contractConfig,
    isContractReady: !!contractConfig && !!contractConfig.address,
  };
};
