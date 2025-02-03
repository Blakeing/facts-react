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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { FuneralContractFormData } from "../types";

const schema = z.object({
  paymentMethod: z.enum(["cash", "credit"]),
});

type PaymentFormData = { paymentMethod: "cash" | "credit" };

interface PaymentSectionProps {
  initialData?: FuneralContractFormData["payment"];
  onSubmit: (data: PaymentFormData) => void;
}

export const PaymentSection = memo(function PaymentSection({
  initialData,
  onSubmit,
}: PaymentSectionProps) {
  const form = useForm<PaymentFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      paymentMethod: initialData?.paymentMethod ?? "cash",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="paymentMethod"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Method</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="credit">Credit</SelectItem>
                </SelectContent>
              </Select>
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
