import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useConfirm } from "@/hooks/use-confirm";
import { useNavigate } from "@tanstack/react-router";
import { useMachine } from "@xstate/react";
import { produce } from "immer";
import { Loader2 } from "lucide-react";
import { BugIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { FieldValues } from "react-hook-form";
import { toast } from "sonner";
import type { ActorRef, SnapshotFrom } from "xstate";
import { useContractMutations } from "../hooks/useContractMutations";
import { useContracts } from "../hooks/useContracts";
import createContractMachine from "../machines/contractMachine";
import type {
	Contract,
	ContractContext,
	ContractEvent,
	ContractState,
	FormData,
	ReviewSectionType,
} from "../types/contract";
import DebugSheet, { useDebugSheet } from "./DebugSheet";
import {
	type BeneficiaryRef,
	BeneficiarySection,
} from "./sections/BeneficiarySection";
import { BuyerSection, type BuyerSectionRef } from "./sections/BuyerSection";
import FinancingSection, {
	type FinancingSectionRef,
} from "./sections/FinancingSection";
import type {
	GeneralFormValues,
	GeneralSectionRef,
} from "./sections/GeneralSection";
import GeneralSection from "./sections/GeneralSection";
import PaymentSection, {
	type PaymentSectionRef,
} from "./sections/PaymentSection";
import PeopleSection from "./sections/PeopleSection";
import ReviewSection from "./sections/ReviewSection";

export interface FuneralServiceFormProps {
	onComplete?: () => void;
	initialData?: Contract | undefined;
}

const STATE_STYLES = {
	draft: { variant: "outline", className: "" },
	executed: {
		variant: "default",
		className: "bg-blue-500 text-white hover:bg-blue-600",
	},
	void: { variant: "destructive", className: "bg-red-500 hover:bg-red-600" },
	finalized: {
		variant: "default",
		className: "bg-green-500 hover:bg-green-600",
	},
} as const;

const SECTION_MAP = {
	general: "GO_TO_GENERAL",
	people: "GO_TO_PEOPLE",
	buyer: "GO_TO_BUYER",
	beneficiary: "GO_TO_BENEFICIARY",
	payment: "GO_TO_PAYMENT",
	financing: "GO_TO_FINANCING",
	review: "GO_TO_REVIEW",
} as const;

type ContractStateValue =
	| "draft"
	| "executed"
	| "finalized"
	| "void"
	| "people"
	| "buyer"
	| "beneficiary"
	| "payment"
	| "financing"
	| "review"
	| "general";

const FORM_KEYS = {
	GENERAL: "general",
	BUYER: "buyer",
	BENEFICIARY: "beneficiary",
	PAYMENT: "payment",
	FINANCING: "financing",
} as const;

// Memoized Badge component
const ContractStateBadge = ({
	state,
	isPending,
}: {
	state: ContractState | "draft";
	isPending: boolean;
}) => {
	const styles = STATE_STYLES[state];
	return (
		<Badge variant={styles.variant} className={styles.className}>
			<span className="flex items-center gap-2">
				{isPending && <Loader2 className="h-3 w-3 animate-spin" />}
				{state.toUpperCase()}
			</span>
		</Badge>
	);
};

ContractStateBadge.displayName = "ContractStateBadge";

// Memoized Action Buttons component
const ActionButtons = ({
	state,
	onExecute,
	onVoid,
	onFinalize,
}: {
	state: ContractState | "draft";
	onExecute: () => void;
	onVoid: () => void;
	onFinalize: () => void;
}) => {
	switch (state) {
		case "draft":
			return <Button onClick={onExecute}>Execute Contract</Button>;
		case "executed":
			return (
				<>
					<Button onClick={onVoid}>Void Contract</Button>
					<Button onClick={onFinalize}>Finalize Contract</Button>
				</>
			);
		default:
			return null;
	}
};

ActionButtons.displayName = "ActionButtons";

// Form Section component
interface FormSectionProps {
	currentState: ContractStateValue;
	actor: ContractActor;
	formData: FormData;
	onEdit?: (section: ReviewSectionType) => void;
	status?: ContractStateValue;
	generalRef?: React.RefObject<GeneralSectionRef | null>;
	buyerRef?: React.RefObject<BuyerSectionRef | null>;
	beneficiaryRef?: React.RefObject<BeneficiaryRef | null>;
	paymentRef?: React.RefObject<PaymentSectionRef | null>;
	financingRef?: React.RefObject<FinancingSectionRef | null>;
}

const FormSection = ({
	currentState,
	actor,
	formData,
	onEdit,
	status,
	generalRef,
	buyerRef,
	beneficiaryRef,
	paymentRef,
	financingRef,
}: FormSectionProps) => {
	switch (currentState) {
		case "general":
		case "draft":
			return <GeneralSection ref={generalRef} actor={actor} />;
		case "people":
			return (
				<PeopleSection
					actor={actor}
					currentState={currentState}
					buyer={formData.buyer}
					beneficiary={formData.beneficiary}
					onSelect={(section) => {
						if (onEdit) onEdit(section);
					}}
				/>
			);
		case "buyer":
			return <BuyerSection ref={buyerRef} actor={actor} />;
		case "beneficiary":
			return <BeneficiarySection ref={beneficiaryRef} actor={actor} />;
		case "payment":
			return <PaymentSection ref={paymentRef} actor={actor} />;
		case "financing":
			return <FinancingSection ref={financingRef} actor={actor} />;
		case "review":
			return (
				<ReviewSection
					generalData={formData.general}
					buyerData={formData.buyer}
					paymentData={formData.payment}
					financingData={formData.financing}
					beneficiaryData={formData.beneficiary}
					onEdit={onEdit || (() => {})}
				/>
			);
		case "executed":
			return (
				<ReviewSection
					generalData={formData.general}
					buyerData={formData.buyer}
					paymentData={formData.payment}
					financingData={formData.financing}
					beneficiaryData={formData.beneficiary}
					readOnly
				/>
			);
		case "finalized":
		case "void":
			return (
				<ReviewSection
					generalData={formData.general}
					buyerData={formData.buyer}
					paymentData={formData.payment}
					financingData={formData.financing}
					beneficiaryData={formData.beneficiary}
					readOnly
					{...(currentState === "finalized" || currentState === "void"
						? { status: currentState }
						: {})}
				/>
			);
		default:
			return null;
	}
};

type ContractMachine = ReturnType<typeof createContractMachine>;
type ContractSnapshot = SnapshotFrom<ContractMachine> & {
	context: ContractContext;
	value: ContractStateValue | { [key: string]: ContractStateValue };
};
type ContractActor = ActorRef<ContractSnapshot, ContractEvent>;
type ContractSend = (event: ContractEvent) => void;

const FuneralServiceForm = ({ initialData }: FuneralServiceFormProps) => {
	const { createMutation, updateMutation } = useContractMutations();
	const { data: contracts, isLoading: isContractsLoading } = useContracts();
	const [isInitialLoad, setIsInitialLoad] = useState(true);
	const [isNavigating, setIsNavigating] = useState(false);
	const ConfirmDialog = useConfirm(
		"Unsaved Changes",
		"You have unsaved changes. Are you sure you want to continue?",
		() => hasUnsavedChanges,
	);
	const { onOpen: openDebugSheet, setData: setDebugData } = useDebugSheet();
	const generalFormRef = useRef<GeneralSectionRef>(null);
	const buyerFormRef = useRef<BuyerSectionRef>(null);
	const beneficiaryFormRef = useRef<BeneficiaryRef>(null);
	const paymentFormRef = useRef<PaymentSectionRef>(null);
	const financingFormRef = useRef<FinancingSectionRef>(null);

	// Use ref for stable machine config
	const mutationsRef = useRef({ createMutation, updateMutation });
	useEffect(() => {
		mutationsRef.current = { createMutation, updateMutation };
	}, [createMutation, updateMutation]);

	// Create machine once
	const machine = useMemo(
		() =>
			createContractMachine({
				mutations: {
					get createMutation() {
						return mutationsRef.current.createMutation;
					},
					get updateMutation() {
						return mutationsRef.current.updateMutation;
					},
				},
			}),
		[],
	);

	const [state, send, actor] = useMachine(machine) as [
		ContractSnapshot,
		ContractSend,
		ContractActor,
	];

	const navigate = useNavigate();

	// Memoize the contract comparison function using Immer
	const compareContracts = useCallback((a: FormData, b: FormData) => {
		return (
			JSON.stringify(produce(a, () => a)) ===
			JSON.stringify(produce(b, () => b))
		);
	}, []);

	// Load initial data or sync with latest contract data
	useEffect(() => {
		if (isContractsLoading) {
			return;
		}

		if (initialData && !state.context.id) {
			send({ type: "LOAD_CONTRACT", data: initialData });
			// Delay setting initial load to false to ensure state is updated
			setTimeout(() => setIsInitialLoad(false), 100);
		} else if (state.context.id && contracts) {
			const currentContract = contracts.find((c) => c.id === state.context.id);
			if (
				currentContract &&
				currentContract.contractState !== state.context.contractState
			) {
				send({ type: "LOAD_CONTRACT", data: currentContract });
			}
			setTimeout(() => setIsInitialLoad(false), 100);
		} else if (!initialData && !state.context.id) {
			setTimeout(() => setIsInitialLoad(false), 100);
		}
	}, [
		initialData,
		contracts,
		state.context.id,
		state.context.contractState,
		send,
		isContractsLoading,
	]);

	// Track unsaved changes by comparing current form data with saved contract
	const hasUnsavedChanges = useMemo(() => {
		if (
			isInitialLoad ||
			isContractsLoading ||
			createMutation.isPending ||
			updateMutation.isPending ||
			isNavigating
		) {
			return false;
		}

		const currentContract =
			state.context.id && contracts
				? contracts.find((c) => c.id === state.context.id)
				: null;

		if (!currentContract) {
			return Object.values(state.context.draftData).some(
				(section) => section !== null,
			);
		}

		return !compareContracts(state.context.draftData, currentContract.formData);
	}, [
		isInitialLoad,
		isContractsLoading,
		state.context.id,
		state.context.draftData,
		contracts,
		createMutation.isPending,
		updateMutation.isPending,
		compareContracts,
		isNavigating,
	]);

	// Use Immer for state updates in handlers
	const handleSave = useCallback(() => {
		const { draftData, id, contractState } = state.context;

		// Allow saving if at least one section is filled out
		if (
			!draftData.general &&
			!draftData.buyer &&
			!draftData.payment &&
			!draftData.beneficiary
		) {
			toast("Cannot Save Empty Form", {
				description: "Please fill out at least one section before saving.",
			});
			return;
		}

		const nextId = id || crypto.randomUUID();
		const contractData = produce(
			{
				id: nextId,
				contractState: contractState || "draft",
				formData: draftData,
			} as Contract,
			(draft) => draft,
		);

		try {
			if (id) {
				updateMutation.mutate(contractData, {
					onSuccess: (savedContract) => {
						toast("Changes Saved", {
							description: "Your changes have been saved successfully.",
						});
						// Update the contract state to match the saved data
						send({ type: "LOAD_CONTRACT", data: savedContract });
					},
					onError: (error) => {
						toast("Error Saving Changes", {
							description:
								error instanceof Error
									? error.message
									: "An error occurred while saving",
						});
					},
				});
			} else {
				const { id: _, ...newContractData } = contractData;
				createMutation.mutate(newContractData, {
					onSuccess: (savedContract) => {
						toast("Contract Created", {
							description: "Your contract has been created successfully.",
						});
						// Update the contract state to match the saved data
						send({ type: "LOAD_CONTRACT", data: savedContract });
						// Navigate to the new contract's route
						navigate({
							to: "/test/$contractId",
							params: { contractId: savedContract.id },
						});
					},
					onError: (error) => {
						toast("Error Creating Contract", {
							description:
								error instanceof Error
									? error.message
									: "An error occurred while creating the contract",
						});
					},
				});
			}
		} catch (error) {
			console.error("Error in handleSave:", error);
			toast("Error", {
				description: "An unexpected error occurred. Please try again.",
			});
		}
	}, [state.context, createMutation, updateMutation, send, navigate]);

	const getEffectiveContractState = useCallback(() => {
		if (updateMutation.isPending && updateMutation.variables?.contractState) {
			return updateMutation.variables.contractState;
		}

		if (state.context.id && contracts) {
			const currentContract = contracts.find((c) => c.id === state.context.id);
			if (currentContract) {
				return currentContract.contractState;
			}
		}

		return state.context.contractState || "draft";
	}, [
		updateMutation.isPending,
		updateMutation.variables,
		state.context,
		contracts,
	]);

	const effectiveState = getEffectiveContractState();

	const handleExecute = useCallback(() => {
		const contractData = {
			id: state.context.id || crypto.randomUUID(),
			contractState: "executed" as ContractState,
			formData: state.context.draftData,
		};

		if (state.context.id) {
			updateMutation.mutate(contractData, {
				onSuccess: () => send({ type: "EXECUTE" }),
			});
		} else {
			const { id: _, ...newContractData } = contractData;
			createMutation.mutate(newContractData, {
				onSuccess: () => send({ type: "EXECUTE" }),
			});
		}
	}, [send, state.context, createMutation, updateMutation]);

	const handleFinalize = useCallback(() => {
		const contractData = {
			id: state.context.id || crypto.randomUUID(),
			contractState: "finalized" as ContractState,
			formData: state.context.draftData,
		};

		if (state.context.id) {
			updateMutation.mutate(contractData, {
				onSuccess: () => send({ type: "FINALIZE" }),
			});
		}
	}, [send, state.context, updateMutation]);

	const handleVoid = useCallback(() => {
		const contractData = {
			id: state.context.id || crypto.randomUUID(),
			contractState: "void" as ContractState,
			formData: state.context.draftData,
		};

		if (state.context.id) {
			updateMutation.mutate(contractData, {
				onSuccess: () => send({ type: "VOID" }),
			});
		}
	}, [send, state.context, updateMutation]);

	const handleEdit = useCallback(
		(section: ReviewSectionType) => {
			send({ type: SECTION_MAP[section as keyof typeof SECTION_MAP] });
		},
		[send],
	);

	const currentState = (
		typeof state.value === "string" ? state.value : Object.keys(state.value)[0]
	) as ContractStateValue;

	const tabValue = (
		currentState === "draft" ? "general" : currentState
	) as string;

	// Handle browser's native beforeunload event
	useEffect(() => {
		const handleBeforeUnload = (e: BeforeUnloadEvent) => {
			if (hasUnsavedChanges) {
				e.preventDefault();
				e.returnValue = "";
			}
		};

		window.addEventListener("beforeunload", handleBeforeUnload);
		return () => window.removeEventListener("beforeunload", handleBeforeUnload);
	}, [hasUnsavedChanges]);

	const handleTabChange = useCallback(
		async (value: string) => {
			setIsNavigating(true);
			send({ type: SECTION_MAP[value as keyof typeof SECTION_MAP] });
			// Add a small delay before allowing unsaved changes to show
			setTimeout(() => setIsNavigating(false), 100);
		},
		[send],
	);

	// Function to collect form states
	const collectDebugData = useCallback(() => {
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		const formStates: Record<string, UseFormReturn<any>> = {};

		if (generalFormRef.current?.form) {
			formStates[FORM_KEYS.GENERAL] = generalFormRef.current.form;
		}
		if (buyerFormRef.current?.form) {
			formStates[FORM_KEYS.BUYER] = buyerFormRef.current.form;
		}
		if (beneficiaryFormRef.current?.form) {
			formStates[FORM_KEYS.BENEFICIARY] = beneficiaryFormRef.current.form;
		}
		if (paymentFormRef.current?.form) {
			formStates[FORM_KEYS.PAYMENT] = paymentFormRef.current.form;
		}
		if (financingFormRef.current?.form) {
			formStates[FORM_KEYS.FINANCING] = financingFormRef.current.form;
		}

		setDebugData({
			xstateContext: state.context,
			rhfForms: formStates,
		});
		openDebugSheet();
	}, [state.context, setDebugData, openDebugSheet]);

	return (
		<>
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between p-4 border-b">
						<div className="flex items-center gap-4">
							<Button
								variant="outline"
								onClick={() => {
									setIsNavigating(true);
									navigate({ to: "/test" });
								}}
							>
								Back to Test
							</Button>
							<Button
								variant="outline"
								size="icon"
								onClick={collectDebugData}
								title="Debug Information"
							>
								<BugIcon className="h-4 w-4" />
							</Button>
							<div className="w-[120px]">
								{hasUnsavedChanges && (
									<Badge
										variant="secondary"
										className="bg-yellow-100 text-yellow-800"
									>
										Unsaved Changes
									</Badge>
								)}
							</div>
						</div>
						<div className="flex items-center gap-2">
							<Button
								onClick={handleSave}
								disabled={
									!hasUnsavedChanges ||
									createMutation.isPending ||
									updateMutation.isPending
								}
							>
								Save Changes
							</Button>
							<ActionButtons
								state={effectiveState}
								onExecute={handleExecute}
								onVoid={handleVoid}
								onFinalize={handleFinalize}
							/>
							<ContractStateBadge
								state={effectiveState}
								isPending={updateMutation.isPending}
							/>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						<div>
							<Tabs value={tabValue} onValueChange={handleTabChange}>
								<TabsList>
									<TabsTrigger value="general">General</TabsTrigger>
									<TabsTrigger value="people">People</TabsTrigger>
									<TabsTrigger value="buyer">Buyer</TabsTrigger>
									<TabsTrigger value="beneficiary">Beneficiary</TabsTrigger>
									<TabsTrigger value="payment">Payment</TabsTrigger>
									<TabsTrigger value="financing">Financing</TabsTrigger>
									<TabsTrigger value="review">Review</TabsTrigger>
								</TabsList>
							</Tabs>
						</div>
						<FormSection
							currentState={currentState}
							actor={actor}
							formData={state.context.draftData}
							onEdit={handleEdit}
							status={currentState}
							generalRef={generalFormRef}
							buyerRef={buyerFormRef}
							beneficiaryRef={beneficiaryFormRef}
							paymentRef={paymentFormRef}
							financingRef={financingFormRef}
						/>
					</div>
				</CardContent>
			</Card>
			<ConfirmDialog />
			<DebugSheet />
		</>
	);
};

FuneralServiceForm.displayName = "FuneralServiceForm";

export default FuneralServiceForm;
