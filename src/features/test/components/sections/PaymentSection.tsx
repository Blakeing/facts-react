import { useSelector } from "@xstate/react";
import type { ActorRefFrom } from "xstate";
import type createPaymentMachine from "../../machines/paymentMachine";
import type {
  PaymentData,
  PaymentContext,
} from "../../machines/paymentMachine";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { memo, useCallback, useMemo } from "react";

type PaymentActor = ActorRefFrom<ReturnType<typeof createPaymentMachine>>;
type PaymentState = { context: PaymentContext };

interface PaymentSectionProps {
  actor: PaymentActor | null;
  onNext?: () => void;
  onBack?: () => void;
}

const paymentMethodSelector = (state: PaymentState) =>
  state.context.data?.paymentMethod ?? "cash";
const amountSelector = (state: PaymentState) =>
  state.context.data?.amount ?? "";

const PaymentSection = memo(
  ({ actor, onNext, onBack }: PaymentSectionProps) => {
    if (!actor) return null;

    const send = actor.send;
    const methodSelector = useMemo(() => paymentMethodSelector, []);
    const paymentMethod = useSelector(actor, methodSelector);

    const amountSel = useMemo(() => amountSelector, []);
    const amount = useSelector(actor, amountSel);

    const handleMethodChange = useCallback(
      (value: string) => {
        send({
          type: "SAVE",
          data: {
            paymentMethod: value as PaymentData["paymentMethod"],
            amount: amount || 0,
          },
        });
      },
      [amount, send]
    );

    const handleAmountChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const newAmount = Number.parseFloat(e.target.value);
        if (Number.isNaN(newAmount)) return;

        send({
          type: "SAVE",
          data: {
            paymentMethod,
            amount: newAmount,
          },
        });
      },
      [paymentMethod, send]
    );

    return (
      <Card>
        <CardContent className="pt-6">
          <div className="grid w-full items-center gap-6">
            <div className="flex flex-col gap-2">
              <Label>Payment Method</Label>
              <RadioGroup
                value={paymentMethod}
                onValueChange={handleMethodChange}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cash" id="cash" />
                  <Label htmlFor="cash">Cash</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="credit" id="credit" />
                  <Label htmlFor="credit">Credit Card</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="amount">Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2">
                  $
                </span>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={handleAmountChange}
                  className="pl-7"
                  required
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
);

PaymentSection.displayName = "PaymentSection";

export default PaymentSection;
