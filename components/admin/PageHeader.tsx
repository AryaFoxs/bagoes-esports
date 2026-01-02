import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { LucideIcon, ChevronRight } from "lucide-react";
import Link from "next/link";

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  breadcrumbs?: { label: string; href?: string }[];
  actions?: ReactNode;
}

export function PageHeader({
  title,
  description,
  icon: Icon,
  breadcrumbs,
  actions,
}: PageHeaderProps) {
  return (
    <div className="mb-8">
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
          {breadcrumbs.map((crumb, index) => (
            <span key={index} className="flex items-center gap-1">
              {index > 0 && <ChevronRight className="w-4 h-4" />}
              {crumb.href ? (
                <Link
                  href={crumb.href}
                  className="hover:text-foreground transition-colors"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-foreground">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
      )}

      {/* Title & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {Icon && (
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <Icon className="w-6 h-6 text-primary" />
            </div>
          )}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">{title}</h1>
            {description && (
              <p className="text-muted-foreground mt-1">{description}</p>
            )}
          </div>
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}
