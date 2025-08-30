import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Scaffold-Lisk",
  description: "Panel de control personalizado para usuarios autenticados",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen">{children}</div>;
}
