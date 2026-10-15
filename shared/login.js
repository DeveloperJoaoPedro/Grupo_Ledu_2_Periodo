import "./nav.js";
import { getSession, signIn, signOut } from "./auth.js";

const form = document.querySelector("[data-login-form]");
const status = document.querySelector("[data-login-status]");
const sessionPanel = document.querySelector("[data-session]");
const tabs = document.querySelector(".login__tabs");

function renderSession() {
  const session = getSession();
  form.hidden = Boolean(session);
  tabs.hidden = Boolean(session);
  sessionPanel.hidden = !session;
  if (session) sessionPanel.querySelector("[data-email]").textContent = session.email;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const saved = signIn(form.elements.email.value.trim());
  form.elements.senha.value = "";
  status.textContent = saved ? "Sessão de demonstração iniciada." : "Sessão iniciada temporariamente. O navegador não permitiu salvar o acesso.";
  renderSession();
  sessionPanel.querySelector("a").focus();
});

document.querySelector("[data-sign-out]").addEventListener("click", () => {
  signOut();
  status.textContent = "Você saiu da sua conta.";
  renderSession();
  form.elements.email.focus();
});

document.querySelector("[data-recover]").addEventListener("click", () => {
  status.textContent = "Para recuperar seu acesso, entre em contato com o Grupo Ledú. O envio de e-mails ainda não está disponível.";
});
document.querySelector("[data-sign-up]").addEventListener("click", () => {
  status.textContent = "O cadastro ainda não está disponível. Você pode experimentar o acesso com um e-mail válido e uma senha de pelo menos 6 caracteres.";
});
window.addEventListener("storage", renderSession);
renderSession();
