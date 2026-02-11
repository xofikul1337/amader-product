"use client";

import { useEffect, useRef, useState } from "react";
import { categoryToParam } from "@/data/products";

type CategoryScrollerProps = {
  categories: string[];
};

export default function CategoryScroller({ categories }: CategoryScrollerProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const paused = useRef(false);
  const resumeTimer = useRef<NodeJS.Timeout | null>(null);
  const speed = 0.6;
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (isDesktop) return;
    const el = ref.current;
    if (!el) return;

    const pause = () => {
      paused.current = true;
      if (resumeTimer.current) clearTimeout(resumeTimer.current);
      resumeTimer.current = setTimeout(() => {
        paused.current = false;
      }, 1500);
    };

    el.addEventListener("pointerdown", pause);
    el.addEventListener("wheel", pause);
    el.addEventListener("touchstart", pause);

    return () => {
      el.removeEventListener("pointerdown", pause);
      el.removeEventListener("wheel", pause);
      el.removeEventListener("touchstart", pause);
    };
  }, []);

  useEffect(() => {
    if (isDesktop) return;
    let raf: number;
    let offset = 0;

    const step = () => {
      const el = ref.current;
      if (el && !paused.current) {
        const loopPoint = el.scrollWidth / 2;
        if (loopPoint > 0) {
          offset = el.scrollLeft + speed;
          if (offset >= loopPoint) {
            offset = 0;
          }
          el.scrollLeft = offset;
        }
      }
      raf = window.requestAnimationFrame(step);
    };

    raf = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(raf);
  }, [speed]);

  const displayCategories = isDesktop ? categories : [...categories, ...categories];

  return (
    <div ref={ref} className="scroll-row">
      {displayCategories.map((category, index) => (
        <a
          key={`${category}-${index}`}
          href={`/?category=${categoryToParam(category)}#products`}
          className="text-center"
        >
          <div className="category-tile aspect-square overflow-hidden rounded-2xl bg-slate-100 shadow-sm">
            <div className="category-letter grid h-full place-items-center font-semibold text-accent">
              {category.slice(0, 1)}
            </div>
          </div>
          <p className="mt-2 text-[11px] font-semibold text-slate-700">
            {category}
          </p>
        </a>
      ))}
    </div>
  );
}
