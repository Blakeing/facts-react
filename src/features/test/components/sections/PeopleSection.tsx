import { useSelector } from "@xstate/react";
import type { ActorRefFrom } from "xstate";
import type createPeopleMachine from "../../machines/peopleMachine";
import type { PeopleContext } from "../../machines/peopleMachine";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import { memo, useCallback, useMemo } from "react";

type PeopleActor = ActorRefFrom<ReturnType<typeof createPeopleMachine>>;
type PeopleState = { context: PeopleContext };

interface PeopleSectionProps {
  actor: PeopleActor | null;
  onNext?: () => void;
  onBack?: () => void;
}

const familyMembersSelector = (state: PeopleState) => ({
  familyMembers: state.context.data?.familyMembers ?? [],
  isComplete: state.context.isComplete,
});

const PeopleSection = memo(({ actor, onNext, onBack }: PeopleSectionProps) => {
  if (!actor) return null;

  const send = actor.send;
  const selector = useMemo(() => familyMembersSelector, []);
  const { familyMembers, isComplete } = useSelector(actor, selector);

  const handleChange = useCallback(
    (id: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const newFamilyMembers = familyMembers.map((member) =>
        member.id === id ? { ...member, name: e.target.value } : member
      );

      send({
        type: "SAVE",
        data: {
          familyMembers: newFamilyMembers,
        },
      });
    },
    [familyMembers, send]
  );

  const addFamilyMember = useCallback(() => {
    const newFamilyMembers = [
      ...familyMembers,
      { id: crypto.randomUUID(), name: "" },
    ];
    send({
      type: "SAVE",
      data: {
        familyMembers: newFamilyMembers,
      },
    });
  }, [familyMembers, send]);

  const removeFamilyMember = useCallback(
    (id: string) => {
      const newFamilyMembers = familyMembers.filter(
        (member) => member.id !== id
      );
      send({
        type: "SAVE",
        data: {
          familyMembers: newFamilyMembers,
        },
      });
    },
    [familyMembers, send]
  );

  const handleSave = useCallback(() => {
    if (isComplete && onNext) {
      onNext();
    }
  }, [isComplete, onNext]);

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid w-full items-center gap-4">
          {familyMembers.map((member) => (
            <div key={member.id} className="flex items-center gap-2">
              <div className="flex-1">
                <Label htmlFor={`member-${member.id}`}>Family Member</Label>
                <Input
                  id={`member-${member.id}`}
                  value={member.name}
                  onChange={handleChange(member.id)}
                  required
                />
              </div>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => removeFamilyMember(member.id)}
                className="self-end"
              >
                <Minus className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            size="icon"
            onClick={addFamilyMember}
            className="w-8 h-8"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
});

PeopleSection.displayName = "PeopleSection";

export default PeopleSection;
