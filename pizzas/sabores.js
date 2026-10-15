import "../shared/nav.js";
import { sabores } from "./data/sabores.js";
import { appUrl } from "../shared/ui.js";

const grid = document.querySelector("[data-flavors]");
for (const sabor of sabores) {
  const card = document.createElement("article");
  card.className = "product-card";
  card.innerHTML = `<img class="product-card__image" src="${appUrl(`shared/assets/${sabor.image}`)}" alt="${sabor.alt}" loading="lazy" width="440" height="680"><h3 class="product-card__name">${sabor.name}</h3>`;
  grid.append(card);
}
