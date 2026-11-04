import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from "./config.js";

export const PAYMENT_LABELS = { pix: "Pix", dinheiro: "Dinheiro", cartao: "Cartão na entrega/retirada" };
export const STATUS_LABELS = {
  aguardando_confirmacao: "Aguardando confirmação",
  confirmado: "Confirmado",
  concluido: "Concluído",
  cancelado: "Cancelado",
};

// Envia somente IDs e quantidades. Preços e descontos são conferidos no banco.
export function orderPayload({ brand, items, customer, coupon, expectedTotal, reference }) {
  return {
    p_referencia: reference,
    p_marca: brand,
    p_cliente: {
      nome: customer.nome.trim(), telefone: customer.telefone.trim(),
      entrega: customer.delivery,
      endereco: customer.delivery === "entrega" ? customer.endereco.trim() : "",
      complemento: customer.delivery === "entrega" ? (customer.complemento || "").trim() : "",
      pagamento: customer.pagamento,
      observacoes: (customer.observacoes || "").trim(),
      maioridade: customer.adult === "on",
    },
    p_itens: items.map((item) => ({ produto_id: item.id, quantidade: item.quantity, tamanho: item.size || "" })),
    p_cupom: coupon,
    p_total_esperado: expectedTotal,
  };
}

export async function saveOrder(payload) {
  // O mesmo ID é reutilizado se a pessoa tentar novamente após uma falha de conexão.
  let response;
  try {
    response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/registrar_pedido`, {
      method: "POST",
      headers: { apikey: SUPABASE_PUBLISHABLE_KEY, "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(20000),
    });
  } catch {
    throw new Error("Não foi possível confirmar o recebimento. Verifique sua conexão e tente novamente; sua sacola foi mantida.");
  }
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    if (["PGRST202", "42883"].includes(error.code)) {
      throw new Error("O recebimento de pedidos ainda não foi ativado. Tente novamente mais tarde.");
    }
    if (error.code === "P0001") throw new Error(error.message);
    throw new Error("Não foi possível registrar o pedido. Tente novamente; sua sacola foi mantida.");
  }
  const receipt = await response.json();
  if (!receipt?.id || !Number.isInteger(receipt.total_centavos)) {
    throw new Error("Não foi possível confirmar o pedido. Tente novamente; sua sacola foi mantida.");
  }
  return receipt;
}
