import React from 'react';
import { PaymentOptionsModalProps } from './types';
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";

const PaymentOptionsModal: React.FC<PaymentOptionsModalProps> = ({
  posSettings,
  handlePayment,
  setShowPaymentOptions
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#191e25] bg-opacity-50 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-[500px]">
        <h2 className="text-xl m-0 p-5 bottom-0 border-b-[1px] border-[#384454]">
          Select Payment Method
        </h2>

        <div className="flex flex-col gap-4 p-6">
          {posSettings.acceptCash && (
            <Button
              className="w-full inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm 
              font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring 
              disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 
              [&_svg]:shrink-0 shadow hover:bg-primary/90 h-11 px-4 py-2 min-w-[100px] bg-transparent 
              text-[#fff] rounded-[8px] border-[1px] border-[#fff] hover:text-[#fff] hover:bg-[#dc2626] 
              hover:border-[#dc2626]"
              onClick={() => {
                handlePayment("cash");
                setShowPaymentOptions(false);
              }}
            >
              Cash Payment
            </Button>
          )}

          <Button
            className="w-full inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm 
            font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring 
            disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 
            [&_svg]:shrink-0 shadow hover:bg-primary/90 h-11 px-4 py-2 min-w-[100px] bg-transparent 
            text-[#fff] rounded-[8px] border-[1px] border-[#fff] hover:text-[#fff] hover:bg-[#dc2626] 
            hover:border-[#dc2626]"
            onClick={() => {
              handlePayment("terminal");
              setShowPaymentOptions(false);
            }}
          >
            <CreditCard className="mr-2 h-5 w-5" />
            Stripe Terminal
          </Button>

          <Button
            className="w-full inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm 
            font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring 
            disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 
            [&_svg]:shrink-0 shadow hover:bg-primary/90 h-11 px-4 py-2 min-w-[100px] bg-transparent 
            text-[#fff] rounded-[8px] border-[1px] border-[#fff] hover:text-[#fff] hover:bg-[#dc2626] 
            hover:border-[#dc2626]"
            variant="destructive"
            onClick={() => setShowPaymentOptions(false)}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentOptionsModal; 