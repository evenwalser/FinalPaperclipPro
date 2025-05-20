"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import validator from 'validator';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { Upload } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { User } from "next-auth";
import { toast } from "sonner";
import { InviteForm } from "@/components/InviteForm";
import SendInviteForm from "@/components/SendInviteForm";
import { useUser } from "@/app/contexts/UserContext";

interface Address {
  line_1: string;
  line_2: string;
  post_town: string;
  postcode: string;
  county: string;
}

export function StoreProfileSettings() {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [logo, setLogo] = useState<string | null>(null);
  const [storefrontImage, setStorefrontImage] = useState<string | null>(null);
  const [postcode, setPostcode] = useState("");
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [isManualEdit, setIsManualEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user: contextUser, refreshUser } = useUser();
  const [storeDetails, setStoreDetails] = useState({
    name: "",
    phone: "",
    email: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isValidPostcode, setIsValidPostcode] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({
    storeName: '',
    phone: '',
    email: '',
    address: ''
  });
  const router = useRouter();


  useEffect(() => {
    const getSessionAndStore = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        // Fetch existing store data
        const { data: storeData, error } = await supabase
          .from("stores")
          .select("*")
          .eq("owner_id", user.id)
          .single();

        if (storeData) {
          setStoreDetails({
            name: storeData.store_name,
            phone: storeData.contact_details?.phone || "",
            email: storeData.contact_details?.email || "",
          });
          setSelectedAddress(storeData.address || null);
          setLogo(storeData.store_logo);
          setStorefrontImage(storeData.storefront_image);
          if (storeData.address) {
            setPostcode(storeData.address.postcode);
          }
        }
      }
    };
    getSessionAndStore();
  }, []);

  const handleRefresh = async () => {
    await refreshUser();
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    imageType: "logo" | "storefront"
  ) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    // Delete previous image if exists
    const currentImageUrl = imageType === "logo" ? logo : storefrontImage;
    let pathToDelete = "";

    if (currentImageUrl) {
      try {
        // Extract path from URL
        const urlParts = currentImageUrl.split("/");
        const bucket = urlParts[3];
        const fileName = urlParts.slice(4).join("/");
        pathToDelete = fileName;
      } catch (error) {
        console.error("Error parsing image URL:", error);
      }
    }

    const fileExt = file.name.split(".").pop();
    const fileName = `${user.id}/${imageType}-${Date.now()}.${fileExt}`;

    try {
      if (pathToDelete) {
        const { error: deleteError } = await supabase.storage
          .from("store-images")
          .remove([pathToDelete]);

        if (deleteError) throw deleteError;
      }

      const { error: uploadError } = await supabase.storage
        .from("store-images")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });
        console.log('here is upload error', uploadError)
      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("store-images").getPublicUrl(fileName);

      if (imageType === "logo") {
        setLogo(publicUrl);
      } else {
        setStorefrontImage(publicUrl);
      }

      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Upload failed", {
        description:
          error instanceof Error ? error.message : "Could not upload image",
      });
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    
    // Reset form errors
    setFormErrors({
      storeName: '',
      phone: '',
      email: '',
      address: ''
    });

    let hasErrors = false;

    // Validate store name
    if (!storeDetails.name.trim()) {
      setFormErrors(prev => ({ ...prev, storeName: 'Store name is required' }));
      hasErrors = true;
    }

    // Validate phone
    if (!validator.isMobilePhone(storeDetails.phone, 'any', { strictMode: false })) {
      setFormErrors(prev => ({ ...prev, phone: 'Please enter a valid phone number' }));
      hasErrors = true;
    }

    // Validate email
    if (!validator.isEmail(storeDetails.email)) {
      setFormErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }));
      hasErrors = true;
    }

    // Validate address
    if (!selectedAddress) {
      setFormErrors(prev => ({ ...prev, address: 'Please select or enter an address' }));
      hasErrors = true;
    }

    if (hasErrors) {
      setIsSubmitting(false);
      return;
    }

    try {
      // Upsert the store data into the 'stores' table
      // Upsert the store data into the 'stores' table
      const { data, error: storeError } = await supabase.from("stores").upsert(
        {
          owner_id: user?.id,
          store_name: storeDetails.name,
          contact_details: {
            phone: storeDetails.phone,
            email: storeDetails.email,
          },
          address: selectedAddress,
          store_logo: logo,
          storefront_image: storefrontImage,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "owner_id",
        }
      );

      if (storeError) {
        throw storeError;
      }

      // After upsert, explicitly fetch the store to ensure you have the full data with id
      const { data: storeData, error: fetchError } = await supabase
        .from("stores")
        .select("id") // Select the ID and any other fields you need
        .eq("owner_id", user?.id)
        .single(); // .single() ensures only one row is returned

      if (fetchError) {
        throw fetchError;
      }

     
      // Update the user's role to 'store_owner' and associate the store_id
      const { error: profileError } = await supabase
        .from("users")
        .update({
          role: "store_owner",
          store_id: storeData?.id,
        })
        .eq("id", user?.id);
   

      if (profileError) throw profileError;

      handleRefresh(); // Refresh user data to reflect changes

      // Redirect to the dashboard after successful profile update
      
      router.push('/');
      toast.success("Store profile saved", {
        description: "Your store details have been successfully updated",
      });
     
    } catch (err) {
      console.error("Submission error:", err);
      toast.error("Submission failed", {
        description:
          err instanceof Error ? err.message : "Could not save store profile",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePostcodeLookup = async () => {
    setError(null);
    setAddresses([]);

    const postcodeRegex = /^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i;
    if (!postcodeRegex.test(postcode)) {
      setIsValidPostcode(false);
      setError("Please enter a valid postcode");
      return;
    }

    setIsLoading(true);
    setIsValidPostcode(true);

    try {
      const formattedPostcode = postcode.replace(/\s/g, "");
      const response = await fetch(
        `https://api.ideal-postcodes.co.uk/v1/postcodes/${formattedPostcode}?api_key=ak_m4cyo8cboJvXHXWlphQPCNLYRAHfq`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to lookup postcode");
      }

      if (!data.result || data.result.length === 0) {
        setError("No addresses found for this postcode");
        return;
      }

      const formattedAddresses = data.result.map((item: any) => ({
        line_1: item.line_1 || "",
        line_2: item.line_2 || "",
        post_town: item.post_town || "",
        postcode: item.postcode || "",
        county: item.county || "",
      }));

      setAddresses(formattedAddresses);

      if (formattedAddresses.length === 1) {
        handleAddressSelect(formattedAddresses[0]);
      }
    } catch (error) {
      console.error("Error looking up postcode:", error);
      setError(
        error instanceof Error ? error.message : "Failed to lookup postcode"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddressSelect = (address: Address) => {
    setSelectedAddress(address);
    setIsManualEdit(false);
  };

  return (
    <Card>
      <CardHeader style={{ paddingTop: 0 }}>
        <CardTitle>Store Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Store Images Section */}
        {/* <InviteForm storeId={14} storeName={storeOwener} /> */}
        {/* <SendInviteForm /> */}
        <div className="space-y-4">
          <div className="space-y-4">
            <Label>Store Images</Label>
            <div className="flex gap-4">
              {/* Logo Upload */}
              <div className="flex-1">
                <Label htmlFor="logo-upload" className="block mb-2">
                  Store Logo  
                </Label>
                <div className="flex flex-col items-center space-y-2">
                  <Label
                    htmlFor="logo-upload"
                    className="cursor-pointer inline-flex items-center px-4 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-[8px] hover:bg-gray-50 dark:hover:bg-gray-700 w-full"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Logo
                  </Label>
                  <Input
                    id="logo-upload"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, "logo")}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Storefront Upload */}
              <div className="flex-1">
                <Label htmlFor="storefront-upload" className="block mb-2">
                  Storefront Image
                </Label>
                <div className="flex flex-col items-center space-y-2">
                  <Label
                    htmlFor="storefront-upload"
                    className="cursor-pointer inline-flex items-center px-4 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-[8px] hover:bg-gray-50 dark:hover:bg-gray-700 w-full"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Storefront
                  </Label>
                  <Input
                    id="storefront-upload"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, "storefront")}
                    className="hidden"
                  />
                </div>
              </div>
            </div>

            {/* Image Previews */}
            <div className="flex flex-wrap gap-4 mt-4">
              {logo && (
                <div className="relative w-32 h-32">
                  <img
                    src={logo}
                    alt="Store Logo"
                    className="w-full h-full object-cover rounded"
                  />
                  <span className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs py-1 text-center">
                    Logo
                  </span>
                </div>
              )}
              {storefrontImage && (
                <div className="relative w-32 h-32">
                  <img
                    src={storefrontImage}
                    alt="Storefront"
                    className="w-full h-full object-cover rounded"
                  />
                  <span className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs py-1 text-center">
                    Storefront
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Address Section */}
        <div className="space-y-4">
          <Label>Address</Label>
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                placeholder="Enter postcode"
                value={postcode}
                onChange={(e) => {
                  setPostcode(e.target.value.toUpperCase());
                  setError(null);
                  setIsValidPostcode(true);
                }}
                className={!isValidPostcode ? "border-red-500" : ""}
              />
              {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
            </div>
            <Button
              onClick={handlePostcodeLookup}
              disabled={isLoading || !postcode}
              className="min-w-[100px] bg-[#dc2626] text-[#fff] rounded-[8px] border-[1px] border-[solid] border-[#dc2626] hover:text-[#dc2626]"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Loading...
                </div>
              ) : (
                "Lookup"
              )}
            </Button>
          </div>

          {addresses.length > 0 && (
            <div className="space-y-2">
              <Label>Select your address</Label>
              <Select
                onValueChange={(value) =>
                  handleAddressSelect(JSON.parse(value))
                }
              >
                <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                  <SelectValue placeholder="Choose an address" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 h-[300px]">
                  {addresses.map((address, index) => (
                    <SelectItem
                      key={index}
                      value={JSON.stringify(address)}
                      className="hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700 cursor-pointer"
                    >
                      {[address.line_1, address.line_2, address.post_town]
                        .filter(Boolean)
                        .join(", ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {selectedAddress && (
            <div className="space-y-2">
              <Input
                placeholder="Address Line 1"
                className="store-adress-input"
                value={selectedAddress.line_1}
                readOnly={!isManualEdit}
                onChange={(e) =>
                  setSelectedAddress({
                    ...selectedAddress,
                    line_1: e.target.value,
                  })
                }
              />
              <Input
                placeholder="Address Line 2"
                className="store-adress-input"
                value={selectedAddress.line_2}
                readOnly={!isManualEdit}
                onChange={(e) =>
                  setSelectedAddress({
                    ...selectedAddress,
                    line_2: e.target.value,
                  })
                }
              />
              <Input
                placeholder="Town/City"
                className="store-adress-input"
                value={selectedAddress.post_town}
                readOnly={!isManualEdit}
                onChange={(e) =>
                  setSelectedAddress({
                    ...selectedAddress,
                    post_town: e.target.value,
                  })
                }
              />
              <Input
                placeholder="County"
                className="store-adress-input"
                value={selectedAddress.county}
                readOnly={!isManualEdit}
                onChange={(e) =>
                  setSelectedAddress({
                    ...selectedAddress,
                    county: e.target.value,
                  })
                }
              />
              <Input
                placeholder="Postcode"
                className="store-adress-input"
                value={selectedAddress.postcode}
                readOnly={!isManualEdit}
                onChange={(e) =>
                  setSelectedAddress({
                    ...selectedAddress,
                    postcode: e.target.value,
                  })
                }
              />
              <div className="flex justify-end">
                <Button
                  variant="link"
                  onClick={() => setIsManualEdit(!isManualEdit)}
                >
                  {isManualEdit ? "Finish Editing" : "Edit Manually"}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Store Details Section */}
        <div className="space-y-4">
          <Label>Store Details</Label>
          <div className="space-y-2">
            <Input
              placeholder="Store Name"
              value={storeDetails.name}
              onChange={(e) => setStoreDetails({ ...storeDetails, name: e.target.value })}
              className={formErrors.storeName ? 'border-red-500' : ''}
            />
            {formErrors.storeName && (
              <p className="text-sm text-red-500">{formErrors.storeName}</p>
            )}
          </div>

          <div className="space-y-2">
            <Input
              placeholder="Phone Number"
              value={storeDetails.phone}
              onChange={(e) => setStoreDetails({ ...storeDetails, phone: e.target.value })}
              className={formErrors.phone ? 'border-red-500' : ''}
            />
            {formErrors.phone && (
              <p className="text-sm text-red-500">{formErrors.phone}</p>
            )}
          </div>

          <div className="space-y-2">
            <Input
              placeholder="Store Email"
              type="email"
              value={storeDetails.email}
              onChange={(e) => setStoreDetails({ ...storeDetails, email: e.target.value })}
              className={formErrors.email ? 'border-red-500' : ''}
            />
            {formErrors.email && (
              <p className="text-sm text-red-500">{formErrors.email}</p>
            )}
          </div>
        </div>

        {/* Add address error message */}
        {formErrors.address && (
          <p className="text-sm text-red-500 mt-2">{formErrors.address}</p>
        )}

        <div className="text-end">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-[#FF3B30] hover:bg-[#E6352B] text-white rounded-[8px]"
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Saving...
              </div>
            ) : (
              "Save Changes"
            )}
          </Button>
          {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
        </div>
      </CardContent>
    </Card>
  );
}
