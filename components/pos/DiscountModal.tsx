import React, { useState, useEffect } from "react";
import { DiscountModalProps } from "./types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner"; // For error notifications

const DiscountModal: React.FC<DiscountModalProps> = ({
  discount,
  setDiscount,
  setShowDiscountModal,
  total,
  calculateFinalTotal,
}) => {
  // Local state for the text input value, initialized from discount.value
  const [inputValue, setInputValue] = useState(discount.value.toString());
  // State for real-time validation error messages
  const [error, setError] = useState("");

  // Sync inputValue with discount.value when the modal opens or discount.value changes
  useEffect(() => {
    setInputValue(discount.value.toString());
  }, [discount.value]);

  // Handle input changes and provide real-time validation feedback
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    validateInput(value);
  };

  // Validation logic extracted for reuse
  const validateInput = (value: string) => {
    const parsed = parseFloat(value);
    if (isNaN(parsed)) {
      setError("Please enter a valid number");
    } else if (discount.type === "percentage" && (parsed < 0 || parsed > 100)) {
      setError("Percentage must be between 0 and 100");
    } else if (discount.type === "fixed" && (parsed < 0 || parsed > total)) {
      setError(`Amount must be between 0 and ${total.toFixed(2)}`);
    } else {
      setError("");
    }
  };

  // Update validation when discount type or total changes
  useEffect(() => {
    validateInput(inputValue);
  }, [discount.type, total]);

  // Handle the "Apply" action
  const applyDiscount = () => {
    setShowDiscountModal(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      const parsedValue = parseFloat(inputValue);
      if (isNaN(parsedValue)) {
        toast.error("Please enter a valid number");
        return;
      }
      let finalValue = parsedValue;

      if (discount.type === "percentage") {
        if (finalValue < 0 || finalValue > 100) {
          toast.error("Percentage must be between 0 and 100");
          return;
        }
      } else if (discount.type === "fixed") {
        if (finalValue < 0 || finalValue > total) {
          toast.error(`Amount must be between 0 and ${total.toFixed(2)}`);
          return;
        }
      }

      // Update the discount state if validation passes
      setDiscount((prev) => ({ ...prev, value: finalValue }));
    }, 500);

    return () => clearTimeout(timer);
  }, [inputValue]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Apply Discount</h2>
          <div className="space-y-4">
            {/* Discount Type Toggle */}
            <div className="flex gap-4">
              <Button
                variant={discount.type === "percentage" ? "outline" : "default"}
                onClick={() =>
                  setDiscount((prev) => ({ ...prev, type: "percentage" }))
                }
              >
                Percentage (%)
              </Button>
              <Button
                variant={discount.type === "fixed" ? "outline" : "default"}
                onClick={() =>
                  setDiscount((prev) => ({ ...prev, type: "fixed" }))
                }
              >
                Fixed Amount (£)
              </Button>
            </div>
            {/* Text Input for Discount Value */}
            <Input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder={
                discount.type === "percentage"
                  ? "Enter percentage"
                  : "Enter amount"
              }
            />
            {/* Real-time Error Message */}
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {/* Summary */}
            <div className="text-sm">
              Original Total: £{total.toFixed(2)}
              <br />
              Final Total: £{calculateFinalTotal().toFixed(2)}
              <br />
              Savings: £{(total - calculateFinalTotal()).toFixed(2)}
            </div>
            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button className="flex-1" onClick={applyDiscount}>
                Apply
              </Button>
              <Button
                className="flex-1"
                variant="outline"
                onClick={() => {
                  setDiscount({ type: "fixed", value: 0 });
                  setShowDiscountModal(false);
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscountModal;