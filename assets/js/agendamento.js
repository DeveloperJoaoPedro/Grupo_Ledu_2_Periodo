import { bookingMessage, prepareWhatsApp, wireMessageCopy } from "./whatsapp.js";
const form = document.querySelector("[data-booking-form]");
const status = document.querySelector("[data-booking-status]");
const date = form.elements.data;
const time = form.elements.horario;
const people = form.elements.pessoas;
const today = () =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
function update() {
  date.min = today();
  date.setCustomValidity("");
  time.setCustomValidity("");
  if (date.value && date.value < date.min)
    date.setCustomValidity("Escolha uma data a partir de hoje.");
  if (date.value && time.value && new Date(`${date.value}T${time.value}:00-03:00`) <= new Date())
    time.setCustomValidity("Escolha um horário futuro.");
  const digits = form.elements.telefone.value.replace(/\D/g, "");
  form.elements.telefone.setCustomValidity(
    digits && (digits.length < 10 || digits.length > 13) ? "Informe um telefone com DDD." : "",
  );
  document.querySelector("[data-date-summary]").textContent = date.value
    ? new Intl.DateTimeFormat("pt-BR", { dateStyle: "long", timeZone: "America/Sao_Paulo" }).format(
        new Date(`${date.value}T12:00:00-03:00`),
      )
    : "Data a informar";
  document.querySelector("[data-time-summary]").textContent = time.value
    ? time.value.replace(":", "h")
    : "Horário a informar";
  const count = Number(people.value);
  document.querySelector("[data-people-summary]").textContent =
    count > 0 ? `${count} ${count === 1 ? "pessoa" : "pessoas"}` : "Pessoas a informar";
  let address = form.elements.endereco.value.trim();
  const complement = form.elements.complemento.value.trim();
  if (complement) address += " · " + complement;
  document.querySelector("[data-address-summary]").textContent = address || "Endereço a informar";
}
form.addEventListener("input", () => {
  update();
  status.textContent = "";
  form.querySelector("[data-whatsapp-preview]").hidden = true;
});
wireMessageCopy(form, status);
form.addEventListener("submit", (event) => {
  event.preventDefault();
  update();
  if (!form.reportValidity()) return;
  const data = Object.fromEntries(new FormData(form));
  prepareWhatsApp(form, "pizzas", bookingMessage(data), status);
});
update();
