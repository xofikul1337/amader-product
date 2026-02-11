export type Product = {
  id?: string;
  slug: string;
  name: string;
  localName: string;
  size: string;
  price: number;
  salePrice?: number;
  gallery: string[];
  rating: number;
  reviews: number;
  category: string;
  origin: string;
  shortDescription: string;
  details: string;
  highlights: string[];
  image: string;
  href: string;
};

export const seedProducts: Product[] = [
  {
    slug: "crystal-honey-1kg",
    name: "Crystal Honey",
    localName: "ক্রিস্টাল হানি",
    size: "1kg",
    price: 1100,
    salePrice: 1000,
    rating: 4.7,
    reviews: 28,
    category: "Honey",
    origin: "Bangladesh",
    shortDescription:
      "Crystal Honey/ক্রিস্টাল হানি ক্রিস্টালাইজেশন একটি প্রাকৃতিক প্রক্রিয়া। এটি মধুর গুণমানকে কোনোভাবেই প্রভাবিত করে না।",
    details:
      "Crystal honey naturally crystallizes over time without losing its aroma or nutrition. Enjoy a smooth, rich sweetness that pairs beautifully with tea, toast, and desserts.",
    highlights: [
      "Naturally crystallized with no additives",
      "Balanced sweetness and floral aroma",
      "Great for breakfast, baking, and remedies",
    ],
    image:
      "https://ghorerbazar.com/cdn/shop/files/Honeyraj-Crystal-honey_jpg.jpg?v=1769086806",
    gallery: [
      "https://ghorerbazar.com/cdn/shop/files/Honeyraj-Crystal-honey_jpg.jpg?v=1769086806",
      "https://ghorerbazar.com/cdn/shop/files/Crystal-Honey-2kg.jpg?v=1767530519",
      "https://ghorerbazar.com/cdn/shop/files/Natural-Honey-Tiffin-box.jpg?v=1765633957",
    ],
    href: "https://ghorerbazar.com/products/crystal-honey",
  },
  {
    slug: "deshi-mustard-oil-5ltr",
    name: "Deshi Mustard Oil",
    localName: "দেশি সরিষার তেল",
    size: "5 L",
    price: 1550,
    salePrice: 1472,
    rating: 4.6,
    reviews: 19,
    category: "Oil",
    origin: "Bangladesh",
    shortDescription:
      "সয়াবিন তেল বাজারে আসার পর থেকে আমরা অনেকেই সরিষার তেলের উপকারিতা ভুলে গেছি। অথচ সরিষার তেল স্বাস্থ্যকর রান্নার জন্য আদর্শ।",
    details:
      "Cold-pressed mustard oil with a bold aroma and deep flavor. Perfect for traditional Bangladeshi রান্না, ভাজি, এবং আচার তৈরিতে।",
    highlights: [
      "Strong mustard aroma for authentic dishes",
      "Cold-pressed for richer nutrition",
      "Family-size 5L pack for everyday cooking",
    ],
    image:
      "https://ghorerbazar.com/cdn/shop/files/Shsoti-Mastraid-oil5lt.jpg?v=1767012506",
    gallery: [
      "https://ghorerbazar.com/cdn/shop/files/Shsoti-Mastraid-oil5lt.jpg?v=1767012506",
      "https://ghorerbazar.com/cdn/shop/files/500ml.jpg?v=1755795227",
      "https://ghorerbazar.com/cdn/shop/files/Shsoti-Mastraid-oil5lt.jpg?v=1767012506",
    ],
    href: "https://ghorerbazar.com/products/local-maghi-sarisha-oil-5-ltr",
  },
  {
    slug: "gawa-ghee-1kg",
    name: "Gawa Ghee",
    localName: "গাওয়া ঘি",
    size: "1kg",
    price: 1800,
    salePrice: 1710,
    rating: 4.8,
    reviews: 41,
    category: "Ghee",
    origin: "Bangladesh",
    shortDescription:
      "খাঁটি গাওয়া ঘি দুধের একটি প্রক্রিয়াজাত খাদ্য উপাদান। হাজার বছর আগে বাঙালির খাবারে ঘি-এর উৎপত্তি।",
    details:
      "Traditional ghee crafted from pure dairy. Adds deep aroma and richness to biryani, sweets, and everyday রান্না.",
    highlights: [
      "Slow-cooked for a nutty aroma",
      "Rich, golden texture",
      "Ideal for festive dishes and sweets",
    ],
    image:
      "https://ghorerbazar.com/cdn/shop/files/Shosti-Ghee-1kg.jpg?v=1762321237",
    gallery: [
      "https://ghorerbazar.com/cdn/shop/files/Shosti-Ghee-1kg.jpg?v=1762321237",
      "https://ghorerbazar.com/cdn/shop/files/Shosti-Ghee-1kg.jpg?v=1762321237",
      "https://ghorerbazar.com/cdn/shop/files/Shosti-Ghee-1kg.jpg?v=1762321237",
    ],
    href: "https://ghorerbazar.com/products/gawa-ghee-1-kg",
  },
  {
    slug: "sundarban-honey-1kg",
    name: "Sundarban Honey",
    localName: "সুন্দরবনের মধু",
    size: "1kg",
    price: 2500,
    salePrice: 2200,
    rating: 4.9,
    reviews: 33,
    category: "Honey",
    origin: "Sundarbans, Bangladesh",
    shortDescription:
      "সুন্দরবন ফুলের মধু : পীতাভ বাদামী রঙের মতো দেখতে মধুই সুন্দরবনের খাঁটি ও বিশুদ্ধ মধু।",
    details:
      "Harvested from the Sundarbans, this honey carries a deep floral taste and golden color. A premium jar for everyday wellness.",
    highlights: [
      "Wildflower harvest from the Sundarbans",
      "Deep floral notes with a smooth finish",
      "Premium gift-ready packaging",
    ],
    image:
      "https://ghorerbazar.com/cdn/shop/files/WhatsApp_Image_2025-11-04_at_18.51.14_1.jpg?v=1762261008",
    gallery: [
      "https://ghorerbazar.com/cdn/shop/files/WhatsApp_Image_2025-11-04_at_18.51.14_1.jpg?v=1762261008",
      "https://ghorerbazar.com/cdn/shop/files/WhatsApp_Image_2025-11-04_at_18.51.14.jpg?v=1762260973",
      "https://ghorerbazar.com/cdn/shop/files/Natural-Honey-Tiffin-box.jpg?v=1765633957",
    ],
    href: "https://ghorerbazar.com/products/sundarban-honey",
  },
  {
    slug: "ajwa-premium-dates-1kg",
    name: "Ajwa Premium Dates",
    localName: "আজওয়া প্রিমিয়াম খেজুর",
    size: "1kg (Large)",
    price: 2200,
    salePrice: 2090,
    rating: 4.8,
    reviews: 22,
    category: "Dates",
    origin: "Madinah, Saudi Arabia",
    shortDescription:
      "আজওয়া প্রিমিয়াম খেজুর সংগ্রহ করা হয় সৌদি আরবের পবিত্র মদিনা শহর থেকে—যা বিশ্বব্যাপী সর্বোচ্চ মানের।",
    details:
      "Large Ajwa dates with a soft texture and caramel sweetness. A premium choice for gifting, Ramadan, and daily nutrition.",
    highlights: [
      "Large, soft, and naturally sweet",
      "Sourced from Madinah, Saudi Arabia",
      "Ideal for gifting and daily energy",
    ],
    image:
      "https://ghorerbazar.com/cdn/shop/files/Ajwa-Dates_1kg_V2.1.jpg?v=1768127088",
    gallery: [
      "https://ghorerbazar.com/cdn/shop/files/Ajwa-Dates_1kg_V2.1.jpg?v=1768127088",
      "https://ghorerbazar.com/cdn/shop/files/Ajwa-Dates_1kg_V1.1.jpg?v=1767607563",
      "https://ghorerbazar.com/cdn/shop/files/Sukkari-Dates_1kg_V1_1.jpg?v=1768126621",
    ],
    href: "https://ghorerbazar.com/products/ajwa-premium-dates-1kg-new",
  },
  {
    slug: "himalayan-pink-salt-500g",
    name: "Glarvest Himalayan Pink Salt",
    localName: "হিমালয়ান পিঙ্ক সল্ট",
    size: "500g",
    price: 750,
    salePrice: 675,
    rating: 4.5,
    reviews: 12,
    category: "Salt",
    origin: "Khewra, Pakistan",
    shortDescription:
      "হিমালয়ান পিঙ্ক সল্ট হলো প্রাকৃতিক, অপরিশোধিত এক ধরনের খনিজ লবণ, যা পাকিস্তানের খেওড়া সল্ট মাইনসহ উৎস থেকে আসে।",
    details:
      "Mineral-rich pink salt with a clean flavor. Ideal for everyday cooking, finishing, and healthy seasoning.",
    highlights: [
      "Naturally mineral-rich and unrefined",
      "Clean flavor for everyday cooking",
      "Premium quality, fine grain",
    ],
    image:
      "https://ghorerbazar.com/cdn/shop/files/Pink-salt_73a4f0cb-0584-4539-9eab-d32f9a366442.jpg?v=1765633844",
    gallery: [
      "https://ghorerbazar.com/cdn/shop/files/Pink-salt_73a4f0cb-0584-4539-9eab-d32f9a366442.jpg?v=1765633844",
      "https://ghorerbazar.com/cdn/shop/files/Danadar-Pink-salt_ce21791d-da39-4fb2-9733-050d5b99458d.jpg?v=1765633905",
      "https://ghorerbazar.com/cdn/shop/files/Pink-salt_73a4f0cb-0584-4539-9eab-d32f9a366442.jpg?v=1765633844",
    ],
    href: "https://ghorerbazar.com/products/glarvest-himalayan-pink-salt-500g",
  },
  {
    slug: "honeynuts-800gm",
    name: "Honey Nuts",
    localName: "Honey Nuts",
    size: "800g",
    price: 1500,
    salePrice: 1500,
    rating: 4.6,
    reviews: 9,
    category: "Honey",
    origin: "Bangladesh",
    shortDescription:
      "A rich blend of premium nuts infused with natural honey for a balanced sweet crunch.",
    details:
      "Crunchy mixed nuts coated in natural honey. Great for snacking, gifting, and adding to breakfast bowls.",
    highlights: [
      "Premium nuts with natural honey",
      "Great for snacks and gifts",
      "No artificial flavoring",
    ],
    image:
      "https://ghorerbazar.com/cdn/shop/files/Honey_nuts_800g.jpg?v=1754736848",
    gallery: [
      "https://ghorerbazar.com/cdn/shop/files/Honey_nuts_800g.jpg?v=1754736848",
      "https://ghorerbazar.com/cdn/shop/files/Honey_nuts_800g.jpg?v=1754736848",
      "https://ghorerbazar.com/cdn/shop/files/Honey_nuts_800g.jpg?v=1754736848",
    ],
    href: "https://ghorerbazar.com/products/honeynuts-800gm",
  },
  {
    slug: "natural-honeycomb-1kg",
    name: "Natural Honeycomb",
    localName: "Natural Honeycomb",
    size: "1kg",
    price: 2500,
    salePrice: 2250,
    rating: 4.7,
    reviews: 11,
    category: "Honey",
    origin: "Bangladesh",
    shortDescription:
      "Raw honeycomb with pure honey straight from the hive.",
    details:
      "Enjoy honey in its most natural form with edible wax comb and rich floral flavor.",
    highlights: [
      "Raw honey straight from the hive",
      "Edible comb and pure honey",
      "Great for natural remedies",
    ],
    image:
      "https://ghorerbazar.com/cdn/shop/files/Natural-Honey-Tiffin-box.jpg?v=1765633957",
    gallery: [
      "https://ghorerbazar.com/cdn/shop/files/Natural-Honey-Tiffin-box.jpg?v=1765633957",
      "https://ghorerbazar.com/cdn/shop/files/Natural-Honey-Tiffin-box.jpg?v=1765633957",
      "https://ghorerbazar.com/cdn/shop/files/Natural-Honey-Tiffin-box.jpg?v=1765633957",
    ],
    href: "https://ghorerbazar.com/products/natural-honeycomb-1kg",
  },
  {
    slug: "sukkari-mufattal-dates-1-kg",
    name: "Sukkari Mufattal Malaki Dates",
    localName: "Sukkari Mufattal Dates",
    size: "1kg",
    price: 1500,
    salePrice: 1425,
    rating: 4.7,
    reviews: 14,
    category: "Dates",
    origin: "Saudi Arabia",
    shortDescription:
      "Premium Sukkari dates with soft texture and caramel sweetness.",
    details:
      "Traditional Saudi dates prized for their rich taste and melt-in-mouth softness.",
    highlights: [
      "Soft and naturally sweet",
      "Premium Saudi variety",
      "Perfect for Ramadan and gifting",
    ],
    image:
      "https://ghorerbazar.com/cdn/shop/files/Sukkari-Dates_1kg_V1_1.jpg?v=1768126621",
    gallery: [
      "https://ghorerbazar.com/cdn/shop/files/Sukkari-Dates_1kg_V1_1.jpg?v=1768126621",
      "https://ghorerbazar.com/cdn/shop/files/Sukkari-Dates_1kg_V1_1.jpg?v=1768126621",
      "https://ghorerbazar.com/cdn/shop/files/Sukkari-Dates_1kg_V1_1.jpg?v=1768126621",
    ],
    href: "https://ghorerbazar.com/products/sukkari-mufattal-dates-1-kg",
  },
  {
    slug: "egyptian-medjool-dates-large-1kg",
    name: "Egyptian Medjool Dates",
    localName: "Egyptian Medjool Dates",
    size: "1kg (Large)",
    price: 2200,
    salePrice: 2090,
    rating: 4.8,
    reviews: 10,
    category: "Dates",
    origin: "Egypt",
    shortDescription:
      "Large Medjool dates known as the king of dates.",
    details:
      "Plump, chewy Medjool dates with a deep caramel flavor and premium texture.",
    highlights: [
      "Large premium Medjool dates",
      "Naturally sweet and chewy",
      "Great for gifting and snacks",
    ],
    image:
      "https://ghorerbazar.com/cdn/shop/files/KhejuriMedjooldatescopy_jpg.jpg?v=1769695626",
    gallery: [
      "https://ghorerbazar.com/cdn/shop/files/KhejuriMedjooldatescopy_jpg.jpg?v=1769695626",
      "https://ghorerbazar.com/cdn/shop/files/KhejuriMedjooldatescopy_jpg.jpg?v=1769695626",
      "https://ghorerbazar.com/cdn/shop/files/KhejuriMedjooldatescopy_jpg.jpg?v=1769695626",
    ],
    href: "https://ghorerbazar.com/products/egyptian-medjool-dates-large-1kg",
  },
  {
    slug: "glarvest-organic-longjing-green-tea-100g",
    name: "Glarvest Organic Longjing Green Tea",
    localName: "Longjing Green Tea",
    size: "100g",
    price: 1400,
    salePrice: 1400,
    rating: 4.6,
    reviews: 7,
    category: "Tea",
    origin: "China",
    shortDescription:
      "Premium Longjing green tea with a smooth, fresh aroma.",
    details:
      "Organic Longjing tea leaves from China brewed for a clean, soothing taste.",
    highlights: [
      "Organic Longjing leaves",
      "Fresh, smooth flavor",
      "Ideal for daily tea ritual",
    ],
    image: "https://ghorerbazar.com/cdn/shop/files/green-tea.jpg?v=1768826834",
    gallery: [
      "https://ghorerbazar.com/cdn/shop/files/green-tea.jpg?v=1768826834",
      "https://ghorerbazar.com/cdn/shop/files/green-tea.jpg?v=1768826834",
      "https://ghorerbazar.com/cdn/shop/files/green-tea.jpg?v=1768826834",
    ],
    href: "https://ghorerbazar.com/products/glarvest-organic-longjing-green-tea-100g",
  },
  {
    slug: "black-seed-honey-1kg",
    name: "Black Seed Honey",
    localName: "Black Seed Honey",
    size: "1kg",
    price: 1600,
    salePrice: 1440,
    rating: 4.8,
    reviews: 13,
    category: "Honey",
    origin: "Bangladesh",
    shortDescription:
      "A premium honey infused with black seed flower nectar.",
    details:
      "Rich, aromatic black seed honey known for its unique taste and wellness benefits.",
    highlights: [
      "Distinct black seed aroma",
      "Premium quality honey",
      "Great for wellness routines",
    ],
    image:
      "https://ghorerbazar.com/cdn/shop/files/Black-Seeds-honey-1000gm_38dde83a-34b0-484a-87fa-73e27d337d11.jpg?v=1765634086",
    gallery: [
      "https://ghorerbazar.com/cdn/shop/files/Black-Seeds-honey-1000gm_38dde83a-34b0-484a-87fa-73e27d337d11.jpg?v=1765634086",
      "https://ghorerbazar.com/cdn/shop/files/Black-Seeds-honey-1000gm_38dde83a-34b0-484a-87fa-73e27d337d11.jpg?v=1765634086",
      "https://ghorerbazar.com/cdn/shop/files/Black-Seeds-honey-1000gm_38dde83a-34b0-484a-87fa-73e27d337d11.jpg?v=1765634086",
    ],
    href: "https://ghorerbazar.com/products/black-seed-honey-1kg",
  },
  {
    slug: "lichu-fuler-modhu-1kg",
    name: "Lichu Flower Honey",
    localName: "Lichu Flower Honey",
    size: "1kg",
    price: 1200,
    salePrice: 1200,
    rating: 4.6,
    reviews: 8,
    category: "Honey",
    origin: "Bangladesh",
    shortDescription:
      "Light golden honey collected from litchi blossoms.",
    details:
      "A delicate, floral honey with a smooth finish and pleasant aroma.",
    highlights: [
      "Floral litchi blossom taste",
      "Light golden color",
      "Perfect for tea and desserts",
    ],
    image:
      "https://ghorerbazar.com/cdn/shop/files/Lichu-Modhu-1kg_with-box_v2.jpg?v=1763297695",
    gallery: [
      "https://ghorerbazar.com/cdn/shop/files/Lichu-Modhu-1kg_with-box_v2.jpg?v=1763297695",
      "https://ghorerbazar.com/cdn/shop/files/Lichu-Modhu-1kg_with-box_v2.jpg?v=1763297695",
      "https://ghorerbazar.com/cdn/shop/files/Lichu-Modhu-1kg_with-box_v2.jpg?v=1763297695",
    ],
    href: "https://ghorerbazar.com/products/lichu-fuler-modhu-1kg",
  },
];

export const featuredProduct = seedProducts[3];

const safeDecode = (value: string) => {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

export const normalizeSlug = (value: string) => {
  const decoded = safeDecode(value).trim();
  const withoutOrigin = decoded.replace(/^https?:\/\/[^/]+/i, "");
  const withoutQuery = withoutOrigin.replace(/[#?].*$/, "");
  const trimmed = withoutQuery.replace(/^\/+|\/+$/g, "");
  const parts = trimmed.split("/");
  return (parts[parts.length - 1] || "").toLowerCase();
};

export const getSeedProductBySlug = (slug: string) => {
  const target = normalizeSlug(slug);
  const direct = seedProducts.find(
    (product) => normalizeSlug(product.slug) === target,
  );
  if (direct) return direct;

  const byHref = seedProducts.find(
    (product) => normalizeSlug(product.href) === target,
  );
  if (byHref) return byHref;

  return seedProducts.find((product) => {
    const candidate = normalizeSlug(product.slug);
    return candidate.startsWith(target) || target.startsWith(candidate);
  });
};

export const normalizeCategory = (value: string) =>
  value.trim().toLowerCase().replace(/\s+/g, "-");

export const buildCategories = (items: Product[]) => [
  "All Product",
  ...Array.from(new Set(items.map((product) => product.category))).sort(),
];

export const seedCategories = buildCategories(seedProducts);

export const categoryToParam = (category: string) =>
  category === "All Product" ? "all" : normalizeCategory(category);

export const matchesCategory = (categoryParam: string | undefined, product: Product) => {
  if (!categoryParam || categoryParam === "all") return true;
  return normalizeCategory(product.category) === normalizeCategory(categoryParam);
};
