import { useSelector } from "@xstate/react";
import type { ActorRefFrom } from "xstate";
import type createPaymentMachine from "../../machines/paymentMachine";
import type { PaymentContext } from "../../machines/paymentMachine";
import { Card, CardContent } from "@/components/ui/card";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { memo, useCallback, useEffect } from "react";

const paymentFormSchema = z.object({
  paymentMethod: z.enum(["cash", "credit"], {
    required_error: "Please select a payment method.",
  }),
  amount: z
    .number({
      required_error: "Amount is required",
      invalid_type_error: "Amount must be a number",
    })
    .min(0.01, "Amount must be greater than 0"),
});

type PaymentFormValues = z.infer<typeof paymentFormSchema>;

type PaymentActor = ActorRefFrom<ReturnType<typeof createPaymentMachine>>;

interface PaymentSectionProps {
  actor: PaymentActor | null;
}

const paymentSelector = (state: { context: PaymentContext }) => ({
  paymentMethod: state.context.data?.paymentMethod ?? "cash",
  amount: state.context.data?.amount ?? 0,
});

const PaymentSection = memo(({ actor }: PaymentSectionProps) => {
  if (!actor) return null;

  const send = actor.send;
  const { paymentMethod, amount } = useSelector(actor, paymentSelector);

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      paymentMethod: "cash",
      amount: 0,
    },
  });

  useEffect(() => {
    form.reset({ paymentMethod, amount });
  }, [paymentMethod, amount, form]);

  const onSubmit = useCallback(
    (values: PaymentFormValues) => {
      send({
        type: "SAVE",
        data: values,
      });
    },
    [send]
  );

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onChange={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Payment Method</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="cash" />
                        </FormControl>
                        <FormLabel className="font-normal">Cash</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="credit" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Credit Card
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      {...field}
                      onChange={(e) =>
                        field.onChange(Number.parseFloat(e.target.value))
                      }
                      required
                    />
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

PaymentSection.displayName = "PaymentSection";

export default PaymentSection;
