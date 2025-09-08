import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "../ui/button";
import { shortenAddress } from "@/lib/utils";

interface ProposalCardProps {
    id: bigint;
    description: string;
    recipient: string;
    amount: bigint;
    voteCount: number;
    deadline: bigint;
    executed: boolean;
    isVoted: boolean;
    handleVote: () => void;
}

const ProposalCard: React.FC<ProposalCardProps> = ({ id, description, recipient, amount, voteCount, deadline, executed, isVoted, handleVote }) => {
    return (
        <Card className="w-full mx-auto">
        <CardHeader>
            <CardTitle className="flex justify-between items-center">
                <span>Proposal #{id.toString()}</span>
                <span>Vote Count: {voteCount}</span>
            </CardTitle>
            <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
            <div>
                <span>Recipient: </span>
                <span>{shortenAddress(recipient, 4)}</span>
            </div>
            <div>
                <span>Amount: </span>
                <span>{Number(amount) / 1e18}</span>
            </div>
            <div>
                <span>Deadline: </span>
                <span>{new Date(Number(deadline) * 1000).toLocaleString()}</span>
            </div>
            <div>
                <span>Executed: </span>
                <span>{executed}</span>
            </div>
        </CardContent>
        <CardFooter className="flex-col gap-2">
            <Button
                onClick={handleVote}
                disabled={isVoted}
                type="submit"
                className="w-full"
            >
                Vote
            </Button>
        </CardFooter>
    </Card>
    );
};

export default ProposalCard;

