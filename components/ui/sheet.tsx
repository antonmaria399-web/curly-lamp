"use client";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/cn";

const subscribeMQ = (cb: () => void) => {
  const mq = window.matchMedia("(min-width: 768px)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
export function useDesktop() {
  return useSyncExternalStore(subscribeMQ, () => window.matchMedia("(min-width: 768px)").matches, () => false);
}
const noop = () => () => {};
export function useMounted() {
  return useSyncExternalStore(noop, () => true, () => false);
}

type SheetProps = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  /** "full": full screen on phones (paywall). "bottom": bottom sheet with a grab handle (checkout, sign-up). */
  mode?: "full" | "bottom";
  width?: number;
  label: string;
  closeSide?: "left" | "right";
  z?: number;
  className?: string;
  dark?: boolean;
};

export function Sheet({ open, onClose, children, mode = "bottom", width = 480, label, closeSide = "left", z = 60, className, dark }: SheetProps) {
  const desktop = useDesktop();
  const mounted = useMounted();
  const reduce = useReducedMotion();
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    panel.current?.focus();
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!mounted) return null;
  const full = mode === "full" && !desktop;
  const spring = reduce ? { duration: 0 } : { type: "spring" as const, damping: 32, stiffness: 340 };

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className={cn("fixed inset-0", dark && "dark")} style={{ zIndex: z }} role="dialog" aria-modal="true" aria-label={label}>
          <motion.div
            className="absolute inset-0 bg-black/55 backdrop-blur-[3px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <div className={cn("pointer-events-none absolute inset-0 flex", desktop ? "items-center justify-center p-6" : "items-end")}>
            <motion.div
              ref={panel}
              tabIndex={-1}
              className={cn(
                "pointer-events-auto relative flex w-full flex-col overflow-hidden bg-surface text-fg shadow-2xl outline-none",
                desktop ? "max-h-[min(92dvh,900px)] rounded-[22px] border border-line" : full ? "h-dvh" : "max-h-[94dvh] rounded-t-[24px]",
                className,
              )}
              style={desktop ? { maxWidth: width } : undefined}
              initial={desktop ? { opacity: 0, y: 24, scale: 0.98 } : { y: "100%" }}
              animate={desktop ? { opacity: 1, y: 0, scale: 1 } : { y: 0 }}
              exit={desktop ? { opacity: 0, y: 16, scale: 0.98 } : { y: "100%" }}
              transition={spring}
              drag={!desktop && !full ? "y" : false}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.6 }}
              onDragEnd={(_, info) => {
                if (info.offset.y > 120 || info.velocity.y > 600) onClose();
              }}
            >
              {!desktop && !full && (
                <div className="flex shrink-0 justify-center pb-1 pt-2.5">
                  <span className="h-1.5 w-10 rounded-full bg-fg/15" />
                </div>
              )}
              <button
                onClick={onClose}
                aria-label="Close"
                className={cn(
                  "absolute top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-surface-2 text-fg/70 transition hover:text-fg active:scale-95",
                  closeSide === "left" ? "left-3" : "right-3",
                  full && "top-[max(12px,env(safe-area-inset-top))]",
                )}
              >
                <X className="h-[18px] w-[18px]" />
              </button>
              {children}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
