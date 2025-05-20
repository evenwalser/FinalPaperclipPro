// AvailabilityToggles.tsx
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface AvailabilityTogglesProps {
  availableInStore: boolean;
  onChange: (availableInStore: boolean) => void;
}

export default function AvailabilityToggles({
  availableInStore,
  onChange,
}: AvailabilityTogglesProps) {
  return (
    <div className="space-y-4 bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="store-availability" className="cursor-pointer">
          Available in Store
        </Label>
        <Switch
          id="store-availability"
          checked={availableInStore}
          onCheckedChange={onChange}
        />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="paperclip-listing" className="text-gray-700 dark:text-gray-300">
          List on Paperclip
        </Label>
        <Switch
          id="paperclip-listing"
          checked={true}
          className="pointer-events-none opacity-50 data-[state=checked]:bg-green-500"
        />
      </div>
    </div>
  );
}