import { Link, Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/contracts")({
	component: ContractsLayout,
});

function ContractsLayout() {
	return (
		<div className="container py-6">
			<nav className="mb-8">
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-4">
						<Link
							to="/contracts"
							className="text-lg font-semibold hover:text-primary"
							activeProps={{ className: "text-primary" }}
						>
							All Contracts
						</Link>
						<Link
							to="/contracts/new"
							className="text-lg font-semibold hover:text-primary"
							activeProps={{ className: "text-primary" }}
						>
							New Contract
						</Link>
					</div>
					<div className="flex items-center space-x-4">
						<Link
							to="/contracts"
							search={{ status: "draft" }}
							className="text-sm text-muted-foreground hover:text-foreground"
							activeProps={{ className: "text-foreground" }}
						>
							Drafts
						</Link>
						<Link
							to="/contracts"
							search={{ status: "active" }}
							className="text-sm text-muted-foreground hover:text-foreground"
							activeProps={{ className: "text-foreground" }}
						>
							Active
						</Link>
						<Link
							to="/contracts"
							search={{ status: "completed" }}
							className="text-sm text-muted-foreground hover:text-foreground"
							activeProps={{ className: "text-foreground" }}
						>
							Completed
						</Link>
						<Link
							to="/contracts"
							search={{ status: "cancelled" }}
							className="text-sm text-muted-foreground hover:text-foreground"
							activeProps={{ className: "text-foreground" }}
						>
							Cancelled
						</Link>
					</div>
				</div>
			</nav>
			<Outlet />
		</div>
	);
}
