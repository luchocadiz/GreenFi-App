import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rescatá un Árbol | GreenFi",
  description: "Conecta tu wallet y comenzá a rescatar árboles con donaciones en blockchain",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
