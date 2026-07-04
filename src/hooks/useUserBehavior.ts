"use client";

import { useEffect, useRef, useCallback } from "react";

type BehaviorEvent = {
  event: string;
  data?: Record<string, unknown>;
};

const SCROLL_MILESTONES = [25, 50, 75, 100];
const firedMilestones = new Set<number>();

async function sendEvent(payload: BehaviorEvent) {
  try {
    await fetch("/api/behavior", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...payload,
        timestamp: new Date().toISOString(),
      }),
    });
  } catch {
    // Fail silently – behavior tracking is non-critical
  }
}

export function useUserBehavior(onMilestone?: (percent: number) => void) {
  const scrollHandler = useRef<(() => void) | null>(null);
  const clickHandler = useRef<((e: MouseEvent) => void) | null>(null);

  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight <= 0) return;

    const percent = Math.round((scrollTop / docHeight) * 100);

    for (const milestone of SCROLL_MILESTONES) {
      if (percent >= milestone && !firedMilestones.has(milestone)) {
        firedMilestones.add(milestone);
        sendEvent({ event: "scroll_milestone", data: { percent: milestone } });
        onMilestone?.(milestone);
      }
    }
  }, [onMilestone]);

  const handleClick = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const interactiveEl = target.closest("button, a, [data-track]");
    if (!interactiveEl) return;

    const label =
      interactiveEl.getAttribute("aria-label") ||
      interactiveEl.getAttribute("id") ||
      interactiveEl.textContent?.trim().slice(0, 40) ||
      "unknown";

    sendEvent({
      event: "click",
      data: {
        label,
        tag: interactiveEl.tagName.toLowerCase(),
        href: (interactiveEl as HTMLAnchorElement).href ?? null,
      },
    });
  }, []);

  useEffect(() => {
    scrollHandler.current = handleScroll;
    clickHandler.current = handleClick;

    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("click", handleClick, { capture: true });

    // Track initial page view
    sendEvent({ event: "page_view", data: { path: window.location.pathname } });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("click", handleClick, { capture: true });
    };
  }, [handleScroll, handleClick]);
}
