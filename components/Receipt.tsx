import { useEffect, useState } from "react";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

interface ReceiptProps {
  saleData: {
    id: string;
    created_at: string;
    total_amount: number;
    payment_method: string;
    amount_tendered: number;
    change_amount: number;
    receipt_id: string;
  };
  items: {
    title: string;
    price: number;
    quantity: number;
  }[];
  userId: string; // Pass the user ID to fetch store details
  customerDetails?: {
    name: string;
    email: string;
  };
  receiptLogo?: string;
  receiptMessage?: string;
  discount?: {
    type: 'percentage' | 'fixed';
    value: number;
    savingsAmount: number;
  };
  onClose: () => void;
}

export function Receipt({ saleData, items, userId, customerDetails, receiptLogo, receiptMessage = 'Thank you for shopping with us!', discount, onClose }: ReceiptProps) {
  const supabase = createClient();
  const [storeDetails, setStoreDetails] = useState<{
    store_name: string;
    store_logo: string;
    address: {
      line_1: string;
      line_2: string;
      post_town: string;
      county: string;
      postcode: string;
    };
    contact_details: {
      phone: string;
      email: string;
    };
  } | null>(null);

  useEffect(() => {
    const fetchStoreDetails = async () => {
      const { data: storeData, error } = await supabase
        .from("stores")
        .select("store_name, store_logo, address, contact_details")
        .eq("owner_id", userId)
        .single();
        
        if (error) {
          console.error("Error fetching store details:", error);
        } else if (storeData) {
          setStoreDetails(storeData);
        }
      };
      
      if (userId) {
        fetchStoreDetails();
      }
    }, [userId]);

  const handlePrint = () => {
    window.print();
  };
  
  return (
    <div className="bg-[#191e25] p-6 rounded-lg max-w-[600px] w-full mx-auto receipt-content">
       {/* {receiptLogo && (
        <div className="flex justify-center mb-4">
          <img 
            src={receiptLogo} 
            alt="Store Logo" 
            className="max-h-16 object-contain"
          />
        </div>
      )} */}
      {/* Store Header */}
      {storeDetails && (
        <div className="mb-5 flex gap-2 border-[1px] border-[rgb(31,41,55)]">
         <div className="w-[180px] h-[180px] p-4 overflow-hidden">
          {storeDetails.store_logo && (
              <img
                src={receiptLogo || storeDetails.store_logo}
                alt="Store Logo"                
              />
            )}
          </div>
          <div className="w-[calc(100%-180px)] border-l-[1px] border-[rgb(31,41,55)] p-4">
            <h2 className="text-xl font-bold leading-2 mb-3">{storeDetails.store_name}</h2>
            <p className="text-sm text-gray-400 leading-2">
              {storeDetails.address.line_1}, {storeDetails.address.line_2}
            </p>
            <p className="text-sm text-gray-400 leading-1">
              {storeDetails.address.post_town}, {storeDetails.address.county},{" "}
              {storeDetails.address.postcode}
            </p>
            <p className="text-sm text-gray-400 leading-1">
              Phone: {storeDetails.contact_details.phone}
            </p>
            <p className="text-sm text-gray-400 leading-1">
              Email: {storeDetails.contact_details.email}
            </p>
          </div>
        </div>
      )}

      {/* Receipt Details */}
      <div className="mb-4 text-sm flex justify-between">
        <p>Receipt #: <br/> {saleData.receipt_id}</p>
        <p className="text-right">Date: <br/> {formatDate(saleData.created_at)}</p>
      </div>
      <div className=" text-center mb-3">
        <p className="capitalize">Payment: {saleData.payment_method}</p>
      </div>

      {/* Items */}
      <div className="border-dashed border-[1px] border-gray-200 mb-4 border-t-0 max-h-[161px] overflow-auto">
        {items.map((item, index) => (
          <div key={index} className="flex justify-between text-sm p-4 border-dashed border-t-[1px] border-gray-200">
            <div>
              <span>
                {item.title} x{item.quantity}
              </span>
            </div>
            <span>£{(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className="flex justify-between gap-3 align-center mb-5">
         {/* Thank You Message */}
         <div className="text-sm">
          <p>{receiptMessage}</p>
        </div>
        {/* Totals */}
        <div className="text-sm grid gap-2 w-[200px] pr-4">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>£{(saleData.total_amount + (discount?.savingsAmount || 0)).toFixed(2)}</span>
          </div>
          {discount && discount.value > 0 && (
            <div className="flex justify-between text-green-500">
              <span>
                Discount ({discount.type === 'percentage' ? `${discount.value}%` : `£${discount.value}`}):
              </span>
              <span>-£{discount.savingsAmount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold">
            <span>Total:</span>
            <span>£{saleData.total_amount.toFixed(2)}</span>
          </div>
          {saleData.payment_method === "cash" && (
            <>
              <div className="flex justify-between">
                <span>Cash Tendered:</span>
                <span>£{saleData.amount_tendered.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Change:</span>
                <span>£{saleData.change_amount.toFixed(2)}</span>
              </div>
            </>
          )}
        </div>

       
      </div>

      {/* Print Button */}
      <div className="mt-4 flex gap-2">
        <Button onClick={handlePrint} className="w-full inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm 
        font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none 
        disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 shadow hover:bg-primary/90 h-11 px-4 py-2 min-w-[100px] 
        bg-[#dc2626] text-[#fff] rounded-[8px] border-[1px] border-[#dc2626] hover:text-[#dc2626]  ">
          <Printer className="mr-2 h-4 w-4" />
          Print Receipt
        </Button>
        <Button onClick={onClose} variant="outline" className="w-full inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm 
        font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none 
        disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 shadow hover:bg-primary/90 h-11 px-4 py-2 min-w-[100px]
         bg-[#fff] text-[#333] rounded-[8px] border-[1px] border-[#fff] hover:text-[#fff]">
          Close
        </Button>
      </div>
    </div>
  );
}
