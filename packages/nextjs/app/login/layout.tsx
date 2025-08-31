import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rescue a Tree | GreenFi",
  description: "Connect your wallet and start rescuing trees with blockchain donations",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
