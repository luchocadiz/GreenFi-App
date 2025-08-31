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
            <h1 className="text-5xl font-bold text-gray-800 mb-6">🌱 Save a Tree</h1>
            <p className="text-xl text-gray-600 mb-8">
              Every donation is recorded on blockchain for
              <br />
              maximum transparency and traceability
            </p>
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-4xl mb-2">🌳</div>
                  <div className="text-2xl font-bold text-green-600">{projects.length}</div>
                  <div className="text-gray-600">Active Projects</div>
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
                    LSK
                  </div>
                  <div className="text-gray-600">Total Raised</div>
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
                  <div className="text-gray-600">Tons CO2/year</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Proyectos de Árboles */}
        <section id="trees" className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Trees That Need Your Help</h2>
            <p className="text-lg text-gray-600">Select a project and contribute to environmental conservation</p>

            {/* Indicador de modo - SIEMPRE blockchain */}
            <div className="mt-4">
              <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm">
                <span className="mr-2">⛓️</span>
                Real Donations on Blockchain
              </div>
            </div>

            {contractAddress && (
              <div className="mt-2 text-xs text-gray-500">
                Contract: {contractAddress.slice(0, 6)}...{contractAddress.slice(-4)}
                {isContractReady ? (
                  <span className="ml-2 text-green-600">✅ Ready</span>
                ) : (
                  <span className="ml-2 text-red-600">❌ Not configured</span>
                )}
              </div>
            )}
          </div>

          {/* Estado de carga y error */}
          {isLoadingProjects && (
            <div className="text-center py-12">
              <GreenSpinner size="xl" className="mx-auto mb-4" />
              <p className="text-gray-600">Loading projects...</p>
            </div>
          )}

          {projectsError && (
            <div className="text-center py-12">
              <div className="text-red-500 text-xl mb-4">❌</div>
              <p className="text-red-600 mb-4">Error loading projects</p>
              <button
                onClick={refreshProjects}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
              >
                Retry
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
              <h3 className="text-2xl font-bold text-gray-800 mb-4">No projects available</h3>
              <p className="text-gray-600 mb-4">
                Projects will load automatically when they are available in the contract.
              </p>
              <button
                onClick={refreshProjects}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
              >
                Update Projects
              </button>
            </div>
          )}

          {/* Información sobre donaciones reales */}
          {projects.length > 0 && (
            <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-xl">
              <div className="flex items-start">
                <div className="text-green-600 text-2xl mr-3">🚀</div>
                <div>
                  <h3 className="text-green-800 font-semibold mb-2">Real Donations on Blockchain</h3>
                  <p className="text-green-700 text-sm mb-3">
                    All donations are processed directly on blockchain through MetaMask. The projects shown are UI
                    examples, but transactions are real.
                  </p>
                  <div className="text-xs text-green-600">
                    💡 Connect your wallet and donate with real LSK - Transactions are recorded on blockchain
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Cómo Funciona */}
        <section id="about" className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">How Does It Work?</h2>
            <p className="text-lg text-gray-600">The process is simple and transparent</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-6xl mb-4">1️⃣</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Select the project</h3>
              <p className="text-gray-600">
                Choose the conservation project that interests you most from our verified list
              </p>
            </div>
            <div className="text-center">
              <div className="text-6xl mb-4">2️⃣</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Choose your contribution</h3>
              <p className="text-gray-600">Select the amount and payment method you prefer for your donation</p>
            </div>
            <div className="text-center">
              <div className="text-6xl mb-4">3️⃣</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Verified impact</h3>
              <p className="text-gray-600">
                Your donation is recorded on blockchain and the conservation project is executed
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
          userAddress={userAddress}
        />
      )}
    </div>
  );
};

export default RescataArbolPage;
