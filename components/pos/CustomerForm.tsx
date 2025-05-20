import React from 'react';
import { CustomerFormProps } from './types';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const CustomerForm: React.FC<CustomerFormProps> = ({
  customerData,
  setCustomerData,
  handleCustomerSubmit,
  setShowCustomerForm
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#191e25] bg-opacity-50 z-50 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-[500px]">
        <h2 className="text-xl m-0 p-5 border-b-[1px] border-[#384454]">
          Customer Information
        </h2>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name *</label>
            <Input
              value={customerData.name}
              onChange={(e) =>
                setCustomerData((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
              placeholder="Enter customer name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Phone *
            </label>
            <Input
              type="tel"
              value={customerData.phone}
              onChange={(e) =>
                setCustomerData((prev) => ({
                  ...prev,
                  phone: e.target.value,
                }))
              }
              placeholder="Enter customer phone"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Email (Optional)
            </label>
            <Input
              type="email"
              value={customerData.email}
              onChange={(e) =>
                setCustomerData((prev) => ({
                  ...prev,
                  email: e.target.value,
                }))
              }
              placeholder="Enter customer email"
            />
          </div>
          <div className="flex gap-4">
            <Button
              className="flex-1 bg-paperclip-red hover:bg-red-700 text-white"
              onClick={handleCustomerSubmit}
            >
              Continue to Payment
            </Button>
            <Button
              className="flex-1"
              variant="outline"
              onClick={() => setShowCustomerForm(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerForm; 