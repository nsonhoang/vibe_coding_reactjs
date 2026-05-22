import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Trash2 } from "lucide-react";
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
    <Card className="border-border bg-card/20 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
          <User className="h-4.5 w-4.5 text-primary" />
          Hồ sơ Tác giả
        </CardTitle>
        <CardDescription className="text-[11px]">Thiết lập thông tin tiểu sử của các tác giả</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick Add Form */}
        <form onSubmit={onAddAuthor} className="space-y-3 border border-border/80 bg-accent/10 rounded-lg p-3">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-muted-foreground">Tên tác giả</label>
            <Input
              placeholder="E.g. Nguyễn Nhật Ánh"
              value={athName}
              onChange={(e) => setAthName(e.target.value)}
              className="bg-card border-border text-xs h-8"
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-muted-foreground">Tiểu sử ngắn</label>
            <textarea
              placeholder="Thông tin tiểu sử tóm tắt..."
              value={athBio}
              onChange={(e) => setAthBio(e.target.value)}
              rows={2}
              className="w-full rounded-md border border-border bg-card px-3 py-1.5 text-xs text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary resize-none"
            />
          </div>
          <Button type="submit" size="xs" className="w-full bg-primary hover:bg-primary/95 text-primary-foreground text-[10px] font-bold py-1.5 h-8 shadow-sm cursor-pointer">
            Đăng ký Tác giả
          </Button>
        </form>

        {/* List */}
        <div className="divide-y divide-border/60 max-h-[400px] overflow-y-auto pr-1">
          {authors.map((ath) => {
            const count = ath._count?.books ?? 0;
            const bioText = ath.info || "Chưa có tiểu sử tóm tắt.";
            return (
              <div key={ath.id} className="py-3 hover:bg-accent/30 rounded px-1.5 transition-colors space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground">{ath.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[9px] font-bold text-primary border border-primary/20">
                      {count} sách
                    </span>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      type="button"
                      onClick={() => onDeleteAuthor(ath.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-[10px] text-muted-foreground leading-relaxed line-clamp-1 flex-1 mr-2">{bioText}</p>
                  <span className="text-[9px] font-mono text-muted-foreground bg-accent/20 px-1 rounded shrink-0">ID: {ath.id.substring(0, 8)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
