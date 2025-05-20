import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload } from 'lucide-react'
import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, AwaitedReactNode, Key } from "react"

interface Address {
  street: string;
  city: string;
  county: string;
  postcode: string;
}

interface StoreDetails {
  name: string;
  phone: string;
  email: string;
}

interface StoreProfileSettingsProps {
  logo: string | null;
  storefrontImage: string | null;
  setLogo: (value: string | null) => void;
  setStorefrontImage: (value: string | null) => void;
  postcode: string;
  setPostcode: (value: string) => void;
  addresses: Address[];
  setAddresses: (addresses: Address[]) => void;
  selectedAddress: Address | null;
  setSelectedAddress: (address: Address | null) => void;
  isManualEdit: boolean;
  setIsManualEdit: (value: boolean) => void;
  storeDetails: StoreDetails;
  setStoreDetails: (details: StoreDetails) => void;
  handlePostcodeLookup: () => void;
  handleAddressSelect: (address: Address) => void;
}

export function StoreProfileSettings({
  logo,
  storefrontImage,
  setLogo,
  setStorefrontImage,
  postcode,
  setPostcode,
  addresses,
  setAddresses,
  selectedAddress,
  setSelectedAddress,
  isManualEdit,
  setIsManualEdit,
  storeDetails,
  setStoreDetails,
  handlePostcodeLookup,
  handleAddressSelect,
}: StoreProfileSettingsProps) {
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, setter: (value: string | null) => void) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setter(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Store Profile</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">Manage your {`store's`} basic information</p>
      </div>

      <div className="space-y-4">
        <Label className="text-gray-700 dark:text-gray-300">Store Images</Label>
        <div className="flex flex-col items-center space-y-4">
          <Label
            htmlFor="image-upload"
            className="cursor-pointer inline-flex items-center px-6 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300"
          >
            <Upload className="mr-2 h-5 w-5" />
            Upload Logo or Storefront Image
          </Label>
          <Input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e, setLogo)}
            className="hidden"
            multiple
          />
          <p className="text-gray-400 dark:text-gray-500">Upload logo and storefront images (you can select multiple files)</p>
        </div>
        <div className="flex flex-wrap gap-4 mt-4">
          {logo && (
            <div className="relative w-32 h-32">
              <img src={logo} alt="Store Logo" className="w-full h-full object-cover rounded" />
              <span className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs py-1 text-center">Logo</span>
            </div>
          )}
          {storefrontImage && (
            <div className="relative w-32 h-32">
              <img src={storefrontImage} alt="Storefront" className="w-full h-full object-cover rounded" />
              <span className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs py-1 text-center">Storefront</span>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <Label className="text-gray-700 dark:text-gray-300">Address</Label>
        <div className="flex gap-2">
          <Input 
            placeholder="Enter postcode" 
            value={postcode} 
            onChange={(e) => setPostcode(e.target.value)}
            className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
          />
          <Button onClick={handlePostcodeLookup}>Lookup</Button>
        </div>
        {addresses.length > 0 && (
          <Select onValueChange={(value) => handleAddressSelect(JSON.parse(value))}>
            <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
              <SelectValue placeholder="Select an address" />
            </SelectTrigger>
            <SelectContent>
              {addresses.map((address: { street: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; city: string | number | bigint | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined }, index: Key | null | undefined) => (
                <SelectItem key={index} value={JSON.stringify(address)}>
                  {address.street}, {address.city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        {selectedAddress && (
          <div className="space-y-2">
            <Input 
              placeholder="Street Address" 
              value={selectedAddress.street}
              readOnly={!isManualEdit}
              onChange={(e) => setSelectedAddress({...selectedAddress, street: e.target.value})}
              className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
            />
            <Input 
              placeholder="City" 
              value={selectedAddress.city}
              readOnly={!isManualEdit}
              onChange={(e) => setSelectedAddress({...selectedAddress, city: e.target.value})}
              className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
            />
            <Input 
              placeholder="County" 
              value={selectedAddress.county}
              readOnly={!isManualEdit}
              onChange={(e) => setSelectedAddress({...selectedAddress, county: e.target.value})}
              className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
            />
            <div className="flex justify-end">
              <Button variant="link" onClick={() => setIsManualEdit(!isManualEdit)}>
                {isManualEdit ? 'Finish Editing' : 'Edit Manually'}
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <Label className="text-gray-700 dark:text-gray-300">Store Details</Label>
        <Input 
          placeholder="Store Name" 
          value={storeDetails.name}
          onChange={(e) => setStoreDetails({...storeDetails, name: e.target.value})}
          className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
        />
        <Input 
          placeholder="Phone Number" 
          value={storeDetails.phone}
          onChange={(e) => setStoreDetails({...storeDetails, phone: e.target.value})}
          className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
        />
        <Input 
          placeholder="Store Email" 
          type="email"
          value={storeDetails.email}
          onChange={(e) => setStoreDetails({...storeDetails, email: e.target.value})}
          className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400"
        />
      </div>

      <div className="flex justify-end">
        <Button className="bg-[#FF3B30] hover:bg-[#E6352B] text-white font-semibold py-2 px-6 rounded-lg">
          Save Changes
        </Button>
      </div>
    </div>
  )
}

