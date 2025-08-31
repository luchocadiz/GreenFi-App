"use client";

import { useState } from "react";
import { CheckoutModal } from "./_components/CheckoutModal";
import { ConfirmationModal } from "./_components/ConfirmationModal";
import { ContractDebugInfo } from "./_components/ContractDebugInfo";
import { Header } from "./_components/Header";
import { TreeCard } from "./_components/TreeCard";
import { useDonationsContract } from "./_hooks/useDonationsContract";
import { useFilecoinStorage } from "./_hooks/useFilecoinStorage";
import type { DonationData, TreeProject } from "./_types";
import { useAccount } from "wagmi";
import { GreenSpinner } from "~~/components/GreenSpinner";
import { useAuth } from "~~/hooks/useAuth";

const RescataArbolPage = () => {
  const [selectedProject, setSelectedProject] = useState<TreeProject | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [donationData, setDonationData] = useState<DonationData | null>(null);

  const { isAuthenticated } = useAuth();
  const { address: userAddress } = useAccount();
  const {
    projects,
    isLoading: isLoadingProjects,
    error: projectsError,
    makeDonation,
    isDonating,
    isConfirming,
    donationHash,
    refreshProjects,
    useSampleData,
    contractAddress,
    isContractReady,
  } = useDonationsContract();
  const { uploadToFilecoin } = useFilecoinStorage();

  // Manejar selección de proyecto para rescate
  const handleRescueProject = (project: TreeProject) => {
    setSelectedProject(project);
    setIsCheckoutOpen(true);
  };

  // Manejar cierre del checkout
  const handleCloseCheckout = () => {
    setIsCheckoutOpen(false);
    setSelectedProject(null);
  };

  // Manejar completar el checkout
  const handleCompleteCheckout = async (donationData: DonationData) => {
    try {
      // Hacer la donación en el contrato
      await makeDonation(donationData);

      // Cerrar checkout
      setIsCheckoutOpen(false);

      // Esperar a que se confirme la transacción
      if (donationHash) {
        // Subir evidencia a Filecoin (simulado)
        const filecoinCid = await uploadToFilecoin({
          treeImage: donationData.treeName,
          receipt: `Recibo_${donationData.treeName}_${Date.now()}.pdf`,
          transactionHash: donationHash,
        });

        // Actualizar datos de donación
        const updatedDonationData = {
          ...donationData,
          transactionHash: donationHash,
          filecoinCid,
        };

        setDonationData(updatedDonationData);
        setIsConfirmationOpen(true);

        // Refrescar proyectos para mostrar el nuevo estado
        refreshProjects();
      }
    } catch (error) {
      console.error("Error processing donation:", error);
      alert("Error al procesar la donación. Por favor, intenta nuevamente.");
    }
  };

  // Manejar cierre de confirmación
  const handleCloseConfirmation = () => {
    setIsConfirmationOpen(false);
    setDonationData(null);
    setSelectedProject(null);
  };

  // Mostrar mensaje si no está autenticado
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🌳</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Conecta tu wallet para rescatar árboles</h1>
          <p className="text-lg text-gray-600 mb-8">Necesitas estar autenticado para continuar</p>
          <div className="text-sm text-gray-500">Conecta tu wallet de Lisk para acceder a la aplicación</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold text-gray-800 mb-6">🌱 Rescatá un Árbol</h1>
            <p className="text-xl text-gray-600 mb-8">
              Cada donación se registra en blockchain para
              <br />
              máxima transparencia y trazabilidad
            </p>
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-4xl mb-2">🌳</div>
                  <div className="text-2xl font-bold text-green-600">{projects.length}</div>
                  <div className="text-gray-600">Proyectos Activos</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-2">💚</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {projects
                      .reduce((total, project) => {
                        const raised = parseFloat(project.raisedAmount) / 1e18;
                        return total + raised;
                      }, 0)
                      .toFixed(2)}{" "}
                    ETH
                  </div>
                  <div className="text-gray-600">Total Recaudado</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-2">🌍</div>
                  <div className="text-2xl font-bold text-purple-600">
                    {projects
                      .reduce((total, project) => {
                        const co2Value = parseFloat(project.co2Capture?.split(" ")[0] || "0");
                        return total + co2Value;
                      }, 0)
                      .toFixed(1)}
                  </div>
                  <div className="text-gray-600">Toneladas CO2/año</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Proyectos de Árboles */}
        <section id="trees" className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Árboles que Necesitan tu Ayuda</h2>
            <p className="text-lg text-gray-600">Seleccioná un proyecto y contribuí a la conservación ambiental</p>

            {/* Indicador de modo - SIEMPRE blockchain */}
            <div className="mt-4">
              <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm">
                <span className="mr-2">⛓️</span>
                Donaciones Reales en Blockchain
              </div>
            </div>

            {contractAddress && (
              <div className="mt-2 text-xs text-gray-500">
                Contrato: {contractAddress.slice(0, 6)}...{contractAddress.slice(-4)}
                {isContractReady ? (
                  <span className="ml-2 text-green-600">✅ Listo</span>
                ) : (
                  <span className="ml-2 text-red-600">❌ No configurado</span>
                )}
              </div>
            )}
          </div>

          {/* Estado de carga y error */}
          {isLoadingProjects && (
            <div className="text-center py-12">
              <GreenSpinner size="xl" className="mx-auto mb-4" />
              <p className="text-gray-600">Cargando proyectos...</p>
            </div>
          )}

          {projectsError && (
            <div className="text-center py-12">
              <div className="text-red-500 text-xl mb-4">❌</div>
              <p className="text-red-600 mb-4">Error al cargar los proyectos</p>
              <button
                onClick={refreshProjects}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
              >
                Reintentar
              </button>
            </div>
          )}

          {/* Grid de proyectos */}
          {!isLoadingProjects && !projectsError && projects.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map(project => (
                <TreeCard key={project.id} project={project} onRescue={handleRescueProject} />
              ))}
            </div>
          )}

          {/* Sin proyectos */}
          {!isLoadingProjects && !projectsError && projects.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🌱</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">No hay proyectos disponibles</h3>
              <p className="text-gray-600 mb-4">
                Los proyectos se cargarán automáticamente cuando estén disponibles en el contrato.
              </p>
              <button
                onClick={refreshProjects}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
              >
                Actualizar Proyectos
              </button>
            </div>
          )}

          {/* Información sobre donaciones reales */}
          {projects.length > 0 && (
            <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-xl">
              <div className="flex items-start">
                <div className="text-green-600 text-2xl mr-3">🚀</div>
                <div>
                  <h3 className="text-green-800 font-semibold mb-2">Donaciones Reales en Blockchain</h3>
                  <p className="text-green-700 text-sm mb-3">
                    Todas las donaciones se procesan directamente en la blockchain a través de MetaMask. Los proyectos
                    mostrados son ejemplos de UI, pero las transacciones son reales.
                  </p>
                  <div className="text-xs text-green-600">
                    💡 Conecta tu wallet y dona con ETH real - Las transacciones quedan registradas en blockchain
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Cómo Funciona */}
        <section id="about" className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">¿Cómo Funciona?</h2>
            <p className="text-lg text-gray-600">El proceso es simple y transparente</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-6xl mb-4">1️⃣</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Seleccioná el proyecto</h3>
              <p className="text-gray-600">
                Elegí el proyecto de conservación que más te interese de nuestra lista verificada
              </p>
            </div>
            <div className="text-center">
              <div className="text-6xl mb-4">2️⃣</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Elegí tu contribución</h3>
              <p className="text-gray-600">Seleccioná el monto y método de pago que prefieras para tu donación</p>
            </div>
            <div className="text-center">
              <div className="text-6xl mb-4">3️⃣</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Impacto verificado</h3>
              <p className="text-gray-600">
                Tu donación se registra en blockchain y se ejecuta el proyecto de conservación
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Modales */}
      {selectedProject && (
        <CheckoutModal
          project={selectedProject}
          isOpen={isCheckoutOpen}
          onClose={handleCloseCheckout}
          onComplete={handleCompleteCheckout}
          isProcessing={isDonating || isConfirming}
        />
      )}

      {donationData && (
        <ConfirmationModal donationData={donationData} isOpen={isConfirmationOpen} onClose={handleCloseConfirmation} />
      )}

      {/* Componente de debug (solo en desarrollo) */}
      {process.env.NODE_ENV !== "production" && (
        <ContractDebugInfo
          contractAddress={contractAddress || ""}
          isContractReady={isContractReady}
          useSampleData={useSampleData}
          userAddress={userAddress}
        />
      )}
    </div>
  );
};

export default RescataArbolPage;
