import { handleAnalyze } from "@/lib/analyze-core.js";

/* Roda no runtime Node (precisa dos SDKs Anthropic/Apify/Upstash — não Edge).
   Todas as variáveis SEM prefixo NEXT_PUBLIC_ ficam só aqui no servidor,
   nunca vão pro browser. */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// Apify pode levar ~25s; o padrão da Vercel mataria a função. 60s cobre tudo.
export const maxDuration = 60;

type Emitter = {
  loading: (step: string) => void;
  delta: (text: string) => void;
  done: (planName: string | null) => void;
  error: (message: string) => void;
};

export async function POST(req: Request) {
  let body: unknown = {};
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const ip =
    (
      req.headers.get("x-forwarded-for")?.split(",")[0] ||
      req.headers.get("x-real-ip") ||
      "unknown"
    ).trim() || "unknown";

  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let closed = false;
      const send = (data: object) => {
        if (closed) return;
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
        } catch {
          /* stream já fechado */
        }
      };
      const close = () => {
        if (closed) return;
        closed = true;
        try {
          controller.close();
        } catch {
          /* já fechado */
        }
      };

      const emitter: Emitter = {
        loading: (step) => send({ type: "loading", step }),
        delta: (text) => send({ type: "delta", text }),
        done: (planName) => {
          send({ type: "done", planName });
          close();
        },
        error: (message) => {
          send({ type: "error", message });
          close();
        },
      };

      try {
        await handleAnalyze(body, emitter, ip);
      } catch (err) {
        send({
          type: "error",
          message: err instanceof Error ? err.message : "Erro interno.",
        });
      } finally {
        close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}

export function GET() {
  return new Response("Method not allowed", { status: 405 });
}
