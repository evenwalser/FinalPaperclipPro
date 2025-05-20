import React from 'react';
import { PaymentSectionProps } from './types';
import { Button } from "@/components/ui/button";
import { CreditCard, Smartphone, QrCode } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const PaymentSection: React.FC<PaymentSectionProps> = ({
  amount,
  change,
  isProcessing,
  paymentMethod,
  items,
  handlePayment,
  handleNumberClick,
  handleClear,
  handleDecimal
}) => {
  return (
    <Card className="bg-white dark:bg-gray-800 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center">
          <CreditCard className="mr-2 h-5 w-5 text-paperclip-red" />
          Payment
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-right mb-6">
          <span className="text-4xl font-bold text-paperclip-red">
            £{amount}
          </span>
          {change > 0 && (
            <div className="text-green-600 text-xl mt-2">
              Change: £{change.toFixed(2)}
            </div>
          )}
        </div>

        <Button
          className="w-full bg-paperclip-red hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg mb-6"
          onClick={() => handlePayment("card")}
          disabled={isProcessing || items.length === 0}
        >
          <div className="flex items-center justify-center gap-2">
            {isProcessing && paymentMethod === "card" ? (
              <span>Processing...</span>
            ) : (
              <>
                <CreditCard className="h-5 w-5" />
                <Smartphone className="h-5 w-5" />
                <QrCode className="h-5 w-5" />
                <span>Pay with Card</span>
              </>
            )}
          </div>
        </Button>
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, ".", 0, "C"].map((num) => (
            <Button
              key={num}
              variant={num === "C" ? "destructive" : "outline"}
              className="h-16 text-xl font-semibold"
              onClick={() => {
                if (num === "C") handleClear(); // Reset the amount
                else if (num === ".") handleDecimal(); // Add decimal
                else handleNumberClick(num.toString()); // Add the number to amount
              }}
            >
              {num}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentSection; 