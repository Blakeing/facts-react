import { useMachine } from "@xstate/react";
import { createFuneralContractMachine } from "./funeralContractMachine";
import { Button } from "@/components/ui/button";
import { useRef, useMemo, memo, useEffect, useCallback } from "react";
import ContractsTable from "./ContractsTable";
import { GeneralSection } from "./components/GeneralSection";
import { PeopleSection } from "./components/PeopleSection";
import { PaymentSection } from "./components/PaymentSection";
import { useFormHandlers } from "./hooks/useFormHandlers";
import type { FuneralEvent, SectionsCompleted } from "./types";
import { useContractMutations } from "./hooks/useContractMutations";

const initialMachineContext = {
  formData: {
    id: undefined,
    general: undefined,
    people: undefined,
    payment: undefined,
  },
  sectionsCompleted: {
    general: false,
    people: false,
    payment: false,
  },
  contractState: "draft" as const,
  currentFormData: {
    id: undefined,
    general: undefined,
    people: undefined,
    payment: undefined,
  },
} as const;

// Create a single instance of the machine
const funeralServiceMachine = createFuneralContractMachine(
  initialMachineContext
);

// Memoize navigation buttons to prevent re-renders
const NavigationButtons = memo(function NavigationButtons({
  send,
  sectionsCompleted,
  currentState,
}: {
  send: (event: FuneralEvent) => void;
  sectionsCompleted: SectionsCompleted;
  currentState: string;
}) {
  console.log("[NavigationButtons] Rendering with state:", currentState);
  return (
    <div className="flex space-x-2 mb-4">
      <Button
        onClick={() => send({ type: "GO_TO_GENERAL" })}
        variant={currentState === "general" ? "default" : "outline"}
      >
        General Info {sectionsCompleted.general ? "✔" : ""}
      </Button>
      <Button
        onClick={() => send({ type: "GO_TO_PEOPLE" })}
        variant={currentState === "people" ? "default" : "outline"}
        disabled={!sectionsCompleted.general}
      >
        People {sectionsCompleted.people ? "✔" : ""}
      </Button>
      <Button
        onClick={() => send({ type: "GO_TO_PAYMENT" })}
        variant={currentState === "payment" ? "default" : "outline"}
        disabled={!sectionsCompleted.people}
      >
        Payment {sectionsCompleted.payment ? "✔" : ""}
      </Button>
      <Button
        onClick={() => send({ type: "GO_TO_REVIEW" })}
        variant={currentState === "review" ? "default" : "outline"}
        disabled={
          !sectionsCompleted.general ||
          !sectionsCompleted.people ||
          !sectionsCompleted.payment
        }
      >
        Review
      </Button>
    </div>
  );
});

const FuneralServiceForm = memo(() => {
  console.log("[FuneralServiceForm] Component rendering");

  const [state, sendRaw] = useMachine(funeralServiceMachine);
  console.log("[FuneralServiceForm] Current state:", state.value);
  console.log(
    "[FuneralServiceForm] Current context:",
    JSON.stringify(state.context, null, 2)
  );

  const { formData, sectionsCompleted, contractState } = state.context;
  const hasActiveContract = Boolean(formData?.id);
  const contractId = state.context.formData?.id;

  console.log("[FuneralServiceForm] Contract state:", {
    hasActiveContract,
    formDataId: formData?.id,
    contractId,
    currentState: state.value,
    sectionsCompleted,
    contractState,
  });

  const mutations = useContractMutations();

  // Memoize the send function to prevent recreation of handlers
  const send = useCallback(
    (event: FuneralEvent) => {
      console.log(
        "[FuneralServiceForm] Sending event:",
        JSON.stringify(event, null, 2)
      );
      sendRaw(event);
    },
    [sendRaw]
  );

  // Create handlers with minimal dependencies
  const handlers = useFormHandlers(send, mutations, contractId);

  // Log state updates
  useEffect(() => {
    console.log("[FuneralServiceForm] State updated:", {
      currentState: state.value,
      formDataId: formData?.id,
      sectionsCompleted,
      contractState,
      hasActiveContract,
    });
  }, [
    state.value,
    formData?.id,
    sectionsCompleted,
    contractState,
    hasActiveContract,
  ]);

  // Memoize section components with stable references
  const generalSection = useMemo(
    () => (
      <GeneralSection
        initialData={formData.general}
        onSubmit={handlers.handleGeneralSubmit}
      />
    ),
    [formData.general, handlers.handleGeneralSubmit]
  );

  const peopleSection = useMemo(
    () => (
      <PeopleSection
        initialData={formData.people}
        onSubmit={handlers.handlePeopleSubmit}
      />
    ),
    [formData.people, handlers.handlePeopleSubmit]
  );

  const paymentSection = useMemo(
    () => (
      <PaymentSection
        initialData={formData.payment}
        onSubmit={handlers.handlePaymentSubmit}
      />
    ),
    [formData.payment, handlers.handlePaymentSubmit]
  );

  const navigationButtons = useMemo(
    () => (
      <NavigationButtons
        send={send}
        sectionsCompleted={sectionsCompleted}
        currentState={state.value as string}
      />
    ),
    [send, sectionsCompleted, state.value]
  );

  return (
    <div className="container mx-auto p-4 my-12">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Contracts</h2>
          <Button onClick={handlers.handleCreateContract}>
            Create New Contract
          </Button>
        </div>
        <ContractsTable onEditContract={handlers.handleEditContract} />
      </div>

      <div className="border rounded shadow p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Funeral Service Contract</h2>
          {hasActiveContract && (
            <p className="text-sm text-muted-foreground">ID: {formData.id}</p>
          )}
        </div>

        {!hasActiveContract ? (
          <div className="text-center py-8">
            <p className="mb-4">
              No active contract. Create a new one to begin.
            </p>
            <Button onClick={handlers.handleCreateContract}>
              Create New Contract
            </Button>
          </div>
        ) : (
          <>
            {navigationButtons}

            <div className="mt-4">
              {state.matches("general") && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    General Information
                  </h3>
                  {generalSection}
                </div>
              )}
              {state.matches("people") && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    People Information
                  </h3>
                  {peopleSection}
                </div>
              )}
              {state.matches("payment") && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Payment Information
                  </h3>
                  {paymentSection}
                </div>
              )}
              {state.matches("review") && (
                <div className="space-y-6">
                  <div className="border rounded p-4">
                    <h3 className="font-semibold mb-2">General Information</h3>
                    <p>
                      <strong>Client Name:</strong>{" "}
                      {formData.general?.clientName || "-"}
                    </p>
                  </div>

                  <div className="border rounded p-4">
                    <h3 className="font-semibold mb-2">People Information</h3>
                    <p>
                      <strong>Family Members:</strong>{" "}
                      {formData.people?.familyMembers || "-"}
                    </p>
                  </div>

                  <div className="border rounded p-4">
                    <h3 className="font-semibold mb-2">Payment Information</h3>
                    <p>
                      <strong>Payment Method:</strong>{" "}
                      {formData.payment?.paymentMethod || "-"}
                    </p>
                  </div>

                  {contractState === "draft" && (
                    <Button
                      type="button"
                      onClick={() =>
                        handlers.handleContractStateChange("executed")
                      }
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      Execute Contract
                    </Button>
                  )}

                  {contractState === "executed" && (
                    <div className="flex space-x-2">
                      <Button
                        type="button"
                        onClick={() =>
                          handlers.handleContractStateChange("finalized")
                        }
                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                      >
                        Finalize Contract
                      </Button>
                      <Button
                        type="button"
                        onClick={() =>
                          handlers.handleContractStateChange("voided")
                        }
                        className="flex-1 bg-red-600 hover:bg-red-700"
                      >
                        Void Contract
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Debug Information */}
            <pre className="text-xs bg-gray-100 p-2 mt-4 overflow-auto">
              {JSON.stringify(
                {
                  formData,
                  sectionsCompleted,
                  contractState,
                  hasActiveContract,
                  currentState: state.value,
                },
                null,
                2
              )}
            </pre>
          </>
        )}
      </div>
    </div>
  );
});

export default FuneralServiceForm;
