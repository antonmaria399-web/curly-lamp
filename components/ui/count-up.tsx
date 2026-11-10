"use client";
import { useInView, useReducedMotion, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/** Numbers count up in 1.3 s (ease-out), once visible. */
export function CountUp({
  value,
  format,
  prefix = "",
  suffix = "",
  decimals = 0,
  className,
  start = true,
}: {
  value: number;
  format?: (n: number) => string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
  start?: boolean;
}) {
  const fmt = format ?? ((n: number) => prefix + n.toFixed(decimals) + suffix);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(0);
  useEffect(() => {
    if (!inView || !start) return;
    if (reduce) {
      setShown(value);
      return;
    }
    const c = animate(0, value, { duration: 1.3, ease: [0.16, 1, 0.3, 1], onUpdate: setShown });
    return () => c.stop();
  }, [inView, value, reduce, start]);
  return (
    <span ref={ref} className={className}>
      {fmt(shown)}
    </span>
  );
}
