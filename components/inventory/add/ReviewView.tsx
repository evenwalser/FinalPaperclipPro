import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X, Camera, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { Reorder } from "framer-motion";
import ImageCarousel from "./ImageCarousel";

interface ImageFile {
  url: string;
  file: File | null;
  filepath: string | null;
}

interface ReviewViewProps {
  images: ImageFile[];
  currentImageIndex: number;
  onReorder: (newOrder: ImageFile[]) => void;
  onRemove: (index: number) => void;
  onSelect: (index: number) => void;
  onAddMore: () => void;
  onContinue: () => void;
}

const isImageFile = (url: string) => {
  if (url.startsWith('data:')) {
    return url.includes('image/');
  }
  return /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
};

export default function ReviewView({ images, currentImageIndex, onReorder, onRemove, onSelect, onAddMore, onContinue }: ReviewViewProps) {
  return (
    <div className="space-y-6">
      <ImageCarousel images={images} currentIndex={currentImageIndex} onNavigate={onSelect} />
      <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-4">
        <Reorder.Group axis="x" values={images} onReorder={onReorder} className="flex gap-3 overflow-x-auto py-2 px-1">
          {images.map((image, index) => (
            <Reorder.Item
              key={image.url}
              value={image}
              className={cn(
                "relative flex-shrink-0 cursor-move group rounded-lg overflow-hidden",
                index === currentImageIndex && "ring-2 ring-red-500"
              )}
            >
              <div onClick={() => onSelect(index)} className="w-20 h-20 relative z-10">
                {isImageFile(image.url) ? (
                  <img src={image.url} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover rounded-lg" draggable={false} />
                ) : (
                  <video src={image.url} className="w-full h-full object-contain rounded-lg pointer-events-none" draggable={false}>
                    Your browser does not support the video tag.
                  </video>
                )}
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-1 right-1 h-5 w-5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  onClick={(e) => { e.stopPropagation(); onRemove(index); }}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      </div>
      <div className="flex gap-4">
        <Button variant="outline" onClick={onAddMore} className="flex-1">
          <Camera className="mr-2 h-4 w-4" />
          Add More
        </Button>
        <Button variant="outline" onClick={onContinue} className="flex-1">
          Continue to Details
        </Button>
      </div>
    </div>
  );
}