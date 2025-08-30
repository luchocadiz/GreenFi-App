export interface Tree {
  id: number;
  name: string;
  species: string;
  location: string;
  description: string;
  image: string;
  rescueAmount: number;
  urgency: "Baja" | "Media" | "Alta";
  impact: string;
  carbonCapture: string;
}

export interface DonationData {
  treeId: number;
  treeName: string;
  amount: number;
  paymentMethod: "card" | "qr";
  treeImage: string;
  receipt: string;
  transactionHash?: string;
  filecoinCid?: string;
}

export interface LiskTransactionData {
  treeId: number;
  amount: number;
  userAddress: string;
  treeName: string;
}

export interface FilecoinUploadData {
  treeImage: string;
  receipt: string;
  transactionHash: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  requirement: string;
}
