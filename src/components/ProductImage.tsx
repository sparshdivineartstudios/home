import { useState } from "react";
import { DrivePhoto } from "@/services/productsService";
import { Video } from "lucide-react";

interface ProductImageProps {
  src?: string;
  drivePhoto?: DrivePhoto;
  alt: string;
  className?: string;
  onClick?: () => void;
}

export function ProductImage({ src, drivePhoto, alt, className = "", onClick }: ProductImageProps) {
  const [loaded, setLoaded] = useState(false);
  

  // Add cache-busting and handle both relative and absolute URLs
  const addCacheBusting = (url?: string): string | undefined => {
    if (!url) return undefined;
    try {
      // For relative URLs (from backend), add cache-bust parameter
      if (url.startsWith('/')) {
        const separator = url.includes('?') ? '&' : '?';
        return `${url}${separator}t=${Date.now()}`;
      }
      
      // For absolute Google Drive URLs, add cache-bust parameter
      if (url.includes('drive.google.com') || url.includes('googleusercontent.com')) {
        const separator = url.includes('?') ? '&' : '?';
        return `${url}${separator}t=${Date.now()}`;
      }
      
      return url;
    } catch (e) {
      return url;
    }
  };

  // Determine if this is a video
  const isVideo = drivePhoto?.mimeType?.startsWith("video/") ||
    (drivePhoto?.name?.toLowerCase().match(/\.(mov|mp4|m4v|avi|webm)$/)) ||
    (drivePhoto?.imageUrl?.toLowerCase().match(/\.(mov|mp4|m4v|avi|webm)$/));

  // Get the appropriate image source with cache-busting
  const imageSrcRaw = drivePhoto?.thumbnailUrl || drivePhoto?.imageUrl || src;
  const imageSrc = addCacheBusting(imageSrcRaw);

  return (
    <div
      className={`relative overflow-hidden rounded-lg cursor-pointer group ${className}`}
      onClick={onClick}
    >
      {!loaded && (
        <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center">
          <span className="text-xs font-body text-muted-foreground/70">Loading…</span>
        </div>
      )}

      {isVideo ? (
        <div className="relative">
          {/* Show thumbnail for video */}
          <img
            src={addCacheBusting(drivePhoto?.thumbnailUrl) || addCacheBusting(drivePhoto?.imageUrl) || drivePhoto?.thumbnailUrl || drivePhoto?.imageUrl}
            alt={alt}
            loading="lazy"
            className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-105 ${
              loaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setLoaded(true)}
            onError={(e) => {
              console.warn('Image failed to load', e.currentTarget.src);
              setLoaded(true);
              e.currentTarget.style.display = 'none';
            }}
          />
          {/* Video indicator */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-black/50 rounded-full p-3">
              <Video className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      ) : (
        <img
          src={imageSrc}
          alt={alt}
          loading="lazy"
          className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-105 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setLoaded(true)}
          onError={(e) => {
            console.warn('Image failed to load', e.currentTarget.src);
            setLoaded(true);
            e.currentTarget.style.display = 'none';
          }}
        />
      )}

      <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors pointer-events-none" />
    </div>
  );
}