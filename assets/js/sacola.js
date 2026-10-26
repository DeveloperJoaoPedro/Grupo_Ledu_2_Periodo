import { getCatalog, setBrand, brandName, siteURL, listURL, detailURL, money, escapeHTML, readBag, writeBag, quantityMarkup, wireQuantity, totals, announce } from './core.js';
const brand = new URLSearchParams(location.search).get('marca') === 'wine' ? 'wine' : 'store';
setBrand(brand);
document.title = `Sua sacola · ${brandName(brand)}`;
const root = document.querySelector('[data-cart]');
const dialog = document.querySelector('[data-checkout]');
const form = dialog.querySelector('form');
const delivery = form.elements.delivery;
let catalog, items = [], coupon = '', removed;
function saveItems() { writeBag(brand, items.map(({ id, size, quantity }) => ({ id, size, quantity }))); }
function calculate() { return totals(items, catalog, coupon, delivery.value); }
function updateSummary() {
  const value = calculate();
  for (const [key, amount] of Object.entries(value)) document.querySelectorAll(`[data-total="${key}"]`).forEach(el => { el.textContent = `${key === 'discount' && amount ? '− ' : ''}${money(amount)}`; });
  const code = catalog.coupons[brand].code;
  document.querySelector('[data-coupon-note]').textContent = coupon ? 'Cupom de 10% aplicado.' : `Use ${code} para 10% de desconto.`;
}
function render() {
  const raw = readBag(brand);
  items = raw.flatMap(item => {
    const product = catalog.products.find(p => p.id === item.id && p.brand === brand);
    if (!product || (product.sizes ? !product.sizes.includes(item.size) : item.size !== '')) return [];
    return [{ ...item, product }];
  });
  document.querySelector('[data-cart-content]').hidden = items.length === 0;
  document.querySelector('[data-empty-cart]').hidden = items.length > 0;
  root.innerHTML = items.map((item, index) => `<article class="cart-item"><a class="cart-item__image" href="${detailURL(item.id)}"><img src="${siteURL(`assets/fotos/${item.product.image}`)}" width="${item.product.width}" height="${item.product.height}" alt="${escapeHTML(item.product.name)}"></a><div class="cart-item__info"><h2><a href="${detailURL(item.id)}">${escapeHTML(item.product.name)}</a></h2><p>${item.size ? `Tamanho ${escapeHTML(item.size)} · ${escapeHTML(item.product.color)}` : escapeHTML(item.product.volume)}</p>${quantityMarkup(item.product.name, item.quantity)}</div><div class="cart-item__price"><p>${money(item.product.price * item.quantity)}</p><button class="text-button" type="button" data-remove="${index}" aria-label="Remover ${escapeHTML(item.product.name)}${item.size ? ` tamanho ${item.size}` : ''}">Remover</button></div></article>`).join('');
  root.querySelectorAll('.cart-item').forEach((row, index) => {
    wireQuantity(row, quantity => {
      const previous = items[index].quantity; items[index].quantity = quantity;
      try { saveItems(); row.querySelector('.cart-item__price p').textContent = money(items[index].product.price * quantity); updateSummary(); }
      catch (error) { items[index].quantity = previous; render(); announce(error.message, true); }
    });
    row.querySelector('[data-remove]').addEventListener('click', () => {
      const previous = [...items]; const [item] = items.splice(index, 1);
      try { saveItems(); removed = item; render(); announce(`${item.product.name} removido da sacola.`); document.querySelector('[data-undo]').hidden = false; document.querySelector('[data-undo]').focus(); }
      catch (error) { items = previous; announce(error.message, true); }
    });
  });
  updateSummary();
}
document.querySelectorAll('[data-continue]').forEach(a => { a.href = listURL(brand); });
document.querySelector('[data-brand-label]').textContent = brandName(brand);
if (brand === 'wine') document.querySelector('[data-adult-field]').hidden = false;
form.elements.adult.required = brand === 'wine';
document.querySelector('[data-undo]').addEventListener('click', event => {
  if (!removed) return;
  const current = readBag(brand);
  const existing = current.find(i => i.id === removed.id && i.size === removed.size);
  if (existing && existing.quantity + removed.quantity > 99) { announce('Não foi possível desfazer: o limite é de 99 unidades.', true); return; }
  if (existing) existing.quantity += removed.quantity; else current.push({ id: removed.id, size: removed.size, quantity: removed.quantity });
  try { writeBag(brand, current); removed = null; event.currentTarget.hidden = true; render(); announce('Produto restaurado na sacola.'); document.querySelector('[data-open-checkout]').focus(); }
  catch (error) { announce(error.message, true); }
});
document.querySelector('[data-coupon-form]').addEventListener('submit', event => {
  event.preventDefault();
  const input = event.currentTarget.elements.cupom;
  const value = input.value.trim().toUpperCase();
  if (value && value !== catalog.coupons[brand].code) { input.setCustomValidity('Cupom inválido para esta marca.'); input.reportValidity(); return; }
  coupon = value; updateSummary(); announce(coupon ? 'Cupom aplicado.' : 'Cupom removido.');
});
document.querySelector('[name="cupom"]').addEventListener('input', event => event.target.setCustomValidity(''));
document.querySelector('[data-open-checkout]').addEventListener('click', () => {
  document.querySelector('[data-checkout-status]').textContent = '';
  updateSummary(); dialog.showModal();
});
document.querySelector('[data-close-checkout]').addEventListener('click', () => dialog.close());
delivery.addEventListener('change', () => {
  const address = form.elements.endereco;
  address.required = delivery.value === 'entrega';
  address.closest('.field').hidden = !address.required;
  updateSummary();
});
form.addEventListener('submit', event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  // Implementar o envio quando o backend estiver disponível.
  document.querySelector('[data-checkout-status]').textContent = 'Demonstração: nenhum pedido foi enviado ou salvo. Os itens continuam na sacola.';
});
window.addEventListener('storage', event => { if (event.key === `ledu:sacola:${brand}` && catalog) { if (dialog.open) dialog.close(); render(); } });
try { catalog = await getCatalog(); render(); }
catch (error) { document.querySelector('[data-cart-content]').hidden = true; announce(error.message, true); }
