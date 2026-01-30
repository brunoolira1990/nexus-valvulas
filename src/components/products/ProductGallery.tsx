import { useState } from "react";
import { ImageIcon, ZoomIn, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";

interface ProductGalleryProps {
  images: string[];
  productName: string;
  className?: string;
}

export function ProductGallery({ images, productName, className }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [imageError, setImageError] = useState<Record<number, boolean>>({});

  const validImages = images.filter(Boolean);
  const hasImages = validImages.length > 0;
  const currentImage = validImages[selectedIndex] || null;

  const handleImageError = (index: number) => {
    setImageError(prev => ({ ...prev, [index]: true }));
  };

  const handleThumbnailClick = (index: number) => {
    setSelectedIndex(index);
    setImageError(prev => ({ ...prev, [index]: false }));
  };

  if (!hasImages) {
    return (
      <div
        className={cn(
          "aspect-square rounded-lg border-2 border-dashed border-muted flex items-center justify-center bg-muted/20",
          className
        )}
      >
        <div className="text-center p-8">
          <ImageIcon className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground font-medium">Imagem não disponível</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Imagem Principal */}
      <div className="relative aspect-square rounded-lg overflow-hidden border border-border bg-muted/20 group">
        {currentImage && !imageError[selectedIndex] ? (
          <>
            <img
              src={currentImage}
              alt={productName}
              className="w-full h-full object-contain cursor-zoom-in transition-transform group-hover:scale-105"
              onClick={() => setIsZoomOpen(true)}
              onError={() => handleImageError(selectedIndex)}
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center">
              <ZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
            </div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center p-8">
              <ImageIcon className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground font-medium">Erro ao carregar imagem</p>
            </div>
          </div>
        )}
      </div>

      {/* Miniaturas */}
      {validImages.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
          {validImages.map((image, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleThumbnailClick(index)}
              className={cn(
                "aspect-square rounded-md overflow-hidden border-2 transition-all",
                selectedIndex === index
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-muted hover:border-primary/50",
                imageError[index] && "opacity-50"
              )}
            >
              {!imageError[index] ? (
                <img
                  src={image}
                  alt={`${productName} - Imagem ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={() => handleImageError(index)}
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted/20">
                  <ImageIcon className="h-6 w-6 text-muted-foreground" />
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Dialog de Zoom */}
      <Dialog open={isZoomOpen} onOpenChange={setIsZoomOpen}>
        <DialogContent className="max-w-7xl w-full p-0 bg-transparent border-none [&>button]:hidden">
          <DialogTitle className="sr-only">Zoom da imagem: {productName}</DialogTitle>
          <DialogDescription className="sr-only">
            Visualização ampliada da imagem do produto
          </DialogDescription>
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-10 bg-background/80 hover:bg-background rounded-full"
              onClick={() => setIsZoomOpen(false)}
              aria-label="Fechar zoom"
            >
              <X className="h-4 w-4" />
            </Button>
            {currentImage && !imageError[selectedIndex] && (
              <img
                src={currentImage}
                alt={productName}
                className="w-full h-auto max-h-[90vh] object-contain rounded-lg"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
