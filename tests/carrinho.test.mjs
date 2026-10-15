import test from "node:test";
import assert from "node:assert/strict";
import { calculateTotals, addItem, readCart } from "../shared/carrinho.js";
import { produtos as store } from "../store/data/produtos.js";
import { produtos as wine } from "../wine/data/produtos.js";
import { readStorage, writeStorage } from "../shared/storage.js";

const stored = new Map();
globalThis.localStorage = {
  getItem: (key) => stored.get(key) ?? null,
  setItem: (key, value) => stored.set(key, value),
};
globalThis.window = new EventTarget();

test("sacola vazia não cobra frete", () => {
  assert.deepEqual(calculateTotals([], store), {
    subtotal: 0, shipping: 0, discount: 0, total: 0, validCoupon: false,
  });
});

test("Serena usa R$ 220 e desconto de 10% consistente com o detalhe", () => {
  const result = calculateTotals([{ id: "vestido-serena", quantity: 1 }], store, "ledustore10", "store");
  assert.equal(result.subtotal, 22000);
  assert.equal(result.discount, 2200);
  assert.equal(result.total, 20300);
});

test("Garzón calcula 10% sem arredondar para reais inteiros", () => {
  const result = calculateTotals([{ id: "garzon", quantity: 1 }], wine, "LEDUWINE10", "wine");
  assert.equal(result.discount, 2290);
  assert.equal(result.total, 21110);
});

test("cupom de outra marca não concede desconto", () => {
  const result = calculateTotals([{ id: "garzon", quantity: 2 }], wine, "LEDUSTORE10", "wine");
  assert.equal(result.validCoupon, false);
  assert.equal(result.total, 46300);
});

test("quantidades de vários produtos são somadas e cobram frete uma vez", () => {
  const result = calculateTotals([{ id: "vestido-serena", quantity: 2 }, { id: "blazer-iris", quantity: 1 }], store);
  assert.equal(result.subtotal, 92900);
  assert.equal(result.shipping, 500);
  assert.equal(result.total, 93400);
});

test("item desconhecido não cria preço nem frete", () => {
  assert.equal(calculateTotals([{ id: "nao-existe", quantity: 5 }], store).total, 0);
});

test("mesmo produto agrupa por tamanho e mantém marcas separadas", () => {
  stored.clear();
  addItem("store", "vestido-serena", 2, "M");
  addItem("store", "vestido-serena", 1, "M");
  addItem("store", "vestido-serena", 1, "P");
  addItem("wine", "garzon", 1);
  assert.deepEqual(readCart("store"), [
    { id: "vestido-serena", quantity: 3, size: "M" },
    { id: "vestido-serena", quantity: 1, size: "P" },
  ]);
  assert.equal(readCart("wine").length, 1);
  assert.deepEqual(readCart("pizzas"), []);
});

test("limita quantidades e ignora dados inválidos no armazenamento", () => {
  stored.set("ledu:cart:store", JSON.stringify([
    { id: "vestido-serena", quantity: -1, size: "P" },
    { id: "vestido-serena", quantity: 1, size: "invalido" },
    null,
  ]));
  assert.deepEqual(readCart("store"), []);
  stored.set("ledu:cart:wine", "corrompido");
  assert.ok(Array.isArray(readCart("wine")));
  stored.set("ledu:cart:wine", "[]");
  addItem("wine", "garzon", 999);
  assert.equal(readCart("wine")[0].quantity, 99);
});

test("mantém a sessão em memória quando o navegador recusa uma gravação", () => {
  stored.set("teste-quota", JSON.stringify("valor antigo"));
  const original = globalThis.localStorage.setItem;
  globalThis.localStorage.setItem = () => { throw new Error("Quota excedida"); };
  try {
    assert.equal(writeStorage("teste-quota", "valor atual"), false);
    assert.equal(readStorage("teste-quota", null), "valor atual");
  } finally {
    globalThis.localStorage.setItem = original;
  }
});

test("JSON corrompido não impede carregar o site", () => {
  stored.set("teste-json", "{");
  assert.deepEqual(readStorage("teste-json", []), []);
});
