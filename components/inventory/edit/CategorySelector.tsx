// CategorySelector.tsx
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Category } from "./types";

interface CategorySelectorProps {
  categories: Category[];
  selectedCategories: { level1: string; level2: string; level3: string };
  onChange: (level: "level1" | "level2" | "level3", value: string) => void;
  fieldErrors: { category: string };
}

export default function CategorySelector({
  categories,
  selectedCategories,
  onChange,
  fieldErrors,
}: CategorySelectorProps) {
  const level1Categories = categories.filter((cat) => !cat.parent_id);
  const level2Categories = categories.filter((cat) => cat.parent_id === selectedCategories.level1);
  const level3Categories = categories.filter((cat) => cat.parent_id === selectedCategories.level2);

  return (
    <div className="space-y-4">
      <div>
        <Label>Category</Label>
        <Select value={selectedCategories.level1} onValueChange={(value) => onChange("level1", value)}>
          <SelectTrigger className={cn(fieldErrors.category && "border-red-500")}>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {level1Categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {fieldErrors.category && <p className="text-sm text-red-500 mt-1">{fieldErrors.category}</p>}
      </div>
      {selectedCategories.level1 && level2Categories.length > 0 && (
        <div>
          <Label>Subcategory</Label>
          <Select value={selectedCategories.level2} onValueChange={(value) => onChange("level2", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select subcategory" />
            </SelectTrigger>
            <SelectContent>
              {level2Categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      {selectedCategories.level2 && level3Categories.length > 0 && (
        <div>
          <Label>Sub-Subcategory</Label>
          <Select value={selectedCategories.level3} onValueChange={(value) => onChange("level3", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select sub-subcategory" />
            </SelectTrigger>
            <SelectContent>
              {level3Categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}