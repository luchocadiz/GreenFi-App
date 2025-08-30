import { prisma } from "./prisma";
import { faker } from "@faker-js/faker/locale/es";
import type {
  EstadoCrecimiento,
  EstadoEncuesta,
  EstadoOrganizacion,
  EstadoProyecto,
  EstadoSuscripcion,
  Frecuencia,
  TipoProyecto,
} from "@prisma/client";

export async function seedDatabase() {
  console.log("🌱 Generando datos falsos...");

  // 1. Crear usuarios
  console.log("👥 Creando usuarios...");
  const usuarios = [];
  for (let i = 0; i < 20; i++) {
    const usuario = await prisma.usuario.create({
      data: {
        nombreUsuario: faker.internet.username().toLowerCase(),
        walletBlockchain: faker.finance.ethereumAddress(),
        email: faker.internet.email().toLowerCase(),
        paisRegion: faker.location.country(),
        esMiembroComunidadImpacto: faker.datatype.boolean(),
        fechaInscripcionComunidad: faker.datatype.boolean() ? faker.date.past() : null,
        nivelReconocimiento: faker.helpers.arrayElement(["Bronce", "Plata", "Oro", "Platino"]),
      },
    });
    usuarios.push(usuario);
  }

  // 2. Crear organizaciones
  console.log("🏢 Creando organizaciones...");
  const organizaciones = [];
  for (let i = 0; i < 8; i++) {
    const organizacion = await prisma.organizacion.create({
      data: {
        credencialDID: faker.string.uuid(),
        nombreResponsable: faker.person.fullName(),
        documentacionLegal: faker.datatype.boolean() ? faker.internet.url() : null,
        estado: faker.helpers.arrayElement(["ACTIVA", "INACTIVA", "EN_AUDITORIA"] as EstadoOrganizacion[]),
        puntuacionReputacion: faker.number.float({ min: 0, max: 5, fractionDigits: 1 }),
        tipoOrganizacion: faker.datatype.boolean(),
      },
    });
    organizaciones.push(organizacion);
  }

  // 3. Crear proyectos ambientales
  console.log("🌳 Creando proyectos ambientales...");
  const proyectos = [];
  for (let i = 0; i < 15; i++) {
    const proyecto = await prisma.proyectoAmbiental.create({
      data: {
        nombre: `Proyecto ${faker.company.name()} - ${faker.location.city()}`,
        tipo: faker.helpers.arrayElement([
          "REFORESTACION",
          "BIODIVERSIDAD",
          "AGUA",
          "ENERGIA_RENOVABLE",
          "CONSERVACION",
          "RESTAURACION_ECOSISTEMAS",
        ] as TipoProyecto[]),
        localizacionGeografica: JSON.stringify({
          lat: faker.location.latitude(),
          lng: faker.location.longitude(),
          ciudad: faker.location.city(),
          pais: faker.location.country(),
        }),
        impactoEsperado: {
          arbolesPlantados: faker.number.int({ min: 100, max: 5000 }),
          co2Capturado: faker.number.float({ min: 10, max: 500 }),
          hectarasProtegidas: faker.number.float({ min: 1, max: 100 }),
          comunidadesBeneficiadas: faker.number.int({ min: 1, max: 20 }),
        },
        estado: faker.helpers.arrayElement([
          "FINANCIADO",
          "NO_FINANCIADO",
          "ACTIVO",
          "COMPLETADO",
          "PAUSADO",
        ] as EstadoProyecto[]),
        organizacionId: faker.helpers.arrayElement(organizaciones).id,
      },
    });
    proyectos.push(proyecto);
  }

  // 4. Crear suscripciones
  console.log("💳 Creando suscripciones...");
  const suscripciones = [];
  for (let i = 0; i < 10; i++) {
    const fechaInicio = faker.date.past();
    const frecuencia = faker.helpers.arrayElement(["MENSUAL", "TRIMESTRAL", "SEMESTRAL", "ANUAL"] as Frecuencia[]);

    const fechaProximoCobro = new Date(fechaInicio);
    switch (frecuencia) {
      case "MENSUAL":
        fechaProximoCobro.setMonth(fechaProximoCobro.getMonth() + 1);
        break;
      case "TRIMESTRAL":
        fechaProximoCobro.setMonth(fechaProximoCobro.getMonth() + 3);
        break;
      case "SEMESTRAL":
        fechaProximoCobro.setMonth(fechaProximoCobro.getMonth() + 6);
        break;
      case "ANUAL":
        fechaProximoCobro.setFullYear(fechaProximoCobro.getFullYear() + 1);
        break;
    }

    const suscripcion = await prisma.suscripcion.create({
      data: {
        monto: faker.number.float({ min: 10, max: 500, fractionDigits: 2 }),
        frecuencia,
        fechaInicio,
        fechaProximoCobro,
        estado: faker.helpers.arrayElement(["ACTIVA", "PAUSADA", "CANCELADA"] as EstadoSuscripcion[]),
        metodoPago: faker.helpers.arrayElement(["Tarjeta", "Transferencia", "Crypto"]),
        usuarioId: faker.helpers.arrayElement(usuarios).id,
      },
    });
    suscripciones.push(suscripcion);
  }

  // 5. Crear donaciones
  console.log("💰 Creando donaciones...");
  const donaciones = [];
  for (let i = 0; i < 50; i++) {
    const esRecurrente = faker.datatype.boolean();
    const donacion = await prisma.donacion.create({
      data: {
        montoDonado: faker.number.float({ min: 5, max: 1000, fractionDigits: 2 }),
        fechaDonacion: faker.date.past(),
        esRecurrente,
        moneda: faker.helpers.arrayElement(["DAI", "USDC", "ETH"]),
        usuarioId: faker.helpers.arrayElement(usuarios).id,
        proyectoId: faker.helpers.arrayElement(proyectos).id,
        suscripcionId: esRecurrente && suscripciones.length > 0 ? faker.helpers.arrayElement(suscripciones).id : null,
      },
    });
    donaciones.push(donacion);
  }

  // 6. Crear smart contracts
  console.log("📜 Creando smart contracts...");
  for (let i = 0; i < 30; i++) {
    const donacion = faker.helpers.arrayElement(donaciones);
    await prisma.smartContract.create({
      data: {
        contractAddress: faker.finance.ethereumAddress(),
        txHash: faker.string.hexadecimal({ length: 64, prefix: "0x" }),
        monto: donacion.montoDonado,
        moneda: donacion.moneda,
        evidenceURIs: [faker.internet.url(), faker.internet.url(), faker.internet.url()],
        status: faker.helpers.arrayElement(["PENDIENTE", "CONFIRMADO", "EJECUTADO", "FALLIDO"]),
        donacionId: donacion.id,
        organizacionId: faker.helpers.arrayElement(organizaciones).id,
      },
    });
  }

  // 7. Crear árboles
  console.log("🌲 Creando árboles...");
  for (let i = 0; i < 100; i++) {
    await prisma.arbol.create({
      data: {
        estadoCrecimiento: faker.helpers.arrayElement([
          "SEMBRADO",
          "JOVEN",
          "ADULTO",
          "NO_VIABLE",
        ] as EstadoCrecimiento[]),
        metadata: {
          especie: faker.helpers.arrayElement([
            "Ceiba pentandra",
            "Tabebuia chrysantha",
            "Swietenia mahagoni",
            "Cordia alliodora",
            "Terminalia amazonia",
            "Vochysia ferruginea",
          ]),
          fechaPlantacion: faker.date.past().toISOString(),
          coordenadas: {
            lat: faker.location.latitude(),
            lng: faker.location.longitude(),
          },
          altura: faker.number.float({ min: 0.5, max: 25, fractionDigits: 1 }),
          diametro: faker.number.float({ min: 2, max: 80, fractionDigits: 1 }),
        },
        proyectoId: faker.helpers.arrayElement(proyectos).id,
      },
    });
  }

  // 8. Crear comunidad impacto para algunos usuarios
  console.log("🤝 Creando membresías de comunidad...");
  const usuariosComunidad = usuarios.filter(u => u.esMiembroComunidadImpacto).slice(0, 10);
  for (const usuario of usuariosComunidad) {
    await prisma.comunidadImpacto.create({
      data: {
        fechaInscripcion: faker.date.past(),
        nivelParticipacion: faker.helpers.arrayElement(["Básico", "Intermedio", "Avanzado", "Líder"]),
        esReferidor: faker.datatype.boolean(),
        usuarioId: usuario.id,
      },
    });
  }

  // 9. Crear micro encuestas
  console.log("📝 Creando micro encuestas...");
  const encuestas = [];
  const preguntas = [
    "¿Qué tipo de proyecto ambiental te interesa más?",
    "¿Con qué frecuencia donarías?",
    "¿Qué factor es más importante para ti al elegir un proyecto?",
    "¿Cómo prefieres recibir actualizaciones del proyecto?",
    "¿Qué incentivo te motivaría más a donar?",
  ];

  for (const pregunta of preguntas) {
    const encuesta = await prisma.microEncuesta.create({
      data: {
        pregunta,
        opcionesRespuesta: ["Opción A", "Opción B", "Opción C", "Opción D"],
        estado: faker.helpers.arrayElement(["ACTIVA", "CERRADA"] as EstadoEncuesta[]),
      },
    });
    encuestas.push(encuesta);
  }

  // 10. Crear respuestas a encuestas
  console.log("✅ Creando respuestas a encuestas...");
  for (let i = 0; i < 40; i++) {
    try {
      await prisma.respuestaEncuesta.create({
        data: {
          respuesta: faker.helpers.arrayElement(["Opción A", "Opción B", "Opción C", "Opción D"]),
          fecha: faker.date.past(),
          encuestaId: faker.helpers.arrayElement(encuestas).id,
          usuarioId: faker.helpers.arrayElement(usuarios).id,
        },
      });
    } catch (error) {
      // Ignorar errores de duplicados (unique constraint)
      continue;
    }
  }

  console.log("✅ ¡Datos falsos generados exitosamente!");
  console.log(`📊 Resumen:`);
  console.log(`   👥 Usuarios: ${usuarios.length}`);
  console.log(`   🏢 Organizaciones: ${organizaciones.length}`);
  console.log(`   🌳 Proyectos: ${proyectos.length}`);
  console.log(`   💰 Donaciones: ${donaciones.length}`);
  console.log(`   🌲 Árboles: 100`);
  console.log(`   📝 Encuestas: ${encuestas.length}`);
}

// Script para limpiar datos
export async function clearDatabase() {
  console.log("🧹 Limpiando base de datos...");

  await prisma.respuestaEncuesta.deleteMany();
  await prisma.microEncuesta.deleteMany();
  await prisma.comunidadImpacto.deleteMany();
  await prisma.arbol.deleteMany();
  await prisma.smartContract.deleteMany();
  await prisma.donacion.deleteMany();
  await prisma.suscripcion.deleteMany();
  await prisma.proyectoAmbiental.deleteMany();
  await prisma.organizacion.deleteMany();
  await prisma.usuario.deleteMany();

  console.log("✅ Base de datos limpiada");
}
