import "./_styles/animations.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rescue a Tree | GreenFi",
  description:
    "Protect the forest and help combat climate change. Every donation is recorded on blockchain for maximum transparency.",
  keywords: "trees, reforestation, blockchain, Lisk, Filecoin, environment, donation",
  openGraph: {
    title: "Rescue a Tree | Protect the Forest",
    description: "Protect the forest and help combat climate change with transparent blockchain donations.",
    images: ["/images/trees/forest-og.jpg"],
  },
};

export default function RescataArbolLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen">{children}</div>;
}
