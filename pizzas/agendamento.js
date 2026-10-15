import "../shared/nav.js";
import { icon, quantityControl, bindQuantity } from "../shared/ui.js";
import { readStorage, writeStorage } from "../shared/storage.js";

const form = document.querySelector("[data-booking-form]");
const date = form.elements.data;
const time = form.elements.horario;
const address = form.elements.endereco;
const complement = form.elements.complemento;
const phone = form.elements.telefone;
const status = document.querySelector("[data-booking-status]");
let people = 15;
const quantity = document.querySelector("[data-people-control]");
quantity.innerHTML = quantityControl(people, "pessoas");

function today() {
  // A data local evita que o dia mude antes da meia-noite no Brasil por causa do UTC.
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}
date.min = today();

const summary = document.querySelector("[data-booking-summary]");
summary.innerHTML = `
  <li>${icon("calendar")}<span data-date-summary>Data a informar</span></li>
  <li>${icon("clock")}<span data-time-summary>Horário a informar</span></li>
  <li>${icon("people")}<span data-people-summary>15 pessoas</span></li>
  <li>${icon("pin")}<span data-address-summary>Endereço a informar</span></li>`;

function updateSummary() {
  status.textContent = "";
  form.querySelector('[type="submit"]').disabled = false;
  date.setCustomValidity("");
  time.setCustomValidity("");
  phone.setCustomValidity("");
  form.elements.nome.setCustomValidity("");
  address.setCustomValidity("");
  summary.querySelector("[data-date-summary]").textContent = date.value
    ? new Intl.DateTimeFormat("pt-BR", { day: "numeric", month: "long", year: "numeric" }).format(new Date(`${date.value}T12:00:00`))
    : "Data a informar";
  summary.querySelector("[data-time-summary]").textContent = time.value ? time.value.replace(":", "h") : "Horário a informar";
  summary.querySelector("[data-people-summary]").textContent = `${people} ${people === 1 ? "pessoa" : "pessoas"}`;
  summary.querySelector("[data-address-summary]").textContent = [address.value.trim(), complement.value.trim()].filter(Boolean).join(" · ") || "Endereço a informar";
}

bindQuantity(quantity.querySelector(".quantity"), (value) => { people = value; updateSummary(); }, 200);
form.addEventListener("input", updateSummary);
form.addEventListener("submit", (event) => {
  event.preventDefault();
  date.min = today();
  if (date.value < today()) date.setCustomValidity("Escolha uma data de hoje em diante.");
  if (new Date(`${date.value}T${time.value}`) <= new Date()) time.setCustomValidity("Escolha um horário futuro para o rodízio.");
  const digits = phone.value.replace(/\D/g, "");
  if (digits.length < 10 || digits.length > 13) phone.setCustomValidity("Informe um telefone com DDD, por exemplo (34) 99999-9999.");
  if (form.elements.nome.value.trim().length < 2) form.elements.nome.setCustomValidity("Informe seu nome.");
  if (address.value.trim().length < 5) address.setCustomValidity("Informe rua, número e bairro.");
  if (!form.reportValidity()) return;
  const stored = readStorage("ledu:agendamentos", []);
  const bookings = Array.isArray(stored) ? stored.slice(-19) : [];
  // TODO Firebase: gravar no Firestore e enviar o pedido à equipe após integração.
  // Não persistimos os dados de contato: o protótipo não os envia a nenhum serviço.
  bookings.push({ date: date.value, time: time.value, people, createdAt: new Date().toISOString() });
  const saved = writeStorage("ledu:agendamentos", bookings);
  status.classList.remove("status--error");
  status.textContent = saved
    ? "Agendamento de demonstração registrado neste navegador. Nenhuma solicitação foi enviada à equipe."
    : "Simulação concluída. O navegador não permitiu salvar o agendamento; nenhuma solicitação foi enviada à equipe.";
  // Evita duplicar a solicitação por clique repetido; editar libera um novo envio.
  form.querySelector('[type="submit"]').disabled = true;
});
