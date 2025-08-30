import type {
  Arbol,
  Comunidad,
  ComunidadImpacto,
  Donacion,
  EstadoContrato,
  EstadoCrecimiento,
  EstadoEncuesta,
  EstadoOrganizacion,
  EstadoProyecto,
  EstadoSuscripcion,
  Frecuencia,
  MicroEncuesta,
  Organizacion,
  ProyectoAmbiental,
  RespuestaEncuesta,
  SmartContract,
  Suscripcion,
  TipoProyecto,
  Usuario,
} from "@prisma/client";

// Tipos base exportados desde Prisma
export type {
  Usuario,
  Organizacion,
  ProyectoAmbiental,
  Comunidad,
  Donacion,
  SmartContract,
  Arbol,
  Suscripcion,
  ComunidadImpacto,
  MicroEncuesta,
  RespuestaEncuesta,
  EstadoOrganizacion,
  TipoProyecto,
  EstadoProyecto,
  EstadoContrato,
  EstadoCrecimiento,
  Frecuencia,
  EstadoSuscripcion,
  EstadoEncuesta,
};

// Tipos con relaciones incluidas
export type UsuarioConRelaciones = Usuario & {
  donaciones?: Donacion[];
  suscripciones?: Suscripcion[];
  membresiaComunidad?: ComunidadImpacto | null;
  respuestasEncuesta?: RespuestaEncuesta[];
};

export type OrganizacionConRelaciones = Organizacion & {
  proyectos?: ProyectoAmbiental[];
  contratos?: SmartContract[];
};

export type ProyectoAmbientalConRelaciones = ProyectoAmbiental & {
  organizacion?: Organizacion;
  donaciones?: Donacion[];
  arboles?: Arbol[];
};

export type DonacionConRelaciones = Donacion & {
  usuario?: Usuario;
  proyecto?: ProyectoAmbiental;
  suscripcion?: Suscripcion | null;
  contratos?: SmartContract[];
};

export type SmartContractConRelaciones = SmartContract & {
  donacion?: Donacion;
  organizacion?: Organizacion;
};

export type SuscripcionConRelaciones = Suscripcion & {
  usuario?: Usuario;
  donaciones?: Donacion[];
};

export type MicroEncuestaConRelaciones = MicroEncuesta & {
  respuestas?: RespuestaEncuesta[];
};

export type RespuestaEncuestaConRelaciones = RespuestaEncuesta & {
  encuesta?: MicroEncuesta;
  usuario?: Usuario;
};

// Tipos para crear nuevos registros (sin ID, fechas automáticas, etc.)
export type CrearUsuario = Omit<Usuario, "id" | "fechaCreacion" | "fechaActualizacion">;

export type CrearOrganizacion = Omit<Organizacion, "id" | "fechaCreacion" | "fechaActualizacion">;

export type CrearProyectoAmbiental = Omit<ProyectoAmbiental, "id" | "fechaCreacion" | "fechaActualizacion">;

export type CrearDonacion = Omit<Donacion, "id" | "fechaDonacion">;

export type CrearSmartContract = Omit<SmartContract, "id" | "timestamp">;

export type CrearArbol = Omit<Arbol, "id" | "fechaCreacion" | "fechaActualizacion">;

export type CrearSuscripcion = Omit<Suscripcion, "id" | "fechaInicio">;

export type CrearComunidadImpacto = Omit<ComunidadImpacto, "id" | "fechaInscripcion">;

export type CrearMicroEncuesta = Omit<MicroEncuesta, "id" | "fechaCreacion" | "fechaActualizacion">;

export type CrearRespuestaEncuesta = Omit<RespuestaEncuesta, "id" | "fecha">;

// Tipos para actualizar registros (todos los campos opcionales excepto ID)
export type ActualizarUsuario = Partial<Omit<Usuario, "id" | "fechaCreacion">>;

export type ActualizarOrganizacion = Partial<Omit<Organizacion, "id" | "fechaCreacion">>;

export type ActualizarProyectoAmbiental = Partial<Omit<ProyectoAmbiental, "id" | "fechaCreacion">>;

export type ActualizarDonacion = Partial<Omit<Donacion, "id" | "fechaDonacion">>;

export type ActualizarSmartContract = Partial<Omit<SmartContract, "id" | "timestamp">>;

export type ActualizarArbol = Partial<Omit<Arbol, "id" | "fechaCreacion">>;

export type ActualizarSuscripcion = Partial<Omit<Suscripcion, "id" | "fechaInicio">>;

export type ActualizarComunidadImpacto = Partial<Omit<ComunidadImpacto, "id" | "fechaInscripcion">>;

export type ActualizarMicroEncuesta = Partial<Omit<MicroEncuesta, "id" | "fechaCreacion">>;

// Tipos utilitarios para consultas comunes
export interface FiltrosDonacion {
  usuarioId?: string;
  proyectoId?: string;
  fechaDesde?: Date;
  fechaHasta?: Date;
  montoMinimo?: number;
  montoMaximo?: string;
  esRecurrente?: boolean;
}

export interface FiltrosProyecto {
  organizacionId?: string;
  tipo?: TipoProyecto;
  estado?: EstadoProyecto;
  fechaDesde?: Date;
  fechaHasta?: Date;
}

export interface EstadisticasUsuario {
  totalDonado: number;
  cantidadDonaciones: number;
  proyectosApoyados: number;
  nivelReconocimiento: string;
  fechaPrimeraDonacion?: Date;
  fechaUltimaDonacion?: Date;
}

export interface EstadisticasProyecto {
  totalRecaudado: number;
  cantidadDonadores: number;
  metaAlcanzada: boolean;
  progreso: number;
  arbolesPlantados?: number;
}

export interface ResumenDonaciones {
  totalPorMes: Array<{ mes: string; total: number }>;
  totalPorProyecto: Array<{ proyecto: string; total: number }>;
  totalPorTipo: Array<{ tipo: TipoProyecto; total: number }>;
}
