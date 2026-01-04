import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold transition-all backdrop-blur-xl shadow-sm",
  {
    variants: {
      variant: {
        default:
          "bg-primary/60 text-white border border-primary/70 shadow-primary/30",
        secondary:
          "bg-secondary/40 text-white border border-secondary/50",
        success:
          "bg-accent/40 text-white border border-accent/50",
        warning:
          "bg-warning/40 text-white border border-warning/50",
        destructive:
          "bg-destructive/40 text-white border border-destructive/50",
        outline:
          "bg-black/30 border border-white/30 text-white",
        live:
          "bg-destructive text-destructive-foreground animate-pulse shadow-lg shadow-destructive/30",
        game:
          "bg-black/40 text-white border border-white/30 backdrop-blur-xl",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
