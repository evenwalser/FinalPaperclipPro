import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@radix-ui/react-checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface Brand {
  brand: string;
  logo_url: string;
}

interface FilterOptions {
  sizes: string[];
  brands: Brand[];
  ages: string[];
  colors: string[];
}

interface SelectedFilters {
  category: string;
  search: string;
  sizes: string[];
  brands: string[];
  ages: string[];
  colors: string[];
}

interface InventoryFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  categories: { id: string; name: string }[];
  onCategoryChange: (value: string) => void;
  filterOptions: FilterOptions;
  selectedFilters: SelectedFilters;
  onFilterChange: (key: keyof SelectedFilters, value: any) => void;
}

const InventoryFilters: React.FC<InventoryFiltersProps> = ({
  searchQuery,
  onSearchChange,
  categories,
  onCategoryChange,
  filterOptions,
  selectedFilters,
  onFilterChange,
}) => {
  const toggleFilter = (key: keyof SelectedFilters, value: string) => {
    const currentValues = selectedFilters[key] as string[];
    onFilterChange(
      key,
      currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value]
    );
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
        <Input
          placeholder="Search inventory..."
          className="flex-grow"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="flex" variant="outline">
                Filters
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-chevron-down h-4 w-4 opacity-50"
                  aria-hidden="true"
                >
                  <path d="m6 9 6 6 6-6"></path>
                </svg>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="bg-[#1f2937] text-[14px]"
              align="start"
            >
              {/* Clear All Filters Option */}
              <DropdownMenuItem
                onClick={() => {
                  onFilterChange("sizes", []);
                  onFilterChange("brands", []);
                  onFilterChange("ages", []);
                  onFilterChange("colors", []);
                }}
                className="text-sm cursor-pointer"
              >
                Clear All Filters
              </DropdownMenuItem>
              <DropdownMenuSeparator />

              {/* Sizes Filter */}
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  Sizes{" "}
                  {selectedFilters.sizes.length > 0 &&
                    `(${selectedFilters.sizes.length})`}
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="bg-[#1f2937] text-[14px]">
                  <div className="p-2">
                    <div className="flex items-center space-x-2 mb-2">
                      <Checkbox
                        id="select-all-sizes"
                        checked={
                          filterOptions.sizes.length > 0 &&
                          filterOptions.sizes.every((size) =>
                            selectedFilters.sizes.includes(size)
                          )
                            ? true
                            : selectedFilters.sizes.length > 0
                            ? "indeterminate"
                            : false
                        }
                        onCheckedChange={(checked) => {
                          if (checked === true) {
                            onFilterChange("sizes", filterOptions.sizes);
                          } else {
                            onFilterChange("sizes", []);
                          }
                        }}
                      />
                      <label
                        htmlFor="select-all-sizes"
                        className="text-sm font-medium"
                      >
                        Select All Sizes
                      </label>
                    </div>
                    {filterOptions.sizes.map((size) => (
                      <div
                        key={size}
                        className="flex items-center space-x-2 py-1"
                      >
                        <Checkbox
                          id={`size-${size}`}
                          checked={selectedFilters.sizes.includes(size)}
                          onCheckedChange={() => toggleFilter("sizes", size)}
                        />
                        <label htmlFor={`size-${size}`} className="text-sm">
                          {size}
                        </label>
                      </div>
                    ))}
                  </div>
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  Brands{" "}
                  {selectedFilters.brands.length > 0 &&
                    `(${selectedFilters.brands.length})`}
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="bg-[#1f2937] text-[14px]">
                  <div className="p-2">
                    <div className="flex items-center space-x-2 mb-2">
                      <Checkbox
                        id="select-all-brands"
                        checked={
                          filterOptions.brands.length > 0 &&
                          filterOptions.brands.every((brandObj) =>
                            selectedFilters.brands.includes(brandObj?.brand)
                          )
                            ? true
                            : selectedFilters.brands.length > 0
                            ? "indeterminate"
                            : false
                        }
                        onCheckedChange={(checked) => {
                          if (checked === true) {
                            onFilterChange(
                              "brands",
                              filterOptions.brands.map((b) => b.brand)
                            );
                          } else {
                            onFilterChange("brands", []);
                          }
                        }}
                      />
                      <label
                        htmlFor="select-all-brands"
                        className="text-sm font-medium"
                      >
                        Select All Brands
                      </label>
                    </div>
                    {filterOptions.brands.map((brandObj) => (
                      <div
                        key={brandObj.brand}
                        className="flex items-center space-x-2 py-1"
                      >
                        <Checkbox
                          id={`brand-${brandObj.brand}`}
                          checked={selectedFilters.brands.includes(
                            brandObj.brand
                          )}
                          onCheckedChange={() =>
                            toggleFilter("brands", brandObj.brand)
                          }
                        />
                        <label
                          htmlFor={`brand-${brandObj.brand}`}
                          className="text-sm"
                        >
                          {brandObj.brand}
                        </label>
                      </div>
                    ))}
                  </div>
                </DropdownMenuSubContent>
              </DropdownMenuSub>

              {/* Ages Filter */}
              {/* <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  Ages{" "}
                  {selectedFilters.ages.length > 0 &&
                    `(${selectedFilters.ages.length})`}
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="bg-[#1f2937] text-[14px]">
                  <div className="p-2">
                    <div className="flex items-center space-x-2 mb-2">
                      <Checkbox
                        id="select-all-ages"
                        checked={
                          filterOptions.ages.length > 0 &&
                          filterOptions.ages.every((age) =>
                            selectedFilters.ages.includes(age)
                          )
                            ? true
                            : selectedFilters.ages.length > 0
                            ? "indeterminate"
                            : false
                        }
                        onCheckedChange={(checked) => {
                          if (checked === true) {
                            onFilterChange("ages", filterOptions.ages);
                          } else {
                            onFilterChange("ages", []);
                          }
                        }}
                      />
                      <label
                        htmlFor="select-all-ages"
                        className="text-sm font-medium"
                      >
                        Select All Ages
                      </label>
                    </div>
                    {filterOptions.ages.map((age) => (
                      <div
                        key={age}
                        className="flex items-center space-x-2 py-1"
                      >
                        <Checkbox
                          id={`age-${age}`}
                          checked={selectedFilters.ages.includes(age)}
                          onCheckedChange={() => toggleFilter("ages", age)}
                        />
                        <label htmlFor={`age-${age}`} className="text-sm">
                          {age}
                        </label>
                      </div>
                    ))}
                  </div>
                </DropdownMenuSubContent>
              </DropdownMenuSub> */}

              {/* Colors Filter with Swatches */}
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  Colors{" "}
                  {selectedFilters.colors.length > 0 &&
                    `(${selectedFilters.colors.length})`}
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="bg-[#1f2937] text-[14px]">
                  <div className="p-2">
                    <div className="flex items-center space-x-2 mb-2">
                      <Checkbox
                        id="select-all-colors"
                        checked={
                          filterOptions.colors.length > 0 &&
                          filterOptions.colors.every((color) =>
                            selectedFilters.colors.includes(color)
                          )
                            ? true
                            : selectedFilters.colors.length > 0
                            ? "indeterminate"
                            : false
                        }
                        onCheckedChange={(checked) => {
                          if (checked === true) {
                            onFilterChange("colors", filterOptions.colors);
                          } else {
                            onFilterChange("colors", []);
                          }
                        }}
                      />
                      <label
                        htmlFor="select-all-colors"
                        className="text-sm font-medium"
                      >
                        Select All Colors
                      </label>
                    </div>
                    {filterOptions.colors.map((color) => (
                      <div
                        key={color}
                        className="flex items-center space-x-2 py-1"
                      >
                        <Checkbox
                          id={`color-${color}`}
                          checked={selectedFilters.colors.includes(color)}
                          onCheckedChange={() => toggleFilter("colors", color)}
                        />
                        <label htmlFor={`color-${color}`} className="text-sm">
                          {color}
                        </label>
                      </div>
                    ))}
                  </div>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="min-w-[200px]">
          <Select
            onValueChange={onCategoryChange}
            value={selectedFilters.category}
          >
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder={
                  categories.length === 0 ? "No categories" : "All Categories"
                }
              />
            </SelectTrigger>
            <SelectContent className="h-[250px] overflow-y-auto">
              {categories.length === 0 ? (
                <SelectItem disabled value="no-categories">
                  No categories available
                </SelectItem>
              ) : (
                <>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default InventoryFilters;
