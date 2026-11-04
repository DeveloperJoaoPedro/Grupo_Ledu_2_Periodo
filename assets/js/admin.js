import { setupOrders } from "./admin-pedidos.js";
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from "./config.js";
import { money, escapeHTML, productImageURL } from "./core.js";

// O SDK oficial cuida do login e renova a sessão. A senha nunca é salva por este código.
// A sessão dura nesta aba. As permissões reais ficam no banco, não neste HTML.
const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: { storage: sessionStorage, persistSession: true, autoRefreshToken: true, detectSessionInUrl: false },
});
const ordersPanel = setupOrders(db);
const loginPanel = document.querySelector("[data-login-panel]");
const adminPanel = document.querySelector("[data-admin-panel]");
const loginForm = document.querySelector("[data-login-form]");
const form = document.querySelector("[data-product-form]");
const status = document.querySelector("[data-admin-status]");
const preview = document.querySelector("[data-photo-preview]");
let products = [];
let editing = null;
let photo = null;
let photoURL = null;
let saving = false;
let photoLoading = false;
let photoVersion = 0;

function message(text, error = false) {
  status.textContent = text;
  status.dataset.error = String(error);
}
function updateBrandFields() {
  const store = form.elements.marca.value === "store";
  document.querySelector("[data-store-fields]").hidden = !store;
  document.querySelector("[data-wine-fields]").hidden = store;
  form.elements.tamanhos.required = store;
  form.elements.cor.required = store;
  form.elements.volume.required = !store;
}
function resetProduct() {
  photoVersion += 1;
  photoLoading = false;
  form.reset();
  editing = null;
  photo = null;
  if (photoURL) URL.revokeObjectURL(photoURL);
  photoURL = null;
  preview.hidden = true;
  preview.removeAttribute("src");
  form.elements.foto.required = true;
  document.querySelector("[data-form-title]").textContent = "Novo produto";
  document.querySelector("[data-cancel-edit]").hidden = true;
  updateBrandFields();
}
async function loadProducts() {
  const { data, error } = await db.from("produtos").select("*").order("nome");
  if (error) throw new Error("Não foi possível atualizar a lista de produtos. Tente novamente.");
  products = data;
  document.querySelector("[data-product-list]").innerHTML = products.map((product, i) =>
    `<tr><td>${escapeHTML(product.nome)}</td><td>${product.marca === "wine" ? "Wine" : "Store"}</td><td>${money(product.preco_centavos)}</td><td><div class="admin-product-actions"><button type="button" class="button button--secondary" data-edit="${i}" aria-label="Editar ${escapeHTML(product.nome)}">Editar</button><button type="button" class="button button--secondary admin-delete" data-delete="${i}" aria-label="Excluir ${escapeHTML(product.nome)}">Excluir</button></div></td></tr>`
  ).join("") || '<tr><td colspan="4">Nenhum produto cadastrado.</td></tr>';
}
async function checkAccess() {
  ordersPanel.clear();
  adminPanel.hidden = true;
  loginPanel.hidden = false;
  const { data: { user }, error } = await db.auth.getUser();
  if (error || !user) {
    message("Entre com a conta autorizada da equipe.");
    return;
  }
  // Mesmo quem consegue fazer login precisa estar na tabela administradores.
  const access = await db.from("administradores").select("user_id").eq("user_id", user.id).maybeSingle();
  if (access.error || !access.data) {
    message("Sua conta ainda não tem acesso ao painel. Peça ao responsável pelo projeto para autorizar o e-mail.", true);
    await db.auth.signOut();
    return;
  }
  document.querySelector("[data-user-email]").textContent = user.email;
  await loadProducts();
  loginPanel.hidden = true;
  adminPanel.hidden = false;
  message("Acesso autorizado. Você já pode gerenciar pedidos e produtos.");
  await ordersPanel.start();
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const button = loginForm.querySelector("button");
  button.disabled = true;
  message("Entrando…");
  try {
    const { error } = await db.auth.signInWithPassword({
      email: loginForm.elements.email.value.trim(),
      password: loginForm.elements.senha.value,
    });
    if (error) throw new Error("Não foi possível entrar. Confira seu e-mail e sua senha.");
    loginForm.elements.senha.value = "";
    await checkAccess();
  } catch (error) {
    message(error.message, true);
  } finally {
    button.disabled = false;
  }
});
document.querySelector("[data-logout]").addEventListener("click", async () => {
  if (saving) return;
  const { error } = await db.auth.signOut();
  if (error) return message("Não foi possível sair. Tente novamente.", true);
  resetProduct();
  products = [];
  document.querySelector("[data-product-list]").textContent = "";
  ordersPanel.clear();
  adminPanel.hidden = true;
  loginPanel.hidden = false;
  message("Você saiu da administração.");
  loginForm.elements.email.focus();
});
form.elements.marca.addEventListener("change", updateBrandFields);
form.elements.preco.addEventListener("input", () => form.elements.preco.setCustomValidity(""));
form.elements.foto.addEventListener("change", async () => {
  const version = ++photoVersion;
  photo = null;
  photoLoading = false;
  const file = form.elements.foto.files[0];
  if (photoURL) URL.revokeObjectURL(photoURL);
  photoURL = null;
  preview.hidden = true;
  if (!file) return;
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 5 * 1024 * 1024) {
    form.elements.foto.value = "";
    message("Escolha uma foto JPG, PNG ou WebP de até 5 MB.", true);
    return;
  }
  photoLoading = true;
  try {
    const bitmap = await createImageBitmap(file);
    if (version !== photoVersion) { bitmap.close(); return; }
    photo = { file, width: bitmap.width, height: bitmap.height };
    bitmap.close();
    photoURL = URL.createObjectURL(file);
    preview.src = photoURL;
    preview.hidden = false;
    message("Foto pronta para o cadastro.");
  } catch {
    if (version !== photoVersion) return;
    form.elements.foto.value = "";
    message("Não foi possível ler essa foto. Escolha outro arquivo.", true);
  } finally {
    if (version === photoVersion) photoLoading = false;
  }
});
document.querySelector("[data-cancel-edit]").addEventListener("click", () => {
  if (!saving) resetProduct();
});
document.querySelector("[data-product-list]").addEventListener("click", async (event) => {
  const deleteButton = event.target.closest("[data-delete]");
  if (deleteButton && !saving) {
    await deleteProduct(products[Number(deleteButton.dataset.delete)]);
    return;
  }
  const button = event.target.closest("[data-edit]");
  if (!button || saving) return;
  resetProduct();
  editing = products[Number(button.dataset.edit)];
  for (const key of ["marca", "nome", "categoria", "descricao", "cor", "volume"]) form.elements[key].value = editing[key] || "";
  form.elements.preco.value = (editing.preco_centavos / 100).toFixed(2).replace(".", ",");
  form.elements.tamanhos.value = (editing.tamanhos || []).join(", ");
  form.elements.destaque.checked = editing.destaque;
  form.elements.foto.required = false;
  preview.src = productImageURL(editing.imagem);
  preview.hidden = false;
  document.querySelector("[data-form-title]").textContent = "Editar produto";
  document.querySelector("[data-cancel-edit]").hidden = false;
  updateBrandFields();
  form.elements.nome.focus();
});

async function deleteProduct(product) {
  if (!product || !window.confirm(`Excluir “${product.nome}” da loja?\n\nOs pedidos antigos serão preservados. Para vender este produto novamente, será necessário cadastrá-lo de novo.`)) return;
  saving = true;
  const enabled = [...form.elements, ...document.querySelectorAll("[data-edit], [data-delete], [data-logout]")]
    .filter((control) => !control.disabled);
  enabled.forEach((control) => control.disabled = true);
  let deleted = false;
  message("Excluindo produto…");
  try {
    // DELETE é autorizado pelo banco apenas para quem está em administradores.
    // A seleção confirma que uma linha foi excluída; RLS pode retornar zero linhas.
    const { data, error } = await db.from("produtos").delete().eq("id", product.id).select("id").single();
    if (error || !data) throw new Error("Não foi possível excluir o produto. Atualize o painel e tente novamente.");
    deleted = true;
    if (editing?.id === product.id) resetProduct();
    // Mantém a imagem: outros produtos podem usar a mesma foto.
    await loadProducts();
    message(`“${product.nome}” foi excluído. Os pedidos antigos foram preservados.`);
  } catch (error) {
    message(deleted ? "Produto excluído, mas a lista não atualizou. Reabra o painel para conferir." : error.message, true);
  } finally {
    saving = false;
    enabled.forEach((control) => control.disabled = false);
    // A linha desaparece após a exclusão: devolve o foco a um ponto estável.
    document.querySelector("#cadastrados").focus();
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (saving) return;
  if (photoLoading) return message("Aguarde a leitura da foto antes de salvar.", true);
  const price = form.elements.preco.value.trim().replace(",", ".");
  const cents = Math.round(Number(price) * 100);
  form.elements.preco.setCustomValidity(
    /^\d{1,7}(\.\d{1,2})?$/.test(price) && cents > 0 && cents <= 2147483647
      ? "" : "Informe um preço maior que zero, com até duas casas decimais."
  );
  if (!form.reportValidity()) return;
  const store = form.elements.marca.value === "store";
  const sizes = [...new Set(form.elements.tamanhos.value.split(",").map((s) => s.trim()).filter(Boolean))];
  if (store && (!sizes.length || sizes.some((s) => s.length > 20))) return message("Informe os tamanhos separados por vírgula, com até 20 caracteres cada.", true);
  if (!photo && !editing) return message("Escolha a foto do produto.", true);
  const button = document.querySelector("[data-save-product]");
  saving = true;
  // Evita que a pessoa altere o cadastro enquanto a foto está sendo enviada.
  const controls = [...form.elements, ...document.querySelectorAll("[data-edit], [data-delete], [data-logout]")];
  const enabled = controls.filter((control) => !control.disabled);
  enabled.forEach((control) => control.disabled = true);
  let uploaded = null;
  let saved = false;
  message("Salvando produto…");
  try {
    let image = editing?.imagem;
    let width = editing?.largura_imagem;
    let height = editing?.altura_imagem;
    if (photo) {
      const extension = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" }[photo.file.type];
      uploaded = `${crypto.randomUUID()}.${extension}`;
      const { error } = await db.storage.from("produtos").upload(uploaded, photo.file, { contentType: photo.file.type, upsert: false });
      if (error) throw new Error("Não foi possível enviar a foto. Confira sua conexão e a permissão da sua conta.");
      image = db.storage.from("produtos").getPublicUrl(uploaded).data.publicUrl;
      width = photo.width;
      height = photo.height;
    }
    const product = {
      id: editing?.id || crypto.randomUUID(),
      marca: form.elements.marca.value,
      nome: form.elements.nome.value.trim(),
      categoria: form.elements.categoria.value.trim(),
      preco_centavos: cents,
      descricao: form.elements.descricao.value.trim(),
      tamanhos: store ? sizes : null,
      cor: store ? form.elements.cor.value.trim() : null,
      volume: store ? null : form.elements.volume.value.trim(),
      destaque: form.elements.destaque.checked,
      imagem: image, largura_imagem: width, altura_imagem: height,
      posicao_imagem: photo ? null : editing?.posicao_imagem || null,
    };
    // O banco verifica a permissão do usuário em toda gravação.
    const query = editing ? db.from("produtos").update(product).eq("id", editing.id) : db.from("produtos").insert(product);
    const { data, error } = await query.select("id").single();
    if (error || !data) throw new Error("Não foi possível salvar o produto. Confira a conexão e a autorização da conta.");
    saved = true;
    resetProduct();
    await loadProducts();
    message("Produto salvo. Ele já está disponível ao atualizar a loja.");
  } catch (error) {
    if (uploaded && !saved) await db.storage.from("produtos").remove([uploaded]);
    message(saved ? "Produto salvo, mas a lista não atualizou. Reabra o painel para conferir." : error.message, true);
  } finally {
    saving = false;
    enabled.forEach((control) => control.disabled = false);
  }
});
updateBrandFields();
checkAccess().catch(() => message("Não foi possível acessar o painel. Confira sua conexão e tente novamente.", true));
