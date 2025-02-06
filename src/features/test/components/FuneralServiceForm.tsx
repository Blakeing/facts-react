import { useMachine } from "@xstate/react";
import { memo, useCallback, useEffect, useMemo, useRef } from "react";
import createContractMachine from "../machines/contractMachine";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import GeneralSection from "./sections/GeneralSection";
import PeopleSection from "./sections/PeopleSection";
import PaymentSection from "./sections/PaymentSection";
import ReviewSection from "./sections/ReviewSection";
import { useContractMutations } from "../hooks/useContractMutations";
import type {
	Contract,
	ContractState,
	FormData,
	ContractContext,
	ContractEvent,
} from "../types/contract";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { useContracts } from "../hooks/useContracts";
import type { ActorRef, SnapshotFrom } from "xstate";
import { produce } from "immer";

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
	payment: "GO_TO_PAYMENT",
	review: "GO_TO_REVIEW",
} as const;

type ReviewSectionType = "people" | "payment" | "general";
type ContractStateValue =
	| "draft"
	| "executed"
	| "finalized"
	| "void"
	| "people"
	| "payment"
	| "review";

// Memoized Badge component
const ContractStateBadge = memo(
	({
		state,
		isPending,
	}: {
		state: ContractState | "draft";
		isPending: boolean;
	}) => {
		const styles = STATE_STYLES[state];
		return (
			<Badge variant={styles.variant} className={styles.className}>
				<div className="flex items-center gap-2">
					{isPending && <Loader2 className="h-3 w-3 animate-spin" />}
					{state.toUpperCase()}
				</div>
			</Badge>
		);
	},
);

ContractStateBadge.displayName = "ContractStateBadge";

// Memoized Action Buttons component
const ActionButtons = memo(
	({
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
	},
);

ActionButtons.displayName = "ActionButtons";

// Memoized Form Section component
const FormSection = memo(
	({
		currentState,
		actor,
		formData,
		onEdit,
		status,
	}: {
		currentState: ContractStateValue;
		actor: ContractActor;
		formData: FormData;
		onEdit?: (section: ReviewSectionType) => void;
		status?: ContractStateValue;
	}) => {
		switch (currentState) {
			case "draft":
				return <GeneralSection actor={actor} />;
			case "people":
				return <PeopleSection actor={actor} />;
			case "payment":
				return <PaymentSection actor={actor} />;
			case "review":
				return (
					<ReviewSection
						generalData={formData.general}
						peopleData={formData.people}
						paymentData={formData.payment}
						onEdit={onEdit || (() => {})}
					/>
				);
			case "executed":
				return (
					<ReviewSection
						generalData={formData.general}
						peopleData={formData.people}
						paymentData={formData.payment}
						readOnly
					/>
				);
			case "finalized":
			case "void":
				return (
					<ReviewSection
						generalData={formData.general}
						peopleData={formData.people}
						paymentData={formData.payment}
						readOnly
						status={status || currentState}
					/>
				);
			default:
				return null;
		}
	},
);

FormSection.displayName = "FormSection";

type ContractMachine = ReturnType<typeof createContractMachine>;
type ContractSnapshot = SnapshotFrom<ContractMachine> & {
	context: ContractContext;
	value: ContractStateValue | { [key: string]: ContractStateValue };
};
type ContractActor = ActorRef<ContractSnapshot, ContractEvent>;
type ContractSend = (event: ContractEvent) => void;

const FuneralServiceForm = memo(({ initialData }: FuneralServiceFormProps) => {
	const { createMutation, updateMutation } = useContractMutations();
	const { data: contracts } = useContracts();

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

	// Track unsaved changes by comparing current form data with saved contract
	const hasUnsavedChanges = useMemo(() => {
		if (createMutation.isPending || updateMutation.isPending) return false;

		const currentContract =
			state.context.id && contracts
				? contracts.find((c) => c.id === state.context.id)
				: null;

		if (!currentContract) {
			return Object.values(state.context.formData).some(
				(section) => section !== null,
			);
		}

		return !compareContracts(state.context.formData, currentContract.formData);
	}, [
		state.context.id,
		state.context.formData,
		contracts,
		createMutation.isPending,
		updateMutation.isPending,
		compareContracts,
	]);

	// Load initial data or sync with latest contract data
	useEffect(() => {
		if (initialData && !state.context.id) {
			send({ type: "LOAD_CONTRACT", data: initialData });
		} else if (state.context.id && contracts) {
			const currentContract = contracts.find((c) => c.id === state.context.id);
			if (
				currentContract &&
				currentContract.contractState !== state.context.contractState
			) {
				send({ type: "LOAD_CONTRACT", data: currentContract });
			}
		}
	}, [
		initialData,
		contracts,
		state.context.id,
		state.context.contractState,
		send,
	]);

	// Use Immer for state updates in handlers
	const handleSave = useCallback(() => {
		const { formData, id, contractState } = state.context;
		if (!formData.general || !formData.people || !formData.payment) return;

		const nextId = id || crypto.randomUUID();
		const contractData = produce(
			{
				id: nextId,
				contractState: contractState || "draft",
				formData,
			} as Contract,
			(draft) => draft,
		);

		if (id) {
			updateMutation.mutate(contractData);
		} else {
			const { id: _, ...newContractData } = contractData;
			createMutation.mutate(newContractData);
		}
	}, [state.context, createMutation, updateMutation]);

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
			formData: state.context.formData,
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
			formData: state.context.formData,
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
			formData: state.context.formData,
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

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between p-4 border-b">
					<div className="flex items-center gap-4">
						<Button variant="outline" onClick={() => navigate({ to: "/test" })}>
							Back to Test
						</Button>
						{hasUnsavedChanges && (
							<Badge
								variant="secondary"
								className="bg-yellow-100 text-yellow-800"
							>
								Unsaved Changes
							</Badge>
						)}
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
					<div className="border-b">
						<Tabs
							value={tabValue}
							onValueChange={(value: string) => {
								send({ type: SECTION_MAP[value as keyof typeof SECTION_MAP] });
							}}
						>
							<TabsList>
								<TabsTrigger value="general">General</TabsTrigger>
								<TabsTrigger value="people">People</TabsTrigger>
								<TabsTrigger value="payment">Payment</TabsTrigger>
								<TabsTrigger value="review">Review</TabsTrigger>
							</TabsList>
						</Tabs>
					</div>
					<FormSection
						currentState={currentState}
						actor={actor}
						formData={state.context.formData}
						onEdit={handleEdit}
						status={currentState}
					/>
				</div>
			</CardContent>
		</Card>
	);
});

FuneralServiceForm.displayName = "FuneralServiceForm";

export default FuneralServiceForm;
