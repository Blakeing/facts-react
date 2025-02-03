import { createFileRoute } from "@tanstack/react-router";
import FuneralServiceForm from "@/features/test/FuneralServiceForm";

export const Route = createFileRoute("/")({
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <div className="container py-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <div className="mt-6">
        <FuneralServiceForm />
      </div>
    </div>
  );
}
