import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface AvailabilityTogglesProps {
  availableInStore: boolean;
  onAvailableInStoreChange: (value: boolean) => void;
  listOnPaperclip: boolean;
  onListOnPaperclipChange: (value: boolean) => void;
  onListOnShopifyChange: (value: boolean) => void;
}

export default function AvailabilityToggles({
  availableInStore,
  onAvailableInStoreChange,
  listOnPaperclip,
  onListOnPaperclipChange,
  onListOnShopifyChange,
}: AvailabilityTogglesProps) {
  return (
    <div className="space-y-4 bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="store-availability" className="cursor-pointer">
          Available in Store
        </Label>
        <Switch id="store-availability" checked={availableInStore} onCheckedChange={onAvailableInStoreChange} />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="paperclip-listing" className="text-gray-700 dark:text-gray-300">
          List on Paperclip
        </Label>
        <Switch id="paperclip-listing" checked={listOnPaperclip} onCheckedChange={onListOnPaperclipChange} />
      </div>
    </div>
  );
}