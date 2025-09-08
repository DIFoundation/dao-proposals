import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { DateTimePicker } from "../DateTimePicker";
import { parseEther } from "viem";
import { toast } from "sonner";

interface CreateProposalModalProps {
    createProposal: (description: string, recipient: string, amount: bigint, deadline: number) => void;
}

const CreateProposalModal: React.FC<CreateProposalModalProps> = ({ createProposal }) => {
  const [description, setDescription] = useState<string>("");
  const [recipient, setRecipient] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [deadline, setDeadline] = useState<Date | undefined>();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!deadline) {
      toast.error("Please select a deadline", {
        description: "Kindly select a deadline",
      });
      return;
    }
    createProposal(
      description,
      recipient,
      parseEther(amount),
      Math.floor(deadline.getTime() / 1000)
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Create Proposal</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create a new Proposal</DialogTitle>
            <DialogDescription>
              Create a new proposal to be executed once all requirements are
              reached
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                placeholder="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="recipient">Recipient</Label>
              <Input
                id="recipient"
                name="recipient"
                placeholder="0x..."
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="recipient">Amount</Label>
              <Input
                id="amount"
                name="amount"
                placeholder="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="recipient">deadline</Label>
              <DateTimePicker date={deadline} setDate={setDeadline} />
            </div>
          </div>
          <DialogFooter className="w-full">
            <Button
              className="w-full"
              type="submit"
              disabled={!deadline}
            >
              Create Proposal
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateProposalModal;
