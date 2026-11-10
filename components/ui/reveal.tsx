import { cn } from "@/lib/cn";

/*
 * Scroll reveals with zero JavaScript: CSS scroll-driven animations (.reveal in globals.css).
 * Browsers without animation-timeline simply show the content. Nothing here hydrates,
 * which keeps the landing page fast on phones. CountUp (client) lives in ./count-up.
 */

/** Each block rises 14px and fades in as it enters the screen. */
export function Reveal({ children, className, delay = 0, as = "div" }: { children: React.ReactNode; className?: string; delay?: number; as?: "div" | "section" | "li" }) {
  const As = as;
  return (
    <As className={cn("reveal", className)} style={delay ? ({ "--reveal-shift": `${Math.round(delay * 100)}%` } as React.CSSProperties) : undefined}>
      {children}
    </As>
  );
}

export function Stagger({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}

export function StaggerItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("reveal", className)}>{children}</div>;
}

export { CountUp } from "./count-up";
