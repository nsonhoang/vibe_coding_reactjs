import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon, Loader2, Plus, X, Maximize2 } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DetailGalleryPanelProps {
  bookId: string;
  bookTitle: string;
  coverUrl: string;
  detailImages: { id: string; url: string; publicId: string }[];
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
  isLoadingDetails,
  uploadImagesMutation,
  deleteImageMutation,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

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
    setDeleteTargetId(imageId);
  };

  const resolveImageUrl = (url: string | null): string => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    return `http://localhost:3000${url.startsWith("/") ? "" : "/"}${url}`;
  };

  return (
    <div className="space-y-6 flex flex-col justify-between h-full">
      {/* PHẦN 1: ẢNH BÌA CHÍNH (THUMBNAIL) RIÊNG BIỆT */}
      <div className="space-y-2.5">
        <span className="font-bold text-slate-700 dark:text-slate-200 text-[10.5px] uppercase tracking-wider flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          Ảnh bìa chính (Thumbnail)
        </span>
        
        <div className="relative aspect-[3/4] w-full max-w-[270px] mx-auto rounded-lg border border-border/80 bg-accent/5 overflow-hidden shadow-lg group/cover transition-all duration-300 hover:shadow-primary/5">
          <img 
            src={resolveImageUrl(coverUrl)} 
            alt={bookTitle} 
            className="h-full w-full object-cover transition-transform duration-500 group-hover/cover:scale-105"
          />
          
          {/* Overlay to view primary cover image */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/cover:opacity-100 transition-opacity duration-350 flex items-center justify-center gap-2">
            <Button 
              size="xs" 
              variant="secondary"
              onClick={() => setLightboxImage(coverUrl)}
              className="text-[10px] font-bold h-7 gap-1 shadow-md bg-background/90 text-foreground hover:bg-background cursor-pointer"
            >
              <Maximize2 className="h-3 w-3" />
              Xem phóng to
            </Button>
          </div>
        </div>
      </div>

      {/* PHẦN 2: BỘ SƯU TẬP ẢNH CHI TIẾT RIÊNG BIỆT */}
      <div className="space-y-3 pt-4 border-t border-border/40 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between border-b border-border/60 pb-1.5 mb-2.5">
            <span className="font-bold text-muted-foreground text-[10px] uppercase tracking-wider flex items-center gap-1.5">
              <ImageIcon className="h-3.5 w-3.5 text-primary" />
              Album ảnh chi tiết ({detailImages.length})
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
              Tải ảnh chi tiết
            </Button>
          </div>

          {isLoadingDetails ? (
            <div className="flex items-center justify-center py-8 gap-2 text-muted-foreground text-[10px]">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              Đang tải bộ sưu tập ảnh...
            </div>
          ) : detailImages.length === 0 ? (
            <div className="border border-dashed border-border/70 rounded-lg p-6 text-center text-muted-foreground text-[10px] bg-accent/5">
              Chưa có ảnh chi tiết nào. Nhấp "Tải ảnh chi tiết" để chọn và đăng nhiều ảnh cùng lúc.
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-2.5 max-h-[170px] overflow-y-auto p-2 border border-border/40 rounded-lg bg-accent/5 shadow-inner">
              {detailImages.map((img) => (
                <div 
                  key={img.id}
                  onClick={() => setLightboxImage(img.url)}
                  className="relative aspect-square rounded border border-border/65 overflow-hidden cursor-pointer hover:opacity-90 group/img transition-all shadow-sm hover:border-primary/50"
                >
                  <img src={resolveImageUrl(img.url)} alt="Detail item" className="h-full w-full object-cover" />
                  
                  {/* Delete button inside sub-image preview */}
                  <button
                    type="button"
                    onClick={(e) => handleDeleteSubImage(img.id, e)}
                    disabled={deleteImageMutation.isPending}
                    className="absolute top-1 right-1 bg-black/75 text-white hover:bg-destructive h-4 w-4 rounded-full flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity cursor-pointer duration-150"
                    title="Xóa ảnh này"
                  >
                    {deleteImageMutation.isPending && deleteImageMutation.variables === img.id ? (
                      <Loader2 className="h-2 w-2 animate-spin" />
                    ) : (
                      <X className="h-2.5 w-2.5" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* DIALOG XEM PHÓNG TO ẢNH (LIGHTBOX OVERLAY) */}
      <Dialog open={!!lightboxImage} onOpenChange={(open) => !open && setLightboxImage(null)}>
        <DialogContent className="max-w-3xl border border-primary/20 bg-background/95 backdrop-blur-md p-1 shadow-2xl rounded-xl flex items-center justify-center overflow-hidden">
          <div className="relative max-h-[85vh] max-w-[90vw] overflow-hidden p-1 flex items-center justify-center">
            <img 
              src={resolveImageUrl(lightboxImage)} 
              alt="Zoomed preview" 
              className="max-h-[80vh] max-w-full object-contain rounded-lg shadow-inner"
            />
            <button 
              onClick={() => setLightboxImage(null)}
              className="absolute top-3.5 right-3.5 bg-black/55 hover:bg-destructive text-white h-7 w-7 rounded-full flex items-center justify-center cursor-pointer transition-colors shadow"
              title="Đóng xem ảnh"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* CONFIRMATION ALERT DIALOG FOR IMAGE DELETION */}
      <AlertDialog open={!!deleteTargetId} onOpenChange={(open) => !open && setDeleteTargetId(null)}>
        <AlertDialogContent className="border border-destructive/20 shadow-2xl rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-sm font-bold uppercase tracking-wider text-destructive">
              Xác nhận xóa hình ảnh?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-muted-foreground leading-relaxed">
              Hành động này không thể hoàn tác. Ảnh chi tiết này sẽ bị xóa vĩnh viễn khỏi bộ sưu tập album của sách trên hệ thống.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="border-t border-border/40 pt-3">
            <AlertDialogCancel className="text-xs font-bold h-8 cursor-pointer">Hủy bỏ</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                if (deleteTargetId) {
                  deleteImageMutation.mutate(deleteTargetId);
                  setDeleteTargetId(null);
                }
              }}
              className="text-xs font-bold h-8 bg-destructive hover:bg-destructive/90 text-destructive-foreground cursor-pointer"
            >
              Xác nhận xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
