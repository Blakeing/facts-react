import { useSelector } from "@xstate/react";
import type { ActorRefFrom } from "xstate";
import type createGeneralMachine from "../../machines/generalMachine";
import type { GeneralEvent } from "../../machines/generalMachine";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { memo, useCallback, useEffect, useMemo } from "react";

const generalFormSchema = z.object({
  clientName: z.string().min(2, "Client name must be at least 2 characters"),
});

type GeneralFormValues = z.infer<typeof generalFormSchema>;

type GeneralActor = ActorRefFrom<ReturnType<typeof createGeneralMachine>>;

interface GeneralSectionProps {
  actor: GeneralActor | null;
}

const clientNameSelector = (state: {
  context: { data: { clientName: string } | null };
}) => ({
  clientName: state.context.data?.clientName ?? "",
});

const GeneralSection = memo(({ actor }: GeneralSectionProps) => {
  console.log("[GeneralSection] Rendering with actor:", actor);

  if (!actor) return null;

  const send = actor.send;
  const selector = useMemo(() => clientNameSelector, []);
  const { clientName } = useSelector(actor, selector);

  const form = useForm<GeneralFormValues>({
    resolver: zodResolver(generalFormSchema),
    defaultValues: {
      clientName: "",
    },
  });

  // Update form when data changes
  useEffect(() => {
    form.reset({ clientName });
  }, [clientName, form]);

  const onSubmit = useCallback(
    (values: GeneralFormValues) => {
      send({
        type: "SAVE",
        data: {
          clientName: values.clientName,
        },
      } satisfies GeneralEvent);
    },
    [send]
  );

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form
            onChange={form.handleSubmit(onSubmit)}
            className="grid w-full items-center gap-4"
          >
            <FormField
              control={form.control}
              name="clientName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client Name</FormLabel>
                  <FormControl>
                    <Input {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
});

GeneralSection.displayName = "GeneralSection";

export default GeneralSection;
