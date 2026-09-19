# Sistema de Pedidos Varejinho

Catálogo estático de produtos para montagem de pedidos e envio pelo WhatsApp.

## Acesso

[Abrir o catálogo](index.html)

Também é possível abrir o arquivo `index.html` diretamente no navegador.

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

## Estrutura do projeto

```text
index.html                         Entrada do site
manifest.json                      Configuração do PWA
service-worker.js                  Cache e funcionamento offline
assets/
	css/style.css                    Estilos e responsividade
	js/app.js                        Produtos, regras e interações
	images/branding/                 Logo e imagens institucionais
	images/products/                 Fotos dos produtos
	pwa/                              Ícones do aplicativo
docs/pdf/                          Catálogos e listas em PDF
```

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
