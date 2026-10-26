// Caminhos relativos ao módulo: funcionam em qualquer pasta ou subdiretório hospedado.
export const siteURL = (path = '') => new URL(`../../${path}`, import.meta.url).href;
export const money = cents => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cents / 100);
export const escapeHTML = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export const brandName = brand => brand === 'wine' ? 'Ledú Wine' : 'Ledú Store';
export const brandHome = brand => brand === 'wine' ? 'wine/leduwine.html' : 'store/store.html';
export const listURL = brand => siteURL(`${brand}/produtos.html`);
export const detailURL = (id, quantity = 1) => siteURL(`produto/produto.html?id=${encodeURIComponent(id)}&qtd=${quantity}`);
export const bagURL = brand => siteURL(`sacola/sacola.html?marca=${brand}`);
export const clampQuantity = value => Math.max(1, Math.min(99, Math.trunc(Number(value)) || 1));
let catalogPromise;
export function getCatalog() {
  return catalogPromise ||= fetch(siteURL('assets/data/catalogo.json')).then(response => {
    if (!response.ok) throw new Error('Não foi possível carregar o catálogo. Atualize a página e tente novamente.');
    return response.json();
  }).catch(error => { catalogPromise = null; throw error; });
}
export function setBrand(brand) {
  document.body.dataset.brand = brand;
  const logo = document.querySelector('.nav__logo');
  if (logo) { logo.href = siteURL(brandHome(brand)); logo.setAttribute('aria-label', `${brandName(brand)} — início`); logo.querySelector('span').textContent = brandName(brand); }
  document.querySelectorAll('.nav__links a').forEach(a => {
    a.removeAttribute('aria-current');
    if (a.href === siteURL(brandHome(brand))) a.setAttribute('aria-current', 'true');
  });
  const bag = document.querySelector('[data-bag-link]');
  if (bag) { bag.href = bagURL(brand); bag.dataset.bagBrand = brand; }
  updateBagCount();
}
export function readBag(brand) {
  try {
    const data = JSON.parse(localStorage.getItem(`ledu:sacola:${brand}`) || '[]');
    if (!Array.isArray(data)) return [];
    return data.filter(item => item && typeof item.id === 'string' && typeof item.size === 'string' && Number.isInteger(item.quantity) && item.quantity > 0 && item.quantity <= 99).slice(0, 100);
  } catch { return []; }
}
export function writeBag(brand, items) {
  try { localStorage.setItem(`ledu:sacola:${brand}`, JSON.stringify(items)); }
  catch { throw new Error('Não foi possível salvar sua sacola neste navegador. Verifique se o armazenamento está habilitado.'); }
  updateBagCount();
}
export function addToBag(product, quantity, size = '') {
  const items = readBag(product.brand);
  const existing = items.find(i => i.id === product.id && i.size === size);
  if (existing && existing.quantity + quantity > 99) throw new Error('O limite é de 99 unidades por produto e tamanho na sacola.');
  if (existing) existing.quantity += quantity; else items.push({ id: product.id, size, quantity: clampQuantity(quantity) });
  writeBag(product.brand, items);
}
export function updateBagCount() {
  document.querySelectorAll('[data-bag-link]').forEach(link => {
    const brand = link.dataset.bagBrand || 'store';
    const count = readBag(brand).reduce((sum, i) => sum + i.quantity, 0);
    link.querySelector('[data-bag-count]').textContent = count;
    link.setAttribute('aria-label', `Ver sacola ${brandName(brand)}: ${count} ${count === 1 ? 'item' : 'itens'}`);
  });
}
export function announce(message, error = false) {
  const status = document.querySelector('[data-status]');
  if (status) { status.textContent = message; status.dataset.error = String(error); }
}
export function quantityMarkup(label, value = 1) {
  return `<div class="quantity" role="group" aria-label="Quantidade de ${escapeHTML(label)}"><button type="button" data-quantity="-1" aria-label="Diminuir quantidade" ${value === 1 ? 'disabled' : ''}>−</button><output data-quantity-value aria-live="polite">${value}</output><button type="button" data-quantity="1" aria-label="Aumentar quantidade" ${value === 99 ? 'disabled' : ''}>+</button></div>`;
}
export function wireQuantity(root, onChange) {
  root.addEventListener('click', event => {
    const button = event.target.closest('[data-quantity]');
    if (!button || !root.contains(button)) return;
    const control = button.closest('.quantity');
    const output = control.querySelector('[data-quantity-value]');
    const value = clampQuantity(Number(output.value || output.textContent) + Number(button.dataset.quantity));
    output.value = value;
    control.querySelector('[data-quantity="-1"]').disabled = value === 1;
    control.querySelector('[data-quantity="1"]').disabled = value === 99;
    onChange?.(value);
  });
}
export function cardMarkup(product) {
  const url = detailURL(product.id);
  return `<article class="product-card" data-product="${escapeHTML(product.id)}">
    <a class="product-card__media" href="${url}" aria-label="Ver ${escapeHTML(product.name)}"><img class="product-card__image" src="${siteURL(`assets/fotos/${product.image}`)}" alt="${escapeHTML(product.name)}" width="${product.width}" height="${product.height}" loading="lazy"></a>
    <h3 class="product-card__name"><a href="${url}">${escapeHTML(product.name)}</a></h3><p class="product-card__price">${money(product.price)}</p>
    <div class="product-card__actions"><button class="icon-button" type="button" data-card-add aria-label="${product.brand === 'store' ? 'Escolher tamanho de' : 'Adicionar à sacola:'} ${escapeHTML(product.name)}"><img src="${siteURL('assets/fotos/adicionar-sacola-figma.svg')}" alt="" width="33" height="33"></button>${quantityMarkup(product.name)}</div></article>`;
}
export function renderCards(grid, products) {
  grid.innerHTML = products.map(cardMarkup).join('');
  grid.querySelectorAll('.product-card').forEach((card, index) => {
    wireQuantity(card);
    card.querySelector('[data-card-add]').addEventListener('click', () => {
      const product = products[index];
      const quantity = Number(card.querySelector('[data-quantity-value]').value);
      if (product.brand === 'store') { location.href = detailURL(product.id, quantity); return; }
      try { addToBag(product, quantity); announce(`${product.name} adicionado à sacola. Você pode revisar os itens pelo ícone da sacola.`); }
      catch (error) { announce(error.message, true); }
    });
  });
}
export function totals(items, catalog, coupon = '', delivery = 'entrega') {
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const brand = items[0]?.product.brand;
  const rule = catalog.coupons[brand];
  const discount = coupon && rule && coupon === rule.code ? Math.round(subtotal * rule.percent / 100) : 0;
  const shipping = subtotal > 0 && delivery === 'entrega' ? catalog.shippingCents : 0;
  return { subtotal, discount, shipping, total: subtotal - discount + shipping };
}
