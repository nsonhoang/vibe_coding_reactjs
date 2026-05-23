import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon, Loader2, Plus, X } from "lucide-react";

interface DetailGalleryPanelProps {
  bookId: string;
  bookTitle: string;
  coverUrl: string;
  detailImages: { id: string; url: string; publicId: string }[];
  selectedLargeImage: string | null;
  setSelectedLargeImage: (url: string | null) => void;
  isLoadingDetails: boolean;
  uploadImagesMutation: {
    mutate: (files: File[]) => void;
    isPending: boolean;
  };
  deleteImageMutation: {
    mutate: (id: string) => void;
    isPending: boolean;
    variables: string | undefined;
  };
}

export const DetailGalleryPanel: React.FC<DetailGalleryPanelProps> = ({
  bookId,
  bookTitle,
  coverUrl,
  detailImages,
  selectedLargeImage,
  setSelectedLargeImage,
  isLoadingDetails,
  uploadImagesMutation,
  deleteImageMutation,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      uploadImagesMutation.mutate(files);
    }
  };

  const handleDeleteSubImage = (imageId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Bạn có chắc chắn muốn xóa ảnh phụ này khỏi album của sách không?")) {
      deleteImageMutation.mutate(imageId);
    }
  };

  return (
    <div className="space-y-5 flex flex-col justify-between h-full">
      {/* Main Visual Display */}
      <div className="space-y-4">
        <div className="relative aspect-[3/4] w-full rounded-lg border border-border/80 bg-accent/10 overflow-hidden shadow-md">
          <img 
            src={selectedLargeImage || coverUrl} 
            alt={bookTitle} 
            className="h-full w-full object-cover transition-all duration-300"
          />
          <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md rounded px-2.5 py-1 text-[9px] font-bold text-white uppercase font-mono tracking-wider">
            {selectedLargeImage ? "📷 Xem ảnh phụ" : "📔 Ảnh bìa chính"}
          </div>
          {selectedLargeImage && (
            <button 
              onClick={() => setSelectedLargeImage(null)}
              className="absolute top-3 right-3 bg-card border border-border h-6 w-6 rounded-full flex items-center justify-center text-foreground hover:bg-accent cursor-pointer"
              title="Quay lại ảnh bìa chính"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>

        {/* Sub-images Gallery */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between border-b border-border/60 pb-1.5">
            <span className="font-bold text-muted-foreground text-[10px] uppercase tracking-wider flex items-center gap-1.5">
              <ImageIcon className="h-3.5 w-3.5 text-primary" />
              Album ảnh phụ ({detailImages.length})
            </span>
            <input
              type="file"
              multiple
              accept="image/png, image/jpeg, image/jpg"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            <Button 
              size="xs" 
              variant="outline"
              onClick={handleUploadClick}
              disabled={uploadImagesMutation.isPending}
              className="h-7 px-2.5 font-bold text-[9px] gap-1 border-primary/20 text-primary hover:bg-primary/5 cursor-pointer"
            >
              {uploadImagesMutation.isPending ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Plus className="h-3 w-3" />
              )}
              Tải ảnh phụ
            </Button>
          </div>

          {isLoadingDetails ? (
            <div className="flex items-center justify-center py-6 gap-2 text-muted-foreground text-[10px]">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              Đang tải bộ sưu tập ảnh phụ từ máy chủ...
            </div>
          ) : detailImages.length === 0 ? (
            <div className="border border-dashed border-border/70 rounded-lg p-5 text-center text-muted-foreground text-[10px] bg-accent/5">
              Không có ảnh phụ chi tiết nào trong album sách này.
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-2.5 max-h-[140px] overflow-y-auto p-1.5 border border-border/40 rounded-lg bg-accent/5 shadow-inner">
              {/* Option to preview primary thumbnail */}
              <div 
                onClick={() => setSelectedLargeImage(null)}
                className={`relative aspect-square rounded border overflow-hidden cursor-pointer transition-all ${
                  selectedLargeImage === null ? "border-primary ring-2 ring-primary/20" : "border-border/60 hover:opacity-85"
                }`}
              >
                <img src={coverUrl} alt="Primary" className="h-full w-full object-cover" />
              </div>

              {detailImages.map((img) => {
                const isSelected = selectedLargeImage === img.url;
                return (
                  <div 
                    key={img.id}
                    onClick={() => setSelectedLargeImage(img.url)}
                    className={`relative aspect-square rounded border overflow-hidden cursor-pointer transition-all group/img ${
                      isSelected ? "border-primary ring-2 ring-primary/20" : "border-border/60 hover:opacity-85"
                    }`}
                  >
                    <img src={img.url} alt="Gallery item" className="h-full w-full object-cover" />
                    
                    {/* Delete button inside sub-image preview */}
                    <button
                      type="button"
                      onClick={(e) => handleDeleteSubImage(img.id, e)}
                      disabled={deleteImageMutation.isPending}
                      className="absolute top-1 right-1 bg-black/70 text-white hover:bg-destructive h-4 w-4 rounded-full flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity cursor-pointer duration-150"
                      title="Xóa ảnh này"
                    >
                      {deleteImageMutation.isPending && deleteImageMutation.variables === img.id ? (
                        <Loader2 className="h-2 w-2 animate-spin" />
                      ) : (
                        <X className="h-2.5 w-2.5" />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
