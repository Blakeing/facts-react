export type AtNeedContractStatus =
	| "Active"
	| "Pending"
	| "Completed"
	| "Cancelled";

export type AtNeedContract = {
	id: string;
	contractNumber: string;
	prePrintedContractNumber: string;
	date: string;
	deceased: string;
	dateOfDeath: string;
	purchaser: string;
	funeralDirector: string;
	status: AtNeedContractStatus;
	createdAt: string;
	updatedAt: string;
	// Additional fields from general form
	serviceDate: string;
	contractSignDate: string;
	atNeedType: string;
	contractType: string;
	campaign: string;
};

export type GeneralFormValues = {
	serviceDate: string;
	contractSignDate: string;
	prePrintedContractNumber: string;
	funeralDirector: string;
	atNeedType: string;
	contractType: string;
	campaign: string;
};

export type CreateAtNeedContractDTO = GeneralFormValues & {
	status?: AtNeedContractStatus;
};

export type UpdateAtNeedContractDTO = Partial<GeneralFormValues> & {
	status?: AtNeedContractStatus;
};
