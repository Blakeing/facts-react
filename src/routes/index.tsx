import { useTestSheet } from "@/components/sheets/TestSheet";
import { Button } from "@/components/ui/button";
import FuneralServiceForm from "@/features/test/FuneralServiceForm";
import { useToast } from "@/hooks/use-toast";
import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/")({
  component: DashboardPage,
});

function DashboardPage() {
  const { onOpen, setData } = useTestSheet();
  const { toast } = useToast();

  const handleOpenSheet = () => {
    setData({
      message: "Opened from Dashboard!",
      count: 0,
    });
    onOpen();
  };

  return (
    <div className="container py-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <div className="mt-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Button onClick={handleOpenSheet}>Open Test Sheet</Button>
          <Button
            onClick={() => {
              toast({
                title: "Scheduled: Catch up",
                description: "Friday, February 10, 2023 at 5:57 PM",
              });
            }}
          >
            Show Toast
          </Button>
        </div>
      </div>
      <FuneralServiceForm />
    </div>
  );
}
