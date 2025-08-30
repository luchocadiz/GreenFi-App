-- CreateEnum
CREATE TYPE "public"."EstadoOrganizacion" AS ENUM ('ACTIVA', 'INACTIVA', 'EN_AUDITORIA');

-- CreateEnum
CREATE TYPE "public"."TipoProyecto" AS ENUM ('REFORESTACION', 'BIODIVERSIDAD', 'AGUA', 'ENERGIA_RENOVABLE', 'CONSERVACION', 'RESTAURACION_ECOSISTEMAS');

-- CreateEnum
CREATE TYPE "public"."EstadoProyecto" AS ENUM ('FINANCIADO', 'NO_FINANCIADO', 'ACTIVO', 'COMPLETADO', 'PAUSADO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "public"."EstadoContrato" AS ENUM ('PENDIENTE', 'CONFIRMADO', 'EJECUTADO', 'FALLIDO');

-- CreateEnum
CREATE TYPE "public"."EstadoCrecimiento" AS ENUM ('SEMBRADO', 'JOVEN', 'ADULTO', 'NO_VIABLE');

-- CreateEnum
CREATE TYPE "public"."Frecuencia" AS ENUM ('MENSUAL', 'TRIMESTRAL', 'SEMESTRAL', 'ANUAL');

-- CreateEnum
CREATE TYPE "public"."EstadoSuscripcion" AS ENUM ('ACTIVA', 'PAUSADA', 'CANCELADA');

-- CreateEnum
CREATE TYPE "public"."EstadoEncuesta" AS ENUM ('ACTIVA', 'CERRADA');

-- CreateTable
CREATE TABLE "public"."usuarios" (
    "id" TEXT NOT NULL,
    "nombreUsuario" TEXT NOT NULL,
    "walletBlockchain" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "paisRegion" TEXT NOT NULL,
    "esMiembroComunidadImpacto" BOOLEAN NOT NULL DEFAULT false,
    "fechaInscripcionComunidad" TIMESTAMP(3),
    "nivelReconocimiento" TEXT NOT NULL DEFAULT 'Bronce',
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaActualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."organizaciones" (
    "id" TEXT NOT NULL,
    "credencialDID" TEXT NOT NULL,
    "nombreResponsable" TEXT NOT NULL,
    "documentacionLegal" TEXT,
    "estado" "public"."EstadoOrganizacion" NOT NULL DEFAULT 'ACTIVA',
    "puntuacionReputacion" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "tipoOrganizacion" BOOLEAN NOT NULL,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaActualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "organizaciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."proyectos_ambientales" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "tipo" "public"."TipoProyecto" NOT NULL,
    "localizacionGeografica" TEXT NOT NULL,
    "impactoEsperado" JSONB NOT NULL,
    "estado" "public"."EstadoProyecto" NOT NULL DEFAULT 'NO_FINANCIADO',
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaActualizacion" TIMESTAMP(3) NOT NULL,
    "organizacionId" TEXT NOT NULL,

    CONSTRAINT "proyectos_ambientales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."comunidades" (
    "id" TEXT NOT NULL,
    "nombreLider" TEXT NOT NULL,
    "nombreComunidad" TEXT NOT NULL,
    "credencialDID" TEXT NOT NULL,
    "localizacionGeografica" TEXT NOT NULL,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaActualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "comunidades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."donaciones" (
    "id" TEXT NOT NULL,
    "montoDonado" DECIMAL(10,2) NOT NULL,
    "fechaDonacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "esRecurrente" BOOLEAN NOT NULL DEFAULT false,
    "moneda" TEXT NOT NULL DEFAULT 'DAI',
    "usuarioId" TEXT NOT NULL,
    "proyectoId" TEXT NOT NULL,
    "suscripcionId" TEXT,

    CONSTRAINT "donaciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."smart_contracts" (
    "id" TEXT NOT NULL,
    "contractAddress" TEXT NOT NULL,
    "txHash" TEXT NOT NULL,
    "monto" DECIMAL(10,2) NOT NULL,
    "moneda" TEXT NOT NULL DEFAULT 'DAI',
    "evidenceURIs" JSONB NOT NULL,
    "status" "public"."EstadoContrato" NOT NULL DEFAULT 'PENDIENTE',
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "donacionId" TEXT NOT NULL,
    "organizacionId" TEXT NOT NULL,

    CONSTRAINT "smart_contracts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."arboles" (
    "id" TEXT NOT NULL,
    "estadoCrecimiento" "public"."EstadoCrecimiento" NOT NULL DEFAULT 'SEMBRADO',
    "metadata" JSONB NOT NULL,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaActualizacion" TIMESTAMP(3) NOT NULL,
    "proyectoId" TEXT NOT NULL,

    CONSTRAINT "arboles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."suscripciones" (
    "id" TEXT NOT NULL,
    "monto" DECIMAL(10,2) NOT NULL,
    "frecuencia" "public"."Frecuencia" NOT NULL,
    "fechaInicio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaProximoCobro" TIMESTAMP(3) NOT NULL,
    "estado" "public"."EstadoSuscripcion" NOT NULL DEFAULT 'ACTIVA',
    "metodoPago" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,

    CONSTRAINT "suscripciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."comunidad_impacto" (
    "id" TEXT NOT NULL,
    "fechaInscripcion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nivelParticipacion" TEXT NOT NULL DEFAULT 'Básico',
    "esReferidor" BOOLEAN NOT NULL DEFAULT false,
    "usuarioId" TEXT NOT NULL,

    CONSTRAINT "comunidad_impacto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."micro_encuestas" (
    "id" TEXT NOT NULL,
    "pregunta" TEXT NOT NULL,
    "opcionesRespuesta" JSONB NOT NULL,
    "estado" "public"."EstadoEncuesta" NOT NULL DEFAULT 'ACTIVA',
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaActualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "micro_encuestas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."respuestas_encuesta" (
    "id" TEXT NOT NULL,
    "respuesta" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "encuestaId" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,

    CONSTRAINT "respuestas_encuesta_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_nombreUsuario_key" ON "public"."usuarios"("nombreUsuario");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_walletBlockchain_key" ON "public"."usuarios"("walletBlockchain");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "public"."usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "organizaciones_credencialDID_key" ON "public"."organizaciones"("credencialDID");

-- CreateIndex
CREATE UNIQUE INDEX "comunidades_credencialDID_key" ON "public"."comunidades"("credencialDID");

-- CreateIndex
CREATE UNIQUE INDEX "smart_contracts_txHash_key" ON "public"."smart_contracts"("txHash");

-- CreateIndex
CREATE UNIQUE INDEX "comunidad_impacto_usuarioId_key" ON "public"."comunidad_impacto"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "respuestas_encuesta_encuestaId_usuarioId_key" ON "public"."respuestas_encuesta"("encuestaId", "usuarioId");

-- AddForeignKey
ALTER TABLE "public"."proyectos_ambientales" ADD CONSTRAINT "proyectos_ambientales_organizacionId_fkey" FOREIGN KEY ("organizacionId") REFERENCES "public"."organizaciones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."donaciones" ADD CONSTRAINT "donaciones_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "public"."usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."donaciones" ADD CONSTRAINT "donaciones_proyectoId_fkey" FOREIGN KEY ("proyectoId") REFERENCES "public"."proyectos_ambientales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."donaciones" ADD CONSTRAINT "donaciones_suscripcionId_fkey" FOREIGN KEY ("suscripcionId") REFERENCES "public"."suscripciones"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."smart_contracts" ADD CONSTRAINT "smart_contracts_donacionId_fkey" FOREIGN KEY ("donacionId") REFERENCES "public"."donaciones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."smart_contracts" ADD CONSTRAINT "smart_contracts_organizacionId_fkey" FOREIGN KEY ("organizacionId") REFERENCES "public"."organizaciones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."arboles" ADD CONSTRAINT "arboles_proyectoId_fkey" FOREIGN KEY ("proyectoId") REFERENCES "public"."proyectos_ambientales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."suscripciones" ADD CONSTRAINT "suscripciones_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "public"."usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."comunidad_impacto" ADD CONSTRAINT "comunidad_impacto_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "public"."usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."respuestas_encuesta" ADD CONSTRAINT "respuestas_encuesta_encuestaId_fkey" FOREIGN KEY ("encuestaId") REFERENCES "public"."micro_encuestas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."respuestas_encuesta" ADD CONSTRAINT "respuestas_encuesta_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "public"."usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
