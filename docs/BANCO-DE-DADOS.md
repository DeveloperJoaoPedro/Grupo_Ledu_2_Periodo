# Onde ficam os dados no Supabase

O site é a vitrine. O Supabase guarda o catálogo, os pedidos, as contas da equipe e as fotos enviadas pelo painel. A sacola ainda não enviada fica somente no navegador do cliente.

## Primeiro, abra o projeto certo

Entre no [painel do projeto Grupo Ledú](https://supabase.com/dashboard/project/kapjduafhofblzlsloki). O identificador é `kapjduafhofblzlsloki`. A conta usada para entrar no painel do Supabase é a sua conta da plataforma; o login da nossa página `/admin/` é uma conta do site, criada em Authentication.

**Situação atual:** catálogo, pedidos, fotos e acesso administrativo configurados. A conta do site está criada e confirmada. A exclusão de produtos foi ativada para a equipe, preservando o histórico das compras.

## Os quatro lugares que você vai usar

| Menu do Supabase | O que fica ali | Quando usar |
| --- | --- | --- |
| Table Editor | Tabelas com produtos, pedidos e itens | Conferir os dados guardados |
| Authentication → Users | Contas de acesso ao site | Criar ou administrar o login da equipe |
| Storage → produtos | Fotos novas enviadas pelo painel | Conferir as imagens dos produtos, após ativação |
| SQL Editor | Instruções que configuram o banco | Executar o arquivo de ativação ou uma alteração orientada |

No dia a dia, prefira **Área da equipe**, no rodapé do nosso site. Esse painel tem os formulários de produtos e pedidos. Você não precisa escrever SQL para atender um pedido ou cadastrar uma roupa.

## Como consultar os dados

1. No Supabase, abra **Table Editor**.
2. Escolha o schema **public**, se aparecer um seletor.
3. Clique na tabela desejada. Cada linha é um registro e cada coluna é uma informação.
4. Use os filtros para procurar um produto, uma marca ou o protocolo de um pedido.

| Tabela | Significado |
| --- | --- |
| `produtos` | Catálogo de Store e Wine: nome, marca, preço, descrição, foto e opções |
| `pedidos` | Um registro por compra enviada: cliente, contato, endereço, pagamento desejado, totais e status |
| `itens_pedido` | Produtos de cada pedido, com quantidade, tamanho e preço registrado na compra |
| `administradores` | Identificadores das contas autorizadas a entrar no painel |

Um pedido com duas peças tem **uma linha em `pedidos` e duas linhas em `itens_pedido`**. O campo `pedido_id` dos itens corresponde ao `id` do pedido. É assim que o banco sabe quais produtos pertencem a cada compra.

Pizzas prepara a mensagem e abre o WhatsApp. Esse envio não cria um pedido ou agendamento no Supabase. Se aparecer uma tabela antiga `agendamentos`, ela não é alimentada por esse fluxo atual.

## Como mudar um produto

O caminho mais simples é entrar no nosso `/admin/`, localizar o produto, clicar em **Editar**, alterar e salvar. A loja lê o catálogo do banco ao carregar; atualize a página para conferir a mudança.

Se precisar editar pelo Table Editor, abra `produtos`, encontre a linha, edite a célula e confirme a alteração. Os campos monetários terminados em `_centavos` usam números inteiros: **15990 significa R$ 159,90**. Não escreva `R$` nesse campo. O painel do site faz essa conversão para você.

Não altere o `id` de um produto já utilizado em pedidos. Para modificar a foto, prefira o formulário do painel, que envia a imagem e registra o caminho correto.

## Onde ficam as fotos e as senhas

As fotos antigas estão em `assets/fotos/`, dentro do projeto. As novas fotos enviadas pela administração ficam em **Storage → produtos**; a tabela `produtos` guarda o endereço da imagem. Esse espaço é público porque as fotos precisam aparecer na vitrine. Dados de clientes não vão para ele.

As contas ficam em **Authentication → Users**. A senha não aparece em uma coluna para leitura. Se alguém perder o acesso, administre a recuperação pela área de Authentication. A tabela `administradores` apenas concede acesso ao painel; ela não guarda senhas.

## Pedidos e pagamento

Abra **Pedidos recebidos** no nosso painel, clique em **Atualizar pedidos**, confira os detalhes e mude o status conforme o atendimento. Registrar Pix, cartão ou dinheiro indica a preferência do cliente; não comprova pagamento.

Os pedidos ficam no banco e aparecem no painel. Para atualizar o atendimento, mude o status lá.

O catálogo pode ser consultado pelo público. Os pedidos completos ficam restritos à equipe autorizada. O site utiliza uma chave publicável; as permissões do banco determinam o que cada pessoa pode fazer.

## Arquivos de configuração do banco

A configuração já foi aplicada. Você não precisa executá-la novamente para usar o site.

- `database/painel-admin.sql`: acesso da equipe e fotos.
- `database/pedidos.sql`: recebimento validado e consulta de pedidos.
- `database/excluir-produtos.sql`: permite excluir produtos sem apagar o histórico das compras.
- `database/ativar-site.sql`: reúne a configuração e a autorização da conta de João Pedro para este projeto.

Ao excluir um produto no painel, o `produto_id` dos itens antigos fica vazio. O nome, preço e demais dados registrados na compra permanecem.
