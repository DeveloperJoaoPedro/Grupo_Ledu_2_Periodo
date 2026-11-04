import { WHATSAPP } from "./config.js";

export function bookingMessage(data) {
  const date = new Intl.DateTimeFormat("pt-BR", { dateStyle: "long", timeZone: "America/Sao_Paulo" })
    .format(new Date(`${data.data}T12:00:00-03:00`));
  return [
    "Olá! Gostaria de solicitar um rodízio da Ledú Pizzas.", "",
    `Nome: ${data.nome.trim()}`, `Telefone: ${data.telefone.trim()}`,
    `Data: ${date}`, `Horário: ${data.horario}`, `Pessoas: ${data.pessoas}`,
    `Endereço: ${data.endereco.trim()}`,
    ...(data.complemento.trim() ? [`Complemento: ${data.complemento.trim()}`] : []),
    "", "Podem confirmar a disponibilidade da data e enviar um orçamento?",
  ].join("\n");
}

export function whatsappURL(brand, message) {
  const number = String(WHATSAPP[brand] || "").replace(/\D/g, "");
  if (!/^55[1-9]\d\d{8,9}$/.test(number)) return null;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function validatePhone(input) {
  const digits = input.value.replace(/\D/g, "");
  input.setCustomValidity(/^(?:55)?[1-9]\d\d{8,9}$/.test(digits) ? "" : "Informe um telefone válido com DDD.");
}

export function prepareWhatsApp(root, brand, message, status) {
  const panel = root.querySelector("[data-whatsapp-preview]");
  panel.hidden = false;
  panel.querySelector("textarea").value = message;
  const link = panel.querySelector("[data-whatsapp-link]");
  const url = whatsappURL(brand, message);
  link.removeAttribute("href");
  link.href = url;
  status.textContent = "Mensagem preparada. No WhatsApp, toque em Enviar. O atendimento confirmará sua solicitação.";

  window.open(url, "_blank", "noopener,noreferrer");
}

export function wireMessageCopy(root, status) {
  root.querySelector("[data-copy-message]").addEventListener("click", async () => {
    const input = root.querySelector("[data-whatsapp-preview] textarea");
    try {
      await navigator.clipboard.writeText(input.value);
      status.textContent = "Resumo copiado.";
    } catch {
      input.focus();
      input.select();
      status.textContent = "Selecionei o resumo. Use Copiar no seu dispositivo.";
    }
  });
}
