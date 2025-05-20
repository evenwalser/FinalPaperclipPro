import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ImageCarousel from "./ImageCarousel";
import BasicInfoForm from "./BasicInfoForm";
import CategorySelector from "./CategorySelector";
import ConditionSelector from "./ConditionSelector";
import SizeSelector from "./SizeSelector";
import AvailabilityToggles from "./AvailabilityToggles";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

interface ImageFile {
  url: string;
  file: File | null;
  filepath: string | null;
}

interface Category {
  id: string;
  name: string;
  parent_id: string | null;
  level: number;
  display_order: number;
  created_at: string;
  updated_at: string;
}

interface DetailsViewProps {
  images: ImageFile[];
  currentImageIndex: number;
  onNavigate: (index: number) => void;
  itemDetails: {
    name: string;
    description: string;
    price: string;
    condition: string;
    quantity: string;
  };
  onItemDetailsChange: (details: {
    name: string;
    description: string;
    price: string;
    condition: string;
    quantity: string;
  }) => void;
  categories: Category[];
  selectedCategories: { level1: string; level2: string; level3: string };
  onCategoryChange: (categories: {
    level1: string;
    level2: string;
    level3: string;
  }) => void;
  condition: string;
  onConditionChange: (condition: string) => void;
  size: string;
  onSizeChange: (size: string) => void;
  brand: string;
  onBrandChange: (brand: string) => void;
  age: string;
  onAgeChange: (age: string) => void;
  color: string;
  onColorChange: (color: string) => void;
  availableInStore: boolean;
  onAvailableInStoreChange: (value: boolean) => void;
  listOnPaperclip: boolean;
  onListOnPaperclipChange: (value: boolean) => void;
  onSubmit: () => void;
  isSaving: boolean;
  fieldErrors: {
    name: string;
    price: string;
    images: string;
    category: string;
    quantity: string;
  };
  isAnalyzing: boolean;
  onAIAnalysis: () => void;
  logoUrl: string;
  brandSuggestions: any[];
  showSuggestions: boolean;
  onBrandSelect: (brand: any) => void;
  selectedTags: string[];
  setSelectedTags: any;
  setListOnShopify: any;
  colors: { id: string; name: string }[];
  ages: { id: string; name: string }[];
}

export default function DetailsView({
  images,
  currentImageIndex,
  onNavigate,
  itemDetails,
  onItemDetailsChange,
  categories,
  selectedCategories,
  onCategoryChange,
  condition,
  onConditionChange,
  size,
  onSizeChange,
  brand,
  onBrandChange,
  age,
  ages,
  onAgeChange,
  color,
  colors,
  onColorChange,
  availableInStore,
  onAvailableInStoreChange,
  listOnPaperclip,
  onListOnPaperclipChange,
  onSubmit,
  isSaving,
  fieldErrors,
  isAnalyzing,
  onAIAnalysis,
  logoUrl,
  brandSuggestions,
  showSuggestions,
  onBrandSelect,
  selectedTags,
  setSelectedTags,
  setListOnShopify,
}: DetailsViewProps) {
  return (
    <div className="space-y-6">
      <div className="h-[300px] bg-black rounded-2xl overflow-hidden">
        <ImageCarousel
          images={images}
          currentIndex={currentImageIndex}
          onNavigate={onNavigate}
        />
      </div>
      <Button
        onClick={onAIAnalysis}
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
        disabled={isAnalyzing}
      >
        {isAnalyzing ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/60 border-t-white mr-2" />
            <span>Analyzing...</span>
          </>
        ) : (
          <>
            <span className="text-lg mr-2">🤖</span>
            <span>Analyze with AI</span>
          </>
        )}
      </Button>
      <BasicInfoForm
        itemDetails={itemDetails}
        onChange={onItemDetailsChange}
        fieldErrors={fieldErrors}
      />
      <CategorySelector
        categories={categories}
        selected={selectedCategories}
        onChange={onCategoryChange}
        fieldErrors={fieldErrors}
      />
      <ConditionSelector condition={condition} onChange={onConditionChange} />
      <SizeSelector size={size} onChange={onSizeChange} />
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
                  setSelectedTags((prev: string[]) =>
                    prev.filter((_: string, i: number) => i !== index)
                  )
                }
                className="ml-1 text-red-500 hover:text-red-700"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
        {/* <Input
            placeholder="Add a tag and press Enter"
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.currentTarget.value.trim()) {
                setSelectedTags((prev) => [
                  ...prev,
                  e.currentTarget.value.trim(),
                ]);
                e.currentTarget.value = "";
              }
            }}
          /> */}
      </div>
      <div className="relative">
        <Label htmlFor="brand">Brand</Label>
        <div className="relative flex items-center">
          {logoUrl && (
            <img
              src={logoUrl}
              alt="Brand Logo"
              className="absolute right-2 h-6 w-6 object-contain"
              onError={(e) =>
                ((e.target as HTMLImageElement).style.display = "none")
              }
            />
          )}
          <Input
            id="brand"
            value={brand}
            onChange={(e) => onBrandChange(e.target.value)}
            placeholder="Enter brand"
            className={`pl-${logoUrl ? "10" : "3"}`} // Add left padding if logo exists
          />
        </div>

        <div>
        <Label htmlFor="age">Age</Label>
        <Select value={age} onValueChange={onAgeChange}>
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

        {showSuggestions && brandSuggestions.length > 0 && (
          <ul className="absolute z-10 w-full bg-[#060d19] border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
            {brandSuggestions.map((suggestion, index) => (
              <li
                key={index}
                className="px-4 py-2 hover:bg-[#101e34] cursor-pointer flex items-center"
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
      {/* <div className="relative">
        <Label htmlFor="brand">Brand</Label>
        <Input
          id="brand"
          value={brand}
          onChange={(e) => onBrandChange(e.target.value)}
          placeholder="Enter brand"
        />
        {showSuggestions && brandSuggestions.length > 0 && (
          <ul className="absolute z-10 w-full bg-[#060d19] border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
            {brandSuggestions.map((suggestion, index) => (
              <li
                key={index}
                className="px-4 py-2 hover:bg-[#101e34]cursor-pointer flex items-center"
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
        {logoUrl && (
          <img
            src={logoUrl}
            alt="Brand Logo"
            className="mt-2 h-16 w-16 object-contain"
            onError={(e) =>
              ((e.target as HTMLImageElement).style.display = "none")
            }
          />
        )}
      </div> */}
      {/* <div>
      <Label htmlFor="age">Age</Label>
      <Input
        id="age"
        value={age}
        onChange={(e) => onAgeChange(e.target.value)}
        placeholder="Enter age (e.g., 2 years)"
      />
    </div> */}
      <div>
        <Label htmlFor="color">Color</Label>
        <Select value={color} onValueChange={onColorChange}>
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
      <AvailabilityToggles
        availableInStore={availableInStore}
        onAvailableInStoreChange={onAvailableInStoreChange}
        listOnPaperclip={listOnPaperclip}
        onListOnPaperclipChange={onListOnPaperclipChange}
        onListOnShopifyChange={setListOnShopify}
      />
      {fieldErrors.images && (
        <p className="text-sm text-red-500 mt-1">{fieldErrors.images}</p>
      )}
      <Button
        size="lg"
        onClick={onSubmit}
        disabled={
          isSaving ||
          !itemDetails.name ||
          !itemDetails.price ||
          images.length === 0
        }
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 text-lg py-6"
      >
        {isSaving ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/60 border-t-white mr-2" />
            <span>Saving...</span>
          </>
        ) : (
          "Add Item to Inventory"
        )}
      </Button>
    </div>
  );
}
