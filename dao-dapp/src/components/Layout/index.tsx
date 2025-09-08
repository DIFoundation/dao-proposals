import { ConnectButton } from "@rainbow-me/rainbowkit";
import CreateProposalModal from "../CreateProposalModal";
import { isAddressEqual } from "viem";
import { useAccount } from "wagmi";
import { Toaster } from "sonner";
import useCreateProposal from "../../hooks/useCreateProposal";
import type { ReactNode } from "react";
import ContractBalance from "../ContractBalance";

interface AppLayoutProps {
    children: ReactNode;
    chairPersonAddress: `0x${string}`;
}

const AppLayout = ({ children, chairPersonAddress }: AppLayoutProps) => {
    const { address } = useAccount();
    const createProposal = useCreateProposal();

    // console.log("address: ", address);
    // console.log("chairPersonAddress: ", chairPersonAddress);
    // console.log("isAddressEqual: ", isAddressEqual(chairPersonAddress, address));

    return (
        <div className="w-full h-full">
            <header className="h-20 bg-amber-100 p-4">
                <div className="container mx-auto flex justify-between items-center">
                    <span>LoGo</span>
                    <div className="flex gap-4 items-center">
                        <ContractBalance />
                        <ConnectButton />
                        {address &&
                            chairPersonAddress &&
                            isAddressEqual(chairPersonAddress, address) && (
                                <CreateProposalModal createProposal={createProposal} />
                            )}
                    </div>
                </div>
            </header>

            <main className="min-h-[calc(100vh-10rem)] w-full">
                <div className="container mx-auto">{children}</div>
            </main>

            <footer className="h-20 bg-amber-100 p-4">
                <div className="container mx-auto">
                    &copy; cohort xiii {new Date().getFullYear()}
                </div>
            </footer>
            <Toaster />
        </div>
    );
};

export default AppLayout;
