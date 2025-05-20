// BasicInfo.tsx
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface BasicInfoProps {
  name: string;
  description: string;
  price: string;
  quantity: string;
  brand: string;
  age: string;
  color: string;
  onChange: (
    updates: Partial<{
      name: string;
      description: string;
      price: string;
      quantity: string;
      brand: string;
      age: string;
      color: string;
    }>
  ) => void;
  fieldErrors: { name: string; price: string };
  onBrandChange: (value: string) => void;
  brandSuggestions: any[];
  colors: { id: string; name: string }[];
  showSuggestions: boolean;
  onBrandSelect: (brand: any) => void;
  logoUrl: string;
  selectedTags: string[]; // Add this
  onTagsChange: (tags: string[]) => void;
  ages: { id: string; name: string }[];
}

export default function BasicInfo({
  name,
  description,
  price,
  quantity,
  brand,
  age,
  ages,
  color,
  colors,
  onChange,
  fieldErrors,
  onBrandChange,
  brandSuggestions,
  showSuggestions,
  onBrandSelect,
  logoUrl,
  selectedTags,
  onTagsChange,
}: BasicInfoProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label>Item Name</Label>
        <Input
          value={name}
          onChange={(e) => onChange({ name: e.target.value })}
          className={cn(fieldErrors.name && "border-red-500")}
        />
        {fieldErrors.name && (
          <p className="text-sm text-red-500 mt-1">{fieldErrors.name}</p>
        )}
      </div>
      <div>
        <Label>Description</Label>
        <Textarea
          value={description}
          onChange={(e) => onChange({ description: e.target.value })}
        />
      </div>
      <div>
        <Label>Price (£)</Label>
        <Input
          type="text"
          value={price}
          onChange={(e) => {
            const value = e.target.value;
            if (value === "" || /^\d*\.?\d{0,2}$/.test(value)) {
              onChange({ price: value });
            }
          }}
          className={cn(fieldErrors.price && "border-red-500")}
        />
        {fieldErrors.price && (
          <p className="text-sm text-red-500 mt-1">{fieldErrors.price}</p>
        )}
      </div>
      <div>
        <Label>Quantity</Label>
        <Input
          type="text"
          value={quantity}
          onChange={(e) => {
            const value = e.target.value;
            if (value === "" || /^\d+$/.test(value)) {
              onChange({ quantity: value });
            }
          }}
        />
      </div>
      <div className="space-y-2">
        <Label>Tags</Label>
        <div className="flex flex-wrap gap-2">
          {selectedTags.map((tag, index) => (
            <div
              key={index}
              className="bg-blue-100 text-blue-800 px-2 py-1 rounded flex items-center"
            >
              {tag}
              <button
                onClick={() =>
                  onTagsChange(selectedTags.filter((_, i) => i !== index))
                }
                className="ml-1 text-red-500 hover:text-red-700"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
        <Input
          placeholder="Add a tag and press Enter"
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.currentTarget.value.trim()) {
              onTagsChange([...selectedTags, e.currentTarget.value.trim()]);
              e.currentTarget.value = "";
            }
          }}
        />
      </div>
      <div className="relative">
        <Label htmlFor="brand">Brand</Label>

        {/* Input with Logo Inside */}
        <div className="relative flex items-center">
          {logoUrl && (
            <img
              src={logoUrl}
              alt="Brand Logo"
              className="absolute right-3 h-6 w-6 object-contain"
              onError={(e) =>
                ((e.target as HTMLImageElement).style.display = "none")
              }
            />
          )}
          <Input
            id="brand"
            type="text"
            value={brand}
            placeholder="Enter brand"
            onChange={(e) => onBrandChange(e.target.value)}
            className={`pl-${logoUrl ? "10" : "3"}`} // Adjust padding dynamically
          />
        </div>

        <div>
        <Label htmlFor="age">Age</Label>
        <Select value={age} onValueChange={(value) => onChange({ age: value })}>
          <SelectTrigger id="age">
            <SelectValue placeholder="Select age" />
          </SelectTrigger>
          <SelectContent>
            {ages.map((ageOption) => (
              <SelectItem key={ageOption.id} value={ageOption.name}>
                {ageOption.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && brandSuggestions.length > 0 && (
          <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
            {brandSuggestions.map((suggestion, index) => (
              <li
                key={index}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                onClick={() => onBrandSelect(suggestion)}
              >
                {suggestion.logo_url && (
                  <img
                    src={suggestion.logo_url}
                    alt={suggestion.name}
                    className="h-6 w-6 mr-2"
                    onError={(e) =>
                      ((e.target as HTMLImageElement).style.display = "none")
                    }
                  />
                )}
                <span>{suggestion.name}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* <div>
        <Label>age</Label>
        <Input
          type="text"
          value={age}
          placeholder="age"
          onChange={(e) => {
            const value = e.target.value;
              onChange({ age: value });
          }}
        />
      </div> */}
      <div>
        <Label htmlFor="color">Color</Label>
        <Select
          value={color}
          onValueChange={(value) => onChange({ color: value })}
        >
          <SelectTrigger id="color">
            <SelectValue placeholder="Select color" />
          </SelectTrigger>
          <SelectContent>
            {colors.map((colorOption) => (
              <SelectItem key={colorOption.id} value={colorOption.name}>
                {colorOption.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
