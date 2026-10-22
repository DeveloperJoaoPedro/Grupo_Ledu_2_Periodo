# Grupo Ledú — Wine e Pizzas

Projeto Integrador do curso de Sistemas de Informação do UNIPAM, para o Grupo Ledú de Carmo do Paranaíba, MG.

## Abrir o projeto

Abra `wine/leduwine.html` ou `pizzas/pizza.html` no navegador. As páginas usam caminhos relativos e não precisam de instalação ou build.

Para servir localmente, execute na raiz: `python3 -m http.server 8000`.
Depois abra `http://localhost:8000/wine/leduwine.html`.

## Onde editar

| Tela ou recurso | Arquivo |
| --- | --- |
| Home e seleção Wine | `wine/leduwine.html` |
| Estilos da Wine | `wine/style.css` |
| Home e sabores Pizzas | `pizzas/pizza.html` |
| Estilos de Pizzas | `pizzas/pizza.css` |
| Agendamento | `pizzas/agendamento.html` e `pizzas/agendamento.css` |
| Fontes, cores, botões, cabeçalho e rodapé | `global.css` |

Carregue `../global.css` antes do CSS da página. Wine e Pizzas seguem as mesmas classes e variáveis visuais, com estilos específicos em cada pasta.

## Imagens e fontes

`imagens_fonts/assets/` reúne todas as imagens e fontes locais, incluindo exportações com sufixo `-figma`. O banner da Wine usa `imagens_fonts/assets/wine-hero.jpg`. Os arquivos exclusivos da versão recebida também foram transferidos para essa pasta; as pastas antigas `assets/` e `shared/assets/` foram removidas.

## Etapa atual e pendências

As páginas são HTML e CSS, sem JavaScript ou backend. Os quatro rótulos e os preços de R$ 149,00 foram mantidos da versão recebida.

- Os controles de quantidade e sacola da Wine estão desabilitados até a implementação do JavaScript; os atributos `data-*` indicam os pontos de integração.
- O formulário de agendamento ainda não envia dados nem atualiza o resumo.
- Os links de Grupo Ledú (`../index.html`), Store (`../store/index.html`) e conta (`../shared/login.html`) aguardam a criação dessas páginas.
- Wine e Pizzas já têm navegação entre si e acesso ao agendamento.

Para continuar, implementar quantidade e sacola por produto, cálculos em centavos e persistência; depois validação, atualização do resumo e envio do agendamento. Nunca salvar senhas em `localStorage`.
