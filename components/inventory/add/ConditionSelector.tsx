import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Sparkles, Star, ThumbsUp, Check, AlertCircle } from "lucide-react";

const conditionOptions = [
  { value: "New", icon: Sparkles },
  { value: "Refurbished", icon: Star },
  { value: "Used", icon: AlertCircle },
] as const;

interface ConditionSelectorProps {
  condition: string;
  onChange: (condition: string) => void;
}

export default function ConditionSelector({ condition, onChange }: ConditionSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-medium">Condition</label>
      <div className="grid grid-cols-5 gap-3 mt-3">
        {conditionOptions.map(({ value, icon: Icon }) => (
          <Button
            key={value}
            variant="outline"
            onClick={() => onChange(value)}
            className={cn(
              "flex flex-col items-center py-3 h-auto transition-all",
              "hover:border-blue-500/50 hover:bg-blue-500/10",
              condition === value && "border-blue-500 bg-blue-500/20 text-blue-600"
            )}
          >
            <Icon className={cn("h-5 w-5 mb-1", condition === value ? "text-blue-500" : "text-gray-500")} />
            <span className="text-sm">{value}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}