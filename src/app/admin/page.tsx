"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import AdminDrawer from "@/components/admin/AdminDrawer";
import AdminSidebar from "@/components/admin/AdminSidebar";
import RichTextEditor from "@/components/admin/RichTextEditor";

type Category = {
  id: string;
  name: string;
  slug: string;
};

type Profile = {
  id: string;
  is_admin: boolean;
  full_name: string | null;
};

type ProductImage = {
  id: string;
  image_url: string;
  sort_order: number;
};

type ProductItem = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  stock_qty: number;
  status: "active" | "inactive" | "draft";
  category_id: string | null;
  category_name?: string | null;
  images: ProductImage[];
};

const IMAGE_WIDTH = 1000;
const IMAGE_HEIGHT = 1133;

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export default function AdminDashboard() {
  const [sessionChecked, setSessionChecked] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileNotice, setProfileNotice] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [newCategory, setNewCategory] = useState("");
  const [categoryMessage, setCategoryMessage] = useState("");

  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    stock_qty: "",
    status: "active",
    category_id: "",
  });
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [editProduct, setEditProduct] = useState<ProductItem | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    stock_qty: "",
    status: "active" as ProductItem["status"],
    category_id: "",
  });
  const [editMessage, setEditMessage] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<Record<string, string>>({});
  const [drawerOpen, setDrawerOpen] = useState(false);

  const imageHint = useMemo(
    () => `Recommended: ${IMAGE_WIDTH}x${IMAGE_HEIGHT}px (ratio 3:3.4)`,
    [],
  );

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
      loadCategories();
      loadProducts();
    }
  }, [profile?.is_admin]);

  useEffect(() => {
    if (!form.slug && form.name) {
      setForm((prev) => ({ ...prev, slug: slugify(prev.name) }));
    }
  }, [form.name, form.slug]);

  useEffect(() => {
    if (files.length === 0) {
      setPreviews([]);
      return;
    }
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviews(urls);
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [files]);

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
      setProfileNotice(
        "Profile record missing. Please run the profiles SQL setup or insert profile manually.",
      );
      setProfile(null);
      return;
    }

    setProfile(created as Profile);
  };

  const loadCategories = async () => {
    setLoadingCategories(true);
    const { data } = await supabase
      .from("categories")
      .select("id, name, slug")
      .order("name", { ascending: true });
    setCategories((data as Category[]) ?? []);
    setLoadingCategories(false);
  };

  const loadProducts = async () => {
    setLoadingProducts(true);
  const { data, error } = await supabase
      .from("products")
      .select(
        "id,name,slug,description,price,stock_qty,status,category_id,category:categories(name),images:product_images(id,image_url,sort_order)",
      )
      .order("created_at", { ascending: false });

    if (error) {
      setProducts([]);
      setLoadingProducts(false);
      return [];
    }

    const items =
      (data as any[])?.map((row) => ({
        id: row.id,
        name: row.name,
        slug: row.slug,
        description: row.description,
        price: row.price ?? 0,
        stock_qty: row.stock_qty ?? 0,
        status: row.status,
        category_id: row.category_id ?? null,
        category_name: row.category?.name ?? null,
        images: (row.images ?? [])
          .map((image: any) => ({
            id: image.id,
            image_url: image.image_url,
            sort_order: image.sort_order ?? 0,
          }))
          .sort((a: ProductImage, b: ProductImage) => a.sort_order - b.sort_order),
      })) ?? [];

    setProducts(items);
    setLoadingProducts(false);
    return items;
  };


  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAuthError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setAuthError(error.message);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setProfile(null);
  };

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    setFiles(Array.from(fileList));
  };

  const handleCreateCategory = async () => {
    setCategoryMessage("");
    if (!newCategory.trim()) return;
    const payload = {
      name: newCategory.trim(),
      slug: slugify(newCategory),
    };
    const { error, data } = await supabase
      .from("categories")
      .insert(payload)
      .select("id, name, slug")
      .single();
    if (error) {
      setCategoryMessage(error.message);
      return;
    }
    setCategories((prev) => [data as Category, ...prev]);
    setNewCategory("");
  };

  const uploadImages = async (slug: string, uploadFiles: File[]) => {
    if (uploadFiles.length === 0) return [];
    const uploads = await Promise.all(
      uploadFiles.map(async (file) => {
        const filePath = `products/${slug}/${Date.now()}-${file.name}`;
        const { error } = await supabase.storage.from("files").upload(filePath, file, {
          upsert: true,
        });
        if (error) throw error;
        const { data } = supabase.storage.from("files").getPublicUrl(filePath);
        return data.publicUrl;
      }),
    );
    return uploads;
  };

  const startEdit = (product: ProductItem) => {
    setEditMessage("");
    setEditProduct(product);
    setEditForm({
      name: product.name,
      slug: product.slug,
      description: product.description ?? "",
      price: String(product.price ?? 0),
      stock_qty: String(product.stock_qty ?? 0),
      status: product.status,
      category_id: product.category_id ?? "",
    });
  };

  const handleEditSave = async () => {
    if (!editProduct) return;
    setSavingEdit(true);
    setEditMessage("");
    const slug = editForm.slug ? slugify(editForm.slug) : slugify(editForm.name);
    const { error } = await supabase
      .from("products")
      .update({
        name: editForm.name,
        slug,
        description: editForm.description || null,
        price: editForm.price ? Number(editForm.price) : 0,
        stock_qty: editForm.stock_qty ? Number(editForm.stock_qty) : 0,
        status: editForm.status,
        category_id: editForm.category_id || null,
      })
      .eq("id", editProduct.id);

    if (error) {
      setEditMessage(error.message);
      setSavingEdit(false);
      return;
    }

    const updatedList = await loadProducts();
    const updated = updatedList.find((item) => item.id === editProduct.id);
    setEditProduct(updated ?? null);
    setEditMessage("Product updated.");
    setSavingEdit(false);
  };

  const handleReplaceImage = async (image: ProductImage, file: File | null) => {
    if (!file || !editProduct) return;
    setEditMessage("");
    const slug = editForm.slug ? slugify(editForm.slug) : slugify(editForm.name);
    const previewUrl = URL.createObjectURL(file);
    setImagePreviews((prev) => ({ ...prev, [image.id]: previewUrl }));
    try {
      const [url] = await uploadImages(slug, [file]);
      const { error } = await supabase
        .from("product_images")
        .update({ image_url: url })
        .eq("id", image.id);
      if (error) throw error;
      const updatedList = await loadProducts();
      const updated = updatedList.find((item) => item.id === editProduct.id);
      setEditProduct(updated ?? null);
      setEditMessage("Image updated.");
    } catch (error) {
      setEditMessage(error instanceof Error ? error.message : "Image update failed.");
    } finally {
      URL.revokeObjectURL(previewUrl);
      setImagePreviews((prev) => {
        const next = { ...prev };
        delete next[image.id];
        return next;
      });
    }
  };

  const handleAddImage = async (file: File | null) => {
    if (!file || !editProduct) return;
    setEditMessage("");
    const slug = editForm.slug ? slugify(editForm.slug) : slugify(editForm.name);
    try {
      const [url] = await uploadImages(slug, [file]);
      const nextOrder =
        editProduct.images.reduce((max, img) => Math.max(max, img.sort_order), 0) + 1;
      const { error } = await supabase.from("product_images").insert({
        product_id: editProduct.id,
        image_url: url,
        sort_order: nextOrder,
      });
      if (error) throw error;
      const updatedList = await loadProducts();
      const updated = updatedList.find((item) => item.id === editProduct.id);
      setEditProduct(updated ?? null);
      setEditMessage("Image added.");
    } catch (error) {
      setEditMessage(error instanceof Error ? error.message : "Image upload failed.");
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitMessage("");
    if (!profile?.is_admin) return;

    if (files.length < 3) {
      setSubmitMessage("Please upload at least 3 product images.");
      return;
    }

    const slug = form.slug ? slugify(form.slug) : slugify(form.name);
    if (!slug) {
      setSubmitMessage("Slug is required.");
      return;
    }

    setSubmitting(true);
    try {
      const imageUrls = await uploadImages(slug, files);
      const { data: product, error } = await supabase
        .from("products")
        .insert({
          name: form.name,
          slug,
          description: form.description || null,
          price: form.price ? Number(form.price) : 0,
          stock_qty: form.stock_qty ? Number(form.stock_qty) : 0,
          status: form.status,
          category_id: form.category_id || null,
        })
        .select("id")
        .single();

      if (error || !product) {
        throw new Error(error?.message ?? "Failed to add product.");
      }

      if (imageUrls.length > 0) {
        const imagesPayload = imageUrls.map((url, index) => ({
          product_id: product.id,
          image_url: url,
          sort_order: index,
        }));
        const { error: imageError } = await supabase
          .from("product_images")
          .insert(imagesPayload);
        if (imageError) {
          throw new Error(imageError.message);
        }
      }

      setSubmitMessage("Product added successfully.");
      setForm({
        name: "",
        slug: "",
        description: "",
        price: "",
        stock_qty: "",
        status: "active",
        category_id: "",
      });
      setFiles([]);
      await loadProducts();
    } catch (error) {
      setSubmitMessage(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setSubmitting(false);
    }
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
              <h1>Dashboard</h1>
              <p>Manage your products and orders</p>
            </div>
            <button className="admin-signout" onClick={handleLogout}>
              Sign Out
            </button>
          </header>

        <section className="admin-card">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">Add Product</h2>
              <p className="text-xs text-slate-500">{imageHint}</p>
            </div>
          </div>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500">
                Product Images (min 3–4)
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(event) => handleFiles(event.target.files)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs"
              />
              <p className="text-[11px] text-slate-500">
                {imageHint} • Upload 3–4 images
              </p>
              {previews.length > 0 ? (
                <div className="grid grid-cols-3 gap-3">
                  {previews.map((src) => (
                    <div
                      key={src}
                      className="relative aspect-[3/3.4] overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
                    >
                      <img src={src} alt="preview" className="h-full w-full object-cover" />
                    </div>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <input
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs"
                placeholder="Product name"
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                required
              />
              <input
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs"
                placeholder="Slug"
                value={form.slug}
                onChange={(event) => setForm({ ...form, slug: event.target.value })}
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold text-slate-500">
                Description
              </label>
              <RichTextEditor
                value={form.description}
                onChange={(value) => setForm({ ...form, description: value })}
                placeholder="Write product description..."
                minHeight={160}
              />
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <input
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs"
                placeholder="Price"
                value={form.price}
                onChange={(event) =>
                  setForm({ ...form, price: event.target.value })
                }
                required
              />
              <input
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs"
                placeholder="Stock quantity"
                value={form.stock_qty}
                onChange={(event) =>
                  setForm({ ...form, stock_qty: event.target.value })
                }
              />
              <select
                value={form.status}
                onChange={(event) => setForm({ ...form, status: event.target.value })}
                className="rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="draft">Draft</option>
              </select>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <label className="flex flex-col gap-2 text-xs font-semibold text-slate-500">
                Category
                <select
                  value={form.category_id}
                  onChange={(event) =>
                    setForm({ ...form, category_id: event.target.value })
                  }
                  className="rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900"
                >
                  <option value="">Select category</option>
                  {loadingCategories ? (
                    <option>Loading...</option>
                  ) : (
                    categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))
                  )}
                </select>
              </label>
              <label className="flex flex-col gap-2 text-xs font-semibold text-slate-500">
                Create Category
                <div className="flex gap-2">
                  <input
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs"
                    placeholder="New category"
                    value={newCategory}
                    onChange={(event) => setNewCategory(event.target.value)}
                  />
                  <button
                    type="button"
                    onClick={handleCreateCategory}
                    className="rounded-xl border border-slate-200 px-3 text-xs font-semibold text-slate-700"
                  >
                    Add
                  </button>
                </div>
              </label>
            </div>

            {categoryMessage ? (
              <p className="text-xs text-rose-500">{categoryMessage}</p>
            ) : null}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-slate-900 px-4 py-3 text-xs font-semibold text-white disabled:opacity-50"
            >
              {submitting ? "Uploading..." : "Add Product"}
            </button>

            {submitMessage ? (
              <p className="text-xs font-semibold text-slate-600">
                {submitMessage}
              </p>
            ) : null}
          </form>
        </section>

        <section className="admin-card">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">Product List</h2>
              <p className="text-xs text-slate-500">
                Click edit to update details or replace images.
              </p>
            </div>
            <button
              type="button"
              onClick={loadProducts}
              className="admin-secondary-btn"
            >
              Refresh
            </button>
          </div>

          <div className="admin-product-grid">
            <div className="space-y-3">
              {loadingProducts ? (
                <p className="text-sm text-slate-500">Loading products...</p>
              ) : products.length === 0 ? (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                  No products found.
                </div>
              ) : (
                products.map((product) => (
                  <div
                    key={product.id}
                    className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-100 px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {product.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {product.category_name ?? "Uncategorized"} • Price{" "}
                        {product.price} • Stock {product.stock_qty}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                        {product.status}
                      </span>
                      <button
                        type="button"
                        onClick={() => startEdit(product)}
                        className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="admin-card-inner">
              {editProduct ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-base font-semibold">Edit Product</h3>
                    <p className="text-xs text-slate-500">
                      Editing: {editProduct.name}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-slate-500">
                      Product Images
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {editProduct.images.map((image) => (
                        <label
                          key={image.id}
                          className="group relative cursor-pointer overflow-hidden rounded-lg border border-slate-200 bg-white"
                        >
                          <img
                            src={imagePreviews[image.id] ?? image.image_url}
                            alt="Product"
                            className="h-20 w-full object-cover"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 transition group-hover:opacity-100">
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M12 20h9" />
                              <path d="M16.5 3.5a2.12 2.12 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                            </svg>
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(event) =>
                              handleReplaceImage(image, event.target.files?.[0] ?? null)
                            }
                          />
                        </label>
                      ))}
                      <label className="flex h-20 cursor-pointer items-center justify-center rounded-lg border border-dashed border-slate-300 text-xs text-slate-500">
                        + Add
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(event) =>
                            handleAddImage(event.target.files?.[0] ?? null)
                          }
                        />
                      </label>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <input
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs"
                      placeholder="Product name"
                      value={editForm.name}
                      onChange={(event) =>
                        setEditForm({ ...editForm, name: event.target.value })
                      }
                    />
                    <input
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs"
                      placeholder="Slug"
                      value={editForm.slug}
                      onChange={(event) =>
                        setEditForm({ ...editForm, slug: event.target.value })
                      }
                    />
                    <div>
                      <label className="mb-2 block text-xs font-semibold text-slate-500">
                        Description
                      </label>
                      <RichTextEditor
                        value={editForm.description}
                        onChange={(value) =>
                          setEditForm({ ...editForm, description: value })
                        }
                        placeholder="Write product description..."
                        minHeight={140}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs"
                        placeholder="Price"
                        value={editForm.price}
                        onChange={(event) =>
                          setEditForm({ ...editForm, price: event.target.value })
                        }
                        required
                      />
                      <input
                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs"
                        placeholder="Stock qty"
                        value={editForm.stock_qty}
                        onChange={(event) =>
                          setEditForm({ ...editForm, stock_qty: event.target.value })
                        }
                      />
                      <select
                        value={editForm.status}
                        onChange={(event) =>
                          setEditForm({
                            ...editForm,
                            status: event.target.value as ProductItem["status"],
                          })
                        }
                        className="rounded-xl border border-slate-200 px-3 py-2 text-xs"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="draft">Draft</option>
                      </select>
                    </div>
                    <select
                      value={editForm.category_id}
                      onChange={(event) =>
                        setEditForm({ ...editForm, category_id: event.target.value })
                      }
                      className="rounded-xl border border-slate-200 px-3 py-2 text-xs"
                    >
                      <option value="">Select category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="button"
                    disabled={savingEdit}
                    onClick={handleEditSave}
                    className="w-full rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white disabled:opacity-50"
                  >
                    {savingEdit ? "Saving..." : "Save Changes"}
                  </button>

                  {editMessage ? (
                    <p className="text-xs font-semibold text-slate-600">
                      {editMessage}
                    </p>
                  ) : null}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-slate-200 p-4 text-xs text-slate-500">
                  Select a product to edit details and images.
                </div>
              )}
            </div>
          </div>
        </section>

        </div>
      </div>
    </div>
  );
}
