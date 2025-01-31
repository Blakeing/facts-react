import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import type { CreateContractDTO, UpdateContractDTO } from "@/api/contractApi";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

interface Party {
	email: string;
	name: string;
	role: "viewer" | "signer";
}

const partySchema = z.object({
	email: z.string().email("Invalid email address"),
	name: z.string().min(1, "Name is required"),
	role: z.enum(["viewer", "signer"]),
});

const formSchema = z.object({
	title: z.string().min(1, "Title is required"),
	description: z.string(),
	parties: z.array(partySchema),
});

type FormSchema = z.infer<typeof formSchema>;

interface ContractFormProps {
	initialData?: Partial<CreateContractDTO>;
	onSubmit: (data: CreateContractDTO) => void;
	isLoading?: boolean;
	mode?: "create" | "edit";
}

export function ContractForm({
	initialData,
	onSubmit,
	isLoading = false,
	mode = "create",
}: ContractFormProps) {
	const form = useForm<FormSchema>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: initialData?.title || "",
			description: initialData?.description || "",
			parties: initialData?.parties || [],
		},
	});

	const [newParty, setNewParty] = useState<Party>({
		email: "",
		name: "",
		role: "viewer",
	});

	const addParty = () => {
		if (newParty.email && newParty.name) {
			const currentParties = form.getValues("parties") || [];
			form.setValue("parties", [...currentParties, newParty]);
			setNewParty({ email: "", name: "", role: "viewer" });
		}
	};

	const removeParty = (email: string) => {
		const currentParties = form.getValues("parties") || [];
		form.setValue(
			"parties",
			currentParties.filter((party: Party) => party.email !== email),
		);
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				<FormField
					control={form.control}
					name="title"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Title</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="description"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Description</FormLabel>
							<FormControl>
								<Textarea {...field} rows={3} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className="space-y-4">
					<FormLabel>Parties</FormLabel>
					<div className="space-y-2">
						{form.watch("parties")?.map((party: Party) => (
							<div
								key={party.email}
								className="flex items-center justify-between rounded-md border border-input bg-background p-2"
							>
								<div>
									<span className="text-sm font-medium">{party.name}</span>
									<span className="ml-2 text-sm text-muted-foreground">
										{party.email}
									</span>
									<span className="ml-2 text-xs text-muted-foreground">
										({party.role})
									</span>
								</div>
								<Button
									type="button"
									variant="ghost"
									size="sm"
									onClick={() => removeParty(party.email)}
								>
									Remove
								</Button>
							</div>
						))}
					</div>

					<div className="mt-2 flex gap-2">
						<Input
							type="text"
							value={newParty.name}
							onChange={(e) =>
								setNewParty((prev) => ({ ...prev, name: e.target.value }))
							}
							placeholder="Name"
						/>
						<Input
							type="email"
							value={newParty.email}
							onChange={(e) =>
								setNewParty((prev) => ({ ...prev, email: e.target.value }))
							}
							placeholder="Email address"
						/>
						<Select
							value={newParty.role}
							onValueChange={(value: "viewer" | "signer") =>
								setNewParty((prev) => ({ ...prev, role: value }))
							}
						>
							<SelectTrigger className="">
								<SelectValue placeholder="Select role" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="viewer">Viewer</SelectItem>
								<SelectItem value="signer">Signer</SelectItem>
							</SelectContent>
						</Select>
						<Button type="button" onClick={addParty}>
							Add
						</Button>
					</div>
				</div>

				<div className="flex justify-end">
					<Button type="submit" disabled={isLoading}>
						{isLoading
							? "Saving..."
							: mode === "create"
								? "Create Contract"
								: "Update Contract"}
					</Button>
				</div>
			</form>
		</Form>
	);
}
