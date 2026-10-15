import "./nav.js";
import { produtos as store } from "../store/data/produtos.js";
import { produtos as wine } from "../wine/data/produtos.js";
import { appUrl, icon, money, quantityControl, bindQuantity, notify } from "./ui.js";
import { addItem } from "./carrinho.js";

const brand = document.body.dataset.brand;
const products = (brand === "store" ? store : wine).filter((product) => product.featured !== false);
const grid = document.querySelector("[data-products]");

for (const product of products) {
  let quantity = 1;
  const card = document.createElement("article");
  card.className = "product-card";
  card.dataset.product = product.id;
  const detailUrl = appUrl(`${brand}/produto.html?id=${product.id}`);
  card.innerHTML = `
    <a class="product-card__link" href="${detailUrl}">
      <img class="product-card__image" src="${appUrl(`shared/assets/${product.image}`)}" alt="${product.alt}" loading="lazy" width="440" height="680" style="object-position: ${product.position ?? "center"}">
      <h3 class="product-card__name">${product.name}</h3>
    </a>
    <div class="product-card__bottom">
      <p class="product-card__price">${money(product.price)}</p>
      <div class="product-card__actions">
        ${brand === "store" ? `<a class="icon-button" data-select-size href="${detailUrl}" aria-label="Escolher tamanho de ${product.name}">${icon("cart")}</a>` : `<button class="icon-button" type="button" data-add aria-label="Adicionar ${product.name} à sacola">${icon("cart")}</button>`}
        ${quantityControl(1, product.name)}
      </div>
    </div>`;
  grid.append(card);
  bindQuantity(card.querySelector(".quantity"), (value) => {
    quantity = value;
    const selectSize = card.querySelector("[data-select-size]");
    if (selectSize) selectSize.href = `${detailUrl}&quantidade=${quantity}`;
  });
  card.querySelector("[data-add]")?.addEventListener("click", () => {
    const saved = addItem(brand, product.id, quantity);
    notify(saved ? `${product.name} adicionado à sacola.` : "Item adicionado nesta sessão. O navegador não permitiu salvar a sacola.");
  });
}
