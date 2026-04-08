# Briefing — Protótipo navegável "we.wedme"

## O que é este projeto

**we.wedme** é uma plataforma brasileira de planejamento de casamentos com curadoria centralizada. O casal conta o sonho dele, a plataforma entende o estilo desejado via IA, monta uma jornada personalizada de categorias (local, fotografia, buffet, decoração, etc.) e guia o casal até a confirmação completa do casamento online — sem o casal precisar falar com nenhum profissional individualmente. Tudo é intermediado pela plataforma.

**Você vai construir um protótipo navegável dessa experiência** — focado exclusivamente na jornada do casal, do primeiro clique até o "site do casamento" gerado após a confirmação. O objetivo é demonstrar de forma bonita e inteligente **a lógica da plataforma**: como ela entende o casal, personaliza o caminho, apresenta profissionais curados e aciona **gatilhos mentais de venda** no momento certo.

Este não é um MVP com backend. É um protótipo de demonstração, 100% front-end, com dados mockados em arquivos TypeScript. Mas precisa parecer real, fluido e sofisticado — como uma plataforma de verdade em produção.

---

## Design DNA — o padrão estético

Antes de qualquer linha de código, internalize este padrão. Se a estética estiver errada, nada funciona.

**Referências visuais diretas** (abra-as, estude, absorva):
- **Aman Resorts** (aman.com) — restrição máxima, luxo que não grita, tipografia serifada editorial, fotografia arquitetônica
- **Dior Couture** (dior.com/couture) — hierarquia tipográfica que respira, fotos hero gigantes, zero UI chrome desnecessário
- **Loro Piana** (loropiana.com) — paleta de neutros quentes, texturas sutis, hover states mínimos
- **Cereal Magazine** (readcereal.com) — editorial, grid rigoroso, espaço em branco generoso
- **Linear / Vercel** — referência só para qualidade de micro-interação e tipografia em UI, não para estética

**Anti-referências** (se parece com isso, está errado):
- Airbnb (amigável demais, cantos arredondados demais, tudo mid-gray)
- Zola / The Knot (catálogo-y, overflow de informação, cor demais)
- Templates shadcn sem customização (radius padrão, cinza neutro, botões `rounded-2xl`)
- Qualquer paleta com teal/mint/turquesa, qualquer azul saturado, qualquer gradiente colorido
- Qualquer ícone ilustrativo infantilizado, qualquer emoji em botão, qualquer `rounded-full` em CTA

**Princípio único:** se parece um dashboard SaaS, está errado. Tem que parecer uma concierge butique.

**Testes de consistência** que o implementador deve aplicar em cada tela antes de dar por pronta:
1. Remova todas as cores — a tela ainda é bonita só com tipografia + fotos? Se não, o design está dependendo de cor pra sustentar.
2. Imprima a tela em A4 preto e branco — ela ainda comunica hierarquia? Se não, falta contraste tipográfico.
3. Tire tudo exceto o título e a foto principal — sobra algo bonito? Se sim, o resto é gordura e pode ser enxugado.

---

## Mapa dos momentos de inteligência

O protótipo tem **sete momentos** em que o casal sente que a plataforma é inteligente. Cada um precisa ser deliberadamente construído — não improvisado. O agente implementador deve ler esta tabela e entender: é aqui que a demo vende o produto.

| # | Momento | O que o casal sente | O que acontece por trás |
|---|---------|---------------------|-------------------------|
| 1 | **Chat de onboarding** (`/comece`) | "Ela entendeu sem eu precisar explicar direito" | Cada resposta do casal passa por Claude via `/api/onboarding-step`. A IA parseia intencionalmente, extrai dados implícitos (ex: cidade mencionada dentro de resposta sobre nomes), valida datas vagas, reage contextualmente e decide o próximo campo a perguntar. |
| 2 | **Pergunta do sonho** (`/comece/sonho`) | "Ela leu o sonho da gente e entendeu de verdade" | Claude classifica o texto livre contra os 5 perfis e devolve o perfil escolhido + "intenções detectadas" que aparecem como chips na tela de revelação. |
| 3 | **Caminho personalizado** (`/planejamento`) | "Esse plano foi montado pra gente especificamente" | A ordem das categorias, o nome do hero, a mensagem de boas-vindas — tudo vem do perfil classificado. Perfil diferente = tela diferente. |
| 4 | **Cards de profissional** (`/planejamento/[cat]`) | "Esses são OS profissionais certos pra nós" | A linha de social proof de cada card é específica ao perfil do casal ("23 casais com perfil Íntimo & Emocional em SP escolheram este profissional nos últimos 3 meses") e os venues destacados vêm do `example_venues` do perfil. |
| 5 | **Gatilhos no dashboard** (`/meu-casamento`) | "Ela sabe exatamente o momento certo pra falar comigo" | Rule engine avaliando estado do casal em tempo real. Cada gatilho tem condição clara e aparece na posição/estilo certo. |
| 6 | **Mood board no checkout** (`/checkout`) | "Meu casamento já está tomando forma" | Colagem automática das capas dos profissionais selecionados + dados do casal em layout editorial. |
| 7 | **Site do casamento** (`/casamento/[slug]`) | "Eles montaram um site inteiro pra gente em segundos" | Geração automática a partir de tudo que foi coletado: nomes, data, local, texto do sonho, profissionais, fotos. |

**Regra:** se qualquer um desses sete momentos não causa o efeito descrito, volte e refaça. Eles são o produto.

---

## 1. Escopo

### 1.1 O que este protótipo TEM

- Home institucional
- Onboarding conversacional (dados básicos em chat + pergunta do sonho do casamento)
- **Uma única integração de IA real:** classificação do sonho do casal via Claude API (ou similar), com entrada por texto ou áudio transcrito. Esta é a **única** chamada externa do protótipo.
- Jornada personalizada do casal com categorias ordenadas pelo perfil detectado
- Listagem de profissionais por categoria, com cards bonitos e social proof
- Página de perfil de profissional com galeria, pacotes, avaliações
- Sistema de seleção (o casal escolhe um profissional por categoria)
- Dashboard do casal com progresso, seleções e **gatilhos mentais de venda** aparecendo contextualmente
- Checkout simulado (sem pagamento real) com mood board visual
- Tela de celebração pós-confirmação
- "Site do casamento" gerado automaticamente com os dados do casal + profissionais escolhidos

### 1.2 O que este protótipo NÃO tem

- Nenhum sistema de login/autenticação. O "casal" é simulado via estado global (Zustand) que persiste em `localStorage`. O botão "Entrar" na navbar da home só abre uma tela visual vazia ou é removido.
- Nenhum backend, banco de dados ou API própria.
- Nenhuma área para profissionais/vendedores.
- Nenhuma área administrativa.
- Nenhum processamento de pagamento.
- Nenhum envio de email, WhatsApp ou notificação.

---

## 2. Stack

- **Next.js 15 App Router** com TypeScript
- **Tailwind CSS v4** + **shadcn/ui** (Button, Card, Badge, Input, Dialog, Textarea, Accordion, Separator)
- **Lucide React** para ícones
- **Framer Motion** para transições sutis (fade, slide)
- **Zustand** com middleware `persist` para estado global do casal
- **Fontes via `next/font/google`:** Cormorant Garamond (display) + Inter (corpo)
- **Uma única API externa:** Claude API (Anthropic) — modelo `claude-sonnet-4-5` ou o mais recente — via uma única Route Handler em `/api/classify-dream`. Chave da API via variável de ambiente `ANTHROPIC_API_KEY`. Se a chave não estiver presente, fazer fallback para classificação por keyword matching local (mesmos 5 perfis, mesma lógica).
- **Opcional:** OpenAI Whisper para transcrição de áudio (se `OPENAI_API_KEY` estiver presente). Caso contrário, o botão de áudio pode ficar desabilitado com um aviso "Disponível em breve" e o casal usa só texto.

---

## 3. Sistema de Design

Esta é a parte mais importante. Se a estética estiver errada, nada funciona. A marca é **sóbria, editorial, romântica e sofisticada** — referência visual próxima de Dior, Valentino, Aman Resorts. Nada de cores vibrantes, ícones infantis, emojis em botões, ou animações exageradas.

### 3.1 Paleta (tokens semânticos — configurar no `globals.css` via Tailwind v4)

| Nome | Hex | Uso |
|------|-----|-----|
| `background` | `#FEFAF3` (creme quente) | Fundo de **toda** página. Nunca usar branco puro. |
| `foreground` | `#0C0106` (preto quase-bordeaux) | Texto principal |
| `muted` | `#FAEDD2` (bege quente) | Seções alternadas, hover sutis |
| `muted-foreground` | `#777777` | Texto secundário, captions |
| `card` | `#FFFFFF` | Superfícies elevadas (cards, modais) |
| `primary` | `#7F0E4A` (bordeaux) | Botões principais, destaques, focus ring |
| `primary-foreground` | `#FFFFFF` | Texto sobre botão primário |
| `brand-wine` | `#420926` | Hover do botão primário |
| `brand-rose` | `#C45F9B` | Acento secundário, ornamentos |
| `border` | `#B39EA9` (mauve) | Bordas e divisores |
| `accent` | `#EBE8E9` (blush) | Hover states muito sutis |

**Overlays sobre foto:**
- Escuro padrão: `rgba(12, 1, 6, 0.60)` — para legibilidade de texto branco
- Forte: `rgba(12, 1, 6, 0.80)` — para fotos muito claras

### 3.2 Tipografia

- **Display — Cormorant Garamond**, pesos 400 e 500 apenas. Usada em:
  - Hero da home: `text-5xl md:text-7xl font-display font-medium`
  - H1 de página: `text-4xl md:text-5xl font-display font-medium`
  - H2 de seção: `text-3xl md:text-4xl font-display font-normal`
  - Nomes de profissionais, venues, categorias em cards
  - Letter-spacing leve: `tracking-wide` ou `tracking-[0.01em]`
- **Corpo — Inter**, pesos 400/500. Usada em tudo que for UI, botões, inputs, parágrafos.
  - Body: `text-base` (1rem)
  - Small: `text-sm`
  - Overline / rótulos: `text-xs uppercase tracking-widest font-medium`
- **Regra inviolável:** nunca usar `font-bold` em headings display. No máximo `font-medium` (500).

### 3.3 Componentes-base

- **Botão primário:** `inline-flex items-center gap-2 bg-primary text-primary-foreground hover:bg-brand-wine px-7 py-3.5 rounded-sm font-sans font-medium text-sm tracking-wide transition-colors duration-200`
- **Botão outline:** mesmo, mas `bg-transparent border border-primary text-primary hover:bg-primary hover:text-primary-foreground`
- **Botão ghost:** `text-foreground hover:text-primary px-4 py-2 transition-colors`
- **Card padrão:** `bg-card border border-border rounded-md overflow-hidden hover:shadow-lg transition-shadow duration-300`
- **Input:** `w-full border border-border bg-background rounded-sm px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-colors`
- **Badge:** `inline-flex items-center bg-primary/10 text-primary text-xs font-medium px-2.5 py-1 rounded-sm`
- **Corners:** `rounded-sm` em quase tudo. **Nunca** `rounded-full` em botões CTA (pode em avatares redondos).

### 3.4 Ornamentação

- **Divisor decorativo** entre seções heroicas: linha horizontal mauve + losango `◇` centralizado em rose
  ```
  <div className="flex items-center gap-4 my-12">
    <div className="flex-1 h-px bg-border" />
    <span className="text-brand-rose text-lg">◇</span>
    <div className="flex-1 h-px bg-border" />
  </div>
  ```
- **Padrões sutis de fundo** em seções alternadas: `bg-muted` pode ganhar uma textura bem fraca via SVG pattern (opcional).

### 3.5 Tom de voz (copy)

Todo texto do protótipo é em português brasileiro. O tom é:
- **Poético mas direto** em headings ("Seu casamento dos sonhos, do início ao fim")
- **Conversacional e humano** em estados de loading ("Estamos entendendo o sonho de vocês...")
- **Acolhedor** em erros ("Algo deu errado. Vamos tentar de novo?")
- **Celebratório** em sucessos, mas sem exclamações exageradas
- **Nunca técnico** voltado ao casal. Zero jargão.

**Sem emojis** em UI, exceto:
- 🎉 na tela de celebração pós-confirmação
- 🎤 no botão de gravar áudio no onboarding
- ✨ ou ◇ como ornamento decorativo ocasional

### 3.6 Animações

- Transições de cor/background: `duration-200`
- Transições de shadow: `duration-300`
- Entrada de seções: fade + slide-up 16px, `duration-500`, via Framer Motion com `whileInView`
- **Nunca**: bounce, spin dramático, zoom forte, flash. A marca é serena.

---

## 4. Rotas

O protótipo tem estas rotas e **apenas estas**:

| Rota | O que é |
|------|---------|
| `/` | Home institucional |
| `/comece` | Onboarding passo 1: chat de dados básicos |
| `/comece/sonho` | Onboarding passo 2: pergunta do sonho + classificação IA |
| `/planejamento` | Tela principal pós-onboarding — categorias personalizadas pelo perfil |
| `/planejamento/[categoria]` | Lista de profissionais de uma categoria |
| `/oferta/[slug]` | Página de perfil de um profissional (ou venue) |
| `/meu-casamento` | Dashboard do casal com progresso, seleções e gatilhos de venda |
| `/checkout` | Resumo final + confirmação simulada |
| `/casamento/[slug]` | Site do casamento gerado pós-confirmação |

**Não criar:** nenhuma rota de login, admin, fornecedor, API externa, ou listagem pública de profissionais.

**Navbar da home:** logo à esquerda + um único link "Planejar meu casamento" que leva a `/comece`. Se o casal já tem estado salvo (passou pelo onboarding), o link vira "Meu casamento" e leva a `/meu-casamento`.

**Layout das rotas do casal** (`/planejamento`, `/meu-casamento`, `/checkout`, `/planejamento/[categoria]`, `/oferta/[slug]`): navbar fina fixa com logo + "Meu casamento" + nome do casal + botão ghost "Reiniciar demo" (que limpa `localStorage` e volta para `/`).

---

## 5. Página por página

### 5.1 `/` — Home

**Objetivo:** ativar emoção, comunicar que a plataforma cuida de tudo, levar para `/comece`.

**Seções, em ordem:**

1. **Hero em tela cheia (min-h-[90vh])**
   - Imagem de fundo: `https://welucci.com/wp-content/uploads/2026/01/Capa-principal-Home_11zon-scaled.jpg` (venue Welucci Estaiada de noite)
   - Overlay escuro 60%
   - Navbar sobreposta, transparente, texto branco
   - Conteúdo centralizado, texto branco:
     - Overline: `CURADORIA DE CASAMENTOS`
     - Título display gigante: **"Seu casamento dos sonhos,**<br>**do início ao fim"**
     - Subtítulo (max-w-md): "A gente cuida dos profissionais. Vocês cuidam do sonho."
     - Botão primário: **"Planejar meu casamento"** → `/comece`
     - Abaixo, em texto pequeno branco translúcido: "Três minutos e a jornada de vocês começa."

2. **Como funciona** (`bg-background`, py-24)
   - Heading H2 centralizado: "Um jeito novo de casar"
   - Subtítulo em muted-foreground: "Sem planilhas, sem ligações, sem estresse. Três passos, e acabou."
   - 3 passos em grid (ícones Lucide em circles bordeaux 64px):
     1. `Sparkles` — **"Vocês contam o sonho"** — "Uma assistente entende como vocês imaginam o casamento — por texto ou por áudio. Sem formulário, sem dropdown infinito."
     2. `Compass` — **"Nós montamos o caminho"** — "A partir do sonho de vocês, a plataforma sabe quais categorias importam, em qual ordem, e quais profissionais fazem sentido. Curadoria de verdade."
     3. `Heart` — **"Vocês escolhem, a gente executa"** — "Comparem, selecionem, confirmem. Tudo online. Dos contratos à comunicação com cada profissional, quem resolve somos nós."

3. **Números** (`bg-muted`, py-20)
   - Grid de 3 métricas grandes em display font, centralizadas:
     - **1.247** casais realizados
     - **320** profissionais curados
     - **4.9★** avaliação média
   - Valores hardcoded. Abaixo de cada número, label em overline muted.

4. **Espaços parceiros** (`bg-background`, py-24)
   - Overline: `LOCAIS PARCEIROS`
   - Heading H2: "13 espaços Welucci para o grande dia"
   - Subtítulo: "Dos cartões-postais de São Paulo à beira-mar no Guarujá."
   - Grid responsivo 1/2/3 colunas mostrando inicialmente 6 venues (os de tier 1 e 2 — ver seção 8).
   - Botão outline abaixo do grid: "Ver todos os 13 espaços →" — ao clicar, expande para mostrar todos os 13.
   - Card de venue:
     - Imagem `aspect-[4/3] object-cover` com `hover:scale-105 transition-transform duration-500`
     - Overlay sutil no hover: `bg-foreground/20`
     - Abaixo da imagem: overline da cidade, nome em display, tagline em muted-foreground, lista de 2-3 highlights como mini-badges
     - Card inteiro é clicável → `/oferta/[venue.slug]`

5. **Depoimentos** (`bg-muted`, py-24)
   - Heading H2: "Casais que já celebraram com a gente"
   - 3 cards lado a lado:
     - Círculo bordeaux 56px com iniciais em branco
     - Nome do casal em display
     - Cidade + data em overline muted
     - Quote em italic, grande
     - 5 estrelas preenchidas
   - Dados na seção 10.

6. **FAQ** (`bg-background`, py-20)
   - Heading H2: "Perguntas frequentes"
   - Accordion shadcn com 5 perguntas (conteúdo na seção 9)

7. **Footer** (`bg-foreground text-background`, py-16)
   - Logo "we.wedme" em branco (placeholder SVG serve)
   - 3 colunas de links simples (navegação, institucional, contato) — podem levar a `#` por enquanto
   - Linha fina divisória mauve
   - Copyright + "Feito com carinho em São Paulo, Brasil"

---

### 5.2 `/comece` — Onboarding conversacional inteligente

**Objetivo:** coletar os dados do casal de forma **genuinamente conversacional**. Não é um formulário mascarado. O assistente entende respostas em linguagem natural, extrai informação implícita, reage com contexto e decide inteligentemente o próximo passo.

**Este é o momento #1 do mapa de inteligência.** Fazer direito.

#### Arquitetura da conversa

A conversa é **stateful por turno** e orquestrada por Claude via uma Route Handler em `/api/onboarding-step`. O frontend não tem lógica de parsing nem de validação — ele só envia a mensagem do casal e renderiza o que a IA responde.

**Campos a coletar** (na ordem preferencial — mas a IA pode pular ordem se o casal der múltiplos dados numa resposta só):
1. `partner_1_name` + `partner_2_name`
2. `wedding_date` (ISO `YYYY-MM-DD` ou `YYYY-MM` para data incompleta)
3. `city` + `state`
4. `estimated_budget` (número em reais)
5. `email`

**Fluxo de cada turno:**

1. Frontend envia para `/api/onboarding-step`:
   ```json
   {
     "collected_so_far": { "partner_1_name": "Ana", "partner_2_name": "Pedro" },
     "conversation_history": [
       { "role": "assistant", "content": "Como vocês se chamam?" },
       { "role": "user", "content": "Ana e Pedro" }
     ],
     "user_message": "março do ano que vem"
   }
   ```

2. Backend chama Claude com structured output (tool use) pedindo um JSON assim:
   ```json
   {
     "updates": {
       "wedding_date": "2027-03"
     },
     "assistant_reply": "Março de 2027 — menos de um ano. Dá tempo e sobra, se a gente começar agora. 💛",
     "next_field_to_ask": "city",
     "next_question": "Em qual cidade vai ser o grande dia?",
     "needs_clarification": false
   }
   ```

3. Frontend: aplica `updates` no estado, renderiza `assistant_reply` + `next_question` com typing indicator, espera a próxima resposta do casal.

4. Quando `collected_so_far` tiver todos os 5 campos essenciais, a IA responde com `next_field_to_ask: null` e um `assistant_reply` de transição. O frontend então faz fade-out e redireciona para `/comece/sonho`.

**Prompt do sistema** (em `src/lib/onboarding-prompt.ts`):

```
Você é uma assistente de casamentos da plataforma we.wedme. Sua missão é coletar
informações básicas de um casal de forma conversacional, acolhedora e inteligente.

Seu tom: caloroso, próximo, brasileiro, sem ser infantil. Você é uma profissional
de casamentos experiente que acabou de conhecer este casal. Use português do Brasil
natural. Pode usar emojis com moderação (máximo 1 por mensagem, e nem sempre).

Campos que você precisa coletar:
- partner_1_name: primeiro nome de um dos noivos
- partner_2_name: primeiro nome do outro noivo
- wedding_date: data do casamento no formato YYYY-MM-DD se completa, ou YYYY-MM se o casal só souber o mês
- city: cidade do casamento
- state: sigla do estado (ex: SP)
- estimated_budget: orçamento estimado em reais como número (ex: 80000)
- email: email de contato

Regras invioláveis:

1. SEJA INTELIGENTE NO PARSE: se o casal disser "Ana e Pedro, casando em Trancoso",
   você deve extrair partner_1_name, partner_2_name E city=Trancoso, state=BA de uma
   vez só. Atualize todos os campos que conseguir na mesma resposta.

2. DATAS VAGAS: o ano atual é 2026. Se o casal disser "em março" sem ano, assuma
   "2027-03" (próximo março). "Verão" no Brasil é dezembro-fevereiro — pergunte
   "tipo dezembro 2026 ou janeiro/fevereiro 2027?" para confirmar antes de gravar.

3. ORÇAMENTO FLEXÍVEL: aceite "80 mil", "oitenta mil", "R$ 80.000", "uns 80k",
   "entre 70 e 90" (neste caso use a média = 80000). Nunca pergunte o número
   formatado — aceite como vier.

4. REAJA AO CONTEÚDO: não seja robótica. Se o casal disser que vai casar em
   Trancoso, reaja: "Trancoso é magia pura." Se mencionar uma data próxima,
   reaja com urgência afetuosa. Se o nome for incomum, elogie com naturalidade.
   Essa é a parte que faz parecer que você entende de casamento de verdade.

5. NÃO PEÇA CAMPOS QUE JÁ TEM: sempre cheque collected_so_far antes de decidir
   a próxima pergunta. Se tudo do grupo "nomes" já foi preenchido, pule para data.

6. SE A RESPOSTA FOR AMBÍGUA: use needs_clarification=true e reformule a pergunta
   com opções ("Você quis dizer X ou Y?"). Não force um parse errado — prefira
   perguntar de novo.

7. NA TRANSIÇÃO FINAL: quando todos os 5 campos essenciais estiverem preenchidos,
   responda algo como "Perfeito. Agora vem a pergunta que mais importa de todas..."
   e deixe next_field_to_ask = null.

8. RESPONDA SEMPRE NO SCHEMA JSON ESTRITO. Sem prosa fora dele. Sem markdown.
```

**Saudação inicial** (renderizada antes da primeira chamada à IA, hard-coded):

> *"Oi. Eu sou a assistente da we.wedme. Estou aqui para entender como vocês imaginam o casamento e montar um caminho feito sob medida. Topam começar com algumas perguntas rápidas?"*

Abaixo da bolha, botão primário: **"Topamos"** — ao clicar, frontend envia `user_message: "Topamos"` e recebe a primeira pergunta real da IA (normalmente sobre nomes).

#### Comportamento esperado — exemplos reais

Estes exemplos são a régua de qualidade. Se o protótipo não se comporta assim, o onboarding não está pronto.

**Exemplo 1 — parse múltiplo numa resposta só:**
- Assistente: "Como vocês se chamam?"
- Casal: "Ana e Pedro, vamos casar em Ilhabela em fevereiro de 2027"
- Assistente (reagindo, extraindo 4 campos de uma vez): *"Ana e Pedro, que maravilha. Ilhabela em fevereiro — praia, vento, pôr do sol. Eu já estou vendo. Falta só a gente combinar o orçamento e o email de vocês pra salvar o progresso."*
- Próxima pergunta (na mesma mensagem ou seguinte): *"Têm uma ideia de orçamento?"*

**Exemplo 2 — data vaga:**
- Assistente: "E já têm uma data?"
- Casal: "quem sabe no verão"
- Assistente (com clarificação, sem gravar nada ainda): *"Verão aqui é dezembro a fevereiro. Tipo dezembro de 2026, ou mais pra janeiro/fevereiro de 2027?"*

**Exemplo 3 — orçamento informal:**
- Assistente: "E o orçamento, qualquer noção serve."
- Casal: "uns 80 pau"
- Assistente: *"R$ 80 mil dá pra fazer coisa linda — especialmente em {cidade_já_coletada}. Por último: qual o email de vocês pra eu salvar tudo?"*

**Exemplo 4 — casal devolve pergunta:**
- Casal: "E vocês cuidam mesmo de tudo? Não preciso falar com fornecedor?"
- Assistente (usa `needs_clarification=true` e não muda collected_so_far): *"É exatamente isso. A gente cuida dos profissionais, do contrato ao dia do casamento. Vocês escolhem, a gente faz acontecer. Voltando: qual cidade?"*

#### Layout visual

- `max-w-2xl mx-auto min-h-screen bg-background`, padding horizontal generoso (`px-6 md:px-0`)
- Header minimalista no topo: logo `we.wedme` pequeno centralizado + barra de progresso fina abaixo mostrando campos coletados: `progress = Object.keys(collected_so_far).length / 5`. Label discreto à direita: *"A gente já sabe: nomes · data"* (dinâmico)
- Chat vertical, mensagens aparecem em sequência com animação de fade + slide-up sutil (Framer Motion, duração 400ms):
  - **Assistente** (esquerda): `bg-muted text-foreground rounded-md rounded-bl-[2px] px-5 py-4 max-w-md leading-relaxed`. Sem avatar — a marca não precisa de personagem.
  - **Casal** (direita): `bg-primary text-primary-foreground rounded-md rounded-br-[2px] px-5 py-4 max-w-md`
- **Typing indicator** antes de cada resposta da IA: 3 pontinhos animados dentro de uma bolha muted, duração proporcional ao comprimento da resposta (mínimo 900ms, máximo 1800ms) — cria a sensação de "ela está pensando"
- **Input de entrada**: fixo no rodapé da viewport em mobile, inline abaixo da última mensagem em desktop. Textarea auto-expand grande + botão primário "Enviar". Placeholder sempre: *"Respondam como preferirem..."* (sem instruções de formato — a IA aceita qualquer coisa)
- **Loading state** durante chamada à API: o input desabilita, aparece um shimmer sutil no lugar onde a próxima bolha vai aparecer. Nunca mostrar spinner técnico.
- Na última mensagem do assistente antes da transição, aparece um **botão primário grande** "Contar nosso sonho →" em vez do input (o casal não precisa digitar nada — só clicar para ir a `/comece/sonho`).

#### Fallback sem API key

Se `ANTHROPIC_API_KEY` não estiver presente, o backend usa uma versão mais simples em `src/lib/fake-onboarding.ts`:
- Sequência fixa de perguntas na ordem dos campos
- Parsing por regex: nomes por split em " e "/" & ", datas por regex `DD/MM/AAAA` ou "mês de ANO", orçamento por extração de dígitos, email por regex padrão
- Respostas do assistente vêm de um pool de frases pré-escritas para cada campo
- **Não tenta** extrair múltiplos campos de uma resposta só — a inteligência é só com IA real

O fallback mantém a demo funcional mas perde o "uau". Deixar claro no README: o onboarding inteligente requer a API key.

#### Estado e resiliência

- Tudo que for extraído é salvo imediatamente em Zustand + `localStorage`
- Se o casal fechar a aba e voltar, a conversa retoma: a IA é chamada com o `collected_so_far` atual e o `conversation_history` vazio, e responde com uma mensagem contextual tipo *"Oi de novo, {nome}. A gente estava falando sobre {último campo em aberto}..."*
- Se a chamada à API falhar (timeout, 500), o frontend mostra *"Travei aqui, me dá um segundo..."* em italic muted e tenta de novo. Não mostrar stack trace nem error code.

---

### 5.3 `/comece/sonho` — Onboarding passo 2 (o sonho)

**Objetivo:** capturar a visão do casamento em texto ou áudio, enviar para a IA real classificar, revelar o perfil de forma cinematográfica.

**Esta é a única tela do protótipo que faz chamada de IA real.**

**Layout:**
- Mesma base do `/comece` (chat), mas sem input de texto fixo no rodapé
- Bolha do assistente grande, com peso editorial:
  > *"Última pergunta, {nome_1} e {nome_2}. ✨"*
  > 
  > *"**O que é o casamento para vocês — e como vocês imaginam ele?**"*
  > 
  > *"Escrevam o que vier ao coração. Pode ser uma palavra, um parágrafo, uma história inteira. Se preferirem, gravem um áudio — às vezes é mais fácil falar do que escrever."*

- Abaixo da bolha, dois blocos lado a lado (stack no mobile):

  **Bloco texto:**
  - `<textarea>` grande, `min-h-[200px]`, border-border, placeholder: *"Escrevam o que vem à cabeça..."*
  - Contador discreto de caracteres no canto inferior direito
  - Botão primário abaixo: **"Enviar nosso sonho →"** (desabilitado até ter pelo menos 20 caracteres)

  **Bloco áudio:**
  - Card com ícone `Mic` grande + texto "Ou gravem um áudio" + botão "Começar a gravar"
  - Ao clicar, se `OPENAI_API_KEY` existir: abre modal de gravação com timer, botão vermelho pulsante, máximo 3 minutos. Ao parar, transcreve via Whisper e preenche o textarea automaticamente.
  - Se a key não existir: botão desabilitado com tooltip "Em breve". O casal usa o textarea.

**Ao enviar:**

1. **Transição cinematográfica imediata** (não é um loading comum):
   - Tela limpa totalmente, `bg-background`
   - Ornamento central animado: círculo grande (160px) de cor rose muito suave, pulsando devagar (scale 1.0 → 1.08, 2.5s loop), com um `◇` em rose no centro
   - Texto display abaixo, centralizado, em foreground: **"Estamos lendo o sonho de vocês"**
   - Sub-texto em muted-foreground (text-sm, tracking-wide) que vai trocando a cada 1.2s, com crossfade de 300ms:
     - "Ouvindo o que vocês escreveram."
     - "Separando o que importa de verdade."
     - "Identificando o estilo de casamento."
     - "Escolhendo os profissionais certos para o perfil."
     - "Montando o caminho."
   - **Nada de barra de progresso.** É um momento de suspense controlado, não de espera técnica.

2. **Chamada de IA:** POST para `/api/classify-dream` com `{ dream_text: string, partner_names: string, city: string, wedding_date: string }`.
   - A Route Handler usa Claude API com um prompt que classifica contra os 5 perfis da seção 7.
   - Retorna `{ profile_slug, confidence, detected_intents, reasoning }`
   - Prompt sugerido (colocar em `src/lib/classify-prompt.ts`):

     ```
     Você é um especialista em casamentos brasileiros. Sua tarefa é classificar
     a visão de um casal em um dos 5 perfis abaixo, com base no texto que eles
     escreveram descrevendo como imaginam o casamento deles.

     Perfis disponíveis:

     1. classico-atemporal — Vocês sonham com tradições, elegância e detalhes
        que atravessam gerações. Cerimônia formal, decoração refinada, casamento
        de dia ou entardecer clássico.

     2. intimo-emocional — Um casamento pequeno, onde cada convidado importa
        e cada detalhe conta uma história. Foco em emoção, conexão, simplicidade
        afetiva.

     3. minimalista-moderno — Design contemporâneo, paleta sóbria, clean e
        arquitetônico. Pouco mas bem feito. Sem excessos.

     4. natureza-destination — Ao ar livre, cercados de verde, pé na areia,
        campo, vista. Casamentos que respiram liberdade e conexão com o lugar.

     5. grande-celebracao — Um grande evento, muitos convidados, festa até
        tarde, dança, comemoração exuberante. A alegria coletiva como protagonista.

     Analise o texto abaixo e retorne APENAS um JSON válido com este formato:
     {
       "profile_slug": "...",
       "confidence": 0.XX,
       "detected_intents": ["...", "..."],
       "reasoning": "1-2 frases explicando por que este perfil bate com o texto"
     }

     Texto do casal: "{dream_text}"
     ```

   - Se a API falhar ou `ANTHROPIC_API_KEY` não existir, fazer fallback local: keyword matching contra os arrays `detection_keywords` de cada perfil (seção 7) → escolher o que tiver mais matches → retornar com confidence simulada entre 0.70 e 0.90.
   - **Importante:** o loading cinematográfico deve durar no mínimo 3.5 segundos mesmo que a IA responda em 500ms. Usar `await Promise.all([classifyCall, new Promise(r => setTimeout(r, 3500))])`.

3. **Tela de revelação do perfil:**
   - Fade no conteúdo do loading, fade in do novo conteúdo
   - Ornamento `◇` grande em rose
   - Overline: `PERFIL IDENTIFICADO`
   - Heading display gigante: **"{profile.name}"**
   - Parágrafo em italic muted-foreground, `max-w-lg mx-auto`: `{profile.description}`
   - Abaixo, um bloco discreto: "Detectamos em vocês:" + 3 chips mostrando `detected_intents` retornados pela IA
   - Botão primário grande: **"Ver o caminho que montamos →"** → `/planejamento`
   - Botão ghost abaixo: "Contar o sonho de novo" (limpa e volta para a pergunta)

**Salvar em Zustand:** `wedding_profile_slug`, `dream_text`, `detected_intents`.

---

### 5.4 `/planejamento` — Tela principal do casal

**Objetivo:** casal vê seu caminho personalizado — categorias na ordem certa para o perfil dele — e entende visualmente como a jornada vai acontecer.

**Nunca usar as palavras "marketplace", "fornecedores" ou "vendors" nesta tela.** O vocabulário é: "planejamento", "caminho", "categorias", "profissionais", "seu casamento".

**Layout:**

1. **Hero compacto** (não full-screen — ~40vh)
   - Fundo `bg-muted`
   - Container centralizado
   - Overline: `SEU CAMINHO PERSONALIZADO`
   - Heading display: **"{profile.name}"**
   - Subtítulo em muted-foreground: "{profile.description}"
   - Chip linha abaixo: "Casamento em **{cidade}** · **{data}** · Orçamento de **R$ {orçamento}**"

2. **Banner de gatilho mental** (se aplicável — ver seção 6)
   - Se alguma regra de gatilho bater (ex: o casal acabou de entrar sem nenhuma seleção), mostrar um card `bg-primary/5 border-l-4 border-primary px-6 py-4 rounded-sm` com ícone, título, mensagem e CTA. Dismissível com X.

3. **Grid de categorias** (o coração da tela)
   - Título da seção: "Seu plano para o grande dia"
   - Subtítulo: "Na ordem ideal para o perfil de vocês. Podem começar por qualquer uma — mas a gente sugere seguir a sequência."
   - Grid responsivo: 1 col mobile / 2 tablet / 3 desktop, `gap-6`
   - **Cada card de categoria:**
     - Altura fixa, `bg-card border border-border rounded-md overflow-hidden hover:shadow-lg transition`
     - Header do card: número da ordem (ex: "01", "02") em display grande + ícone da categoria à direita
     - Nome da categoria em display medium (ex: "Local", "Fotografia", "Buffet")
     - Descrição curta em muted-foreground (1 linha)
     - Contador: "N profissionais selecionados"
     - **Se já escolhido** (tem seleção salva): bg do card muda sutilmente (`bg-primary/5`), badge verde "✓ Escolhido" no canto superior direito, abaixo mostra mini-card do profissional escolhido (foto 40px + nome)
     - **Se não**: botão outline no rodapé do card "Ver opções →"
     - Card inteiro clicável → `/planejamento/[categoria.slug]`
   - **Categorias:** ordem vem de `profile.default_path_categories[]` (ver seção 7). As categorias possíveis são: `local`, `fotografia`, `buffet`, `decoracao`, `flores`, `roupas-noiva`, `festa-musica`, `convites`, `filmagem`.

4. **Rodapé sticky** (só aparece se houver pelo menos 1 seleção):
   - `fixed bottom-0 bg-background border-t border-border px-6 py-4`
   - "**{n} de {total}** categorias escolhidas · R$ {total_confirmado}"
   - Botão primário à direita: "Ir ao meu casamento →" → `/meu-casamento`

---

### 5.5 `/planejamento/[categoria]` — Lista de profissionais

**Objetivo:** casal compara os profissionais de uma categoria específica.

**Layout:**

1. **Header**
   - Link `← Voltar ao meu plano` (ghost)
   - Heading display: nome da categoria (ex: "Fotografia")
   - Subtítulo: "N profissionais curados para o perfil de vocês em {cidade}"

2. **Se já tem seleção nessa categoria** (banner primeiro):
   - Card `bg-primary/5 border border-primary/30 p-5 rounded-sm`
   - À esquerda: foto do profissional (80px) + nome + pacote + preço
   - À direita: botões "Ver detalhes" e "Trocar escolha"

3. **Grid de cards de profissional** (1 col mobile / 2 desktop, `gap-6`)
   - **Cada card é grande e editorial:**
     - Imagem de capa em `aspect-[4/3] object-cover`
     - Badge "Verificado ✓" sobreposto no canto superior esquerdo se aplicável
     - Abaixo da imagem (padding 5):
       - Nome em display medium
       - Linha: `{cidade} · ★ {rating} · {total_reviews} casamentos`
       - Linha de social proof em italic muted-foreground pequeno: `"{social_proof_line}"` (ex: "23 casais com perfil parecido escolheram este profissional")
       - Faixa de preço em foreground: "A partir de **R$ 5.000**"
       - Botão primário no rodapé do card: "Ver perfil →" → `/oferta/[slug]`

4. **Rodapé discreto**
   - Link ghost centralizado: "Pular esta categoria" — ao clicar, abre modal de confirmação: *"Tem certeza? Vocês podem voltar e escolher depois, a qualquer momento."* Se confirmar, marca a categoria como "pulada" no estado e volta para `/planejamento`.

---

### 5.6 `/oferta/[slug]` — Página de perfil de profissional

**Objetivo:** vender confiança. Essa é uma das telas mais importantes em termos de design — precisa parecer um perfil editorial de alta qualidade.

**Layout:**

1. **Breadcrumb** no topo: `← {nome da categoria}`

2. **Galeria hero**
   - Primeira foto full-width em `aspect-[21/9]` ou `aspect-[16/9]` no mobile
   - Abaixo, grid de 4 fotos menores em `aspect-square` (2x2 no mobile, 4x1 no desktop)
   - Ao clicar em qualquer foto, abre lightbox em modal (shadcn Dialog com imagem grande)

3. **Seção identidade** (duas colunas desktop, stack mobile, py-16)
   - **Esquerda (2/3):**
     - Heading display: nome do profissional / venue
     - Linha de meta: `{cidade} · Verificado ✓ · ★ {rating} · {total_reviews} casamentos`
     - Separador fino
     - Bio em 2-3 parágrafos, tom editorial
     - Linha com CNPJ (mock): "CNPJ 00.000.000/0001-00"
     - Chips de highlights (max 4): cada um em `bg-muted text-foreground text-xs px-3 py-1.5 rounded-sm`
   - **Direita (1/3) — card sticky:**
     - `bg-card border border-border p-6 rounded-md shadow-sm`
     - Título pequeno overline: "DISPONIBILIDADE"
     - Se o casal tem data definida: checar contra `unavailable_dates` do vendor → mostrar "✓ **Disponível** para {data}" em verde, ou "Indisponível nesta data" em muted
     - Separador
     - Título overline: "A PARTIR DE"
     - Preço grande em display: "R$ {min_price}"
     - Botão primário full-width: **"Ver pacotes →"** (scroll suave para a seção de pacotes abaixo)
     - Botão ghost abaixo: "Salvar para depois"

4. **Seção de pacotes** (py-16)
   - Heading H2: "Pacotes disponíveis"
   - Cards de pacote em grid (2 cols desktop)
   - Cada card de pacote:
     - Nome do pacote em display
     - Preço em display grande: "R$ {price}" + legenda "valor de referência"
     - Lista de `includes` com ícones check (verde) e `excludes` com x (muted-foreground)
     - Botão primário full-width no rodapé: **"Quero este pacote →"**
     - **Ao clicar:** salva a seleção no Zustand (`couple.selections[category_slug] = { vendor_slug, package_id, quoted_price }`), mostra um toast de sucesso ("Profissional escolhido! ✓"), e redireciona para `/planejamento` após 1s

5. **Galeria de trabalhos realizados** (py-16, `bg-muted`)
   - Heading H2: "Trabalhos realizados"
   - Grid editorial de 6-8 fotos (mosaico assimétrico se possível; senão grid 3 colunas uniform)
   - Todas clicáveis para lightbox

6. **Seção de avaliações** (py-16)
   - Heading H2: "O que os casais disseram"
   - Grid de 3 reviews:
     - Avatar circular com iniciais
     - Nome do casal + cidade + data
     - 5 estrelas
     - Quote em italic
     - Se tem foto, thumbnail abaixo

7. **CTA final fixo no mobile / inline no desktop:**
   - Botão primário grande: **"Quero este profissional"** → abre modal de confirmação com resumo do pacote selecionado

---

### 5.7 `/meu-casamento` — Dashboard

**Objetivo:** casal acompanha o progresso. Gatilhos mentais aparecem aqui. É a tela onde a "inteligência" da plataforma mais transparece.

**Layout:**

1. **Hero compacto** (bg-muted, py-12)
   - "Olá, {nome_1} e {nome_2}"
   - "Casamento em **{cidade}** · **{data}**"
   - **Barra de progresso** grande:
     - Background `bg-border`, preenchimento `bg-primary`, altura 8px, rounded-full
     - Porcentagem = (seleções feitas / total de categorias no caminho) × 100
     - Label abaixo: "**{n} de {total}** categorias escolhidas · **{porcentagem}%** do caminho"

2. **Gatilhos mentais de venda** (esta é a parte mais importante da tela)
   - Avaliar todas as regras de gatilho (seção 6) contra o estado atual do casal
   - Renderizar as que baterem, em ordem de prioridade, nos formatos definidos (`top_bar`, `inline_card`, `floating_badge`)
   - Cada gatilho é visualmente distinto mas sempre elegante — nunca chamativo demais

3. **Resumo financeiro** (3 cards em grid)
   - Card 1: "**R$ {total_confirmado}**" — label overline "CONFIRMADO"
   - Card 2: "**R$ {total_orçamento - total_confirmado}**" — label overline "DISPONÍVEL"
   - Card 3: "**{categorias_faltando}**" — label overline "CATEGORIAS PENDENTES"

4. **Lista de categorias com status**
   - Uma linha por categoria, com ícone de status à esquerda:
     - ✅ verde: escolhido e confirmado
     - 🟡 amarelo: selecionado mas não confirmado
     - ⬜ muted: não escolhido
     - — muted: pulado
   - Cada linha mostra: ícone + nome da categoria + (se escolhido) nome do profissional + preço à direita + botão ghost "Ver" ou "Escolher"

5. **Card "Próximo passo sugerido"** (destaque primary)
   - Se há categorias pendentes: "Vocês ainda não escolheram **{categoria}** — é uma das categorias mais importantes para o perfil de vocês." + botão "Escolher agora →"
   - Se tudo escolhido: "Tudo pronto. Vocês estão a um clique de confirmar o casamento." + botão "Ir ao checkout →" → `/checkout`

6. **Preview do site do casamento** (aparece só se ≥ 50% das categorias escolhidas)
   - Card grande com fundo: `bg-muted rounded-md p-8`
   - Ornamento `◇` 
   - "Preview do site de vocês"
   - Subtítulo: "Assim ele vai ficar quando vocês finalizarem tudo."
   - Botão outline: "Ver preview →" → abre `/casamento/[slug]` em nova aba

---

### 5.8 `/checkout` — Confirmação final

**Objetivo:** casal revisa tudo numa tela visualmente linda que sela a decisão.

**Layout:**

1. **Breadcrumb:** `← Meu casamento`

2. **Hero editorial com mood board automático**
   - Grid 2x2 de 4 fotos das capas dos profissionais escolhidos — se tem menos de 4, repete ou ajusta o layout
   - Sobre o grid, overlay leve + texto centralizado em branco:
     - Overline: `SEU CASAMENTO`
     - Heading display: **"{nome_1} & {nome_2}"**
     - Linha: "{cidade} · {data}"

3. **Resumo das escolhas**
   - Heading H2: "Quem faz parte do seu dia"
   - Lista de cards horizontais, um por categoria escolhida:
     - Foto do profissional (80x80)
     - Nome + nome do pacote
     - Preço à direita
     - Link ghost "Alterar" → `/oferta/[slug]`
   - Se há categorias não escolhidas: card muted no final "**{n} categorias** ficaram para depois — sem problema, vocês podem adicionar quando quiserem."

4. **Total** (card grande, bg-muted, p-8)
   - "Total do casamento"
   - Número display gigante: **"R$ {total}"**
   - Abaixo em muted-foreground: "Reserva válida por 48 horas"

5. **Bloco de garantia** (card bg-primary/5, border border-primary/20, p-6)
   - Ícone `ShieldCheck` bordeaux à esquerda
   - Título: "Garantia we.wedme"
   - Texto: "Cada profissional passou pela nossa curadoria. Se qualquer imprevisto impedir a entrega no seu dia, substituímos por um equivalente verificado — ou devolvemos 100% + R$500 de crédito."

6. **Confirmação final**
   - Link ghost discreto: "Ver contrato digital" (abre modal com lorem ipsum formatado como contrato)
   - Checkbox: "Li e concordo com os termos"
   - Botão primário GIGANTE full-width: **"Confirmar meu casamento"** (desabilitado até checkbox marcado)
   - Abaixo, texto muted pequeno: "Esta é uma simulação — nenhum pagamento é processado."

**Ao clicar em "Confirmar":**

1. Tela de loading full screen: fundo creme, ornamento pulsando, texto "Confirmando o casamento de vocês..." — delay 2.5s
2. **Tela de celebração full screen:**
   - Fade in elegante
   - Confete sutil via Framer Motion (max 15 peças, cores da marca, cai devagar, desaparece em 4s) — nada infantil
   - Ornamento `◇` grande rose
   - Overline: `PARABÉNS`
   - Heading display gigante: **"O casamento de vocês está confirmado 🎉"**
   - Subtítulo: "Vocês acabam de dar o primeiro passo do início de tudo."
   - Dois botões centralizados:
     - Primário: **"Ver nosso site de casamento →"** → `/casamento/{slug_gerado}`
     - Ghost: "Voltar ao início" → `/`
3. Marcar `couple.journey_status = 'complete'` no estado.

---

### 5.9 `/casamento/[slug]` — Site do casamento gerado

**Objetivo:** o grand finale. Um site de casamento de verdade, gerado a partir dos dados do casal.

**O slug** é gerado a partir dos nomes: `"ana-pedro"`, `"maria-lucas"`, etc.

**Layout editorial distinto** — este site tem identidade própria, como se fosse um save-the-date digital:

1. **Hero em tela cheia (100vh)**
   - Imagem de fundo: cover do venue escolhido pelo casal (categoria `local`)
   - Overlay escuro 70%
   - Conteúdo centralizado em branco:
     - Ornamento `◇` pequeno no topo
     - Overline: `CASAMENTO`
     - Display gigante: **"{nome_1}**<br>**&**<br>**{nome_2}"** (cada nome em uma linha, & centralizado menor)
     - Data em formato extenso: "15 de março de 2027"
     - Cidade: "São Paulo, SP"

2. **Seção "Nossa história"** (`bg-background`, py-24)
   - Ornamento divisor
   - Heading H2 centralizado: "Nossa história"
   - Quote do `dream_text` do onboarding, em italic display, `max-w-2xl mx-auto text-center`, tamanho grande

3. **Seção "Quem faz parte do nosso dia"** (`bg-muted`, py-24)
   - Heading H2 centralizado
   - Grid responsivo (2/3 colunas) dos profissionais escolhidos
   - Cada card:
     - Overline com nome da categoria
     - Foto em `aspect-[4/3]` com `hover:scale-105`
     - Nome do profissional em display
     - Cidade em muted-foreground

4. **Seção "Save the date"** (`bg-background`, py-24)
   - Centralizado
   - Ornamento
   - "Esperamos vocês em"
   - Data + local em display grande
   - Mapa do local (imagem estática pode servir como placeholder)

5. **Footer sutil**
   - Linha centralizada: "Planejado com carinho pela **we.wedme**"
   - Link discreto para a home

---

## 6. Gatilhos mentais de venda (a "inteligência" que o casal sente)

Esta é a parte mais sofisticada da lógica do protótipo. Os gatilhos são **mensagens contextuais** que aparecem em momentos específicos da jornada para aumentar conversão. Eles precisam ser avaliados dinamicamente contra o estado do casal e renderizados com elegância.

### 6.1 Como funcionam

Em `src/data/triggers.ts`, definir um array de regras. Em cada navegação que envolva o casal, uma função `evaluateTriggers(state)` percorre as regras e retorna as que batem, ordenadas por prioridade.

```typescript
type TriggerRule = {
  slug: string
  name: string // uso interno
  priority: number // maior = aparece primeiro
  conditions: Condition[] // todas precisam bater (AND)
  once: boolean // só dispara uma vez por casal
  position: 'top_bar' | 'inline_card' | 'floating_badge' | 'modal'
  style: 'subtle' | 'normal' | 'prominent'
  content: {
    icon?: string // nome lucide
    title: string
    body: string
    cta_text?: string
    cta_href?: string
  }
}

type Condition =
  | { type: 'categories_selected_gte'; value: number }
  | { type: 'categories_selected_lte'; value: number }
  | { type: 'total_confirmed_gte'; value: number }
  | { type: 'total_confirmed_between'; min: number; max: number }
  | { type: 'profile_is'; value: string }
  | { type: 'days_since_onboarding_gte'; value: number }
  | { type: 'category_selected'; slug: string }
  | { type: 'category_not_selected'; slug: string }
```

### 6.2 Regras concretas a implementar (7 gatilhos)

Cada copy abaixo é **final** — não é sugestão. Os gatilhos funcionam porque combinam reciprocidade, prova social específica, escassez concreta e personalização ao perfil. Use exatamente essas palavras.

1. **Boas-vindas ao caminho** (reciprocidade + personalização)
   - Condição: `categories_selected_lte: 0` em `/planejamento`
   - Posição: `inline_card` no topo do planejamento
   - Estilo: `prominent`
   - Ícone: `Sparkles`
   - Conteúdo: "Bem-vindos, **{nome_1} e {nome_2}**. Montamos este caminho olhando para o sonho de vocês — começando por **{primeira_categoria}**, que é onde tudo costuma fazer mais diferença para casamentos **{profile.name}**."

2. **Primeira escolha confirmada** (efeito de progresso)
   - Condição: `categories_selected_gte: 1`, `once: true`
   - Posição: `top_bar`
   - Estilo: `normal`
   - Ícone: `Sparkles`
   - Conteúdo: "Primeira escolha feita. Daqui pra frente, a cada categoria confirmada, o casamento de vocês vai tomando forma — e a gente já começa a mover as peças por trás."

3. **Brinde por 3 confirmações** (reciprocidade + tangibilidade)
   - Condição: `categories_selected_gte: 3`, `once: true`
   - Posição: `modal` (abre uma vez, dismissível)
   - Estilo: `prominent`
   - Ícone: `Gift`
   - Conteúdo:
     - Título: "Um presente nosso pra vocês"
     - Corpo: "Vocês acabam de confirmar 3 categorias. Como reconhecimento, estamos oferecendo um **ensaio pré-wedding completo** com um dos nossos fotógrafos parceiros — por nossa conta. É nosso jeito de dizer obrigado."
     - CTA: "Aceitar presente"

4. **Prova social específica ao perfil** (social proof + pertencimento)
   - Condição: entrando em `/planejamento/[categoria]` sem seleção nessa categoria
   - Posição: `inline_card` no topo da lista, acima do grid
   - Estilo: `subtle`
   - Ícone: `Users`
   - Conteúdo: "Outros casais com perfil **{profile.name}** que casaram em **{cidade}** no último trimestre escolheram, em média, o **{segundo_profissional_do_grid}** para esta categoria. Vocês podem explorar por conta — mas achamos justo vocês saberem."
   - **Nota:** esta é a prova social específica que o casal sente como "ok, esses são os nossos". Gerar aleatoriamente é trair a promessa — usar os `example_venues`/`example_vendors` do perfil para montar esta linha de forma consistente.

5. **Escassez concreta de data** (urgência sem manipulação)
   - Condição: entrando em `/oferta/[slug]` com `wedding_date` definida
   - Posição: `floating_badge` canto inferior direito
   - Estilo: `subtle`
   - Ícone: `Clock`
   - Conteúdo: "**{formato extenso da data do casal}**: este profissional tem esta data livre — mas tem outra proposta aberta para o mesmo fim de semana. Normalmente definem em 72 horas."
   - **Importante:** só aparece se a data do vendor estiver realmente "disponível" nos dados mockados. Se indisponível, não aparece (ou aparece um card vermelho sutil no lugar: "Este profissional não tem a data de vocês — podemos sugerir equivalentes?").

6. **Loss aversion no checkout abandonado** (o gatilho mais importante)
   - Condição: tem ≥ 3 seleções E está em `/meu-casamento` E total confirmado ≥ R$20.000
   - Posição: `top_bar`
   - Estilo: `normal`
   - Ícone: `ShieldCheck`
   - Conteúdo: "Vocês já travaram **R$ {total_confirmado}** em profissionais. A reserva fica garantida por **48 horas** — depois disso, os preços podem mudar. Podemos finalizar?" + CTA "Ir ao checkout →"

7. **Quase lá — faltam R$X** (meta próxima)
   - Condição: `total_confirmed_between { min: budget*0.7, max: budget*0.95 }`
   - Posição: `inline_card` no dashboard
   - Estilo: `normal`
   - Ícone: `Target`
   - Conteúdo: "Vocês estão a **R$ {diferença}** de completar o orçamento de R$ {orçamento}. A única categoria importante ainda aberta é **{próxima_categoria_pendente}** — e é aí que o casamento de vocês ganha a cara final."

### 6.3 Como renderizar os 4 estilos de posição

- **`top_bar`**: faixa full-width acima do conteúdo da página, bg-primary/5, border-bottom border-primary/20, altura ~72px, layout horizontal (ícone + texto + CTA + X dismiss à direita)
- **`inline_card`**: card padrão (`bg-card border border-border rounded-md p-6 shadow-sm`) com borda lateral esquerda `border-l-4 border-primary`, aparece entre seções do conteúdo
- **`floating_badge`**: `fixed bottom-6 right-6 bg-card border border-border rounded-md shadow-xl p-4 max-w-xs z-40`, slide-in pela direita, X para fechar
- **`modal`**: shadcn Dialog centralizado, backdrop escurecido — usar apenas para gatilhos muito importantes

**Estilo visual:**
- `subtle`: texto muted-foreground, ícone primary/50
- `normal`: texto foreground, ícone primary, título em display medium
- `prominent`: bg-primary text-primary-foreground, título em display grande

**Dismissibilidade:** todos têm X no canto. Clicar no X grava o slug em `dismissed_triggers[]` do estado para não aparecer mais.

---

## 7. Perfis de casamento (5 perfis)

Salvar em `src/data/profiles.ts`:

```typescript
export const profiles = [
  {
    slug: 'classico-atemporal',
    name: 'Clássico Atemporal',
    description: 'Vocês sonham com tradições, elegância e detalhes que atravessam gerações. Um casamento refinado, com cerimônia formal e celebração que respira sofisticação.',
    detection_keywords: ['tradição', 'tradicional', 'clássico', 'elegante', 'elegância', 'família', 'igreja', 'formal', 'cerimônia', 'refinado', 'sofisticado'],
    default_path_categories: ['local', 'fotografia', 'buffet', 'decoracao', 'flores', 'roupas-noiva', 'festa-musica', 'convites'],
    accent_color: '#7F0E4A',
    example_venues: ['welucci-fagundes', 'welucci-the-one', 'patio-welucci'],
  },
  {
    slug: 'intimo-emocional',
    name: 'Íntimo & Emocional',
    description: 'Um casamento pequeno, onde cada convidado importa e cada detalhe conta uma história. A emoção acima de tudo — e a certeza de que menos pode ser muito mais.',
    detection_keywords: ['íntimo', 'intimista', 'pequeno', 'emoção', 'emocionante', 'aconchegante', 'simples', 'mini wedding', 'poucos convidados', 'perto', 'amor'],
    default_path_categories: ['local', 'fotografia', 'decoracao', 'flores', 'buffet', 'roupas-noiva'],
    accent_color: '#C45F9B',
    example_venues: ['welucci-single', 'casa-welucci', 'welucci-sansu'],
  },
  {
    slug: 'minimalista-moderno',
    name: 'Minimalista Moderno',
    description: 'Design contemporâneo, paleta sóbria e uma celebração sem excessos. Só o que importa, feito com excelência — arquitetura, luz e atmosfera no lugar do exagero.',
    detection_keywords: ['minimalista', 'moderno', 'clean', 'design', 'sóbrio', 'contemporâneo', 'arquitetura', 'preto e branco', 'geométrico', 'urbano'],
    default_path_categories: ['local', 'fotografia', 'decoracao', 'buffet', 'festa-musica', 'roupas-noiva'],
    accent_color: '#0C0106',
    example_venues: ['welucci-the-one', 'welucci-village', 'welucci-single'],
  },
  {
    slug: 'natureza-destination',
    name: 'Natureza & Destination',
    description: 'Ao ar livre, cercados de verde, pé na areia ou debaixo de uma figueira centenária. Um casamento que respira liberdade e conexão com o lugar.',
    detection_keywords: ['natureza', 'ar livre', 'verde', 'praia', 'campo', 'destination', 'sol', 'pôr do sol', 'vista', 'ao ar livre', 'outdoor', 'jardim', 'sítio'],
    default_path_categories: ['local', 'fotografia', 'decoracao', 'flores', 'buffet', 'festa-musica'],
    accent_color: '#5C7F4A',
    example_venues: ['welucci-vila-real', 'welucci-ocean', 'welucci-sansu', 'welucci-fontana'],
  },
  {
    slug: 'grande-celebracao',
    name: 'Grande Celebração',
    description: 'Muitos convidados, festa até o sol nascer, pista cheia e comemoração sem medida. A alegria coletiva como protagonista — o tipo de casamento que vira história.',
    detection_keywords: ['festa', 'grande', 'muitos convidados', 'dança', 'música', 'animado', 'até o amanhecer', 'celebração', 'comemorar', 'balada', 'pista'],
    default_path_categories: ['local', 'festa-musica', 'buffet', 'fotografia', 'decoracao', 'flores', 'roupas-noiva'],
    accent_color: '#7F0E4A',
    example_venues: ['welucci-estaiada', 'patio-welucci', 'welucci-kratos'],
  },
] as const
```

**Fallback local:** se a IA não responder, a função `fakeClassify(text)` faz lowercase + split em palavras + conta matches contra `detection_keywords` de cada perfil → escolhe o maior. Se empatar em zero, retorna `classico-atemporal` como default.

---

## 8. Venues Welucci (dados + imagens reais)

Salvar em `src/data/venues.ts`. Estes são os 13 locais da categoria `local`. **Usar as URLs exatamente como listadas** — são imagens públicas reais.

```typescript
export const venues = [
  {
    slug: 'welucci-estaiada',
    name: 'Welucci Estaiada',
    category: 'local',
    tagline: 'O seu casamento em um cartão postal de São Paulo',
    city: 'São Paulo', state: 'SP', neighborhood: 'Cidade Monções',
    tier: 1,
    highlights: ['Vista para Ponte Estaiada', 'Arquitetura moderna e versátil', 'Iluminação cênica climatizada'],
    bio: 'O Welucci Estaiada é um dos espaços mais icônicos para casamentos em São Paulo, com vista privilegiada para a Ponte Estaiada. Arquitetura contemporânea, iluminação cênica climatizada e ambientes versáteis que acolhem desde cerimônias intimistas até grandes celebrações.',
    cover: 'https://welucci.com/wp-content/uploads/2026/01/Capa-principal-Home_11zon-scaled.jpg',
    portfolio: [
      'https://welucci.com/wp-content/uploads/2026/01/wetogether-0009-1_11zon-scaled.jpg',
      'https://welucci.com/wp-content/uploads/2026/01/debutante-0156_11zon-scaled.jpg',
      'https://welucci.com/wp-content/uploads/2026/01/debutante-0135_11zon-scaled.jpg',
      'https://welucci.com/wp-content/uploads/2026/01/debutante-0131_11zon-scaled.jpg',
      'https://welucci.com/wp-content/uploads/2026/01/debutante-0127_11zon-scaled.jpg',
      'https://welucci.com/wp-content/uploads/2026/01/debutante-0123_11zon-scaled.jpg',
      'https://welucci.com/wp-content/uploads/2026/01/debutante-0118_11zon-scaled.jpg',
      'https://welucci.com/wp-content/uploads/2026/01/debutante-0068_11zon-scaled.jpg',
    ],
    rating: 4.9, total_reviews: 87,
    packages: [
      { id: 'essencial', name: 'Pacote Essencial', price: 25000, includes: ['Locação do espaço por 8h', 'Climatização', 'Iluminação cênica', 'Equipe de apoio'], excludes: ['Buffet', 'Decoração'] },
      { id: 'premium', name: 'Pacote Premium', price: 42000, includes: ['Locação do espaço por 12h', 'Climatização', 'Iluminação cênica premium', 'Equipe completa', 'Suíte para noiva', 'Welcome drink'], excludes: [] },
    ],
    unavailable_dates: ['2027-03-14', '2027-03-15'],
  },
  {
    slug: 'patio-welucci',
    name: 'Pátio Welucci', category: 'local',
    tagline: 'O espaço à altura das histórias que merecem ser celebradas',
    city: 'São Paulo', state: 'SP', neighborhood: 'Brooklin',
    tier: 1,
    highlights: ['Design contemporâneo', 'Integração interno/externo', 'Ideal para grandes casamentos'],
    bio: 'O Pátio Welucci combina design contemporâneo com a amplitude necessária para grandes casamentos. A integração entre áreas internas e externas permite celebrações versáteis que fluem naturalmente do dia para a noite.',
    cover: 'https://welucci.com/wp-content/uploads/2025/10/patio-welucci-card-home.webp',
    portfolio: [
      'https://welucci.com/wp-content/uploads/2025/10/AnyConv.com__IMG_0378-1-2.webp',
      'https://welucci.com/wp-content/uploads/2025/10/AnyConv.com__Casamento-Adriana-e-Guilherme_-176-2-3.webp',
      'https://welucci.com/wp-content/uploads/2025/10/AnyConv.com__thi_previa_CamilaDanilo_044-2.webp',
      'https://welucci.com/wp-content/uploads/2025/10/AnyConv.com__thi_previa_CamilaDanilo_024-1.webp',
      'https://welucci.com/wp-content/uploads/2025/10/AnyConv.com__IMG_0378-9.webp',
      'https://welucci.com/wp-content/uploads/2025/10/AnyConv.com__CBT-10327-1.webp',
      'https://welucci.com/wp-content/uploads/2025/10/AnyConv.com__Anna-e-Bruno_0770-2-1.webp',
    ],
    rating: 4.8, total_reviews: 64,
    packages: [
      { id: 'essencial', name: 'Pacote Essencial', price: 28000, includes: ['Locação por 8h', 'Climatização', 'Estrutura completa'], excludes: ['Buffet', 'Decoração'] },
      { id: 'premium', name: 'Pacote Premium', price: 48000, includes: ['Locação por 12h', 'Welcome drink', 'Suíte dos noivos', 'Equipe completa'], excludes: [] },
    ],
    unavailable_dates: [],
  },
  {
    slug: 'welucci-gardens',
    name: 'Welucci Gardens', category: 'local',
    tagline: 'O espaço que transformou o conceito de casar em São Paulo',
    city: 'São Paulo', state: 'SP', neighborhood: 'Alto de Pinheiros',
    tier: 1,
    highlights: ['SPA exclusivo para noiva', 'Jardins cinematográficos', 'Renovado em 2023'],
    bio: 'Welucci Gardens redefine o que é casar em São Paulo. Jardins cinematográficos, SPA exclusivo para a noiva e espaços renovados em 2023 — cada detalhe foi pensado para que o dia seja perfeito do começo ao fim.',
    cover: 'https://welucci.com/wp-content/uploads/2025/10/welucci-gardens-4.webp',
    portfolio: [
      'https://welucci.com/wp-content/uploads/2025/10/AnyConv.com__thi_previa_CamilaDanilo_044-1-1.webp',
      'https://welucci.com/wp-content/uploads/2025/10/BANNER-6.webp',
      'https://welucci.com/wp-content/uploads/2025/10/AnyConv.com__thi_previa_CamilaDanilo_044-7.webp',
      'https://welucci.com/wp-content/uploads/2025/10/AnyConv.com__thi_previa_CamilaDanilo_024-5.webp',
      'https://welucci.com/wp-content/uploads/2025/10/AnyConv.com__CBT-10327-8.webp',
      'https://welucci.com/wp-content/uploads/2025/10/AnyConv.com__Casamento-Adriana-e-Guilherme_-176-4-5.webp',
      'https://welucci.com/wp-content/uploads/2025/10/AnyConv.com__Anna-e-Bruno_0770-5-3.webp',
    ],
    rating: 4.9, total_reviews: 102,
    packages: [
      { id: 'essencial', name: 'Pacote Essencial', price: 32000, includes: ['Locação por 8h', 'Jardins', 'SPA da noiva'], excludes: ['Buffet'] },
      { id: 'premium', name: 'Pacote Premium', price: 55000, includes: ['Locação por 14h', 'Jardins', 'SPA completo', 'Suíte', 'Welcome drink'], excludes: [] },
    ],
    unavailable_dates: [],
  },
  {
    slug: 'welucci-the-one',
    name: 'Welucci The One', category: 'local',
    tagline: 'A essência da elegância contemporânea no seu casamento',
    city: 'São Paulo', state: 'SP', neighborhood: 'Jardim Paulista',
    tier: 1,
    highlights: ['Arquitetura autoral', 'Jardim vertical', 'Luz natural privilegiada'],
    bio: 'Welucci The One traduz elegância contemporânea em cada detalhe. Arquitetura autoral, jardim vertical imponente e luz natural privilegiada criam o cenário perfeito para casamentos sofisticados.',
    cover: 'https://welucci.com/wp-content/uploads/2025/10/welucci-the-one-card-home.webp',
    portfolio: [
      'https://welucci.com/wp-content/uploads/2025/10/AnyConv.com__Anna-e-Bruno_0770-4-6.webp',
      'https://welucci.com/wp-content/uploads/2025/10/welucci-the-one-1.webp',
      'https://welucci.com/wp-content/uploads/2025/10/AnyConv.com__thi_previa_CamilaDanilo_044-1-4.webp',
      'https://welucci.com/wp-content/uploads/2025/10/AnyConv.com__Anna-e-Bruno_0770-5-5.webp',
      'https://welucci.com/wp-content/uploads/2025/10/AnyConv.com__Casamento-Adriana-e-Guilherme_-168-4-5.webp',
      'https://welucci.com/wp-content/uploads/2025/10/AnyConv.com__CBT-10320-16.webp',
      'https://welucci.com/wp-content/uploads/2025/10/AnyConv.com__thi_previa_CamilaDanilo_024-7.webp',
    ],
    rating: 4.9, total_reviews: 71,
    packages: [
      { id: 'essencial', name: 'Pacote Essencial', price: 30000, includes: ['Locação por 8h', 'Jardim vertical', 'Climatização'], excludes: [] },
      { id: 'premium', name: 'Pacote Premium', price: 52000, includes: ['Locação por 12h', 'Welcome drink', 'Suíte'], excludes: [] },
    ],
    unavailable_dates: [],
  },
  {
    slug: 'casa-welucci',
    name: 'Casa Welucci', category: 'local',
    tagline: 'Onde elegância, conforto e propósito se encontram',
    city: 'São Paulo', state: 'SP', neighborhood: 'Morumbi',
    tier: 3,
    highlights: ['Jardim vertical', 'Totalmente personalizável', 'Fácil acesso'],
    bio: 'A Casa Welucci une elegância e conforto em um espaço totalmente personalizável. Seu jardim vertical e a atmosfera acolhedora fazem dela a escolha ideal para casamentos que valorizam a personalização.',
    cover: 'https://welucci.com/wp-content/uploads/2025/10/casa-welucci-2-1.webp',
    portfolio: [
      'https://welucci.com/wp-content/uploads/2025/10/Casamento-Adriana-e-Guilherme_-176-2.webp',
      'https://welucci.com/wp-content/uploads/2025/10/Casamento-Adriana-e-Guilherme_-176-2-1.webp',
      'https://welucci.com/wp-content/uploads/2025/10/Casamento-Adriana-e-Guilherme_-176-3-1.webp',
      'https://welucci.com/wp-content/uploads/2025/10/Casamento-Adriana-e-Guilherme_-176-5-1.webp',
      'https://welucci.com/wp-content/uploads/2025/10/Casamento-Adriana-e-Guilherme_-176-7-1.webp',
      'https://welucci.com/wp-content/uploads/2025/10/Casamento-Adriana-e-Guilherme_-176-9-1.webp',
    ],
    rating: 4.8, total_reviews: 53,
    packages: [
      { id: 'essencial', name: 'Pacote Essencial', price: 18000, includes: ['Locação por 8h', 'Estrutura básica'], excludes: ['Buffet', 'Decoração'] },
      { id: 'premium', name: 'Pacote Premium', price: 32000, includes: ['Locação por 10h', 'Welcome drink', 'Suíte'], excludes: [] },
    ],
    unavailable_dates: [],
  },
  {
    slug: 'welucci-village',
    name: 'Welucci Village', category: 'local',
    tagline: 'Um espaço projetado para acolher o amor e o extraordinário',
    city: 'São Paulo', state: 'SP', neighborhood: 'Vila Leopoldina',
    tier: 3,
    highlights: ['Teto de vidro', 'Parede retrátil', 'Recém renovado'],
    bio: 'O Welucci Village tem teto de vidro, parede retrátil e recebeu renovação completa. É o espaço que traduz versatilidade em cada detalhe — ideal para casamentos que combinam intimidade e amplitude.',
    cover: 'https://welucci.com/wp-content/uploads/2025/10/welucci-village-3-1.webp',
    portfolio: [
      'https://welucci.com/wp-content/uploads/2025/10/AnyConv.com__CBT-10320-7.webp',
      'https://welucci.com/wp-content/uploads/2026/03/07_03_26-62.jpg',
      'https://welucci.com/wp-content/uploads/2026/03/28_02_26-61.jpg',
      'https://welucci.com/wp-content/uploads/2026/03/07_03_26-50.jpg',
      'https://welucci.com/wp-content/uploads/2026/03/07_03_26-31.jpg',
      'https://welucci.com/wp-content/uploads/2026/03/07_03_26-10.jpg',
    ],
    rating: 4.7, total_reviews: 41,
    packages: [
      { id: 'essencial', name: 'Pacote Essencial', price: 22000, includes: ['Locação por 8h', 'Teto de vidro'], excludes: [] },
      { id: 'premium', name: 'Pacote Premium', price: 38000, includes: ['Locação por 12h', 'Welcome drink', 'Suíte'], excludes: [] },
    ],
    unavailable_dates: [],
  },
  {
    slug: 'welucci-single',
    name: 'Welucci Single', category: 'local',
    tagline: 'Quando o momento é único, o espaço precisa ser singular',
    city: 'São Paulo', state: 'SP', neighborhood: 'Moema',
    tier: 3,
    highlights: ['Estilo Nova York', 'Jardins de inverno', 'Casamentos intimistas'],
    bio: 'O Welucci Single traz inspiração nova-iorquina para casamentos intimistas em São Paulo. Jardins de inverno, atmosfera urbana sofisticada e escala humana — para celebrações que privilegiam a proximidade.',
    cover: 'https://welucci.com/wp-content/uploads/2025/11/Single-5.webp',
    portfolio: [
      'https://welucci.com/wp-content/uploads/2025/11/Single-7.webp',
      'https://welucci.com/wp-content/uploads/2025/11/Single-6.webp',
      'https://welucci.com/wp-content/uploads/2025/11/Single-12.webp',
      'https://welucci.com/wp-content/uploads/2025/11/Single-3.webp',
      'https://welucci.com/wp-content/uploads/2025/11/Single-10.webp',
      'https://welucci.com/wp-content/uploads/2025/11/Single-4.webp',
    ],
    rating: 4.8, total_reviews: 37,
    packages: [
      { id: 'essencial', name: 'Pacote Essencial', price: 20000, includes: ['Locação por 8h'], excludes: [] },
      { id: 'premium', name: 'Pacote Premium', price: 35000, includes: ['Locação por 10h', 'Suíte', 'Welcome drink'], excludes: [] },
    ],
    unavailable_dates: [],
  },
  {
    slug: 'welucci-vila-real',
    name: 'Welucci Vila Real', category: 'local',
    tagline: 'Cercado por verde, luz natural e beleza em cada detalhe',
    city: 'Embu das Artes', state: 'SP',
    tier: 2,
    highlights: ['16.000 m² de área verde', 'Cerimônia ao ar livre', 'Campo perto da capital'],
    bio: 'Welucci Vila Real oferece 16.000 m² de área verde a poucos minutos da capital. Cerimônias ao ar livre, campo cuidado e a sensação de imersão na natureza sem abrir mão da sofisticação.',
    cover: 'https://welucci.com/wp-content/uploads/2025/10/welucci-vila-real-card-home.webp',
    portfolio: [
      'https://welucci.com/wp-content/uploads/2025/10/AnyConv.com__Anna-e-Bruno_0770-1.webp',
      'https://welucci.com/wp-content/uploads/2025/10/AnyConv.com__IMG_0378-1-6.webp',
      'https://welucci.com/wp-content/uploads/2025/10/AnyConv.com__CBT-10320-6.webp',
      'https://welucci.com/wp-content/uploads/2025/10/AnyConv.com__thi_previa_CamilaDanilo_044-5.webp',
      'https://welucci.com/wp-content/uploads/2025/10/AnyConv.com__IMG_0378-12.webp',
      'https://welucci.com/wp-content/uploads/2025/10/AnyConv.com__CBT-10327-4.webp',
    ],
    rating: 4.9, total_reviews: 58,
    packages: [
      { id: 'essencial', name: 'Pacote Essencial', price: 24000, includes: ['Locação por 10h', 'Cerimônia ao ar livre'], excludes: [] },
      { id: 'premium', name: 'Pacote Premium', price: 42000, includes: ['Locação por 14h', 'Suíte', 'Welcome drink'], excludes: [] },
    ],
    unavailable_dates: [],
  },
  {
    slug: 'welucci-fagundes',
    name: 'Welucci Fagundes', category: 'local',
    tagline: 'Onde o início da sua história encontra séculos de tradição',
    city: 'Mairiporã', state: 'SP',
    tier: 2,
    highlights: ['Casarão colonial 1730–1750', 'Deck com vista para lago', 'Salão de 550 m²'],
    bio: 'Welucci Fagundes é um casarão colonial dos anos 1730-1750, com deck sobre o lago e salão principal de 550m². História viva, natureza preservada e o peso dos séculos a favor do seu grande dia.',
    cover: 'https://welucci.com/wp-content/uploads/2026/02/frente-casa-lago-2-1-scaled.jpg',
    portfolio: [
      'https://welucci.com/wp-content/uploads/2026/02/MOH05780-1.jpg',
      'https://welucci.com/wp-content/uploads/2026/02/0F1A3914.jpg',
      'https://welucci.com/wp-content/uploads/2026/02/0F1A4105-1.jpg',
      'https://welucci.com/wp-content/uploads/2026/02/2fc01366-6184-4844-851f-1991b8fa46a4-1.jpg',
      'https://welucci.com/wp-content/uploads/2026/02/AR09760008-1.jpg',
      'https://welucci.com/wp-content/uploads/2026/02/AR09760106-1.jpg',
    ],
    rating: 4.9, total_reviews: 46,
    packages: [
      { id: 'essencial', name: 'Pacote Essencial', price: 35000, includes: ['Locação por 12h', 'Casarão + deck'], excludes: [] },
      { id: 'premium', name: 'Pacote Premium', price: 58000, includes: ['Locação por 16h', 'Suíte colonial', 'Welcome drink', 'Receptivo'], excludes: [] },
    ],
    unavailable_dates: [],
  },
  {
    slug: 'welucci-sansu',
    name: 'Welucci Sansu', category: 'local',
    tagline: 'Onde o pôr do sol encontra o "sim" mais importante da sua vida',
    city: 'Araçoiaba da Serra', state: 'SP',
    tier: 2,
    highlights: ['Chapel de cristal único no Brasil', 'Pôr do sol espetacular', 'Mini e grandes weddings'],
    bio: 'Welucci Sansu tem a única chapel de cristal do Brasil, emoldurada por um pôr do sol espetacular. Versátil para mini weddings ou grandes celebrações, é o cenário perfeito para quem sonha com o "sim" ao entardecer.',
    cover: 'https://welucci.com/wp-content/uploads/2025/10/welucci-sansu-5.webp',
    portfolio: [
      'https://welucci.com/wp-content/uploads/2025/10/AnyConv.com__Anna-e-Bruno_0770-4-2.webp',
      'https://welucci.com/wp-content/uploads/2025/10/AnyConv.com__Anna-e-Bruno_0770-4-3.webp',
      'https://welucci.com/wp-content/uploads/2025/10/AnyConv.com__CBT-10320-12.webp',
      'https://welucci.com/wp-content/uploads/2025/10/AnyConv.com__IMG_0378-14.webp',
      'https://welucci.com/wp-content/uploads/2025/10/AnyConv.com__IMG_0378-3-3.webp',
      'https://welucci.com/wp-content/uploads/2025/10/AnyConv.com__IMG_0378-4-3.webp',
    ],
    rating: 4.9, total_reviews: 52,
    packages: [
      { id: 'essencial', name: 'Pacote Essencial', price: 28000, includes: ['Locação por 10h', 'Chapel de cristal'], excludes: [] },
      { id: 'premium', name: 'Pacote Premium', price: 48000, includes: ['Locação por 14h', 'Suíte', 'Welcome drink'], excludes: [] },
    ],
    unavailable_dates: [],
  },
  {
    slug: 'welucci-fontana',
    name: 'Welucci Fontana', category: 'local',
    tagline: 'A vila italiana da Welucci no interior de São Paulo',
    city: 'Votorantim', state: 'SP',
    tier: 3,
    highlights: ['Figueira centenária de +200 anos', '+40.000 m² estilo veneziano', 'Palacete de 1932'],
    bio: 'Welucci Fontana é uma vila italiana de +40.000 m² no interior paulista, com palacete de 1932 e uma figueira centenária de mais de 200 anos. Cenário cinematográfico para casamentos que querem escrever história.',
    cover: 'https://welucci.com/wp-content/uploads/2025/10/welucci-fontana-7-1.webp',
    portfolio: [
      'https://welucci.com/wp-content/uploads/2025/10/AnyConv.com__IMG_0378-17.webp',
      'https://welucci.com/wp-content/uploads/2025/10/AnyConv.com__IMG_0378-2-12.webp',
      'https://welucci.com/wp-content/uploads/2025/10/AnyConv.com__IMG_0378-18.webp',
      'https://welucci.com/wp-content/uploads/2025/10/AnyConv.com__CBT-10327-10.webp',
      'https://welucci.com/wp-content/uploads/2025/10/AnyConv.com__Casamento-Adriana-e-Guilherme_-176-6-3.webp',
      'https://welucci.com/wp-content/uploads/2025/10/AnyConv.com__Anna-e-Bruno_0770-4-9.webp',
    ],
    rating: 4.8, total_reviews: 39,
    packages: [
      { id: 'essencial', name: 'Pacote Essencial', price: 30000, includes: ['Locação por 12h', 'Palacete + jardins'], excludes: [] },
      { id: 'premium', name: 'Pacote Premium', price: 52000, includes: ['Locação por 16h', 'Hospedagem', 'Welcome drink'], excludes: [] },
    ],
    unavailable_dates: [],
  },
  {
    slug: 'welucci-kratos',
    name: 'Welucci Kratos', category: 'local',
    tagline: 'Imponente e sofisticado — à altura da sua história de amor',
    city: 'Vinhedo', state: 'SP',
    tier: 2,
    highlights: ['Chapel piramidal instagramável', '150 vagas com valet', '30 min de São Paulo'],
    bio: 'Welucci Kratos impressiona pela chapel piramidal instagramável e pela escala — 150 vagas com valet, a apenas 30 minutos de São Paulo. Um cenário imponente para casamentos que não passam despercebidos.',
    cover: 'https://welucci.com/wp-content/uploads/2025/11/BANNER-4.jpeg',
    portfolio: [
      'https://welucci.com/wp-content/uploads/2025/11/Kratos-19.webp',
      'https://welucci.com/wp-content/uploads/2025/11/Kratos-15.webp',
      'https://welucci.com/wp-content/uploads/2025/11/Kratos-18.webp',
      'https://welucci.com/wp-content/uploads/2025/11/Kratos-13.webp',
      'https://welucci.com/wp-content/uploads/2025/11/Kratos-17.webp',
      'https://welucci.com/wp-content/uploads/2025/11/Kratos-2.webp',
    ],
    rating: 4.8, total_reviews: 44,
    packages: [
      { id: 'essencial', name: 'Pacote Essencial', price: 32000, includes: ['Locação por 10h', 'Chapel piramidal'], excludes: [] },
      { id: 'premium', name: 'Pacote Premium', price: 54000, includes: ['Locação por 14h', 'Welcome drink', 'Suíte'], excludes: [] },
    ],
    unavailable_dates: [],
  },
  {
    slug: 'welucci-ocean',
    name: 'Welucci Ocean', category: 'local',
    tagline: 'O cenário perfeito para um casamento inesquecível à beira-mar',
    city: 'Guarujá', state: 'SP', neighborhood: 'Praia do Pernambuco',
    tier: 2,
    highlights: ['Deck pé na areia', 'Rooftop com vista para o mar', '10 quartos de hospedagem'],
    bio: 'Welucci Ocean é beira-mar em sua melhor forma: deck pé na areia, rooftop com vista para o oceano e 10 quartos de hospedagem. Um destination wedding sem precisar sair do estado.',
    cover: 'https://welucci.com/wp-content/uploads/2026/03/DSC02431-1-scaled.jpg',
    portfolio: [
      'https://welucci.com/wp-content/uploads/2026/03/DSC02471-scaled.jpg',
      'https://welucci.com/wp-content/uploads/2026/03/DSC02574-scaled.jpg',
      'https://welucci.com/wp-content/uploads/2026/03/DSC02638-scaled.jpg',
      'https://welucci.com/wp-content/uploads/2026/03/IMG_4600-scaled.jpg',
      'https://welucci.com/wp-content/uploads/2026/03/IMG_4611-scaled.jpg',
      'https://welucci.com/wp-content/uploads/2026/03/IMG_4617-1-scaled.jpg',
    ],
    rating: 4.9, total_reviews: 48,
    packages: [
      { id: 'essencial', name: 'Pacote Essencial', price: 38000, includes: ['Locação por 14h', 'Deck', 'Rooftop'], excludes: [] },
      { id: 'premium', name: 'Pacote Premium', price: 65000, includes: ['Locação por 24h', '10 quartos', 'Welcome drink', 'Brunch'], excludes: [] },
    ],
    unavailable_dates: [],
  },
] as const
```

---

## 9. Outras categorias e profissionais

Para cada categoria não-`local`, criar **4 a 5 profissionais mockados** com qualidade visual alta. Usar imagens do **Unsplash** com query apropriada. Sempre usar `?w=1400&q=80` nos URLs para otimização.

**Categorias a popular:**

- `fotografia` (5 profissionais) — query: `wedding photographer`, `wedding photography brazil`
- `buffet` (4) — query: `wedding catering`, `wedding food brazil`
- `decoracao` (4) — query: `wedding decoration`, `wedding flowers arch`
- `flores` (4) — query: `wedding bouquet`, `wedding florist`
- `roupas-noiva` (4) — query: `wedding dress`, `bridal gown`
- `festa-musica` (3) — query: `wedding dj`, `wedding band`
- `convites` (3) — query: `wedding invitation card`
- `filmagem` (3) — query: `wedding videographer`

**Schema de cada profissional:**

```typescript
{
  slug: string,
  name: string,
  category: string, // slug da categoria
  tagline: string,
  city: string,
  state: string,
  bio: string, // 2 parágrafos
  cover: string, // URL Unsplash
  portfolio: string[], // 6-8 URLs Unsplash
  verified: boolean,
  rating: number, // 4.5 – 5.0
  total_reviews: number,
  social_proof_line: string, // ex: "23 casais com perfil Clássico Atemporal escolheram este profissional"
  packages: Package[],
  reviews: Review[], // 3 reviews
  unavailable_dates: string[],
}
```

**Nomes sugeridos para profissionais** (inventar, soar brasileiros e elegantes):
- Fotografia: "João Silva Fotografia", "Ateliê Luz & Forma", "Estúdio Matheus Couto", "Marina Arruda Weddings", "Pedro Henrique Visual"
- Buffet: "Ana Castello Buffet", "Chef Laura Ribeiro", "Casa Brunello Gastronomia", "Fratelli Eventos"
- Decoração: "Studio Leila Fontes", "Atelier Marcia Vello", "Vila Floral Design", "Casa 9 Decorações"
- Flores: "Botanique Floral", "Flora & Fauna SP", "Jardim Secreto Atelier"
- Roupas de noiva: "Ateliê Blanche", "Casa Lafayette Noivas", "Studio Mariée", "Lucia Nogueira Noivas"

---

## 10. Dados para a home

```typescript
// src/data/home.ts
export const homeTestimonials = [
  {
    coupleName: 'Ana & Pedro',
    initials: 'AP',
    city: 'São Paulo, SP',
    date: 'março de 2025',
    quote: 'A we.wedme transformou o que seria estresse em pura emoção. Escolhemos tudo em duas semanas — e no dia, foi perfeito.',
  },
  {
    coupleName: 'Maria & Lucas',
    initials: 'ML',
    city: 'Campinas, SP',
    date: 'agosto de 2025',
    quote: 'Nem acredito que planejamos nosso casamento sem precisar falar com mil fornecedores. Cada detalhe foi cuidado pela equipe.',
  },
  {
    coupleName: 'Julia & Rafael',
    initials: 'JR',
    city: 'Guarujá, SP',
    date: 'janeiro de 2026',
    quote: 'Nosso casamento pé na areia foi mágico. A curadoria acertou em cheio — cada profissional entendeu o que a gente sonhava.',
  },
]

export const homeFaq = [
  {
    q: 'Como vocês escolhem os profissionais?',
    a: 'Cada profissional passa por curadoria da nossa equipe. Verificamos portfólio, histórico, CNPJ e avaliações antes de qualquer um aparecer na plataforma.',
  },
  {
    q: 'Preciso falar diretamente com os profissionais?',
    a: 'Não. A gente cuida de tudo — da primeira conversa ao pagamento. Vocês interagem apenas com a plataforma. É por isso que o processo é tão tranquilo.',
  },
  {
    q: 'E se algum imprevisto acontecer no meu dia?',
    a: 'Cada profissional é verificado e tem backup. Se qualquer imprevisto impedir a entrega, substituímos por um equivalente curado — ou devolvemos 100% do valor pago mais R$500 de crédito.',
  },
  {
    q: 'Como funciona o pagamento?',
    a: 'Tudo pela plataforma, com segurança. Vocês confirmam o casamento em uma única tela e nós repassamos aos profissionais conforme o cronograma combinado.',
  },
  {
    q: 'Posso montar o casamento aos poucos?',
    a: 'Sim. Vocês podem voltar quando quiserem e continuar de onde pararam. Suas escolhas ficam salvas.',
  },
]
```

---

## 11. Estado global (Zustand)

```typescript
// src/store/couple.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Selection = {
  category_slug: string
  vendor_slug: string
  package_id: string
  quoted_price: number
  selected_at: string // ISO
}

type ChatTurn = { role: 'user' | 'assistant'; content: string; timestamp: string }

type CoupleState = {
  // Dados do onboarding
  partner_1_name: string | null
  partner_2_name: string | null
  wedding_date: string | null
  city: string | null
  state: string | null
  estimated_budget: number | null
  email: string | null
  // Histórico da conversa de onboarding (para retomar sessão)
  onboarding_history: ChatTurn[]
  onboarding_complete: boolean
  // Sonho e perfil
  dream_text: string | null
  wedding_profile_slug: string | null
  detected_intents: string[]
  profile_confidence: number | null
  // Seleções
  selections: Selection[]
  skipped_categories: string[]
  // Estado da jornada
  journey_status: 'onboarding' | 'exploring' | 'selecting' | 'checkout' | 'complete'
  journey_started_at: string | null
  // Gatilhos
  dismissed_triggers: string[]
  fired_once_triggers: string[]
  // Ações
  applyOnboardingUpdates(updates: Partial<CoupleState>): void
  appendChatTurn(turn: ChatTurn): void
  markOnboardingComplete(): void
  setProfile(slug: string, intents: string[], dreamText: string, confidence: number): void
  addSelection(s: Selection): void
  removeSelection(categorySlug: string): void
  skipCategory(slug: string): void
  dismissTrigger(slug: string): void
  markTriggerFired(slug: string): void
  setStatus(s: CoupleState['journey_status']): void
  reset(): void
}

export const useCouple = create<CoupleState>()(
  persist(
    (set) => ({
      // ... initial state com tudo null/[]
      // ... implementações
    }),
    { name: 'wewedme-couple' }
  )
)
```

**Helper derivados** em `src/lib/couple-helpers.ts`:
- `getSlug(state)`: gera `{nome1}-{nome2}` para URL do site do casamento
- `getTotalConfirmed(state)`: soma de `quoted_price` das seleções
- `getCategoriesOfPath(state)`: categorias na ordem do perfil do casal
- `getProgressPercent(state)`: seleções / total de categorias do path
- `daysSinceOnboarding(state)`: diff de dias

---

## 12. Arquitetura de arquivos

```
protótipo/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── globals.css
│   │   ├── page.tsx                          (home)
│   │   ├── comece/page.tsx
│   │   ├── comece/sonho/page.tsx
│   │   ├── planejamento/page.tsx
│   │   ├── planejamento/[categoria]/page.tsx
│   │   ├── oferta/[slug]/page.tsx
│   │   ├── meu-casamento/page.tsx
│   │   ├── checkout/page.tsx
│   │   ├── casamento/[slug]/page.tsx
│   │   └── api/
│   │       ├── onboarding-step/route.ts
│   │       └── classify-dream/route.ts
│   ├── components/
│   │   ├── ui/                               (shadcn)
│   │   ├── home/
│   │   │   ├── hero.tsx
│   │   │   ├── how-it-works.tsx
│   │   │   ├── numbers.tsx
│   │   │   ├── venues-grid.tsx
│   │   │   ├── testimonials.tsx
│   │   │   ├── faq.tsx
│   │   │   └── footer.tsx
│   │   ├── layout/
│   │   │   ├── public-navbar.tsx
│   │   │   └── couple-navbar.tsx
│   │   ├── onboarding/
│   │   │   ├── chat-bubble.tsx
│   │   │   ├── typing-indicator.tsx
│   │   │   └── dream-loading.tsx
│   │   ├── planejamento/
│   │   │   ├── category-card.tsx
│   │   │   ├── vendor-card.tsx
│   │   │   └── progress-footer.tsx
│   │   ├── oferta/
│   │   │   ├── gallery.tsx
│   │   │   ├── package-card.tsx
│   │   │   └── review-card.tsx
│   │   ├── triggers/
│   │   │   ├── trigger-top-bar.tsx
│   │   │   ├── trigger-inline-card.tsx
│   │   │   ├── trigger-floating-badge.tsx
│   │   │   └── trigger-renderer.tsx         (decide qual componente usar)
│   │   └── ornaments/
│   │       └── divider.tsx
│   ├── data/
│   │   ├── venues.ts                         (13 Welucci)
│   │   ├── vendors.ts                        (outras categorias)
│   │   ├── categories.ts                     (metadata das categorias)
│   │   ├── profiles.ts                       (5 perfis)
│   │   ├── triggers.ts                       (7 regras)
│   │   ├── home.ts                           (testimonials, faq)
│   │   └── packages-library.ts               (opcional, se quiser reusar templates)
│   ├── store/
│   │   └── couple.ts                         (Zustand)
│   ├── lib/
│   │   ├── onboarding-prompt.ts              (system prompt do chat)
│   │   ├── fake-onboarding.ts                (fallback sem API key)
│   │   ├── classify-prompt.ts
│   │   ├── fake-classify.ts                  (fallback local)
│   │   ├── evaluate-triggers.ts
│   │   ├── couple-helpers.ts
│   │   ├── format.ts                         (R$, datas)
│   │   └── cn.ts
│   └── types.ts
├── public/
│   └── logo/
│       └── wewedme-logo.svg                  (placeholder simples em SVG)
├── .env.example                              (ANTHROPIC_API_KEY, OPENAI_API_KEY)
├── next.config.ts                            (permitir domínio welucci.com e unsplash nas images)
├── tailwind.config.ts
├── package.json
└── README.md
```

**`next.config.ts` importante:**

```typescript
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'welucci.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
}
```

---

## 13. APIs — dois Route Handlers

### 13.1 `/api/onboarding-step` — conversa stateful do onboarding

Esta API recebe cada turno da conversa do `/comece` e devolve a próxima jogada da assistente.

```typescript
// src/app/api/onboarding-step/route.ts
import Anthropic from '@anthropic-ai/sdk'
import { NextResponse } from 'next/server'
import { onboardingSystemPrompt } from '@/lib/onboarding-prompt'
import { fakeOnboardingStep } from '@/lib/fake-onboarding'

type CollectedData = {
  partner_1_name?: string
  partner_2_name?: string
  wedding_date?: string
  city?: string
  state?: string
  estimated_budget?: number
  email?: string
}

type ChatTurn = { role: 'user' | 'assistant'; content: string }

export async function POST(req: Request) {
  const body = await req.json()
  const {
    collected_so_far,
    conversation_history,
    user_message,
  }: {
    collected_so_far: CollectedData
    conversation_history: ChatTurn[]
    user_message: string
  } = body

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      fakeOnboardingStep(collected_so_far, user_message)
    )
  }

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

    const response = await client.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 700,
      system: onboardingSystemPrompt,
      tools: [
        {
          name: 'respond_to_couple',
          description: 'Responde ao casal com estado atualizado e próxima pergunta',
          input_schema: {
            type: 'object',
            properties: {
              updates: {
                type: 'object',
                description: 'Campos novos ou corrigidos extraídos da última mensagem',
                properties: {
                  partner_1_name: { type: 'string' },
                  partner_2_name: { type: 'string' },
                  wedding_date: { type: 'string' },
                  city: { type: 'string' },
                  state: { type: 'string' },
                  estimated_budget: { type: 'number' },
                  email: { type: 'string' },
                },
              },
              assistant_reply: {
                type: 'string',
                description: 'Reação calorosa e contextual à resposta do casal',
              },
              next_field_to_ask: {
                type: ['string', 'null'],
                enum: [
                  'partner_names',
                  'wedding_date',
                  'city',
                  'estimated_budget',
                  'email',
                  null,
                ],
              },
              next_question: {
                type: 'string',
                description: 'Próxima pergunta a fazer. Vazio se next_field_to_ask é null.',
              },
              needs_clarification: {
                type: 'boolean',
                description: 'True se a última resposta foi ambígua e precisa re-perguntar.',
              },
            },
            required: [
              'updates',
              'assistant_reply',
              'next_field_to_ask',
              'next_question',
              'needs_clarification',
            ],
          },
        },
      ],
      tool_choice: { type: 'tool', name: 'respond_to_couple' },
      messages: [
        ...conversation_history.map((turn) => ({
          role: turn.role,
          content: turn.content,
        })),
        {
          role: 'user',
          content: `Estado atual coletado: ${JSON.stringify(collected_so_far)}\n\nNova mensagem do casal: "${user_message}"`,
        },
      ],
    })

    const toolUse = response.content.find((c) => c.type === 'tool_use')
    if (!toolUse || toolUse.type !== 'tool_use') {
      throw new Error('No tool use in response')
    }

    return NextResponse.json(toolUse.input)
  } catch (err) {
    console.error('Onboarding step error:', err)
    return NextResponse.json(
      fakeOnboardingStep(collected_so_far, user_message)
    )
  }
}
```

### 13.2 `/api/classify-dream` — classificação do sonho em perfil

```typescript
// src/app/api/classify-dream/route.ts
import Anthropic from '@anthropic-ai/sdk'
import { NextResponse } from 'next/server'
import { fakeClassify } from '@/lib/fake-classify'
import { buildClassifyPrompt } from '@/lib/classify-prompt'

export async function POST(req: Request) {
  const body = await req.json()
  const { dream_text } = body

  if (!dream_text || typeof dream_text !== 'string' || dream_text.length < 10) {
    return NextResponse.json({ error: 'Texto muito curto' }, { status: 400 })
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(fakeClassify(dream_text))
  }

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
    const response = await client.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 512,
      messages: [{ role: 'user', content: buildClassifyPrompt(dream_text) }],
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : ''
    const parsed = JSON.parse(text.trim().replace(/^```json\n?|\n?```$/g, ''))
    return NextResponse.json(parsed)
  } catch (err) {
    console.error('Classify error:', err)
    return NextResponse.json(fakeClassify(dream_text))
  }
}
```

---

## 14. Checklist final de fidelidade

O protótipo só está pronto quando:

- [ ] A home carrega com a foto do Welucci Estaiada no hero e as 13 venues mostradas na seção de espaços
- [ ] Todas as fontes (Cormorant Garamond + Inter) estão carregando e aplicadas corretamente
- [ ] Nenhuma tela usa `bg-white` — o fundo é sempre `bg-background` (creme)
- [ ] Nenhum hex solto em className — só tokens via Tailwind
- [ ] Onboarding é conversacional de verdade: o casal pode responder "Ana e Pedro, casando em Trancoso em março" e a IA extrai nomes + cidade + estado + data da mesma mensagem
- [ ] O assistente reage contextualmente ao conteúdo das respostas (não só coleta dados)
- [ ] Typing indicator aparece antes de cada mensagem nova com duração proporcional ao texto
- [ ] A pergunta do sonho aceita texto e (se Whisper disponível) áudio
- [ ] Ao enviar o sonho, a chamada real para Claude acontece e o perfil detectado é apresentado em tela cinematográfica de pelo menos 3.5 segundos
- [ ] Os fallbacks (onboarding e classificação) funcionam mesmo sem API key, mantendo a demo viável
- [ ] `/planejamento` mostra categorias na ordem do perfil detectado
- [ ] Cada categoria lista profissionais com cards editoriais de qualidade alta
- [ ] `/oferta/[slug]` tem galeria lightbox, pacotes selecionáveis, reviews
- [ ] Ao selecionar um pacote, o estado é atualizado e o casal volta para `/planejamento` com a categoria marcada como escolhida
- [ ] `/meu-casamento` mostra progresso real, seleções reais e gatilhos mentais contextuais
- [ ] Pelo menos 4 dos 7 gatilhos da seção 6 aparecem efetivamente em algum momento da jornada
- [ ] `/checkout` tem mood board gerado automaticamente com as fotos dos escolhidos
- [ ] Ao confirmar no checkout, tela de celebração com confete sutil aparece
- [ ] `/casamento/[slug]` gera um site editorial bonito com todos os dados do casal e profissionais
- [ ] "Reiniciar demo" na navbar limpa o estado e volta tudo para o começo
- [ ] Responsivo em mobile 375px e desktop 1280px
- [ ] Nenhum link quebrado, nenhuma imagem quebrada, nenhum "lorem ipsum" visível

---

## 15. Teste final — "o teste do visitante"

Um visitante senta no computador pela primeira vez, clica em "Planejar meu casamento" na home, e vive isso:

1. No onboarding, na primeira resposta, digita **"Somos Ana e Pedro, queremos casar em Ilhabela em fevereiro de 2027"** — e a assistente reage: *"Ana e Pedro, que maravilha. Ilhabela em fevereiro — praia, vento, pôr do sol. Falta só combinar o orçamento e o email."* **Quatro campos extraídos de uma resposta só.** Essa é a prova de que a IA é real.

2. Digita **"uns 80 pau"** no orçamento — a assistente aceita naturalmente, normaliza para R$ 80.000, e reage.

3. No `/comece/sonho` escreve algo como **"queremos um casamento íntimo e emocionante, ao entardecer, cercado só da família mais próxima"** — vê a tela cinematográfica rodar por ~4 segundos e revelar o perfil **"Íntimo & Emocional"** com intenções detectadas em chips.

4. Chega em `/planejamento` e vê o caminho montado na ordem certa para o perfil — com uma mensagem de boas-vindas personalizada citando o nome dele e a primeira categoria recomendada.

5. Clica em Local, vê os 13 venues, encontra o **Welucci Sansu** destacado como "outros casais com perfil Íntimo & Emocional escolheram este", seleciona o Pacote Essencial.

6. Continua por Fotografia e Buffet, fazendo 3 seleções ao todo.

7. Ao voltar para o dashboard, um **modal discreto aparece** oferecendo "um ensaio pré-wedding completo como presente nosso por vocês terem confirmado 3 categorias".

8. Vai ao checkout, vê o mood board gerado com as capas dos 3 profissionais, confirma.

9. Tela de celebração com confete sutil — sem exagero.

10. Clica em "Ver nosso site de casamento" e chega num site editorial com os nomes dele, o texto que ele escreveu no sonho em italic centralizado, as fotos dos 3 profissionais escolhidos, a data extensa, a cidade.

Se isso acontece ponta a ponta — sem nada quebrar, sem nenhuma tela parecer amadora, e com o visitante sentindo pelo menos uma vez *"caramba, ela entendeu"* — o protótipo está pronto.

---

## 16. Prioridades do implementador

Na ordem:

1. **Sistema de design + fontes + tokens de cor** — antes de qualquer página
2. **Home** — primeira impressão define tudo
3. **Onboarding + integração com Claude API** — o momento "uau" da inteligência
4. **`/planejamento` e `/planejamento/[categoria]`** — o coração da jornada
5. **`/oferta/[slug]` + seleção de pacote** — a decisão acontece aqui
6. **`/meu-casamento` + gatilhos mentais** — a parte mais inteligente visível
7. **`/checkout` + celebração** — o momento emocional
8. **`/casamento/[slug]`** — o prêmio final
9. **Polimento, responsivo, micro-interações, animações**

Não adicione features fora deste documento. Não adicione admin, não adicione login, não adicione fornecedor, não adicione pagamento real. Foco total na experiência do casal e na demonstração da lógica.
