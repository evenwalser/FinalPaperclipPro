import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ImageFile {
  url: string;
  file: File | null;
  filepath: string | null;
}

interface ImageCarouselProps {
  images: ImageFile[];
  currentIndex: number;
  onNavigate: (index: number) => void;
}

const isImageFile = (url: string) => {
  if (url.startsWith('data:')) {
    return url.includes('image/');
  }
  return /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
};

export default function ImageCarousel({ images, currentIndex, onNavigate }: ImageCarouselProps) {
  const currentMedia = images[currentIndex];
  const isImage = currentMedia && isImageFile(currentMedia.url);

  return (
    <div className="bg-black rounded-2xl overflow-hidden">
      <div className="aspect-[4/3] relative">
        {currentMedia && (
          isImage ? (
            <img src={currentMedia.url} alt={`Photo ${currentIndex + 1}`} className="w-full h-full object-contain" />
          ) : (
            <video src={currentMedia.url} controls className="w-full h-full object-cover absolute z-10">
              Your browser does not support the video tag.
            </video>
          )
        )}
        {images.length > 1 && (
          <div className="absolute inset-0 flex items-center justify-between p-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onNavigate((currentIndex - 1 + images.length) % images.length)}
              className="h-10 w-10 rounded-full bg-black/20 hover:bg-black/40 text-white"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onNavigate((currentIndex + 1) % images.length)}
              className="h-10 w-10 rounded-full bg-black/20 hover:bg-black/40 text-white"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
        )}
        <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1.5 rounded-full text-sm">
          {currentIndex + 1} / {images.length}
        </div>
      </div>
    </div>
  );
}