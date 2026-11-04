# Como manter a loja

## O fluxo escolhido

- **Store e Wine:** o cliente preenche o pedido no site. Ele fica no banco e aparece na administração. A equipe consulta os dados e muda o status pelo painel.
- **Pizzas:** o formulário prepara uma mensagem para o WhatsApp, onde a equipe confirma data e orçamento.
- O cliente não precisa de login. Só a equipe entra na administração.
- Nenhum fluxo cobra cartão ou confirma automaticamente um pagamento. A forma de pagamento escolhida no site serve para o atendimento combinar o recebimento.

## 1. Configurar o WhatsApp de Pizzas

O número informado pela equipe já está em `assets/js/config.js`. Para trocar, edite a linha `pizzas` usando **55 + DDD + telefone**, apenas dígitos.

Enquanto o número não estiver preenchido, o rodízio mostra o resumo para copiar e não abre uma conversa sem destinatário. Store e Wine não usam WhatsApp para registrar o pedido.

## 2. Ativar o banco e a administração

**Configuração aplicada ao Supabase.** Pedidos, acesso administrativo e exclusão de produtos estão ativados. O arquivo `database/ativar-site.sql` reúne a configuração para consulta e reaplicação neste projeto.

Os arquivos de origem, para manutenção, são:

1. `database/painel-admin.sql`: lista de administradores, permissões de produtos e pasta pública de fotos.
2. `database/pedidos.sql`: recebimento de pedidos, itens, campos de pagamento e acesso restrito da equipe.
3. `database/excluir-produtos.sql`: exclusão do catálogo pela equipe, preservando os itens dos pedidos antigos.

O primeiro script não apaga produtos. O segundo reaproveita `pedidos` e `itens_pedido`, acrescenta os campos necessários e **retira o acesso direto do público** a essas tabelas. O schema `ledu_privado` não deve ser adicionado à lista de schemas expostos na Data API.

Clientes sem conta enviam somente os dados do próprio pedido por `registrar_pedido`. Essa função confere preços no catálogo, tamanho, quantidade, cupom e total antes de gravar tudo em uma única operação. Ela devolve um protocolo e o total, sem expor os dados pessoais de outros clientes.

Somente a conta autorizada da equipe pode ler os pedidos completos e mudar o status. Nenhuma senha ou chave secreta fica no site.

## 3. Criar o primeiro acesso

A conta `joaopedroolialves08@gmail.com` já foi criada, confirmada e teve o login validado. Use a senha combinada na conversa; ela não fica nos arquivos. Abra **Área da equipe** no rodapé ou `/admin/`. Com Live Server na porta 5500: `http://127.0.0.1:5500/admin/`.

Para criar **outro acesso**, siga estes passos:

1. No Supabase, abra **Authentication → Users → Add user → Create new user**.
2. Informe o e-mail e uma senha. Se aparecer a opção de confirmar manualmente o e-mail da conta criada pela equipe, marque-a. Não publique a senha no GitHub.
3. No **SQL Editor**, autorize a conta, substituindo o e-mail:

```sql
insert into public.administradores (user_id)
select id from auth.users
where lower(email) = lower('insira o email aqui')
on conflict (user_id) do nothing
returning user_id;
```

O resultado precisa mostrar um `user_id`. Se não aparecer nenhuma linha, confira se a conta foi criada e se o e-mail está correto.

4. Abra `http://localhost:8000/admin/` e entre com o e-mail e a senha.

Para autorizar outra pessoa, repita o processo. Para retirar um acesso, remova a linha correspondente em `administradores` pelo Supabase. Apenas fazer login não concede permissão administrativa.

## 4. Consultar pedidos

1. Entre no painel. A seção **Pedidos recebidos** mostra as solicitações.
2. Clique no pedido para ver itens, contato, endereço/retirada, complemento, pagamento desejado e observações.
3. Use o seletor de status: **Aguardando confirmação**, **Confirmado**, **Concluído** ou **Cancelado**.
4. Para conferir novos pedidos, clique em **Atualizar pedidos**.
5. Escolha uma marca ou **Todas** para filtrar os pedidos exibidos.

## 5. Cadastrar e editar produtos

No painel, preencha marca, nome, categoria, preço e descrição. Para Store, informe tamanhos separados por vírgula e cor. Para Wine, informe o volume. Escolha uma foto JPG, PNG ou WebP de até 5 MB e clique em **Salvar produto**.

Marque **destaques** para mostrar na seleção inicial da marca. Atualize a loja para conferir. Para editar, use **Editar** na lista; deixar a foto vazia mantém a atual. Para remover, clique em **Excluir** na linha do produto e confirme o nome. Ele sai do catálogo; os pedidos antigos mantêm nome, quantidade, opções e preço da compra. A foto é mantida, pois pode ser compartilhada por outros produtos. A exclusão é definitiva para esse cadastro; para voltar a vender, cadastre novamente.

As fotos novas ficam no Storage, e os dados na tabela `produtos`. Os arquivos antigos continuam funcionando. Não é necessário criar HTML para cada produto.

## 6. Alterar frete e cupons

A prévia da sacola usa `REGRAS_LOJA` em `assets/js/config.js`. O cálculo definitivo é conferido pelo banco em `database/pedidos.sql`.

- `shippingCents: 500` e `v_frete_base := 500` representam R$ 5,00.
- `percent: 10` e `v_desconto_percentual := 10` representam desconto de 10%.
- Os códigos atuais são `LEDUSTORE10` e `LEDUWINE10`.

**Atualize os dois arquivos e reaplique a função SQL quando mudar as regras.** Se os valores divergirem ou o preço mudar enquanto o cliente compra, o banco pede para atualizar a página antes de enviar. O valor informado pelo navegador não substitui o preço do catálogo.

## Onde editar

| Arquivo | Responsabilidade |
| --- | --- |
| `assets/js/config.js` | WhatsApp de Pizzas, frete, cupons e chave publicável |
| `assets/js/pedidos.js` | Dados enviados ao banco e mensagens de falha |
| `assets/js/sacola.js` | Sacola, formulário e confirmação do pedido |
| `assets/js/admin-pedidos.js` | Lista, filtro e status dos pedidos |
| `assets/js/whatsapp.js` | Texto da mensagem de Pizzas e abertura da conversa |
| `assets/js/agendamento.js` | Data, horário e resumo do rodízio |
| `assets/js/admin.js` | Login e cadastro/edição de produtos |
| `admin/index.html` e `admin/admin.css` | Campos e aparência do painel |
| `database/painel-admin.sql` | Permissões administrativas e fotos |
| `database/pedidos.sql` | Validações, cálculos e gravação dos pedidos |

Os arquivos em `assets/vendor/` são bibliotecas oficiais em versões fixas, com licenças ao lado. Normalmente vocês não precisam editar esses arquivos.

## Para apresentar

Com a conta autorizada:

1. Escolher produto e tamanho na Store e colocar na sacola.
2. Aplicar `LEDUSTORE10` e conferir o desconto de 10%.
3. Preencher contato, entrega/retirada e pagamento desejado.
4. Registrar e mostrar o protocolo. A sacola só é limpa depois da confirmação do banco.
5. Entrar no painel, atualizar a lista e conferir o pedido.
6. Em Pizzas, preencher uma data futura e mostrar a mensagem do WhatsApp.

Se a conexão falhar, a sacola permanece. Repetir o envio sem alterar o formulário reutiliza o mesmo protocolo para evitar duplicidade. Não mostre um registro simulado como se estivesse no banco real.

Veja também [Onde ficam os dados no Supabase](BANCO-DE-DADOS.md), com o passo a passo para iniciantes.
