import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon, Upload } from "lucide-react";

interface CoverImagePanelProps {
  imagePreview: string;
  imageFile: File | null;
  isSaving: boolean;
  onFileSelect: (file: File, previewUrl: string) => void;
}

export const CoverImagePanel: React.FC<CoverImagePanelProps> = ({
  imagePreview,
  imageFile,
  isSaving,
  onFileSelect,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onFileSelect(file, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4 flex flex-col justify-between h-full">
      <div className="space-y-3">
        <label className="font-bold text-muted-foreground text-[10px] uppercase tracking-wider block">Ảnh bìa sách chính</label>
        <div className="relative aspect-[3/4] w-full rounded-lg border-2 border-dashed border-primary/20 bg-accent/5 hover:bg-accent/15 hover:border-primary/45 transition-all duration-300 overflow-hidden flex flex-col items-center justify-center p-2 text-center text-muted-foreground shadow-inner">
          {imagePreview ? (
            <img src={imagePreview} alt="Cover Preview" className="h-full w-full object-cover rounded-md" />
          ) : (
            <div className="space-y-2 p-4">
              <ImageIcon className="h-9 w-9 mx-auto text-primary/30" />
              <span className="text-[10px] block font-semibold text-primary/60">Chưa có ảnh bìa</span>
              <span className="text-[9px] block text-muted-foreground/60">Kích thước 3:4 khuyên dùng</span>
            </div>
          )}
        </div>
      </div>
      
      <input
        type="file"
        accept="image/png, image/jpeg, image/jpg"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      
      <div className="space-y-2.5">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={isSaving}
          className="w-full text-xs font-bold gap-2 h-9 border-primary/30 text-primary hover:bg-primary/5 hover:border-primary cursor-pointer transition-all duration-200"
        >
          <Upload className="h-3.5 w-3.5" />
          Chọn ảnh mới
        </Button>
        {imageFile && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded px-2 py-1 text-[9px] text-emerald-600 dark:text-emerald-400 font-bold text-center truncate" title={imageFile.name}>
            Đã nạp: {imageFile.name}
          </div>
        )}
      </div>
    </div>
  );
};
