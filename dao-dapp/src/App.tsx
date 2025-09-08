import AppLayout from "./components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProposalCard from "./components/ProposalCard";
import useChairPerson from "./hooks/useChairPerson";
import { useEffect, useState } from "react";
import { parseAbiItem } from "viem";
import { publicClient, webSocketClient } from "./config/config";
import { toast } from "sonner";
import { QUADRATIC_GOVERNANCE_VOTING_CONTRACT_ABI } from "./config/ABI";

function App() {
    const chairPerson = useChairPerson();
    const [proposals, setProposals] = useState<any[]>([]);

    useEffect(() => {
        const fetchProposals = async () => {
            try {
                const proposalCount = await publicClient.readContract({
                    address: import.meta.env
                        .VITE_QUADRATIC_GOVERNANCE_VOTING_CONTRACT as `0x${string}`,
                    abi: QUADRATIC_GOVERNANCE_VOTING_CONTRACT_ABI,
                    functionName: "getProposalCount",
                });

                const proposals = [];
                for (let i = 0; i < Number(proposalCount); i++) {
                    const proposal = await publicClient.readContract({
                        address: import.meta.env
                            .VITE_QUADRATIC_GOVERNANCE_VOTING_CONTRACT as `0x${string}`,
                        abi: QUADRATIC_GOVERNANCE_VOTING_CONTRACT_ABI,
                        functionName: "proposals",
                        args: [i],
                    });
                    console.log("proposal: ", proposal);
                    proposals.unshift({
                        proposalId: i,
                        description: proposal[0],
                        recipient: proposal[1],
                        amount: proposal[2],
                        voteCount: proposal[3],
                        deadline: proposal[4],
                        executed: proposal[5],
                    });
                }
                setProposals(proposals);
            } catch (error) {
                console.error("Fetching failed: ", error);
                toast.error("Fetching failed", {
                    description: "Failed to fetch proposals",
                });
            }
        };

        fetchProposals();

        const unwatch = webSocketClient.watchEvent({
            address: import.meta.env.VITE_QUADRATIC_GOVERNANCE_VOTING_CONTRACT as `0x${string}`,
            event: parseAbiItem(
                "event ProposalCreated(uint indexed proposalId, string description, address recipient, uint amount, uint deadline)"
            ),
            onLogs: (logs) => {
                setProposals(prevProposals => {
                    const existingIds = new Set(prevProposals.map(p => p.proposalId));
                    const newLogs = logs.filter(log => !existingIds.has(log.args.proposalId));
                    
                    if (newLogs.length > 0) {
                        toast.success('New proposal created!');
                        return [...prevProposals, ...newLogs.map(log => log.args)];
                    }
                    return prevProposals;
                });
            },
            onError: (error) => {
                console.error('Event listener error:', error);
                toast.error('Error listening for new proposals');
            }
        });

        return () => {
            unwatch();
        };
    }, []);
    
    
    

    // const activePropsals = proposals.filter(
    //     (proposal) =>
    //         !proposal.executed && proposal.deadline * 1000 > Date.now()
    // );
    return (
        <AppLayout chairPersonAddress={chairPerson as `0x${string}`}>
            <div className="flex w-full flex-col gap-6">
                <Tabs defaultValue="active" className="mt-4">
                    <TabsList>
                        <TabsTrigger value="active" className="cursor-pointer">
                            Active
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="active">
                        {proposals.length === 0 ? (
                            <span>No active proposals</span>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mx-auto">
                                {proposals.map((p, i) => (
                                    <ProposalCard
                                        key={i}
                                        id={p.proposalId}
                                        description={p.description}
                                        recipient={p.recipient}
                                        amount={p.amount}
                                        deadline={p.deadline}
                                        handleVote={() => { }}
                                        voteCount={0}
                                        executed={false}
                                        isVoted={false}
                                    />
                                ))}
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
}

export default App;
