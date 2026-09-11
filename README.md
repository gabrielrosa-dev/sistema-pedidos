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
- Validação de CNPJ e condição de pagamento.
- Envio do pedido pelo WhatsApp.

## Estrutura principal

- `index.html`: estrutura da página.
- `script.js`: produtos, promoções e regras do pedido.
- `style.css`: estilos visuais e responsividade.
- `imagens/produtos/`: imagens dos produtos e do catálogo.

## Imagens dos produtos

Coloque as imagens futuras em `imagens/produtos/`. Para associar uma imagem a um produto, atualize o campo `image` correspondente no array `products`, em `script.js`.

## Observação

Os dados do pedido ficam salvos no armazenamento local do navegador. Para testar como um novo cliente, limpe os dados do site no navegador ou use uma janela anônima.
