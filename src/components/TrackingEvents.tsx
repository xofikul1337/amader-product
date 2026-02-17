"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackPageView } from "@/lib/tracking.client";

export default function TrackingEvents() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams?.toString() ?? "";

  useEffect(() => {
    trackPageView(pathname ?? "/", search);
  }, [pathname, search]);

  return null;
}

