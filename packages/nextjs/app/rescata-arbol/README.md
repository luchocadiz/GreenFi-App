# 🌱 Rescatá un Árbol - Aplicación de Donaciones con Blockchain

Una aplicación completa de Next.js para rescatar árboles y proteger el bosque, integrando Lisk como proveedor de identidad de manera invisible para el usuario.

## 🎯 Características Principales

### **Para el Usuario Final:**
- **Interfaz intuitiva**: Selección fácil de árboles para rescatar
- **Múltiples métodos de pago**: Tarjeta de crédito/débito y QR
- **Montos flexibles**: Desde $1 hasta montos personalizados
- **Confirmación visual**: Animaciones de confeti y NFT de logros
- **Transparencia total**: Enlaces directos a blockchain y Filecoin

### **Integración Blockchain (Invisible):**
- **Lisk Sepolia**: Registro automático de transacciones
- **Filecoin**: Almacenamiento descentralizado de evidencia
- **Zama**: Encriptación opcional de datos sensibles
- **Wallet pre-creada**: Sin necesidad de que el usuario entienda blockchain

## 🏗️ Arquitectura Técnica

### **Frontend (Next.js 14)**
- **App Router**: Estructura moderna de Next.js
- **TypeScript**: Tipado completo para mejor desarrollo
- **Tailwind CSS**: Estilos modernos y responsivos
- **Componentes modulares**: Reutilizables y mantenibles

### **Blockchain Integration**
- **Lisk Sepolia**: Testnet para desarrollo y pruebas
- **Transacciones automáticas**: Se ejecutan en segundo plano
- **Hash de transacción**: Verificable en Lisk Explorer
- **Estado de transacción**: Monitoreo en tiempo real

### **Almacenamiento Descentralizado**
- **Filecoin**: Evidencia del árbol y recibo digital
- **CID único**: Identificador de contenido inmutable
- **Replicación**: Múltiples proveedores de almacenamiento
- **Encriptación**: Opcional con Zama para datos sensibles

## 📁 Estructura del Proyecto

```
rescata-arbol/
├── _components/           # Componentes React reutilizables
│   ├── Header.tsx        # Header de la aplicación
│   ├── TreeCard.tsx      # Tarjeta de árbol individual
│   ├── CheckoutModal.tsx # Modal de checkout
│   └── ConfirmationModal.tsx # Modal de confirmación
├── _hooks/               # Hooks personalizados
│   ├── useLiskTransaction.ts # Manejo de transacciones Lisk
│   └── useFilecoinStorage.ts # Manejo de almacenamiento Filecoin
├── _types/               # Tipos TypeScript
│   └── index.ts          # Interfaces y tipos
├── _styles/              # Estilos CSS personalizados
│   └── animations.css    # Animaciones y efectos
├── layout.tsx            # Layout de la página
├── page.tsx              # Página principal
└── README.md             # Este archivo
```

## 🚀 Instalación y Configuración

### **1. Dependencias Requeridas**
```bash
npm install wagmi viem @rainbow-me/rainbowkit
```

### **2. Variables de Entorno**
```bash
# .env.local
NEXT_PUBLIC_ALCHEMY_API_KEY=tu_api_key_de_alchemy
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=tu_project_id
LISK_PRIVATE_KEY=clave_privada_de_wallet_pre_creada
```

### **3. Configuración de Lisk**
```typescript
// hardhat.config.ts
liskSepolia: {
  url: "https://rpc.sepolia-api.lisk.com",
  accounts: [process.env.LISK_PRIVATE_KEY],
}
```

## 🎨 Componentes Principales

### **TreeCard**
- Muestra información del árbol
- Indicador de urgencia visual
- Botón de rescate con hover effects
- Información de impacto ambiental

### **CheckoutModal**
- Selección de monto (rápido o personalizado)
- Métodos de pago (tarjeta/QR)
- Información de transparencia
- Resumen de la donación

### **ConfirmationModal**
- Animación de confeti
- NFT de logro desbloqueado
- Enlaces a blockchain
- Información de impacto

## 🔧 Hooks Personalizados

### **useLiskTransaction**
```typescript
const { createTransaction, isProcessing } = useLiskTransaction();

const txHash = await createTransaction({
  treeId: 1,
  amount: 5,
  userAddress: "0x...",
  treeName: "Roble Centenario"
});
```

### **useFilecoinStorage**
```typescript
const { uploadToFilecoin, isUploading } = useFilecoinStorage();

const cid = await uploadToFilecoin({
  treeImage: "imagen.jpg",
  receipt: "recibo.pdf",
  transactionHash: "0x..."
});
```

## 🌐 Integración con Exploradores

### **Lisk Explorer**
```typescript
// Enlace directo a la transacción
const liskUrl = `https://sepolia-blockscout.lisk.com/tx/${transactionHash}`;
```

### **Filecoin Explorer**
```typescript
// Enlace directo al contenido almacenado
const filecoinUrl = `https://filfox.info/en/ipfs/${filecoinCid}`;
```

## 🎭 Animaciones y UX

### **Efectos Visuales**
- **Confeti**: Celebración post-donación
- **Hover effects**: Interactividad en tarjetas
- **Transiciones suaves**: Cambios de estado fluidos
- **Loading states**: Indicadores de procesamiento

### **Microinteracciones**
- **Scale on hover**: Tarjetas que se elevan
- **Pulse effects**: Elementos importantes
- **Slide animations**: Transiciones de modales
- **Bounce effects**: Confirmaciones exitosas

## 🔒 Seguridad y Privacidad

### **Protección de Datos**
- **Encriptación Zama**: Datos sensibles opcionales
- **Wallet pre-creada**: Sin exposición de claves privadas
- **Transacciones simuladas**: Para desarrollo y pruebas
- **Validación de entrada**: Sanitización de datos

### **Transparencia**
- **Hash de transacción**: Verificable públicamente
- **CID de Filecoin**: Contenido inmutable
- **Estado en tiempo real**: Monitoreo de transacciones
- **Exploradores públicos**: Acceso a toda la información

## 🚀 Despliegue en Vercel

### **1. Configuración de Build**
```json
{
  "scripts": {
    "build": "next build",
    "start": "next start"
  }
}
```

### **2. Variables de Entorno en Vercel**
- `NEXT_PUBLIC_ALCHEMY_API_KEY`
- `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID`
- `LISK_PRIVATE_KEY`

### **3. Dominio Personalizado**
- Configurar dominio en Vercel
- SSL automático
- CDN global

## 🧪 Testing y Desarrollo

### **Modo Demo**
- Transacciones simuladas
- Delays artificiales para UX
- Logs de consola para debugging
- Estados de carga realistas

### **Modo Producción**
- Transacciones reales en Lisk
- Subida real a Filecoin
- Enlaces a exploradores reales
- Monitoreo de errores

## 📱 Responsive Design

### **Breakpoints**
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### **Adaptaciones**
- Grid responsivo para tarjetas
- Modales adaptables
- Navegación móvil optimizada
- Touch-friendly interactions

## 🌍 Internacionalización

### **Idioma Actual**
- Español (Argentina)
- Formato de moneda USD
- Fechas en formato local

### **Expansión Futura**
- Múltiples idiomas
- Monedas locales
- Formatos regionales

## 🔮 Roadmap y Mejoras

### **Fase 1 (Actual)**
- ✅ Donaciones básicas
- ✅ Integración Lisk
- ✅ Almacenamiento Filecoin
- ✅ UI/UX moderna

### **Fase 2 (Próxima)**
- 🔄 Múltiples árboles simultáneos
- 🔄 Sistema de logros avanzado
- 🔄 Notificaciones push
- 🔄 Analytics de impacto

### **Fase 3 (Futura)**
- 🔮 Integración con más blockchains
- 🔮 Marketplace de árboles
- 🔮 Comunidad de rescatadores
- 🔮 Impacto ambiental tracking

## 🤝 Contribución

### **Cómo Contribuir**
1. Fork del repositorio
2. Crear rama feature
3. Implementar cambios
4. Crear Pull Request

### **Estándares de Código**
- TypeScript estricto
- ESLint + Prettier
- Conventional Commits
- Testing con Jest

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver `LICENCE` para más detalles.

## 🆘 Soporte

### **Documentación**
- [Next.js Documentation](https://nextjs.org/docs)
- [Lisk Documentation](https://lisk.com/documentation)
- [Filecoin Documentation](https://docs.filecoin.io)

### **Comunidad**
- Discord: [Scaffold-ETH](https://discord.gg/scaffold-eth)
- GitHub: [Issues](https://github.com/scaffold-eth/scaffold-eth-2/issues)
- Twitter: [@ScaffoldETH](https://twitter.com/ScaffoldETH)

---

**🌱 ¡Gracias por ayudar a hacer del mundo un lugar mejor, un árbol a la vez! 🌳**
