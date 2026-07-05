"use client";
import { useRef, useState, useCallback, type CSSProperties } from "react";
import { m, useInView, AnimatePresence } from "framer-motion";

const PLAN_CATEGORIES = {
  "Diagnóstico Yarden": "Entrada",
  "Plano Travessia": "Projetos",
  "Sprint de Captação": "Projetos",
  "Sprint Inteligência": "Projetos",
  "Operação Corrente Light": "Recorrente",
  "Operação Corrente Standard": "Recorrente",
  "Operação Yarden 360": "Recorrente",
};

// ─── Input normalization & validation ────────────────────────────────────────

/**
 * Instagram — aceita qualquer formato:
 *   @yardenlab_  ·  yardenlab_  ·  instagram.com/yardenlab_
 *   https://www.instagram.com/yardenlab_/  ·  instagr.am/yardenlab_
 * Retorna o username limpo (sem @ e sem URL).
 */
function normalizeInstagram(raw) {
  if (!raw) return "";
  const s = raw.trim();
  // Extrai usuário de URL do Instagram
  const urlMatch = s.match(/(?:instagram\.com|instagr\.am)\/([A-Za-z0-9._]+)/i);
  if (urlMatch) return urlMatch[1];
  // Remove @ inicial
  return s.replace(/^@+/, "").trim();
}

/**
 * Site — aceita meusite.com, www.meusite.com, https://meusite.com
 * Adiciona https:// se não houver protocolo.
 */
function normalizeUrl(raw) {
  if (!raw) return "";
  const s = raw.trim();
  if (!s) return "";
  if (/^https?:\/\//i.test(s)) return s;
  if (s.startsWith("//")) return "https:" + s;
  if (s.includes(".")) return "https://" + s;
  return s;
}

/** Valida username do Instagram após normalização. '' = válido */
function validateInstagram(val) {
  if (!val) return "";
  if (!/^[A-Za-z0-9._]{1,30}$/.test(val))
    return "Usuário inválido — use letras, números, _ ou .";
  return "";
}

/** Valida URL após normalização. '' = válido */
function validateUrl(val) {
  if (!val) return "";
  try {
    new URL(val);
    return "";
  } catch {
    return "URL inválida — ex: meusite.com.br";
  }
}

// ─── Left panel: clean oversized brand symbol only ───────────────────────────
function BrandSymbolPanel({ phase }) {
  const isActive = phase === "loading" || phase === "streaming";
  const isDone = phase === "done";

  return (
    <div
      style={{
        height: "100%",
        background: "transparent",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Symbol — oversized, bleeds in all directions */}
      <m.div
        animate={
          isActive
            ? { scale: [1, 1.05, 1], opacity: [0.5, 0.92, 0.5] }
            : { scale: 1, opacity: isDone ? 1 : 0.6 }
        }
        transition={{
          scale: {
            duration: 5.5,
            repeat: isActive ? Infinity : 0,
            ease: "easeInOut",
          },
          opacity: {
            duration: 5.5,
            repeat: isActive ? Infinity : 0,
            ease: "easeInOut",
          },
        }}
        style={{
          position: "absolute",
          inset: "-42%",
          pointerEvents: "none",
        }}
      >
        {/* Wrapper de rotação — gira enquanto analisa (só desktop, painel já oculto no mobile) */}
        <m.div
          animate={isActive ? { rotate: 360 } : { rotate: 0 }}
          transition={
            isActive
              ? { duration: 14, repeat: Infinity, ease: "linear" }
              : { duration: 1.2, ease: "easeOut" }
          }
          style={{ width: "100%", height: "100%" }}
        >
          <img
            src="/logos/yarden-symbol.svg"
            alt=""
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              opacity: isActive ? 0.28 : isDone ? 0.32 : 0.14,
              filter: "grayscale(20%)",
              transition: "opacity 0.8s ease",
            }}
          />
        </m.div>
      </m.div>

      {/* Subtle gold glow that pulses during analysis */}
      <m.div
        animate={
          isActive
            ? { opacity: [0.04, 0.14, 0.04] }
            : { opacity: isDone ? 0.1 : 0.02 }
        }
        transition={{
          duration: 4,
          repeat: isActive ? Infinity : 0,
          ease: "easeInOut",
        }}
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse at center, rgba(243, 235, 226,0.18) 0%, transparent 70%)",
        }}
      />
    </div>
  );
}

// ─── Inline markdown: renders **bold** (and hides stray ** while typing) ──────
function renderInline(text) {
  let t = text;
  // Remove a dangling unmatched ** mid-typing so the asterisks never flash
  const markers = (t.match(/\*\*/g) || []).length;
  if (markers % 2 === 1) {
    const last = t.lastIndexOf("**");
    t = t.slice(0, last) + t.slice(last + 2);
  }
  const parts = t.split(/(\*\*[^*]+?\*\*)/g);
  return parts.map((part, idx) => {
    const m = part.match(/^\*\*([^*]+?)\*\*$/);
    if (m) {
      return (
        <strong key={idx} style={{ color: "var(--cream)", fontWeight: 600 }}>
          {m[1]}
        </strong>
      );
    }
    return <span key={idx}>{part}</span>;
  });
}

// ─── Streaming text renderer with section formatting ──────────────────────────
function StreamText({ text, streaming }) {
  const lines = text.split("\n");

  return (
    <div>
      {lines.map((line, i) => {
        const headerMatch = line.trim().match(/^---\s*(.+?)\s*---$/);
        if (headerMatch) {
          return (
            <div
              key={i}
              style={{
                color: "var(--cream)",
                fontSize: "9px",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                fontWeight: 700,
                marginTop: i === 0 ? 0 : "22px",
                marginBottom: "10px",
                paddingBottom: "8px",
                borderBottom: "1px solid rgba(243, 235, 226,0.15)",
              }}
            >
              {renderInline(headerMatch[1])}
            </div>
          );
        }
        if (/^[•\-]\s/.test(line.trim())) {
          return (
            <div
              key={i}
              style={{
                display: "flex",
                gap: "10px",
                marginBottom: "7px",
                color: "rgba(243,235,226,0.75)",
              }}
            >
              <span
                style={{
                  color: "var(--cream)",
                  flexShrink: 0,
                  marginTop: "2px",
                }}
              >
                —
              </span>
              <span
                style={{ fontSize: "13px", lineHeight: 1.75, fontWeight: 300 }}
              >
                {renderInline(line.trim().replace(/^[•\-]\s*/, ""))}
              </span>
            </div>
          );
        }
        if (!line.trim()) return <div key={i} style={{ height: "8px" }} />;

        const isLast = i === lines.length - 1;
        return (
          <div
            key={i}
            style={{
              color: "rgba(243,235,226,0.72)",
              fontSize: "13px",
              lineHeight: 1.78,
              fontWeight: 300,
              marginBottom: "2px",
            }}
          >
            {renderInline(line)}
            {streaming && isLast && (
              <m.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.85, repeat: Infinity }}
                style={{
                  display: "inline-block",
                  width: 2,
                  height: "13px",
                  background: "var(--cream)",
                  verticalAlign: "text-bottom",
                  marginLeft: 2,
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Shared field label wrapper ───────────────────────────────────────────────
function Field({ label, optional, children }: any) {
  return (
    <div style={{ marginBottom: "14px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "6px",
        }}
      >
        <label
          style={{
            color: "rgba(243,235,226,0.45)",
            fontSize: "9px",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            fontWeight: 600,
          }}
        >
          {label}
        </label>
        {optional && (
          <span
            style={{
              color: "rgba(243,235,226,0.2)",
              fontSize: "9px",
              letterSpacing: "0.06em",
            }}
          >
            opcional
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

const baseInput: CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  background: "rgba(243,235,226,0.03)",
  border: "1px solid rgba(243,235,226,0.09)",
  color: "var(--cream)",
  padding: "10px 13px",
  fontSize: "13px",
  fontFamily: "inherit",
  fontWeight: 300,
  outline: "none",
  resize: "none",
  transition: "border-color 0.2s",
};

const focusHandlers = {
  onFocus: (e) => (e.target.style.borderColor = "rgba(243, 235, 226,0.45)"),
  onBlur: (e) => (e.target.style.borderColor = "rgba(243,235,226,0.09)"),
};

// ─── Turnstile (only in production) ──────────────────────────────────────────
function TurnstileWidget({ onVerify }) {
  const containerRef = useRef<any>(null);
  const widgetId = useRef<any>(null);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  // In dev mode skip entirely
  if ((process.env.NODE_ENV === "development") || !siteKey) return null;

  const initWidget = () => {
    if (!containerRef.current || !window.turnstile) return;
    widgetId.current = window.turnstile.render(containerRef.current, {
      sitekey: siteKey,
      theme: "dark",
      size: "normal",
      callback: onVerify,
      "expired-callback": () => onVerify(""),
      "error-callback": () => onVerify(""),
    });
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const mountedRef = useRef(false);
  if (!mountedRef.current) {
    mountedRef.current = true;
    if (typeof window !== "undefined") {
      if (window.turnstile) {
        setTimeout(initWidget, 0);
      } else if (!document.getElementById("cf-turnstile-script")) {
        const s = document.createElement("script");
        s.id = "cf-turnstile-script";
        s.src = "https://challenges.cloudflare.com/turnstile/v1/api.js";
        s.async = s.defer = true;
        s.onload = initWidget;
        document.head.appendChild(s);
      }
    }
  }

  return <div ref={containerRef} style={{ margin: "14px 0" }} />;
}

// ─── Main component ───────────────────────────────────────────────────────────
const PANEL_HEIGHT = 580;

export default function AISection() {
  const ref = useRef<any>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const panelRef = useRef<any>(null);

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const [form, setForm] = useState({
    brandDescription: "",
    mainProblems: "",
    siteUrl: "",
    instagram: "",
  });
  const [turnstileToken, setTurnstileToken] = useState(
    (process.env.NODE_ENV === "development") || !siteKey ? "dev-bypass" : "",
  );

  const [phase, setPhase] = useState("form");
  const [loadingStep, setLoadingStep] = useState("");
  const [displayedText, setDisplayedText] = useState("");
  const [planName, setPlanName] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState({
    instagram: "",
    siteUrl: "",
  });
  const [fieldHints, setFieldHints] = useState({ instagram: "", siteUrl: "" });

  const handleTurnstileVerify = useCallback(
    (token) => setTurnstileToken(token),
    [],
  );
  const setField = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  // ── Blur handlers: normaliza e valida ────────────────────────────────────
  const handleInstagramBlur = useCallback((e) => {
    const raw = e.target.value;
    const normalized = normalizeInstagram(raw);
    const error = validateInstagram(normalized);
    const changed = normalized !== raw && raw.trim() !== "";

    if (normalized !== raw)
      setForm((prev) => ({ ...prev, instagram: normalized }));
    setFieldErrors((prev) => ({ ...prev, instagram: error }));
    e.target.style.borderColor = error
      ? "rgba(220,80,80,0.5)"
      : "rgba(243,235,226,0.09)";

    if (changed && !error) {
      setFieldHints((prev) => ({
        ...prev,
        instagram: "✓ formato detectado automaticamente",
      }));
      setTimeout(
        () => setFieldHints((prev) => ({ ...prev, instagram: "" })),
        2800,
      );
    }
  }, []);

  const handleUrlBlur = useCallback((e) => {
    const raw = e.target.value;
    const normalized = normalizeUrl(raw);
    const error = validateUrl(normalized);
    const changed = normalized !== raw && raw.trim() !== "";

    if (normalized !== raw)
      setForm((prev) => ({ ...prev, siteUrl: normalized }));
    setFieldErrors((prev) => ({ ...prev, siteUrl: error }));
    e.target.style.borderColor = error
      ? "rgba(220,80,80,0.5)"
      : "rgba(243,235,226,0.09)";

    if (changed && !error) {
      setFieldHints((prev) => ({ ...prev, siteUrl: "✓ https:// adicionado" }));
      setTimeout(
        () => setFieldHints((prev) => ({ ...prev, siteUrl: "" })),
        2800,
      );
    }
  }, []);

  // NOTE: o botão NÃO depende mais do token do Turnstile — em alguns mobiles o
  // widget do Cloudflare não autocompleta, o que travava o botão. O token ainda
  // é enviado quando disponível e validado no backend; a proteção contra abuso
  // fica garantida pelo rate-limit (3 análises/dia por IP).
  const canSubmit =
    phase === "form" &&
    form.brandDescription.trim().length >= 1 &&
    !fieldErrors.instagram &&
    !fieldErrors.siteUrl;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setPhase("loading");
    setLoadingStep("Iniciando análise...");
    setDisplayedText("");
    setPlanName(null);
    setErrorMsg("");

    // Traz o painel pra vista — no mobile o botão fica no fim do form, então a
    // tela de loading apareceria fora da viewport sem este scroll.
    setTimeout(() => {
      panelRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 60);

    // Typewriter — SSE tokens accumulate into `target`; a timer reveals the
    // text character-by-character for a natural "AI typing" effect.
    let target = ""; // tudo que já foi recebido
    let revealed = 0; // caracteres já exibidos
    let typeTimer: any = null;
    let streamEnded = false;
    let errored = false; // se houve erro (ex: rate limit), não vira "concluído"
    let pendingPlan: any = null;

    const finish = () => {
      if (errored || !streamEnded || revealed < target.length) return;
      clearInterval(typeTimer);
      typeTimer = null;
      setPlanName(pendingPlan);
      setPhase("done");
    };

    const ensureTyping = () => {
      if (errored || typeTimer) return;
      typeTimer = setInterval(() => {
        if (revealed < target.length) {
          const remaining = target.length - revealed;
          // acelera só quando está MUITO atrás (pra não estourar a fila); ritmo base mais lento
          const step = remaining > 280 ? 3 : remaining > 120 ? 2 : 1;
          revealed = Math.min(target.length, revealed + step);
          setDisplayedText(target.slice(0, revealed));
        } else {
          finish();
        }
      }, 26);
    };

    // Normaliza campos opcionais antes de enviar
    const normalizedInstagram = normalizeInstagram(form.instagram);
    const normalizedUrl = normalizeUrl(form.siteUrl);

    // Valida após normalização (caso usuário não tenha saído do campo)
    const instaErr = validateInstagram(normalizedInstagram);
    const urlErr = validateUrl(normalizedUrl);
    if (instaErr || urlErr) {
      setFieldErrors({ instagram: instaErr, siteUrl: urlErr });
      setPhase("form");
      return;
    }

    const payload = {
      ...form,
      instagram: normalizedInstagram,
      siteUrl: normalizedUrl,
      turnstileToken,
    };

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || `Erro ${response.status}`);
      }

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let sseBuffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        sseBuffer += decoder.decode(value, { stream: true });
        const lines = sseBuffer.split("\n");
        sseBuffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const event = JSON.parse(line.slice(6));
            if (event.type === "loading") {
              setLoadingStep(event.step);
            } else if (event.type === "delta") {
              setPhase("streaming");
              target += event.text;
              ensureTyping();
            } else if (event.type === "done") {
              streamEnded = true;
              pendingPlan = event.planName;
              ensureTyping();
              finish();
            } else if (event.type === "error") {
              errored = true;
              clearInterval(typeTimer);
              typeTimer = null;
              setErrorMsg(event.message);
              setPhase("error");
            }
          } catch {
            /* skip malformed lines */
          }
        }
      }
      // Stream encerrado — deixa o typewriter terminar de revelar o texto
      // (a menos que tenha ocorrido um erro, que já mostrou sua mensagem)
      if (!errored) {
        streamEnded = true;
        ensureTyping();
        finish();
      }
    } catch (err) {
      errored = true;
      clearInterval(typeTimer);
      typeTimer = null;
      setErrorMsg((err as any)?.message || "Erro de conexão. Tente novamente.");
      setPhase("error");
    }
  };

  const handleViewPlan = () => {
    const category = planName ? PLAN_CATEGORIES[planName] : null;
    if (!category) return;
    document.getElementById("plans")?.scrollIntoView({ behavior: "smooth" });
    setTimeout(() => {
      window.dispatchEvent(
        new CustomEvent("openPricingPlan", { detail: { category, planName } }),
      );
    }, 500);
  };

  const reset = () => {
    setPhase("form");
    setDisplayedText("");
    setPlanName(null);
    setErrorMsg("");
    setTurnstileToken((process.env.NODE_ENV === "development") || !siteKey ? "dev-bypass" : "");
  };

  return (
    <section
      id="ai"
      style={{ background: "var(--espresso)", padding: "clamp(44px, 6vw, 84px) 0" }}
    >
      <div className="container" ref={ref}>
        {/* ── Header ─────────────────────────────────────────── */}
        <m.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          style={{ marginBottom: "80px", maxWidth: "800px" }}
        >
          <p className="section-label" style={{ color: "var(--cream)" }}>
            Inteligência Aplicada
          </p>
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontWeight: 300,
              fontSize: "clamp(18px, 4.6vw, 44px)",
              lineHeight: 1.05,
              color: "var(--cream)",
              marginBottom: "20px",
              whiteSpace: "nowrap",
            }}
          >
            Diagnóstico de marca{" "}
            <em style={{ fontStyle: "normal", color: "var(--cream)" }}>
              guiado por IA.
            </em>
          </h2>
          <p
            style={{
              color: "rgba(243,235,226,0.5)",
              fontSize: "clamp(14px, 1.4vw, 16px)",
              lineHeight: 1.7,
              fontWeight: 300,
            }}
          >
            Análise real gerada por IA — diagnóstico honesto, pontos críticos e
            plano recomendado. Gratuita e em menos de 60 segundos.
          </p>
        </m.div>

        {/* ── Grid ─────────────────────────────────────────────── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "2px",
            height: `${PANEL_HEIGHT}px`,
          }}
          className="ai-grid"
        >
          {/* Left — dimensions panel */}
          <m.div
            initial={{ opacity: 0, x: -32 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.2 }}
            style={{ height: `${PANEL_HEIGHT}px`, overflow: "hidden" }}
          >
            <BrandSymbolPanel phase={phase} />
          </m.div>

          {/* Right — form / result */}
          <m.div
            ref={panelRef}
            className={`ai-right-panel${phase === "streaming" || phase === "done" ? " ai-scroll-result" : ""}`}
            initial={{ opacity: 0, x: 32 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.3 }}
            style={{
              background: "#1e080a",
              padding: "40px 36px",
              display: "flex",
              flexDirection: "column",
              height: `${PANEL_HEIGHT}px`,
              overflow: "hidden",
            }}
          >
            {/* ── Static header — always visible ────────────────── */}
            <div
              style={{
                flexShrink: 0,
                marginBottom: "22px",
                paddingBottom: "18px",
                borderBottom: "1px solid rgba(243,235,226,0.05)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                }}
              >
                <span
                  style={{
                    color: "var(--cream)",
                    fontSize: "9px",
                    letterSpacing: "0.28em",
                    textTransform: "uppercase",
                    fontWeight: 700,
                  }}
                >
                  Yarden Intelligence
                </span>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "7px" }}
                >
                  <m.div
                    animate={
                      phase === "loading" || phase === "streaming"
                        ? { opacity: [0.3, 1, 0.3] }
                        : { opacity: 1 }
                    }
                    transition={{
                      duration: 1.4,
                      repeat:
                        phase === "loading" || phase === "streaming"
                          ? Infinity
                          : 0,
                    }}
                    style={{
                      width: 5,
                      height: 5,
                      borderRadius: "50%",
                      background:
                        phase === "done"
                          ? "rgba(120,200,120,0.9)"
                          : "var(--cream)",
                    }}
                  />
                  <span
                    style={{
                      color: "rgba(243,235,226,0.35)",
                      fontSize: "10px",
                      letterSpacing: "0.1em",
                    }}
                  >
                    {phase === "done"
                      ? "Análise concluída"
                      : phase === "loading"
                        ? "Processando..."
                        : phase === "streaming"
                          ? "Analisando..."
                          : phase === "error"
                            ? "Erro na análise"
                            : "Aguardando dados"}
                  </span>
                </div>
              </div>
              <p
                style={{
                  color: "rgba(243,235,226,0.5)",
                  fontSize: "9px",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                  margin: 0,
                }}
              >
                Diagnóstico Gratuito de Marca
              </p>
            </div>

            <AnimatePresence mode="wait">
              {/* FORM */}
              {phase === "form" && (
                <m.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="ai-form-content"
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                  }}
                >
                  <Field label="Descrição da marca">
                    <textarea
                      rows={4}
                      value={form.brandDescription}
                      onChange={setField("brandDescription")}
                      {...focusHandlers}
                      placeholder="Ex: somos uma cafeteria artesanal em São Paulo focada em experiência e qualidade..."
                      style={baseInput}
                    />
                  </Field>

                  <Field label="Principais problemas atuais" optional>
                    <textarea
                      rows={2}
                      value={form.mainProblems}
                      onChange={setField("mainProblems")}
                      {...focusHandlers}
                      placeholder="Ex: baixo engajamento, identidade visual inconsistente..."
                      style={baseInput}
                    />
                  </Field>

                  <div
                    className="ai-fields-row"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "12px",
                      marginBottom: "4px",
                    }}
                  >
                    <Field label="Site da empresa" optional>
                      <input
                        type="text"
                        value={form.siteUrl}
                        onChange={setField("siteUrl")}
                        onFocus={(e) =>
                          (e.target.style.borderColor = "rgba(243, 235, 226,0.45)")
                        }
                        onBlur={handleUrlBlur}
                        placeholder="meusite.com ou https://..."
                        style={{
                          ...baseInput,
                          padding: "10px 13px",
                          borderColor: fieldErrors.siteUrl
                            ? "rgba(220,80,80,0.5)"
                            : "rgba(243,235,226,0.09)",
                        }}
                      />
                      {fieldErrors.siteUrl && (
                        <p
                          style={{
                            color: "rgba(220,80,80,0.75)",
                            fontSize: "10px",
                            marginTop: "4px",
                            letterSpacing: "0.04em",
                          }}
                        >
                          {fieldErrors.siteUrl}
                        </p>
                      )}
                      {fieldHints.siteUrl && !fieldErrors.siteUrl && (
                        <p
                          style={{
                            color: "rgba(243, 235, 226,0.7)",
                            fontSize: "10px",
                            marginTop: "4px",
                            letterSpacing: "0.04em",
                          }}
                        >
                          {fieldHints.siteUrl}
                        </p>
                      )}
                    </Field>
                    <Field label="Instagram" optional>
                      <input
                        type="text"
                        value={form.instagram}
                        onChange={setField("instagram")}
                        onFocus={(e) =>
                          (e.target.style.borderColor = "rgba(243, 235, 226,0.45)")
                        }
                        onBlur={handleInstagramBlur}
                        placeholder="@usuario ou link do perfil"
                        style={{
                          ...baseInput,
                          padding: "10px 13px",
                          borderColor: fieldErrors.instagram
                            ? "rgba(220,80,80,0.5)"
                            : "rgba(243,235,226,0.09)",
                        }}
                      />
                      {fieldErrors.instagram && (
                        <p
                          style={{
                            color: "rgba(220,80,80,0.75)",
                            fontSize: "10px",
                            marginTop: "4px",
                            letterSpacing: "0.04em",
                          }}
                        >
                          {fieldErrors.instagram}
                        </p>
                      )}
                      {fieldHints.instagram && !fieldErrors.instagram && (
                        <p
                          style={{
                            color: "rgba(243, 235, 226,0.7)",
                            fontSize: "10px",
                            marginTop: "4px",
                            letterSpacing: "0.04em",
                          }}
                        >
                          {fieldHints.instagram}
                        </p>
                      )}
                    </Field>
                  </div>

                  {/* Dica: formatos aceitos */}
                  <p
                    style={{
                      color: "rgba(243,235,226,0.5)",
                      fontSize: "12px",
                      letterSpacing: "0.02em",
                      marginBottom: "14px",
                      lineHeight: 1.6,
                    }}
                  >
                    Aceita @usuario, link do Instagram ou URL do site em
                    qualquer formato. Você também pode incluir esses dados na
                    descrição acima.
                  </p>

                  <TurnstileWidget onVerify={handleTurnstileVerify} />

                  <div className="ai-form-spacer" style={{ flex: 1 }} />

                  <button
                    onClick={handleSubmit}
                    disabled={!canSubmit}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      width: "100%",
                      padding: "14px",
                      background: canSubmit
                        ? "var(--espresso)"
                        : "rgba(243, 235, 226,0.08)",
                      color: canSubmit ? "var(--cream)" : "rgba(243,235,226,0.25)",
                      border: canSubmit ? "1px solid rgba(243,235,226,0.3)" : "none",
                      cursor: canSubmit ? "pointer" : "default",
                      fontSize: "10px",
                      fontWeight: 700,
                      letterSpacing: "0.16em",
                      textTransform: "uppercase",
                      fontFamily: "inherit",
                      transition: "background 0.3s",
                    }}
                    onMouseEnter={(e) => {
                      if (canSubmit)
                        e.currentTarget.style.background = "var(--sienna)";
                    }}
                    onMouseLeave={(e) => {
                      if (canSubmit)
                        e.currentTarget.style.background = "var(--espresso)";
                    }}
                  >
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.35-4.35M11 8v6M8 11h6" />
                    </svg>
                    Analisar minha marca
                  </button>
                </m.div>
              )}

              {/* LOADING */}
              {phase === "loading" && (
                <m.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "28px",
                  }}
                >
                  <div
                    style={{
                      width: "180px",
                      overflow: "hidden",
                      height: "1px",
                      background: "rgba(243,235,226,0.06)",
                    }}
                  >
                    <m.div
                      animate={{ x: ["-100%", "200%"] }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      style={{
                        height: "100%",
                        width: "45%",
                        background:
                          "linear-gradient(to right, transparent, var(--cream), transparent)",
                      }}
                    />
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <m.p
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 1.3, repeat: Infinity }}
                      style={{
                        color: "rgba(243,235,226,0.5)",
                        fontSize: "11px",
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        marginBottom: "8px",
                      }}
                    >
                      {loadingStep}
                    </m.p>
                    <p
                      style={{
                        color: "rgba(243,235,226,0.2)",
                        fontFamily: "var(--font-serif)",
                        fontStyle: "normal",
                        fontSize: "13px",
                      }}
                    >
                      Analisando sua marca...
                    </p>
                  </div>
                  <div
                    style={{
                      width: "100px",
                      overflow: "hidden",
                      height: "1px",
                      background: "rgba(243,235,226,0.04)",
                    }}
                  >
                    <m.div
                      animate={{ x: ["200%", "-100%"] }}
                      transition={{
                        duration: 1.8,
                        repeat: Infinity,
                        ease: "linear",
                        delay: 0.5,
                      }}
                      style={{
                        height: "100%",
                        width: "45%",
                        background:
                          "linear-gradient(to right, transparent, rgba(243, 235, 226,0.35), transparent)",
                      }}
                    />
                  </div>
                </m.div>
              )}

              {/* STREAMING / DONE */}
              {(phase === "streaming" || phase === "done") && (
                <m.div
                  key="result"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    minHeight: 0,
                  }}
                >
                  {/* Top bar */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "16px",
                      flexShrink: 0,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <m.div
                        animate={
                          phase === "streaming"
                            ? { opacity: [0.4, 1, 0.4] }
                            : { opacity: 1 }
                        }
                        transition={{ duration: 1.2, repeat: Infinity }}
                        style={{
                          width: 5,
                          height: 5,
                          borderRadius: "50%",
                          background:
                            phase === "done"
                              ? "rgba(120,200,120,0.9)"
                              : "var(--cream)",
                        }}
                      />
                      <span
                        style={{
                          color: "var(--cream)",
                          fontSize: "9px",
                          letterSpacing: "0.22em",
                          textTransform: "uppercase",
                          fontWeight: 700,
                        }}
                      >
                        {phase === "streaming"
                          ? "Analisando..."
                          : "Diagnóstico Concluído"}
                      </span>
                    </div>
                    {phase === "done" && (
                      <button
                        onClick={reset}
                        style={{
                          background: "none",
                          border: "none",
                          color: "rgba(243,235,226,0.3)",
                          fontSize: "11px",
                          cursor: "pointer",
                          letterSpacing: "0.06em",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.color =
                            "rgba(243,235,226,0.65)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.color =
                            "rgba(243,235,226,0.3)")
                        }
                      >
                        Nova análise →
                      </button>
                    )}
                  </div>

                  {/* Scrollable result — capped height */}
                  <div
                    className="analysis-result"
                    style={{
                      flex: 1,
                      overflowY: "auto",
                      minHeight: 0,
                      paddingRight: "6px",
                    }}
                  >
                    {/* Stable container — only fades in once; text grows in batches every 120 ms */}
                    <m.div
                      key="stream-result"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35 }}
                    >
                      <StreamText
                        text={displayedText}
                        streaming={phase === "streaming"}
                      />
                    </m.div>
                  </div>

                  {/* CTA after done */}
                  <AnimatePresence>
                    {phase === "done" && planName && (
                      <m.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45, delay: 0.25 }}
                        style={{
                          marginTop: "20px",
                          paddingTop: "16px",
                          borderTop: "1px solid rgba(243,235,226,0.07)",
                          flexShrink: 0,
                        }}
                      >
                        <p
                          style={{
                            color: "rgba(243,235,226,0.35)",
                            fontSize: "9px",
                            letterSpacing: "0.18em",
                            textTransform: "uppercase",
                            marginBottom: "10px",
                          }}
                        >
                          Plano recomendado
                        </p>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "14px",
                            flexWrap: "wrap",
                          }}
                        >
                          <span
                            style={{
                              fontFamily: "var(--font-serif)",
                              fontSize: "17px",
                              fontStyle: "normal",
                              color: "var(--cream)",
                              fontWeight: 300,
                            }}
                          >
                            {planName}
                          </span>
                          <button
                            onClick={handleViewPlan}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                              background: "none",
                              border: "1px solid rgba(243, 235, 226,0.3)",
                              color: "var(--cream)",
                              padding: "6px 14px",
                              fontSize: "9px",
                              fontWeight: 700,
                              letterSpacing: "0.14em",
                              textTransform: "uppercase",
                              cursor: "pointer",
                              fontFamily: "inherit",
                              transition: "all 0.25s",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background =
                                "rgba(243, 235, 226,0.08)";
                              e.currentTarget.style.borderColor = "var(--cream)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = "none";
                              e.currentTarget.style.borderColor =
                                "rgba(243, 235, 226,0.3)";
                            }}
                          >
                            Ver detalhes do plano
                            <svg
                              width="10"
                              height="10"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                          </button>
                        </div>
                      </m.div>
                    )}
                  </AnimatePresence>
                </m.div>
              )}

              {/* ERROR */}
              {phase === "error" && (
                <m.div
                  key="error"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    gap: "16px",
                  }}
                >
                  <div
                    style={{
                      background: "rgba(200,80,80,0.05)",
                      border: "1px solid rgba(200,80,80,0.18)",
                      padding: "18px 20px",
                    }}
                  >
                    <p
                      style={{
                        color: "rgba(200,80,80,0.8)",
                        fontSize: "13px",
                        lineHeight: 1.65,
                        fontWeight: 300,
                      }}
                    >
                      {errorMsg}
                    </p>
                  </div>
                  <button
                    onClick={reset}
                    style={{
                      background: "none",
                      border: "1px solid rgba(243,235,226,0.12)",
                      color: "rgba(243,235,226,0.45)",
                      padding: "11px",
                      fontSize: "10px",
                      cursor: "pointer",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      fontFamily: "inherit",
                      transition: "all 0.25s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor =
                        "rgba(243,235,226,0.3)";
                      e.currentTarget.style.color = "var(--cream)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor =
                        "rgba(243,235,226,0.12)";
                      e.currentTarget.style.color = "rgba(243,235,226,0.45)";
                    }}
                  >
                    Tentar novamente
                  </button>
                </m.div>
              )}
            </AnimatePresence>
          </m.div>
        </div>

        {/* ── AI features strip ────────────────────────────────── */}
        {/* <m.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "2px",
            marginTop: "2px",
          }}
          className="ai-features"
        >
          {[
            {
              icon: "◈",
              title: "Análise de Audiência",
              desc: "IA monitora comentários e DMs identificando objeções e oportunidades.",
            },
            {
              icon: "◇",
              title: "Auto-resposta Inteligente",
              desc: "Respostas automáticas em DM com personalidade da sua marca.",
            },
            {
              icon: "○",
              title: "Dashboard de Marca",
              desc: "Relatórios mensais gerados por IA com recomendações estratégicas.",
            },
            {
              icon: "△",
              title: "Inteligência de Mercado",
              desc: "IA monitora concorrentes e tendências em tempo real.",
            },
          ].map((f) => (
            <div
              key={f.title}
              style={{
                background: "#180709",
                padding: "36px 28px",
                borderTop: "1px solid rgba(243,235,226,0.05)",
              }}
            >
              <div
                style={{
                  color: "var(--cream)",
                  fontSize: "20px",
                  marginBottom: "16px",
                  lineHeight: 1,
                }}
              >
                {f.icon}
              </div>
              <h4
                style={{
                  color: "var(--cream)",
                  fontSize: "14px",
                  fontWeight: 500,
                  marginBottom: "10px",
                  letterSpacing: "0.02em",
                }}
              >
                {f.title}
              </h4>
              <p
                style={{
                  color: "rgba(243,235,226,0.45)",
                  fontSize: "13px",
                  lineHeight: 1.6,
                  fontWeight: 300,
                }}
              >
                {f.desc}
              </p>
            </div>
          ))}
        </m.div> */}
      </div>

      <style>{`
        @media (max-width: 900px) {
          .ai-grid { grid-template-columns: 1fr !important; height: auto !important; }
          .ai-grid > *:first-child { display: none !important; }
          .ai-grid > * { height: auto !important; min-height: unset; }
          /* Form/loading: altura natural, SEM scroll */
          .ai-right-panel {
            height: auto !important;
            max-height: none !important;
            overflow: visible !important;
          }
          /* Só quando a IA está gerando/concluiu: limita altura e habilita scroll */
          .ai-right-panel.ai-scroll-result {
            max-height: 72vh !important;
            overflow-y: auto !important;
          }
          .ai-features { grid-template-columns: repeat(2, 1fr) !important; }
          .ai-fields-row { grid-template-columns: 1fr !important; }
          /* remove o spacer flex e libera overflow para o botão aparecer */
          .ai-form-spacer { display: none !important; }
          .ai-form-content { overflow: visible !important; flex: unset !important; }
        }
        @media (max-width: 540px) {
          .ai-features { grid-template-columns: 1fr !important; }
        }
        .analysis-result::-webkit-scrollbar { width: 2px; }
        .analysis-result::-webkit-scrollbar-track { background: transparent; }
        .analysis-result::-webkit-scrollbar-thumb { background: rgba(243, 235, 226,0.2); border-radius: 2px; }
      `}</style>
    </section>
  );
}
