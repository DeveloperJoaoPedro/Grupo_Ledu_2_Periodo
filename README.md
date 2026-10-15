# Grupo Ledú — HTML e CSS para aprender

Projeto Integrador do curso de Sistemas de Informação do UNIPAM, para o Grupo
Ledú de Carmo do Paranaíba, MG.

A branch `main` contém a versão **estática, sem JavaScript**, para o grupo
implementar as funcionalidades à mão. A implementação anterior com JavaScript
está preservada na branch `feat/grupo-ledu-frontend` e no histórico do Git.

## Abrir o projeto

O ponto de entrada é `index.html` da raiz. Os caminhos são relativos: a navegação
funciona com JavaScript desativado, sem instalar pacotes ou fazer build.

Para conferir usando um servidor local, execute na raiz:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Sirva a raiz inteira: Store, Wine e Pizzas usam o CSS e as imagens de `shared/`.
O protótipo antigo em `página principal/` foi preservado; não é o ponto de entrada
da aplicação atual. Seu `app.js` original está vazio e não é carregado.

## O que funciona agora

- Navegação entre a instituição, marcas, login, produtos e sacolas de exemplo.
- Fotos, fontes e logotipos locais, sem consultas a serviços externos.
- Layout responsivo, links de pular para o conteúdo e estados de hover/foco.
- Seleção de tamanhos com radio buttons e CSS.
- Preenchimento dos campos de login e agendamento, incluindo os controles
  nativos de data, horário e número de pessoas.

Os preços, itens das sacolas, descontos e resumos são **exemplos escritos no
HTML**. Alterar campos não recalcula valores. Não há login, envio, persistência
de dados, cobrança ou comunicação com Firebase. Os botões dessas funções estão
desativados com `disabled`, evitando prometer ações que ainda não existem.

Os formulários conservam labels, tipos e restrições nativas (`required`, `min`,
`max`, `minlength`). O envio está desativado; não há destino que receba os dados.

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

São os dez layouts aprovados, com sete variações adicionais do mesmo detalhe
para que cada card abra o produto correto sem depender de parâmetros ou scripts.
Cada página já contém cabeçalho, rodapé e conteúdo completos. Essa repetição é
intencional nesta etapa; para mudar a navegação, edite os cabeçalhos dos HTMLs.

`shared/base.css` reúne os tokens em `:root`, componentes, Grid/Flexbox e os
breakpoints de tablet/desktop. Cada marca sobrescreve apenas `--accent`.
Fotos, logos e fontes estão em `shared/assets/`.

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

Ao implementar um botão, retire seu `disabled` e conecte seu evento. Para
habilitar formulários, primeiro implemente o tratamento do envio: não envie
senhas ou dados de contato por parâmetros de URL. A versão estática não carrega
arquivos `.js`, não executa eventos inline e não depende de Node.js.

## Referência visual e pendências

A referência foi o ZIP `Grupo Ledú.zip`, com dez PDFs exportados do Figma.
Fotos e logos foram extraídos desses PDFs. Cores, medidas e fontes foram
reconstruídas visualmente, pois os tokens originais não foram exportados.
Manrope e Cormorant Garamond são aproximações; suas licenças OFL acompanham os
arquivos em `shared/assets/fonts/`. O coral da Store e os textos do agendamento
foram escurecidos para melhorar contraste. Responsividade e estados de foco
foram adaptados porque só vieram referências de desktop.

Os exemplos mantêm as correções dos dados: Serena por R$ 220,00, quarto vinho
nomeado Kagor conforme a foto, e desconto calculado corretamente em centavos.
Serena com cupom e frete resulta em R$ 203,00; Garzón, em R$ 211,10.

Cadastro, recuperação de senha, catálogo com filtros e checkout adicional não
possuem telas no export e não foram inventados. A integração Firebase, os
cálculos, a persistência e o envio real ficam para os exercícios e etapas futuras.

## Verificar os arquivos

Os testes usam somente a biblioteca padrão do Python:

```sh
python3 -m unittest discover -s tests -p 'test_*.py'
```

Eles conferem a ausência de scripts, a integridade dos links e assets locais,
a estrutura das páginas e os controles de envio desativados. A adaptação também
foi verificada via HTTP no navegador com JavaScript desativado, em cinco larguras.
A abertura direta por `file://` não foi validada porque é bloqueada pela política
do navegador deste ambiente; o fluxo validado usa o servidor local acima.
