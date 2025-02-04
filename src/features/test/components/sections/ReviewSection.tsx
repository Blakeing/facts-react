import type { GeneralData } from "../../machines/generalMachine";
import type { PeopleData } from "../../machines/peopleMachine";
import type { PaymentData } from "../../machines/paymentMachine";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { memo, useCallback } from "react";

interface ReviewSectionProps {
  generalData: GeneralData | null;
  peopleData: PeopleData | null;
  paymentData: PaymentData | null;
  onEdit?: (section: "general" | "people" | "payment") => void;
  readOnly?: boolean;
  status?:
    | "draft"
    | "executed"
    | "finalized"
    | "void"
    | "people"
    | "payment"
    | "review";
}

const ReviewSection = memo(
  ({
    generalData,
    peopleData,
    paymentData,
    onEdit,
    readOnly,
    status,
  }: ReviewSectionProps) => {
    const handleEdit = useCallback(
      (section: "general" | "people" | "payment") => {
        onEdit?.(section);
      },
      [onEdit]
    );

    return (
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">General Information</h3>
                {!readOnly && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit("general")}
                  >
                    Edit
                  </Button>
                )}
              </div>
              <p>Client Name: {generalData?.clientName ?? "N/A"}</p>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Family Members</h3>
                {!readOnly && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit("people")}
                  >
                    Edit
                  </Button>
                )}
              </div>
              {peopleData?.familyMembers.length ? (
                <ul className="space-y-1">
                  {peopleData.familyMembers.map((member) => (
                    <li key={member.id} className="px-2 py-1">
                      {member.name}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No family members added</p>
              )}
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Payment Details</h3>
                {!readOnly && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit("payment")}
                  >
                    Edit
                  </Button>
                )}
              </div>
              <div className="space-y-1">
                <p>
                  Payment Method:{" "}
                  {paymentData?.paymentMethod.toUpperCase() ?? "N/A"}
                </p>
                <p>Amount: ${paymentData?.amount.toFixed(2) ?? "0.00"}</p>
              </div>
            </div>

            {status && (
              <>
                <Separator />
                <p
                  className={cn(
                    "text-lg font-semibold text-center",
                    status === "finalized"
                      ? "text-green-600 dark:text-green-500"
                      : "text-red-600 dark:text-red-500"
                  )}
                >
                  Contract {status.toUpperCase()}
                </p>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }
);

ReviewSection.displayName = "ReviewSection";

export default ReviewSection;
