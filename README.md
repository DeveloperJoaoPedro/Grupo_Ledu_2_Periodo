# Grupo Ledú — Projeto Integrador

Front-end acadêmico do curso de Sistemas de Informação do UNIPAM, para o
Grupo Ledú de Carmo do Paranaíba, MG. HTML5, CSS3 e JavaScript puro com ES
modules. Sem frameworks, bibliotecas de front-end, bundlers ou etapa de build.

## Executar

Na raiz do repositório:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Abra o servidor no seu navegador, usando a porta escolhida. O ponto de entrada
é `index.html` na raiz. Use HTTP: abrir diretamente com `file://` impede o
carregamento dos ES modules em alguns navegadores. Não é necessário instalar
pacotes ou configurar credenciais. Fotos, logotipos e fontes estão no projeto.

O protótipo anterior em `página principal/` foi preservado; a aplicação atual
começa na raiz. O servidor deve servir a raiz inteira, pois as marcas
compartilham os arquivos de `shared/`.

## Telas

| Referência do export | Arquivo |
| --- | --- |
| Home | `index.html` |
| login | `shared/login.html` |
| Ledu Store | `store/index.html` |
| Ledu Store venda | `store/produto.html` |
| Carrinho Store | `store/carrinho.html` |
| Ledu Wine | `wine/index.html` |
| Ledu Wine Venda | `wine/produto.html` |
| Carrinho Wine | `wine/carrinho.html` |
| Ledu Pizza | `pizzas/index.html` |
| Ledu Pizza venda | `pizzas/agendamento.html` |

`produto.html?id=vestido-serena` e `produto.html?id=garzon` são exemplos de
detalhes dinâmicos. Sem parâmetro, os detalhes abrem os produtos mostrados nos
PDFs: Vestido Serena e Pérgola. IDs desconhecidos exibem uma mensagem com retorno
à coleção. O mesmo template permite consultar os demais produtos mockados.

## Organização e edição

- `shared/base.css`: tokens em `:root`, estilos comuns, Grid/Flexbox, estados de
  foco e hover, breakpoints de 48rem e 75rem e redução de movimento.
- `shared/nav.js`: cabeçalho, navegação, contador da sacola e rodapé comuns.
- `shared/auth.js`: sessão mock e comentários `// TODO Firebase:` para integração.
- `shared/login.js`: comportamento do formulário de acesso.
- `shared/catalogo.js` e `shared/produto.js`: coleção e detalhe das duas lojas.
- `shared/carrinho.js`: persistência e regras monetárias; `shared/sacola.js`:
  interação da página da sacola.
- `shared/storage.js`: leitura defensiva e alternativa em memória se o navegador
  bloquear gravações; `shared/ui.js`: ícones, moeda e controles compartilhados.
- `store/data/produtos.js`, `wine/data/produtos.js` e `pizzas/data/sabores.js`:
  dados de demonstração, separados do comportamento.
- `pizzas/agendamento.js`: data, horário, pessoas, endereço, nome, telefone e
  resumo atualizado. Pizzas não possui sacola.

Para editar textos e produtos, comece pelos HTMLs e arquivos de dados. Para
alterar cores, tamanhos e fontes, use os tokens de `shared/base.css`. Cada marca
sobrescreve apenas `--accent`; os fundos das seções usam tokens compartilhados.

## Fluxos de demonstração

- Store: escolha um produto, informe o tamanho e adicione à sacola. O ícone de
  compra na coleção leva ao detalhe para escolher tamanho; não presume tamanho M.
- Wine: adicione pela coleção ou pelo detalhe. As sacolas são independentes.
- Sacolas: alterar quantidade, remover, recarregar e aplicar `LEDUSTORE10` ou
  `LEDUWINE10`. Desconto de 10% sobre os produtos e frete mock fixo de R$ 5,00
  por sacola não vazia. A finalização apenas informa o resultado da simulação;
  não cria um pedido real, não cobra e mantém os itens para continuar os testes.
- Login: qualquer e-mail válido e senha de pelo menos 6 caracteres inicia uma
  sessão mock compartilhada. A senha nunca é armazenada. Não é autenticação real.
- Pizzas: informe uma data e horário futuros, quantidade de pessoas, endereço e
  contato. A simulação salva somente data, horário e quantidade no navegador,
  sem enviar à equipe e sem persistir nome, endereço ou telefone.

O armazenamento usa chaves `ledu:cart:store`, `ledu:cart:wine`,
`ledu:coupon:store`, `ledu:coupon:wine`, `ledu:session` e `ledu:agendamentos`.
Para reiniciar a demonstração, remova essas chaves nas ferramentas do navegador.
O mock limita quantidades a 99 por item e 200 pessoas por solicitação; esses
limites de interface precisam ser confirmados com o cliente antes do uso real.

## Referências e decisões

A referência visual foi o ZIP `Grupo Ledú.zip`, com dez PDFs de uma página,
exportados do Figma. Não houve acesso ao MCP ou aos tokens originais.

- Fotos e logotipos foram extraídos dos PDFs. Os cards institucionais usam
  fotos com texto HTML sobreposto, para manter conteúdo acessível e editável.
- Cores, espaços e raios foram reconstruídos visualmente. Cormorant Garamond
  e Manrope são aproximações locais; as fontes do PDF aparecem como glifos
  vetorizados e não permitem confirmar os nomes originais. As licenças OFL
  acompanham as fontes em `shared/assets/fonts/`.
- O coral da Store foi escurecido, assim como textos muito claros do
  agendamento, para oferecer contraste. Inputs possuem labels e bordas visíveis;
  controles podem ser usados pelo teclado e mensagens usam regiões de status.
- O Vestido Serena usa R$ 220,00 em toda a navegação, conforme o detalhe. A
  referência da sacola mostrava R$ 489,00 e cor bordô apesar da foto azul.
- O quarto vinho foi nomeado Kagor, conforme o rótulo da imagem, em vez de
  “Vestido Serena”. Preços são calculados em centavos: Garzón com cupom e frete
  resulta em R$ 211,10, corrigindo o arredondamento da referência.
- Descrições não fornecidas para os outros detalhes são textos mockados
  genéricos, sem acrescentar características técnicas dos produtos.
- O formulário de contato foi acrescentado ao agendamento com autorização.
  A data antiga do PDF não foi fixada: o cliente escolhe uma data futura.
- O link para Pérgola abaixo dos favoritos permite alcançar o detalhe presente
  no export, mesmo que esse vinho não esteja entre os quatro cards de favoritos.
- Responsividade e estados interativos foram adaptados, pois só vieram telas
  de desktop. Não se trata de reprodução exata dos tokens do Figma.

## Ausências no export e pendências

Não foram criadas novas telas para cadastro, recuperação de senha, catálogo com
filtros ou checkout, porque seus layouts não vieram no ZIP. Os controles de
cadastro e recuperação no login informam a indisponibilidade. “Ver todos” leva
à seleção já existente, sem simular um catálogo adicional. A referência também
não fornece URL do Instagram, então não foi inventado um link social.

Integração Firebase Auth/Firestore, envio real de agendamentos, pedidos,
pagamentos, estoque, regras comerciais e confirmação das fontes originais
permanecem para etapas futuras. Nenhuma credencial é necessária nesta versão.

## Verificação

Testes de regras com o runner nativo do Node.js (Node 22 ou mais recente):

```sh
node --test tests/carrinho.test.mjs
```

Foram exercitados nesta entrega: as dez páginas nas larguras 320, 390, 768,
1440 e 1920 pixels, carregamento dos assets e fontes locais, links internos,
seleção obrigatória de tamanho, quantidades, cupons, persistência, remoção,
sacolas independentes, login/saída e agendamento com dados inválidos e válidos.
As capturas de desktop foram comparadas visualmente aos PDFs exportados.
As verificações de navegador usaram Chromium e Playwright disponíveis no
ambiente de desenvolvimento; eles não são dependências da aplicação.
