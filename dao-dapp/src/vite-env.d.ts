/// <reference types="vite/client" />

declare global {
    type Proposal = {
        id: number;
        description: string;
        recipient: string;
        amount: string;
        voteCount: number;
        deadline: number;
        executed: boolean;
        isVoted: boolean;
    };

    type ChairPerson = string | undefined;

    type AppLayoutProps = {
        chairPersonAddress: ChairPerson;
        children: React.ReactNode;
    };

    type ProposalCardProps = {
        id: number;
        description: string;
        recipient: string;
        amount: string;
        voteCount: number;
        deadline: number;
        executed: boolean;
        isVoted: boolean;
        handleVote: () => void;
    };

    type CreateProposalModalProps =     {
        onSubmit: (description: string, recipient: string, amount: string, deadline: Date) => void;
    };

    type DateTimePickerProps = {
        date: Date | undefined;
        setDate: (date: Date | undefined) => void;
    };
}