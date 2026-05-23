import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Trash2, Edit3 } from "lucide-react";
import type { Author } from "@/services/author-service";

interface AuthorsPanelProps {
  authors: Author[];
  athName: string;
  setAthName: (val: string) => void;
  athBio: string;
  setAthBio: (val: string) => void;
  onAddAuthor: (e: React.FormEvent) => void;
  onDeleteAuthor: (id: string) => void;
}

export const AuthorsPanel: React.FC<AuthorsPanelProps> = ({
  authors,
  athName,
  setAthName,
  athBio,
  setAthBio,
  onAddAuthor,
  onDeleteAuthor,
}) => {
  return (
    <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
      <CardHeader className="p-5 border-b border-slate-100 dark:border-slate-800/80">
        <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-850 dark:text-slate-100 flex items-center gap-2">
          <User className="h-4.5 w-4.5 text-primary" />
          Hồ sơ Tác giả
        </CardTitle>
        <CardDescription className="text-[11px] text-slate-500 mt-1">
          Thiết lập thông tin tiểu sử và danh sách các tác giả cộng tác phát hành sách
        </CardDescription>
      </CardHeader>
      <CardContent className="p-5 space-y-4">
        {/* Quick Add Form */}
        <form onSubmit={onAddAuthor} className="space-y-3.5 border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/40 rounded-xl p-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Tên tác giả
            </label>
            <Input
              placeholder="Ví dụ: Nguyễn Nhật Ánh"
              value={athName}
              onChange={(e) => setAthName(e.target.value)}
              className="bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-xs h-10 px-3 focus:ring-1 focus:ring-primary focus:border-primary rounded-lg outline-none w-full"
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Tiểu sử ngắn
            </label>
            <textarea
              placeholder="Tóm tắt ngắn gọn sự nghiệp, thành tựu..."
              value={athBio}
              onChange={(e) => setAthBio(e.target.value)}
              rows={2}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-850 px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary resize-none outline-none"
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-primary hover:bg-primary/95 text-white text-xs font-bold h-10 rounded-lg shadow-sm shadow-primary/10 cursor-pointer"
          >
            Đăng ký Tác giả
          </Button>
        </form>

        {/* List */}
        <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-[295px] overflow-y-auto pr-1 custom-scrollbar">
          {authors.map((ath) => {
            const count = ath._count?.books ?? 0;
            const bioText = ath.info || "Chưa có tiểu sử tóm tắt.";
            return (
              <div key={ath.id} className="py-3.5 hover:bg-slate-50/80 dark:hover:bg-slate-850/40 rounded-lg px-2.5 transition-colors space-y-1.5 group">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-850 dark:text-slate-200 group-hover:text-primary transition-colors">
                    {ath.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary dark:text-primary-fixed-dim">
                      {count} sách
                    </span>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      type="button"
                      onClick={() => onDeleteAuthor(ath.id)}
                      className="text-red-500 hover:text-red-600 hover:bg-red-500/10 cursor-pointer h-7 w-7 rounded-lg"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
                <div className="flex justify-between items-center gap-4">
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-1 flex-1">
                    {bioText}
                  </p>
                  <span className="text-[9px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-850 dark:text-slate-500 px-2 py-0.5 rounded-full font-bold">
                    #{ath.id.substring(0, 8).toUpperCase()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
