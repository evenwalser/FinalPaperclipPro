// ImageSection.tsx
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Upload, X } from "lucide-react";
import { Reorder } from "framer-motion";
import { cn } from "@/lib/utils";
import { ItemImage } from "./types";

interface ImageSectionProps {
  images: ItemImage[];
  currentImageIndex: number;
  setCurrentImageIndex: (value: number | ((prev: number) => number)) => void;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDeleteImage: (index: number) => void;
  onReorder: (newOrder: ItemImage[]) => void;
}

export default function ImageSection({
  images,
  currentImageIndex,
  setCurrentImageIndex,
  onFileSelect,
  onDeleteImage,
  onReorder,
}: ImageSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isImage = (url: string) => {
    // Check file extensions
    if (/\.(jpg|jpeg|png|gif|webp)$/i.test(url)) return true;
    
    // Check Shopify URLs
    if (url.includes('shopify.com')) {
      // Check if URL contains image-related parameters or paths
      return url.includes('/files/') && !url.includes('.mp4') && !url.includes('.webm');
    }
    
    return false;
  };

  return (
    <div className="space-y-4">
      <div className="bg-black rounded-2xl overflow-hidden">
        <div className="aspect-[4/3] relative">
          {images.length > 0 && (
            <>
              {isImage(images[currentImageIndex]?.image_url || images[currentImageIndex]?.url || "") ? (
                <img
                  src={images[currentImageIndex]?.image_url || images[currentImageIndex]?.url}
                  className="w-full h-full object-contain"
                  alt="Current item"
                />
              ) : (
                <video
                  src={images[currentImageIndex]?.image_url || images[currentImageIndex]?.url}
                  controls
                  className="w-full h-full object-contain"
                >
                  Your browser does not support the video tag.
                </video>
              )}
              {images.length > 1 && (
                <div className="absolute inset-0 flex items-center justify-between p-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setCurrentImageIndex((prev) => Math.max(0, prev - 1))}
                    className="bg-black/20 text-white"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setCurrentImageIndex((prev) => Math.min(images.length - 1, prev + 1))}
                    className="bg-black/20 text-white"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-4">
        <Reorder.Group
          axis="x"
          values={images}
          onReorder={onReorder}
          className="flex gap-3 overflow-x-auto py-2 px-1"
        >
          {images.map((image, index) => {
            const imageUrl = image.image_url || image.url;
            return (
              <Reorder.Item
                key={image.id || image.filepath || imageUrl}
                value={image}
                className={cn(
                  "relative flex-shrink-0 cursor-move group",
                  "rounded-lg overflow-hidden",
                  index === currentImageIndex ? "ring-2 ring-red-500" : ""
                )}
                dragListener={true}
                whileDrag={{ scale: 1.05, cursor: "grabbing" }}
              >
                <div onClick={() => setCurrentImageIndex(index)} className="w-20 h-20 relative z-10">
                  {isImage(imageUrl || "") ? (
                    <img
                      src={imageUrl}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                      draggable={false}
                    />
                  ) : (
                    <video
                      src={imageUrl}
                      className="w-full h-full object-contain rounded-lg pointer-events-none"
                      draggable={false}
                    >
                      Your browser does not support the video tag.
                    </video>
                  )}
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 h-5 w-5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteImage(index);
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </Reorder.Item>
            );
          })}
        </Reorder.Group>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        multiple
        className="hidden"
        onChange={onFileSelect}
      />
      <Button variant="outline" className="w-full" onClick={() => fileInputRef.current?.click()}>
        <Upload className="mr-2 h-4 w-4" />
        Add Photos
      </Button>
    </div>
  );
}