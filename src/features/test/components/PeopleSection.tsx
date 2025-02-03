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
  familyMembers: z
    .string()
    .min(3, "At least one family member is required")
    .or(z.literal("")),
});

type PeopleFormData = { familyMembers: string };

interface PeopleSectionProps {
  initialData?: FuneralContractFormData["people"];
  onSubmit: (data: PeopleFormData) => void;
}

export const PeopleSection = memo(function PeopleSection({
  initialData,
  onSubmit,
}: PeopleSectionProps) {
  const form = useForm<PeopleFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      familyMembers: initialData?.familyMembers || "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="familyMembers"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Family Members</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Enter names separated by commas"
                />
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
