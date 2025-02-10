import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/system/conversion")({
	component: SystemConversionPage,
});

function SystemConversionPage() {
	return (
		<div>
			<h1>System - Conversion</h1>
		</div>
	);
}
