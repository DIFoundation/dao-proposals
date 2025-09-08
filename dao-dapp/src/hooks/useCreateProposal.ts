import { useCallback } from "react";
import useChairPerson from "./useChairPerson";
import { toast } from "sonner";
import { isAddressEqual, formatEther } from "viem";
import { useAccount, useWalletClient, useWriteContract, usePublicClient } from "wagmi";
import { QUADRATIC_GOVERNANCE_VOTING_CONTRACT_ABI } from "@/config/ABI";

const useCreateProposal = () => {
    const { address } = useAccount();
    const chairPerson = useChairPerson();
    const { data: walletClient } = useWalletClient();
    const { writeContractAsync } = useWriteContract();
    const publicClient = usePublicClient();

    return useCallback(
        async (description: string, recipient: string, amountInwei: bigint, durationInSeconds: number) => {
            if (!address || !walletClient) {
                toast.error("Not connected", {
                    description: "Kindly connect your address",
                });
                return;
            }
            if (chairPerson && !isAddressEqual(address, chairPerson as `0x${string}`)) {
                toast.error("Unauthorized", {
                    description: "This action is only available to the chairperson",
                });
                return;
            }

            // Check contract balance
            const contractBalance = await publicClient?.getBalance({
                address: import.meta.env.VITE_QUADRATIC_GOVERNANCE_VOTING_CONTRACT as `0x${string}`,
            });

            if (contractBalance !== undefined && amountInwei > contractBalance) {
                toast.error("Insufficient Funds", {
                    description: `Requested amount (${formatEther(amountInwei)} ETH) exceeds contract balance (${formatEther(contractBalance)} ETH)`,
                });
                return;
            }

            const txHash = await writeContractAsync({
                address: import.meta.env.VITE_QUADRATIC_GOVERNANCE_VOTING_CONTRACT as `0x${string}`,
                abi: QUADRATIC_GOVERNANCE_VOTING_CONTRACT_ABI,
                functionName: "createProposal",
                args: [description, recipient, amountInwei, durationInSeconds],
            });

            console.log("txHash: ", txHash);

            if (!publicClient) {
                toast.error("Error", {
                    description: "Failed to get public client",
                });
                return;
            }

            const txReceipt = await publicClient.waitForTransactionReceipt({ 
                hash: txHash,
            });

            if (txReceipt.status === "success") {
                toast.success("Create proposal succeussfull", {
                    description: "You have successfully created a proposal",
                });
            } else {
                toast.error("Error", {
                    description: "Failed to create proposal",
                });
            }

        },
        [address, chairPerson, walletClient, writeContractAsync, publicClient]
    );
};

export default useCreateProposal;
