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

type ReviewItem = {
  id: string;
  rating: number;
  title: string | null;
  body: string;
  status: "pending" | "approved" | "rejected";
  guest_name: string | null;
  created_at: string;
  product?: { name: string | null } | null;
};

const normalizeReviewRow = (row: any): ReviewItem => ({
  id: String(row?.id ?? ""),
  rating: Number(row?.rating ?? 0),
  title: row?.title ? String(row.title) : null,
  body: String(row?.body ?? ""),
  status:
    row?.status === "approved" || row?.status === "rejected"
      ? row.status
      : "pending",
  guest_name: row?.guest_name ? String(row.guest_name) : null,
  created_at: String(row?.created_at ?? new Date().toISOString()),
  product: Array.isArray(row?.product)
    ? (row.product[0] ?? null)
    : (row?.product ?? null),
});

export default function AdminReviewsPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sessionChecked, setSessionChecked] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileNotice, setProfileNotice] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  const [reviewFilter, setReviewFilter] = useState<"pending" | "approved" | "all">(
    "pending",
  );
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [reviewMessage, setReviewMessage] = useState("");

  useEffect(() => {
    const init = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        await loadProfile(session.user);
      }
      setSessionChecked(true);
    };
    init();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          loadProfile(session.user);
        } else {
          setProfile(null);
        }
      },
    );
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (profile?.is_admin) {
      loadReviews();
    }
  }, [profile?.is_admin, reviewFilter]);

  const loadProfile = async (user: { id: string; user_metadata?: any; email?: string | null }) => {
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

    const fallbackName =
      user.user_metadata?.full_name ?? user.email?.split("@")[0] ?? null;

    const { data: created, error: createError } = await supabase
      .from("profiles")
      .insert({ id: user.id, full_name: fallbackName })
      .select("id, is_admin, full_name")
      .maybeSingle();

    if (createError) {
      setProfileNotice("Profile missing. Please create profile or run setup.");
      setProfile(null);
      return;
    }

    setProfile(created as Profile);
  };

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

  const loadReviews = async () => {
    setLoadingReviews(true);
    setReviewMessage("");
    let query = supabase
      .from("reviews")
      .select("id,rating,title,body,status,guest_name,created_at,product:products(name)")
      .order("created_at", { ascending: false });

    if (reviewFilter !== "all") {
      query = query.eq("status", reviewFilter);
    }

    const { data, error } = await query;
    if (error) {
      setReviewMessage(error.message);
      setReviews([]);
      setLoadingReviews(false);
      return;
    }
    setReviews((data ?? []).map(normalizeReviewRow));
    setLoadingReviews(false);
  };

  const approveReview = async (id: string) => {
    setReviewMessage("");
    const { error } = await supabase
      .from("reviews")
      .update({ status: "approved" })
      .eq("id", id);
    if (error) {
      setReviewMessage(error.message);
      return;
    }
    loadReviews();
  };

  const deleteReview = async (id: string) => {
    setReviewMessage("");
    const { error } = await supabase.from("reviews").delete().eq("id", id);
    if (error) {
      setReviewMessage(error.message);
      return;
    }
    loadReviews();
  };

  if (!sessionChecked) {
    return <div className="min-h-screen bg-slate-50 p-8">Loading...</div>;
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-16 text-slate-900">
        <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-semibold">Admin Login</h1>
          <p className="mt-2 text-sm text-slate-500">
            Sign in with your admin account.
          </p>
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
          <p className="mt-2 text-sm text-slate-600">
            Your account does not have admin access.
          </p>
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
              <h1>Review Management</h1>
              <p>Approve or delete customer reviews.</p>
            </div>
            <button className="admin-signout" onClick={handleLogout}>
              Sign Out
            </button>
          </header>

          <section className="admin-card">
            <div className="admin-reviews-header">
              <div>
                <h2 className="text-lg font-semibold">Reviews</h2>
                <p className="text-xs text-slate-500">
                  Filter by status and moderate feedback.
                </p>
              </div>
              <div className="admin-reviews-filters">
                {["pending", "approved", "all"].map((value) => (
                  <button
                    key={value}
                    type="button"
                    className={reviewFilter === value ? "active" : ""}
                    onClick={() =>
                      setReviewFilter(value as "pending" | "approved" | "all")
                    }
                  >
                    {value === "all" ? "All" : value}
                  </button>
                ))}
              </div>
            </div>

            {reviewMessage ? (
              <p className="admin-reviews-message">{reviewMessage}</p>
            ) : null}

            <div className="admin-reviews-table">
              <div className="admin-reviews-row admin-reviews-header-row">
                <div>Product</div>
                <div>Rating</div>
                <div>Reviewer</div>
                <div>Status</div>
                <div>Review</div>
                <div>Date</div>
                <div>Actions</div>
              </div>

              {loadingReviews ? (
                <div className="admin-reviews-empty">Loading reviews...</div>
              ) : reviews.length === 0 ? (
                <div className="admin-reviews-empty">No reviews found.</div>
              ) : (
                reviews.map((review) => (
                  <div key={review.id} className="admin-reviews-row">
                    <div>{review.product?.name ?? "Unknown product"}</div>
                    <div className="admin-review-stars">
                      {"★".repeat(review.rating)}
                    </div>
                    <div>{review.guest_name ?? "Guest"}</div>
                    <div>
                      <span className={`status-badge status-${review.status}`}>
                        {review.status}
                      </span>
                    </div>
                    <div>
                      <p className="admin-review-body">
                        {review.title ? `${review.title} — ` : ""}
                        {review.body}
                      </p>
                    </div>
                    <div>{new Date(review.created_at).toLocaleDateString()}</div>
                    <div className="admin-action-buttons">
                      {review.status !== "approved" ? (
                        <button
                          type="button"
                          className="admin-action-btn"
                          onClick={() => approveReview(review.id)}
                        >
                          Approve
                        </button>
                      ) : null}
                      <button
                        type="button"
                        className="admin-action-btn"
                        onClick={() => deleteReview(review.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
