import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useConfirm } from "@/hooks/use-confirm";
import { useNavigate } from "@tanstack/react-router";
import { useActorRef, useSelector } from "@xstate/react";

import { Bug as BugIcon, Loader2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FormProvider, useForm, type UseFormReturn } from "react-hook-form";

import { toast } from "sonner";
import type { ActorRef, SnapshotFrom } from "xstate";
import { useContractMutations } from "../hooks/useContractMutations";
import { useContracts } from "../hooks/useContracts";
import createContractMachine from "../machines/contractMachine";
import type {
	Contract,
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
import {
	FinancingSection,
	type FinancingSectionRef,
} from "./sections/FinancingSection";
import type { FinancingFormValues } from "../forms/schemas/financing-form";
import type { GeneralSectionRef } from "./sections/GeneralSection";
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

// Add type for form names
type FormName = "general" | "buyer" | "beneficiary" | "payment" | "financing";

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
	onFormDirtyChange: (formName: FormName, isDirty: boolean) => void;
}

// Form Section component
const FormSection = ({
	currentState,
	actor,
	formData,
	onEdit,
	generalRef,
	buyerRef,
	beneficiaryRef,
	paymentRef,
	financingRef,
	onFormDirtyChange,
}: FormSectionProps) => {
	const form = useForm({
		defaultValues: formData,
	});

	return (
		<FormProvider {...form}>
			{(() => {
				switch (currentState) {
					case "general":
					case "draft":
						return (
							<GeneralSection
								ref={generalRef}
								actor={actor}
								onDirtyChange={(isDirty) =>
									onFormDirtyChange("general", isDirty)
								}
							/>
						);
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
						return (
							<BuyerSection
								ref={buyerRef}
								actor={actor}
								onDirtyChange={(isDirty) => onFormDirtyChange("buyer", isDirty)}
							/>
						);
					case "beneficiary":
						return (
							<BeneficiarySection
								ref={beneficiaryRef}
								actor={actor}
								onDirtyChange={(isDirty) =>
									onFormDirtyChange("beneficiary", isDirty)
								}
							/>
						);
					case "payment":
						return <PaymentSection ref={paymentRef} actor={actor} />;
					case "financing":
						return (
							<FinancingSection
								ref={financingRef}
								actor={actor}
								onDirtyChange={(isDirty) =>
									onFormDirtyChange("financing", isDirty)
								}
							/>
						);
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
			})()}
		</FormProvider>
	);
};

type ContractMachine = ReturnType<typeof createContractMachine>;
type ContractSnapshot = SnapshotFrom<ContractMachine>;
type ContractActor = ActorRef<ContractSnapshot, ContractEvent>;

// Update selector types
const selectContext = (snapshot: ContractSnapshot) => snapshot.context;
const selectValue = (snapshot: ContractSnapshot) =>
	typeof snapshot.value === "string"
		? snapshot.value
		: Object.keys(snapshot.value)[0];
const selectDraftData = (snapshot: ContractSnapshot) =>
	snapshot.context.draftData;
const selectContractState = (snapshot: ContractSnapshot) =>
	snapshot.context.contractState;
const selectContractId = (snapshot: ContractSnapshot) => snapshot.context.id;

const FuneralServiceForm = ({ initialData }: FuneralServiceFormProps) => {
	const { createMutation, updateMutation } = useContractMutations();
	const { data: contracts, isLoading: isContractsLoading } = useContracts();
	const [isNavigating, setIsNavigating] = useState(false);
	const [formDirtyStates, setFormDirtyStates] = useState<
		Record<FormName, boolean>
	>({
		general: false,
		buyer: false,
		beneficiary: false,
		payment: false,
		financing: false,
	});
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
	const financingFormRef = useRef<FinancingSectionRef | null>(null);

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

	// Replace useMachine with useActorRef and useSelector
	const actor = useActorRef(machine);
	const context = useSelector(actor, selectContext);
	const currentState = useSelector(actor, selectValue) as ContractStateValue;
	const draftData = useSelector(actor, selectDraftData);
	const contractState = useSelector(actor, selectContractState);
	const contractId = useSelector(actor, selectContractId);

	const navigate = useNavigate();

	// Load initial data or sync with latest contract data
	useEffect(() => {
		if (isContractsLoading) {
			return;
		}

		if (initialData && !context.id) {
			actor.send({ type: "LOAD_CONTRACT", data: initialData });
		} else if (context.id && contracts) {
			const currentContract = contracts.find((c) => c.id === context.id);
			if (
				currentContract &&
				currentContract.contractState !== context.contractState
			) {
				actor.send({ type: "LOAD_CONTRACT", data: currentContract });
			}
		}
	}, [
		initialData,
		contracts,
		context.id,
		context.contractState,
		actor,
		isContractsLoading,
	]);

	const handleFormDirtyChange = useCallback(
		(formName: FormName, isDirty: boolean) => {
			setFormDirtyStates((prev) => ({
				...prev,
				[formName]: isDirty,
			}));
		},
		[],
	);

	// Track unsaved changes by checking form dirty states
	const hasUnsavedChanges = useMemo(() => {
		if (isNavigating) {
			return false;
		}

		return Object.values(formDirtyStates).some(Boolean);
	}, [formDirtyStates, isNavigating]);

	const resetFormDirtyStates = useCallback(() => {
		setFormDirtyStates({
			general: false,
			buyer: false,
			beneficiary: false,
			payment: false,
			financing: false,
		});
	}, []);

	const handleMutationSuccess = useCallback(
		(savedContract: Contract) => {
			toast("Changes Saved", {
				description: "Your changes have been saved successfully.",
			});
			resetFormDirtyStates();
			actor.send({ type: "LOAD_CONTRACT", data: savedContract });
		},
		[actor, resetFormDirtyStates],
	);

	const handleSave = useCallback(() => {
		const savedData = { ...draftData };
		const getXStateContext = () => actor.getSnapshot().context.draftData;

		// Save each form section
		if (generalFormRef.current?.save) {
			generalFormRef.current.save();
			savedData.general = getXStateContext().general;
		}
		if (buyerFormRef.current?.save) {
			buyerFormRef.current.save();
			savedData.buyer = getXStateContext().buyer;
		}
		if (beneficiaryFormRef.current?.save) {
			beneficiaryFormRef.current.save();
			savedData.beneficiary = getXStateContext().beneficiary;
		}
		if (paymentFormRef.current?.save) {
			paymentFormRef.current.save();
			savedData.payment = getXStateContext().payment;
		}
		if (financingFormRef.current?.save) {
			financingFormRef.current.save();
			savedData.financing = getXStateContext().financing;
		}

		if (
			!savedData.general &&
			!savedData.buyer &&
			!savedData.payment &&
			!savedData.beneficiary
		) {
			toast("Cannot Save Empty Form", {
				description: "Please fill out at least one section before saving.",
			});
			return;
		}

		const contractData = {
			id: contractId || crypto.randomUUID(),
			contractState: contractState || "draft",
			formData: savedData,
		} as Contract;

		try {
			if (contractId) {
				updateMutation.mutate(contractData, {
					onSuccess: handleMutationSuccess,
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
				setIsNavigating(true);
				createMutation.mutate(newContractData, {
					onSuccess: (savedContract) => {
						handleMutationSuccess(savedContract);
						navigate({
							to: "/test/$contractId",
							params: { contractId: savedContract.id },
						});
					},
					onError: (error) => {
						setIsNavigating(false);
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
			setIsNavigating(false);
			toast("Error", {
				description: "An unexpected error occurred. Please try again.",
			});
		}
	}, [
		draftData,
		contractId,
		contractState,
		createMutation,
		updateMutation,
		actor,
		navigate,
		handleMutationSuccess,
	]);

	const getEffectiveContractState = useCallback(() => {
		if (updateMutation.isPending && updateMutation.variables?.contractState) {
			return updateMutation.variables.contractState;
		}

		if (contractId && contracts) {
			const currentContract = contracts.find((c) => c.id === contractId);
			if (currentContract) {
				return currentContract.contractState;
			}
		}

		return contractState || "draft";
	}, [
		updateMutation.isPending,
		updateMutation.variables,
		contractId,
		contracts,
		contractState,
	]);

	const effectiveState = getEffectiveContractState();

	// Replace state.context references with selected values
	const handleExecute = useCallback(() => {
		const contractData = {
			id: contractId || crypto.randomUUID(),
			contractState: "executed" as ContractState,
			formData: draftData,
		};

		if (contractId) {
			updateMutation.mutate(contractData, {
				onSuccess: () => actor.send({ type: "EXECUTE" }),
			});
		} else {
			const { id: _, ...newContractData } = contractData;
			createMutation.mutate(newContractData, {
				onSuccess: () => actor.send({ type: "EXECUTE" }),
			});
		}
	}, [draftData, contractId, createMutation, updateMutation, actor]);

	const handleFinalize = useCallback(() => {
		const contractData = {
			id: contractId || crypto.randomUUID(),
			contractState: "finalized" as ContractState,
			formData: draftData,
		};

		if (contractId) {
			updateMutation.mutate(contractData, {
				onSuccess: () => actor.send({ type: "FINALIZE" }),
			});
		}
	}, [draftData, contractId, updateMutation, actor]);

	const handleVoid = useCallback(() => {
		const contractData = {
			id: contractId || crypto.randomUUID(),
			contractState: "void" as ContractState,
			formData: draftData,
		};

		if (contractId) {
			updateMutation.mutate(contractData, {
				onSuccess: () => actor.send({ type: "VOID" }),
			});
		}
	}, [draftData, contractId, updateMutation, actor]);

	const handleEdit = useCallback(
		(section: ReviewSectionType) => {
			actor.send({ type: SECTION_MAP[section as keyof typeof SECTION_MAP] });
		},
		[actor],
	);

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
			actor.send({ type: SECTION_MAP[value as keyof typeof SECTION_MAP] });
			// Add a smaller delay before allowing unsaved changes to show
			setTimeout(() => setIsNavigating(false), 50);
		},
		[actor],
	);

	// Simplify form state collection
	const collectDebugData = useCallback(() => {
		interface FormState {
			type: "form";
			values: unknown;
			isDirty: boolean;
			formState: { isDirty: boolean };
		}

		const formStates: Record<string, FormState> = {};

		for (const [key, value] of Object.entries(FORM_KEYS)) {
			const ref = {
				[FORM_KEYS.GENERAL]: generalFormRef,
				[FORM_KEYS.BUYER]: buyerFormRef,
				[FORM_KEYS.BENEFICIARY]: beneficiaryFormRef,
				[FORM_KEYS.PAYMENT]: paymentFormRef,
				[FORM_KEYS.FINANCING]: financingFormRef,
			}[value];

			if (ref?.current?.form) {
				formStates[key] = {
					type: "form",
					values: ref.current.form.getValues(),
					isDirty: ref.current.isDirty,
					formState: { isDirty: ref.current.isDirty },
				};
			}
		}

		setDebugData({
			xstateContext: context,
			rhfForms: {
				...formStates,
				root: {
					type: "root",
					values: draftData as unknown as Record<string, unknown>,
					formDirtyStates,
					hasUnsavedChanges,
					isNavigating,
				},
			},
		});
		openDebugSheet();
	}, [
		context,
		draftData,
		formDirtyStates,
		hasUnsavedChanges,
		isNavigating,
		setDebugData,
		openDebugSheet,
	]);

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
							formData={draftData}
							onEdit={handleEdit}
							status={currentState}
							generalRef={generalFormRef}
							buyerRef={buyerFormRef}
							beneficiaryRef={beneficiaryFormRef}
							paymentRef={paymentFormRef}
							financingRef={financingFormRef}
							onFormDirtyChange={handleFormDirtyChange}
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
