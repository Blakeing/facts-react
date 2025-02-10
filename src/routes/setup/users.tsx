import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/setup/users")({
	component: SetupUsersPage,
});

function SetupUsersPage() {
	return (
		<div>
			<h1>Setup - Users</h1>
		</div>
	);
}
