// Servidor da ferramenta Prompt de Render (função da Vercel).
// Guarda a chave da API da Anthropic e repassa os pedidos da página, devolvendo o texto aos poucos (NDJSON):
//   {"t":"trecho"} ... {"stop":"end_turn"}   ou   {"error":"codigo"}
import Anthropic from "@anthropic-ai/sdk";

const MODEL = process.env.CLAUDE_MODEL || "claude-opus-5-5";
const MAX_IMAGES = 5;
const EFFORTS = new Set(["low", "medium", "high", "xhigh", "max"]);
const ORIGINS = (process.env.ALLOWED_ORIGINS || "https://www.lais3d.com.br,https://lais3d.com.br")
  .split(",").map((o) => o.trim()).filter(Boolean);

let client;

function cors(req, res) {
  const origin = req.headers.origin;
  if (origin && ORIGINS.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "content-type,x-access-code");
    res.setHeader("Access-Control-Max-Age", "86400");
  }
}

function errorCode(e) {
  if (e instanceof Anthropic.APIError) {
    if (e.status === 429) return "rate_limited";
    if (e.status === 413) return "too_large";
    if (e.status === 400) return "bad_request";
    if (e.status === 529 || (e.status ?? 0) >= 500) return "overloaded";
  }
  return "server";
}

export default async function handler(req, res) {
  cors(req, res);
  if (req.method === "OPTIONS") return res.status(204).end();

  const code = process.env.ACCESS_CODE || "";
  const codeOK = !code || req.headers["x-access-code"] === code;

  if (req.method === "GET") {
    return res.status(200).json({ ok: !!process.env.ANTHROPIC_API_KEY, needsCode: !!code, codeOK, maxImages: MAX_IMAGES });
  }
  if (req.method !== "POST") return res.status(405).json({ error: "bad_request" });
  if (!process.env.ANTHROPIC_API_KEY) return res.status(500).json({ error: "not_configured" });
  if (!codeOK) return res.status(401).json({ error: "bad_code" });

  const { prompt, images = [], effort = "medium", maxTokens = 32000 } = req.body || {};
  if (typeof prompt !== "string" || !prompt.trim() || prompt.length > 200000) {
    return res.status(400).json({ error: "bad_request" });
  }
  if (!Array.isArray(images) || images.length > MAX_IMAGES) return res.status(400).json({ error: "too_large" });

  const content = [];
  for (const im of images) {
    if (!im || !/^image\/(jpeg|png|webp)$/.test(im.media_type) || typeof im.data !== "string") {
      return res.status(400).json({ error: "image_rejected" });
    }
    content.push({ type: "image", source: { type: "base64", media_type: im.media_type, data: im.data } });
  }
  content.push({ type: "text", text: prompt });

  res.writeHead(200, {
    "Content-Type": "application/x-ndjson; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Accel-Buffering": "no",
  });
  const send = (obj) => res.write(JSON.stringify(obj) + "\n");

  // se a pessoa fechar a página ou clicar em "parar", interrompe a geração e para de gastar
  const ac = new AbortController();
  res.on("close", () => { if (!res.writableEnded) ac.abort(); });

  try {
    client ??= new Anthropic();
    const stream = client.beta.messages.stream(
      {
        model: MODEL,
        max_tokens: Math.min(Math.max(+maxTokens || 32000, 1024), 64000),
        output_config: { effort: EFFORTS.has(effort) ? effort : "medium" },
        // se o modelo principal recusar, a própria API refaz o pedido no modelo de reserva recomendado
        betas: ["server-side-fallback-2026-07-01"],
        fallbacks: "default",
        messages: [{ role: "user", content }],
      },
      { signal: ac.signal },
    );
    stream.on("text", (t) => send({ t }));
    const msg = await stream.finalMessage();
    send({ stop: msg.stop_reason });
  } catch (e) {
    if (!ac.signal.aborted) {
      console.error(e);
      send({ error: errorCode(e) });
    }
  }
  res.end();
}
