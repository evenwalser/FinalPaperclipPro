import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { toast } from "sonner";

interface ImageFile {
  url: string;
  file: File | null;
  filepath: string | null;
}

interface CameraViewProps {
  images: ImageFile[];
  onAddImage: (newImage: ImageFile) => void;
  onRemoveImage: (index: number) => void;
  onDone: () => void;
  isFlashing: boolean;
  setIsFlashing: (value: boolean) => void;
}

export default function CameraView({ images, onAddImage, onRemoveImage, onDone, isFlashing, setIsFlashing }: CameraViewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast.error("Unable to access camera. Please check permissions.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const capturePhoto = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 150);
    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      if (!context) return;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0);
      const imageDataUrl = canvas.toDataURL("image/jpeg", 0.8);
      onAddImage({ url: imageDataUrl, file: null, filepath: null });
    } catch (error) {
      console.error("Error capturing photo:", error);
      toast.error("Failed to capture photo. Please try again.");
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-black rounded-2xl overflow-hidden">
        <div className="aspect-[4/3] relative">
          <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
          <canvas ref={canvasRef} className="hidden" />
          {isFlashing && <div className="absolute inset-0 bg-white z-50 animate-flash" />}
          <div className="absolute bottom-6 left-0 right-0 flex justify-center">
            <Button onClick={capturePhoto} className="w-16 h-16 rounded-full bg-white hover:bg-gray-100">
              <div className="w-12 h-12 rounded-full border-4 border-black" />
            </Button>
          </div>
        </div>
      </div>
      {images.length > 0 && (
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-4">
          <div className="flex gap-3 overflow-x-auto py-2 px-1">
            {images.map((image, index) => (
              <div key={index} className="relative flex-shrink-0 group">
                <div className="w-20 h-20 rounded-lg overflow-hidden border-2 border-transparent hover:border-white/25 transition-all duration-200">
                  <img src={image.url} alt={`Capture ${index + 1}`} className="w-full h-full object-cover" />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 h-5 w-5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    onClick={() => onRemoveImage(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <Button onClick={onDone} variant="outline" className="w-full">
        Done
      </Button>
    </div>
  );
}