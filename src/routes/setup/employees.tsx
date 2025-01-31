import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/setup/employees")({
	component: SetupEmployeesPage,
});

function SetupEmployeesPage() {
	return (
		<div>
			<h1>Setup - Employees</h1>
		</div>
	);
}
