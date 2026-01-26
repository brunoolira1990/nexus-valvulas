import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ImageIcon, ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: string[];
  productName: string;
  className?: string;
}

export function ProductGallery({ images, productName, className }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  if (!images || images.length === 0) {
    return (
      <Card className={cn("overflow-hidden", className)}>
        <CardContent className="p-0">
          <div className="aspect-square bg-gradient-to-br from-muted/50 to-muted flex items-center justify-center">
            <ImageIcon className="h-24 w-24 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentImage = images[selectedIndex];

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-0">
        {/* Imagem Principal */}
        <div className="relative aspect-square bg-white group">
          <img
            src={currentImage}
            alt={`${productName} - Imagem ${selectedIndex + 1}`}
            className={cn(
              "w-full h-full object-contain p-8 transition-all duration-300",
              isZoomed && "scale-150 cursor-zoom-out"
            )}
            loading={selectedIndex === 0 ? "eager" : "lazy"}
            onError={(e) => {
              const target = e.currentTarget;
              target.style.display = "none";
              const placeholder = target.nextElementSibling as HTMLElement;
              if (placeholder) {
                placeholder.style.display = "flex";
              }
            }}
            onClick={() => setIsZoomed(!isZoomed)}
          />
          
          {/* Placeholder quando imagem falha */}
          <div
            className="w-full h-full bg-gradient-to-br from-muted/50 to-muted flex items-center justify-center absolute inset-0"
            style={{ display: "none" }}
          >
            <ImageIcon className="h-24 w-24 text-muted-foreground" />
          </div>

          {/* Botão Zoom */}
          {images.length > 0 && (
            <button
              onClick={() => setIsZoomed(!isZoomed)}
              className="absolute top-4 right-4 p-2 bg-background/80 backdrop-blur-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
              aria-label={isZoomed ? "Reduzir zoom" : "Ampliar imagem"}
            >
              <ZoomIn className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Miniaturas */}
        {images.length > 1 && (
          <div className="grid grid-cols-4 gap-2 p-4 bg-muted/30 border-t">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSelectedIndex(idx);
                  setIsZoomed(false);
                }}
                className={cn(
                  "aspect-square rounded-md overflow-hidden border-2 transition-all",
                  selectedIndex === idx
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-transparent hover:border-primary/50"
                )}
                aria-label={`Ver imagem ${idx + 1} de ${images.length}`}
              >
                <img
                  src={img}
                  alt={`${productName} - Miniatura ${idx + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}


