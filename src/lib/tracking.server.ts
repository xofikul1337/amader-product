import { createServerSupabase } from "@/lib/supabase/server";

const GTM_PATTERN = /^GTM-[A-Z0-9]+$/i;

const sanitizeGtmId = (value: unknown) => {
  if (typeof value !== "string") return null;
  const trimmed = value.trim().toUpperCase();
  if (!trimmed) return null;
  if (!GTM_PATTERN.test(trimmed)) return null;
  return trimmed;
};

export const getGtmContainerId = async () => {
  const envFallback = sanitizeGtmId(
    process.env.NEXT_PUBLIC_GTM_ID ?? process.env.GTM_ID ?? "",
  );
  const supabase = createServerSupabase();
  if (!supabase) return envFallback;

  const { data, error } = await supabase
    .from("tracking_settings")
    .select("value")
    .eq("key", "gtm_id")
    .maybeSingle();

  if (error || !data) return envFallback;
  return sanitizeGtmId(data.value) ?? envFallback;
};

