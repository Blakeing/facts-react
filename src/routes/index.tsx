import { Button } from "@/components/ui/button";
import { Link, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	component: HomePage,
});

function HomePage() {
	return (
		<div className="flex flex-col items-center justify-center space-y-6 py-12 text-center">
			<h1 className="text-4xl font-bold">Welcome to Facts</h1>
			<p className="text-xl text-muted-foreground">
				Manage your contracts and documents in one place
			</p>
			<div className="flex items-center gap-4">
				<Link to="/contracts">
					<Button size="lg">View Contracts</Button>
				</Link>
				<Link to="/contracts/new">
					<Button size="lg" variant="outline">
						Create New Contract
					</Button>
				</Link>
			</div>
		</div>
	);
}
