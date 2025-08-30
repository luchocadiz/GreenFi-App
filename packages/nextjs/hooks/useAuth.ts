import { useMemo } from "react";
import { useAccount, useNetwork } from "wagmi";

export const useAuth = () => {
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();

  // Lisk Sepolia chain ID
  const LISK_SEPOLIA_CHAIN_ID = 4202;

  const isAuthenticated = useMemo(() => {
    return isConnected && address && chain?.id === LISK_SEPOLIA_CHAIN_ID;
  }, [isConnected, address, chain]);

  const isCorrectNetwork = useMemo(() => {
    return chain?.id === LISK_SEPOLIA_CHAIN_ID;
  }, [chain]);

  const userAddress = useMemo(() => {
    return address;
  }, [address]);

  const networkName = useMemo(() => {
    return chain?.name || "Desconocida";
  }, [chain]);

  const networkId = useMemo(() => {
    return chain?.id;
  }, [chain]);

  return {
    isAuthenticated,
    isConnected,
    isCorrectNetwork,
    userAddress,
    networkName,
    networkId,
    chain,
  };
};
