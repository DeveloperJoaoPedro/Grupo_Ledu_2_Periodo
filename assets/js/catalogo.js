import { getCatalog, renderCards, announce } from "./core.js";
const grid = document.querySelector("[data-products]");
const form = document.querySelector("[data-filters]");
try {
  const catalog = await getCatalog();
  const all = catalog.products.filter((p) => p.brand === grid.dataset.products);
  const featured = !form;
  function render() {
    const params = new URLSearchParams(location.search);
    const normalize = (value) =>
      value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
    const query = params.get("busca") || "";
    const category = params.get("categoria") || "";
    const sort = params.get("ordem") || "";
    let products = featured
      ? all.filter((p) => p.featured)
      : all.filter(
          (p) =>
            normalize(p.name).includes(normalize(query)) && (!category || p.category === category),
        );
    if (sort === "preco-asc") products.sort((a, b) => a.price - b.price);
    if (sort === "preco-desc") products.sort((a, b) => b.price - a.price);
    if (sort === "nome") products.sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
    if (form) {
      form.elements.busca.value = query;
      form.elements.categoria.value = category;
      form.elements.ordem.value = sort;
      document.querySelector("[data-results]").textContent =
        `${products.length} ${products.length === 1 ? "produto encontrado" : "produtos encontrados"}`;
      document.querySelector("[data-empty]").hidden = products.length > 0;
    }
    renderCards(grid, products);
  }
  if (form) {
    const categories = [];
    for (const product of all) {
      if (!categories.includes(product.category)) {
        categories.push(product.category);
        form.elements.categoria.add(new Option(product.category, product.category));
      }
    }
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const params = new URLSearchParams();
      const search = form.elements.busca.value.trim();
      const category = form.elements.categoria.value;
      const sort = form.elements.ordem.value;
      if (search) params.set("busca", search);
      if (category) params.set("categoria", category);
      if (sort) params.set("ordem", sort);
      history.pushState(null, "", `${location.pathname}${params.size ? "?" + params : ""}`);
      render();
    });
    window.addEventListener("popstate", render);
  }
  render();
} catch (error) {
  grid.replaceChildren();
  announce(error.message, true);
}
