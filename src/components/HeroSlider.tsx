"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Product } from "@/data/products";

type HeroSliderProps = {
  slides: Product[];
};

export default function HeroSlider({ slides }: HeroSliderProps) {
  const [index, setIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const touchStartX = useRef<number | null>(null);
  const dragOffset = useRef(0);
  const isDragging = useRef(false);
  const paused = useRef(false);
  const resumeTimer = useRef<NodeJS.Timeout | null>(null);
  const [offset, setOffset] = useState(0);
  const [draggingState, setDraggingState] = useState(false);
  const widthRef = useRef(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      if (paused.current) return;
      setIndex((prev) => (prev + 1) % slides.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [slides.length]);

  const pauseAuto = () => {
    paused.current = true;
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => {
      paused.current = false;
    }, 1800);
  };

  const handleSwipe = (deltaX: number) => {
    if (slides.length <= 1) return;
    if (Math.abs(deltaX) < 40) return;
    pauseAuto();
    if (deltaX > 0) {
      setIndex((prev) => (prev - 1 + slides.length) % slides.length);
    } else {
      setIndex((prev) => (prev + 1) % slides.length);
    }
  };

  useEffect(() => {
    const updateWidth = () => {
      widthRef.current = containerRef.current?.offsetWidth ?? 0;
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    touchStartX.current = event.clientX;
    dragOffset.current = 0;
    isDragging.current = true;
    setDraggingState(true);
    pauseAuto();
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current || touchStartX.current === null) return;
    const delta = event.clientX - touchStartX.current;
    dragOffset.current = delta;
    setOffset(delta);
  };

  const endDrag = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    setDraggingState(false);
    handleSwipe(dragOffset.current);
    dragOffset.current = 0;
    setOffset(0);
    touchStartX.current = null;
  };

  if (slides.length === 0) return null;

  const current = slides[index];
  const width = widthRef.current || 1;
  const dragPercent = (offset / width) * 100;
  const translateX = -index * 100 + dragPercent;

  return (
    <div
      ref={containerRef}
      className="hero-slider relative overflow-hidden rounded-3xl bg-white shadow-md"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerLeave={endDrag}
      onPointerCancel={endDrag}
    >
      <div
        className={`hero-track ${draggingState ? "hero-track--dragging" : ""}`}
        style={{ transform: `translateX(${translateX}%)` }}
      >
        {slides.map((slide, slideIndex) => (
          <div className="hero-slide" key={slide.slug ?? slideIndex}>
            <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
              <div className="hero-media relative min-h-[220px] bg-slate-100">
                <Image
                  src={slide.image}
                  alt={slide.name}
                  fill
                  className="hero-image"
                  draggable={false}
                />
              </div>
              <div className="flex flex-col justify-center gap-3 p-5">
                <p className="text-xs uppercase tracking-[0.3em] text-muted">
                  Discount Offer
                </p>
                <h2 className="text-xl font-semibold">
                  {slide.name} at special price
                </h2>
                <p className="text-sm text-muted">
                  Limited-time deals on best-selling essentials for your family.
                </p>
                <div className="flex gap-2">
                  {slides.map((_, dotIndex) => (
                    <button
                      key={`dot-${slideIndex}-${dotIndex}`}
                      className={`h-2 w-2 rounded-full ${
                        dotIndex === index ? "bg-accent" : "bg-slate-300"
                      }`}
                      onClick={() => {
                        pauseAuto();
                        setIndex(dotIndex);
                      }}
                      aria-label={`Go to slide ${dotIndex + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700 shadow">
        {slides.length} items
      </div>
    </div>
  );
}
