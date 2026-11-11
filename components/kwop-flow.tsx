"use client";
import { useEffect } from "react";

/**
 * Kwop's visit tracking (public pages only). Skipped for automated browsers (our own e2e tests, screenshot and
 * video scripts set navigator.webdriver), so the owner's funnel in Kwop counts real people only.
 */
export function KwopFlow() {
  useEffect(() => {
    if (navigator.webdriver) return;
    if (document.querySelector('script[data-kwop-flow]')) return;
    const s = document.createElement("script");
    s.src = "https://kwop.io/flow.js";
    s.defer = true;
    s.dataset.site = "s_5cdc0c337f";
    s.dataset.kwopFlow = "1";
    document.body.appendChild(s);
  }, []);
  return null;
}
