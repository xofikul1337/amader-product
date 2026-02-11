"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import AdminDrawer from "@/components/admin/AdminDrawer";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { formatTaka } from "@/lib/format";

type Profile = {
  id: string;
  is_admin: boolean;
  full_name: string | null;
};

type OrderItem = {
  product_name: string;
  variant: string | null;
  quantity: number;
};

type OrderNote = {
  id: string;
  note: string;
  created_at: string;
};

type OrderRow = {
  id: string;
  status: string;
  total_qty: number | null;
  total: number;
  created_at: string;
  guest_name: string | null;
  guest_phone: string | null;
  shipping_line1: string | null;
  shipping_line2: string | null;
  shipping_city: string | null;
  shipping_state: string | null;
  shipping_postal_code: string | null;
  order_items: OrderItem[];
  order_notes: OrderNote[];
};

const statusTabs = [
  { id: "pending", label: "Pending" },
  { id: "confirmed", label: "Confirmed" },
  { id: "cancelled", label: "Cancelled" },
  { id: "sent_to_courier", label: "Sent to Courier" },
  { id: "history", label: "History / Last Orders" },
];

const pageSize = 10;

export default function TotalOrdersPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sessionChecked, setSessionChecked] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileNotice, setProfileNotice] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  const [status, setStatus] = useState("pending");
  const [historyRange, setHistoryRange] = useState("all");
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [historySummary, setHistorySummary] = useState({
    count: 0,
    amount: 0,
  });
  const [loading, setLoading] = useState(false);
  const [counts, setCounts] = useState<Record<string, number>>({});

  const [noteOpen, setNoteOpen] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [noteOrder, setNoteOrder] = useState<OrderRow | null>(null);
  const [noteMessage, setNoteMessage] = useState("");
  const [noteEditId, setNoteEditId] = useState<string | null>(null);
  const [statusUpdating, setStatusUpdating] = useState<string | null>(null);

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
      loadCounts();
      loadOrders(true);
      if (status === "history") {
        loadHistorySummary();
      }
    }
  }, [profile?.is_admin, status, historyRange]);

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

  const loadCounts = async () => {
    const statusList = ["pending", "confirmed", "cancelled", "sent_to_courier"];
    const nextCounts: Record<string, number> = {};

    for (const s of statusList) {
      const { count } = await supabase
        .from("orders")
        .select("id", { count: "exact", head: true })
        .eq("status", s);
      nextCounts[s] = count ?? 0;
    }

    const { count: total } = await supabase
      .from("orders")
      .select("id", { count: "exact", head: true });

    setCounts(nextCounts);
    setTotalOrders(total ?? 0);
  };

  const loadOrders = async (reset = false) => {
    setLoading(true);
    if (reset) {
      setOrders([]);
    }
    const from = reset ? 0 : orders.length;
    let query = supabase
      .from("orders")
      .select(
        `id,status,total_qty,total,created_at,
        guest_name,guest_phone,
        shipping_line1,shipping_line2,shipping_city,shipping_state,shipping_postal_code,
        order_items(product_name,variant,quantity),
        order_notes(id,note,created_at)`,
      )
      .order("created_at", { ascending: false })
      .range(from, from + pageSize - 1);

    if (status !== "history") {
      query = query.eq("status", status);
    } else if (historyRange !== "all") {
      const { start, end } = getRangeDates(historyRange);
      if (start && end) {
        query = query.gte("created_at", start).lt("created_at", end);
      }
    }

    const { data, error } = await query;
    if (!error) {
      setOrders((prev) =>
        reset ? (data as OrderRow[]) : [...prev, ...(data as OrderRow[])],
      );
    }
    setLoading(false);
  };

  const getRangeDates = (range: string) => {
    const now = new Date();
    const start = new Date();
    const end = new Date();

    if (range === "today") {
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
    } else if (range === "yesterday") {
      start.setDate(start.getDate() - 1);
      end.setDate(end.getDate() - 1);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
    } else if (range === "last7") {
      start.setDate(start.getDate() - 6);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
    } else if (range === "last30") {
      start.setDate(start.getDate() - 29);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
    } else {
      return { start: null, end: null };
    }

    return { start: start.toISOString(), end: end.toISOString() };
  };

  const loadHistorySummary = async () => {
    let query = supabase.from("orders").select("total", { count: "exact" });

    if (historyRange !== "all") {
      const { start, end } = getRangeDates(historyRange);
      if (start && end) {
        query = query.gte("created_at", start).lt("created_at", end);
      }
    }

    const { data, count } = await query;
    const amount = (data ?? []).reduce(
      (sum, row) => sum + Number(row?.total ?? 0),
      0,
    );
    setHistorySummary({ count: count ?? 0, amount });
  };


  const openNoteDialog = (order: OrderRow) => {
    const latest = getLatestNote(order.order_notes);
    setNoteOrder(order);
    setNoteText(latest?.note ?? "");
    setNoteEditId(latest?.id ?? null);
    setNoteMessage("");
    setNoteOpen(true);
  };

  const saveNote = async () => {
    if (!noteOrder || !noteText.trim()) return;
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const payload = {
      order_id: noteOrder.id,
      note: noteText.trim(),
      created_by: user?.id ?? null,
    };

    const { error } = noteEditId
      ? await supabase.from("order_notes").update(payload).eq("id", noteEditId)
      : await supabase.from("order_notes").insert(payload);
    if (error) {
      setNoteMessage(error.message);
      return;
    }
    setNoteOpen(false);
    setNoteEditId(null);
    await loadOrders(true);
  };

  const formatDate = (value: string) => new Date(value).toLocaleString();

  const renderProducts = (items: OrderItem[]) =>
    items.map((item) => `${item.product_name}${item.variant ? ` (${item.variant})` : ""} x${item.quantity}`).join(", ");

  const getLatestNote = (notes: OrderNote[] | undefined) => {
    if (!notes || notes.length === 0) return null;
    return [...notes].sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    )[notes.length - 1];
  };

  const updateStatus = async (orderId: string, nextStatus: string) => {
    setStatusUpdating(orderId);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { error } = await supabase
      .from("orders")
      .update({ status: nextStatus })
      .eq("id", orderId);

    if (!error) {
      await supabase.from("order_status_history").insert({
        order_id: orderId,
        status: nextStatus,
        changed_by: user?.id ?? null,
      });
      await loadCounts();
      await loadOrders(true);
    }
    setStatusUpdating(null);
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

  const currentTotal = status === "history" ? totalOrders : counts[status] ?? 0;
  const hasMore = orders.length < currentTotal;

  const graphData = statusTabs
    .filter((tab) => tab.id !== "history")
    .map((tab) => ({
      label: tab.label,
      count: counts[tab.id] ?? 0,
    }));
  const maxGraph = Math.max(...graphData.map((item) => item.count), 1);

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
              <h1>Total Order List</h1>
              <p>
                Total Orders:{" "}
                {status === "history" ? historySummary.count : totalOrders}
              </p>
              {status === "history" ? (
                <p>Total Sales: {formatTaka(historySummary.amount)}</p>
              ) : null}
            </div>
            <button className="admin-signout" onClick={handleLogout}>
              Sign Out
            </button>
          </header>

        <section className="admin-orders-graph">
          {graphData.map((item) => (
            <div key={item.label} className="admin-graph-row">
              <span>{item.label}</span>
              <div className="admin-graph-bar">
                <div
                  style={{ width: `${(item.count / maxGraph) * 100}%` }}
                ></div>
              </div>
              <strong>{item.count}</strong>
            </div>
          ))}
        </section>

        <div className="admin-status-tabs">
          {statusTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={status === tab.id ? "active" : ""}
              onClick={() => setStatus(tab.id)}
            >
              {tab.label}
              {tab.id !== "history" ? (
                <span>{counts[tab.id] ?? 0}</span>
              ) : null}
            </button>
          ))}
        </div>

        {status === "history" ? (
          <div className="admin-history-filters">
            <button
              type="button"
              className={`admin-history-btn ${
                historyRange === "today" ? "active" : ""
              }`}
              onClick={() => setHistoryRange("today")}
            >
              Today
            </button>
            <button
              type="button"
              className={`admin-history-btn ${
                historyRange === "yesterday" ? "active" : ""
              }`}
              onClick={() => setHistoryRange("yesterday")}
            >
              Yesterday
            </button>
            <button
              type="button"
              className={`admin-history-btn ${
                historyRange === "last7" ? "active" : ""
              }`}
              onClick={() => setHistoryRange("last7")}
            >
              Last 7 Days
            </button>
            <button
              type="button"
              className={`admin-history-btn ${
                historyRange === "last30" ? "active" : ""
              }`}
              onClick={() => setHistoryRange("last30")}
            >
              Last Month
            </button>
            <button
              type="button"
              className={`admin-history-btn ${
                historyRange === "all" ? "active" : ""
              }`}
              onClick={() => setHistoryRange("all")}
            >
              All Time
            </button>
          </div>
        ) : null}


        <div className="admin-orders-table">
          <div className="admin-orders-row admin-orders-header-row">
            <div>Order ID</div>
            <div>Customer</div>
            <div>Phone</div>
            <div>Address</div>
            <div>Status</div>
            <div>Total Qty</div>
            <div>Total</div>
            <div>Products</div>
            <div>Notes</div>
            <div>Date</div>
            <div>Actions</div>
          </div>

          {orders.map((order) => {
            const customerName = order.guest_name ?? "-";
            const phone = order.guest_phone ?? "-";
            const address = [
              order.shipping_line1,
              order.shipping_city,
              order.shipping_state,
              order.shipping_postal_code,
            ]
              .filter(Boolean)
              .join(", ");

            const latestNote = getLatestNote(order.order_notes);
            const totalQty =
              order.total_qty ??
              order.order_items?.reduce((sum, item) => sum + item.quantity, 0) ??
              0;

            return (
              <div key={order.id} className="admin-orders-row">
                <div className="mono">{order.id.slice(0, 8)}</div>
                <div>{customerName}</div>
                <div>{phone}</div>
                <div>{address || "-"}</div>
                <div>
                  <span className={`status-badge status-${order.status}`}>
                    {order.status}
                  </span>
                </div>
                <div>{totalQty}</div>
                <div>{formatTaka(order.total)}</div>
                <div>{renderProducts(order.order_items || [])}</div>
                <div className="note-cell">
                  {latestNote?.note ? latestNote.note : "-"}
                </div>
                <div>{formatDate(order.created_at)}</div>
                <div>
                  <div className="admin-action-buttons">
                    <button
                      type="button"
                      className={`admin-action-btn ${
                        order.status === "confirmed" ? "active" : ""
                      }`}
                      disabled={statusUpdating === order.id}
                      onClick={() => updateStatus(order.id, "confirmed")}
                    >
                      Confirm
                    </button>
                    <button
                      type="button"
                      className={`admin-action-btn ${
                        order.status === "cancelled" ? "active" : ""
                      }`}
                      disabled={statusUpdating === order.id}
                      onClick={() => updateStatus(order.id, "cancelled")}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className={`admin-action-btn ${
                        order.status === "sent_to_courier" ? "active" : ""
                      }`}
                      disabled={statusUpdating === order.id}
                      onClick={() => updateStatus(order.id, "sent_to_courier")}
                    >
                      Courier
                    </button>
                    <button
                      type="button"
                      className="note-btn"
                      onClick={() => openNoteDialog(order)}
                    >
                      Add Note
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {loading ? (
            <div className="admin-orders-empty">Loading...</div>
          ) : null}

          {!loading && orders.length === 0 ? (
            <div className="admin-orders-empty">No orders found.</div>
          ) : null}
        </div>

        {hasMore ? (
          <div className="admin-load-more">
            <button type="button" onClick={() => loadOrders(false)}>
              Load More
            </button>
          </div>
        ) : null}
      </div>

      {noteOpen ? (
        <div className="admin-modal" onClick={() => setNoteOpen(false)}>
          <div className="admin-modal__content" onClick={(event) => event.stopPropagation()}>
            <h3>Add Note</h3>
            <textarea
              rows={4}
              value={noteText}
              onChange={(event) => setNoteText(event.target.value)}
              placeholder="Write note..."
            />
            {noteMessage ? <p className="note-error">{noteMessage}</p> : null}
            <div className="admin-modal__actions">
              <button type="button" onClick={() => setNoteOpen(false)}>
                Cancel
              </button>
              <button type="button" onClick={saveNote}>
                Save
              </button>
            </div>
          </div>
        </div>
      ) : null}
      </div>
    </div>
  );
}
