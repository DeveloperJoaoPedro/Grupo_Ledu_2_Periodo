import {
  getCatalog,
  productImageURL,
  setBrand,
  brandName,
  brandHome,
  siteURL,
  listURL,
  detailURL,
  bagURL,
  money,
  escapeHTML,
  quantityMarkup,
  wireQuantity,
  clampQuantity,
  addToBag,
  announce,
} from "./core.js";
const root = document.querySelector("[data-product-detail]");
try {
  const params = new URLSearchParams(location.search);
  const catalog = await getCatalog();
  const product = catalog.products.find((p) => p.id === params.get("id"));
  if (!product) {
    document.title = "Produto não encontrado · Grupo Ledú";
    root.innerHTML = `<div class="empty-state"><h1>Produto não encontrado</h1><p>Este link não corresponde a um produto do catálogo.</p><a class="button" href="${listURL("store")}">Ver roupas</a> <a class="button button--secondary" href="${listURL("wine")}">Ver vinhos</a></div>`;
  } else {
    setBrand(product.brand);
    document.title = `${product.name} · ${brandName(product.brand)}`;
    document.querySelector('meta[name="description"]').content = product.description;
    let quantity = clampQuantity(params.get("qtd") || 1);
    root.innerHTML = `<nav class="breadcrumb" aria-label="Caminho da página"><a href="${siteURL(brandHome(product.brand))}">${brandName(product.brand)}</a><span aria-hidden="true">/</span><a href="${listURL(product.brand)}">Todos os produtos</a></nav>
      <div class="product-detail"><div class="product-detail__media" data-detail-id="${escapeHTML(product.id)}"><img src="${escapeHTML(productImageURL(product.image))}" alt="${escapeHTML(product.name)}" width="${product.width}" height="${product.height}" fetchpriority="high"></div>
      <div class="product-detail__copy"><p class="product-detail__category">${escapeHTML(product.category)}</p><h1>${escapeHTML(product.name)}</h1><p class="product-detail__price">${money(product.price)}</p>
      <p class="product-detail__description">${escapeHTML(product.description)}</p>
      <form data-product-form>${product.sizes ? `<fieldset class="size-picker"><legend>Tamanho:</legend><div>${product.sizes.map((size) => `<label><input type="radio" name="tamanho" value="${escapeHTML(size)}" required><span>${escapeHTML(size)}</span></label>`).join("")}</div></fieldset><p class="product-detail__variant">Cor: ${escapeHTML(product.color)}</p>` : `<p class="product-detail__variant">Volume: ${escapeHTML(product.volume)}</p>`}
      <div class="product-detail__actions">${quantityMarkup(product.name, quantity)}<button class="button" type="submit"><img src="${siteURL("assets/fotos/sacola-botao-figma.png")}" width="37" height="53" alt="">Adicionar à sacola</button></div></form>
      <p class="availability">✓ Disponível em Carmo do Paranaíba – MG</p><a class="product-detail__bag" href="${bagURL(product.brand)}">Ver minha sacola</a></div></div>`;
    wireQuantity(root, (value) => {
      quantity = value;
    });
    root.querySelector("[data-product-form]").addEventListener("submit", (event) => {
      event.preventDefault();
      const size = new FormData(event.currentTarget).get("tamanho") || "";
      try {
        addToBag(product, quantity, size);
        announce(
          `${quantity} ${quantity === 1 ? "unidade de" : "unidades de"} ${product.name}${size ? `, tamanho ${size},` : ""} na sacola.`,
        );
      } catch (error) {
        announce(error.message, true);
      }
    });
  }
} catch (error) {
  root.innerHTML = "<h1>Não foi possível carregar o produto</h1>";
  announce(error.message, true);
}
