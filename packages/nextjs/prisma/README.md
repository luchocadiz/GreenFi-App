# Base de Datos - GreenFi App

Este directorio contiene la configuración de la base de datos usando Prisma ORM con PostgreSQL (Supabase).

## Estructura

```
prisma/
├── schema.prisma    # Definición de modelos y esquema
├── seed.ts         # Datos de ejemplo para development
└── migrations/     # Historial de migraciones (generado automáticamente)
```

## Configuración Inicial

### 1. Configurar Variables de Entorno

Copia el archivo `.env.example` a `.env.local` y configura tu URL de Supabase:

```bash
cp .env.example .env.local
```

Edita `.env.local` con tu información de Supabase:

```env
DATABASE_URL="postgresql://postgres:[TU_PASSWORD]@db.[TU_PROJECT_REF].supabase.co:5432/postgres?schema=public"
```

### 2. Generar Cliente Prisma

```bash
yarn db:generate
```

### 3. Crear y Ejecutar Migraciones

```bash
# Para development (crea migración y aplica)
yarn db:migrate

# Para production (solo aplica migraciones existentes)  
yarn db:migrate:deploy
```

### 4. Insertar Datos de Ejemplo

```bash
yarn db:seed
```

## Modelos de Datos

### Entidades Principales

- **Usuario**: Donantes registrados en la plataforma
- **Organizacion**: ONGs y empresas que ejecutan proyectos
- **ProyectoAmbiental**: Proyectos ambientales disponibles para financiamiento
- **Donacion**: Registro de donaciones realizadas
- **SmartContract**: Certificados on-chain de las donaciones
- **Arbol**: Recursos físicos (árboles) asociados a proyectos
- **Suscripcion**: Donaciones recurrentes
- **ComunidadImpacto**: Membresías de la comunidad
- **MicroEncuesta**: Sistema de encuestas para engagement
- **RespuestaEncuesta**: Respuestas a las encuestas

### Relaciones Principales

```
Usuario 1:N Donacion N:1 ProyectoAmbiental N:1 Organizacion
Usuario 1:1 ComunidadImpacto
Usuario 1:N Suscripcion
Usuario 1:N RespuestaEncuesta N:1 MicroEncuesta
Donacion 1:N SmartContract N:1 Organizacion  
ProyectoAmbiental 1:N Arbol
```

## Scripts Disponibles

```bash
# Generar cliente Prisma
yarn db:generate

# Aplicar cambios al schema sin migración
yarn db:push  

# Crear y aplicar nueva migración
yarn db:migrate

# Solo aplicar migraciones existentes
yarn db:migrate:deploy

# Abrir Prisma Studio (interfaz visual)
yarn db:studio

# Insertar datos de ejemplo
yarn db:seed
```

## Uso en el Código

### Importar Cliente

```typescript
import { prisma } from '@/lib/prisma'
import type { Usuario, Donacion } from '@/types/database'
```

### Ejemplos de Consultas

```typescript
// Obtener usuario con donaciones
const usuario = await prisma.usuario.findUnique({
  where: { id: usuarioId },
  include: {
    donaciones: {
      include: {
        proyecto: true
      }
    },
    membresiaComunidad: true
  }
})

// Crear nueva donación
const nuevaDonacion = await prisma.donacion.create({
  data: {
    montoDonado: 100.50,
    usuarioId: usuario.id,
    proyectoId: proyecto.id,
    moneda: 'DAI'
  }
})

// Obtener estadísticas de proyecto
const stats = await prisma.donacion.aggregate({
  where: { proyectoId },
  _sum: { montoDonado: true },
  _count: { usuarioId: true }
})
```

## Supabase Integration

### Configuración en Supabase

1. Crea un nuevo proyecto en [supabase.com](https://supabase.com)
2. Ve a Settings > Database
3. Copia la Connection String
4. Habilita Row Level Security si es necesario
5. Configura las políticas de seguridad según tus necesidades

### Políticas de Seguridad Recomendadas

```sql
-- Ejemplo: Los usuarios solo pueden ver sus propias donaciones
ALTER TABLE donaciones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios pueden ver sus donaciones" ON donaciones
FOR SELECT USING (auth.uid()::text = usuario_id);
```

## Consideraciones de Producción

- Usa connection pooling para mejor rendimiento
- Configura índices apropiados para consultas frecuentes
- Implementa backup automático
- Monitorea performance de queries
- Usa `DATABASE_DIRECT_URL` para mejores conexiones

## Troubleshooting

### Error: "Environment variable not found"
- Verifica que `.env.local` existe y contiene `DATABASE_URL`
- Reinicia el servidor de desarrollo

### Error: "Can't reach database server"
- Verifica la URL de conexión a Supabase
- Confirma que tu IP está en la whitelist (si aplicable)

### Schema out of sync
```bash
yarn db:push  # Para development
# o
yarn db:migrate:deploy  # Para production
```