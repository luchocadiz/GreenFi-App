import "./_styles/animations.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rescatá un Árbol | Scaffold-Lisk",
  description:
    "Protegé el bosque y ayudá a combatir el cambio climático. Cada donación se registra en blockchain para máxima transparencia.",
  keywords: "árboles, reforestación, blockchain, Lisk, Filecoin, medio ambiente, donación",
  openGraph: {
    title: "Rescatá un Árbol | Protegé el Bosque",
    description: "Protegé el bosque y ayudá a combatir el cambio climático con donaciones transparentes en blockchain.",
    images: ["/images/trees/forest-og.jpg"],
  },
};

export default function RescataArbolLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen">{children}</div>;
}
