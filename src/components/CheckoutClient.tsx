"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  CartItem,
  clearCart,
  readCart,
  removeFromCart,
  updateQuantity,
} from "@/lib/cart";
import { formatTaka } from "@/lib/format";
import {
  trackAddPaymentInfo,
  trackAddShippingInfo,
  trackBeginCheckout,
  trackEvent,
  trackPurchase,
} from "@/lib/tracking.client";

const shippingOptions = [
  { id: "inside", label: "ঢাকা শহরের ভিতরে", cost: 60 },
  { id: "outside", label: "ঢাকা শহরের বাইরে", cost: 120 },
];

const paymentOptions = [{ id: "cod", label: "ক্যাশ অন ডেলিভারি" }];

export default function CheckoutClient() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [shipping, setShipping] = useState("inside");
  const [payment, setPayment] = useState("cod");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    note: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const refresh = () => setItems(readCart());

  useEffect(() => {
    refresh();
    const handler = () => refresh();
    window.addEventListener("cart:updated", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("cart:updated", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  const subtotal = useMemo(
    () =>
      items.reduce(
        (sum, item) =>
          sum + (item.salePrice ?? item.price) * item.quantity,
        0,
      ),
    [items],
  );

  const shippingCost =
    shippingOptions.find((option) => option.id === shipping)?.cost ?? 0;
  const total = subtotal + shippingCost;
  const trackingItems = useMemo(
    () =>
      items.map((item) => ({
        id: item.id,
        slug: item.slug,
        name: item.name,
        price: item.price,
        salePrice: item.salePrice ?? null,
        quantity: item.quantity,
      })),
    [items],
  );

  useEffect(() => {
    if (items.length === 0) return;
    trackBeginCheckout(trackingItems, shippingCost);
  }, [items.length, trackingItems, shippingCost]);

  const handleSubmit = async () => {
    setSubmitMessage("");
    if (items.length === 0) {
      setSubmitMessage("Cart is empty.");
      return;
    }
    if (!form.name.trim() || !form.phone.trim() || !form.address.trim()) {
      setSubmitMessage("Please fill in name, phone, and address.");
      return;
    }

    setSubmitting(true);
    try {
      trackAddShippingInfo(
        trackingItems,
        shippingOptions.find((option) => option.id === shipping)?.label ?? shipping,
      );
      trackAddPaymentInfo(
        trackingItems,
        paymentOptions.find((option) => option.id === payment)?.label ?? payment,
      );

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          phone: form.phone.trim(),
          address: form.address.trim(),
          note: form.note.trim() || null,
          shipping,
          payment,
          items,
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload?.error ?? "Order submission failed.");
      }

      clearCart();
      setItems([]);
      setForm({ name: "", phone: "", address: "", note: "" });
      trackPurchase(payload.order_id ?? `order_${Date.now()}`, trackingItems, shippingCost);
      setSubmitMessage(
        payload?.order_id
          ? `Order placed. ID: ${payload.order_id.slice(0, 8)}`
          : "Order placed successfully.",
      );
    } catch (error) {
      trackEvent("checkout_error", {
        message: error instanceof Error ? error.message : "Order submission failed.",
      });
      setSubmitMessage(
        error instanceof Error ? error.message : "Order submission failed.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container-tight pb-28 pt-6">
      <nav className="checkout-breadcrumb">
        <Link href="/">Home</Link>
        <span>›</span>
        <span>Shopping Cart</span>
        <span>›</span>
        <strong>Checkout</strong>
      </nav>

      <div className="checkout-card">
        <h2>অর্ডার করতে নিচের ফর্মটি পূরণ করুন</h2>
        <div className="checkout-field">
          <span className="checkout-icon">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4zm0 2c-3.3 0-8 1.7-8 5v1h16v-1c0-3.3-4.7-5-8-5z"
                fill="currentColor"
              />
            </svg>
          </span>
          <input
            type="text"
            placeholder="আপনার নাম লিখুন"
            value={form.name}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, name: event.target.value }))
            }
          />
        </div>
        <div className="checkout-field">
          <span className="checkout-icon">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M6.6 10.8a15.5 15.5 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.2 11.4 11.4 0 0 0 3.6.6 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A18 18 0 0 1 4 5a1 1 0 0 1 1-1h2.4a1 1 0 0 1 1 1 11.4 11.4 0 0 0 .6 3.6 1 1 0 0 1-.2 1z"
                fill="currentColor"
              />
            </svg>
          </span>
          <input
            type="tel"
            placeholder="আপনার মোবাইল নাম্বার লিখুন"
            value={form.phone}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, phone: event.target.value }))
            }
          />
        </div>
        <div className="checkout-field">
          <span className="checkout-icon">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M12 2a7 7 0 0 0-7 7c0 5.3 7 13 7 13s7-7.7 7-13a7 7 0 0 0-7-7zm0 9.5a2.5 2.5 0 1 1 2.5-2.5 2.5 2.5 0 0 1-2.5 2.5z"
                fill="currentColor"
              />
            </svg>
          </span>
          <input
            type="text"
            placeholder="আপনার ঠিকানা লিখুন (থানা + জেলা) সহ"
            value={form.address}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, address: event.target.value }))
            }
          />
        </div>
        <div className="checkout-field">
          <span className="checkout-icon">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 4h16v12H7l-3 3V4z" fill="currentColor" />
            </svg>
          </span>
          <textarea
            rows={3}
            placeholder="কোনো মন্তব্য থাকলে লিখুন"
            value={form.note}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, note: event.target.value }))
            }
          />
        </div>

        <div className="checkout-section">
          <h3>এলাকা নির্বাচন করুন</h3>
          <div className="checkout-options">
            {shippingOptions.map((option) => (
              <label key={option.id} className="checkout-option">
                <input
                  type="radio"
                  name="shipping"
                  value={option.id}
                  checked={shipping === option.id}
                  onChange={() => setShipping(option.id)}
                />
                <span>{option.label}</span>
                <strong>{formatTaka(option.cost)}</strong>
              </label>
            ))}
          </div>
        </div>

        <div className="checkout-section">
          <h3>পেমেন্ট পদ্ধতি নির্বাচন করুন</h3>
          <div className="checkout-options">
            {paymentOptions.map((option) => (
              <label key={option.id} className="checkout-option">
                <input
                  type="radio"
                  name="payment"
                  value={option.id}
                  checked={payment === option.id}
                  onChange={() => setPayment(option.id)}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <button
        className="checkout-submit"
        disabled={submitting}
        onClick={handleSubmit}
      >
        {submitting
          ? "Submitting..."
          : `অর্ডার কনফার্ম করুন (${formatTaka(total)})`}
      </button>
      {submitMessage ? (
        <p className="checkout-message">{submitMessage}</p>
      ) : null}

      <div className="checkout-summary">
        <h3>আপনার অর্ডার</h3>
        {items.length === 0 ? (
          <div className="checkout-empty">
            <p>কার্টে কোনো পণ্য নেই।</p>
            <Link href="/" className="checkout-link">
              পণ্য দেখতে যান
            </Link>
          </div>
        ) : (
          <>
            <div className="checkout-items">
              {items.map((item) => {
                const itemPrice = item.salePrice ?? item.price;
                return (
                  <div key={item.id} className="checkout-item">
                    <div className="checkout-item__image">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="84px"
                        className="object-cover"
                      />
                    </div>
                    <div className="checkout-item__info">
                      <h4>{item.name}</h4>
                      <div className="checkout-qty">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                        >
                          −
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                        >
                          +
                        </button>
                        <span className="checkout-price">
                          {formatTaka(itemPrice)}
                        </span>
                        <span className="checkout-price">
                          {formatTaka(itemPrice * item.quantity)}
                        </span>
                        <button
                          type="button"
                          className="checkout-remove"
                          onClick={() => removeFromCart(item.id)}
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="checkout-totals">
              <div>
                <span>Sub-Total</span>
                <strong>{formatTaka(subtotal)}</strong>
              </div>
              <div>
                <span>
                  {
                    shippingOptions.find((option) => option.id === shipping)
                      ?.label
                  }
                </span>
                <strong>{formatTaka(shippingCost)}</strong>
              </div>
              <div className="total">
                <span>Total</span>
                <strong>{formatTaka(total)}</strong>
              </div>
            </div>
            <button className="checkout-clear" onClick={() => clearCart()}>
              কার্ট খালি করুন
            </button>
          </>
        )}
      </div>
    </div>
  );
}
