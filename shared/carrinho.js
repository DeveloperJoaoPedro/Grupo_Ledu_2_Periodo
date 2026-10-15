import { readStorage, writeStorage } from "./storage.js";

const brands = ["store", "wine"];
export const sizes = ["P", "M", "G", "GG"];
const key = (brand) => `ledu:cart:${brand}`;

export function readCart(brand) {
  if (!brands.includes(brand)) return [];
  const cart = readStorage(key(brand), []);
  if (!Array.isArray(cart)) return [];
  return cart.filter((item) => item && typeof item.id === "string" &&
    Number.isInteger(item.quantity) && item.quantity > 0 && item.quantity <= 99 &&
    (brand !== "store" || sizes.includes(item.size))).map((item) => ({
    id: item.id, size: brand === "store" ? item.size : "", quantity: item.quantity,
  }));
}

export function saveCart(brand, cart) {
  if (!brands.includes(brand)) return false;
  const saved = writeStorage(key(brand), cart);
  window.dispatchEvent(new Event("ledu:cart"));
  return saved;
}

export function addItem(brand, id, quantity, size = "") {
  const cart = readCart(brand);
  const existing = cart.find((item) => item.id === id && item.size === size);
  const amount = Math.max(1, Math.min(99, Number(quantity) || 1));
  if (existing) existing.quantity = Math.min(99, existing.quantity + amount);
  else cart.push({ id, quantity: amount, size });
  return saveCart(brand, cart);
}

// Valores monetários em centavos evitam diferenças de arredondamento na sacola.
export function calculateTotals(items, products, coupon = "", brand = "store") {
  const subtotal = items.reduce((sum, item) => {
    const product = products.find((product) => product.id === item.id);
    return sum + (product?.price ?? 0) * item.quantity;
  }, 0);
  const validCoupon = coupon.trim().toUpperCase() === `LEDU${brand.toUpperCase()}10`;
  const discount = validCoupon ? Math.round(subtotal * .1) : 0;
  const shipping = subtotal ? 500 : 0;
  return { subtotal, shipping, discount, total: subtotal + shipping - discount, validCoupon };
}
