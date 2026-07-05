/**
 * Core brand-analysis handler.
 * Used by both the Vercel serverless function (api/analyze.ts)
 * and the Vite dev-server middleware (vite.config.js).
 *
 * emitter interface: { loading(step), delta(text), done(planName|null), error(message) }
 */

const PLANS_CONTEXT = `
PLANOS DISPONÍVEIS DA YARDEN LAB (use os nomes EXATAMENTE como listados):

1. Diagnóstico Yarden  (Categoria: Entrada)
   Perfil ideal: fundadores e profissionais premium que sentem que o posicionamento não traduz o valor real do que entregam e precisam entender onde estão antes do próximo passo.
   Entrega: diagnóstico de marca em 1 semana — posicionamento, tom de voz, diretrizes visuais, análise com IA.

2. Plano Travessia  (Categoria: Projetos)
   Perfil ideal: negócios em transição de posicionamento que querem estratégia completa com 30 dias de execução demonstrativa antes de comprometer com longo prazo.
   Entrega: plano estratégico completo + 30 dias de execução com IA e captação real.

3. Sprint de Captação  (Categoria: Projetos)
   Perfil ideal: marcas com lançamento, evento ou que precisam recarregar o calendário criativo com conteúdo premium de uma vez.
   Entrega: 30–40 conteúdos editados prontos para 90 dias de presença consistente.

4. Sprint Inteligência  (Categoria: Projetos)
   Perfil ideal: empresas que precisam implementar IA e tecnologia na operação de marca e vendas sem depender de TI interno.
   Entrega: diagnóstico técnico, arquitetura, implementação de ferramentas e IA, 30 dias de suporte.

5. Operação Corrente Light  (Categoria: Recorrente)
   Perfil ideal: profissionais e negócios premium que precisam de presença digital consistente com direção criativa, sem gestão de tráfego pago.
   Entrega: 8 posts + 8 reels/mês, 1 captação, calendário editorial, dashboard com IA, auto-resposta de DM.

6. Operação Corrente Standard  (Categoria: Recorrente)
   Perfil ideal: marcas que querem presença premium aliada a tráfego pago integrado — resultado consistente de vendas com a estética que o negócio merece.
   Entrega: tudo do Light + gestão de tráfego pago + análise trimestral aprofundada.

7. Operação Yarden 360  (Categoria: Recorrente)
   Perfil ideal: marcas premium com ambição real que querem a Yarden Lab como a inteligência de marca da empresa. Para quem entende que crescimento consistente exige método, não sorte.
   Entrega: 12 posts + 8 reels/mês com direção criativa, captação completa mensal, tráfego pago integrado, dashboard custom, IA integrada, reunião quinzenal + relatório executivo.
`

// NODE_ENV is 'development' during `npm run dev`, 'production' on Vercel.
// All security checks are skipped in development so you can test freely.
const IS_PROD = process.env.NODE_ENV === 'production'

// ─── Turnstile ────────────────────────────────────────────────────────────────
async function validateTurnstile(token) {
  if (!IS_PROD) return // skip in development
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) return // skip when secret not configured

  // Sem token (ex: o widget do Cloudflare não autocompletou em alguns mobiles):
  // não bloqueia o usuário — a proteção contra abuso fica por conta do rate-limit.
  // O Turnstile só é validado de forma estrita quando um token É enviado.
  if (!token) return

  const form = new URLSearchParams()
  form.append('secret', secret)
  form.append('response', token)

  try {
    const resp = await fetch('https://challenges.cloudflare.com/turnstile/v1/siteverify', {
      method: 'POST',
      body: form,
    })
    const data = await resp.json()
    if (!data.success) throw new Error('Verificação de segurança falhou. Recarregue a página e tente novamente.')
  } catch (err) {
    // Repassa erro de verificação explícita; ignora falhas de rede (rate-limit protege).
    if (err.message && err.message.includes('Verificação')) throw err
  }
}

// ─── Rate limit ───────────────────────────────────────────────────────────────
async function checkRateLimit(ip) {
  if (!IS_PROD) return // skip in development — test as many times as you want
  const { UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN } = process.env
  if (!UPSTASH_REDIS_REST_URL || !UPSTASH_REDIS_REST_TOKEN) return // skip when not configured

  try {
    const { Redis } = await import('@upstash/redis')
    const redis = new Redis({ url: UPSTASH_REDIS_REST_URL, token: UPSTASH_REDIS_REST_TOKEN })
    const key = `ratelimit:analyze:${ip}`
    const count = await redis.incr(key)
    if (count === 1) await redis.expire(key, 86400) // reset daily
    if (count > 3) {
      throw new Error('Limite de 3 análises por dia atingido. Tente novamente amanhã.')
    }
  } catch (err) {
    if (err.message.includes('Limite')) throw err
    // Redis unavailable — proceed without rate limiting
  }
}

// ─── URL normalizer — accepts meusite.com / www.meusite.com / https://... ─────
function normalizeUrl(raw) {
  const u = raw.trim().replace(/\s+/g, '')
  if (!u) return ''
  if (/^https?:\/\//i.test(u)) return u
  return `https://${u}`
}

// ─── Site enrichment via Jina ─────────────────────────────────────────────────
async function fetchSiteContent(url) {
  const normalized = normalizeUrl(url)
  if (!normalized) return ''
  try {
    const resp = await Promise.race([
      fetch(`https://r.jina.ai/${normalized}`, {
        headers: { Accept: 'text/plain', 'X-Return-Format': 'text' },
      }),
      new Promise((_, r) => setTimeout(() => r(new Error('timeout')), 12000)),
    ])
    if (!resp.ok) return ''
    const text = await resp.text()
    return text.substring(0, 4000)
  } catch {
    return ''
  }
}

// ─── Instagram enrichment via Apify ──────────────────────────────────────────
async function fetchInstagramData(handle) {
  const token = process.env.APIFY_API_TOKEN
  if (!token) return ''

  try {
    const { ApifyClient } = await import('apify-client')
    const apify = new ApifyClient({ token })
    const username = handle.trim().replace(/^@/, '')

    const run = await Promise.race([
      apify.actor('apify/instagram-profile-scraper').call({
        usernames: [username],
        resultsLimit: 6,
      }),
      new Promise((_, r) => setTimeout(() => r(new Error('timeout')), 28000)),
    ])

    const { items } = await apify.dataset(run.defaultDatasetId).listItems()
    if (!items.length) return ''

    const p = items[0]
    const recentPosts = (p.latestPosts || [])
      .slice(0, 4)
      .map(post => `"${(post.caption || '').substring(0, 90).replace(/\n/g, ' ')}"`)
      .join(', ')

    return `
Instagram @${username}:
- Bio: ${p.biography || '(sem bio)'}
- Seguidores: ${(p.followersCount || 0).toLocaleString('pt-BR')}
- Posts: ${p.postsCount || '?'}
- Posts recentes: ${recentPosts || '(não disponível)'}
`
  } catch {
    return ''
  }
}

// ─── Main export ─────────────────────────────────────────────────────────────
export async function handleAnalyze(body, emitter, ip) {
  const {
    brandDescription = '',
    mainProblems = '',
    siteUrl = '',
    instagram = '',
    turnstileToken = '',
  } = body || {}

  // Basic validation
  if (!brandDescription || brandDescription.trim().length < 1) {
    return emitter.error('A descrição da marca é obrigatória.')
  }

  // 1. Security
  try {
    await validateTurnstile(turnstileToken)
  } catch (err) {
    return emitter.error(err.message)
  }

  // 2. Rate limit
  try {
    await checkRateLimit(ip)
  } catch (err) {
    return emitter.error(err.message)
  }

  // 3. Enrich — site
  let siteContent = ''
  if (siteUrl.trim()) {
    emitter.loading('Analisando site...')
    siteContent = await fetchSiteContent(siteUrl)
  }

  // 4. Enrich — Instagram
  let instagramData = ''
  if (instagram.trim()) {
    emitter.loading('Buscando dados do Instagram...')
    instagramData = await fetchInstagramData(instagram)
  }

  // 5. Build prompt
  emitter.loading('Construindo diagnóstico com IA...')

  const userContent = [
    `DESCRIÇÃO DA MARCA:\n${brandDescription.trim()}`,
    mainProblems.trim()
      ? `PRINCIPAIS PROBLEMAS RELATADOS:\n${mainProblems.trim()}`
      : 'PRINCIPAIS PROBLEMAS RELATADOS: (não informado)',
    siteContent
      ? `CONTEÚDO DO SITE (extraído automaticamente):\n${siteContent}`
      : 'SITE: (não fornecido)',
    instagramData
      ? `DADOS DO INSTAGRAM:\n${instagramData}`
      : 'INSTAGRAM: (não fornecido)',
  ].join('\n\n')

  const systemPrompt = `Você é um consultor sênior de marca e marketing digital com 15 anos de experiência em posicionamento premium no mercado brasileiro.
Sua análise é honesta, direta e específica — sem elogios genéricos ou linguagem corporativa vazia. Você identifica com precisão o que pode melhorar e aponta o caminho mais eficiente.

Trate SEMPRE quem preencheu como um cliente real buscando uma análise séria, qualquer que seja o porte da marca (de pequena a multinacional) e qualquer que seja o tamanho do texto enviado. Faça uma análise genuína e útil com base nos dados disponíveis.

Analise a marca com base nas informações fornecidas e responda EXATAMENTE no formato abaixo, sem adicionar seções extras ou alterar os marcadores:

--- DIAGNÓSTICO GERAL ---
[2 parágrafos diretos e úteis sobre o estado atual da marca. Se tiver dados do Instagram ou site, cite-os concretamente.]

--- PONTOS CRÍTICOS ---
• [Ponto crítico 1 — específico, acionável e baseado nos dados fornecidos]
• [Ponto crítico 2]
• [Ponto crítico 3]

--- OPORTUNIDADES IDENTIFICADAS ---
[1–2 parágrafos sobre as maiores oportunidades de posicionamento e crescimento para essa marca específica. Seja concreto.]

--- PLANO RECOMENDADO: [nome exato de um dos planos abaixo] ---
[2–3 frases justificando a escolha com base no diagnóstico. Por que este plano é o passo certo AGORA para esta marca específica?]

${PLANS_CONTEXT}

REGRAS:
- Faça a análise REAL da marca, independente do porte ou da fama dela, e independente de a descrição ser curta. Marcas grandes/consolidadas também têm pontos a melhorar — aponte-os.
- NUNCA questione a intenção de quem preencheu, NUNCA diga que a pessoa "está testando o sistema", NUNCA comente sobre suposta incoerência entre a descrição enviada e o tamanho/identidade real da marca. Apenas entregue o diagnóstico.
- Seja honesto e direto, mas profissional. Não elogie o que não merece.
- Cite dados concretos quando disponíveis (seguidores, bio, conteúdo do site).
- O nome após "PLANO RECOMENDADO:" deve ser EXATAMENTE como listado acima.
- Escreva em português do Brasil, tom profissional e direto.
- Máximo 600 palavras no total.`

  // 6. Stream Claude
  try {
    const { default: Anthropic } = await import('@anthropic-ai/sdk')
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

    const stream = anthropic.messages.stream({
      model: 'claude-sonnet-4-5',
      max_tokens: 1100,
      system: systemPrompt,
      messages: [{ role: 'user', content: userContent }],
    })

    let fullText = ''
    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
        const text = event.delta.text
        fullText += text
        emitter.delta(text)
      }
    }

    // Extract plan name from the response
    const match = fullText.match(/---\s*PLANO RECOMENDADO:\s*([^-\n]+?)\s*---/)
    const planName = match ? match[1].trim() : null
    emitter.done(planName)
  } catch (err) {
    emitter.error(`Erro ao processar a análise: ${err.message}`)
  }
}
