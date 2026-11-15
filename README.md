# Landing page GPSLOG

Landing page comercial da GPSLOG Transportes e Logística (Manaus – AM).
Site estático feito em [Astro](https://astro.build), com imagens otimizadas (AVIF/WebP), sem frameworks de interface e com JavaScript mínimo.

## Rodar localmente

```bash
npm install
npm run dev      # http://localhost:4321 (mostra o rótulo "Foto pendente" nos espaços sem foto)
npm run build    # gera o site final em dist/
npm run preview  # serve o dist/ para conferência
```

## Publicar no Netlify

1. No Netlify, escolha **Add new site > Import an existing project** e selecione este repositório.
2. O arquivo `netlify.toml` já define o build (`npm run build`) e a pasta publicada (`dist`).
3. Depois de configurar o domínio, publique de novo para atualizar as URLs canônicas e de compartilhamento.

## Onde editar

| O que | Arquivo |
| --- | --- |
| WhatsApp, Instagram, endereço, horário, slogan, áreas atendidas | `src/config/site.ts` |
| Fotos de cada espaço do site | `src/config/photos.ts` (arquivos em `src/assets/fotos/`) |
| Empresas atendidas (desligado até haver autorização) | `src/config/site.ts` → `clients.showClients` |
| Textos de cada seção | `src/components/*.astro` |
| Cores e tipografia | `src/styles/global.css` (variáveis no topo) |
| Logotipo | `public/brand/` (extraído em vetor do PDF oficial) |

### Trocar ou incluir fotos

1. Salve a foto em `src/assets/fotos/` (JPG com pelo menos 1600 px de largura).
2. Em `src/config/photos.ts`, importe o arquivo e atribua ao espaço desejado (`veiculos`, `equipe`, `transporte`, `entregas`...).
3. Os espaços sem foto exibem um bloco na identidade da marca. O build otimiza a imagem automaticamente.

### Empresas atendidas

A seção fica oculta. Depois da autorização por escrito de cada empresa, mude `showClients` para `true`, remova da lista quem não autorizou e, se houver logotipos, salve em `public/clientes/` e informe o caminho em `logo`.

## Formulário de orçamento

- Etapa única: nome, empresa (opcional) e tipo de serviço. O número do cliente chega automaticamente pelo WhatsApp, e os detalhes da operação são combinados na conversa.
- Não há servidor. Ao enviar, o site monta a mensagem e abre o WhatsApp comercial com o texto pronto. A tela final avisa que o envio só se conclui quando o visitante toca em "Enviar" no WhatsApp. O site não exibe falsa confirmação de envio.
- Links de anúncios podem pré-selecionar o serviço: `?servico=transporte`, `entregas`, `armazenagem`, `positivacao` ou `outro`.
  Exemplo: `https://SEU-DOMINIO/?servico=positivacao#orcamento`.

## Rastreamento (GA4, Google Tag Manager, Google Ads, Meta Pixel)

Nenhum ID está no código. Cadastre as variáveis em **Netlify > Site configuration > Environment variables** (modelo em `.env.example`) e publique de novo. Scripts sem ID não são carregados.

- **Recomendado:** usar apenas `PUBLIC_GTM_ID` e configurar GA4, Ads e Pixel dentro do GTM.
- Alternativa: preencher `PUBLIC_GA4_ID`, `PUBLIC_GADS_ID` (+ rótulos) e `PUBLIC_META_PIXEL_ID` diretamente.

Eventos enviados ao `dataLayer`:

| Evento | Quando | Parâmetros |
| --- | --- | --- |
| `whatsapp_click` | Clique em qualquer botão de WhatsApp | `click_location` (hero, header, flutuante, positivacao, cta-final, footer...) |
| `quote_cta_click` | Clique em "Solicitar orçamento" | `click_location`, `service` |
| `generate_lead` | Formulário enviado ao WhatsApp | `service`, `method` |

Configurados direto (sem GTM), `whatsapp_click` dispara `Contact` no Pixel e a conversão `PUBLIC_GADS_LABEL_WHATSAPP`. `generate_lead` dispara `Lead` no Pixel e a conversão `PUBLIC_GADS_LABEL_FORM`.
