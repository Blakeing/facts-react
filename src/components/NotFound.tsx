import React from "react";

export function NotFound() {
	return (
		<div className="flex flex-col items-center justify-center h-full py-20">
			<h1 className="text-2xl font-bold mb-4">Page Not Found</h1>
			<p className="text-muted-foreground mb-8">
				The page you are looking for does not exist.
			</p>
		</div>
	);
}
