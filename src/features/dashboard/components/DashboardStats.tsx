import type React from "react";

import type { User } from "../../../models/user.model";

interface DashboardStatsProps {
	totalUsers: number;
	activeUsers: number;
	recentActivity: User[];
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
	totalUsers,
	activeUsers,
	recentActivity,
}) => {
	return (
		<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
			<div className="rounded-lg bg-white p-6 shadow-sm">
				<h3 className="text-lg font-semibold text-gray-900">Total Users</h3>
				<p className="mt-2 text-3xl font-bold text-blue-600">{totalUsers}</p>
			</div>
			<div className="rounded-lg bg-white p-6 shadow-sm">
				<h3 className="text-lg font-semibold text-gray-900">Active Users</h3>
				<p className="mt-2 text-3xl font-bold text-green-600">{activeUsers}</p>
			</div>
			<div className="rounded-lg bg-white p-6 shadow-sm">
				<h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
				<div className="mt-2">
					{recentActivity.slice(0, 3).map((user) => (
						<div key={user.id} className="mb-2 text-sm text-gray-600">
							{user.firstName} {user.lastName} joined
						</div>
					))}
				</div>
			</div>
		</div>
	);
};
