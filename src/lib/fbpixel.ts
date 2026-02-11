export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID ?? "";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export const pageView = () => {
  if (!FB_PIXEL_ID || typeof window === "undefined") return;
  if (!window.fbq) return;
  window.fbq("track", "PageView");
};

export const event = (name: string, params?: Record<string, unknown>) => {
  if (!FB_PIXEL_ID || typeof window === "undefined") return;
  if (!window.fbq) return;
  window.fbq("track", name, params ?? {});
};
