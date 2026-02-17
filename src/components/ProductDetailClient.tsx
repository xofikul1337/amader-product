"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import AddToCartButton from "@/components/AddToCartButton";
import BuyNowButton from "@/components/BuyNowButton";
import CartMini from "@/components/CartMini";
import type { Product } from "@/data/products";
import { formatDiscount, formatTaka } from "@/lib/format";
import { supabase } from "@/lib/supabase/client";
import { trackViewItem } from "@/lib/tracking.client";

type ReviewItem = {
  id: string;
  rating: number;
  title: string | null;
  body: string;
  guest_name: string | null;
  created_at: string;
};

type ProductDetailClientProps = {
  product: Product;
};

const hasHtmlTag = (value: string) => /<\/?[a-z][\s\S]*>/i.test(value);

const decodeHtmlEntities = (value: string) =>
  value
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&");

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const toDisplayHtml = (value: string) => {
  const raw = (value ?? "").trim();
  if (!raw) return "";
  if (hasHtmlTag(raw)) return raw;

  const decoded = decodeHtmlEntities(raw);
  if (hasHtmlTag(decoded)) return decoded;

  return `<p>${escapeHtml(raw).replace(/\n/g, "<br />")}</p>`;
};

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const images = useMemo(
    () => (product.gallery?.length ? product.gallery : [product.image]),
    [product],
  );
  const [activeImage, setActiveImage] = useState(images[0]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [tab, setTab] = useState<"description" | "reviews">("description");
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewMessage, setReviewMessage] = useState("");
  const [reviewForm, setReviewForm] = useState({
    name: "",
    rating: 5,
    title: "",
    body: "",
  });

  const currentPrice = product.salePrice ?? product.price;
  const discount = formatDiscount(product.price, product.salePrice);
  const descriptionHtml = useMemo(() => toDisplayHtml(product.details ?? ""), [product.details]);

  useEffect(() => {
    trackViewItem({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      salePrice: product.salePrice ?? null,
      quantity: 1,
      category: product.category,
    });
  }, [
    product.id,
    product.slug,
    product.name,
    product.price,
    product.salePrice,
    product.category,
  ]);

  const loadReviews = useCallback(async () => {
    if (!product.id) return;
    setReviewsLoading(true);
    const { data } = await supabase
      .from("reviews")
      .select("id,rating,title,body,guest_name,created_at")
      .eq("product_id", product.id)
      .eq("status", "approved")
      .order("created_at", { ascending: false });
    setReviews((data as ReviewItem[]) ?? []);
    setReviewsLoading(false);
  }, [product.id]);

  useEffect(() => {
    if (tab !== "reviews") return;
    const timer = window.setTimeout(() => {
      void loadReviews();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [tab, loadReviews]);

  const submitReview = async () => {
    setReviewMessage("");
    if (!product.id) {
      setReviewMessage("Reviews are not available for this product.");
      return;
    }
    if (!reviewForm.name.trim() || !reviewForm.body.trim()) {
      setReviewMessage("Please fill in your name and review.");
      return;
    }
    const response = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: product.id,
        rating: reviewForm.rating,
        title: reviewForm.title.trim() || null,
        body: reviewForm.body.trim(),
        guestName: reviewForm.name.trim(),
      }),
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      setReviewMessage(payload?.error ?? "Review submission failed.");
      return;
    }
    setReviewMessage("Review submitted.");
    setReviewForm({ name: "", rating: 5, title: "", body: "" });
    await loadReviews();
  };

  return (
    <div className="product-detail">
      <div className="product-detail__gallery">
        <button
          type="button"
          className="product-detail__main"
          onClick={() => setLightboxOpen(true)}
        >
          <Image src={activeImage} alt={product.name} fill className="object-contain" />
        </button>
        <div className="product-detail__thumbs">
          {images.map((img, idx) => (
            <button
              key={`${img}-${idx}`}
              type="button"
              onClick={() => setActiveImage(img)}
              className={`product-thumb ${
                activeImage === img ? "product-thumb--active" : ""
              }`}
            >
              <Image src={img} alt={`${product.name} ${idx + 1}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      </div>

      <div className="product-detail__info">
        <h1 className="text-2xl font-semibold text-slate-900">
          {product.localName} {product.name}
        </h1>
        <p className="text-sm text-slate-500">{product.size}</p>

        <div className="product-detail__price">
          <span>{formatTaka(currentPrice)}</span>
          {product.salePrice ? (
            <span className="product-detail__strike">
              {formatTaka(product.price)}
            </span>
          ) : null}
          {discount ? <span className="product-detail__badge">{discount}</span> : null}
        </div>

        <div className="product-detail__actions">
          <div className="product-qty">
            <button
              type="button"
              onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
            >
              -
            </button>
            <span>{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity((prev) => prev + 1)}
            >
              +
            </button>
          </div>
          <BuyNowButton
            className="product-action-primary"
            item={{
              id: product.slug,
              name: product.name,
              image: product.image,
              price: product.price,
              salePrice: product.salePrice ?? null,
              slug: product.slug,
              href: product.href,
            }}
            quantity={quantity}
          />
          <AddToCartButton
            item={{
              id: product.slug,
              name: product.name,
              image: product.image,
              price: product.price,
              salePrice: product.salePrice ?? null,
              slug: product.slug,
              href: product.href,
            }}
            quantity={quantity}
          />
          <a href="tel:01316014985" className="product-callout">
            ☎ কল করতে ক্লিক করুন 01316-014985
          </a>
        </div>

        <div className="product-social">
          <span className="social fb">f</span>
          <span className="social ms">M</span>
          <span className="social wa">W</span>
          <span className="social tg">T</span>
          <span className="social ln">in</span>
        </div>

        <div className="product-meta">
          <span>Stock Availability:</span>
          <strong> In Stock</strong>
        </div>
      </div>

      <div className="product-detail__tabs">
        <div className="product-tabs">
          <button
            className={tab === "description" ? "tab-btn active" : "tab-btn"}
            onClick={() => setTab("description")}
          >
            Description
          </button>
          <button
            className={tab === "reviews" ? "tab-btn active" : "tab-btn"}
            onClick={() => setTab("reviews")}
          >
            Reviews ({reviews.length})
          </button>
        </div>
        <div className="product-tab-content">
          {tab === "description" ? (
            descriptionHtml ? (
              <div
                className="product-description"
                dangerouslySetInnerHTML={{ __html: descriptionHtml }}
              />
            ) : (
              <>
                <p>{product.details}</p>
                {product.highlights.length ? (
                  <ul>
                    {product.highlights.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}
              </>
            )
          ) : (
            <div className="review-section">
              <div className="review-list">
                {reviewsLoading ? (
                  <p>Loading reviews...</p>
                ) : reviews.length === 0 ? (
                  <p>No reviews yet.</p>
                ) : (
                  reviews.map((review) => (
                    <div key={review.id} className="review-card">
                      <div className="review-card__header">
                        <strong>{review.guest_name ?? "Customer"}</strong>
                        <span>{"★".repeat(review.rating)}</span>
                      </div>
                      {review.title ? <h4>{review.title}</h4> : null}
                      <p>{review.body}</p>
                      <span className="review-card__date">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  ))
                )}
              </div>
              <div className="review-form">
                <h4>Write a review</h4>
                <div className="review-grid">
                  <input
                    type="text"
                    placeholder="Your name"
                    value={reviewForm.name}
                    onChange={(event) =>
                      setReviewForm((prev) => ({
                        ...prev,
                        name: event.target.value,
                      }))
                    }
                  />
                  <div className="review-rating">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        type="button"
                        className={value <= reviewForm.rating ? "active" : ""}
                        onClick={() =>
                          setReviewForm((prev) => ({
                            ...prev,
                            rating: value,
                          }))
                        }
                        aria-label={`${value} star`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>
                <input
                  type="text"
                  placeholder="Title (optional)"
                  value={reviewForm.title}
                  onChange={(event) =>
                    setReviewForm((prev) => ({
                      ...prev,
                      title: event.target.value,
                    }))
                  }
                />
                <textarea
                  rows={4}
                  placeholder="Write your review..."
                  value={reviewForm.body}
                  onChange={(event) =>
                    setReviewForm((prev) => ({
                      ...prev,
                      body: event.target.value,
                    }))
                  }
                />
                <button type="button" onClick={submitReview}>
                  Submit Review
                </button>
                {reviewMessage ? (
                  <p className="review-message">{reviewMessage}</p>
                ) : null}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="product-accordion">
        <details>
          <summary>About Us</summary>
          <p>
            Amader Product sources authentic Bangladeshi essentials with strict
            quality checks and careful packaging.
          </p>
        </details>
        <details>
          <summary>Information</summary>
          <p>
            Delivery charges may vary by location. Please contact support for
            urgent delivery.
          </p>
        </details>
        <details>
          <summary>Customer Service</summary>
          <p>
            For assistance call 01316-014985 or message our support team.
          </p>
        </details>
      </div>

      {lightboxOpen ? (
        <div className="lightbox" onClick={() => setLightboxOpen(false)}>
          <div
            className="lightbox__content"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="lightbox__close"
              onClick={() => setLightboxOpen(false)}
            >
              ✕
            </button>
            <div className="lightbox__image">
              <Image src={activeImage} alt={product.name} fill className="object-contain" />
            </div>
          </div>
        </div>
      ) : null}
      <CartMini />
    </div>
  );
}
