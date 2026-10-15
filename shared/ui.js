export const money = (cents) => new Intl.NumberFormat("pt-BR", {
  style: "currency", currency: "BRL",
}).format(cents / 100);

export const appRoot = new URL("../", import.meta.url);
export const appUrl = (path) => new URL(path, appRoot).href;

const paths = {
  bag: '<path d="M5 7h14l1 14H4L5 7Z"/><path d="M9 8V5a3 3 0 0 1 6 0v3"/>',
  user: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="9" r="3"/><path d="M6 18a6 6 0 0 1 12 0"/>',
  cart: '<path d="m3 3 2 2 3 11h11l2-8H6"/><circle cx="9" cy="21" r="1"/><circle cx="18" cy="21" r="1"/><path d="M13 2v8m-3-3 3 3 3-3"/>',
  arrow: '<path d="m9 5 7 7-7 7"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 2v6m10-6v6M3 11h18m-12 4h.01M12 15h.01M16 15h.01M8 18h.01M12 18h.01M16 18h.01"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/>',
  people: '<circle cx="8" cy="8" r="3"/><circle cx="17" cy="8" r="2"/><path d="M2 21v-3a6 6 0 0 1 12 0v3H2Zm14-8a5 5 0 0 1 6 5v3h-5"/>',
  pin: '<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
};

export function icon(name) {
  return `<svg viewBox="0 0 24 24" aria-hidden="true">${paths[name] ?? ""}</svg>`;
}

let toastTimer;
export function notify(message) {
  const toast = document.querySelector("[data-toast]");
  if (!toast) return;
  clearTimeout(toastTimer);
  toast.textContent = message;
  toastTimer = setTimeout(() => { toast.textContent = ""; }, 5000);
}

export function quantityControl(value, label) {
  return `<div class="quantity" role="group" aria-label="Quantidade de ${label}">
    <button type="button" data-step="-1" aria-label="Diminuir quantidade de ${label}">−</button>
    <output aria-live="polite">${value}</output>
    <button type="button" data-step="1" aria-label="Aumentar quantidade de ${label}">+</button>
  </div>`;
}

export function bindQuantity(element, onChange, max = 99, min = 1) {
  element.addEventListener("click", (event) => {
    const button = event.target.closest("[data-step]");
    if (!button) return;
    const output = element.querySelector("output");
    const value = Math.max(min, Math.min(max, Number(output.value) + Number(button.dataset.step)));
    output.value = value;
    onChange(value);
  });
}
