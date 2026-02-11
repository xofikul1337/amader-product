export const formatTaka = (value: number) => `৳ ${value.toLocaleString("en-US")}`;

export const formatDiscount = (price: number, salePrice?: number) => {
  if (!salePrice || salePrice >= price) return null;
  const percent = Math.round(((price - salePrice) / price) * 100);
  return `${percent}% off`;
};
