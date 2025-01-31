import { SidebarIcon } from "lucide-react";
import { useMatches, Link } from "@tanstack/react-router";
import React from "react";

import { SearchForm } from "./SearchForm";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSidebar } from "@/components/ui/sidebar";

const getBreadcrumbs = (matches: ReturnType<typeof useMatches>) => {
	const paths: { pathname: string; text: string }[] = [];
	let currentPath = "";

	const filteredMatches = matches.filter((match) => match.pathname !== "/");

	for (const match of filteredMatches) {
		const segments = match.pathname.split("/").filter(Boolean);
		for (const segment of segments) {
			currentPath += `/${segment}`;
			if (!paths.some((p) => p.pathname === currentPath)) {
				paths.push({
					pathname: currentPath,
					text:
						segment.charAt(0).toUpperCase() +
						segment.slice(1).replace(/-/g, " "),
				});
			}
		}
	}

	return paths;
};

export function SiteHeader() {
	const { toggleSidebar } = useSidebar();
	const matches = useMatches();
	const breadcrumbs = getBreadcrumbs(matches);

	return (
		<header className="fle sticky top-0 z-50 w-full items-center border-b bg-background">
			<div className="flex h-(--header-height) w-full items-center gap-2 px-4">
				<Button
					className="h-8 w-8"
					variant="ghost"
					size="icon"
					onClick={toggleSidebar}
				>
					<SidebarIcon />
				</Button>
				<Separator orientation="vertical" className="mr-2 h-4" />
				<Breadcrumb className="hidden sm:block">
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink asChild>
								<Link to="/">Home</Link>
							</BreadcrumbLink>
						</BreadcrumbItem>
						{breadcrumbs.map((crumb, index) => (
							<React.Fragment key={crumb.pathname}>
								<BreadcrumbSeparator />
								<BreadcrumbItem>
									{index === breadcrumbs.length - 1 ? (
										<BreadcrumbPage className="capitalize">
											{crumb.text}
										</BreadcrumbPage>
									) : (
										<BreadcrumbLink className="capitalize" asChild>
											<Link to={crumb.pathname}>{crumb.text}</Link>
										</BreadcrumbLink>
									)}
								</BreadcrumbItem>
							</React.Fragment>
						))}
					</BreadcrumbList>
				</Breadcrumb>
				<SearchForm className="w-full sm:ml-auto sm:w-auto" />
			</div>
		</header>
	);
}
