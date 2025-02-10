import { Spinner } from "./ui/Spinner";

export function RouteLoader() {
	return (
		<div className="flex h-[50vh] flex-col items-center justify-center gap-4">
			<Spinner size="md" />
			<p className="text-muted-foreground">Loading...</p>
		</div>
	);
}
