import { useMachine } from "@xstate/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFuneralContractMachine } from "./funeralContractMachine";
import {
  useFuneralContractStore,
  useSaveContract,
  useUpdateContractState,
} from "./useFuneralContractStore";
import type { FuneralContractFormData, FuneralContract } from "./types";
import { z } from "zod";
import {
  Form as FormProvider,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useMemo } from "react";
import ContractsTable from "./ContractsTable";

const schema = z.object({
  general: z
    .object({
      clientName: z
        .string()
        .min(2, "Client name is required")
        .or(z.literal("")),
    })
    .optional(),
  people: z
    .object({
      familyMembers: z
        .string()
        .min(3, "At least one family member is required")
        .or(z.literal("")),
    })
    .optional(),
  payment: z
    .object({
      paymentMethod: z.enum(["cash", "credit"]),
    })
    .optional(),
});

const FuneralServiceForm = () => {
  const {
    formData,
    sectionsCompleted,
    contractId,
    setFormData,
    contractState,
    setContractState,
    setContractId,
    setSectionsCompleted,
  } = useFuneralContractStore();

  // Create machine with initial context
  const machine = useMemo(
    () =>
      createFuneralContractMachine({
        formData,
        sectionsCompleted,
        contractState,
      }),
    [formData, sectionsCompleted, contractState]
  );

  const [state, send] = useMachine(machine, {
    input: { type: undefined as never },
  });

  // Sync state machine with store changes
  useEffect(() => {
    console.log("Syncing state machine with store:", {
      formData,
      sectionsCompleted,
      contractState,
    });

    // Update state machine context with current store state
    if (sectionsCompleted.general) {
      send({ type: "SAVE_GENERAL", data: formData });
    }
    if (sectionsCompleted.people) {
      send({ type: "SAVE_PEOPLE", data: formData });
    }
    if (sectionsCompleted.payment) {
      send({ type: "SAVE_PAYMENT", data: formData });
    }

    // Navigate to appropriate section based on completion
    if (
      sectionsCompleted.general &&
      sectionsCompleted.people &&
      sectionsCompleted.payment
    ) {
      send({ type: "GO_TO_REVIEW" });
    } else if (sectionsCompleted.general && sectionsCompleted.people) {
      send({ type: "GO_TO_PAYMENT" });
    } else if (sectionsCompleted.general) {
      send({ type: "GO_TO_PEOPLE" });
    } else {
      send({ type: "GO_TO_GENERAL" });
    }
  }, [formData, sectionsCompleted, contractState, send]);

  const saveContractMutation = useSaveContract();
  const updateContractStateMutation = useUpdateContractState();

  const form = useForm<FuneralContractFormData>({
    resolver: zodResolver(schema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {
      general: formData.general ?? { clientName: "" },
      people: formData.people ?? { familyMembers: "" },
      payment: formData.payment ?? { paymentMethod: "cash" },
    },
  });

  // Update form values when formData changes
  useEffect(() => {
    form.reset({
      general: formData.general ?? { clientName: "" },
      people: formData.people ?? { familyMembers: "" },
      payment: formData.payment ?? { paymentMethod: "cash" },
    });
  }, [formData, form]);

  // Debug effect to log state changes
  useEffect(() => {
    console.log("State machine state changed:", {
      value: state.value,
      context: state.context,
    });
  }, [state]);

  const onSubmit = async (data: FuneralContractFormData) => {
    const currentSection = state.value as keyof FuneralContractFormData;
    console.log("Form submitted:", { currentSection, data });

    try {
      // First update the local state
      const sectionData = data[currentSection];
      if (sectionData) {
        setFormData(currentSection, sectionData);

        // Prepare the updated form data
        const updatedFormData: FuneralContractFormData = {
          ...formData,
          [currentSection]: sectionData,
        };

        // Update sections completed
        const updatedSectionsCompleted = {
          ...sectionsCompleted,
          [currentSection]: true,
        };

        // Update local sections completed state
        setSectionsCompleted(updatedSectionsCompleted);

        // Then save to the backend
        const savedContract = await saveContractMutation.mutateAsync({
          ...(contractId ? { id: contractId } : {}),
          formData: updatedFormData,
          contractState,
          sectionsCompleted: updatedSectionsCompleted,
        } as FuneralContract);

        console.log("Saved contract:", savedContract);

        if (savedContract.id) {
          setContractId(savedContract.id);
        }

        // Finally update the state machine
        if (currentSection === "general") {
          send({ type: "SAVE_GENERAL", data: updatedFormData });
          if (updatedSectionsCompleted.general) {
            send({ type: "GO_TO_PEOPLE" });
          }
        } else if (currentSection === "people") {
          send({ type: "SAVE_PEOPLE", data: updatedFormData });
          if (
            updatedSectionsCompleted.general &&
            updatedSectionsCompleted.people
          ) {
            send({ type: "GO_TO_PAYMENT" });
          }
        } else if (currentSection === "payment") {
          send({ type: "SAVE_PAYMENT", data: updatedFormData });
          if (
            updatedSectionsCompleted.general &&
            updatedSectionsCompleted.people &&
            updatedSectionsCompleted.payment
          ) {
            send({ type: "GO_TO_REVIEW" });
          }
        }
      }
    } catch (error) {
      console.error("Error saving contract:", error);
    }
  };

  const handleExecuteContract = async () => {
    if (contractId) {
      try {
        const updatedContract = await updateContractStateMutation.mutateAsync({
          contractId,
          contractState: "executed",
        });
        console.log("Contract executed:", updatedContract);
        setContractState("executed");
        send({ type: "EXECUTE" });
      } catch (error) {
        console.error("Error executing contract:", error);
      }
    }
  };

  const handleFinalizeContract = async () => {
    if (contractId) {
      try {
        const updatedContract = await updateContractStateMutation.mutateAsync({
          contractId,
          contractState: "finalized",
        });
        console.log("Contract finalized:", updatedContract);
        setContractState("finalized");
        send({ type: "FINALIZE" });
      } catch (error) {
        console.error("Error finalizing contract:", error);
      }
    }
  };

  const handleVoidContract = async () => {
    if (contractId) {
      try {
        const updatedContract = await updateContractStateMutation.mutateAsync({
          contractId,
          contractState: "voided",
        });
        console.log("Contract voided:", updatedContract);
        setContractState("voided");
        send({ type: "VOID" });
      } catch (error) {
        console.error("Error voiding contract:", error);
      }
    }
  };

  const handleCreateContract = async () => {
    try {
      const newContract = await saveContractMutation.mutateAsync({
        formData: {},
        contractState: "draft",
        sectionsCompleted: {
          general: false,
          people: false,
          payment: false,
        },
      });

      if (newContract.id) {
        setContractId(newContract.id);
        send({ type: "GO_TO_GENERAL" });
        console.log("Created new contract:", newContract);
      }
    } catch (error) {
      console.error("Error creating contract:", error);
    }
  };

  return (
    <div className="container mx-auto p-4 my-12">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Contracts</h2>
          <Button onClick={handleCreateContract}>Create New Contract</Button>
        </div>
        <ContractsTable />
      </div>
      <div className="border rounded shadow p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Funeral Service Contract</h2>
        </div>

        {!contractId ? (
          <div className="text-center py-8">
            <p className="mb-4">
              No active contract. Create a new one to begin.
            </p>
            <Button onClick={handleCreateContract}>Create New Contract</Button>
          </div>
        ) : (
          <>
            <p className="mb-2 text-sm">
              Current Section: <strong>{state.value}</strong>
            </p>

            {/* Section Navigation */}
            <div className="flex space-x-2 mb-4">
              <Button
                onClick={() => send({ type: "GO_TO_GENERAL" })}
                variant={state.matches("general") ? "default" : "outline"}
              >
                General Info {sectionsCompleted.general ? "✔" : ""}
              </Button>
              <Button
                onClick={() => send({ type: "GO_TO_PEOPLE" })}
                variant={state.matches("people") ? "default" : "outline"}
              >
                People {sectionsCompleted.people ? "✔" : ""}
              </Button>
              <Button
                onClick={() =>
                  sectionsCompleted.people
                    ? send({ type: "GO_TO_PAYMENT" })
                    : null
                }
                variant={state.matches("payment") ? "default" : "outline"}
                disabled={!sectionsCompleted.people}
              >
                Payment {sectionsCompleted.payment ? "✔" : ""}
              </Button>
              {sectionsCompleted.general &&
                sectionsCompleted.people &&
                sectionsCompleted.payment && (
                  <Button
                    onClick={() => {
                      console.log("Review button clicked", {
                        sectionsCompleted,
                        currentState: state.value,
                        context: state.context,
                        formData,
                      });
                      // First ensure the state machine has the latest data
                      send({
                        type: "SAVE_GENERAL",
                        data: formData,
                      });
                      send({
                        type: "SAVE_PEOPLE",
                        data: formData,
                      });
                      send({
                        type: "SAVE_PAYMENT",
                        data: formData,
                      });
                      // Then try to navigate to review
                      setTimeout(() => {
                        send({ type: "GO_TO_REVIEW" });
                      }, 0);
                    }}
                    variant={state.matches("review") ? "default" : "outline"}
                  >
                    Review Contract
                  </Button>
                )}
            </div>

            {/* Restrict Payment Access */}
            {!sectionsCompleted.people && state.value === "payment" && (
              <p className="text-red-500 mb-4">
                Complete the People section before proceeding to Payment.
              </p>
            )}

            <FormProvider {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                {/* General Info Form */}
                {state.matches("general") && (
                  <FormField
                    control={form.control}
                    name="general.clientName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Client Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Enter client name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* People Form */}
                {state.matches("people") && (
                  <FormField
                    control={form.control}
                    name="people.familyMembers"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Family Members</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter names separated by commas"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* Payment Form */}
                {state.matches("payment") && sectionsCompleted.people && (
                  <FormField
                    control={form.control}
                    name="payment.paymentMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payment Method</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select payment method" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="cash">Cash</SelectItem>
                            <SelectItem value="credit">Credit Card</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* Review Section */}
                {state.matches("review") && (
                  <div className="space-y-6">
                    <div className="border rounded p-4">
                      <h3 className="font-semibold mb-2">
                        General Information
                      </h3>
                      <p>
                        <strong>Client Name:</strong>{" "}
                        {formData.general?.clientName}
                      </p>
                    </div>

                    <div className="border rounded p-4">
                      <h3 className="font-semibold mb-2">People Information</h3>
                      <p>
                        <strong>Family Members:</strong>{" "}
                        {formData.people?.familyMembers}
                      </p>
                    </div>

                    <div className="border rounded p-4">
                      <h3 className="font-semibold mb-2">
                        Payment Information
                      </h3>
                      <p>
                        <strong>Payment Method:</strong>{" "}
                        {formData.payment?.paymentMethod}
                      </p>
                    </div>

                    {contractState === "draft" && (
                      <Button
                        type="button"
                        onClick={handleExecuteContract}
                        className="w-full bg-green-600 hover:bg-green-700"
                      >
                        Execute Contract
                      </Button>
                    )}

                    {contractState === "executed" && (
                      <div className="flex space-x-2">
                        <Button
                          type="button"
                          onClick={handleFinalizeContract}
                          className="flex-1 bg-blue-600 hover:bg-blue-700"
                        >
                          Finalize Contract
                        </Button>
                        <Button
                          type="button"
                          onClick={handleVoidContract}
                          className="flex-1 bg-red-600 hover:bg-red-700"
                        >
                          Void Contract
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {/* Save Button - Only show if not in review state */}
                {!state.matches("review") && (
                  <Button type="submit" className="mt-4 bg-blue-500">
                    Save Section
                  </Button>
                )}
              </form>
            </FormProvider>
          </>
        )}

        {/* Debug Information */}
        <pre className="text-xs bg-gray-100 p-2 mt-4 mb-4 overflow-auto">
          {JSON.stringify(
            {
              formData,
              sectionsCompleted,
              contractState,
              contractId,
              currentState: state.value,
            },
            null,
            2
          )}
        </pre>
      </div>
    </div>
  );
};

export default FuneralServiceForm;
