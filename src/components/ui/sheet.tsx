"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SheetContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SheetContext = React.createContext<SheetContextType | undefined>(undefined);

export function Sheet({
  open: controlledOpen,
  onOpenChange,
  children,
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const setOpen = React.useCallback(
    (value: boolean) => {
      if (!isControlled) {
        setInternalOpen(value);
      }
      onOpenChange?.(value);
    },
    [isControlled, onOpenChange]
  );

  return (
    <SheetContext.Provider value={{ open, setOpen }}>
      {children}
    </SheetContext.Provider>
  );
}

export function SheetTrigger({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const context = React.useContext(SheetContext);
  if (!context) throw new Error("SheetTrigger must be used within Sheet");

  return (
    <button
      type="button"
      onClick={() => context.setOpen(true)}
      className={className}
      {...props}
    >
      {children}
    </button>
  );
}

export function SheetContent({
  side = "left",
  children,
  className,
}: {
  side?: "left" | "right";
  children: React.ReactNode;
  className?: string;
}) {
  const context = React.useContext(SheetContext);
  if (!context || !context.open) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={() => context.setOpen(false)}
      />
      {/* Slide-over panel */}
      <div
        className={cn(
          "relative z-50 flex h-full w-3/4 max-w-sm flex-col bg-white p-6 shadow-xl transition-transform duration-300 ease-in-out border-r border-border",
          side === "left"
            ? "left-0 animate-in slide-in-from-left"
            : "ml-auto right-0 animate-in slide-in-from-right border-l border-r-0",
          className
        )}
      >
        <button
          type="button"
          onClick={() => context.setOpen(false)}
          className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <X className="h-5 w-5" />
          <span className="sr-only">Tutup</span>
        </button>
        {children}
      </div>
    </div>
  );
}

export function SheetHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-col space-y-2 text-left mb-6", className)}
      {...props}
    />
  );
}

export function SheetTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("font-serif text-lg font-semibold text-foreground", className)}
      {...props}
    />
  );
}
