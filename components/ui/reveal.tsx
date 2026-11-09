"use client";
import { motion, useInView, useReducedMotion, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const ease = [0.22, 0.8, 0.24, 1] as const;

/** Each block rises 14px and fades in once (0.5 s), its children staggered 60 ms. */
export function Reveal({ children, className, delay = 0, as = "div" }: { children: React.ReactNode; className?: string; delay?: number; as?: "div" | "section" | "li" }) {
  const reduce = useReducedMotion();
  const M = motion[as];
  return (
    <M
      className={className}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -60px 0px" }}
      transition={reduce ? { duration: 0 } : { duration: 0.5, ease, delay }}
    >
      {children}
    </M>
  );
}

export function Stagger({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -60px 0px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div className={className} variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } } }}>
      {children}
    </motion.div>
  );
}

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
