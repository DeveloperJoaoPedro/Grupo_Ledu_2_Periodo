import { money, escapeHTML } from "./core.js";
import { PAYMENT_LABELS, STATUS_LABELS } from "./pedidos.js";

export function setupOrders(db) {
  const list = document.querySelector("[data-orders-list]");
  const status = document.querySelector("[data-orders-status]");
  const brandFilter = document.querySelector("[data-orders-brand]");
  const reload = document.querySelector("[data-reload-orders]");
  let orders = [];
  let loading = false;
  let active = false;
  let generation = 0;
  function filtered() { return orders.filter((order) => !brandFilter.value || order.marca === brandFilter.value); }
  function render() {
    const visible = filtered();
    list.innerHTML = visible.map((order) => {
      const date = new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short", timeZone: "America/Sao_Paulo" }).format(new Date(order.criado_em));
      const items = (order.itens_pedido || []).map((item) => `<li>${item.quantidade}x ${escapeHTML(item.nome_produto)}${item.tamanho ? ` — tamanho ${escapeHTML(item.tamanho)}` : ""}${item.cor ? `, ${escapeHTML(item.cor)}` : ""}${item.volume ? `, ${escapeHTML(item.volume)}` : ""} · ${money(item.quantidade * item.preco_unitario_centavos)}</li>`).join("");
      return `<details class="admin-order"><summary><strong>${escapeHTML(order.nome)}</strong> · ${order.marca === "wine" ? "Wine" : "Store"} · ${money(order.total_centavos)}<span>${date} · ${escapeHTML(STATUS_LABELS[order.status] || order.status)}</span></summary>
        <p class="admin-hint">Protocolo: ${escapeHTML(order.id)}</p>
        <p>Telefone: ${escapeHTML(order.telefone)}</p><p>${order.entrega === "retirada" ? "Retirada na loja" : `Entrega: ${escapeHTML(order.endereco)}${order.complemento ? ` · ${escapeHTML(order.complemento)}` : ""}`}</p>
        <p>Pagamento desejado: ${escapeHTML(PAYMENT_LABELS[order.pagamento] || order.pagamento || "Não informado")}</p>
        ${order.observacoes ? `<p>Observações: ${escapeHTML(order.observacoes)}</p>` : ""}<ul>${items}</ul>
        <p>Subtotal: ${money(order.subtotal_centavos)} · Desconto: ${money(order.desconto_centavos)} · Frete: ${money(order.frete_centavos)}</p>
        <label>Status <select data-order-status="${escapeHTML(order.id)}">${Object.entries(STATUS_LABELS).map(([value, label]) => `<option value="${value}" ${value === order.status ? "selected" : ""}>${label}</option>`).join("")}</select></label>
      </details>`;
    }).join("") || '<p class="admin-hint">Nenhum pedido encontrado para esta marca.</p>';
    if (active && !loading) status.textContent = `${visible.length} ${visible.length === 1 ? "pedido" : "pedidos"}.`;
  }
  async function load() {
    if (loading || !active) return;
    const version = generation;
    loading = true; reload.disabled = true;
    status.textContent = "Carregando pedidos…";
    try {
      const result = [];
      // Busca as páginas para não omitir pedidos no painel.
      for (let start = 0; ; start += 200) {
        const { data, error } = await db.from("pedidos").select("*, itens_pedido(*)")
          .order("criado_em", { ascending: false }).order("id").range(start, start + 199);
        if (version !== generation) return;
        if (error) throw new Error("Não foi possível carregar os pedidos. Confira se o recebimento foi ativado e se sua conta tem permissão.");
        result.push(...data);
        if (data.length < 200) break;
      }
      orders = [...new Map(result.map((order) => [order.id, order])).values()];
      loading = false;
      render();
    } catch (error) {
      if (version !== generation) return;
      orders = []; list.textContent = "";
      status.textContent = error.message;
    } finally {
      if (version === generation) { loading = false; reload.disabled = false; }
    }
  }
  reload.addEventListener("click", load);
  brandFilter.addEventListener("change", render);
  list.addEventListener("change", async (event) => {
    const select = event.target.closest("[data-order-status]");
    if (!select || !active) return;
    const order = orders.find((item) => item.id === select.dataset.orderStatus);
    const previous = order.status;
    select.disabled = true;
    const { data, error } = await db.from("pedidos").update({ status: select.value }).eq("id", order.id).select("id").single();
    if (!active) return;
    if (error || !data) { select.value = previous; status.textContent = "Não foi possível alterar o status. Tente novamente."; }
    else { order.status = select.value; render(); status.textContent = "Status do pedido atualizado."; }
    select.disabled = false;
  });
  return {
    start() { active = true; return load(); },
    clear() {
      generation += 1; active = false; loading = false;
      orders = []; list.textContent = ""; status.textContent = "";
      reload.disabled = false;
    },
  };
}
