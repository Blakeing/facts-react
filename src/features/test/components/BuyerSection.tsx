import React, { useCallback, useImperativeHandle, forwardRef } from "react";

const BuyerSection = forwardRef<
	{ form: any; isDirty: boolean; save: () => void },
	any
>(({ form, isDirty, send }, ref) => {
	const saveToXState = useCallback(() => {
		console.log("BuyerSection - saveToXState called");
		const values = form.getValues();
		console.log("BuyerSection - form values:", values);

		const data: BuyerData = {
			...values,
		};
		console.log("BuyerSection - sending data to XState:", data);
		send({ type: "UPDATE_BUYER", data });
		console.log("BuyerSection - data sent to XState");
	}, [form, send]);

	useImperativeHandle(
		ref,
		() => ({
			form,
			isDirty,
			save: () => {
				console.log("BuyerSection - save method called");
				saveToXState();
			},
		}),
		[form, isDirty, saveToXState],
	);

	return <div>{/* Render your component content here */}</div>;
});

export default BuyerSection;
