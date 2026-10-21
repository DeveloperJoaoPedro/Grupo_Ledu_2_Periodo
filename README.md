# Grupo Ledú — HTML e CSS para aprender

Projeto Integrador do curso de Sistemas de Informação do UNIPAM, para o Grupo
Ledú de Carmo do Paranaíba, MG.


## Abrir o projeto

O ponto de entrada é `index.html` da raiz. Os caminhos são relativos: a navegação
funciona com JavaScript desativado, sem instalar pacotes ou fazer build.


Sirva a raiz inteira: Store, Wine e Pizzas usam o CSS e as imagens de `imagens/`


## Onde editar

| Tela | Arquivo |
| --- | --- |
| Institucional | `index.html` |
| Login compartilhado | `shared/login.html` |
| Home e seleção Store | `store/index.html` |
| Vestido Serena | `store/produto.html` |
| Outros detalhes Store | `store/blazer-iris.html`, `store/conjunto-aurora.html`, `store/vestido-yara.html` |
| Sacola Store | `store/carrinho.html` |
| Home e seleção Wine | `wine/index.html` |
| Pérgola | `wine/produto.html` |
| Outros detalhes Wine | `wine/barolo.html`, `wine/chianti.html`, `wine/garzon.html`, `wine/kagor.html` |
| Sacola Wine | `wine/carrinho.html` |
| Home e sabores Pizzas | `pizzas/index.html` |
| Agendamento | `pizzas/agendamento.html` |

## Próximos exercícios de JavaScript

Os atributos `data-*` e comentários nos HTMLs indicam pontos de integração.
Eles não executam código. Uma ordem possível para estudar:

1. Criar `shared/nav.js` e aprender a selecionar e alterar elementos do DOM.
2. Implementar os botões de quantidade, mantendo limites mínimo e máximo.
3. Criar a sacola da Store respeitando produto e tamanho; depois separar Wine.
4. Calcular subtotal, frete e desconto em centavos antes de formatar em reais.
5. Aplicar cupons de 10%: `LEDUSTORE10` e `LEDUWINE10`, cada um na sua marca.
6. Adicionar e remover itens e, depois, aprender persistência com `localStorage`.
7. Implementar eventos e validação no agendamento, atualizar o resumo e só
   habilitar o envio após validar. Pizzas continua sem carrinho.
8. Criar `shared/auth.js` para o mock. Nunca salvar senhas em `localStorage`.
   Na etapa futura de integração, usar Firebase Auth e Firestore e marcar os
   pontos de conexão com comentários `// TODO Firebase:`.

## Referência visual e pendências

A referência foi exportadas do Figma.
Fotos e logos foram extraídos desses PDFs. Cores, medidas e fontes foram
reconstruídas visualmente, pois os tokens originais não foram exportados.


## CSS por página (referência atual do Figma)

- `global.css`: fontes locais, cores, botões, campos, cabeçalho e rodapé.
- `pizzas/index.css`: banner e grade de sabores da página de Pizzas.
- `pizzas/agendamento.css`: formulário e resumo de agendamento.

Carregue sempre `../global.css` antes do CSS da página nos HTMLs de `pizzas/`.
As imagens originais consultadas no Figma estão em `imagens_fonts/assets/`, com
sufixo `-figma`. Os recortes ficam no CSS, preservando os arquivos originais.

Referência: [Grupo Ledú no Figma](https://www.figma.com/design/wWTk33aZFLswh1JUPAmleN/Grupo-Led%C3%BA?node-id=96-567).
Telas consultadas: Pizzas (`96:567`), agendamento (`109:884`) e Wine (`96:410`).
Os links para páginas removidas (Home, Store, Wine e login) ainda dependem da
criação dessas páginas. O formulário de agendamento continua sem envio.
