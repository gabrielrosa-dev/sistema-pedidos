# Run Training

[Acessar o aplicativo](https://gabrielrosa-dev.github.io/sistema-pedidos/)

## Disponibilidade dos produtos

O painel administrativo permite buscar produtos e alternar entre “Disponível” e “Indisponível”. Para produtos sem preço, informe o preço no painel; ao salvar, o produto é ativado. O preço e o status são compartilhados com o catálogo pela aba `Disponibilidade`. Não há quantidades, movimentações ou controle de estoque. O cabeçalho `Preço` é adicionado automaticamente ao formato já existente da aba.

Para ativar a função, copie o conteúdo atualizado de `google-apps-script/Code.gs` para o projeto Apps Script conectado à planilha e publique uma nova versão do Web App. O catálogo de produtos é carregado pelo painel admin e a aba `Disponibilidade` será criada automaticamente. Se existir a aba antiga `Produtos`, ela será renomeada para `Disponibilidade` para preservar os status já salvos.

## Importar catálogo em PDF

No painel administrativo, use **Importar lista de produtos em PDF** para selecionar a lista de preços digital (PDF com texto selecionável). A prévia mostra os produtos reconhecidos, nomes/preços alterados, novos itens e os produtos que serão removidos. A importação só acontece depois da confirmação explícita; itens ausentes no PDF são excluídos do catálogo. A correspondência é pelo nome normalizado, produtos novos recebem uma imagem genérica e os produtos correspondentes mantêm a disponibilidade atual (itens sem preço que passam a ter preço são ativados). As promoções atuais também são mantidas até nova orientação; os preços promocionais existentes continuam aplicados aos produtos correspondentes.

Esta operação torna o catálogo importado a fonte oficial compartilhada com todos os clientes. Antes de usar, atualize `google-apps-script/Code.gs` no projeto Apps Script e publique uma nova versão do Web App. PDF protegido, digitalização sem texto ou lista incompleta é rejeitado sem atualizar a planilha.
