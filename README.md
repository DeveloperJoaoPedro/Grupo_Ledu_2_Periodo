# Grupo Ledú — Store, Wine e Pizzas

Projeto Integrador do curso de Sistemas de Informação do UNIPAM, para o Grupo Ledú de Carmo do Paranaíba, MG.

## Abrir o projeto

Abra `index.html` no navegador para acessar a Home e navegar pelas três marcas. Também é possível abrir `store/store.html`, `wine/leduwine.html` ou `pizzas/pizza.html` diretamente. As páginas usam caminhos relativos e não precisam de instalação ou build.

Para servir localmente, execute na raiz: `python3 -m http.server 8000`.
Depois abra `http://localhost:8000/`.

## Onde editar

| Tela ou recurso | Arquivo |
| --- | --- |
| Home do Grupo Ledú | `index.html` e `home.css` |
| Home e coleção Store | `store/store.html` |
| Estilos da Store | `store/store.css` |
| Home e seleção Wine | `wine/leduwine.html` |
| Estilos da Wine | `wine/wine.css` |
| Home e sabores Pizzas | `pizzas/pizza.html` |
| Estilos de Pizzas | `pizzas/pizza.css` |
| Agendamento | `pizzas/agendamento.html` e `pizzas/agendamento.css` |
| Fontes, cores, botões, cabeçalho e rodapé | `global.css` |

Carregue `../global.css` antes do CSS da página. Store, Wine e Pizzas seguem as mesmas classes e variáveis visuais, com estilos específicos em cada pasta.

## Imagens e fontes

`assets/fotos/` reúne todas as imagens locais, incluindo exportações com sufixo `-figma`; `assets/fonts/` contém as fontes e suas licenças. Os 40 arquivos de `imagens_fonts/assets/` foram transferidos e conferidos byte a byte antes da remoção da pasta antiga. Todas as páginas usam os novos caminhos relativos.

A Home segue o frame `96:619` do Figma Grupo Ledú. As imagens `home-*-figma.png` são exportações locais do banner e dos três cards. Os cards já contêm seus textos na imagem original; os links incluem nomes e descrições acessíveis em HTML. Cabeçalho, rodapé, cores e fontes reutilizam `global.css`; o título do banner usa Manrope para manter as fontes locais do projeto.

A Store usa as fotos de Conjunto Aurora, Vestido Yara e Vestido Serena. Como não há foto exclusiva do Blazer Iris, seu card reaproveita a imagem de alfaiataria do banner, com enquadramento próprio.

## Etapa atual e pendências

As páginas são HTML e CSS, sem JavaScript ou backend. Os quatro rótulos e os preços de R$ 149,00 foram mantidos da versão recebida.

- Os controles de quantidade e sacola da Store e da Wine estão desabilitados até a implementação do JavaScript; os atributos `data-*` indicam os pontos de integração.
- O formulário de agendamento ainda não envia dados nem atualiza o resumo.
- O link de conta (`shared/login.html`) aguarda a criação dessa página.
- A Home conecta Store, Wine e Pizzas; todas as marcas retornam à Home pelo link Grupo Ledú. Pizzas também oferece acesso ao agendamento.

Para continuar, implementar quantidade e sacola por produto, cálculos em centavos e persistência; depois validação, atualização do resumo e envio do agendamento. Nunca salvar senhas em `localStorage`.
