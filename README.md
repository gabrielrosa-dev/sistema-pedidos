# Sistema de Pedidos Varejinho

Catálogo estático de produtos para montagem de pedidos e envio pelo WhatsApp.

## Acesso

[Abrir o catálogo](index.html)

Também é possível abrir o arquivo `index.html` diretamente no navegador.

O catálogo é público para clientes. O botão **Admin** no cabeçalho abre `admin.html`; a consulta às vendas exige o e-mail e a senha de Gabriel ou Vanderson. Um visitante ainda pode abrir o endereço da tela de login, mas não consegue consultar o painel nem os dados sem credenciais administrativas.

## Recursos

- Catálogo com busca, categorias e ordenação.
- Produtos promocionais destacados com borda colorida.
- Área de promoções do mês.
- Preços promocionais aplicados ao pedido e ao WhatsApp.
- Regra de desconto do Ômega 3: R$ 31,99 por unidade a partir de 24 unidades.
- Controle de quantidades salvo no navegador.
- Seleção de tamanho, cor, calibre, sabor e aroma por opção, com quantidades separadas no pedido e no WhatsApp.
- Produtos com opções não detalhadas no catálogo permitem informar a opção manualmente.
- Validação de CNPJ e condição de pagamento.
- Envio do pedido pelo WhatsApp.
- Registro dos pedidos enviados no histórico administrativo, com comissão calculada em 5%.
- Painel administrativo com login individual, vendas isoladas por administrador e filtros por data, CNPJ e razão social.

## Estrutura do projeto

```text
index.html                         Entrada do site
manifest.json                      Configuração do PWA
service-worker.js                  Cache e funcionamento offline
admin.html                         Login e painel de vendas
assets/
	css/style.css                    Estilos e responsividade do catálogo
	css/admin.css                    Estilos do painel administrativo
	js/app.js                        Produtos, regras e interações
	js/admin.js                      Login e histórico administrativo
	js/sheets-config.js              URL do Web App do Google Apps Script
	js/sheets-client.js              Comunicação com a planilha
	images/branding/                 Logo e imagens institucionais
	images/products/                 Fotos dos produtos
	pwa/                              Ícones do aplicativo
google-apps-script/                Serviço da planilha e configuração dos acessos
docs/pdf/                          Catálogos e listas em PDF
```

## Configuração do histórico administrativo

O histórico usa uma planilha Google Sheets como armazenamento e um Google Apps Script como serviço de conexão. Não é necessário criar um projeto Supabase nem escrever SQL.

1. Crie uma planilha Google em branco e dê a ela um nome, por exemplo, `Vendas Run Training`.
2. Na planilha, abra **Extensões > Apps Script**. Copie o conteúdo de `google-apps-script/Code.gs` para o editor de script.
3. No editor do Apps Script, crie também um arquivo HTML chamado `Setup` e cole o conteúdo de `google-apps-script/Setup.html`. Salve o projeto.
4. Volte à planilha e atualize a página. Abra o menu **Run Training > Configurar planilha e administradores**. Informe os e-mails dos dois administradores e crie senhas fortes, diferentes e com pelo menos 10 caracteres. O script guarda as senhas como hashes com salt, não em texto puro na planilha.
5. No Apps Script, escolha **Implantar > Nova implantação > App da Web**. Configure **Executar como: Eu** e **Quem pode acessar: Qualquer pessoa**. Implante, autorize o acesso à planilha e copie a URL que termina em `/exec`. Teste a URL abrindo-a no navegador: ela deve mostrar **“Integração Run Training ativa”**. Se aparecer uma tela de login do Google ou erro de autorização, corrija a permissão de acesso da implantação.
6. Cole essa URL em `webAppUrl` no arquivo `assets/js/sheets-config.js`.
7. Publique os arquivos atualizados do catálogo em um site HTTPS. Clientes continuam acessando `index.html` sem login. Para consultar as vendas, um administrador abre `admin.html` e entra com o e-mail e senha cadastrados. O catálogo padrão registra pedidos para Gabriel; use links com `?destino=vanderson` para registrar pedidos para Vanderson.

Os registros são guardados na aba `Vendas`, criada automaticamente, e a comissão de 5% é calculada no Apps Script. A aba contém ID, administrador, CNPJ, data do envio, valor, comissão, condição de pagamento e itens do pedido; não inclui razão social. O painel lista somente as vendas do administrador autenticado, com filtros por datas e CNPJ. Ao receber uma planilha com o cabeçalho antigo, o Apps Script remove automaticamente a coluna Razão social, preservando as demais colunas. A planilha permanece editável pelo proprietário; **não compartilhe a planilha diretamente com os administradores** se quiser manter as vendas isoladas, pois quem tem acesso à planilha consegue ler todos os dados.

No histórico administrativo, use o botão **Espelho** para abrir a cópia de um pedido e, em seguida, imprimir ou salvá-lo como PDF pelo navegador.

No painel, o administrador também pode editar o valor total de seus pedidos (a comissão de 5% é recalculada) ou excluí-los permanentemente. Essas ações exigem confirmação e não permitem alterar pedidos da outra conta administrativa.

O pedido fica registrado quando é enviado ao WhatsApp; isso não confirma que foi pago ou faturado. Se o banco não estiver configurado ou o registro falhar, o catálogo avisa que o pedido não foi registrado no histórico, mas permite continuar para o WhatsApp.

O endpoint da planilha precisa ser público para receber pedidos do catálogo; clientes podem enviar pedidos, mas não podem consultar vendas. A consulta de vendas e a autenticação são protegidas por contas individuais. A página de login administrativa pode ser aberta por qualquer pessoa que conheça o endereço, mas os dados só são retornados após autenticação. Se alterar `Code.gs`, abra **Implantar > Gerenciar implantações**, edite a implantação existente, selecione **Nova versão** e implante novamente; salvar o código sem publicar uma nova versão não atualiza o `/exec`. Revise periodicamente as vendas registradas. Publique o catálogo em HTTPS; abrir arquivos diretamente pode bloquear chamadas ao Apps Script.

## Imagens dos produtos

Cada produto já possui um link preparado no formato:

```text
assets/images/products/produto-ID.jpg
```

Para adicionar a foto do produto de ID `154`, por exemplo, coloque o arquivo com este nome:

```text
assets/images/products/produto-154.jpg
```

Não é necessário editar o código. O catálogo exibirá automaticamente a imagem quando o arquivo existir. Enquanto a foto não for adicionada, o cartão usará o logo como fallback.

Use `.jpg` como padrão. Caso precise usar outro formato, altere a extensão no campo `image` do produto em `assets/js/app.js`.

## Arquivos PWA

O `manifest.json` e o `service-worker.js` ficam na raiz de propósito: essa posição mantém o escopo correto quando o projeto é publicado em uma subpasta do GitHub Pages.

## Observação

Os dados do pedido ficam salvos no armazenamento local do navegador. Para testar como um novo cliente, limpe os dados do site no navegador ou use uma janela anônima.
