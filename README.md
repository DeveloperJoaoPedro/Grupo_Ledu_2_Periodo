# Grupo Ledú — Store, Wine e Pizzas

Projeto Integrador de Sistemas de Informação do UNIPAM para o Grupo Ledú, de Carmo do Paranaíba, MG. Projeto somente frontend em HTML, CSS e JavaScript. O backend será implementado manualmente pela equipe.

## Executar

Na raiz, inicie um servidor estático (ou utilize o Live Server do VS Code):

```bash
python3 -m http.server 8000
```

Abra **http://localhost:8000/**. Módulos JavaScript precisam de HTTP. A leitura de produtos usa a API do Supabase e requer acesso à internet. Esse comando apenas serve os arquivos estáticos; não há gravação de pedidos.

## Bootstrap

O projeto usa **Bootstrap 5.3.8** por meio de links CDN em cada HTML, sem npm ou etapa de build. O CSS é carregado antes dos estilos do projeto e o JavaScript bundle, que inclui Popper, é carregado com `defer`. É necessário acesso à internet para carregar a biblioteca.

Para novos componentes, use classes como `btn`, `btn-primary`, `row`, `col-md-6` e `form-control`. Componentes interativos podem usar os atributos `data-bs-*`, conforme a [documentação oficial](https://getbootstrap.com/docs/5.3/getting-started/introduction/).

O layout existente usa `ledu-container` e `site-nav` para evitar conflitos com as classes `container` e `nav` do Bootstrap. Os estilos próprios continuam após o Bootstrap para manter as personalizações da marca. Ao atualizar a biblioteca, atualize a versão e os valores de integridade do CSS e do JavaScript em cada HTML.

## Páginas

| Tela | Arquivos |
| --- | --- |
| Home | `index.html`, `home.css` |
| Store | `store/store.html`, `store/store.css` |
| Todos os produtos da Store | `store/produtos.html` |
| Wine | `wine/leduwine.html`, `wine/wine.css` |
| Todos os vinhos | `wine/produtos.html` |
| Produto, modelo único | `produto/produto.html?id=vestido-serena` |
| Sacola Store | `sacola/sacola.html?marca=store` |
| Sacola Wine | `sacola/sacola.html?marca=wine` |
| Pizzas | `pizzas/pizza.html`, `pizzas/pizza.css` |
| Agendamento de rodízio | `pizzas/agendamento.html`, `pizzas/agendamento.css` |

Os detalhes de todas as roupas e vinhos usam o mesmo HTML, carregando o produto pelo `id`. As duas sacolas também usam um modelo compartilhado. Os links da navegação ficam centralizados, com a sacola na lateral e sem acesso de conta.

## Onde alterar dados e estilos

- **Tabela `produtos` no Supabase**: nomes, IDs, preços em centavos, categorias, fotos, descrições, tamanhos e cor. `destaque: true` exibe o produto na seleção da página de marca. Novos produtos aparecem automaticamente na listagem completa. `assets/data/catalogo.json` é apenas uma cópia anterior e não alimenta as páginas.
- **`assets/fotos/`**: imagens locais. Depois de trocar uma foto no catálogo, atualize também `width` e `height` com as dimensões originais.
- **`assets/fonts/`**: fontes locais e licenças.
- **`global.css`**: tokens, fontes, botões, cabeçalho, navegação e rodapé.
- **`assets/css/commerce.css`**: cards de produto, filtros, detalhes, tamanhos, sacola e finalização.
- **`assets/js/core.js`**: consulta à API do Supabase, regras demonstrativas de frete e cupons, caminhos, moeda, sacola e funções compartilhadas.
- **`assets/js/catalogo.js`**, **`produto.js`**, **`sacola.js`**, **`agendamento.js`**: comportamento das telas; **`shared.js`** atualiza o contador da sacola.

Para cadastrar um produto, copie um objeto do catálogo, defina um `id` único e preencha os dados. Use `brand: "store"` com `sizes` e `color` para roupa, ou `brand: "wine"` com `volume` para vinho. Não é necessário criar um novo HTML. As quatro roupas e os cinco vinhos incluem o produto Pérgola da tela de detalhes do Figma.

## Fluxos implementados

- Listagens completas por marca, com busca, categoria, ordenação, estado vazio e filtros na URL.
- Produto dinâmico; seleção obrigatória de tamanho nas roupas; quantidade entre 1 e 99; links inválidos mostram um estado de produto não encontrado.
- Sacolas separadas por marca no `localStorage`, com tamanho por item, quantidades, remoção com opção de desfazer e persistência ao navegar ou recarregar.
- Cupons `LEDUSTORE10` e `LEDUWINE10` aplicam 10% ao subtotal. Frete demonstrativo de R$ 5,00 para entrega e R$ 0,00 para retirada; altere esses dados no catálogo.
- Formulário de finalização com nome, telefone, entrega/retirada, endereço e confirmação de maioridade para vinhos. A simulação não envia dados e mantém os itens na sacola.
- Formulário de agendamento com resumo atualizado e validações no navegador. A simulação não envia nem salva dados.

## Backend a implementar

Os produtos são lidos do banco Supabase pela Data API. Ainda não há servidor de aplicação próprio nem persistência de pedidos e agendamentos. Os pontos de envio estão indicados nos eventos `submit` de `assets/js/sacola.js` e `assets/js/agendamento.js`.

O catálogo de produtos vem da tabela `produtos` no Supabase; o arquivo JSON local é somente uma cópia anterior. A sacola usa apenas o `localStorage` do navegador. Preços, cupons e frete são demonstrativos; cálculos e validações atuais servem à interface. A equipe deverá implementar validações no servidor, persistência e processamento ao desenvolver o backend.

## Referência visual

Figma Grupo Ledú, arquivo `wWTk33aZFLswh1JUPAmleN`. Home `96:619`, Store `96:515`, Wine `96:410`, Pizzas `96:567`, produto Store `109:708`, produto Wine `100:572`, agendamento `109:884`, sacola Store `112:771` e sacola Wine `199:124`. A tela de login foi excluída do escopo. As listagens completas seguem os tokens e cards dessas páginas.

Imagens são locais; não há dependência de URLs temporárias do Figma. Os cards da Home contêm texto na imagem original e têm nomes e descrições acessíveis em HTML. O projeto usa Manrope e Cormorant Garamond do `global.css`.

## Verificar

Com o servidor estático aberto, confira a navegação, os filtros, a seleção de tamanho, as quantidades e as sacolas das duas marcas. Os formulários devem mostrar o aviso de demonstração sem enviar dados ou esvaziar a sacola.
