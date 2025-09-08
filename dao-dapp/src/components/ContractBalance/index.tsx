
import { useEffect, useState } from "react";
import { usePublicClient } from "wagmi";
import { formatEther } from "viem";
import { Button } from "@/components/ui/button";

function ContractBalance() {
  const [balance, setBalance] = useState<string>("0");
  const publicClient = usePublicClient();
  const contractAddress = import.meta.env.VITE_QUADRATIC_GOVERNANCE_VOTING_CONTRACT as `0x${string}`;

  useEffect(() => {
    const fetchBalance = async () => {
      if (!publicClient) return;
      
      try {
        // Get the balance of the contract
        const balanceWei = await publicClient.getBalance({
          address: contractAddress,
        });
        
        // Convert from wei to ether and format to 4 decimal places
        const balanceEth = formatEther(balanceWei);
        setBalance(Number(balanceEth).toFixed(4));
      } catch (error) {
        console.error("Error fetching contract balance:", error);
      }
    };

    fetchBalance();
    
    // Optional: Set up polling to update balance periodically
    const interval = setInterval(fetchBalance, 10000); // Update every 10 seconds
    
    return () => clearInterval(interval);
  }, [publicClient, contractAddress]);

  return (
    // <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg">
    //   <span className="text-sm font-medium">Contract Balance:</span>
    //   <span className="text-sm font-semibold">{balance} ETH</span>
    // </div>
    <div className="flex flex-wrap items-center gap-2 md:flex-row">
      <Button>
      <span className="text-sm font-medium">Contract Balance:</span>
      <span className="text-sm font-semibold">{balance} ETH</span>
      </Button>
    </div>  
  );
}

export default ContractBalance;