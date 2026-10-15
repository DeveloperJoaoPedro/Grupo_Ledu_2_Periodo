import "./nav.js";
import { produtos as store } from "../store/data/produtos.js";
import { produtos as wine } from "../wine/data/produtos.js";
import { appUrl, icon, money, quantityControl, bindQuantity } from "./ui.js";
import { addItem, sizes } from "./carrinho.js";

const brand = document.body.dataset.brand;
const products = brand === "store" ? store : wine;
const params = new URLSearchParams(location.search);
const id = params.get("id") ?? (brand === "store" ? "vestido-serena" : "pergola");
const product = products.find((item) => item.id === id);
const detail = document.querySelector("[data-detail]");

if (!product) {
  detail.innerHTML = `<h1>Produto não encontrado</h1><p class="notice">Este item não está disponível na seleção atual.</p><a class="button" href="${appUrl(`${brand}/index.html#colecao`)}">Voltar à coleção</a>`;
} else {
  document.title = `${product.name} | Ledú ${brand === "store" ? "Store" : "Wine"}`;
  let quantity = Math.max(1, Math.min(99, Math.floor(Number(params.get("quantidade"))) || 1));
  detail.innerHTML = `
    <div class="detail__grid">
      <img class="detail__image" src="${appUrl(`shared/assets/${product.image}`)}" alt="${product.alt}" width="700" height="756" style="object-position: ${product.position ?? "center"}">
      <div class="detail__content">
        <p class="detail__category">${product.category}</p>
        <h1 class="detail__title">${product.name}</h1>
        <p class="detail__price">${money(product.price)}</p>
        <p class="detail__description">${product.description}</p>
        <form data-product-form>
          ${brand === "store" ? `<fieldset class="sizes"><legend>Tamanho:</legend><div class="sizes__options">${sizes.map((size) => `<label><input type="radio" name="tamanho" value="${size}" required><span>${size}</span></label>`).join("")}</div></fieldset>` : ""}
          <div class="detail__actions">
            ${quantityControl(quantity, product.name)}
            <button class="button" type="submit">${icon("bag")} Adicionar à sacola</button>
          </div>
          <p class="status" role="status" data-product-status></p>
          <a href="${appUrl(`${brand}/carrinho.html`)}" data-view-bag hidden>Ver minha sacola</a>
        </form>
        <p class="detail__availability">${icon("check")} Disponível em Carmo do Paranaíba – MG</p>
      </div>
    </div>`;
  bindQuantity(detail.querySelector(".quantity"), (value) => { quantity = value; });
  detail.querySelector("form").addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const size = new FormData(form).get("tamanho") ?? "";
    const saved = addItem(brand, product.id, quantity, size);
    detail.querySelector("[data-product-status]").textContent = saved
      ? `${quantity} ${quantity === 1 ? "unidade adicionada" : "unidades adicionadas"} à sacola${size ? ` · Tamanho ${size}` : ""}.`
      : "Item adicionado nesta sessão. O navegador não permitiu salvar a sacola.";
    detail.querySelector("[data-view-bag]").hidden = false;
  });
}
