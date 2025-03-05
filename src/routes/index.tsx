import { PeoplePage } from "@/features/dashboard/features/people/page";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";

export const Route = createFileRoute("/")({
	component: DashboardPage,
});

function DashboardPage() {
	return (
		<Suspense fallback={<p>Loading...</p>}>
			<PeoplePage />
		</Suspense>
	);
}
