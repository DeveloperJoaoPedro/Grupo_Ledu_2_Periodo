import "./nav.js";
import { produtos as store } from "../store/data/produtos.js";
import { produtos as wine } from "../wine/data/produtos.js";
import { appUrl, money, quantityControl, bindQuantity, notify } from "./ui.js";
import { readStorage, writeStorage } from "./storage.js";
import { readCart, saveCart, calculateTotals } from "./carrinho.js";

const brand = document.body.dataset.brand;
const products = brand === "store" ? store : wine;
const itemsElement = document.querySelector("[data-cart-items]");
const summary = document.querySelector("[data-summary]");
const couponKey = `ledu:coupon:${brand}`;
const savedCoupon = readStorage(couponKey, "");
let coupon = typeof savedCoupon === "string" ? savedCoupon : "";
const couponInput = document.querySelector("[name=cupom]");
couponInput.value = coupon;
let items;

function updateTotals() {
  const totals = calculateTotals(items, products, coupon, brand);
  for (const key of ["subtotal", "shipping", "discount", "total"]) {
    document.querySelector(`[data-${key}]`).textContent = `${key === "discount" && totals.discount ? "− " : ""}${money(totals[key])}`;
  }
  const status = document.querySelector("[data-coupon-status]");
  status.classList.toggle("status--error", Boolean(coupon) && !totals.validCoupon);
  status.textContent = !coupon ? "" : totals.validCoupon ? "Cupom válido: 10% de desconto nos produtos." : "Cupom inválido para esta marca.";
  summary.hidden = items.length === 0;
}

function render() {
  // Produtos desconhecidos são ignorados: o armazenamento local não é fonte de preços.
  items = readCart(brand).filter((item) => products.some((product) => product.id === item.id));
  itemsElement.replaceChildren();
  if (!items.length) {
    itemsElement.innerHTML = `<div class="empty"><h2>Sua sacola está vazia</h2><p>Encontre sua próxima escolha na nossa coleção.</p><a class="button" href="${appUrl(`${brand}/index.html#colecao`)}">Explorar coleção</a></div>`;
  }
  items.forEach((item, index) => {
    const product = products.find((product) => product.id === item.id);
    const row = document.createElement("article");
    row.className = "cart-item";
    row.innerHTML = `
      <a href="${appUrl(`${brand}/produto.html?id=${product.id}`)}"><img class="cart-item__image" src="${appUrl(`shared/assets/${product.image}`)}" alt="${product.alt}" width="128" height="170" style="object-position:${product.position ?? "center"}"></a>
      <div><h2 class="cart-item__name"><a href="${appUrl(`${brand}/produto.html?id=${product.id}`)}">${product.name}</a></h2>
        <p class="cart-item__meta">${brand === "store" ? `Tamanho ${item.size}` : product.volume}</p>
        ${quantityControl(item.quantity, product.name)}
      </div>
      <div class="cart-item__end"><p class="cart-item__price" data-item-price>${money(product.price * item.quantity)}</p><button type="button" class="text-button cart-item__remove" aria-label="Remover ${product.name}${item.size ? ` tamanho ${item.size}` : ""}">Remover</button></div>`;
    bindQuantity(row.querySelector(".quantity"), (value) => {
      items[index].quantity = value;
      const saved = saveCart(brand, items);
      if (!saved) notify("Não foi possível salvar a sacola para a próxima visita.");
      row.querySelector("[data-item-price]").textContent = money(product.price * value);
      document.querySelector("[data-checkout-status]").textContent = "";
      updateTotals();
    });
    row.querySelector(".cart-item__remove").addEventListener("click", () => {
      items.splice(index, 1);
      saveCart(brand, items);
      render();
      const focusTarget = itemsElement.querySelector(".cart-item__remove, .button");
      focusTarget?.focus();
      notify(`${product.name} removido da sacola.`);
    });
    itemsElement.append(row);
  });
  updateTotals();
}

document.querySelector("[data-coupon-form]").addEventListener("submit", (event) => {
  event.preventDefault();
  coupon = couponInput.value.trim().toUpperCase();
  couponInput.value = coupon;
  writeStorage(couponKey, coupon);
  document.querySelector("[data-checkout-status]").textContent = "";
  updateTotals();
});

document.querySelector("[data-checkout]").addEventListener("click", () => {
  // TODO Firebase: integrar o pedido somente após aprovar o fluxo de checkout.
  // Não há cobrança nem criação de pedido real neste protótipo.
  document.querySelector("[data-checkout-status]").textContent = "Compra de demonstração concluída. Nenhum pedido real ou cobrança foi realizado.";
});

window.addEventListener("storage", render);
render();
