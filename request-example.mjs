import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const api = "https://api.hexapi.io";
const prompt = "Reply with exactly: HEX API ready.";
const outputLimit = 512;

export function buildRequest(model, format) {
  if (format === "responses") {
    return {
      url: api + "/v1/responses",
      body: { model, input: prompt, max_output_tokens: outputLimit, store: false },
    };
  }

  if (format === "messages" || format === "chat") {
    return {
      url: api + (format === "messages" ? "/v1/messages" : "/v1/chat/completions"),
      body: { model, messages: [{ role: "user", content: prompt }], max_tokens: outputLimit },
    };
  }

  throw new Error("No request format is documented for this model. See API-FORMATS.md.");
}

async function run([id, flag, extra]) {
  if (!id || (flag && flag !== "--dry-run") || extra !== undefined) {
    throw new Error("Usage: node request-example.mjs <model-id> [--dry-run]");
  }
  const catalog = JSON.parse(await readFile(new URL("models.json", import.meta.url), "utf8"));
  const formats = JSON.parse(await readFile(new URL("capabilities.json", import.meta.url), "utf8"));
  if (!catalog.models.some(model => model.id === id)) {
    throw new Error("Unknown or archived model ID. Check MODEL-INDEX.md.");
  }
  const format = Object.hasOwn(formats, id) ? formats[id].format : undefined;
  const request = buildRequest(id, format);
  if (flag === "--dry-run") {
    console.log(JSON.stringify(request, null, 2));
    return;
  }

  const key = process.env.HEX_API_KEY;
  if (!key) throw new Error("Set HEX_API_KEY in your terminal first.");
  const headers = { "Content-Type": "application/json" };
  if (format === "messages") {
    headers["x-api-key"] = key;
    headers["anthropic-version"] = "2023-06-01";
  } else {
    headers.Authorization = "Bearer " + key;
  }
  const response = await fetch(request.url, {
    method: "POST", headers, body: JSON.stringify(request.body),
    redirect: "error", signal: AbortSignal.timeout(120_000),
  });
  if (!response.ok) throw new Error("HEX returned HTTP " + response.status + ". See BILLING-AND-TROUBLESHOOTING.md.");
  const data = await response.json();
  const answer = format === "chat"
    ? data.choices?.[0]?.message?.content
    : format === "messages"
      ? data.content?.filter(block => block.type === "text").map(block => block.text).join("\n")
      : data.output_text ?? data.output?.filter(item => item.type === "message")
        .flatMap(item => item.content).filter(block => block.type === "output_text").map(block => block.text).join("\n");
  console.log(JSON.stringify({ answer: answer || null, usage: data.usage ?? null,
    status: data.status ?? data.stop_reason ?? data.choices?.[0]?.finish_reason ?? null }, null, 2));
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  await run(process.argv.slice(2));
}
