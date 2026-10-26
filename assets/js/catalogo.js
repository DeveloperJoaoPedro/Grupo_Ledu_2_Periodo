import { getCatalog, renderCards, announce } from './core.js';
const grid = document.querySelector('[data-products]');
const form = document.querySelector('[data-filters]');
try {
  const catalog = await getCatalog();
  const all = catalog.products.filter(p => p.brand === grid.dataset.products);
  const featured = !form;
  function render() {
    const params = new URLSearchParams(location.search);
    const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    const query = params.get('busca') || '';
    const category = params.get('categoria') || '';
    const sort = params.get('ordem') || '';
    let products = featured ? all.filter(p => p.featured) : all.filter(p => normalize(p.name).includes(normalize(query)) && (!category || p.category === category));
    if (sort === 'preco-asc') products.sort((a, b) => a.price - b.price);
    if (sort === 'preco-desc') products.sort((a, b) => b.price - a.price);
    if (sort === 'nome') products.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
    if (form) {
      form.elements.busca.value = query;
      form.elements.categoria.value = category;
      form.elements.ordem.value = sort;
      document.querySelector('[data-results]').textContent = `${products.length} ${products.length === 1 ? 'produto encontrado' : 'produtos encontrados'}`;
      document.querySelector('[data-empty]').hidden = products.length > 0;
    }
    renderCards(grid, products);
  }
  if (form) {
    for (const category of new Set(all.map(p => p.category))) form.elements.categoria.add(new Option(category, category));
    form.addEventListener('submit', event => {
      event.preventDefault();
      const params = new URLSearchParams();
      for (const [key, value] of new FormData(form)) if (String(value).trim()) params.set(key, String(value).trim());
      history.pushState(null, '', `${location.pathname}${params.size ? '?' + params : ''}`);
      render();
    });
    window.addEventListener('popstate', render);
  }
  render();
} catch (error) { grid.replaceChildren(); announce(error.message, true); }
