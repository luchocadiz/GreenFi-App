// Tipos que coinciden con el contrato NGODonations.sol
export interface Project {
  id: number;
  projectName: string;
  ngoName: string;
  ngoWallet: string;
  targetAmount: string; // BigNumber como string
  raisedAmount: string; // BigNumber como string
  active: boolean;
  createdAt: number; // timestamp
}

export interface Donation {
  amount: string; // BigNumber como string
  donorName: string;
  message: string;
  time: number; // timestamp
  donorAddress: string;
}

// Tipos para la interfaz de usuario
export interface TreeProject extends Project {
  // Campos adicionales para la UI
  image?: string;
  description?: string;
  location?: string;
  impact?: string;
  co2Capture?: string;
  urgency?: "low" | "medium" | "high";
}

export interface DonationData {
  projectId: number;
  treeName: string;
  amount: string;
  donorName: string;
  message: string;
  paymentMethod?: PaymentMethod; // Opcional, ya que se usa blockchain por defecto
  transactionHash?: string;
  filecoinCid?: string;
}

export interface LiskTransactionData {
  projectId: number;
  donorName: string;
  message: string;
  amount: string;
  donorAddress: string;
}

export interface FilecoinUploadData {
  treeImage: string;
  receipt: string;
  transactionHash: string;
}

export interface PaymentMethod {
  type: "card" | "qr";
  details?: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: number;
}

// Tipos para el estado de la aplicación
export interface AppState {
  projects: TreeProject[];
  selectedProject: TreeProject | null;
  userDonations: Donation[];
  isLoading: boolean;
  error: string | null;
}

// Tipos para las transacciones
export interface TransactionStatus {
  status: "pending" | "confirmed" | "failed";
  hash?: string;
  blockNumber?: number;
  timestamp?: number;
}
