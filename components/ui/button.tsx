"use client";
import { forwardRef } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "lime" | "ink" | "white" | "ghost" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
};

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { className, variant = "ink", size = "md", loading, children, disabled, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        "inline-flex select-none items-center justify-center gap-2 rounded-full font-semibold transition-[transform,background,box-shadow,opacity] duration-150 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50",
        size === "sm" && "h-9 px-4 text-[13px]",
        size === "md" && "h-11 px-5 text-[15px]",
        size === "lg" && "h-14 px-7 text-base",
        variant === "lime" && "bg-lime text-ink hover:brightness-95",
        variant === "ink" && "bg-fg text-bg hover:opacity-90",
        variant === "white" && "border border-black/10 bg-white text-ink shadow-sm hover:bg-zinc-50",
        variant === "ghost" && "text-fg hover:bg-surface-2",
        variant === "outline" && "border border-line bg-surface text-fg hover:bg-surface-2",
        variant === "danger" && "bg-loss text-white hover:opacity-90",
        className,
      )}
      {...rest}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
});

/** The main pill: 64px tall, breathing glow, arrow in a contrasting circle that nudges every 2.6 s. */
export const MainButton = forwardRef<HTMLButtonElement, Props & { label: string; compact?: boolean }>(function MainButton(
  { label, compact, className, loading, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      className={cn(
        "btn-main inline-flex items-center justify-between gap-4 rounded-full bg-lime pl-7 pr-2 font-semibold text-ink disabled:opacity-60",
        compact ? "h-11 pl-5 pr-1.5 text-[14px]" : "h-16 text-[17px]",
        className,
      )}
      disabled={loading || rest.disabled}
      {...rest}
    >
      <span className="whitespace-nowrap">{label}</span>
      <span className={cn("btn-arrow grid place-items-center rounded-full bg-ink text-lime", compact ? "h-8 w-8" : "h-12 w-12")}>
        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ArrowRight className={compact ? "h-4 w-4" : "h-5 w-5"} />}
      </span>
    </button>
  );
});
