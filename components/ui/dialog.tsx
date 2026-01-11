"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

const Dialog = ({ open, onOpenChange, children }: DialogProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        onClick={() => onOpenChange?.(false)}
      />
      {/* Content container */}
      {children}
    </div>
  );
};

interface DialogContentProps {
  className?: string;
  children: React.ReactNode;
}

const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
  ({ className, children }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-border bg-card p-6 shadow-lg sm:rounded-lg",
          className
        )}
      >
        {children}
      </div>
    );
  }
);
DialogContent.displayName = "DialogContent";

interface DialogHeaderProps {
  className?: string;
  children: React.ReactNode;
}

const DialogHeader = ({ className, children }: DialogHeaderProps) => (
  <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)}>
    {children}
  </div>
);

interface DialogTitleProps {
  className?: string;
  children: React.ReactNode;
}

const DialogTitle = React.forwardRef<HTMLHeadingElement, DialogTitleProps>(
  ({ className, children }, ref) => (
    <h2 ref={ref} className={cn("text-lg font-semibold leading-none tracking-tight", className)}>
      {children}
    </h2>
  )
);
DialogTitle.displayName = "DialogTitle";

interface DialogDescriptionProps {
  className?: string;
  children: React.ReactNode;
}

const DialogDescription = React.forwardRef<HTMLParagraphElement, DialogDescriptionProps>(
  ({ className, children }, ref) => (
    <p ref={ref} className={cn("text-sm text-muted-foreground", className)}>
      {children}
    </p>
  )
);
DialogDescription.displayName = "DialogDescription";

interface DialogCloseProps {
  className?: string;
  onClick?: () => void;
}

const DialogClose = ({ className, onClick }: DialogCloseProps) => (
  <button
    onClick={onClick}
    className={cn(
      "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none",
      className
    )}
  >
    <X className="h-4 w-4" />
    <span className="sr-only">Close</span>
  </button>
);

export { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose };
