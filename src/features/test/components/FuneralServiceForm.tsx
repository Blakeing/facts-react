import { useMachine } from "@xstate/react";
import { useEffect, useCallback, useMemo, memo } from "react";
import createContractMachine from "../machines/contractMachine";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import GeneralSection from "./sections/GeneralSection";
import PeopleSection from "./sections/PeopleSection";
import PaymentSection from "./sections/PaymentSection";
import ReviewSection from "./sections/ReviewSection";
import { useContractMutations } from "../hooks/useContractMutations";
import type { Contract } from "../types";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export interface FuneralServiceFormProps {
  onComplete?: () => void;
  initialData?: Contract | undefined;
}

// Create a single instance of the machine outside the component
const contractMachine = createContractMachine();

const FuneralServiceForm = memo(({ initialData }: FuneralServiceFormProps) => {
  const [state, sendRaw] = useMachine(contractMachine);
  const { createMutation, updateMutation } = useContractMutations();
  const navigate = useNavigate();

  // Add debug logging for state and context
  console.log("[FuneralServiceForm] Current state:", state.value);
  console.log("[FuneralServiceForm] Current context:", state.context);
  console.log("[FuneralServiceForm] General ref:", state.context.generalRef);

  // Memoize the send function to prevent recreation of handlers
  const send = useCallback(
    (event: Parameters<typeof sendRaw>[0]) => {
      console.log("[FuneralServiceForm] Sending event:", event);
      sendRaw(event);
    },
    [sendRaw]
  );

  // Load initial data only once when it changes
  useEffect(() => {
    if (initialData) {
      const transformedData = {
        ...initialData,
        formData: {
          ...initialData.formData,
          people: initialData.formData.people
            ? {
                familyMembers: initialData.formData.people.familyMembers.map(
                  (member) => ({
                    id: crypto.randomUUID(),
                    name: typeof member === "string" ? member : member.name,
                  })
                ),
              }
            : null,
        },
      };
      send({ type: "LOAD_CONTRACT", data: transformedData });
    }
  }, [initialData, send]);

  const handleSaveContract = useCallback(() => {
    const { generalRef, peopleRef, paymentRef } = state.context;
    if (!generalRef || !peopleRef || !paymentRef) return;

    const contractData = {
      id: state.context.id || crypto.randomUUID(),
      contractState: state.context.contractState || "draft",
      formData: {
        general: generalRef.getSnapshot().context.data,
        people: peopleRef.getSnapshot().context.data,
        payment: paymentRef.getSnapshot().context.data,
      },
    };

    if (state.context.id) {
      // Update existing contract
      updateMutation.mutate(contractData);
    } else {
      // Create new contract
      const { id, ...newContractData } = contractData;
      createMutation.mutate(newContractData);
    }
  }, [state.context, createMutation, updateMutation]);

  // Memoize all navigation handlers
  const handlers = useMemo(
    () => ({
      handleGoToGeneral: () => send({ type: "GO_TO_GENERAL" }),
      handleGoToPeople: () => send({ type: "GO_TO_PEOPLE" }),
      handleGoToPayment: () => send({ type: "GO_TO_PAYMENT" }),
      handleGoToReview: () => send({ type: "GO_TO_REVIEW" }),
      handleExecute: () => {
        const { generalRef, peopleRef, paymentRef } = state.context;
        if (!generalRef || !peopleRef || !paymentRef) return;

        const contractData: Contract = {
          id: state.context.id || crypto.randomUUID(),
          contractState: "executed" as const,
          formData: {
            general: generalRef.getSnapshot().context.data,
            people: peopleRef.getSnapshot().context.data,
            payment: paymentRef.getSnapshot().context.data,
          },
        };

        if (state.context.id) {
          // Update existing contract
          updateMutation.mutate(contractData);
        } else {
          // Create new contract
          const { id, ...newContractData } = contractData;
          createMutation.mutate(newContractData);
        }
        send({ type: "EXECUTE" });
      },
      handleVoid: () => {
        const id = state.context.id;
        if (!id) return;
        updateMutation.mutate({
          ...state.context,
          id,
          contractState: "void",
        });
        send({ type: "VOID" });
      },
      handleFinalize: () => {
        const id = state.context.id;
        if (!id) return;
        updateMutation.mutate({
          ...state.context,
          id,
          contractState: "finalized",
        });
        send({ type: "FINALIZE" });
      },
    }),
    [send, state.context, updateMutation, createMutation]
  );

  const handleTabChange = useCallback(
    (value: string) => {
      switch (value) {
        case "general":
          send({ type: "GO_TO_GENERAL" });
          break;
        case "people":
          send({ type: "GO_TO_PEOPLE" });
          break;
        case "payment":
          send({ type: "GO_TO_PAYMENT" });
          break;
        case "review":
          send({ type: "GO_TO_REVIEW" });
          break;
      }
    },
    [send]
  );

  // Memoize section rendering based on state and handlers
  const getCurrentSection = useMemo(() => {
    const { generalRef, peopleRef, paymentRef } = state.context;
    console.log(
      "[FuneralServiceForm] Rendering section for state:",
      state.value
    );
    console.log("[FuneralServiceForm] Current context:", state.context);

    const {
      handleGoToGeneral,
      handleGoToPeople,
      handleGoToPayment,
      handleGoToReview,
    } = handlers;

    // Map state value to tab value
    const getTabValue = (stateValue: string) => {
      // If it's in draft state, we're in the general tab
      if (stateValue === "draft") return "general";
      return stateValue;
    };

    // Handle both string and object state values
    const currentState =
      typeof state.value === "string"
        ? state.value
        : Object.keys(state.value)[0];

    const renderSection = () => {
      switch (currentState) {
        case "draft":
          return (
            <div className="space-y-4">
              <GeneralSection actor={generalRef} />
            </div>
          );
        case "people":
          return (
            <div className="space-y-4">
              <PeopleSection actor={peopleRef} />
            </div>
          );
        case "payment":
          return (
            <div className="space-y-4">
              <PaymentSection actor={paymentRef} />
            </div>
          );
        case "review":
          return (
            <div className="space-y-4">
              <ReviewSection
                generalData={generalRef?.getSnapshot()?.context.data ?? null}
                peopleData={peopleRef?.getSnapshot()?.context.data ?? null}
                paymentData={paymentRef?.getSnapshot()?.context.data ?? null}
                onEdit={(section) => {
                  const sectionMap = {
                    general: handleGoToGeneral,
                    people: handleGoToPeople,
                    payment: handleGoToPayment,
                    review: handleGoToReview,
                  } as const;
                  sectionMap[section as keyof typeof sectionMap]();
                }}
              />
            </div>
          );
        case "executed":
          return (
            <div className="space-y-4">
              <ReviewSection
                generalData={generalRef?.getSnapshot()?.context.data ?? null}
                peopleData={peopleRef?.getSnapshot()?.context.data ?? null}
                paymentData={paymentRef?.getSnapshot()?.context.data ?? null}
                readOnly
              />
            </div>
          );
        case "finalized":
        case "void":
          return (
            <ReviewSection
              generalData={generalRef?.getSnapshot()?.context.data ?? null}
              peopleData={peopleRef?.getSnapshot()?.context.data ?? null}
              paymentData={paymentRef?.getSnapshot()?.context.data ?? null}
              readOnly
              status={state.value}
            />
          );
        default:
          return null;
      }
    };

    return (
      <div className="space-y-4">
        <div className="border-b">
          <Tabs
            value={getTabValue(state.value.toString())}
            onValueChange={handleTabChange}
          >
            <TabsList>
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="people">People</TabsTrigger>
              <TabsTrigger value="payment">Payment</TabsTrigger>
              <TabsTrigger value="review">Review</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        {renderSection()}
      </div>
    );
  }, [state.context, state.value, handlers, handleTabChange]);

  const FormHeader = useMemo(() => {
    return (
      <div className="flex items-center justify-between p-4 border-b">
        <Button variant="outline" onClick={() => navigate({ to: "/test" })}>
          Back to Test
        </Button>
        <div className="flex items-center gap-2">
          <Button onClick={handleSaveContract}>Save Changes</Button>
          {!["executed", "finalized", "void"].includes(
            state.context.contractState || ""
          ) && (
            <Button onClick={handlers.handleExecute}>Execute Contract</Button>
          )}
          {state.context.contractState === "executed" && (
            <>
              <Button onClick={handlers.handleVoid}>Void Contract</Button>
              <Button onClick={handlers.handleFinalize}>
                Finalize Contract
              </Button>
            </>
          )}
          <Badge
            variant={
              state.context.contractState === "finalized"
                ? "default"
                : state.context.contractState === "void"
                  ? "destructive"
                  : state.context.contractState === "executed"
                    ? "secondary"
                    : "outline"
            }
            className={
              state.context.contractState === "finalized"
                ? "bg-green-500 hover:bg-green-600"
                : state.context.contractState === "void"
                  ? "bg-red-500 hover:bg-red-600"
                  : state.context.contractState === "executed"
                    ? "bg-blue-500 hover:bg-blue-600"
                    : ""
            }
          >
            {(state.context.contractState || "DRAFT").toUpperCase()}
          </Badge>
        </div>
      </div>
    );
  }, [state.context.contractState, navigate, handlers, handleSaveContract]);

  return (
    <Card>
      <CardHeader>{FormHeader}</CardHeader>
      <CardContent>{getCurrentSection}</CardContent>
    </Card>
  );
});

FuneralServiceForm.displayName = "FuneralServiceForm";

export default FuneralServiceForm;
