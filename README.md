# Run Training

[Acessar o aplicativo](https://gabrielrosa-dev.github.io/sistema-pedidos/)

## Disponibilidade dos produtos

O painel administrativo permite buscar produtos e alternar entre “Disponível” e “Indisponível”. Para produtos sem preço, informe o preço no painel; ao salvar, o produto é ativado. O preço e o status são compartilhados com o catálogo pela aba `Disponibilidade`. Não há quantidades, movimentações ou controle de estoque. O cabeçalho `Preço` é adicionado automaticamente ao formato já existente da aba.

Para ativar a função, copie o conteúdo atualizado de `google-apps-script/Code.gs` para o projeto Apps Script conectado à planilha e publique uma nova versão do Web App. O catálogo de produtos é carregado pelo painel admin e a aba `Disponibilidade` será criada automaticamente. Se existir a aba antiga `Produtos`, ela será renomeada para `Disponibilidade` para preservar os status já salvos.

## Importar catálogo em PDF

No painel administrativo, use **Importar lista de produtos em PDF** para selecionar a lista de preços digital (PDF com texto selecionável). A prévia mostra os produtos reconhecidos, nomes/preços alterados, novos itens e os produtos que serão removidos. A importação só acontece depois da confirmação explícita; itens ausentes no PDF são excluídos do catálogo. A correspondência é pelo nome normalizado, produtos novos recebem uma imagem genérica e os produtos correspondentes mantêm a disponibilidade atual (itens sem preço que passam a ter preço são ativados). As promoções atuais também são mantidas até nova orientação; os preços promocionais existentes continuam aplicados aos produtos correspondentes.

Esta operação torna o catálogo importado a fonte oficial compartilhada com todos os clientes. Antes de usar, atualize `google-apps-script/Code.gs` no projeto Apps Script e publique uma nova versão do Web App. PDF protegido, digitalização sem texto ou lista incompleta é rejeitado sem atualizar a planilha.

## Pedidos, clientes e catálogo (painel admin)

- **Histórico por período:** os resumos agrupam as vendas do dia 11 ao dia 10 do mês seguinte, identificados pelo mês de encerramento. Selecione um resumo para consultar seus pedidos; os totais gerais continuam abrangendo todas as vendas da conta. Datas e períodos usam o horário de São Paulo.
- **Editar pedido enviado:** o botão *Editar pedido* abre um editor para alterar quantidades e valores, remover ou adicionar itens; o total e a comissão de 5% são recalculados (mínimo R$ 300,00).
- **Razão social obrigatória:** o botão de envio só é liberado depois que a razão social for carregada para o CNPJ informado. O Apps Script também valida esse requisito antes de registrar qualquer pedido. O histórico exibe a razão social (coluna `Razão social`, criada automaticamente na aba `Vendas`; pedidos antigos são preenchidos ao serem listados) e é paginado de 10 em 10.
- **Notificações no celular do Gabriel:** as vendas enviadas pelo Gabriel podem gerar uma notificação push com a razão social e o valor. Para ativar:
  1. Crie um projeto no Firebase, adicione um app Web e habilite o Firebase Cloud Messaging (API HTTP v1).
  2. Copie `apiKey`, `projectId`, `messagingSenderId` e `appId` para `firebase` em `assets/js/sheets-config.js`. Gere uma chave Web Push (VAPID) nas configurações do Cloud Messaging e copie a chave pública para `vapidKey`.
  3. Crie uma conta de serviço com permissão para enviar mensagens FCM. Nas **Propriedades do script** do Apps Script, configure `FCM_PROJECT_ID`, `FCM_SERVICE_ACCOUNT_EMAIL` e `FCM_SERVICE_ACCOUNT_PRIVATE_KEY` com os dados do projeto. Mantenha a chave privada somente no Apps Script; não a coloque no repositório nem no navegador.
  4. Atualize `google-apps-script/Code.gs` no Apps Script, reimplante o Web App e autorize o acesso externo solicitado.
  5. No celular privado, abra o painel administrativo por HTTPS, entre como Gabriel e toque em **Ativar notificações**. Permita as notificações no navegador. Esse aparelho fica registrado como destino; registrar outro aparelho substitui o anterior. Em iPhone, instale o painel na Tela de Início antes de ativar, se o navegador exigir.

  O número de telefone não é usado para push: o destino é o aparelho autorizado no painel. Se a notificação falhar, o pedido continua registrado e o catálogo informa que o push não foi enviado.
- **Catálogo:** é possível adicionar produtos, editar o preço de qualquer item e colocar/remover promoções (coluna `Preço promocional` da aba `Disponibilidade`).
- Reimplante o `google-apps-script/Code.gs` e publique uma nova versão do Web App; autorize a nova permissão de acesso externo (`UrlFetchApp`).
