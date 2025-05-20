import React from 'react';
import { RefundModalProps } from './types';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Minus } from "lucide-react";

const RefundModal: React.FC<RefundModalProps> = ({
  showRefundModal,
  selectedSale,
  refundItems,
  refundReason,
  searchSaleId,
  setShowRefundModal,
  setSelectedSale,
  setRefundItems,
  setRefundReason,
  setSearchSaleId,
  searchSale,
  updateRefundQuantity,
  calculateRefundTotal,
  processRefund,
  formatCurrency,
  isProcessing,
  isProcessRefund
}) => {
  const resetState = () => {
    setShowRefundModal(false);
    setSelectedSale(null);
    setRefundItems([]);
    setRefundReason("");
    setSearchSaleId("");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Process Refund</h2>
            <Button variant="ghost" onClick={resetState}>✕</Button>
          </div>

          {!selectedSale ? (
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={searchSaleId}
                  onChange={(e) => setSearchSaleId(e.target.value)}
                  placeholder="Enter Receipt ID"
                  className="flex-1"
                />
                <Button onClick={searchSale}>Search Sale</Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <div>
                  <h3 className="font-semibold mb-2">Customer Details</h3>
                  <p>Name: {selectedSale.customer.name}</p>
                  <p>Email: {selectedSale.customer.email || "N/A"}</p>
                  <p>Phone: {selectedSale.customer.phone || "N/A"}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Sale Details</h3>
                  <p>Sale ID: {selectedSale.id}</p>
                  <p>Date: {new Date(selectedSale.created_at).toLocaleDateString()}</p>
                  <p>Original Amount: {formatCurrency(selectedSale.original_amount)}</p>
                  <p>Final Amount: {formatCurrency(selectedSale.total_amount)}</p>
                  <p>Payment Method: {selectedSale.payment_method}</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Items Available for Refund</h3>
                <div className="space-y-4">
                  {refundItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <div className="w-20 h-20 relative rounded-md overflow-hidden flex-shrink-0">
                        <img
                          src={item.image_url || "/placeholder.svg"}
                          alt={item.title}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-medium">{item.title}</h4>
                        <p className="text-sm text-gray-500">
                          Original Price: {formatCurrency(item.price)}
                        </p>
                        <p className="text-sm text-gray-500">
                          Effective Price: {formatCurrency(item.effective_price || item.price)}
                        </p>
                        <div className="text-sm text-gray-500">
                          <span>Available Qty: {item.quantity}</span>
                          {item.refunded_quantity > 0 && (
                            <span className="ml-2">
                              (Previously Refunded: {item.refunded_quantity})
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            updateRefundQuantity(
                              item.id,
                              (item.refund_quantity || 0) - 1
                            )
                          }
                          disabled={(item.refund_quantity || 0) <= 0}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <div className="w-16 text-center">
                          <Input
                            type="number"
                            min="0"
                            max={item.quantity}
                            value={item.refund_quantity || 0}
                            onChange={(e) =>
                              updateRefundQuantity(
                                item.id,
                                Math.min(parseInt(e.target.value) || 0, item.quantity)
                              )
                            }
                            className="text-center"
                          />
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            updateRefundQuantity(
                              item.id,
                              (item.refund_quantity || 0) + 1
                            )
                          }
                          disabled={(item.refund_quantity || 0) >= item.quantity}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="w-32 text-right">
                        <p className="font-medium">
                          {formatCurrency((item.refund_quantity || 0) * (item.effective_price || item.price))}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
  
              <div className="space-y-4">
                <div>
                  <label className="block font-medium mb-2">Refund Reason</label>
                  <textarea
                    value={refundReason}
                    onChange={(e) => setRefundReason(e.target.value)}
                    placeholder="Please provide a reason for the refund"
                    className="w-full p-2 border rounded-md"
                    rows={3}
                  />
                </div>

                <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-500">Total Refund Amount</p>
                    <p className="text-2xl font-bold">{formatCurrency(calculateRefundTotal())}</p>
                  </div>
                  <div className="space-x-2">
                    <Button
                      variant="outline"
                      onClick={resetState}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={processRefund}
                      disabled={
                        isProcessRefund ||
                        isProcessing ||
                        !refundItems.some((item) => (item.refund_quantity || 0) > 0) ||
                        !refundReason.trim()
                      }
                    >
                      Process Refund
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RefundModal;