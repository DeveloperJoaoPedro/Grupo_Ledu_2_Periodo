import { appUrl, icon } from "./ui.js";
import { getSession } from "./auth.js";
import { readCart } from "./carrinho.js";

const brand = document.body.dataset.brand;
const names = { store: "Store", wine: "Wine", pizzas: "Pizzas" };
const label = names[brand] ? `Ledú ${names[brand]}` : "Ledú";
const links = [["Grupo Ledú", "index.html", "group"], ["Store", "store/index.html", "store"],
  ["Wine", "wine/index.html", "wine"], ["Pizzas", "pizzas/index.html", "pizzas"]];

document.querySelector("[data-header]").innerHTML = `
  <a class="skip-link button" href="#conteudo">Pular para o conteúdo</a>
  <div class="announcement">Carmo do Paranaíba, Minas Gerais · Uma casa, três experiências</div>
  <nav class="nav" aria-label="Navegação principal">
    <a class="nav__logo" href="${appUrl(names[brand] ? `${brand}/index.html` : "index.html")}" aria-label="${label} — início">
      <img src="${appUrl("shared/assets/logo.png")}" width="48" height="48" alt=""><span>${label}</span>
    </a>
    <ul class="nav__links">${links.map(([text, path, id]) => {
      const current = location.pathname === new URL(appUrl(path)).pathname ? "page" : brand === id ? "true" : "";
      return `<li><a href="${appUrl(path)}"${current ? ` aria-current="${current}"` : ""}>${text}</a></li>`;
    }).join("")}</ul>
    <div class="nav__actions">
      <a class="icon-button" data-account href="${appUrl("shared/login.html")}" aria-label="Entrar na sua conta">${icon("user")}</a>
      ${["store", "wine"].includes(brand) ? `<a class="icon-button nav__bag" href="${appUrl(`${brand}/carrinho.html`)}" aria-label="Abrir sacola"><span>${icon("bag")}</span><span class="nav__count" data-cart-count hidden></span></a>` : ""}
    </div>
  </nav>`;

document.querySelector("[data-footer]").innerHTML = `
  <div class="container footer">
    <div class="footer__identity">
      <img src="${appUrl("shared/assets/logo-claro.png")}" width="48" height="48" alt="">
      <div><p class="footer__title">Grupo Ledú</p><p class="footer__description">Moda, vinhos e sabores reunidos por uma mesma forma de receber.</p></div>
    </div>
    <div><h2 class="footer__heading">Nossas marcas</h2><div class="footer__links">
      ${links.slice(1).map(([text, path]) => `<a href="${appUrl(path)}">Ledú ${text}</a>`).join("")}
    </div></div>
    <div><h2 class="footer__heading">Visite-nos</h2><address>Rua Costa Junior, 440 – Centro<br>Carmo do Paranaíba – MG<br>CEP: 38840-024<br>Brasil</address></div>
  </div>`;

const toast = document.createElement("div");
toast.className = "toast";
toast.dataset.toast = "";
toast.setAttribute("role", "status");
document.body.append(toast);

function updateAccount() {
  const session = getSession();
  document.querySelector("[data-account]").setAttribute("aria-label", session ? "Sua conta — sessão iniciada" : "Entrar na sua conta");
}

function updateBag() {
  const count = document.querySelector("[data-cart-count]");
  if (!count) return;
  const total = readCart(brand).reduce((sum, item) => sum + item.quantity, 0);
  count.hidden = total === 0;
  count.textContent = total;
  count.closest("a").setAttribute("aria-label", `Abrir sacola: ${total} ${total === 1 ? "item" : "itens"}`);
}

updateAccount();
updateBag();
window.addEventListener("ledu:cart", updateBag);
window.addEventListener("ledu:auth", updateAccount);
window.addEventListener("storage", () => { updateBag(); updateAccount(); });
