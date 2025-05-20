import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { Printer } from "lucide-react";

interface RefundReceiptProps {
  refundData: {
    id: string;
    created_at: string;
    total_amount: number;
    refund_method: string;
    reason: string;
    originalSaleId: string;
    customer?: {
      name: string;
      email?: string;
      phone?: string;
    };
  };
  items: {
    title: string;
    price: number;
    refund_quantity: number;
  }[];
  storeLogo?: string;
  storeMessage?: string;
  onClose: () => void;
}

export function RefundReceipt({
  refundData,
  items,
  storeLogo,
  storeMessage,
  onClose,
}: RefundReceiptProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-[#191e25] p-6 rounded-lg max-w-[600px] w-full mx-auto receipt-content">
      <div className="mb-5 flex gap-2 border-[1px] border-[rgb(31,41,55)]">
        <div className="w-[180px] h-[180px] p-4 overflow-hidden">
          {storeLogo && (
            <img
              src={storeLogo}
              alt="Store Logo"              
            />
          )}
        </div>
        <div className="w-[calc(100%-180px)] border-l-[1px] border-[rgb(31,41,55)] p-4">
          <h2 className="text-xl font-bold leading-2 mb-3">Refund Receipt</h2>
          <p className="text-sm text-gray-400 leading-2">Refund ID: {refundData.id}</p>
          <p className="text-sm text-gray-400 leading-1">
            Original Sale ID: {refundData.originalSaleId}
          </p>
          <p className="text-sm text-gray-400 leading-1">
            Date: {formatDate(refundData.created_at)}
          </p>
        </div>
      </div>

      {refundData.customer && (
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Customer Details</h3>
          <p>Name: {refundData.customer.name}</p>
          {refundData.customer.email && (
            <p>Email: {refundData.customer.email}</p>
          )}
          {refundData.customer.phone && (
            <p>Phone: {refundData.customer.phone}</p>
          )}
        </div>
      )}

      <div className="">
        <h3 className="font-semibold mb-2">Refunded Items</h3>
        <div className="border-dashed border-[1px] border-gray-200 border-t-0 max-h-[148px] overflow-auto">
          {items.map((item, index) => (
            <div key={index} className="flex justify-between text-sm p-4 border-dashed border-t-[1px] border-gray-200">
              <div>
                <p>{item.title}</p>
                <p className="text-sm text-gray-300">
                  Qty: {item.refund_quantity} x £{item.price.toFixed(2)}
                </p>
              </div>
              <p className="font-medium">
                £{(item.price * item.refund_quantity).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="p-3 mb-2 flex gap-2 bg-[rgba(255,255,255,.1)]">
      <div className="flex justify-between gap-2">
          <p className="text-gray-400 m-0 font-normal">Refund Method:</p>          
          <p className="text-gray-200 m-0 font-bold"> {refundData.refund_method}</p>
        </div>
        <div className="flex justify-between ml-auto gap-2">
          <p className="text-gray-400 m-0 font-normal">Total Refund Amount:</p>
          <p className="text-gray-200 m-0 font-bold">£{refundData.total_amount.toFixed(2)}</p>
        </div>
      </div>

      <div className="my-4">
        <p className="text-gray-300 mt-2">Reason:</p>
        <span className="bg-[rgb(31,41,55)] w-full block p-4">{refundData.reason}</span>
      </div>

      {storeMessage && (
        <div className="text-center text-gray-200 mb-6">{storeMessage}</div>
      )}

      <div className="flex gap-4 print:hidden">
        <Button onClick={handlePrint} className="w-full inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm 
        font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none 
        disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 shadow hover:bg-primary/90 h-11 px-4 py-2 min-w-[100px] 
        bg-[#dc2626] text-[#fff] rounded-[8px] border-[1px] border-[#dc2626] hover:text-[#dc2626]">
          <Printer className="mr-2 h-4 w-4" /> Print Receipt
        </Button>
        <Button onClick={onClose} variant="outline" className="w-full inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm 
        font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none 
        disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 shadow hover:bg-primary/90 h-11 px-4 py-2 min-w-[100px]
         bg-[#fff] text-[#333] rounded-[8px] border-[1px] border-[#fff] hover:text-[#fff]">
          Close
        </Button>
      </div>

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-content,
          .print-content * {
            visibility: visible;
          }
          .print-content {
            position: absolute;
            left: 0;
            top: 0;
          }
        }
      `}</style>
    </div>
  );
} 