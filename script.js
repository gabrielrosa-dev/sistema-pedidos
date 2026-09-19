// Base de dados completa extraída do catálogo[cite: 2]
const products = [
    { id: 1, name: "Abaixador de lingua c/ 100 unid.", price: 6.90, image: "https://via.placeholder.com/60" },
    { id: 2, name: "Agua Boricada 100 ml UNIPHAR", price: 2.99, image: "https://via.placeholder.com/60" },
    { id: 3, name: "Agua destilada p/injeção 10 ml", price: 0.49, image: "https://via.placeholder.com/60" },
    { id: 4, name: "Água Micelar, colágeno e pantenol - 260 ml - MARY LIFE", price: 5.50, image: "https://via.placeholder.com/60" },
    { id: 5, name: "Agua Oxigenada 10 Vol. 100 ml - UNIPHAR", price: 2.99, image: "https://via.placeholder.com/60" },
    { id: 6, name: "Agua Oxigenada 10 Vol. 100ml Spray - FARMAX", price: 5.40, image: "https://via.placeholder.com/60" },
    { id: 7, name: "Agua Oxigenada 10 Vol. 100ml Spray - UNIPHAR", price: 4.90, image: "https://via.placeholder.com/60" },
    { id: 8, name: "Agulha BD 13 x 0,3 c/ 100", price: 36.90, image: "https://via.placeholder.com/60" },
    { id: 9, name: "Agulha BD 20 x 5,5 c/ 100", price: 36.90, image: "https://via.placeholder.com/60" },
    { id: 10, name: "Agulha BD 25 x 6 c/100", price: 36.90, image: "https://via.placeholder.com/60" },
    { id: 11, name: "Agulha BD 25 x 8 c/ 100", price: 22.90, image: "https://via.placeholder.com/60" },
    { id: 12, name: "Agulha BD 30 x 6 c/100", price: 22.90, image: "https://via.placeholder.com/60" },
    { id: 13, name: "Agulha BD 30 x 7 c/ 100", price: 24.90, image: "https://via.placeholder.com/60" },
    { id: 14, name: "Agulha BD 30 x 8 c/100", price: 22.90, image: "https://via.placeholder.com/60" },
    { id: 15, name: "Agulha BD 40 x 12 c/ 100", price: 36.90, image: "https://via.placeholder.com/60" },
    { id: 16, name: "Agulha MEDIX - 40 x 12 c/100", price: 16.90, image: "https://via.placeholder.com/60" },
    { id: 17, name: "Agulha MEDIX - 25 x 7 c/100", price: 14.90, image: "https://via.placeholder.com/60" },
    { id: 18, name: "Agulha MEDIX - 25 x 8 c/100", price: 14.90, image: "https://via.placeholder.com/60" },
    { id: 19, name: "Agulha MEDIX - 30 x 7 c/100", price: 14.90, image: "https://via.placeholder.com/60" },
    { id: 20, name: "Agulha MEDIX - 30 x 8 c/100", price: 14.90, image: "https://via.placeholder.com/60" },
    { id: 21, name: "Agulha MEDIX - 20 x 5,5 c/100", price: 14.90, image: "https://via.placeholder.com/60" },
    { id: 22, name: "Agulha MEDIX - 13 x 0,3 c/100", price: 14.90, image: "https://via.placeholder.com/60" },
    { id: 23, name: "Agulha p/ Caneta de Insulina 4 mm. - MEDIX", price: 19.90, image: "https://via.placeholder.com/60" },
    { id: 24, name: "Alcool 70% 100ml", price: 2.90, image: "https://via.placeholder.com/60" },
    { id: 25, name: "Alcool 70% 1000ml", price: 8.90, image: "https://via.placeholder.com/60" },
    { id: 26, name: "Alcool 70% 50ml UNIPHAR", price: 2.90, image: "https://via.placeholder.com/60" },
    { id: 27, name: "Alcool Etílico Antisseptico 70% Spray - 50 ml - Uniphar", price: 4.90, image: "https://via.placeholder.com/60" },
    { id: 28, name: "Alcool Gel 70% 50 g", price: 2.90, image: "https://via.placeholder.com/60" },
    { id: 29, name: "Alcool Gel 70% 500 g c/ válvula - AUDAX", price: 7.90, image: "https://via.placeholder.com/60" },
    { id: 30, name: "Alcool 70% swabs (GAZE EMBEBIDA C/ALCOOL) CX C/100", price: 13.90, image: "https://via.placeholder.com/60" },
    { id: 31, name: "Algodão NATHY - cx. c/ 25 gr.", price: 1.59, image: "https://via.placeholder.com/60" },
    { id: 32, name: "Algodão NATHY - cx. c/ 50 gr.", price: 2.99, image: "https://via.placeholder.com/60" },
    { id: 33, name: "Algodao bola 50 g - Nathy", price: 2.99, image: "https://via.placeholder.com/60" },
    { id: 34, name: "Algodao bola 100 g - Nathy", price: 4.99, image: "https://via.placeholder.com/60" },
    { id: 35, name: "Algodao disco c/50 und. Nathy", price: 4.50, image: "https://via.placeholder.com/60" },
    { id: 36, name: "Algodao Quadradinho - Nathy", price: 2.89, image: "https://via.placeholder.com/60" },
    { id: 37, name: "ALGODAO HIDROFILO 500 GR. - NATHY", price: 22.90, image: "https://via.placeholder.com/60" },
    { id: 38, name: "AUTO LANCETA G-TECH ACIONAMENTO POR CONTATO C/100UN", price: 24.90, image: "https://via.placeholder.com/60" },
    { id: 39, name: "AUTO LANCETA BIOLAND ACIONAMENTO POR CONTATO C/100UN", price: 21.90, image: "https://via.placeholder.com/60" },
    { id: 40, name: "Aparelho Glicemia FREE (Kit 10 tiras reag, 10 lancetas e 1 caneta) G-TECH", price: 59.90, image: "https://via.placeholder.com/60" },
    { id: 41, name: "Aparelho Glicemia VITA - G-Tech", price: 49.90, image: "https://via.placeholder.com/60" },
    { id: 42, name: "Aparelho de pressão digital automático de braço G-Tech - BPSII", price: 109.90, image: "https://via.placeholder.com/60" },
    { id: 43, name: "Aparelho de pressão digital automático de braço - 7122 - OMRON", price: 159.90, image: "https://via.placeholder.com/60" },
    { id: 44, name: "Aparelho pressão Digital de pulso GP400", price: 84.90, image: "https://via.placeholder.com/60" },
    { id: 45, name: "Aparelho pressão Digital de pulso - OMRON - Mod. 6181", price: 89.90, image: "https://via.placeholder.com/60" },
    { id: 46, name: "Aparelho pressão Digital de pulso - OMRON - Mod. 6161-T2", price: 89.90, image: "https://via.placeholder.com/60" },
    { id: 47, name: "Aparelho Pressão PREMIUM com Esteto", price: 79.90, image: "https://via.placeholder.com/60" },
    { id: 48, name: "Aspirador Nasal sucçaõ - Multikids", price: 19.90, image: "https://via.placeholder.com/60" },
    { id: 49, name: "Atadura Crepom 06 x 1,8 mt unid Neve", price: 0.65, image: "https://via.placeholder.com/60" },
    { id: 50, name: "Atadura Crepom 08 x 1,8 mt unid Neve", price: 0.85, image: "https://via.placeholder.com/60" },
    { id: 51, name: "Atadura Crepom 10 x 1,8 mt unid Neve", price: 1.00, image: "https://via.placeholder.com/60" },
    { id: 52, name: "Atadura Crepom 12 x 1,8 mt unid Neve", price: 1.25, image: "https://via.placeholder.com/60" },
    { id: 53, name: "Atadura Crepom 15 x 1,8 mt unid Neve", price: 1.60, image: "https://via.placeholder.com/60" },
    { id: 54, name: "Atadura Crepom 20 x 1,8 mt unid Neve", price: 2.00, image: "https://via.placeholder.com/60" },
    { id: 55, name: "Atadura Crepom 25 x 1,8 mt unid Neve", price: 2.50, image: "https://via.placeholder.com/60" },
    { id: 56, name: "Atadura Crepom 30 x 1,8 mt unid Neve", price: 2.80, image: "https://via.placeholder.com/60" },
    { id: 57, name: "Atadura Elástica 08 x 2,2m unid Neve", price: 1.60, image: "https://via.placeholder.com/60" },
    { id: 58, name: "Atadura Elástica 10 x 2,2m unid Neve", price: 1.80, image: "https://via.placeholder.com/60" },
    { id: 59, name: "Atadura Elastica 12 x 2,2m unid Neve", price: 2.20, image: "https://via.placeholder.com/60" },
    { id: 60, name: "Atadura Elastica 15 x 2,2m unid Neve", price: 2.50, image: "https://via.placeholder.com/60" },
    { id: 61, name: "Atadura Elastica 20 x 2,2m unid Neve", price: 3.00, image: "https://via.placeholder.com/60" },
    { id: 62, name: "Atadura Rayon - 7,5 cm. X 5 mts.", price: 9.90, image: "https://via.placeholder.com/60" },
    { id: 63, name: "Auto Teste COVID Antígeno", price: 11.90, image: "https://via.placeholder.com/60" },
    { id: 64, name: "Avental - Pct. c/ 10 unidades", price: 49.90, image: "https://via.placeholder.com/60" },
    { id: 65, name: "Bandagem Elástica Adesiva - TMAX (Preto, Azul, Verde, Amarelo, Rosa)", price: 36.90, image: "https://via.placeholder.com/60" },
    { id: 66, name: "Bandagem Dermatape funcional elastica (Preta, lilas, azul, rosa, bege)", price: 21.90, image: "https://via.placeholder.com/60" },
    { id: 67, name: "Banho Siliconizado, super condicionante, 10 beneficios c/filtro solar - 300 ml. MARY LIFE", price: 7.90, image: "https://via.placeholder.com/60" },
    { id: 68, name: "Balança Digital Bioland", price: 49.90, image: "https://via.placeholder.com/60" },
    { id: 69, name: "Bengala muleta canadense und.", price: 39.90, image: "https://via.placeholder.com/60" },
    { id: 70, name: "Bicarbonato de sódio - Uniphar - PC. c/ 100 gr", price: 3.60, image: "https://via.placeholder.com/60" },
    { id: 71, name: "Bobina p/ esterilização 7,5cm x 100m", price: 39.90, image: "https://via.placeholder.com/60" },
    { id: 72, name: "Bolsa de agua quente BIOLAND 2 Litros", price: 19.90, image: "https://via.placeholder.com/60" },
    { id: 73, name: "Bolsa Colostomia 50 MM c/10", price: 6.40, image: "https://via.placeholder.com/60" },
    { id: 74, name: "Bolsa Térmica não congelável - 600 gr. - TERMOGEL", price: 16.90, image: "https://via.placeholder.com/60" },
    { id: 75, name: "Bomba Vacuo - G-TECH - Manual - P/Extração de Leite - seio", price: 49.90, image: "https://via.placeholder.com/60" },
    { id: 76, name: "BTOX, óleo reconstrutor progressivo super condicionante - 60 ml. - MARY LIFE", price: 15.99, image: "https://via.placeholder.com/60" },
    { id: 77, name: "BTOX, óleo reconstrutor progressivo super condicionante - 50 ml. - MARY LIFE", price: 11.50, image: "https://via.placeholder.com/60" },
    { id: 78, name: "Caneta Lancetadora G-tech", price: 9.90, image: "https://via.placeholder.com/60" },
    { id: 79, name: "CANFORA-TABLETE - POTE C/ 200 X 0,75 GR", price: 99.90, image: "https://via.placeholder.com/60" },
    { id: 80, name: "CANFORA-TABLETE - ESTOJO 28 GR - C/ 8 TABLETE DE 3,5 GR", price: 17.90, image: "https://via.placeholder.com/60" },
    { id: 81, name: "CANFORA-TABLETE - POTE C/ 30 X 0,75 GR", price: 17.90, image: "https://via.placeholder.com/60" },
    { id: 82, name: "Cateter Intravenoso - N° 14/16/18/20/22/24", price: 1.00, image: "https://via.placeholder.com/60" },
    { id: 83, name: "Cloreto de Magnésio Medinal", price: 4.50, image: "https://via.placeholder.com/60" },
    { id: 84, name: "Cloreto de Magnésio Medinal 50 cápsulas", price: 12.90, image: "https://via.placeholder.com/60" },
    { id: 85, name: "Cloreto de Magnésio Medical 100 cápsulas", price: 15.90, image: "https://via.placeholder.com/60" },
    { id: 86, name: "Coletor esteril 50 ml Firstlab", price: 0.49, image: "https://via.placeholder.com/60" },
    { id: 87, name: "Coletor esteril kit urina J Prolab", price: 0.99, image: "https://via.placeholder.com/60" },
    { id: 88, name: "Coletor esteril 80 ml J Prolab", price: 0.65, image: "https://via.placeholder.com/60" },
    { id: 89, name: "Coletor infantil unissex und", price: 0.50, image: "https://via.placeholder.com/60" },
    { id: 90, name: "Coletor 24 horas 2 L", price: 6.90, image: "https://via.placeholder.com/60" },
    { id: 91, name: "Comadre Plástica", price: 19.90, image: "https://via.placeholder.com/60" },
    { id: 92, name: "COMPRESSA GASE 15 X 30 ALGODOADA C/10", price: 1.90, image: "https://via.placeholder.com/60" },
    { id: 93, name: "COMPRESSA GASE 15 X 60 ALGODOADA C/10", price: 2.79, image: "https://via.placeholder.com/60" },
    { id: 94, name: "Compressa Gase c/10 esteril AMÉRICA - 13 Fios", price: 0.79, image: "https://via.placeholder.com/60" },
    { id: 95, name: "Compressa Gase c/500 13 fios America", price: 32.90, image: "https://via.placeholder.com/60" },
    { id: 96, name: "Compressa Gase c/500 11 fios America", price: 27.90, image: "https://via.placeholder.com/60" },
    { id: 97, name: "Compressa Gase 10x10 est c/10 13fio", price: 1.60, image: "https://via.placeholder.com/60" },
    { id: 98, name: "Compressa Gase Esteril não Aderente Kurativan - CAIXA c/100", price: 1.35, image: "https://via.placeholder.com/60" },
    { id: 99, name: "Copo Plastico 180ml c/100 transparente", price: 5.99, image: "https://via.placeholder.com/60" },
    { id: 100, name: "Cortador de comprimidos MEZZO", price: 5.90, image: "https://via.placeholder.com/60" },
    { id: 101, name: "CURATIVO TRADICIONAL TRANSPARENTE C/10 UND. - NATHY", price: 2.20, image: "https://via.placeholder.com/60" },
    { id: 102, name: "CURATIVO TRADICIONAL TRANSPARENTE C/35 UND. - NATHY", price: 4.99, image: "https://via.placeholder.com/60" },
    { id: 103, name: "Curativo pos coleta individual c/500un - Blood Stop", price: 23.90, image: "https://via.placeholder.com/60" },
    { id: 104, name: "Curativo pos coleta individual c/500un - MEDIX", price: 23.90, image: "https://via.placeholder.com/60" },
    { id: 105, name: "Curativo hidrocolóide - 10 x 10 - CASSEX", price: 8.90, image: "https://via.placeholder.com/60" },
    { id: 106, name: "Curativo hidrocolóide - 20 x 20 - VITALDERME", price: 24.90, image: "https://via.placeholder.com/60" },
    { id: 107, name: "Curativo hidrocolóide - 15 x 15 CASSEX", price: 16.90, image: "https://via.placeholder.com/60" },
    { id: 108, name: "Curativo Hidrocolóide - 10 x 10 ultra fino - VITALDERME", price: 8.90, image: "https://via.placeholder.com/60" },
    { id: 109, name: "Curativo Hidrocolóide - 15 x 15 ultra fino - VITALDERME", price: 13.90, image: "https://via.placeholder.com/60" },
    { id: 110, name: "Descartex 13 Litros - DESCARPACK", price: 9.90, image: "https://via.placeholder.com/60" },
    { id: 111, name: "Descartex 7 Litros - DESCARPACK", price: 7.90, image: "https://via.placeholder.com/60" },
    { id: 112, name: "Desodalina cx. c/ 60 caps.", price: 49.90, image: "https://via.placeholder.com/60" },
    { id: 113, name: "Dilatador Nasal - M/G", price: 19.90, image: "https://via.placeholder.com/60" },
    { id: 114, name: "Dilatex - Pote c/ 152 caps.", price: 53.90, image: "https://via.placeholder.com/60" },
    { id: 115, name: "Dimalato 60 caps.", price: 24.90, image: "https://via.placeholder.com/60" },
    { id: 116, name: "Escova Dental Infantil - Rosa (Elétrica) - TECHLINE", price: 22.90, image: "https://via.placeholder.com/60" },
    { id: 117, name: "Escova Dental Infantil - Verde (Elétrica) - TECHLINE", price: 22.90, image: "https://via.placeholder.com/60" },
    { id: 118, name: "Escova Dental Adulto (Elétrica) - TECHLINE", price: 29.90, image: "https://via.placeholder.com/60" },
    { id: 119, name: "Esfigmomanômetro S/Esteto - PREMIUM - Cores", price: 69.90, image: "https://via.placeholder.com/60" },
    { id: 120, name: "ESFIG EM NYLON FECHO VELCRO C/ ESTETO C/ MAN - ADULTO", price: 89.90, image: "https://via.placeholder.com/60" },
    { id: 121, name: "ESFIG EM NYLON ANEROIDE FECHO VELCRO S/ ESTETO - OBESO", price: 99.90, image: "https://via.placeholder.com/60" },
    { id: 122, name: "Espaçador INFANTIL / ADULTO - G-TECH", price: 27.90, image: "https://via.placeholder.com/60" },
    { id: 123, name: "Espaçador INFANTIL / ADULTO - OSLER", price: 24.90, image: "https://via.placeholder.com/60" },
    { id: 124, name: "Esparadrapo MISSNER 1,25 x 4,5 m", price: 3.45, image: "https://via.placeholder.com/60" },
    { id: 125, name: "Esparadrapo MISSNER 10 x 4,5 m", price: 15.99, image: "https://via.placeholder.com/60" },
    { id: 126, name: "Esparadrapo MISSNER 2,5 x 4,5 m", price: 4.99, image: "https://via.placeholder.com/60" },
    { id: 127, name: "Esparadrapo MISSNER 2,5 x 90 m", price: 2.79, image: "https://via.placeholder.com/60" },
    { id: 128, name: "Esparadrapo MISSNER 5 x 4,5 m", price: 7.50, image: "https://via.placeholder.com/60" },
    { id: 129, name: "Esparadrapo Vital - 10 mm. X 4,5 m", price: 12.90, image: "https://via.placeholder.com/60" },
    { id: 130, name: "Envelope p/ esterilização 09cm x 23cm C/200", price: 33.90, image: "https://via.placeholder.com/60" },
    { id: 131, name: "GARROTE Nº 200-1 METRO-PCT.C/15 UN", price: 4.99, image: "https://via.placeholder.com/60" },
    { id: 132, name: "GARROTE Nº 201-1 METRO-PCT.C/15 UN", price: 6.50, image: "https://via.placeholder.com/60" },
    { id: 133, name: "GARROTE Nº 202-1 METRO-PCT.C/15 UN", price: 8.99, image: "https://via.placeholder.com/60" },
    { id: 134, name: "GARROTE Nº 203-1 METRO-PCT.C/15 UN", price: 9.99, image: "https://via.placeholder.com/60" },
    { id: 135, name: "Glicerina líquida - 100 ml UNIPHAR", price: 6.90, image: "https://via.placeholder.com/60" },
    { id: 136, name: "HASTES FLEXIVEIS C/75 UND. - NATHY", price: 1.99, image: "https://via.placeholder.com/60" },
    { id: 137, name: "HASTES FLEXIVEIS C/150 UND. - NATHY", price: 2.99, image: "https://via.placeholder.com/60" },
    { id: 138, name: "HIGIENIZADOR NASAL - GARRAFA", price: 19.90, image: "https://via.placeholder.com/60" },
    { id: 139, name: "Inalador Compressor Silencioso - C-803 - OMRON", price: 109.90, image: "https://via.placeholder.com/60" },
    { id: 140, name: "Inalador a Ar Comprimido Compact C 810 - INALAR", price: 119.90, image: "https://via.placeholder.com/60" },
    { id: 141, name: "Inalador de Ar Comprimido Mod. Compact DC1 GTECH", price: 99.90, image: "https://via.placeholder.com/60" },
    { id: 142, name: "INALADOR & NEBULIZADOR DE REDE VIBRATORIOG TECH", price: 139.90, image: "https://via.placeholder.com/60" },
    { id: 143, name: "Inalador de Rede Vibratória NE-U300 - Inalar Mini - OMRON", price: 179.90, image: "https://via.placeholder.com/60" },
    { id: 144, name: "Kit Inalador G-Tech infantil", price: 16.90, image: "https://via.placeholder.com/60" },
    { id: 145, name: "Kit Inalador G-Tech adulto", price: 16.90, image: "https://via.placeholder.com/60" },
    { id: 146, name: "Kit Inalador NS infantil", price: 15.90, image: "https://via.placeholder.com/60" },
    { id: 147, name: "Kit Inalador NS adulto", price: 15.90, image: "https://via.placeholder.com/60" },
    { id: 148, name: "Kit Medidor de Glicose BIOLAND (c/ 25 tiras e 25 lancetas)", price: 29.90, image: "https://via.placeholder.com/60" },
    { id: 149, name: "Lancetas G-Tech Diabetes com 100 unid", price: 7.90, image: "https://via.placeholder.com/60" },
    { id: 150, name: "Lençol de papel hospitalar", price: 15.90, image: "https://via.placeholder.com/60" },
    { id: 151, name: "Levedo de Cerveja - 400 cápsulas - APIS NUTRI", price: 23.90, image: "https://via.placeholder.com/60" },
    { id: 152, name: "Liso eterno spray - Condicionante Termoativado - 130 ml. - MARY LIFE", price: 13.90, image: "https://via.placeholder.com/60" },
    { id: 153, name: "Luvas estéril (6½, 7, 7½, 8, 8½)", price: 1.90, image: "https://via.placeholder.com/60" },
    { id: 154, name: "Luvas latex de procedimento c/100 com pó (Marca: Talge)", price: 23.90, promoPrice: 22.90, image: "https://via.placeholder.com/60" },
    { id: 158, name: "Luva p/ Procedimento - Nitrilo - Black", price: 27.90, promoPrice: 24.90, image: "https://via.placeholder.com/60" },
    { id: 161, name: "Luva p/ Procedimento - Nitrilo - P/M/G - Azul", price: 25.90, image: "https://via.placeholder.com/60" },
    { id: 162, name: "LUVA P/PROCEDIMENTO NITRILICA - PP,P,M,G - ROSA", price: 27.90, image: "https://via.placeholder.com/60" },
    { id: 163, name: "Luva Silicone (Vinil) Tamanho P,M,G - Medix", price: 16.90, image: "https://via.placeholder.com/60" },
    { id: 164, name: "Magvit Gotas 50 ml tradicional", price: 27.90, image: "https://via.placeholder.com/60" },
    { id: 165, name: "Magvit Cápsulas - Pote c/ 60", price: 29.90, image: "https://via.placeholder.com/60" },
    { id: 166, name: "MANITOL 20%-250 ML - EQIPLEX", price: 13.99, image: "https://via.placeholder.com/60" },
    { id: 167, name: "Manteiga de Cacau - NATUNECTAR - cx. c/ 50 unidades", price: 79.90, image: "https://via.placeholder.com/60" },
    { id: 168, name: "Manteiga de Cacau Roll-On - VEDIS", price: 3.50, image: "https://via.placeholder.com/60" },
    { id: 169, name: "Manteiga de Cacau c/ Equinacea - Sabores diversos - VEDIS", price: 2.99, image: "https://via.placeholder.com/60" },
    { id: 170, name: "Manteiga de Cacau ZIIN ZIIN - Display c/ 50", price: 89.90, image: "https://via.placeholder.com/60" },
    { id: 171, name: "Mascara Descartável c/ elástico tripla face - CX. C/50 - BRANCA", price: 6.90, image: "https://via.placeholder.com/60" },
    { id: 172, name: "Mascara Descartável c/ elástico tripla face - CX. C/50 - PRETA", price: 7.90, image: "https://via.placeholder.com/60" },
    { id: 173, name: "Mascara Descartável c/ elástico tripla face - CX. C/50 - ROSA", price: 7.90, image: "https://via.placeholder.com/60" },
    { id: 174, name: "Metaplus 290 g", price: 17.90, image: "https://via.placeholder.com/60" },
    { id: 175, name: "Metaplus Sachê - caixa c/ 75", price: 17.90, image: "https://via.placeholder.com/60" },
    { id: 176, name: "Micropore - 12 cm x 10 m - GLOMED", price: 1.99, image: "https://via.placeholder.com/60" },
    { id: 177, name: "Micropore - 25 cm x 10 m - GLOMED", price: 2.99, image: "https://via.placeholder.com/60" },
    { id: 178, name: "Micropore 50 cm x 10 m - GLOMED", price: 4.99, image: "https://via.placeholder.com/60" },
    { id: 179, name: "Micropore - 100 cm x 10 m - GLOMED", price: 10.90, image: "https://via.placeholder.com/60" },
    { id: 180, name: "Micropore - 12,5 x 10m MISSNER", price: 3.20, image: "https://via.placeholder.com/60" },
    { id: 181, name: "Micropore - 2,5 x 90cm MISSNER", price: 2.99, image: "https://via.placeholder.com/60" },
    { id: 182, name: "Micropore - 25 x 10 m MISSNER", price: 4.79, image: "https://via.placeholder.com/60" },
    { id: 183, name: "Micropore - 50 x 10m MISSNER", price: 7.90, image: "https://via.placeholder.com/60" },
    { id: 184, name: "Micropore - 100 x 10 m MISSNER", price: 17.90, image: "https://via.placeholder.com/60" },
    { id: 185, name: "Micropore - 12,5 x 10m MISSNER cor da pele", price: 3.90, image: "https://via.placeholder.com/60" },
    { id: 186, name: "Micropore - 2,5 x 90cm MISSNER cor da Pele", price: 2.90, image: "https://via.placeholder.com/60" },
    { id: 187, name: "Micropore - 25 x 10 m MISSNER cor da pele", price: 5.90, image: "https://via.placeholder.com/60" },
    { id: 188, name: "Micropore - 50 x 10m MISSNER cor da pele", price: 9.30, image: "https://via.placeholder.com/60" },
    { id: 189, name: "Micropore - 100 x 10 m MISSNER cor da pele", price: 18.90, image: "https://via.placeholder.com/60" },
    { id: 190, name: "Micropore 25 mm x 10 m - VITAL", price: 3.50, image: "https://via.placeholder.com/60" },
    { id: 191, name: "Micropore 50 mm x 10 m - VITAL", price: 5.90, image: "https://via.placeholder.com/60" },
    { id: 192, name: "Micropore Transparente - 10 cm. X 4,5 m.", price: 13.90, image: "https://via.placeholder.com/60" },
    { id: 193, name: "Micropore de Silicone - 2,5 cm. X 1,5 m.", price: 12.90, image: "https://via.placeholder.com/60" },
    { id: 194, name: "MODELADOR DE SEIOS P/M/G/GG - C/3 PARES", price: 29.90, image: "https://via.placeholder.com/60" },
    { id: 195, name: "Monaliz - Meu Controle cx. c/ 30 comp.", price: 43.99, image: "https://via.placeholder.com/60" },
    { id: 196, name: "Multi Polivitamínico Bariátrico - 60 cápsulas - CATARINENSE", price: 29.99, image: "https://via.placeholder.com/60" },
    { id: 197, name: "ÓLEO DE AMÊNDOAS - 100 ml. - FARMAX", price: 12.90, image: "https://via.placeholder.com/60" },
    { id: 198, name: "Oleo de Copaiba 30 ml UNIPHAR", price: 8.90, image: "https://via.placeholder.com/60" },
    { id: 199, name: "ÓLEO DE CRAVO - 14 ML. - CINCO", price: 8.90, image: "https://via.placeholder.com/60" },
    { id: 200, name: "Oleo de Girassol 200ml DERMAEX", price: 8.90, image: "https://via.placeholder.com/60" },
    { id: 201, name: "Oleo de Girassol 100ml DERMAEX", price: 6.90, image: "https://via.placeholder.com/60" },
    { id: 202, name: "Oleo de ricino 30 ml Uniphar", price: 3.90, image: "https://via.placeholder.com/60" },
    { id: 203, name: "ÓLEO MINERAL - 100 ML. - UNIPHAR", price: 6.90, image: "https://via.placeholder.com/60" },
    { id: 204, name: "OXIMETRO G-TECH - Modelo OLED GRAPH", price: 89.90, image: "https://via.placeholder.com/60" },
    { id: 205, name: "OXIMETRO - MEDICLINI", price: 59.90, image: "https://via.placeholder.com/60" },
    { id: 206, name: "Papagaio Plástico com alça e tampa", price: 10.90, image: "https://via.placeholder.com/60" },
    { id: 207, name: "Pasta D'água 100 G - Uniphar", price: 6.99, image: "https://via.placeholder.com/60" },
    { id: 208, name: "Papel Toalha MIAMI", price: 9.90, image: "https://via.placeholder.com/60" },
    { id: 209, name: "PELICULA PROTETORA LIQUIDA - MISSNER - 28ML", price: 46.90, image: "https://via.placeholder.com/60" },
    { id: 210, name: "Pedra HUME pó - Cx. C. 30 gr. - UNIPHAR", price: 4.40, image: "https://via.placeholder.com/60" },
    { id: 211, name: "Pedra HUME Spray - 30 ml. - UNIPHAR", price: 6.90, image: "https://via.placeholder.com/60" },
    { id: 212, name: "PENTE DE AÇO", price: 11.90, image: "https://via.placeholder.com/60" },
    { id: 213, name: "Permaganato de potássio c/ 10 unid - UNIPHAR", price: 1.50, image: "https://via.placeholder.com/60" },
    { id: 214, name: "Pilha Alcalina AA - PANASONIC - C/4", price: 14.90, image: "https://via.placeholder.com/60" },
    { id: 215, name: "Pilha Alcalina AAA - PANASONIC - C/4", price: 14.90, image: "https://via.placeholder.com/60" },
    { id: 216, name: "Pilha Alcalina AA - PANASONIC - CAIXA C/ 40", price: 129.90, image: "https://via.placeholder.com/60" },
    { id: 217, name: "Pilha Alcalina AAA - PANASONIC - CAIXA C/40", price: 129.90, image: "https://via.placeholder.com/60" },
    { id: 218, name: "Polivitamínivo KIDS - 150 ml. - CATARINENSE", price: 15.99, image: "https://via.placeholder.com/60" },
    { id: 219, name: "Porta Comprimido mezzo Semanal", price: 5.50, image: "https://via.placeholder.com/60" },
    { id: 220, name: "Propé - PCT. C/100", price: 29.90, image: "https://via.placeholder.com/60" },
    { id: 221, name: "PRÓPOLIS C/MEL E ERVA DOCE 30 ML SPRAY", price: 15.90, image: "https://via.placeholder.com/60" },
    { id: 222, name: "PRÓPOLIS C/MEL E HORTELA 30 ML SPRAY", price: 15.90, image: "https://via.placeholder.com/60" },
    { id: 223, name: "PRÓPOLIS L-20 30 ML", price: 11.50, image: "https://via.placeholder.com/60" },
    { id: 224, name: "PRÓPOLIS L-30 20 ML", price: 11.90, image: "https://via.placeholder.com/60" },
    { id: 225, name: "PRÓPOLIS L-20 30 ML SPRAY", price: 15.90, image: "https://via.placeholder.com/60" },
    { id: 226, name: "PROPOLIS GENGIBRE E MEL - SPRAY C/30 ML. - UNIPHAR", price: 5.99, image: "https://via.placeholder.com/60" },
    { id: 227, name: "PROPOLIS ROMA E MEL - SPRAY C/30 ML. - UNIPHAR", price: 5.99, image: "https://via.placeholder.com/60" },
    { id: 228, name: "Protetor Labial FPS 20 UVB c/ Calêndula Vedis", price: 5.50, image: "https://via.placeholder.com/60" },
    { id: 229, name: "PROTETOR OFTALMICO - PQ. BEGE CX. C/20", price: 19.90, image: "https://via.placeholder.com/60" },
    { id: 230, name: "PROTETOR OFTALMICO - GD - BEGE - CX. C/20", price: 20.90, image: "https://via.placeholder.com/60" },
    { id: 231, name: "PROTETOR OFTALMICO - PQ. BEGE CX. C/ 20 COLORIDO", price: 19.90, image: "https://via.placeholder.com/60" },
    { id: 232, name: "PVPI 100 ml - UNIPHAR", price: 8.50, image: "https://via.placeholder.com/60" },
    { id: 233, name: "PVPI Spray 100 ml - FARMAX", price: 11.90, image: "https://via.placeholder.com/60" },
    { id: 234, name: "RESPIRON - Exercitador e Incentivador Respiratório", price: 29.90, image: "https://via.placeholder.com/60" },
    { id: 235, name: "Repelente Spray - 100 ml. - NUTRIEX", price: 9.99, image: "https://via.placeholder.com/60" },
    { id: 236, name: "Sal Amargo pó - Sache - CATARINENSE", price: 2.20, image: "https://via.placeholder.com/60" },
    { id: 237, name: "Sebo de Carneiro - 150g. c/ Óleo de Argan", price: 5.99, image: "https://via.placeholder.com/60" },
    { id: 238, name: "Seringa BD 10 ml", price: 1.10, image: "https://via.placeholder.com/60" },
    { id: 239, name: "Seringa BD 20 ml", price: 1.65, image: "https://via.placeholder.com/60" },
    { id: 240, name: "Seringa BD 5 ml. Sem Agulha", price: 0.69, image: "https://via.placeholder.com/60" },
    { id: 241, name: "Seringa BD 3 ml. Sem agulha", price: 0.49, image: "https://via.placeholder.com/60" },
    { id: 242, name: "Seringa para lavagem nasal infantil - Nosewash", price: 19.90, image: "https://via.placeholder.com/60" },
    { id: 243, name: "Seringa MEDIX - 3 ml - Sem Agulha", price: 0.35, image: "https://via.placeholder.com/60" },
    { id: 244, name: "Seringa MEDIX - 5 ml - Sem Agulha", price: 0.39, image: "https://via.placeholder.com/60" },
    { id: 245, name: "Seringa MEDIX - 10 ml", price: 0.79, image: "https://via.placeholder.com/60" },
    { id: 246, name: "Seringa MEDIX - 20ml", price: 0.99, image: "https://via.placeholder.com/60" },
    { id: 247, name: "Seringa - 60 ml. - BICO CATETER", price: 4.90, image: "https://via.placeholder.com/60" },
    { id: 248, name: "Seringa de Insulina - 1 ml - AG 13 x 0,33", price: 1.30, image: "https://via.placeholder.com/60" },
    { id: 249, name: "Seringa de Insulina - 1 ml - AG 13 x 4,5", price: 0.59, image: "https://via.placeholder.com/60" },
    { id: 250, name: "Seringa de Insulina 1 ml AG 8 x 0,30 AGULHA CURTA", price: 1.49, image: "https://via.placeholder.com/60" },
    { id: 251, name: "Seringa de Insulina 0,5 ml - AG 8 x 0,30", price: 1.49, image: "https://via.placeholder.com/60" },
    { id: 252, name: "Seringa de Insulina 0,5 ml AG 0,25 x 6", price: 1.59, image: "https://via.placeholder.com/60" },
    { id: 253, name: "Seringa de Insulina 1 ml - AG 0,25 X 6", price: 1.49, image: "https://via.placeholder.com/60" },
    { id: 254, name: "Seringa c/trava de segurança 3ml - SR", price: 0.49, image: "https://via.placeholder.com/60" },
    { id: 255, name: "Seringa c/trava de segurança 5ml - SR", price: 0.69, image: "https://via.placeholder.com/60" },
    { id: 256, name: "Seringa SR - 5 ml - c/ agulha 25 x 7", price: 0.49, image: "https://via.placeholder.com/60" },
    { id: 257, name: "Sineflex - Pote c/ 150 caps.", price: 53.90, image: "https://via.placeholder.com/60" },
    { id: 258, name: "Soro Fisiologico 10 ml J. P", price: 0.75, image: "https://via.placeholder.com/60" },
    { id: 259, name: "Soro fisiologico 100 ml LBS", price: 2.49, image: "https://via.placeholder.com/60" },
    { id: 260, name: "Soro fisiologico 250 ml LBS", price: 3.99, image: "https://via.placeholder.com/60" },
    { id: 261, name: "Soro fisiologico 500 ml LBS", price: 4.99, image: "https://via.placeholder.com/60" },
    { id: 262, name: "Soro Indovenoso estéril - 250 ml", price: 8.90, image: "https://via.placeholder.com/60" },
    { id: 263, name: "Termômetro Digital de Testa - TECHLINE", price: 69.90, image: "https://via.placeholder.com/60" },
    { id: 264, name: "Termometro Digital TECHLINE", price: 11.90, image: "https://via.placeholder.com/60" },
    { id: 265, name: "Med teste Covid 19 + Influenza A & B / AG COMBO c/25 - MED LEVENSOHN", price: 599.90, image: "https://via.placeholder.com/60" },
    { id: 266, name: "Teste Influenza A & B - cx. c/ 25 - WAMA", price: 499.90, image: "https://via.placeholder.com/60" },
    { id: 267, name: "Tintura de Iodo 30 ml - UNIPHAR", price: 4.90, image: "https://via.placeholder.com/60" },
    { id: 268, name: "Tintura de Arnica Uniphar", price: 4.90, image: "https://via.placeholder.com/60" },
    { id: 269, name: "Tiras Reagentes c/ 50 unidades Lite - G-TECH", price: 59.90, image: "https://via.placeholder.com/60" },
    { id: 270, name: "Tiras Reagentes c/ 50 unidades Free - G-TECH", price: 66.90, image: "https://via.placeholder.com/60" },
    { id: 271, name: "Tiras Reagentes c/ 50 unidades - VITA - G-TECH", price: 49.90, image: "https://via.placeholder.com/60" },
    { id: 272, name: "Tira teste para glicemia c/ 50 unidades - BIOLAND", price: 33.90, image: "https://via.placeholder.com/60" },
    { id: 273, name: "Touca cirurgica - pct. c/ 100", price: 9.90, image: "https://via.placeholder.com/60" },
    { id: 274, name: "UMIDIFICADOR E AROMATIZADOR DE AR - 3 LITROS - G-TECH", price: 119.90, image: "https://via.placeholder.com/60" },
    { id: 275, name: "Vaselina liquida 100 ml Uniphar", price: 6.50, image: "https://via.placeholder.com/60" },
    { id: 276, name: "Vaselina Solida 25 gr Uniphar", price: 5.50, image: "https://via.placeholder.com/60" },
    { id: 277, name: "Violeta Genciana 30 ml UNIPHAR", price: 3.50, image: "https://via.placeholder.com/60" },
    { id: 278, name: "Vitamina K2 Premium - 60 cápsulas - MEDINAL", price: 11.90, image: "https://via.placeholder.com/60" },
    { id: 279, name: "Zinco Quelato - 60 cápsulas - MEDINAL", price: 11.90, image: "https://via.placeholder.com/60" },
    { id: 280, name: "Acetona 100 ml AP (CINCO)", price: 8.90, image: "https://via.placeholder.com/60" },
    { id: 281, name: "Acetona 500 AP (CINCO)", price: 39.90, image: "https://via.placeholder.com/60" },
    { id: 282, name: "KIT CAPILAR BIO INSTINTO (Shampoo, Condicionador, Mascara, Creme)", price: 21.90, image: "https://via.placeholder.com/60" },
    { id: 283, name: "KIT CAPILAR BEBELO (Shampoo, Condicionador, Mascara e Spray)", price: 23.90, image: "https://via.placeholder.com/60" },
    { id: 284, name: "Pomada Massageadora - 150 g. - Preta FISIOFORT PREMIUM", price: 7.99, image: "https://via.placeholder.com/60" },
    { id: 285, name: "Pomada Massageadora - 150 g. - Verde FISIOFORT", price: 5.99, image: "https://via.placeholder.com/60" },
    { id: 286, name: "Pomada Massageadora - 150 gr. - FISIOFORT GOLD", price: 8.50, image: "https://via.placeholder.com/60" },
    { id: 287, name: "Pomada Massageadora - 150 gr. - FISIOPOWER", price: 6.50, image: "https://via.placeholder.com/60" },
    { id: 288, name: "Pomada Massageadora - 150 g. - CANELA DE VELHO", price: 5.99, image: "https://via.placeholder.com/60" },
    { id: 289, name: "Pomada Massageadora MILAGROSA - 150 gr.", price: 5.99, image: "https://via.placeholder.com/60" },
    { id: 290, name: "Pomada massageadora TIRA COM A MÃO - 150 gr.", price: 5.99, image: "https://via.placeholder.com/60" },
    { id: 291, name: "Pomada massageadora CANELA DE VELHO PREMIUM - 150 gr.", price: 6.50, image: "https://via.placeholder.com/60" },
    { id: 293, name: "Redutor de medidas Fisiofort Slim - 200 gr.", price: 5.99, image: "https://via.placeholder.com/60" },
    { id: 294, name: "Creme Hidratante Desodorante Corporal - Ureia - 150 gr.", price: 6.50, image: "https://via.placeholder.com/60" },
    { id: 295, name: "BODY SPLASH DESODORANTE COLONIA - 130 ML", price: 6.50, image: "https://via.placeholder.com/60" },
    { id: 296, name: "DESODORANTE ÍNTIMO - 50 ML (Delicada, Algodão Doce, Morango & Chantilly, Cereja, Flores Delicadas, Rosa Mosqueta)", price: 5.50, image: "https://via.placeholder.com/60" },
    { id: 297, name: "SABONETE LÍQUIDO ÍNTIMO - 200 ML", price: 3.90, image: "https://via.placeholder.com/60" },
    { id: 298, name: "SABONETE LÍQUIDO ÍNTIMO BARBATIMÃO - 200 ML", price: 3.90, image: "https://via.placeholder.com/60" },
    { id: 299, name: "SABONETE LÍQUIDO ÍNTIMO BARBATIMÃO E AROEIRA - 200 ML", price: 3.90, image: "https://via.placeholder.com/60" },
    { id: 300, name: "SABONETE LÍQUIDO ÍNTIMO BEBELO - 200 ML", price: 3.90, image: "https://via.placeholder.com/60" },
    { id: 301, name: "LOÇÃO MILAGROSA DESODORANTE P/OS PÉS - 30 ML.", price: 3.50, image: "https://via.placeholder.com/60" },
    { id: 302, name: "ÓLEO DE COCO, REPARADOR DE PONTAS - 50 ML", price: 9.90, image: "https://via.placeholder.com/60" },
    { id: 303, name: "PODOX, PODOLOGIA PROFISSIONAL P/OS PÉS (Kit)", price: 18.90, image: "https://via.placeholder.com/60" },
    { id: 304, name: "TÔNICO CAPILAR CAVALO DE RAÇA - 30 ML", price: 9.99, image: "https://via.placeholder.com/60" },
    { id: 306, name: "ÔMEGA 3 - 1000 MG - C/120 CAPSULAS - CATARINENSE", price: 33.99, image: "https://via.placeholder.com/60" },
    { id: 314, name: "SUPREME ARGAN OIL - 60 ML - MARY LIFE", price: 14.99, image: "https://via.placeholder.com/60" },
    { id: 315, name: "SUPREME ARGAN OIL - 50 ML - MARY LIFE", price: 9.99, image: "https://via.placeholder.com/60" },
    { id: 316, name: "SABONETE ÍNTIMO EM GEL (Cereja, Amora, Barbatimão e Flor de Algodão, Pétalas de Rosas, Roma e Aroeira, Rosa Mosqueta, Vanilla, Pêssego)", price: 3.90, image: "https://via.placeholder.com/60" },
    { id: 324, name: "Sabonete liquido intimo - Erva Doce (Aromas do Brasil)", price: 4.50, image: "https://via.placeholder.com/60" },
    { id: 325, name: "Sabonete Liquido Intimo - Menta (Aromas do Brasil)", price: 4.50, image: "https://via.placeholder.com/60" },
    { id: 326, name: "Sabonete liquido intimo infantil/juvenil - Bebeloo Tutti Frutti", price: 4.50, image: "https://via.placeholder.com/60" },
    { id: 327, name: "Sabonete Liquido Intimo - Morango com Champagne (Aromas do Brasil)", price: 4.50, image: "https://via.placeholder.com/60" },
    { id: 328, name: "Sabonete liquido intimo - Barbatimão e Aroeira (Aromas do Brasil)", price: 4.50, image: "https://via.placeholder.com/60" },
    { id: 329, name: "Sabonete liquido intimo infantil/juvenil - Bebeloo Uva", price: 4.50, image: "https://via.placeholder.com/60" },
    { id: 335, name: "Desodorante Intimo - Cheirosa Spray (Kit/Variados)", price: 5.50, image: "https://via.placeholder.com/60" },
    { id: 336, name: "Água Micelar 15 em 1 - Demaquilante Mary Life (260 mL)", price: 4.90, image: "https://via.placeholder.com/60" },
    { id: 341, name: "Kit Capilar Profissional (Ameixa Negra, Vinagre de Maçã, Ômega e outras opções)", price: 21.90, image: "https://via.placeholder.com/60" },
    { id: 342, name: "Uso Eterno Termoativado - Spray capilar 20 benefícios Mary Life (130 mL)", price: 14.90, image: "https://via.placeholder.com/60" },
    { id: 344, name: "Óleo de Argan Supreme - Super Condicionante Multifuncional Mary Life (50 mL)", price: 9.90, image: "https://via.placeholder.com/60" },
    { id: 345, name: "Bolsa Térmica não congelável - 350 gr. - TERMOGEL", price: null, image: "https://via.placeholder.com/60" },
    { id: 346, name: "Coenzima Q10 e Vitamina E - Suplemento alimentar - c/ 60 caps - BIOCÊUTICA", price: null, image: "https://via.placeholder.com/60" },
    { id: 347, name: "Colágeno Tipo II - Vitamina B12 e D3 - 60 capsulas - BIOCÊUTICA", price: null, image: "https://via.placeholder.com/60" },
    { id: 348, name: "Colágeno Tipo II - 60 cápsulas - APIS NUTRI", price: null, image: "https://via.placeholder.com/60" },
    { id: 349, name: "Soro fisiologico 100 ml Uniphar", price: null, image: "https://via.placeholder.com/60" },
    { id: 350, name: "Soro fisiologico 250 ml Uniphar", price: null, image: "https://via.placeholder.com/60" },
    { id: 351, name: "Soro fisiologico 500 ml Uniphar", price: null, image: "https://via.placeholder.com/60" },
    { id: 352, name: "Termômetro Digital de Testa - BIOLAND", price: null, image: "https://via.placeholder.com/60" },
    { id: 353, name: "Termometro Digital - BIOLAND", price: null, image: "https://via.placeholder.com/60" },
    { id: 354, name: "KIT CABELO E CORPO KIDS", price: 23.90, image: "https://via.placeholder.com/60" }
];

const promotions = [
    [45, 79.90], [140, 119.90], [43, 149.90],
    [1001, 89.90, "Inalador e Compressor Bioland (adultos e crianças)"],
    [1002, 275.00, "Protetor Labial Vedis Calêndula (Caixa com 50 unidades)", 5.50],
    [283, 22.90, "KIT CAPILAR BEBELO (Shampoo, Condicionador, Mascara e Spray)", 23.90],
    [284, 7.39], [1003, 5.50, "Promoção das pomadas (Caixa com 12 unidades)"], [170, 89.90],
    [291, 6.50], [286, 7.99], [248, 130.00, "Seringa de insulina de 1ml Medix com agulha 0,33x1,27 (Caixa com 100 unidades)"],
    [1004, 149.90, "Seringa de insulina Sol-M 50UI com agulha 8mm x 0,3mm (Caixa com 100 unidades)"],
    [1005, 59.90, "Seringa para insulina 1ml com agulha 13 x 0,45mm (Unidade)"], [287, 5.99],
    [1006, 149.90, "Seringa de insulina 1ml com agulha 8x0,30mm Tkl (Caixa com 100 unidades)"], [118, 29.90],
    [252, 1.59], [266, 399.00], [265, 499.00], [117, 22.90],
    [154, 22.90, "Luvas latex de procedimento c/100 com pó (Marca: Talge)", 23.90],
    [158, 24.90, "Luva p/ Procedimento - Nitrilo - Black", 27.90],
    [1008, 24.90, "Luva nitrílica rosa Talge (Tamanho P - Caixa com 100 unidades)"], [306, 31.99],
    [217, 139.90], [216, 139.90], [72, 18.90], [139, 109.90], [42, 109.90],
    [1009, 59.90, "Seringa de insulina de 1ml Tkl com agulha 0,45x13mm / 26G (Caixa com 100 unidades)"],
    [123, 23.90], [205, 59.90], [1010, 129.90, "Seringa de insulina SR de 0,5ml com agulha 0,25x6mm (Caixa com 100 unidades)"],
    [259, 2.49], [260, 3.89], [233, 11.90], [261, 4.99],
    [1011, 8.99, "Soro Fisiológico 0,9% 1000ml Lbs"], [1012, 9.99, "Talco Mentolado LBS (30g)"],
    [1013, 149.90, "Seringa de insulina SR de 1ml com agulha 0,25x0,6 (Caixa com 100 unidades - SR)"],
    [141, 99.90], [301, 3.30], [1014, 13.90, "Luvas de Vinil Vabene (Tamanho P - Caixa com 100 unidades)"], [325, 4.50],
    [344, 9.90], [322, 3.90], [321, 3.90], [320, 3.90], [318, 3.90], [327, 4.50], [317, 3.90],
    [319, 3.90], [323, 3.90], [331, 5.50], [330, 5.50], [316, 3.90], [334, 5.50], [333, 5.50],
    [332, 5.50], [328, 4.50], [329, 4.50], [324, 4.50], [303, 15.90], [302, 9.90], [336, 4.90],
    [282, 21.90], [295, 6.50], [342, 14.90], [335, 5.50], [326, 4.50]
].map(([productId, promoPrice, name, originalPrice]) => ({ productId, promoPrice, name, originalPrice }));

promotions.forEach(promotion => {
    const product = products.find(item => item.id === promotion.productId);
    if (product) {
        promotion.originalPrice = promotion.originalPrice ?? product.price;
        product.promoPrice = promotion.promoPrice;
        return;
    }

    products.push({
        id: promotion.productId,
        name: promotion.name,
        price: promotion.originalPrice ?? promotion.promoPrice,
        promoPrice: promotion.promoPrice,
        image: "https://via.placeholder.com/60"
    });
    promotion.originalPrice = promotion.originalPrice ?? promotion.promoPrice;
});

const duplicateBebeloProductIds = new Set([1000]);
products.splice(0, products.length, ...products.filter(product => {
    const name = (product.name || '').toLocaleLowerCase();
    return !duplicateBebeloProductIds.has(product.id) && !name.includes('bebeloo');
}));

const condicoesPagamento = [
    { nome: "Pix", boletos: 1 },
    { nome: "7", boletos: 1 },
    { nome: "14", boletos: 1 },
    { nome: "21", boletos: 1 },
    { nome: "28", boletos: 1 },
    { nome: "35", boletos: 1 },
    { nome: "7/14", boletos: 2 },
    { nome: "14/21", boletos: 2 },
    { nome: "21/28", boletos: 2 },
    { nome: "28/35", boletos: 2 },
    { nome: "7/14/21", boletos: 3 },
    { nome: "14/21/28", boletos: 3 },
    { nome: "21/28/35", boletos: 3 },
    { nome: "7/14/21/28", boletos: 4 },
    { nome: "14/21/28/35", boletos: 4 }
];

const whatsappDestinatarios = {
    padrao: '5541995922369',
    vanderson: '5541988604367'
};

const productVariants = {
    65: { label: 'Cor', options: ['Preto', 'Azul', 'Verde', 'Amarelo', 'Rosa'] },
    66: { label: 'Cor', options: ['Preta', 'Lilás', 'Azul', 'Rosa', 'Bege'] },
    82: { label: 'Tamanho', options: ['14', '16', '18', '20', '22', '24'] },
    113: { label: 'Tamanho', options: ['M', 'G'] },
    119: { label: 'Cor', options: ['Preto', 'Rosa', 'Verde', 'Vermelho'] },
    169: { label: 'Sabor', options: [], allowCustom: true, customLabel: 'Digite o sabor' },
    153: { label: 'Tamanho', options: ['PP', 'P', 'M', 'G'] },
    154: { label: 'Tamanho', options: ['PP', 'P', 'M', 'G'] },
    158: { label: 'Tamanho', options: ['P', 'M', 'G'] },
    161: { label: 'Tamanho', options: ['PP', 'P', 'M', 'G'] },
    162: { label: 'Tamanho', options: ['PP', 'P', 'M', 'G'] },
    163: { label: 'Tamanho', options: ['PP', 'P', 'M', 'G'] },
    194: { label: 'Tamanho', options: ['P', 'M', 'G', 'GG'] },
    282: { label: 'Linha', options: ['B-Tox', 'Liso c/ Força', 'Ameixa Negra', 'Cacheamos', 'Loiro Perfeito', 'Ômega 3', 'Nutrecôco', 'Cavalo de Raça', 'Chuva de Verniz', 'Descansa Cabelo', 'Mandioca', 'Óleo de Argan', 'Hialurônico'] },
    283: { label: 'Aroma', options: ['Tutti Frutti', 'Uva', 'Melancia', 'Banana'] },
    295: { label: 'Aroma', options: ['Belle Rose', 'Ameixa', 'Vanilla', 'Morango c/ Champagne'] },
    296: { label: 'Aroma', options: ['Delicada', 'Algodão Doce', 'Morango & Chantilly', 'Cereja', 'Flores Delicadas', 'Rosa Mosqueta', 'Kit/Variados'] },
    297: { label: 'Aroma', options: ['Maracujá / Erva Doce', 'Frutas Vermelhas'] },
    300: { label: 'Aroma', options: ['Uva', 'Tutti-Frutti'] },
    316: { label: 'Aroma', options: ['Cereja', 'Amora', 'Barbatimão e Flor de Algodão', 'Pétalas de Rosas', 'Roma e Aroeira', 'Rosa Mosqueta', 'Vanilla', 'Pêssego'] },
    354: { label: 'Tipo', options: ['Shampoo', 'Condicionador', 'Sabonete líquido', 'Colônia'] },
    1000: { label: 'Aroma', options: ['Uva', 'Tutti-frutti', 'Melancia', 'Banana'] },
    341: { label: 'Aroma', options: ['Ameixa Negra', 'Vinagre de Maçã', 'Ômega'], allowCustom: true, customLabel: 'Digite outro aroma' },
    335: { label: 'Opção', options: [], allowCustom: true, customLabel: 'Digite a opção' }
};

const mergedIntimateDeodorantIds = new Set([330, 331, 332, 333, 334, 335]);
const mergedIntimateGelIds = new Set([317, 318, 319, 320, 321, 322, 323]);
const mergedProductIds = new Set([...mergedIntimateDeodorantIds, ...mergedIntimateGelIds]);
const excludedSoapIds = new Set([324, 325, 326, 327, 328, 329]);
const hiddenCatalogProductIds = new Set([...mergedProductIds, ...excludedSoapIds, 155, 156, 157, 1000]);

function getWhatsAppDestinatario() {
    const destino = new URLSearchParams(window.location.search).get('destino');
    return whatsappDestinatarios[destino] || whatsappDestinatarios.padrao;
}

const appInstallBannerEl = document.getElementById('app-install-banner');
let deferredInstallPrompt = null;
const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;

function showInstallNotification() {
    if (!appInstallBannerEl) return;
    appInstallBannerEl.hidden = false;

    const installManualText = isIOS
        ? 'No iPhone/iPad: toque no botão de compartilhar e escolha “Adicionar à Tela de Início”.'
        : 'No computador: use o menu do navegador e escolha “Instalar” ou “Adicionar à área de trabalho”.';

    const copyEl = appInstallBannerEl.querySelector('.app-install-copy span');
    if (copyEl) copyEl.textContent = installManualText;
}

if ('beforeinstallprompt' in window) {
    window.addEventListener('beforeinstallprompt', event => {
        event.preventDefault();
        deferredInstallPrompt = event;
        showInstallNotification();
    });
}

window.addEventListener('appinstalled', () => {
    if (appInstallBannerEl) appInstallBannerEl.hidden = true;
});

if (!isStandalone && appInstallBannerEl) {
    showInstallNotification();
}

const productListEl = document.getElementById('product-list');
const totalValEl = document.getElementById('total-val');
const minWarningEl = document.getElementById('min-warning');
const cnpjEl = document.getElementById('cnpj');
const condicaoPagamentoEl = document.getElementById('condicao-pagamento');
const checkoutBoxEl = document.querySelector('.checkout-box');
const productSearchEl = document.getElementById('product-search');
const productCountEl = document.getElementById('product-count');
const productSortEl = document.getElementById('product-sort');
const categoryFilterEls = document.querySelectorAll('.category-filter');
const catalogTitleEl = document.getElementById('catalog-title');
const openPromotionsButtonEl = document.getElementById('open-promotions-button');
const backToCatalogButtonEl = document.getElementById('back-to-catalog-button');
let activeCategory = 'todos';
let activeSort = 'name-asc';
let promotionsOnly = false;
const orderPanelEl = document.getElementById('order-panel');
const orderItemsEl = document.getElementById('order-items');
const orderItemCountEl = document.getElementById('order-item-count');
const orderTotalEl = document.getElementById('order-total');
const selectedCountEl = document.getElementById('selected-count');
const viewOrderButtonEl = document.getElementById('view-order-button');
const floatingOrderBarEl = document.getElementById('floating-order-bar');
const floatingTotalEl = document.getElementById('floating-total');
const selectedUnitsEl = document.getElementById('selected-units');
const productDetailPanelEl = document.getElementById('product-detail-panel');
const productDetailTitleEl = document.getElementById('product-detail-title');
const productDetailDescriptionEl = document.getElementById('product-detail-description');
const productDetailPriceEl = document.getElementById('product-detail-price');
const productDetailVariantsEl = document.getElementById('product-detail-variants');
const productDetailQuantityEl = document.getElementById('product-detail-quantity');
const addProductButtonEl = document.getElementById('add-product-button');
let activeProductId = null;

function getProductVariantConfig(productId) {
    return productVariants[productId] || null;
}

function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, character => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    }[character]));
}

function encodeVariantOption(option) {
    return encodeURIComponent(option).replace(/'/g, '%27');
}

function getSavedVariants() {
    const savedVariants = JSON.parse(localStorage.getItem('saved_variants')) || {};
    const savedQuantities = JSON.parse(localStorage.getItem('saved_quantities')) || {};
    const legacyOptions = { 330: 'Cereja', 331: 'Morango & Chantilly', 332: 'Flores Delicadas', 333: 'Rosa Mosqueta', 334: 'Algodão Doce', 335: 'Kit/Variados' };
    const legacyGelOptions = { 317: 'Amora', 318: 'Barbatimão e Flor de Algodão', 319: 'Pétalas de Rosas', 320: 'Roma e Aroeira', 321: 'Rosa Mosqueta', 322: 'Vanilla', 323: 'Pêssego' };
    let migrated = false;

    Object.entries(legacyOptions).forEach(([productId, option]) => {
        const quantity = Math.max(0, Number(savedQuantities[productId]) || 0);
        if (quantity > 0) {
            savedVariants[296] = savedVariants[296] || {};
            savedVariants[296][option] = (Number(savedVariants[296][option]) || 0) + quantity;
            delete savedQuantities[productId];
            migrated = true;
        }
    });

    Object.entries(legacyGelOptions).forEach(([productId, option]) => {
        const quantity = Math.max(0, Number(savedQuantities[productId]) || 0);
        if (quantity > 0) {
            savedVariants[316] = savedVariants[316] || {};
            savedVariants[316][option] = (Number(savedVariants[316][option]) || 0) + quantity;
            delete savedQuantities[productId];
            migrated = true;
        }
    });

    if (migrated) {
        localStorage.setItem('saved_variants', JSON.stringify(savedVariants));
        localStorage.setItem('saved_quantities', JSON.stringify(savedQuantities));
    }

    return savedVariants;
}

function getVariantQuantity(productId, option) {
    const savedVariants = getSavedVariants();
    return Math.max(0, Number(savedVariants[productId]?.[option]) || 0);
}

function getProductQuantity(productId, savedQuantities = getSavedQuantities()) {
    const variantConfig = getProductVariantConfig(productId);
    if (!variantConfig) return Math.max(0, Number(savedQuantities[productId]) || 0);
    const savedVariants = getSavedVariants();
    return Object.values(savedVariants[productId] || {}).reduce((total, quantity) => total + Math.max(0, Number(quantity) || 0), 0);
}

function atualizarAlturaCheckout() {
    if (!checkoutBoxEl) return;
    document.documentElement.style.setProperty('--checkout-height', `${checkoutBoxEl.offsetHeight}px`);
}

if (checkoutBoxEl && 'ResizeObserver' in window) {
    new ResizeObserver(atualizarAlturaCheckout).observe(checkoutBoxEl);
}

function getProductDescription(product) {
    const name = product.name.toLocaleLowerCase();
    if (/sabonete|desodorante íntimo/.test(name)) return 'Produto de higiene e cuidado pessoal para uso diário. Confira a fragrância e a apresentação no nome do item.';
    if (/capilar|shampoo|condicionante|mary life|bio instinto|body splash|óleo|oleo|manteiga|creme/.test(name)) return 'Produto para cuidados pessoais, com apresentação e características descritas no nome do item.';
    if (/podox|pés|pedicure|podologia/.test(name)) return 'Produto para cuidados dos pés e rotina de podologia profissional.';
    return 'Produto disponível para pedido no catálogo Varejinho. Consulte a apresentação indicada no nome do item.';
}

function formatMoney(value) {
    return value == null ? 'Sem estoque' : new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

function formatProductPrice(price) {
    return price == null ? 'Sem estoque' : `R$ ${price.toFixed(2).replace('.', ',')}`;
}

function getProductPrice(product, quantity = 0) {
    if (product.id === 306) return quantity >= 24 ? 31.99 : 33.99;
    return product.promoPrice ?? product.price;
}

function formatVisibleProductPrice(product, quantity = 0) {
    if (product.promoPrice != null && product.price != null && product.promoPrice < product.price) {
        return formatPromotionPrice(product, quantity);
    }
    return formatProductPrice(getProductPrice(product, quantity));
}

function formatPromotionPrice(product, quantity = 0) {
    const originalPrice = product.price;
    const promotionPrice = getProductPrice(product, quantity);
    if (promotionPrice == null) return formatProductPrice(originalPrice);
    const quantityNote = product.id === 306 ? '<small class="promotion-note">R$ 31,99 a partir de 24 un.</small>' : '';
    if (originalPrice == null || originalPrice <= promotionPrice) return `<strong class="promo-price">${formatProductPrice(promotionPrice)}</strong>${quantityNote}`;
    return `<del class="original-price">${formatProductPrice(originalPrice)}</del><strong class="promo-price">${formatProductPrice(promotionPrice)}</strong>${quantityNote}`;
}

function getPromotionNotice(product) {
    return product.id === 306 ? '<span class="promotion-notice">Compre 24 ou mais e ganhe desconto: R$ 31,99 cada.</span>' : '';
}

function getSavedQuantities() {
    const savedQuantities = JSON.parse(localStorage.getItem('saved_quantities')) || {};
    const unavailableIds = new Set(products.filter(product => product.price == null).map(product => String(product.id)));
    let changed = false;

    unavailableIds.forEach(productId => {
        if (savedQuantities[productId] !== undefined) {
            delete savedQuantities[productId];
            changed = true;
        }
    });

    excludedSoapIds.forEach(productId => {
        if (savedQuantities[productId] !== undefined) {
            delete savedQuantities[productId];
            changed = true;
        }
    });

    if (changed) localStorage.setItem('saved_quantities', JSON.stringify(savedQuantities));
    return savedQuantities;
}

function getSelectedProducts() {
    const savedQuantities = getSavedQuantities();
    const savedVariants = getSavedVariants();

    return products.filter(product => !hiddenCatalogProductIds.has(product.id)).flatMap(product => {
        if (product.price == null) return [];
        const variantConfig = getProductVariantConfig(product.id);
        if (variantConfig) {
            const variantOptions = [...new Set([...variantConfig.options, ...Object.keys(savedVariants[product.id] || {})])];
            return variantOptions
                .filter(option => Number(savedVariants[product.id]?.[option]) > 0)
                .map(option => ({
                    ...product,
                    variant: option,
                    variantLabel: variantConfig.label,
                    quantity: Number(savedVariants[product.id][option]),
                    currentPrice: getProductPrice(product, Number(savedVariants[product.id][option]))
                }));
        }
        const quantity = Number(savedQuantities[product.id]) || 0;
        return quantity > 0 ? [{ ...product, quantity, currentPrice: getProductPrice(product, quantity) }] : [];
    });
}

function mascaraCNPJ(input) {
    let valor = input.value.replace(/\D/g, ''); 
    if (valor.length > 14) valor = valor.substring(0, 14);

    if (valor.length <= 2) {
        input.value = valor;
    } else if (valor.length <= 5) {
        input.value = valor.replace(/^(\d{2})(\d+)/, "$1.$2");
    } else if (valor.length <= 8) {
        input.value = valor.replace(/^(\d{2})(\d{3})(\d+)/, "$1.$2.$3");
    } else if (valor.length <= 12) {
        input.value = valor.replace(/^(\d{2})(\d{3})(\d{3})(\d+)/, "$1.$2.$3/$4");
    } else {
        input.value = valor.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
    }
    localStorage.setItem('saved_cnpj', input.value);
}

function validarCNPJ(cnpj) {
    cnpj = cnpj.replace(/[^\d]+/g,'');
    if (cnpj.length !== 14) return false;
    if (/^([0-9])\1+$/.test(cnpj)) return false;

    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    let digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;
    
    for (let i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2) pos = 9;
    }
    let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado != digitos.charAt(0)) return false;
       
    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (let i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2) pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado != digitos.charAt(1)) return false;
       
    return true;
}

function productMatchesCategory(product, category) {
    if (category === 'todos') return true;

    const name = product.name.toLocaleLowerCase();
    const brandCategories = {
        catarinense: name.includes('catarinense'),
        cosmeticos: /mary life|bio instinto|shampoo|condicionante|capilar|hidratante|desodorante|sabonete|óleo de coco|oleo de coco|pomada massageadora|protetor labial|body splash|manteiga de cacau|sebo de carneiro|podox|pés/.test(name),
    };

    return brandCategories[category] || false;
}

function normalizeSearchText(text) {
    return text
        .toLocaleLowerCase('pt-BR')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]/g, '');
}

function normalizeSearchWords(text) {
    return text
        .toLocaleLowerCase('pt-BR')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .split(/[^a-z0-9]+/)
        .filter(Boolean);
}

function renderProducts(searchTerm = '') {
    productListEl.innerHTML = '';
    const savedQuantities = getSavedQuantities();
    const savedCnpj = localStorage.getItem('saved_cnpj');
    const normalizedSearch = normalizeSearchText(searchTerm);
    const searchWords = normalizeSearchWords(searchTerm);
    const visibleProducts = (promotionsOnly ? promotions.map(promotion => {
        const product = products.find(item => item.id === promotion.productId);
        return product ? { ...product, promotionName: promotion.name || product.name } : null;
    }).filter(Boolean) : products)
        .filter(product => !hiddenCatalogProductIds.has(product.id))
        .filter(product => {
            const normalizedName = normalizeSearchText(product.name);
            const matchesSearch = normalizedName.includes(normalizedSearch) || searchWords.every(word => normalizedName.includes(word));
            return matchesSearch && (promotionsOnly || productMatchesCategory(product, activeCategory));
        })
        .sort((productA, productB) => {
            if (activeSort === 'price-asc') return (productA.price ?? Infinity) - (productB.price ?? Infinity) || productA.name.localeCompare(productB.name, 'pt-BR');
            return productA.name.localeCompare(productB.name, 'pt-BR');
        });

    if (savedCnpj && cnpjEl) cnpjEl.value = savedCnpj;

    if (productCountEl) {
        productCountEl.innerText = `${visibleProducts.length} ${visibleProducts.length === 1 ? 'item' : 'itens'}`;
    }

    if (catalogTitleEl) catalogTitleEl.innerText = promotionsOnly ? 'Ofertas por tempo limitado' : 'Encontre o que precisa';
    if (backToCatalogButtonEl) backToCatalogButtonEl.hidden = !promotionsOnly;

    if (visibleProducts.length === 0) {
        productListEl.innerHTML = '<div class="empty-state"><strong>Nenhum produto encontrado.</strong><br>Experimente buscar por outro nome ou marca.</div>';
        calculateTotal();
        return;
    }

    visibleProducts.forEach(product => {
        const isUnavailable = product.price == null;
        const isPromotion = product.promoPrice != null;
        const variantConfig = getProductVariantConfig(product.id);
        const savedQty = getProductQuantity(product.id, savedQuantities);
        const card = document.createElement('div');
        card.className = `product-card${isUnavailable ? ' product-card--unavailable' : ''}${isPromotion ? ' product-card--promotion' : ''}`;
        card.dataset.productId = product.id;
        card.addEventListener('click', event => {
            if (isUnavailable || event.target.closest('.product-controls')) return;
            abrirDetalhesProduto(product.id);
        });
        card.innerHTML = `
            <div class="product-info">
                <div class="product-name">${product.promotionName || product.name}</div>
                <div class="product-price">${formatVisibleProductPrice(product, savedQty)}</div>
                ${getPromotionNotice(product)}
            </div>
            ${isUnavailable ? '<div class="stock-status">Sem estoque</div>' : variantConfig ? `<div class="product-controls">
                <button type="button" class="variant-choice-button" onclick="abrirDetalhesProduto(${product.id})">Escolher opções${savedQty ? ` (${savedQty})` : ''}</button>
            </div>` : `<div class="product-controls">
                <label for="qty-${product.id}" style="font-size:0.9rem; color:#666;">Qtd:</label>
                <div class="quantity-stepper">
                    <button type="button" class="quantity-button" onclick="alterarQuantidadePedido(${product.id}, -1)" aria-label="Diminuir quantidade">−</button>
                    <input type="number" id="qty-${product.id}" min="0" value="${savedQty}" onchange="salvarEAtualizar(${product.id})" onkeyup="salvarEAtualizar(${product.id})" aria-label="Quantidade de ${product.name}">
                    <button type="button" class="quantity-button" onclick="alterarQuantidadePedido(${product.id}, 1)" aria-label="Aumentar quantidade">+</button>
                </div>
            </div>`}
        `;
        productListEl.appendChild(card);
    });

    calculateTotal();
}

function atualizarPrecoExibido(productId, quantity) {
    const product = products.find(item => item.id === productId);
    const card = document.querySelector(`[data-product-id="${productId}"] .product-price`);
    if (!product || !card) return;
    card.innerHTML = formatVisibleProductPrice(product, quantity);
}

function abrirDetalhesProduto(productId) {
    const product = products.find(item => item.id === productId);
    if (!product || product.price == null) return;

    activeProductId = productId;
    const savedQuantities = getSavedQuantities();
    const variantConfig = getProductVariantConfig(productId);
    const savedVariantOptions = variantConfig ? Object.keys(getSavedVariants()[productId] || {}) : [];
    productDetailTitleEl.innerText = product.name;
    productDetailDescriptionEl.innerText = getProductDescription(product);
    const detailQuantity = Math.max(1, Number(savedQuantities[productId]) || 1);
    productDetailPriceEl.innerHTML = `${formatVisibleProductPrice(product, detailQuantity)}${getPromotionNotice(product)}`;
    productDetailQuantityEl.value = Math.max(1, Number(savedQuantities[productId]) || 1);
    document.getElementById('detail-quantity-controls').hidden = Boolean(variantConfig);
    if (productDetailVariantsEl) {
        productDetailVariantsEl.hidden = !variantConfig;
        productDetailVariantsEl.innerHTML = variantConfig ? `
            <div class="variant-heading"><strong>Escolha ${variantConfig.label.toLocaleLowerCase()} e quantidade</strong><span>Você pode combinar opções</span></div>
            <div class="variant-list">
                ${[...new Set([...variantConfig.options, ...savedVariantOptions])].map(option => `
                    <label class="variant-row">
                        <span>${escapeHtml(option)}</span>
                        <input type="number" min="0" value="${getVariantQuantity(productId, option)}" data-variant-option="${escapeHtml(option)}" aria-label="Quantidade ${escapeHtml(option)}">
                    </label>
                `).join('')}
                ${variantConfig.allowCustom ? `
                    <label class="variant-custom-row">
                        <input type="text" data-variant-custom-name placeholder="${variantConfig.customLabel}" aria-label="${variantConfig.customLabel}">
                        <input type="number" min="0" value="0" data-variant-custom-quantity aria-label="Quantidade da opção personalizada">
                    </label>
                ` : ''}
            </div>
        ` : '';
    }
    productDetailPanelEl.classList.add('is-open');
    productDetailPanelEl.setAttribute('aria-hidden', 'false');
}

function fecharDetalhesProduto() {
    productDetailPanelEl.classList.remove('is-open');
    productDetailPanelEl.setAttribute('aria-hidden', 'true');
    activeProductId = null;
}

function alterarQuantidadeDetalhe(variation) {
    const currentQuantity = Math.max(1, Number(productDetailQuantityEl.value) || 1);
    const nextQuantity = Math.max(1, currentQuantity + variation);
    productDetailQuantityEl.value = nextQuantity;
    const product = products.find(item => item.id === activeProductId);
    if (product) {
        productDetailPriceEl.innerHTML = `${promotionsOnly ? formatPromotionPrice(product, nextQuantity) : formatProductPrice(getProductPrice(product, nextQuantity))}${getPromotionNotice(product)}`;
    }
}

function adicionarProdutoDetalhes() {
    if (!activeProductId) return;
    const product = products.find(item => item.id === activeProductId);
    if (!product || product.price == null) return;
    const variantConfig = getProductVariantConfig(activeProductId);
    const savedQuantities = getSavedQuantities();
    if (variantConfig) {
        const selectedVariants = {};
        productDetailVariantsEl.querySelectorAll('[data-variant-option]').forEach(input => {
            const quantity = Math.max(0, parseInt(input.value, 10) || 0);
            input.value = quantity;
            if (quantity > 0) selectedVariants[input.dataset.variantOption] = quantity;
        });
        const customNameInput = productDetailVariantsEl.querySelector('[data-variant-custom-name]');
        const customQuantityInput = productDetailVariantsEl.querySelector('[data-variant-custom-quantity]');
        const customName = customNameInput?.value.trim();
        const customQuantity = Math.max(0, parseInt(customQuantityInput?.value, 10) || 0);
        if (customName && customQuantity > 0) selectedVariants[customName] = customQuantity;
        if (Object.keys(selectedVariants).length === 0) {
            alert(`Informe a quantidade de pelo menos uma opção de ${variantConfig.label.toLocaleLowerCase()}.`);
            return;
        }
        const savedVariants = getSavedVariants();
        savedVariants[activeProductId] = selectedVariants;
        localStorage.setItem('saved_variants', JSON.stringify(savedVariants));
    } else {
        const quantity = Math.max(1, parseInt(productDetailQuantityEl.value, 10) || 1);
        savedQuantities[activeProductId] = quantity;
    }
    localStorage.setItem('saved_quantities', JSON.stringify(savedQuantities));
    renderProducts(productSearchEl ? productSearchEl.value : '');
    fecharDetalhesProduto();
}

function salvarEAtualizar(productId, inputElement) {
    const product = products.find(item => item.id === productId);
    const input = inputElement || document.getElementById(`qty-${productId}`);
    if (!product || product.price == null) return;
    let savedQuantities = JSON.parse(localStorage.getItem('saved_quantities')) || {};
    const quantity = Math.max(0, parseInt(input.value, 10) || 0);
    input.value = quantity;
    savedQuantities[productId] = quantity;
    localStorage.setItem('saved_quantities', JSON.stringify(savedQuantities));
    atualizarPrecoExibido(productId, quantity);
    calculateTotal();
    renderOrderSummary();
}

function alterarQuantidadePedido(productId, variation) {
    const product = products.find(item => item.id === productId);
    if (!product || product.price == null) return;
    if (getProductVariantConfig(productId)) {
        abrirDetalhesProduto(productId);
        return;
    }
    const savedQuantities = getSavedQuantities();
    const currentQuantity = Math.max(0, Number(savedQuantities[productId]) || 0);
    const nextQuantity = Math.max(0, currentQuantity + variation);
    savedQuantities[productId] = nextQuantity;
    localStorage.setItem('saved_quantities', JSON.stringify(savedQuantities));

    const catalogInput = document.getElementById(`qty-${productId}`);
    if (catalogInput) catalogInput.value = nextQuantity;
    atualizarPrecoExibido(productId, nextQuantity);

    calculateTotal();
    renderOrderSummary();
}

function salvarVarianteEAtualizar(productId, option, input) {
    option = decodeURIComponent(option);
    const savedVariants = getSavedVariants();
    const quantity = Math.max(0, parseInt(input.value, 10) || 0);
    input.value = quantity;
    savedVariants[productId] = savedVariants[productId] || {};
    if (quantity > 0) savedVariants[productId][option] = quantity;
    else delete savedVariants[productId][option];
    localStorage.setItem('saved_variants', JSON.stringify(savedVariants));
    renderProducts(productSearchEl ? productSearchEl.value : '');
    calculateTotal();
}

function alterarQuantidadeVariante(productId, option, variation) {
    option = decodeURIComponent(option);
    const nextQuantity = Math.max(0, getVariantQuantity(productId, option) + variation);
    const savedVariants = getSavedVariants();
    savedVariants[productId] = savedVariants[productId] || {};
    if (nextQuantity > 0) savedVariants[productId][option] = nextQuantity;
    else delete savedVariants[productId][option];
    localStorage.setItem('saved_variants', JSON.stringify(savedVariants));
    calculateTotal();
    renderOrderSummary();
}

function renderOrderSummary() {
    const selectedProducts = getSelectedProducts();
    const totalUnits = selectedProducts.reduce((sum, product) => sum + product.quantity, 0);

    if (selectedCountEl) selectedCountEl.innerText = selectedProducts.length;
    if (orderItemCountEl) {
        orderItemCountEl.innerText = `${selectedProducts.length} ${selectedProducts.length === 1 ? 'item' : 'itens'} selecionado${selectedProducts.length === 1 ? '' : 's'} · ${totalUnits} ${totalUnits === 1 ? 'unidade' : 'unidades'}`;
    }
    if (orderTotalEl) {
        const orderTotal = selectedProducts.reduce((sum, product) => sum + product.quantity * (product.currentPrice ?? 0), 0);
        orderTotalEl.innerText = orderTotal.toFixed(2).replace('.', ',');
    }

    if (!orderItemsEl) return;
    if (selectedProducts.length === 0) {
        orderItemsEl.innerHTML = '<div class="order-empty">Nenhum item selecionado ainda.<br>Volte ao catálogo e escolha os produtos do pedido.</div>';
        return;
    }

    orderItemsEl.innerHTML = selectedProducts.map(product => {
        const hasPromo = product.promoPrice != null && product.price != null && product.promoPrice < product.price;
        const promoLabel = hasPromo
            ? `Preço unit.: <span class="order-price-current">${formatProductPrice(product.promoPrice)}</span> <span class="order-price-old">${formatProductPrice(product.price)}</span>`
            : `Preço unit.: ${formatProductPrice(product.currentPrice ?? product.price)}`;

        return `
        <article class="order-item">
            <div class="order-item-info">
                <strong>${product.name}${product.variant ? ` <small>${escapeHtml(product.variantLabel)}: ${escapeHtml(product.variant)}</small>` : ''}</strong>
                <span>${promoLabel}</span>
                <span>Subtotal: ${formatProductPrice(product.currentPrice == null ? null : product.quantity * product.currentPrice)}</span>
            </div>
            <div class="quantity-stepper" aria-label="Quantidade de ${product.name}">
                <button type="button" class="quantity-button" onclick="${product.variant ? `alterarQuantidadeVariante(${product.id}, '${encodeVariantOption(product.variant)}', -1)` : `alterarQuantidadePedido(${product.id}, -1)`}" aria-label="Diminuir quantidade">−</button>
                <input type="number" min="0" value="${product.quantity}" onchange="${product.variant ? `salvarVarianteEAtualizar(${product.id}, '${encodeVariantOption(product.variant)}', this)` : `salvarEAtualizar(${product.id}, this)`}" aria-label="Quantidade de ${product.name}${product.variant ? ` ${product.variant}` : ''}">
                <button type="button" class="quantity-button" onclick="${product.variant ? `alterarQuantidadeVariante(${product.id}, '${encodeVariantOption(product.variant)}', 1)` : `alterarQuantidadePedido(${product.id}, 1)`}" aria-label="Aumentar quantidade">+</button>
            </div>
        </article>
    `;
    }).join('');
}

function limparPedido() {
    const keysToClear = ['saved_quantities', 'saved_variants', 'saved_pagamento'];
    keysToClear.forEach(key => localStorage.removeItem(key));
    renderProducts(productSearchEl ? productSearchEl.value : '');
    calculateTotal();
}

function abrirPedido() {
    renderOrderSummary();
    orderPanelEl.classList.add('is-open');
    orderPanelEl.setAttribute('aria-hidden', 'false');
    document.body.classList.add('order-is-open');
    calculateTotal();
}

function fecharPedido() {
    orderPanelEl.classList.remove('is-open');
    orderPanelEl.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('order-is-open');
    calculateTotal();
}

function atualizarOpcoesPagamento(total) {
    const savedPagamento = localStorage.getItem('saved_pagamento');
    condicaoPagamentoEl.innerHTML = '';

    const qtdBoletosPermitidos = Math.floor(total / 250);

    if (qtdBoletosPermitidos < 1) {
        const opt = document.createElement('option');
        opt.value = "";
        opt.innerText = "Atingir mínimo de R$ 250,00 para liberar opções";
        condicaoPagamentoEl.appendChild(opt);
        return;
    }

    const opcoesDisponiveis = condicoesPagamento.filter(op => op.boletos <= qtdBoletosPermitidos);

    if (opcoesDisponiveis.length === 0) {
        const opt = document.createElement('option');
        opt.value = "";
        opt.innerText = "Nenhuma opção disponível para este valor";
        condicaoPagamentoEl.appendChild(opt);
        return;
    }

    opcoesDisponiveis.forEach(op => {
        const option = document.createElement('option');
        option.value = op.nome;
        option.innerText = op.nome;
        if (savedPagamento === op.nome) {
            option.selected = true;
        }
        condicaoPagamentoEl.appendChild(option);
    });

    localStorage.setItem('saved_pagamento', condicaoPagamentoEl.value);
}

if (condicaoPagamentoEl) {
    condicaoPagamentoEl.addEventListener('change', () => {
        localStorage.setItem('saved_pagamento', condicaoPagamentoEl.value);
    });
}

if (productSearchEl) {
    productSearchEl.addEventListener('input', () => renderProducts(productSearchEl.value));
}

function abrirPromocoes() {
    promotionsOnly = true;
    activeCategory = 'todos';
    if (productSearchEl) productSearchEl.value = '';
    categoryFilterEls.forEach(button => button.classList.toggle('is-active', button.dataset.category === 'todos'));
    renderProducts();
    document.querySelector('.catalog-toolbar')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function fecharPromocoes() {
    promotionsOnly = false;
    if (productSearchEl) productSearchEl.value = '';
    renderProducts();
}

if (openPromotionsButtonEl) openPromotionsButtonEl.addEventListener('click', abrirPromocoes);
if (backToCatalogButtonEl) backToCatalogButtonEl.addEventListener('click', fecharPromocoes);

if (productSortEl) {
    productSortEl.addEventListener('change', () => {
        activeSort = productSortEl.value;
        renderProducts(productSearchEl ? productSearchEl.value : '');
    });
}

categoryFilterEls.forEach(filterButton => {
    filterButton.addEventListener('click', () => {
        activeCategory = filterButton.dataset.category;
        categoryFilterEls.forEach(button => button.classList.toggle('is-active', button === filterButton));
        renderProducts(productSearchEl ? productSearchEl.value : '');
    });
});

function calculateTotal() {
    const selectedProducts = getSelectedProducts();
    const total = selectedProducts.reduce((sum, product) => sum + product.quantity * (product.currentPrice ?? 0), 0);
    const itensSelecionados = selectedProducts.reduce((sum, product) => sum + product.quantity, 0);

    if (totalValEl) totalValEl.innerText = total.toFixed(2).replace('.', ',');
    if (floatingTotalEl) floatingTotalEl.innerText = total.toFixed(2).replace('.', ',');
    if (selectedUnitsEl) selectedUnitsEl.innerText = itensSelecionados;

    if (minWarningEl) {
        if (total < 250.00) {
            minWarningEl.style.display = 'block';
        } else {
            minWarningEl.style.display = 'none';
        }
    }

    const hasItems = itensSelecionados > 0;
    const isViewingOrder = orderPanelEl.classList.contains('is-open');
    checkoutBoxEl.style.display = hasItems && isViewingOrder ? 'block' : 'none';
    floatingOrderBarEl.classList.toggle('is-visible', hasItems && !isViewingOrder);

    atualizarOpcoesPagamento(total);
    renderOrderSummary();
    return total;
}

function enviarPedido() {
    const cnpjValue = cnpjEl.value.trim();
    if (!cnpjValue) {
        alert('Por favor, preencha o campo CNPJ antes de enviar o pedido.');
        cnpjEl.focus();
        return;
    }

    if (!validarCNPJ(cnpjValue)) {
        alert('O CNPJ digitado é inválido. Por favor, verifique os números.');
        cnpjEl.focus();
        return;
    }

    const total = calculateTotal();
    if (total < 250.00) {
        alert('O valor mínimo para o pedido é de R$ 250,00.');
        return;
    }

    const condicaoPagamento = condicaoPagamentoEl.value;
    if (!condicaoPagamento) {
        alert('Por favor, selecione uma condição de pagamento válida.');
        return;
    }

    let mensagem = `*NOVO PEDIDO - RUN TRAINING*\n\n*CNPJ:* ${cnpjValue}\n*Condição de Pagamento:* ${condicaoPagamento}\n\n*Itens do Pedido:*`;
    let itensCount = 0;

    getSelectedProducts().forEach(product => {
        const variantText = product.variant ? ` | ${product.variantLabel}: ${product.variant}` : '';
        const unitPrice = product.currentPrice ?? product.price ?? 0;
        const isPromotion = product.price != null && product.promoPrice != null && product.promoPrice < product.price;
        const unidadeTexto = isPromotion
            ? ` | Unit.: *${formatMoney(unitPrice)}*`
            : ` | Unit.: ${formatMoney(unitPrice)}`;
        const subtotal = formatMoney(product.quantity * unitPrice);
        mensagem += `\n• ${product.name}${variantText}${unidadeTexto} | Qtd: ${product.quantity} | Subtotal: ${subtotal}`;
        itensCount++;
    });

    if (itensCount === 0) {
        alert('Selecione pelo menos um produto para enviar o pedido.');
        return;
    }

    mensagem += `\n\n*VALOR TOTAL:* ${formatMoney(total)}`;

    const numeroWhatsApp = getWhatsAppDestinatario();
    if (!numeroWhatsApp) {
        alert('O WhatsApp deste link ainda não foi configurado.');
        return;
    }
    const url = `https://api.whatsapp.com/send?phone=${numeroWhatsApp}&text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');
    limparPedido();
}

if (viewOrderButtonEl) viewOrderButtonEl.addEventListener('click', abrirPedido);

document.getElementById('desktop-download-button')?.addEventListener('click', () => {
    const html = `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Run Training - Catálogo de pedidos</title></head><body>${document.body.innerHTML}</body></html>`;
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'run-training-catalogo.html';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
});

document.querySelectorAll('[data-close-order]').forEach(element => {
    element.addEventListener('click', fecharPedido);
});
document.querySelectorAll('[data-close-product]').forEach(element => {
    element.addEventListener('click', fecharDetalhesProduto);
});
document.getElementById('detail-decrease').addEventListener('click', () => alterarQuantidadeDetalhe(-1));
document.getElementById('detail-increase').addEventListener('click', () => alterarQuantidadeDetalhe(1));
addProductButtonEl.addEventListener('click', adicionarProdutoDetalhes);

document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && orderPanelEl.classList.contains('is-open')) fecharPedido();
    if (event.key === 'Escape' && productDetailPanelEl.classList.contains('is-open')) fecharDetalhesProduto();
});

renderProducts();
renderOrderSummary();