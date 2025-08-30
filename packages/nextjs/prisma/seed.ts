import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed de la base de datos...");

  // Crear usuarios de ejemplo
  const usuario1 = await prisma.usuario.upsert({
    where: { walletBlockchain: "0x1234567890123456789012345678901234567890" },
    update: {},
    create: {
      nombreUsuario: "eco_warrior",
      walletBlockchain: "0x1234567890123456789012345678901234567890",
      email: "ecowarrior@example.com",
      paisRegion: "Colombia",
      esMiembroComunidadImpacto: true,
      fechaInscripcionComunidad: new Date("2024-01-15"),
      nivelReconocimiento: "Oro",
    },
  });

  const usuario2 = await prisma.usuario.upsert({
    where: { walletBlockchain: "0x0987654321098765432109876543210987654321" },
    update: {},
    create: {
      nombreUsuario: "green_donor",
      walletBlockchain: "0x0987654321098765432109876543210987654321",
      email: "greendonor@example.com",
      paisRegion: "México",
      esMiembroComunidadImpacto: false,
      nivelReconocimiento: "Plata",
    },
  });

  // Crear organizaciones de ejemplo
  const organizacion1 = await prisma.organizacion.upsert({
    where: { credencialDID: "did:ejemplo:organizacion1" },
    update: {},
    create: {
      credencialDID: "did:ejemplo:organizacion1",
      nombreResponsable: "María González",
      documentacionLegal: "Registro ONG Colombia #12345",
      estado: "ACTIVA",
      puntuacionReputacion: 4.8,
      tipoOrganizacion: false, // Sin fines de lucro
    },
  });

  const organizacion2 = await prisma.organizacion.upsert({
    where: { credencialDID: "did:ejemplo:organizacion2" },
    update: {},
    create: {
      credencialDID: "did:ejemplo:organizacion2",
      nombreResponsable: "Carlos Ramírez",
      documentacionLegal: "Certificado Empresa B #67890",
      estado: "ACTIVA",
      puntuacionReputacion: 4.5,
      tipoOrganizacion: true, // Empresa
    },
  });

  // Crear proyectos ambientales de ejemplo
  const proyecto1 = await prisma.proyectoAmbiental.create({
    data: {
      nombre: "Reforestación Amazonas Colombiano",
      tipo: "REFORESTACION",
      localizacionGeografica: JSON.stringify({
        type: "Polygon",
        coordinates: [
          [
            [-74.0, 4.0],
            [-74.0, 4.1],
            [-73.9, 4.1],
            [-73.9, 4.0],
            [-74.0, 4.0],
          ],
        ],
      }),
      impactoEsperado: {
        arbolesEsperados: 10000,
        co2Capturado: 2500, // toneladas
        areaRestaurada: 50, // hectáreas
        especiesNativas: 25,
        tiempoProyecto: "24 meses",
      },
      estado: "ACTIVO",
      organizacionId: organizacion1.id,
    },
  });

  const proyecto2 = await prisma.proyectoAmbiental.create({
    data: {
      nombre: "Conservación Biodiversidad Costa Pacífica",
      tipo: "BIODIVERSIDAD",
      localizacionGeografica: JSON.stringify({
        type: "Point",
        coordinates: [-77.0, 3.5],
      }),
      impactoEsperado: {
        especiesProtegidas: 150,
        areaConservada: 1000, // hectáreas
        comunidadesBeneficiadas: 15,
        empleosCreados: 50,
      },
      estado: "FINANCIADO",
      organizacionId: organizacion2.id,
    },
  });

  // Crear comunidad de ejemplo
  await prisma.comunidad.create({
    data: {
      nombreLider: "Ana Lucía Pérez",
      nombreComunidad: "Guardianes del Río Verde",
      credencialDID: "did:ejemplo:comunidad1",
      localizacionGeografica: "Putumayo, Colombia",
    },
  });

  // Crear donaciones de ejemplo
  const donacion1 = await prisma.donacion.create({
    data: {
      montoDonado: 100.5,
      fechaDonacion: new Date("2024-08-15"),
      esRecurrente: false,
      moneda: "DAI",
      usuarioId: usuario1.id,
      proyectoId: proyecto1.id,
    },
  });

  await prisma.donacion.create({
    data: {
      montoDonado: 250.0,
      fechaDonacion: new Date("2024-08-20"),
      esRecurrente: true,
      moneda: "USDC",
      usuarioId: usuario2.id,
      proyectoId: proyecto2.id,
    },
  });

  // Crear suscripción de ejemplo
  await prisma.suscripcion.create({
    data: {
      monto: 50.0,
      frecuencia: "MENSUAL",
      fechaInicio: new Date("2024-08-01"),
      fechaProximoCobro: new Date("2024-09-01"),
      estado: "ACTIVA",
      metodoPago: "Crypto Wallet",
      usuarioId: usuario2.id,
    },
  });

  // Crear smart contract de ejemplo
  await prisma.smartContract.create({
    data: {
      contractAddress: "0xabcdef1234567890abcdef1234567890abcdef12",
      txHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12",
      monto: 100.5,
      moneda: "DAI",
      evidenceURIs: ["https://ipfs.io/ipfs/QmExampleHash1", "https://ipfs.io/ipfs/QmExampleHash2"],
      status: "CONFIRMADO",
      donacionId: donacion1.id,
      organizacionId: organizacion1.id,
    },
  });

  // Crear árboles de ejemplo
  await prisma.arbol.create({
    data: {
      estadoCrecimiento: "JOVEN",
      metadata: {
        especie: "Cecropia peltata",
        fechaPlantacion: "2024-07-01",
        coordenadas: [-74.0123, 4.0456],
        altura: 1.5, // metros
        diametro: 3.2, // cm
        responsable: "Juan Pérez",
      },
      proyectoId: proyecto1.id,
    },
  });

  // Crear membresía de comunidad de impacto
  await prisma.comunidadImpacto.create({
    data: {
      fechaInscripcion: new Date("2024-01-15"),
      nivelParticipacion: "Avanzado",
      esReferidor: true,
      usuarioId: usuario1.id,
    },
  });

  // Crear micro encuesta de ejemplo
  const encuesta1 = await prisma.microEncuesta.create({
    data: {
      pregunta: "¿Qué tipo de proyecto ambiental te interesa más?",
      opcionesRespuesta: ["Reforestación", "Conservación marina", "Energía renovable", "Protección de biodiversidad"],
      estado: "ACTIVA",
    },
  });

  // Crear respuesta a encuesta
  await prisma.respuestaEncuesta.create({
    data: {
      respuesta: "Reforestación",
      encuestaId: encuesta1.id,
      usuarioId: usuario1.id,
    },
  });

  console.log("✅ Seed completado exitosamente!");
  console.log({
    usuarios: 2,
    organizaciones: 2,
    proyectos: 2,
    comunidades: 1,
    donaciones: 2,
    suscripciones: 1,
    contratos: 1,
    arboles: 1,
    membresias: 1,
    encuestas: 1,
    respuestas: 1,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error("❌ Error durante el seed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
