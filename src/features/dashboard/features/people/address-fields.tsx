import { withForm } from "../../hooks/useCreateForm.tsx";
import { peopleFormOpts } from "./shared-form.tsx";

export const AddressFields = withForm({
	...peopleFormOpts,
	render: ({ form }) => {
		return (
			<div className="grid gap-4">
				<h2>Address</h2>
				<form.AppField
					name="address.line1"
					children={(field) => <field.TextField label="Address Line 1" />}
				/>
				<form.AppField
					name="address.line2"
					children={(field) => <field.TextField label="Address Line 2" />}
				/>
				<form.AppField
					name="address.city"
					children={(field) => <field.TextField label="City" />}
				/>
				<form.AppField
					name="address.state"
					children={(field) => <field.TextField label="State" />}
				/>
				<form.AppField
					name="address.zip"
					children={(field) => <field.TextField label="ZIP Code" />}
				/>
			</div>
		);
	},
});
