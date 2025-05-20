// SizeSelector.tsx
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface SizeSelectorProps {
  size: string;
  onChange: (size: string) => void;
}

export default function SizeSelector({ size, onChange }: SizeSelectorProps) {
  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

  return (
    <div>
      <Label>Size</Label>
      <div className="flex justify-between gap-2 mt-3">
        {sizes.map((sizeOption) => (
          <Button
            key={sizeOption}
            variant="outline"
            onClick={() => onChange(sizeOption)}
            className={cn(
              "flex-1 transition-all",
              "hover:border-blue-500/50 hover:bg-blue-500/10",
              size === sizeOption && "border-blue-500 bg-blue-500/20 text-blue-600"
            )}
          >
            {sizeOption}
          </Button>
        ))}
      </div>
    </div>
  );
}