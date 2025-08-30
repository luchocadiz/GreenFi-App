import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | Scaffold-Lisk",
  description: "Conecta tu wallet para acceder a la aplicación",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-blue-900 to-purple-900">
      {children}
    </div>
  );
}
