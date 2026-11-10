"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

/*
 * The landing page's decorative animations (video player, animated phones, feature loops) are loaded only when
 * they come near the screen. Their space is reserved with the same size, so nothing moves (CLS 0), and the first
 * screen hydrates with much less JavaScript (Lighthouse performance on phones).
 */
function WhenNear({ className, children }: { className?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setNear(true), io.disconnect()), { rootMargin: "600px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={className}>
      {near ? children : null}
    </div>
  );
}

const VSL = dynamic(() => import("./vsl").then((m) => m.VSL), { ssr: false });
const HowPhone = dynamic(() => import("./bits").then((m) => m.HowPhone), { ssr: false });
const FeatureLoop = dynamic(() => import("./bits").then((m) => m.FeatureLoop), { ssr: false });
const Phone = dynamic(() => import("./phone").then((m) => m.Phone), { ssr: false });
const HeroNotifications = dynamic(() => import("./bits").then((m) => m.HeroNotifications), { ssr: false });

export function LazyVSL({ video }: { video: boolean }) {
  return (
    <WhenNear className={cn("rounded-[24px]", video ? "aspect-video" : "aspect-[4/5] sm:aspect-video")}>
      <VSL video={video} />
    </WhenNear>
  );
}

export function LazyHowPhone({ step }: { step: 1 | 2 | 3 }) {
  return (
    <WhenNear className="mx-auto aspect-[9/19.5] w-[230px]">
      <HowPhone step={step} />
    </WhenNear>
  );
}

export function LazyFeatureLoop({ kind }: { kind: "scan" | "fees" | "goal" | "export" }) {
  return (
    <WhenNear className="h-full">
      <FeatureLoop kind={kind} />
    </WhenNear>
  );
}

export function LazyLockPhone() {
  return (
    <WhenNear className="mx-auto aspect-[9/19.5] w-[260px]">
      <Phone lock>
        <HeroNotifications />
      </Phone>
    </WhenNear>
  );
}
