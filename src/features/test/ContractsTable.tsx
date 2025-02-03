import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import type { FuneralContract } from "./types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ContractsTableProps {
  onEditContract: (contract: FuneralContract) => void;
}

const fetchContracts = async (): Promise<FuneralContract[]> => {
  const response = await fetch("http://localhost:3001/contracts");
  if (!response.ok) {
    throw new Error("Failed to fetch contracts");
  }
  return response.json();
};

const ContractsTable = ({ onEditContract }: ContractsTableProps) => {
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
            <TableHead>Contract ID</TableHead>
            <TableHead>Client Name</TableHead>
            <TableHead>Family Members</TableHead>
            <TableHead>Payment Method</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Completion</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contracts.map((contract) => (
            <TableRow key={contract.id}>
              <TableCell>
                {typeof contract.id === "string"
                  ? contract.id.slice(0, 8)
                  : String(contract.id)}
              </TableCell>
              <TableCell>
                {contract.formData.general?.clientName || "-"}
              </TableCell>
              <TableCell>
                {contract.formData.people?.familyMembers || "-"}
              </TableCell>
              <TableCell>
                {contract.formData.payment?.paymentMethod || "-"}
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    contract.contractState === "draft"
                      ? "secondary"
                      : contract.contractState === "executed"
                        ? "default"
                        : contract.contractState === "finalized"
                          ? "secondary"
                          : "destructive"
                  }
                >
                  {contract.contractState}
                </Badge>
              </TableCell>
              <TableCell>
                {
                  Object.values(contract.sectionsCompleted).filter(Boolean)
                    .length
                }
                /3
              </TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEditContract(contract)}
                  disabled={contract.contractState !== "draft"}
                >
                  Edit
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {contracts.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                No contracts found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ContractsTable;
