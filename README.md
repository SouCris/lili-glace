# Lili & Glacê

Experiência interativa de uma marca fictícia de donuts, desenvolvida por **Cris Lopes Art** para portfólio. O projeto combina cenas animadas, vídeos responsivos e uma caixa de produtos com quantidades e subtotal.

## Executar localmente

Use Node.js 24 e npm. Na pasta do projeto:

```sh
npm ci
npm run dev
```

No PowerShell, use `npm.cmd` no lugar de `npm` se a política de execução bloquear o comando. Abra o endereço exibido pelo Vite e mantenha o terminal aberto.

```sh
npm run lint
npm run build
npm run preview
```

`build` gera os arquivos de publicação em `dist`. `preview` permite conferir essa versão localmente.

## Organização

- `src/App.tsx`: composição das cenas e estado compartilhado da caixa.
- `src/components/`: cabeçalho, rodapé e resumo do pedido.
- `src/hooks/useSceneAnimations.ts`: transições, navegação e reprodução dos vídeos.
- `src/styles/site.css`: estilos das cenas e ajustes responsivos.
- `src/data/products.ts`: sabores, imagens, descrições e preços demonstrativos.
- `src/config/contact.ts`: configuração do WhatsApp e Instagram da criadora.
- `src/utils/currency.ts`: formatação de valores em reais.
- `public/cenas/`: imagens e vídeos usados pelo site.

## Mídias

Mantenha os arquivos atuais de `public/cenas`, inclusive os vídeos gerados depois do primeiro ZIP. Os nomes diferenciam maiúsculas e minúsculas na hospedagem.

Os vídeos de corte e recheio usam `lili-cortando-donut-desktop.mp4`, `lili-cortando-donut-mobile.mp4`, `lili-recheando-desktop.mp4` e `lili-recheando-mobile.mp4`. A cobertura mobile usa `lili-cobertura-mobile.mp4`. As imagens PNG correspondentes permanecem como capas durante o carregamento.

Na primeira cena mobile, o vídeo horizontal `lili-desktop.mp4` é usado intencionalmente com o enquadramento aprovado. Não trocar automaticamente pelo vídeo vertical: a composição muda.

## Funcionamento

A primeira cena acompanha a rolagem. Os vídeos de cozinha, cobertura, corte e recheio reproduzem sem som e em loop quando ativos. Os cards do catálogo sobem na entrada da seção; depois o recorte é aberto para não esconder os controles de quantidade.

A caixa é mantida em memória e reinicia ao recarregar a página. Não há backend, cobrança, pagamento ou pedido real no modo de demonstração. Com `WHATSAPP_LOJA` vazio, a finalização mostra apenas a prévia da mensagem. Para uma loja real, configure país, DDD e número em `src/config/contact.ts`; o usuário ainda confirma o envio no WhatsApp.

## Publicação

Envie o código e as mídias de `public` ao repositório. Não envie `node_modules`, `dist` ou cópias de backup do projeto. O `.gitignore` já exclui dependências e arquivos de build.

Esta versão usa caminhos de mídia a partir da raiz (`/cenas/`). A hospedagem deve servir o site na raiz do domínio. Para GitHub Pages em um subdiretório, ainda será necessário configurar a base do Vite e os caminhos das mídias antes do deploy. O repositório e a publicação automática ainda não foram configurados.

## Validação

TypeScript, build de produção e análise estática fazem parte da revisão. Confira também as cenas no navegador desktop e no celular com todos os vídeos atuais antes de publicar; compilar não substitui essa conferência visual.

## Créditos

Design e desenvolvimento: [Cris Lopes Art](https://www.instagram.com/crislopesart/). Marca, endereço e preços fictícios. Projeto demonstrativo; não representa uma loja em operação.
