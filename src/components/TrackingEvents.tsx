"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackPageView } from "@/lib/tracking.client";

export default function TrackingEvents() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;
    const search =
      typeof window !== "undefined"
        ? window.location.search.replace(/^\?/, "")
        : "";
    trackPageView(pathname, search);
  }, [pathname]);

  return null;
}
