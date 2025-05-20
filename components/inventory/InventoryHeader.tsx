import React from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { InventoryHeaderProps } from './types';

const InventoryHeader: React.FC<InventoryHeaderProps> = ({
  selectedItemsCount,
  sendSelectedToPOS,
  canManageItems,
  user,
  onAddNewItem
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
      <h1 className="text-2xl sm:text-3xl font-bold">Inventory</h1>
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
        <Button
          onClick={sendSelectedToPOS}
          disabled={selectedItemsCount === 0}
          className="bg-[#FF3B30] hover:bg-[#E6352B] text-white rounded-[8px]"
        >
          Send to POS
        </Button>
        {canManageItems && user && (
          <Button
            onClick={() => {
              if (user?.store_id) {
                onAddNewItem();
              } else {
                toast.error("No store associated with this account");
              }
            }}
            className="bg-[#FF3B30] hover:bg-[#E6352B] text-white rounded-[8px]"
          >
            Add New Item
          </Button>
        )}
      </div>
    </div>
  );
};

export default InventoryHeader; 