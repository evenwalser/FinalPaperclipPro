import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  parent_id: string | null;
  level: number;
  display_order: number;
  created_at: string;
  updated_at: string;
}

interface CategorySelectorProps {
  categories: Category[];
  selected: { level1: string; level2: string; level3: string };
  onChange: (selected: { level1: string; level2: string; level3: string }) => void;
  fieldErrors: { name: string; price: string; images: string; category: string; quantity: string };
}

export default function CategorySelector({ categories, selected, onChange, fieldErrors }: CategorySelectorProps) {
  const level1Categories = categories.filter((cat) => !cat.parent_id);
  const level2Categories = categories.filter((cat) => cat.parent_id === selected.level1);
  const level3Categories = categories.filter((cat) => cat.parent_id === selected.level2);

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="category">Category</Label>
        <Select value={selected.level1} onValueChange={(value) => onChange({ ...selected, level1: value, level2: "", level3: "" })}>
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
      {selected.level1 && level2Categories.length > 0 && (
        <div>
          <Label htmlFor="subcategory">Subcategory</Label>
          <Select value={selected.level2} onValueChange={(value) => onChange({ ...selected, level2: value, level3: "" })}>
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
      {selected.level2 && level3Categories.length > 0 && (
        <div>
          <Label htmlFor="subsubcategory">Sub-Subcategory</Label>
          <Select value={selected.level3} onValueChange={(value) => onChange({ ...selected, level3: value })}>
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