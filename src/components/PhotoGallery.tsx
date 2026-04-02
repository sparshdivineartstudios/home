import { useEffect, useState } from "react";
import type { Memory, MemoryPhoto } from "@/lib/api";
import { getMemoryPhotos } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, ChevronLeft, ChevronRight, X, Calendar, Tag, Video } from "lucide-react";
import ProgressiveImage from "@/components/ProgressiveImage";

interface PhotoGalleryProps {
  memory: Memory;
  onBack: () => void;
}

function PhotoTile({
  photo,
  alt,
  onClick,
}: {
  photo: MemoryPhoto;
  alt: string;
  onClick: () => void;
}) {
  const [loaded, setLoaded] = useState(false);
  const lowerName = photo.name?.toLowerCase() || "";
  const url = (photo.imageUrl || photo.thumbnailUrl || "").toLowerCase();
  const isVideoMime = photo.mimeType?.startsWith("video/");
  const isVideoExt = [".mov", ".mp4", ".m4v", ".avi", ".webm"].some((ext) =>
    lowerName.endsWith(ext) || url.includes(ext)
  );
  const isVideo = isVideoMime || isVideoExt;

  // Add cache-busting for backend-proxied URLs and relative paths
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

  return (
    <div
      className="relative aspect-square overflow-hidden rounded-lg cursor-pointer group sepia-card"
      onClick={onClick}
    >
      <ProgressiveImage
        src={addCacheBusting(photo.imageUrl) || addCacheBusting(photo.thumbnailUrl) || ''}
        placeholder={addCacheBusting(photo.thumbnailUrl)}
        alt={alt}
        className={`w-full h-full`}
        onLoad={() => setLoaded(true)}
      />
      <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors pointer-events-none pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none border-2 border-background/15 rounded-lg m-1" />
      {isVideo && (
        <div className="absolute top-2 left-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-foreground/80 text-primary-foreground text-[10px] font-body">
          <Video className="w-3 h-3" />
          Video
        </div>
      )}
    </div>
  );
}

export default function PhotoGallery({ memory, onBack }: PhotoGalleryProps) {
  const { token } = useAuth();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [photos, setPhotos] = useState<MemoryPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  const formatted = new Date(memory.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    if (!token) {
      setError("You must be signed in to view photos.");
      setLoading(false);
      return;
    }

    getMemoryPhotos(memory.id, token)
      .then((data) => {
        if (!cancelled) {
          setPhotos(data);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError("Could not load photos for this memory.");
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [memory.id, token]);

  const photoCount = photos.length;

  const goNext = () => {
    if (selectedIndex !== null && photoCount > 0) {
      setSelectedIndex((selectedIndex + 1) % photoCount);
    }
  };

  const goPrev = () => {
    if (selectedIndex !== null && photoCount > 0) {
      setSelectedIndex((selectedIndex - 1 + photoCount) % photoCount);
    }
  };

  const handleTouchStart = (e: any) => {
    setTouchStartX(e.touches[0].clientX);
    setTouchEndX(null);
  };

  const handleTouchMove = (e: any) => {
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

  const currentPhoto =
    selectedIndex !== null && photoCount > 0 ? photos[selectedIndex] : null;
  const isCurrentVideo = currentPhoto?.mimeType?.startsWith("video/") ?? false;

  // If this photo comes from Google Drive, we can use Drive's own
  // high-quality preview page inside an iframe for best fidelity.
  const isDriveSource = !!currentPhoto?.id;
  const drivePreviewUrl = isDriveSource
    ? `https://drive.google.com/file/d/${currentPhoto.id}/preview?t=${Date.now()}`
    : null;

  // Add cache-busting for backend-proxied URLs and relative paths
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

  const currentMediaSrc = currentPhoto
    ? addCacheBusting(currentPhoto.imageUrl) || addCacheBusting(currentPhoto.thumbnailUrl)
    : "";

  return (
    <div className="min-h-screen paper-texture">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-card/90 backdrop-blur-md border-b border-border">
        <div className="px-6 py-3 flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-primary hover:text-accent transition-colors font-body text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Timeline
          </button>
        </div>
      </div>

      {/* Memory Info */}
      <div className="px-6 pt-6 pb-3 max-w-6xl mx-auto">
        <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
          <Calendar className="w-3.5 h-3.5" />
          <span className="font-body">{formatted}</span>
        </div>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
          {memory.title}
        </h1>
        <p className="font-body text-foreground/80 leading-relaxed max-w-2xl whitespace-pre-line mb-4">
          {memory.description}
        </p>
        <div className="flex flex-wrap gap-1.5 mb-6">
          {memory.tags.map((tag) => (
            <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-full bg-secondary text-secondary-foreground">
              <Tag className="w-2.5 h-2.5" />
              {tag}
            </span>
          ))}
        </div>

        <p className="font-body text-muted-foreground text-sm">
          {photoCount} {photoCount === 1 ? "photo" : "photos"} from this moment
        </p>
      </div>

      {/* Photo Grid */}
      <div className="px-6 pb-10 max-w-6xl mx-auto">
        {loading && (
          <p className="py-8 text-center text-muted-foreground font-body text-sm">
            Loading photos...
          </p>
        )}

        {error && !loading && (
          <p className="py-8 text-center text-destructive font-body text-sm">{error}</p>
        )}

        {!loading && !error && photoCount === 0 && (
          <p className="py-8 text-center text-muted-foreground font-body text-sm">
            No photos found in the linked Google Drive folder.
          </p>
        )}

        {!loading && !error && photoCount > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {photos.map((photo, i) => (
              <PhotoTile
                key={photo.id}
                photo={photo}
                alt={`${memory.title} — ${photo.name}`}
                onClick={() => setSelectedIndex(i)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {selectedIndex !== null && photoCount > 0 && currentPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/85 backdrop-blur-sm"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onClick={() => setSelectedIndex(null)}
        >
          {/* Close button */}
          <button
            className="absolute top-4 right-4 p-2 rounded-full bg-background/20 text-primary-foreground hover:bg-background/40 transition-colors z-[60]"
            onClick={() => setSelectedIndex(null)}
          >
            <X className="w-5 h-5" />
          </button>

          {/* Prev */}
          {photoCount > 1 && (
            <button
              className="absolute left-4 p-2 rounded-full bg-background/20 text-primary-foreground hover:bg-background/40 transition-colors z-[60]"
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {/* Media */}
          {drivePreviewUrl ? (
            <div
              className="w-[90vw] max-w-[90vw] max-h-[85vh] h-[85vh] rounded-lg shadow-2xl overflow-hidden bg-black"
              onClick={(e) => e.stopPropagation()}
            >
              <iframe
                src={drivePreviewUrl}
                className="w-full h-full border-0"
                allow="autoplay; fullscreen"
                allowFullScreen
                title={currentPhoto.name}
              />
            </div>
          ) : isCurrentVideo ? (
            <video
              src={currentMediaSrc}
              controls
              autoPlay
              className="w-[90vw] max-w-[90vw] max-h-[85vh] rounded-lg shadow-2xl bg-black object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <img
              src={currentMediaSrc}
              alt={`${memory.title} — ${currentPhoto.name}`}
              className="w-[90vw] max-w-[90vw] max-h-[85vh] rounded-lg shadow-2xl object-contain"
              style={{ filter: "sepia(8%) saturate(95%)" }}
              onClick={(e) => e.stopPropagation()}
            />
          )}

          {/* Next */}
          {photoCount > 1 && (
            <button
              className="absolute right-4 p-2 rounded-full bg-background/20 text-primary-foreground hover:bg-background/40 transition-colors z-[60]"
              onClick={(e) => { e.stopPropagation(); goNext(); }}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          {/* Counter */}
          <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-primary-foreground/80 text-sm font-body">
            {selectedIndex + 1} / {photoCount}
          </p>
        </div>
      )}
    </div>
  );
}