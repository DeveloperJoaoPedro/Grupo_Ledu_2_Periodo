# Grupo Ledú — Store, Wine e Pizzas

Projeto Integrador de Sistemas de Informação do UNIPAM para o Grupo Ledú, de Carmo do Paranaíba, MG. Site em HTML, CSS e JavaScript. Store e Wine registram pedidos no painel. Pizzas recebe solicitações pelo WhatsApp. O cliente não precisa de login e não há pagamento online. O painel administrativo usa Supabase Auth para cadastrar, editar e excluir produtos.

## Executar

Na raiz, inicie um servidor estático (ou utilize o Live Server do VS Code):

```bash
python3 -m http.server 8000
```

Abra **http://localhost:8000/**. Módulos JavaScript precisam de HTTP. A leitura de produtos usa a API do Supabase e requer acesso à internet. Esse comando apenas serve os arquivos estáticos; o recebimento de pedidos Store/Wine depende da ativação dos scripts SQL descritos abaixo.

## Bootstrap

O projeto usa **Bootstrap 5.3.8** por meio de links CDN em cada HTML, sem npm ou etapa de build. O CSS é carregado antes dos estilos do projeto e o JavaScript bundle, que inclui Popper, é carregado com `defer`. É necessário acesso à internet para carregar a biblioteca.

Para novos componentes, use classes como `btn`, `btn-primary`, `row`, `col-md-6` e `form-control`. Componentes interativos podem usar os atributos `data-bs-*`, conforme a [documentação oficial](https://getbootstrap.com/docs/5.3/getting-started/introduction/).

O layout existente usa `ledu-container` e `site-nav` para evitar conflitos com as classes `container` e `nav` do Bootstrap. Os estilos próprios continuam após o Bootstrap para manter as personalizações da marca. Ao atualizar a biblioteca, atualize a versão e os valores de integridade do CSS e do JavaScript em cada HTML.

## Páginas

| Tela | Arquivos |
| --- | --- |
| Administração | `admin/index.html`, `admin/admin.css`, `assets/js/admin.js` |
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

- **Tabela `produtos` no Supabase**: nomes, IDs, preços em centavos, categorias, fotos, descrições, tamanhos e cor. `destaque: true` exibe o produto na seleção da página de marca. Novos produtos aparecem automaticamente na listagem completa.
- **`assets/fotos/`**: imagens locais. Depois de trocar uma foto no catálogo, atualize também `width` e `height` com as dimensões originais.
- **`assets/fonts/`**: fontes locais e licenças.
- **`global.css`**: tokens, fontes, botões, cabeçalho, navegação e rodapé.
- **`assets/css/commerce.css`**: cards de produto, filtros, detalhes, tamanhos, sacola e finalização.
- **`assets/js/core.js`**: consulta à API do Supabase, caminhos, imagens, moeda, sacola e funções compartilhadas.
- **`assets/js/config.js`**: WhatsApp de Pizzas, frete, cupons e configuração publicável do Supabase.
- **`assets/js/whatsapp.js`**: mensagem de solicitação do rodízio.
- **`assets/js/admin.js`**: login exclusivo da equipe, cadastro e edição de produtos com foto.
- **`assets/js/pedidos.js`**: envio dos pedidos Store/Wine.
- **`assets/js/admin-pedidos.js`**: consulta dos pedidos e mudança de status.
- **`assets/js/catalogo.js`**, **`produto.js`**, **`sacola.js`**, **`agendamento.js`**: comportamento das telas; **`shared.js`** atualiza o contador da sacola.

Para cadastrar um produto, use `/admin/` depois de configurar o acesso. O formulário gera o ID e identifica as dimensões da foto. Roupas precisam de tamanhos e cor; vinhos precisam de volume. Não é necessário criar um novo HTML.

## Fluxos implementados

- Listagens completas por marca, com busca, categoria, ordenação, estado vazio e filtros na URL.
- Produto dinâmico; seleção obrigatória de tamanho nas roupas; quantidade entre 1 e 99; links inválidos mostram um estado de produto não encontrado.
- Sacolas separadas por marca no `localStorage`, com tamanho por item, quantidades, remoção com opção de desfazer e persistência ao navegar ou recarregar.
- Cupons `LEDUSTORE10` e `LEDUWINE10` aplicam 10% ao subtotal. Frete demonstrativo de R$ 5,00 para entrega e R$ 0,00 para retirada; altere esses dados em `assets/js/config.js`.
- Formulário de finalização com nome, telefone, entrega/retirada, endereço e confirmação de maioridade para vinhos. O botão registra o pedido e os itens no banco e mostra um protocolo. A sacola só é limpa após a confirmação, e é preservada em caso de falha.
- Formulário de agendamento com resumo atualizado e validações no navegador. O botão prepara a solicitação pelo WhatsApp, sem confirmar uma reserva automaticamente.

## Ativar pedidos e administração

**Banco ativado e acesso da equipe autorizado.** A exclusão de produtos também está aplicada, restrita a administradores e preservando os pedidos antigos. `database/ativar-site.sql` reúne a configuração para consulta e reaplicação neste projeto.

- Store e Wine: cadastro do pedido com contato, endereço ou retirada, complemento, pagamento desejado e observações. Preços e totais são conferidos no banco. Só administradores podem consultar os dados pessoais.
- `/admin/`: consulta e mudança de status, filtro por marca e cadastro, edição e exclusão de produtos.
- Pizzas: WhatsApp configurado em `assets/js/config.js` com o número informado pela equipe.
- Conta `joaopedroolialves08@gmail.com` criada, e-mail confirmado e login validado. A senha não está no projeto.

Não há gateway de pagamento. A escolha entre Pix, dinheiro e cartão registra apenas a preferência do cliente. A equipe combina a confirmação e o recebimento.

Veja o [guia de configuração e manutenção](docs/COMO-ALTERAR-O-SITE.md). Os pedidos ficam salvos no banco e podem ser consultados no painel.

## Referência visual

Figma Grupo Ledú, arquivo `wWTk33aZFLswh1JUPAmleN`. Home `96:619`, Store `96:515`, Wine `96:410`, Pizzas `96:567`, produto Store `109:708`, produto Wine `100:572`, agendamento `109:884`, sacola Store `112:771` e sacola Wine `199:124`. Não há login para clientes; o login existe apenas no painel administrativo. As listagens completas seguem os tokens e cards dessas páginas.

Imagens são locais; não há dependência de URLs temporárias do Figma. Os cards da Home contêm texto na imagem original e têm nomes e descrições acessíveis em HTML. O projeto usa Manrope e Cormorant Garamond do `global.css`.

## Verificar

Para conferir o funcionamento, veja o fluxo Store/Wine até o protocolo e a aparição do pedido no painel. Em caso de erro, a sacola deve ser preservada. Verifique filtro por marca e mudança de status. Em Pizzas, confira o resumo e a abertura do WhatsApp.

Para conhecer o banco, veja [Onde ficam os dados no Supabase](docs/BANCO-DE-DADOS.md).
