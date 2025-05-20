// EditItemPage.tsx
"use client";
import { v4 as uuidv4 } from "uuid";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Tags, Wand2 } from "lucide-react";
import ImageSection from "@/components/inventory/edit/ImageSection";
import BasicInfo from "@/components/inventory/edit/BasicInfo";
import CategorySelector from "@/components/inventory/edit/CategorySelector";
import ConditionSelector from "@/components/inventory/edit/ConditionSelector";
import SizeSelector from "@/components/inventory/edit/SizeSelector";
import AvailabilityToggles from "@/components/inventory/edit/AvailabilityToggles";
import { getUser } from "@/lib/services/items";
import { analyzeImage } from "@/lib/together";
import {
  Category,
  ItemImage,
  ItemType,
} from "@/components/inventory/edit/types";

interface BrandSuggestion {
  name: string;
  logo_url: string;
}

interface User {
  id: string;
  store_id: string;
}

export default function EditItemPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const supabase = createClient();

  // State declarations
  const [item, setItem] = useState<ItemType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [images, setImages] = useState<ItemImage[]>([]);
  const [age, setAge] = useState<string>("");
  const [ages, setAges] = useState<{ id: string; name: string }[]>([]);
  const [colors, setColors] = useState<{ id: string; name: string }[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [previousQuantity, setPreviousQuantity] = useState<
    number | undefined
  >();
  const [selectedCategories, setSelectedCategories] = useState({
    level1: "",
    level2: "",
    level3: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [itemDetails, setItemDetails] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "1",
    condition: "New",
    size: "",
    brand: "",
    age: "",
    color: "",
    availableInStore: true,
    listOnPaperclip: true,
  });
  const [fieldErrors, setFieldErrors] = useState({
    name: "",
    price: "",
    images: "",
    category: "",
  });

  const [brandSuggestions, setBrandSuggestions] = useState<BrandSuggestion[]>(
    []
  );
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [logoUrl, setLogoUrl] = useState("");
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      const userData = await getUser();
      setUser(userData);

      const { data: categoriesData } = await supabase
        .from("categories")
        .select("*")
        .order("display_order", { ascending: true });
      if (categoriesData) setCategories(categoriesData);

      const { data: colorsData, error: colorsError } = await supabase
        .from("colors")
        .select("*");
      if (colorsError) console.error("Error fetching colors:", colorsError);
      else setColors(colorsData || []);

      const { data: agesData, error: agesError } = await supabase
        .from("ages")
        .select("*")
        .order("name", { ascending: true });
      if (agesError) console.error("Error fetching ages:", agesError);
      else setAges(agesData || []);

      const { data: itemData } = await supabase
        .from("items")
        .select("*, item_images (*)")
        .eq("id", id)
        .single();

      if (itemData) {
        setItem(itemData);
        setImages(itemData.item_images || []);
        setItemDetails({
          name: itemData.title,
          description: itemData.description,
          price: itemData.price.toString(),
          quantity: itemData.quantity?.toString() || "1",
          condition: itemData.condition,
          size: itemData.size || "",
          brand: itemData.brand || "",
          age: itemData.age || "",
          color: itemData.color || "",
          availableInStore: itemData.available_in_store,
          listOnPaperclip: itemData.list_on_paperclip,
        });
        setPreviousQuantity(itemData.quantity);
        setLogoUrl(itemData.logo_url || "");
        setSelectedTags(itemData.tags || []);

        const categoryId = itemData.category_id;
        const category = categoriesData?.find((c) => c.id === categoryId);
        if (category) {
          const parent = categoriesData?.find(
            (c) => c.id === category.parent_id
          );
          const grandParent = parent
            ? categoriesData?.find((c) => c.id === parent.parent_id)
            : null;

          setSelectedCategories({
            level1: grandParent?.id || parent?.id || categoryId,
            level2:
              parent?.id || (categoryId !== grandParent?.id ? categoryId : ""),
            level3:
              categoryId !== parent?.id && categoryId !== grandParent?.id
                ? categoryId
                : "",
          });
        }
      }
      setIsLoading(false);
    };

    fetchData();
  }, [id, supabase]);

  const handleBrandChange = async (value: string) => {
    setItemDetails((prev) => ({ ...prev, brand: value }));
    if (value.length > 2) {
      try {
        const response = await fetch(
          `/api/logo-search?q=${encodeURIComponent(value)}`
        );
        if (!response.ok) throw new Error("Failed to fetch brand suggestions");
        const data = await response.json();
        setBrandSuggestions(data);
        setShowSuggestions(true);
      } catch (error) {
        console.error("Error fetching brand suggestions:", error);
        setBrandSuggestions([]);
        setShowSuggestions(false);
      }
    } else {
      setBrandSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleBrandSelect = (selectedBrand: BrandSuggestion) => {
    setItemDetails((prev) => ({ ...prev, brand: selectedBrand.name }));
    setLogoUrl(selectedBrand.logo_url || "");
    setShowSuggestions(false);
  };

  // Handlers
  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files?.length) return;

    const webpFiles = Array.from(files).filter(
      (file) => file.type === "image/webp"
    );
    if (webpFiles.length > 0) {
      toast.error(
        "WEBP images are not supported. Please upload images in JPEG, PNG, or GIF format."
      );
      return;
    }

    try {
      const newImages = await Promise.all(
        Array.from(files).map(async (file) => {
          const filePath = `items/${id}/${Date.now()}-${file.name}`;
          const { error } = await supabase.storage
            .from("item-images")
            .upload(filePath, file);
          if (error) throw error;
          const {
            data: { publicUrl },
          } = supabase.storage.from("item-images").getPublicUrl(filePath);
          console.log("🚀 ~ Array.from ~ publicUrl:", publicUrl);
          return { id: "", image_url: publicUrl, filepath: filePath, file };
        })
      );
      setImages((prev) => [...prev, ...newImages]);
    } catch (error) {
      toast.error("Error uploading images");
    }
  };

  const handleDeleteImage = async (index: number) => {
    const imageToDelete = images[index];
    if (!imageToDelete) return;

    try {
      if (imageToDelete.id) {
        await supabase.storage
          .from("item-images")
          .remove([imageToDelete.filepath]);
        await supabase.from("item_images").delete().eq("id", imageToDelete.id);
      } else {
        await supabase.storage
          .from("item-images")
          .remove([imageToDelete.filepath]);
      }
      setImages((prev) => prev.filter((_, i) => i !== index));
      setCurrentImageIndex((prev) => Math.min(prev, images.length - 2));
    } catch (error) {
      toast.error("Error deleting image");
    }
  };

  const handleReorder = (newOrder: ItemImage[]) => {
    setImages(newOrder);
  };

  const handleItemDetailsChange = (updates: Partial<typeof itemDetails>) => {
    setItemDetails((prev) => ({ ...prev, ...updates }));
  };

  const handleCategoryChange = (
    level: "level1" | "level2" | "level3",
    value: string
  ) => {
    if (level === "level1") {
      setSelectedCategories({ level1: value, level2: "", level3: "" });
    } else if (level === "level2") {
      setSelectedCategories((prev) => ({ ...prev, level2: value, level3: "" }));
    } else {
      setSelectedCategories((prev) => ({ ...prev, level3: value }));
    }
  };

  const extractJson = (response: string) => {
    try {
      const jsonStart = response.indexOf("{");
      const jsonEnd = response.lastIndexOf("}") + 1;
      if (jsonStart === -1 || jsonEnd === -1)
        throw new Error("No valid JSON found");
      const jsonString = response.substring(jsonStart, jsonEnd).trim();
      const jsonObject = JSON.parse(jsonString);
      if (typeof jsonObject !== "object" || jsonObject === null)
        throw new Error("Not a valid JSON object");
      return jsonObject;
    } catch (error) {
      console.error("Error extracting JSON:", error);
      return null;
    }
  };

  const handleAIAnalysis = async () => {
    if (!images.length) {
      toast.error("Please add at least one image to analyze");
      return;
    }

    setIsAnalyzing(true);
    try {
      const formData = new FormData();
      images.forEach((image) => {
        if (/\.(jpg|jpeg|png|gif|webp)$/i.test(image.image_url)) {
          formData.append("image", image.image_url);
        }
      });

      const result = await analyzeImage(formData);
      const dataObject =
        extractJson(result?.data?.choices?.[0]?.message?.content) || {};

      setItemDetails((prev) => ({
        ...prev,
        name: dataObject.title || prev.name,
        description: dataObject.description || prev.description,
        price: dataObject.price_avg?.toString() || prev.price,
        condition: dataObject.condition || prev.condition,
        size: dataObject.size || prev.size,
        brand: dataObject.brand || prev.brand,
        age: dataObject.age || prev.age,
        color: dataObject.color || prev.color,
      }));
      setSuggestedTags(dataObject.tags || []); // Set AI-suggested tags
      setSelectedTags((prev) =>
        Array.from(new Set([...prev, ...(dataObject.tags || [])]))
      );

      if (dataObject.category_id) {
        const categoryNames = dataObject.category_id.split(" > ");
        const level1 = categories.find((cat) => cat.name === categoryNames[0]);
        const level2 = categories.find(
          (cat) => cat.name === categoryNames[1] && cat.parent_id === level1?.id
        );
        const level3 = categories.find(
          (cat) => cat.name === categoryNames[2] && cat.parent_id === level2?.id
        );

        setSelectedCategories({
          level1: level1?.id || "",
          level2: level2?.id || "",
          level3: level3?.id || "",
        });
      }
    } catch (error) {
      console.error("AI analysis error:", error);
      toast.error("AI analysis failed");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSave = async () => {
    if (!item) return;

    setFieldErrors({ name: "", price: "", images: "", category: "" });
    let hasErrors = false;
    const newErrors = { name: "", price: "", images: "", category: "" };

    if (!itemDetails.name.trim()) {
      newErrors.name = "Item name is required";
      hasErrors = true;
    }
    if (
      !itemDetails.price ||
      isNaN(parseFloat(itemDetails.price)) ||
      parseFloat(itemDetails.price) <= 0
    ) {
      newErrors.price = "Valid price is required";
      hasErrors = true;
    }
    const filteredImages = images.filter((image) => {
      const url = image.image_url || "";
      
      // Check file extensions
      if (/\.(jpg|jpeg|png|gif|webp)$/i.test(url)) return true;
      
      // Check Shopify URLs
      if (url.includes('shopify.com')) {
        return url.includes('/files/') && !url.includes('.mp4') && !url.includes('.webm');
      }
      
      return false;
    });
    
    if (filteredImages.length === 0) {
      newErrors.images = "At least one image is required";
      hasErrors = true;
    }
    if (!selectedCategories.level1) {
      newErrors.category = "Please select a main category";
      hasErrors = true;
    }

    if (hasErrors) {
      setFieldErrors(newErrors);
      return;
    }

    setIsSaving(true);
    try {
      const selectedColor = colors.find((c) => c.name === itemDetails.color);
      const selectedAge = ages.find((a) => a.name === itemDetails.age);
      // Update the item details in the database
      const { error: itemError } = await supabase
        .from("items")
        .update({
          title: itemDetails.name,
          description: itemDetails.description,
          price: parseFloat(itemDetails.price) || 0,
          quantity: parseInt(itemDetails.quantity) || 0,
          category_id:
            selectedCategories.level3 ||
            selectedCategories.level2 ||
            selectedCategories.level1,
          condition: itemDetails.condition,
          size: itemDetails.size,
          brand: itemDetails.brand,
          logo_url: logoUrl,  
          age: itemDetails.age,
          color: itemDetails.color,
          age_id: selectedAge?.id || null,
          color_id: selectedColor?.id || null,
          available_in_store: itemDetails.availableInStore,
          list_on_paperclip: itemDetails.listOnPaperclip,
          tags: selectedTags,
        })
        .eq("id", item.id);

      if (itemError) throw itemError;

      const imageUploads = await Promise.all(
        images.map(async (image, index) => {
          if (image.id) {
            return {
              id: image.id,
              item_id: item.id,
              image_url: image.image_url,
              display_order: index,
              shopify_media_id: image.shopify_media_id,
            };
          }

          const newId = uuidv4();
          const fileExt = image.image_url.split(".").pop();
          const fileName = `${user?.id}/${
            item.id
          }/${crypto.randomUUID()}.${fileExt}`;
          let fileData: Blob;

          if (image.file) {
            fileData = image.file;
          } else {
            const response = await fetch(image.image_url);
            fileData = await response.blob();
          }

          // Upload the new image
          const { error: uploadError } = await supabase.storage
            .from("item-images")
            .upload(fileName, fileData, {
              cacheControl: "3600",
              upsert: false,
            });
          if (uploadError) throw uploadError;

          const {
            data: { publicUrl },
          } = supabase.storage.from("item-images").getPublicUrl(fileName);

          return {
            id: newId,
            item_id: item.id,
            image_url: publicUrl,
            display_order: index,
          };
        })
      );

      // Delete old images that are no longer associated with this item
      const existingIds = images.filter((img) => img.id).map((img) => img.id);
      await supabase
        .from("item_images")
        .delete()
        .eq("item_id", item.id)
        .not("id", "in", `(${existingIds.join(",")})`);

      // Insert new images if necessary
      if (imageUploads.length > 0) {
        const { error: imageError } = await supabase
          .from("item_images")
          .upsert(imageUploads, { onConflict: "id" });
        if (imageError) throw imageError;
      }

      if (
        itemDetails.listOnPaperclip &&
        item?.paperclip_marketplace_id &&
        user?.id
      ) {
        try {
          const selectedCategoryId =
            selectedCategories.level3 ||
            selectedCategories.level2 ||
            selectedCategories.level1;
          const selectedCategory = categories.find(
            (cat) => cat.id === selectedCategoryId
          );
          const paperclipCategoryId =
            selectedCategory?.paperclip_marketplace_id;

          if (!paperclipCategoryId) {
            toast.error(
              "Selected category does not have a Paperclip marketplace ID. Cannot update on Paperclip."
            );
            return;
          }

          const formData = new FormData();

          // Append basic fields
          formData.append("userId", user.id);
          formData.append("paperclipItemId", item.paperclip_marketplace_id);
          formData.append("name", itemDetails.name.trim());
          formData.append("description", itemDetails.description.trim());
          formData.append("price", itemDetails.price);
          formData.append("quantity", itemDetails.quantity.toString());
          formData.append("condition", itemDetails.condition);
          formData.append("size", itemDetails.size || "");
          formData.append("brand", itemDetails.brand || "");
          formData.append("age", itemDetails.age || "");
          formData.append("color", itemDetails.color || "");
          formData.append("tags", JSON.stringify(selectedTags));
          formData.append("categoryId", paperclipCategoryId.toString());
          formData.append("colorId", selectedColor?.id || "")

          // Append image files
          await Promise.all(
            imageUploads.map(async (img, index) => {
              if (img.image_url) {
                try {
                  const response = await fetch(img.image_url);
                  const blob = await response.blob();
                  formData.append("media", blob, `image-${index}.jpg`);
                } catch (error) {
                  console.error(`Error processing image ${index}:`, error);
                }
              }
            })
          );

          // Send the POST request with FormData
          const updateResponse = await fetch("/api/paperclip/update-item", {
            method: "POST",
            body: formData,
          });

          if (!updateResponse.ok) {
            const errorText = await updateResponse.text();
            throw new Error(`Paperclip update failed: ${errorText}`);
          }

          const updateResult = await updateResponse.json();
          console.log("Paperclip update result:", updateResult);
        } catch (err) {
          console.error("Error updating item on Paperclip:", err);
          toast.error("Failed to update item on Paperclip.");
        }
      }

      if (item.shopify_product_id && user?.store_id) {
        try {
          const response = await fetch("/api/shopify/update-product", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              storeId: user.store_id,
              itemId: item.id,
              previousQuantity,
            }),
          });
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
              errorData.error || "Failed to update Shopify product"
            );
          }
        } catch (error) {
          console.error("Shopify update error:", error);
          toast.error("Failed to sync with Shopify, but local changes saved");
        }
      }

      images.forEach((image) => URL.revokeObjectURL(image.image_url));
      router.push("/inventory");
      toast.success("Item updated successfully");
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Error saving changes");
    } finally {
      setIsSaving(false);
    }
  };

  // const handleSave = async () => {
  //   if (!item) return;

  //   setFieldErrors({ name: "", price: "", images: "", category: "" });
  //   let hasErrors = false;
  //   const newErrors = { name: "", price: "", images: "", category: "" };

  //   if (!itemDetails.name.trim()) {
  //     newErrors.name = "Item name is required";
  //     hasErrors = true;
  //   }
  //   if (
  //     !itemDetails.price ||
  //     isNaN(parseFloat(itemDetails.price)) ||
  //     parseFloat(itemDetails.price) <= 0
  //   ) {
  //     newErrors.price = "Valid price is required";
  //     hasErrors = true;
  //   }
  //   const filteredImages = images.filter((image) =>
  //     /\.(jpg|jpeg|png|gif|webp)$/i.test(image.image_url)
  //   );
  //   if (filteredImages.length === 0) {
  //     newErrors.images = "At least one image is required";
  //     hasErrors = true;
  //   }
  //   if (!selectedCategories.level1) {
  //     newErrors.category = "Please select a main category";
  //     hasErrors = true;
  //   }

  //   if (hasErrors) {
  //     setFieldErrors(newErrors);
  //     return;
  //   }

  //   setIsSaving(true);
  //   try {
  //     // Update the item details in the database
  //     const { error: itemError } = await supabase
  //       .from("items")
  //       .update({
  //         title: itemDetails.name,
  //         description: itemDetails.description,
  //         price: parseFloat(itemDetails.price) || 0,
  //         quantity: parseInt(itemDetails.quantity) || 0,
  //         category_id:
  //           selectedCategories.level3 ||
  //           selectedCategories.level2 ||
  //           selectedCategories.level1,
  //         condition: itemDetails.condition,
  //         size: itemDetails.size,
  //         brand: itemDetails.brand,
  //         logo_url: logoUrl,
  //         age: itemDetails.age,
  //         color: itemDetails.color,
  //         available_in_store: itemDetails.availableInStore,
  //         list_on_paperclip: itemDetails.listOnPaperclip,
  //         tags: selectedTags,
  //       })
  //       .eq("id", item.id);

  //     if (itemError) throw itemError;

  //     const imageUploads = await Promise.all(
  //       images.map(async (image, index) => {
  //         if (image.id) {
  //           return {
  //             id: image.id,
  //             item_id: item.id,
  //             image_url: image.image_url,
  //             display_order: index,
  //             shopify_media_id: image.shopify_media_id,
  //           };
  //         }

  //         const newId = uuidv4();
  //         const fileExt = image.image_url.split(".").pop();
  //         const fileName = `${user?.id}/${item.id}/${crypto.randomUUID()}.${fileExt}`;
  //         let fileData: Blob;

  //         if (image.file) {
  //           fileData = image.file;
  //         } else {
  //           const response = await fetch(image.image_url);
  //           fileData = await response.blob();
  //         }

  //         // Upload the new image
  //         const { error: uploadError } = await supabase.storage
  //           .from("item-images")
  //           .upload(fileName, fileData, {
  //             cacheControl: "3600",
  //             upsert: false,
  //           });
  //         if (uploadError) throw uploadError;

  //         const {
  //           data: { publicUrl },
  //         } = supabase.storage.from("item-images").getPublicUrl(fileName);

  //         return {
  //           id: newId,
  //           item_id: item.id,
  //           image_url: publicUrl,
  //           display_order: index,
  //         };
  //       })
  //     );

  //     // Delete old images that are no longer associated with this item
  //     const existingIds = images.filter((img) => img.id).map((img) => img.id);
  //     await supabase
  //       .from("item_images")
  //       .delete()
  //       .eq("item_id", item.id)
  //       .not("id", "in", `(${existingIds.join(",")})`);

  //     // Insert new images if necessary
  //     if (imageUploads.length > 0) {
  //       const { error: imageError } = await supabase
  //         .from("item_images")
  //         .upsert(imageUploads, { onConflict: "id" });
  //       if (imageError) throw imageError;
  //     }

  //     // const updatedData = {
  //     //   title: itemDetails.name,
  //     //   description: itemDetails.description,
  //     //   price: parseFloat(itemDetails.price) || 0,
  //     //   quantity: parseInt(itemDetails.quantity) || 0,
  //     // };
  //     const updatedQuantity = parseInt(itemDetails.quantity) || 0;

  //     // if (itemDetails.listOnPaperclip && item?.paperclip_marketplace_id && user?.id) {
  //     //   try {
  //     //     const updatePayload = {
  //     //       userId: user.id,
  //     //       paperclipItemId: item.paperclip_marketplace_id,
  //     //       itemDetails: {
  //     //         name: itemDetails.name,
  //     //         description: itemDetails.description,
  //     //         price: itemDetails.price,
  //     //         quantity: parseInt(itemDetails.quantity),
  //     //         condition: itemDetails.condition,
  //     //         size: itemDetails.size,
  //     //         brand: itemDetails.brand,
  //     //         age: itemDetails.age,
  //     //         color: itemDetails.color,
  //     //         tags: selectedTags,
  //     //       },
  //     //       images: imageUploads.map((img) => img.image_url),
  //     //       selectedCategories: {
  //     //         level1: selectedCategories.level1
  //     //           ? parseInt(selectedCategories.level1)
  //     //           : undefined,
  //     //         level2: selectedCategories.level2
  //     //           ? parseInt(selectedCategories.level2)
  //     //           : undefined,
  //     //         level3: selectedCategories.level3
  //     //           ? parseInt(selectedCategories.level3)
  //     //           : undefined,
  //     //       },
  //     //     };

  //     //     const updateResponse = await fetch("/api/paperclip/update-item", {
  //     //       method: "POST",
  //     //       headers: { "Content-Type": "application/json" },
  //     //       body: JSON.stringify(updatePayload),
  //     //     });
  //     //     if (!updateResponse.ok) {
  //     //       const errorText = await updateResponse.text();
  //     //       throw new Error(`Paperclip update failed: ${errorText}`);
  //     //     }
  //     //     const updateResult = await updateResponse.json();
  //     //     console.log("Paperclip update result:", updateResult);
  //     //   } catch (err) {
  //     //     console.error("Error updating item on Paperclip:", err);
  //     //     toast.error("Failed to update item on Paperclip.");
  //     //   }
  //     // }

  //     if (itemDetails.listOnPaperclip && item?.paperclip_marketplace_id && user?.id) {
  //       try {
  //         // Create a FormData object to hold all data and files
  //         const formData = new FormData();

  //         // Append basic fields
  //         formData.append("userId", user.id);
  //         formData.append("paperclipItemId", item.paperclip_marketplace_id);
  //         formData.append("name", itemDetails.name.trim());
  //         formData.append("description", itemDetails.description.trim());
  //         formData.append("price", itemDetails.price);
  //         formData.append("quantity", itemDetails.quantity.toString());
  //         formData.append("condition", itemDetails.condition);
  //         formData.append("size", itemDetails.size || "");
  //         formData.append("brand", itemDetails.brand || "");
  //         formData.append("age", itemDetails.age || "");
  //         formData.append("color", itemDetails.color || "");
  //         formData.append("tags", JSON.stringify(selectedTags));

  //         // Append the selected category (preferring level3, then level2, then level1, defaulting to "1")
  //         const categoryId = selectedCategories.level3 || selectedCategories.level2 || selectedCategories.level1 || "1";
  //         formData.append("categoryId", categoryId);

  //         // First verify if the image has a valid URL and fetch it if needed
  //         const imagePromises = imageUploads.map(async (img, index) => {
  //           if (img.image_url) {
  //             try {
  //               const response = await fetch(img.image_url);
  //               const blob = await response.blob();
  //               formData.append(`images[${index}]`, blob, `image-${index}.jpg`);
  //             } catch (error) {
  //               console.error(`Error processing image ${index}:`, error);
  //             }
  //           }
  //         });

  //         await Promise.all(imagePromises);

  //         // Send the POST request with FormData
  //         const updateResponse = await fetch("/api/paperclip/update-item", {
  //           method: "POST",
  //           body: formData, // No need for Content-Type header; fetch sets it automatically for FormData
  //         });

  //         if (!updateResponse.ok) {
  //           const errorText = await updateResponse.text();
  //           throw new Error(`Paperclip update failed: ${errorText}`);
  //         }

  //         const updateResult = await updateResponse.json();
  //         console.log("Paperclip update result:", updateResult);
  //       } catch (err) {
  //         console.error("Error updating item on Paperclip:", err);
  //         toast.error("Failed to update item on Paperclip.");
  //       }
  //     }
  //     if (item.shopify_product_id && user?.store_id) {
  //       try {
  //         const response = await fetch("/api/shopify/update-product", {
  //           method: "POST",
  //           headers: { "Content-Type": "application/json" },
  //           body: JSON.stringify({
  //             storeId: user.store_id,
  //             itemId: item.id,
  //             previousQuantity,
  //           }),
  //         });
  //         if (!response.ok) {
  //           const errorData = await response.json();
  //           throw new Error(
  //             errorData.error || "Failed to update Shopify product"
  //           );
  //         }
  //       } catch (error) {
  //         console.error("Shopify update error:", error);
  //         toast.error("Failed to sync with Shopify, but local changes saved");
  //       }
  //     }

  //     images.forEach((image) => URL.revokeObjectURL(image.image_url));
  //     router.push("/inventory");
  //     toast.success("Item updated successfully");
  //   } catch (error) {
  //     console.error("Save error:", error);
  //     toast.error("Error saving changes");
  //   } finally {
  //     setIsSaving(false);
  //   }
  // };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-6">
      <Button variant="link" onClick={() => router.back()} className="mb-4">
        ← Back
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>Edit Item</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full max-w-2xl mx-auto space-y-6">
            <ImageSection
              images={images}
              currentImageIndex={currentImageIndex}
              setCurrentImageIndex={setCurrentImageIndex}
              onFileSelect={handleFileSelect}
              onDeleteImage={handleDeleteImage}
              onReorder={handleReorder}
            />
            <BasicInfo
              name={itemDetails.name}
              description={itemDetails.description}
              price={itemDetails.price}
              quantity={itemDetails.quantity}
              brand={itemDetails.brand}
              age={itemDetails.age}
              ages={ages}
              color={itemDetails.color}
              colors={colors}
              onChange={handleItemDetailsChange}
              fieldErrors={{ name: fieldErrors.name, price: fieldErrors.price }}
              onBrandChange={handleBrandChange}
              brandSuggestions={brandSuggestions}
              showSuggestions={showSuggestions}
              onBrandSelect={handleBrandSelect}
              logoUrl={logoUrl}
              selectedTags={selectedTags}
              onTagsChange={setSelectedTags}
            />
            <CategorySelector
              categories={categories}
              selectedCategories={selectedCategories}
              onChange={handleCategoryChange}
              fieldErrors={{ category: fieldErrors.category }}
            />
            <ConditionSelector
              condition={itemDetails.condition}
              onChange={(condition) => handleItemDetailsChange({ condition })}
            />
            <SizeSelector
              size={itemDetails.size}
              onChange={(size) => handleItemDetailsChange({ size })}
            />
            <AvailabilityToggles
              availableInStore={itemDetails.availableInStore}
              onChange={(availableInStore) =>
                handleItemDetailsChange({ availableInStore })
              }
            />
            {fieldErrors.images && (
              <p className="text-sm text-red-500 mt-1">{fieldErrors.images}</p>
            )}
            <div className="flex gap-4">
              <Button
                onClick={handleAIAnalysis}
                disabled={isAnalyzing}
                className="flex-1"
              >
                {isAnalyzing ? (
                  "Analyzing..."
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    AI Optimize
                  </>
                )}
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
