import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface BasicInfoFormProps {
  itemDetails: { name: string; description: string; price: string; condition: string; quantity: string };
  onChange: (details: { name: string; description: string; price: string; condition: string; quantity: string }) => void;
  fieldErrors: { name: string; price: string; images: string; category: string; quantity: string };
}

export default function BasicInfoForm({ itemDetails, onChange, fieldErrors }: BasicInfoFormProps) {
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^\d*\.?\d{0,2}$/.test(value)) {
      onChange({ ...itemDetails, price: value });
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^\d+$/.test(value)) {
      onChange({ ...itemDetails, quantity: value });
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name">Item Name</Label>
        <Input
          id="name"
          value={itemDetails.name}
          onChange={(e) => onChange({ ...itemDetails, name: e.target.value })}
          placeholder="Enter item name"
          className={cn(fieldErrors.name && "border-red-500")}
        />
        {fieldErrors.name && <p className="text-sm text-red-500 mt-1">{fieldErrors.name}</p>}
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={itemDetails.description}
          onChange={(e) => onChange({ ...itemDetails, description: e.target.value })}
          placeholder="Enter item description"
          className="h-32"
        />
      </div>
      <div>
        <Label htmlFor="price">Price (£)</Label>
        <Input
          id="price"
          type="text"
          value={itemDetails.price}
          onChange={handlePriceChange}
          placeholder="0.00"
          className={cn(fieldErrors.price && "border-red-500")}
        />
        {fieldErrors.price && <p className="text-sm text-red-500 mt-1">{fieldErrors.price}</p>}
      </div>
      <div>
        <Label htmlFor="quantity">Quantity</Label>
        <Input
          id="quantity"
          type="text"
          value={itemDetails.quantity}
          onChange={handleQuantityChange}
          placeholder="1"
          className={cn(fieldErrors.quantity && "border-red-500")}
        />
        {fieldErrors.quantity && <p className="text-sm text-red-500 mt-1">{fieldErrors.quantity}</p>}
      </div>
    </div>
  );
}