// import { useReadContract } from "wagmi";
// import { type Address } from "viem";
import { QUADRATIC_GOVERNANCE_VOTING_CONTRACT_ABI } from "@/config/ABI";
import { usePublicClient } from "wagmi";
import { toast } from "sonner";
import { useEffect, useMemo, useState } from "react";

const useChairPerson = () => {
    const [chairPerson, setChairPerson] = useState<string>();
    const publicClient = usePublicClient();

    // console.log("publicClient: ", publicClient);

    // const res = useReadContract({
    //     abi: QUADRATIC_GOVERNANCE_VOTING_CONTRACT_ABI,
    //     address: import.meta.env.VITE_QUADRATIC_GOVERNANCE_VOTING_CONTRACT,
    //     functionName: "chairperson",
    // });

    // const resultObject = JSON.parse(JSON.stringify(res));

    // console.log("resultObject: ", resultObject.data);

    useEffect(() => {
        const fetchChairPerson = async () => {
            if (!publicClient) return;
            
            try {
                const result = await publicClient.readContract({
                    address: import.meta.env.VITE_QUADRATIC_GOVERNANCE_VOTING_CONTRACT as `0x${string}`,
                    abi: QUADRATIC_GOVERNANCE_VOTING_CONTRACT_ABI,
                    functionName: "chairperson",
                });
                setChairPerson(result as string);
            } catch {
                // console.error("Error fetching chairperson:", error);
                toast.error("Error fetching chairperson", {
                    description: "Failed to fetch chairperson",
                });
            }
        };

        fetchChairPerson();
    }, [publicClient]);

    return useMemo(() => chairPerson, [chairPerson]);
};

export default useChairPerson;