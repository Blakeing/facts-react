interface RouteErrorBoundaryProps {
	error: Error;
}

export function RouteErrorBoundary({ error }: RouteErrorBoundaryProps) {
	return (
		<div className="flex h-[50vh] flex-col items-center justify-center gap-4">
			<h1 className="text-2xl font-bold text-destructive">Error</h1>
			<p className="text-muted-foreground">{error.message}</p>
		</div>
	);
}
