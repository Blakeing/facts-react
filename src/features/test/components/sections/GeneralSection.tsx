import { useSelector } from "@xstate/react";
import type { ActorRefFrom } from "xstate";
import type createGeneralMachine from "../../machines/generalMachine";
import type { GeneralEvent } from "../../machines/generalMachine";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import { memo, useCallback, useMemo } from "react";

type GeneralActor = ActorRefFrom<ReturnType<typeof createGeneralMachine>>;

interface GeneralSectionProps {
  actor: GeneralActor | null;
  onNext?: () => void;
}

const clientNameSelector = (state: {
  context: { data: { clientName: string } | null; isComplete: boolean };
}) => ({
  clientName: state.context.data?.clientName ?? "",
});

const GeneralSection = memo(({ actor, onNext }: GeneralSectionProps) => {
  console.log("[GeneralSection] Rendering with actor:", actor);

  if (!actor) return null;

  const send = actor.send;
  const selector = useMemo(() => clientNameSelector, []);
  const { clientName } = useSelector(actor, selector);

  console.log("[GeneralSection] Current clientName:", clientName);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      console.log("[GeneralSection] Input changed:", e.target.value);
      send({
        type: "SAVE",
        data: {
          clientName: e.target.value,
        },
      } satisfies GeneralEvent);
    },
    [send]
  );

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="clientName">Client Name</Label>
            <Input
              id="clientName"
              value={clientName}
              onChange={handleChange}
              required
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

GeneralSection.displayName = "GeneralSection";

export default GeneralSection;
