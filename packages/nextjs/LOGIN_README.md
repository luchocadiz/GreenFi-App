# Sistema de Login para Lisk Sepolia

Este proyecto incluye un sistema completo de autenticación que permite a los usuarios conectarse usando MetaMask a la testnet de Lisk Sepolia.

## 🚀 Características

- **Autenticación con MetaMask**: Conexión segura usando la wallet más popular
- **Detección automática de red**: Verifica que estés en Lisk Sepolia (Chain ID: 4202)
- **Cambio automático de red**: Botón para cambiar a Lisk Sepolia si estás en otra red
- **Agregar red a MetaMask**: Botón para agregar Lisk Sepolia si no está configurada
- **Protección de rutas**: Componente AuthGuard para proteger páginas privadas
- **Dashboard personalizado**: Página protegida solo para usuarios autenticados
- **Navbar condicional**: Solo se muestra cuando estás autenticado en Lisk Sepolia
- **Redirección automática**: Páginas protegidas redirigen al login si no estás autenticado
- **UI moderna**: Interfaz con gradientes y efectos visuales atractivos

## 📁 Estructura de Archivos

```
app/
├── login/
│   ├── page.tsx          # Página de login principal (sin navbar)
│   └── layout.tsx        # Layout específico para login
├── dashboard/
│   ├── page.tsx          # Dashboard protegido
│   └── layout.tsx        # Layout del dashboard
├── debug/                # Página de debug (protegida)
├── blockexplorer/        # Explorador de bloques (protegido)
└── page.tsx              # Página principal (redirige al login si no autenticado)
components/
├── AuthButton.tsx        # Botón de autenticación para el header
├── AuthGuard.tsx         # Componente de protección de rutas
├── RedirectToLogin.tsx   # Componente de redirección al login
└── Header.tsx            # Header condicional (solo visible si autenticado)
hooks/
└── useAuth.ts            # Hook personalizado para autenticación
types/
└── global.d.ts           # Tipos globales para TypeScript
```

## 🔧 Configuración

### 1. Variables de Entorno

Asegúrate de tener configuradas las siguientes variables en tu archivo `.env.local`:

```bash
NEXT_PUBLIC_ALCHEMY_API_KEY=tu_api_key_de_alchemy
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=tu_project_id_de_walletconnect
```

### 2. Configuración de Hardhat

El proyecto ya está configurado para usar Lisk Sepolia en `hardhat.config.ts`:

```typescript
liskSepolia: {
  url: "https://rpc.sepolia-api.lisk.com",
  accounts: [deployerPrivateKey],
},
```

## 🎯 Uso

### 1. Acceder al Login

Navega a `/login` para acceder a la página de autenticación.

### 2. Conectar MetaMask

1. Haz clic en "Conectar con MetaMask"
2. Acepta la conexión en MetaMask
3. Si no estás en Lisk Sepolia, usa el botón "Cambiar a Lisk Sepolia"

### 3. Agregar Lisk Sepolia a MetaMask

Si la red no está configurada, usa el botón "Agregar Lisk Sepolia a MetaMask" para configurarla automáticamente.

### 4. Acceder al Dashboard

Una vez autenticado, serás redirigido automáticamente al dashboard en `/dashboard`.

## 🛡️ Protección de Rutas

### Protección con AuthGuard

Para proteger una página, envuélvela con el componente `AuthGuard`:

```tsx
import AuthGuard from "~~/components/AuthGuard";

const ProtectedPage = () => {
  return (
    <AuthGuard>
      <div>Contenido protegido</div>
    </AuthGuard>
  );
};
```

### Protección con Redirección

Para páginas que redirijan automáticamente al login:

```tsx
import { useAuth } from "~~/hooks/useAuth";
import RedirectToLogin from "~~/components/RedirectToLogin";

const ProtectedPage = () => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <RedirectToLogin />;
  }
  
  return <div>Contenido protegido</div>;
};
```

## 🔒 Comportamiento del Navbar

- **Sin autenticación**: Solo se muestra el botón de "Conectar Wallet"
- **Con autenticación**: Se muestran todas las opciones del menú y el logo
- **Página de login**: No se muestra el navbar (layout independiente)
- **Páginas protegidas**: Navbar completo con todas las funcionalidades

## 🎨 Personalización

### Colores y Temas

El sistema usa un esquema de colores basado en gradientes:
- **Verde a Azul**: Botones principales
- **Púrpura a Rosa**: Botones secundarios
- **Verde**: Estados de éxito
- **Amarillo**: Estados de advertencia
- **Rojo**: Botones de desconexión

### Estilos

Los estilos están basados en Tailwind CSS con clases personalizadas para:
- Gradientes de fondo
- Efectos de glassmorphism
- Animaciones y transiciones
- Responsive design

## 🔍 Troubleshooting

### Error: "MetaMask no está disponible"

- Asegúrate de tener MetaMask instalado
- Verifica que MetaMask esté desbloqueado
- Recarga la página

### Error: "Debes estar conectado a Lisk Sepolia"

- Usa el botón "Cambiar a Lisk Sepolia"
- O agrega la red manualmente en MetaMask

### Error: "Error al conectar con MetaMask"

- Verifica que MetaMask esté funcionando correctamente
- Intenta desconectar y reconectar
- Limpia el caché del navegador

## 🚀 Despliegue

### Vercel

1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno en el dashboard de Vercel
3. Despliega automáticamente

### Netlify

1. Conecta tu repositorio a Netlify
2. Configura las variables de entorno
3. Configura el build command: `npm run build`
4. Configura el publish directory: `.next`

## 📱 Compatibilidad

- **Navegadores**: Chrome, Firefox, Safari, Edge (con MetaMask)
- **Dispositivos**: Desktop, Tablet, Mobile
- **Wallets**: MetaMask (principal), otras wallets compatibles con WalletConnect

## 🤝 Contribución

Para contribuir al proyecto:

1. Fork el repositorio
2. Crea una rama para tu feature
3. Haz commit de tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver `LICENCE` para más detalles.

## 🆘 Soporte

Si tienes problemas o preguntas:

1. Revisa la documentación
2. Busca en los issues existentes
3. Crea un nuevo issue con detalles del problema
4. Incluye logs de consola y pasos para reproducir

---

¡Disfruta usando el sistema de login de Lisk! 🎉
