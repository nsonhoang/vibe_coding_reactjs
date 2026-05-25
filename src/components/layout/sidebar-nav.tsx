import React, { memo } from "react";
import { Link } from "react-router-dom";

interface SidebarItem {
  name: string;
  path: string;
  icon: React.ComponentType<any>;
}

interface MenuSection {
  title: string;
  items: SidebarItem[];
}

interface SidebarNavProps {
  sections: MenuSection[];
  pathname: string;
  onItemClick?: () => void;
}

export const SidebarNav: React.FC<SidebarNavProps> = memo(({
  sections,
  pathname,
  onItemClick,
}) => {
  return (
    <nav className="mt-6 space-y-5">
      {sections.map((section) => (
        <div key={section.title} className="space-y-1.5">
          <div className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-wider px-3 select-none">
            {section.title}
          </div>
          <div className="space-y-0.5">
            {section.items.map((item) => {
              const isActive = pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={onItemClick}
                  className={`flex items-center gap-3 rounded-lg px-3 py-1.5 text-xs font-semibold tracking-wide transition-all ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/15"
                      : "text-muted-foreground hover:bg-accent/80 hover:text-accent-foreground"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? "text-primary-foreground" : "text-muted-foreground"}`} />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
});

SidebarNav.displayName = "SidebarNav";
export type { SidebarItem, MenuSection };
