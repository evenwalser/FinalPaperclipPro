import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Upload } from 'lucide-react'

export interface POSSettingsProps {
  acceptCash: boolean;
  setAcceptCash: React.Dispatch<React.SetStateAction<boolean>>;
  acceptCard: boolean;
  setAcceptCard: React.Dispatch<React.SetStateAction<boolean>>;
  receiptLogo: string | null;
  setReceiptLogo: React.Dispatch<React.SetStateAction<string | null>>;
  receiptMessage: string;
  setReceiptMessage: React.Dispatch<React.SetStateAction<string>>;
}

export function POSSettings({ ...props }: POSSettingsProps) {
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        props.setReceiptLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">POS Settings</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">Manage your point-of-sale preferences</p>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Accepted Payment Methods</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
            <Switch id="cash-toggle" checked={props.acceptCash} onCheckedChange={props.setAcceptCash} />
            <Label htmlFor="cash-toggle" className="text-gray-700 dark:text-gray-300">Cash</Label>
          </div>
          <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
            <Switch id="card-toggle" checked={props.acceptCard} onCheckedChange={props.setAcceptCard} />
            <Label htmlFor="card-toggle" className="text-gray-700 dark:text-gray-300">Card</Label>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Receipt Customization</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="receipt-logo-upload" className="text-gray-700 dark:text-gray-300 mb-2 block">Upload Receipt Logo</Label>
            <div className="flex items-center space-x-4">
              <Label
                htmlFor="receipt-logo-upload"
                className="cursor-pointer bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold py-2 px-4 rounded inline-flex items-center transition-colors duration-200"
              >
                <Upload className="w-4 h-4 mr-2" />
                <span>Choose file</span>
              </Label>
              <Input
                id="receipt-logo-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>
          </div>
          <div className="mt-2 h-20 w-40 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
            {props.receiptLogo ? (
              <img src={props.receiptLogo} alt="Receipt Logo" className="max-h-full max-w-full object-contain" />
            ) : (
              <span className="text-gray-500 dark:text-gray-400">Logo Preview</span>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Receipt Message</h3>
        <Textarea
          id="receipt-message"
          placeholder="Thank you for shopping with us!"
          className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 h-24 resize-none"
          value={props.receiptMessage}
          onChange={(e) => props.setReceiptMessage(e.target.value)}
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

