import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { memo } from "react";
import { useQuery } from "@tanstack/react-query";

interface Contract {
  id: string;
  contractState: "draft" | "executed" | "finalized" | "void" | "review";
  formData: {
    general: { clientName: string } | null;
    people: { familyMembers: Array<{ id: string; name: string }> } | null;
    payment: { paymentMethod: "cash" | "credit"; amount: number } | null;
  };
}

interface ContractsTableProps {
  onEditContract: (id: string) => void;
}

const fetchContracts = async (): Promise<Contract[]> => {
  const response = await fetch("http://localhost:3001/contracts");
  if (!response.ok) {
    throw new Error("Failed to fetch contracts");
  }
  return response.json();
};

const ContractsTable = memo(({ onEditContract }: ContractsTableProps) => {
  const {
    data: contracts = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["contracts"],
    queryFn: fetchContracts,
  });

  if (isLoading) return <div>Loading contracts...</div>;
  if (error) return <div>Error loading contracts</div>;

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Client Name</TableHead>
            <TableHead>Family Members</TableHead>
            <TableHead>Payment Method</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contracts.map((contract) => {
            const amount = contract.formData.payment?.amount;
            const formattedAmount =
              amount !== undefined ? `$${amount.toFixed(2)}` : "N/A";

            return (
              <TableRow key={contract.id}>
                <TableCell>
                  {contract.formData.general?.clientName ?? "N/A"}
                </TableCell>
                <TableCell>
                  {contract.formData.people?.familyMembers?.length ?? 0} members
                </TableCell>
                <TableCell>
                  {contract.formData.payment?.paymentMethod?.toUpperCase() ??
                    "N/A"}
                </TableCell>
                <TableCell>{formattedAmount}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      contract.contractState === "finalized"
                        ? "default"
                        : contract.contractState === "void"
                          ? "destructive"
                          : contract.contractState === "executed"
                            ? "secondary"
                            : "outline"
                    }
                    className={
                      contract.contractState === "finalized"
                        ? "bg-green-500 hover:bg-green-600"
                        : contract.contractState === "void"
                          ? "bg-red-500 hover:bg-red-600"
                          : contract.contractState === "executed"
                            ? "bg-blue-500 hover:bg-blue-600"
                            : ""
                    }
                  >
                    {contract.contractState.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    onClick={() => onEditContract(contract.id)}
                    disabled={["finalized", "void"].includes(
                      contract.contractState
                    )}
                  >
                    {["draft", "executed", "review"].includes(
                      contract.contractState
                    )
                      ? "Edit"
                      : "View"}
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
          {contracts.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6">
                No contracts found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
});

ContractsTable.displayName = "ContractsTable";

export default ContractsTable;
