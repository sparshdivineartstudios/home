import { useState, useEffect } from "react";
import { DrivePhoto } from "@/services/productsService";
import { X, ChevronLeft, ChevronRight, Video } from "lucide-react";

interface ProductLightboxProps {
  photos: (DrivePhoto | string)[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
  productName: string;
}

export function ProductLightbox({
  photos,
  initialIndex,
  isOpen,
  onClose,
  productName
}: ProductLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  if (!isOpen || photos.length === 0) return null;

  const currentPhoto = photos[currentIndex];
  const isDrivePhoto = typeof currentPhoto === 'object' && currentPhoto.id;
  const isCurrentVideo = currentPhoto?.mimeType?.startsWith("video/") ?? false;

  // For Google Drive photos, use the preview URL for best fidelity
  const isDriveSource = !!currentPhoto?.id;
  const drivePreviewUrl = isDriveSource
    ? `https://drive.google.com/file/d/${(currentPhoto as DrivePhoto).id}/preview`
    : null;

  // Add cache-busting and handle both relative and absolute URLs
  const addCacheBusting = (url?: string): string | undefined => {
    if (!url) return undefined;
    try {
      // For relative URLs (from backend), add cache-bust parameter
      if (url.startsWith('/')) {
        const separator = url.includes('?') ? '&' : '?';
        return `${url}${separator}t=${Date.now()}`;
      }
      
      // For absolute Google Drive URLs (NOT preview), add cache-bust parameter
      if (url.includes('drive.google.com') && !url.includes('/preview')) {
        const separator = url.includes('?') ? '&' : '?';
        return `${url}${separator}t=${Date.now()}`;
      }
      
      return url;
    } catch (e) {
      return url;
    }
  };

  const imageSrc = isDrivePhoto
    ? addCacheBusting((currentPhoto as DrivePhoto).imageUrl) || addCacheBusting((currentPhoto as DrivePhoto).thumbnailUrl)
    : currentPhoto as string;

  const goNext = () => {
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  };

  const goPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
    setTouchEndX(null);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStartX === null || touchEndX === null) return;
    const diff = touchStartX - touchEndX;
    const threshold = 40;

    if (Math.abs(diff) >= threshold) {
      if (diff > 0) {
        goNext();
      } else {
        goPrev();
      }
    }

    setTouchStartX(null);
    setTouchEndX(null);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/90 backdrop-blur-sm"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={onClose}
    >
      {/* Close button */}
      <button
        className="absolute top-4 right-4 p-2 rounded-full bg-background/20 text-primary-foreground hover:bg-background/40 transition-colors z-[60]"
        onClick={onClose}
      >
        <X className="w-5 h-5" />
      </button>

      {/* Previous button */}
      {photos.length > 1 && (
        <button
          className="absolute left-4 p-2 rounded-full bg-background/20 text-primary-foreground hover:bg-background/40 transition-colors z-[60]"
          onClick={(e) => { e.stopPropagation(); goPrev(); }}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* Media content */}
      <div
        className="w-[90vw] max-w-[90vw] max-h-[85vh] h-[85vh] rounded-lg shadow-2xl overflow-hidden bg-black"
        onClick={(e) => e.stopPropagation()}
      >
        {drivePreviewUrl ? (
          <iframe
            src={drivePreviewUrl}
            className="w-full h-full border-0"
            allow="autoplay; fullscreen"
            allowFullScreen
            title={`${productName} - Image ${currentIndex + 1}`}
          />
        ) : isCurrentVideo ? (
          <video
            src={imageSrc}
            controls
            autoPlay
            className="w-full h-full object-contain"
          />
        ) : (
          <img
            src={imageSrc}
            alt={`${productName} - Image ${currentIndex + 1}`}
            className="w-full h-full object-contain"
          />
        )}
      </div>

      {/* Next button */}
      {photos.length > 1 && (
        <button
          className="absolute right-4 p-2 rounded-full bg-background/20 text-primary-foreground hover:bg-background/40 transition-colors z-[60]"
          onClick={(e) => { e.stopPropagation(); goNext(); }}
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Counter */}
      <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-primary-foreground/80 text-sm font-body">
        {currentIndex + 1} / {photos.length}
      </p>

      {/* Video indicator for Google Drive videos */}
      {isCurrentVideo && (
        <div className="absolute top-4 left-4 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-foreground/80 text-primary-foreground text-sm font-body">
          <Video className="w-4 h-4" />
          Video
        </div>
      )}
    </div>
  );
}