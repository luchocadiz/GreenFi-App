"use client";

import { useState } from "react";
import { CheckoutModal } from "./_components/CheckoutModal";
import { ConfirmationModal } from "./_components/ConfirmationModal";
import { Header } from "./_components/Header";
import { TreeCard } from "./_components/TreeCard";
import { useFilecoinStorage } from "./_hooks/useFilecoinStorage";
import { useLiskTransaction } from "./_hooks/useLiskTransaction";
import type { DonationData, Tree } from "./_types";
import { useAuth } from "~~/hooks/useAuth";

const TREES_DATA: Tree[] = [
  {
    id: 1,
    name: "Roble Centenario",
    species: "Quercus robur",
    location: "Bosque de los Mil Años, Córdoba",
    description:
      "Este majestuoso roble de 150 años necesita protección contra la tala ilegal y restauración de su entorno.",
    image: "/images/trees/roble.jpg",
    rescueAmount: 5,
    urgency: "Alta",
    impact: "Protección de biodiversidad local",
    carbonCapture: "2.5 toneladas CO2/año",
  },
  {
    id: 2,
    name: "Araucaria del Sur",
    species: "Araucaria araucana",
    location: "Parque Nacional Lanín, Neuquén",
    description: "Conífera milenaria amenazada por el cambio climático. Necesita monitoreo y conservación.",
    image: "/images/trees/araucaria.jpg",
    rescueAmount: 3,
    urgency: "Media",
    impact: "Conservación de especie endémica",
    carbonCapture: "1.8 toneladas CO2/año",
  },
  {
    id: 3,
    name: "Ceibo Nacional",
    species: "Erythrina crista-galli",
    location: "Delta del Paraná, Buenos Aires",
    description: "Árbol nacional argentino que requiere reforestación en áreas afectadas por incendios.",
    image: "/images/trees/ceibo.jpg",
    rescueAmount: 1,
    urgency: "Baja",
    impact: "Reforestación de áreas quemadas",
    carbonCapture: "0.8 toneladas CO2/año",
  },
  {
    id: 4,
    name: "Algarrobo Blanco",
    species: "Prosopis alba",
    location: "Gran Chaco, Salta",
    description: "Árbol nativo del Chaco que necesita protección contra la deforestación para agricultura.",
    image: "/images/trees/algarrobo.jpg",
    rescueAmount: 2,
    urgency: "Alta",
    impact: "Preservación del ecosistema chaqueño",
    carbonCapture: "1.2 toneladas CO2/año",
  },
  {
    id: 5,
    name: "Pino Paraná",
    species: "Araucaria angustifolia",
    location: "Selva Misionera, Misiones",
    description: "Conífera de la selva subtropical que requiere conservación de su hábitat natural.",
    image: "/images/trees/pino-parana.jpg",
    rescueAmount: 4,
    urgency: "Media",
    impact: "Conservación de la selva misionera",
    carbonCapture: "2.0 toneladas CO2/año",
  },
  {
    id: 6,
    name: "Quebracho Colorado",
    species: "Schinopsis balansae",
    location: "Chaco Seco, Santiago del Estero",
    description: "Árbol histórico del Chaco que necesita protección contra la tala indiscriminada.",
    image: "/images/trees/quebracho.jpg",
    rescueAmount: 6,
    urgency: "Alta",
    impact: "Protección de bosque nativo",
    carbonCapture: "3.0 toneladas CO2/año",
  },
];

const RescataArbolPage = () => {
  const [selectedTree, setSelectedTree] = useState<Tree | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [donationData, setDonationData] = useState<DonationData | null>(null);

  const { isAuthenticated, userAddress } = useAuth();
  const { createTransaction, isProcessing } = useLiskTransaction();
  const { uploadToFilecoin, isUploading } = useFilecoinStorage();

  const handleRescueTree = (tree: Tree) => {
    setSelectedTree(tree);
    setIsCheckoutOpen(true);
  };

  const handleCheckoutComplete = async (data: DonationData) => {
    setDonationData(data);
    setIsCheckoutOpen(false);

    try {
      // 1. Crear transacción en Lisk
      const txHash = await createTransaction({
        treeId: data.treeId,
        amount: data.amount,
        userAddress: userAddress || "",
        treeName: data.treeName,
      });

      // 2. Subir evidencia a Filecoin (simulado)
      const filecoinCid = await uploadToFilecoin({
        treeImage: data.treeImage,
        receipt: data.receipt,
        transactionHash: txHash,
      });

      // 3. Mostrar confirmación
      setDonationData({
        ...data,
        transactionHash: txHash,
        filecoinCid,
      });

      setIsConfirmationOpen(true);
    } catch (error) {
      console.error("Error en el proceso de rescate:", error);
      // Aquí podrías mostrar un toast de error
    }
  };

  const handleCloseConfirmation = () => {
    setIsConfirmationOpen(false);
    setDonationData(null);
    setSelectedTree(null);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🌱</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Conecta tu wallet para rescatar árboles</h1>
          <p className="text-gray-600">Necesitas estar autenticado para continuar</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">🌱 Rescatá un Árbol</h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
            Protegé el bosque y ayudá a combatir el cambio climático. Cada donación se registra en blockchain para
            máxima transparencia.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg border border-green-100">
            <div className="text-3xl text-green-600 mb-2">🌳</div>
            <div className="text-2xl font-bold text-gray-800">1,247</div>
            <div className="text-gray-600">Árboles Rescatados</div>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg border border-green-100">
            <div className="text-3xl text-green-600 mb-2">💰</div>
            <div className="text-2xl font-bold text-gray-800">$8,945</div>
            <div className="text-gray-600">Fondos Recaudados</div>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg border border-green-100">
            <div className="text-3xl text-green-600 mb-2">🌍</div>
            <div className="text-2xl font-bold text-gray-800">12.5</div>
            <div className="text-gray-600">Ton CO2 Capturadas</div>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg border border-green-100">
            <div className="text-3xl text-green-600 mb-2">👥</div>
            <div className="text-2xl font-bold text-gray-800">892</div>
            <div className="text-gray-600">Rescatadores</div>
          </div>
        </div>

        {/* Trees Grid */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Árboles que Necesitan tu Ayuda</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {TREES_DATA.map(tree => (
              <TreeCard key={tree.id} tree={tree} onRescue={handleRescueTree} />
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-3xl p-8 shadow-lg border border-green-100 mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">¿Cómo Funciona?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">🌱</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">1. Elegí un Árbol</h3>
              <p className="text-gray-600">Seleccioná el árbol que querés rescatar de nuestra lista</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">💳</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">2. Hacé tu Donación</h3>
              <p className="text-gray-600">Elegí el monto y método de pago que prefieras</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🌍</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">3. Impacto Garantizado</h3>
              <p className="text-gray-600">Tu donación se registra en blockchain y se ejecuta el rescate</p>
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      {selectedTree && (
        <CheckoutModal
          tree={selectedTree}
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          onComplete={handleCheckoutComplete}
          isProcessing={isProcessing || isUploading}
        />
      )}

      {donationData && (
        <ConfirmationModal donationData={donationData} isOpen={isConfirmationOpen} onClose={handleCloseConfirmation} />
      )}
    </div>
  );
};

export default RescataArbolPage;
