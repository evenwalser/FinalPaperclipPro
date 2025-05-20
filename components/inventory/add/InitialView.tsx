import { Button } from "@/components/ui/button";
import { Camera, Upload } from "lucide-react";

interface InitialViewProps {
  onCameraClick: () => void;
  onFileSelectClick: () => void;
}

export default function InitialView({ onCameraClick, onFileSelectClick }: InitialViewProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Button variant="outline" className="h-32 text-lg" onClick={onCameraClick}>
        <Camera className="mr-2 h-6 w-6" />
        Take Photo
      </Button>
      <Button variant="outline" className="h-32 text-lg" onClick={onFileSelectClick}>
        <Upload className="mr-2 h-6 w-6" />
        Choose File
      </Button>
    </div>
  );
}