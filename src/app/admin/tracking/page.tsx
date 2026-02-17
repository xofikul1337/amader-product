"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import AdminDrawer from "@/components/admin/AdminDrawer";
import AdminSidebar from "@/components/admin/AdminSidebar";

type Profile = {
  id: string;
  is_admin: boolean;
  full_name: string | null;
};

type AuthUser = {
  id: string;
  email?: string | null;
  user_metadata?: {
    full_name?: string;
  };
};

const GTM_REGEX = /^GTM-[A-Z0-9]+$/i;

const sanitizeGtmId = (value: string) => value.trim().toUpperCase();

export default function AdminTrackingPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sessionChecked, setSessionChecked] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileNotice, setProfileNotice] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  const [gtmId, setGtmId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const loadProfile = async (user: AuthUser) => {
    setProfileNotice("");
    const { data, error } = await supabase
      .from("profiles")
      .select("id, is_admin, full_name")
      .eq("id", user.id)
      .maybeSingle();

    if (error && error.code !== "PGRST116") {
      setProfileNotice(error.message);
      setProfile(null);
      return;
    }

    if (data) {
      setProfile(data as Profile);
      return;
    }

    const fallbackName = user.user_metadata?.full_name ?? user.email?.split("@")[0] ?? null;
    const { data: created, error: createError } = await supabase
      .from("profiles")
      .insert({ id: user.id, full_name: fallbackName })
      .select("id, is_admin, full_name")
      .maybeSingle();

    if (createError) {
      setProfileNotice("Profile record missing. Please run profile SQL setup.");
      setProfile(null);
      return;
    }

    setProfile(created as Profile);
  };

  const loadSetting = async () => {
    setLoading(true);
    setMessage("");
    const { data, error } = await supabase
      .from("tracking_settings")
      .select("value")
      .eq("key", "gtm_id")
      .maybeSingle();

    if (error) {
      setMessage(
        "Could not load tracking settings. Run SQL for tracking_settings table and RLS policies.",
      );
      setLoading(false);
      return;
    }

    setGtmId(typeof data?.value === "string" ? data.value : "");
    setLoading(false);
  };

  useEffect(() => {
    const init = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        await loadProfile(session.user as AuthUser);
      }
      setSessionChecked(true);
    };
    init();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          await loadProfile(session.user as AuthUser);
        } else {
          setProfile(null);
        }
      },
    );

    return () => authListener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (profile?.is_admin) {
      const timer = window.setTimeout(() => {
        void loadSetting();
      }, 0);
      return () => window.clearTimeout(timer);
    }
  }, [profile?.is_admin]);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAuthError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setAuthError(error.message);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setProfile(null);
  };

  const saveSetting = async () => {
    setSaving(true);
    setMessage("");
    const normalized = sanitizeGtmId(gtmId);

    if (normalized && !GTM_REGEX.test(normalized)) {
      setMessage("Invalid GTM format. Use GTM-XXXXXXX");
      setSaving(false);
      return;
    }

    const { error } = await supabase.from("tracking_settings").upsert(
      {
        key: "gtm_id",
        value: normalized || null,
      },
      { onConflict: "key" },
    );

    if (error) {
      setMessage(error.message);
      setSaving(false);
      return;
    }

    setGtmId(normalized);
    setMessage(normalized ? "GTM ID saved successfully." : "GTM ID cleared.");
    setSaving(false);
  };

  if (!sessionChecked) {
    return <div className="min-h-screen bg-slate-50 p-8">Loading...</div>;
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-16 text-slate-900">
        <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-semibold">Admin Login</h1>
          <p className="mt-2 text-sm text-slate-500">Sign in with your admin account.</p>
          {profileNotice ? (
            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-700">
              {profileNotice}
            </div>
          ) : null}
          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
              placeholder="admin@email.com"
            />
            <input
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
              placeholder="Password"
            />
            {authError ? (
              <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-xs text-rose-600">
                {authError}
              </div>
            ) : null}
            <button
              type="submit"
              className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
            >
              Sign in
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (!profile.is_admin) {
    return (
      <div className="min-h-screen bg-slate-50 p-8 text-slate-900">
        <div className="mx-auto max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h1 className="text-xl font-semibold">Access denied</h1>
          <p className="mt-2 text-sm text-slate-600">Your account does not have admin access.</p>
          <button
            className="mt-4 rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold"
            onClick={handleLogout}
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900">
      <div className="admin-shell">
        <AdminSidebar />
        <div className="admin-main">
          <AdminDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
          <header className="admin-header">
            <button
              type="button"
              className="admin-menu-btn"
              onClick={() => setDrawerOpen(true)}
            >
              Menu
            </button>
            <div>
              <h1>Enter Google Tag Manager ID</h1>
              <p>Configure container ID for GA4 and Facebook Pixel via GTM.</p>
            </div>
            <button className="admin-signout" onClick={handleLogout}>
              Sign Out
            </button>
          </header>

          <section className="admin-card">
            <div className="grid gap-4 md:max-w-xl">
              <label className="text-xs font-semibold text-slate-500">
                GTM Container ID
              </label>
              <input
                type="text"
                placeholder="GTM-XXXXXXX"
                value={gtmId}
                onChange={(event) => setGtmId(event.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm uppercase"
                disabled={loading || saving}
              />
              <p className="text-xs text-slate-500">
                Example: GTM-ABC1234. Leave empty to disable all GTM-based tracking.
              </p>
              <button
                type="button"
                onClick={saveSetting}
                disabled={loading || saving}
                className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save GTM ID"}
              </button>
              {message ? <p className="text-xs font-semibold text-slate-600">{message}</p> : null}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
