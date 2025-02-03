import { memo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { FuneralContractFormData } from "../types";

const schema = z.object({
  clientName: z.string().min(2, "Client name is required").or(z.literal("")),
});

type GeneralFormData = { clientName: string };

interface GeneralSectionProps {
  initialData?: FuneralContractFormData["general"];
  onSubmit: (data: GeneralFormData) => void;
}

export const GeneralSection = memo(function GeneralSection({
  initialData,
  onSubmit,
}: GeneralSectionProps) {
  const form = useForm<GeneralFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      clientName: initialData?.clientName || "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="clientName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Client Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter client name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="mt-4 bg-blue-500">
          Save Section
        </Button>
      </form>
    </Form>
  );
});
