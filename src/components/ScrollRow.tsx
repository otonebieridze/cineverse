"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { ChevronIcon } from "@/components/ChevronIcon";

const SCROLL_FRACTION = 0.8;

const EDGE_TOLERANCE_PX = 1;

const BUTTON_CLASS_NAME =
  "absolute top-1/2 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/80 text-foreground shadow-card backdrop-blur transition hover:bg-surface-hover aria-disabled:cursor-not-allowed aria-disabled:opacity-40 aria-disabled:hover:bg-background/80 sm:flex";

function scrollBehavior(): ScrollBehavior {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
}

type ScrollRowProps = {
  label: string;
  children: ReactNode;
};

export function ScrollRow({ label, children }: ScrollRowProps) {
  const regionId = useId();
  const scrollerRef = useRef<HTMLDivElement>(null);
  // Both start false: the server can't measure, so arrows and fades appear after mount.
  const [canScrollBack, setCanScrollBack] = useState(false);
  const [canScrollForward, setCanScrollForward] = useState(false);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) {
      return;
    }

    // React skips the re-render when a boolean is unchanged, so this is cheap per scroll event.
    const updateEdges = () => {
      const { scrollLeft, scrollWidth, clientWidth } = scroller;
      setCanScrollBack(scrollLeft > EDGE_TOLERANCE_PX);
      setCanScrollForward(scrollLeft + clientWidth < scrollWidth - EDGE_TOLERANCE_PX);
    };

    updateEdges();
    scroller.addEventListener("scroll", updateEdges, { passive: true });
    const resizeObserver = new ResizeObserver(updateEdges);
    resizeObserver.observe(scroller);

    return () => {
      scroller.removeEventListener("scroll", updateEdges);
      resizeObserver.disconnect();
    };
  }, []);

  function scrollByPage(direction: 1 | -1) {
    const scroller = scrollerRef.current;
    if (!scroller) {
      return;
    }
    scroller.scrollBy({
      left: direction * scroller.clientWidth * SCROLL_FRACTION,
      behavior: scrollBehavior(),
    });
  }

  const buttons = [
    {
      direction: -1,
      name: `Scroll ${label} back`,
      enabled: canScrollBack,
      icon: "left",
      position: "left-0 -translate-x-1/2",
    },
    {
      direction: 1,
      name: `Scroll ${label} forward`,
      enabled: canScrollForward,
      icon: "right",
      position: "right-0 translate-x-1/2",
    },
  ] as const;

  // Fade only the edge that has more content beyond it.
  const fadeClassName = `${canScrollBack ? "mask-l-from-90% sm:mask-l-from-95%" : ""} ${
    canScrollForward ? "mask-r-from-90% sm:mask-r-from-95%" : ""
  }`;

  return (
    <div className="relative">
      <div
        ref={scrollerRef}
        id={regionId}
        role="region"
        aria-label={`${label}, scrollable`}
        tabIndex={0}
        className={`-mx-4 snap-x snap-mandatory scroll-px-4 overflow-x-auto overscroll-x-contain px-4 pb-2 scrollbar-none sm:-mx-6 sm:scroll-px-6 sm:px-6 lg:-mx-8 lg:scroll-px-8 lg:px-8 ${fadeClassName}`}
      >
        <ul className="flex w-max gap-4 *:snap-start sm:gap-6">{children}</ul>
      </div>
      {buttons.map(({ direction, name, enabled, icon, position }) => (
        <button
          key={direction}
          type="button"
          aria-label={name}
          aria-controls={regionId}
          aria-disabled={!enabled}
          onClick={() => {
            if (enabled) {
              scrollByPage(direction);
            }
          }}
          className={`${BUTTON_CLASS_NAME} ${position}`}
        >
          <ChevronIcon direction={icon} className="size-5" />
        </button>
      ))}
    </div>
  );
}
