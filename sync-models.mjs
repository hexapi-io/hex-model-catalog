import { readFile, writeFile } from "node:fs/promises";

const source = "https://hexapi.io/api/models";
const familyNames = new Map([
  ["claude", "Claude"],
  ["deepseek", "DeepSeek"],
  ["gemini", "Gemini"],
  ["glm", "GLM"],
  ["gpt", "GPT"],
  ["grok", "Grok"],
  ["kimi", "Kimi"],
  ["qwen", "Qwen"],
]);

function normalizeModel(model) {
  const name = typeof model.name === "string" ? model.name.replace(/\s*\(100% Uncensored\)$/i, "") : "";
  if (!/^[a-zA-Z0-9_.:/-]{1,120}$/.test(model.id || "")
    || !/^[a-zA-Z0-9][a-zA-Z0-9 ().:+/_-]{0,119}$/.test(name)
    || !/^[a-zA-Z0-9][a-zA-Z0-9 ._-]{0,39}$/.test(model.family || "")) {
    throw new Error("HEX returned an invalid model identity.");
  }

  const familyKey = model.family.toLowerCase();
  const family = familyNames.get(familyKey.startsWith("qwen") ? "qwen" : familyKey) ?? model.family;
  const variant = /abliterated/i.test(model.id) ? "Abliterated"
    : model.uncensored === true || /uncensored/i.test(model.id) ? "Uncensored" : "Standard";

  return { id: model.id, name, family, variant };
}

function renderIndex(models) {
  const groups = Map.groupBy(models, model => model.family);
  const sections = Array.from(groups, ([family, records]) => [
    `## ${family}`,
    "",
    "| Model | API model ID | Variant |",
    "| --- | --- | --- |",
    ...records.map(({ id, name, variant }) => `| ${name} | \u0060${id}\u0060 | ${variant} |`),
  ].join("\n"));

  return [
    "# Active HEX API models",
    "",
    `**${models.length} models across ${groups.size} families** in this snapshot of the public HEX catalog.`,
    "",
    "[Live availability](https://hexapi.io/status) · [Live pricing](https://hexapi.io/pricing) · [JSON list](models.json)",
    "",
    ...sections.map(section => section + "\n"),
    "[Catalog home](README.md) · [API formats](API-FORMATS.md) · [Model variants](JAILBREAK-AND-MODEL-VARIANTS.md)",
    "",
  ].join("\n");
}

const flag = process.argv[2];
if (process.argv.length > 3 || (flag && flag !== "--check")) {
  throw new Error("Usage: node sync-models.mjs [--check]");
}

const response = await fetch(source, {
  headers: { Accept: "application/json" },
  redirect: "error",
  signal: AbortSignal.timeout(15_000),
});
if (!response.ok) throw new Error(`HEX catalog returned HTTP ${response.status}.`);

const payload = await response.json();
if (!Array.isArray(payload.models) || payload.models.some(model => typeof model?.available !== "boolean")) {
  throw new Error("HEX catalog response is missing valid availability values.");
}

const models = payload.models
  .filter(model => model.available)
  .map(normalizeModel)
  .sort((a, b) => a.family.localeCompare(b.family, "en") || a.id.localeCompare(b.id, "en"));

if (!models.length || new Set(models.map(model => model.id)).size !== models.length) {
  throw new Error("HEX catalog response is empty or has duplicate model IDs.");
}

const files = new Map([
  ["MODEL-INDEX.md", renderIndex(models)],
  ["models.json", JSON.stringify({
    catalog: "HEX API",
    source,
    liveCatalog: "https://hexapi.io/models",
    pricing: "https://hexapi.io/pricing",
    status: "https://hexapi.io/status",
    models,
  }, null, 2) + "\n"],
]);

for (const [name, data] of files) {
  const location = new URL(name, import.meta.url);
  if (flag === "--check") {
    const current = await readFile(location, "utf8");
    if (current.replace(/\r\n/g, "\n") !== data) throw new Error(`${name} differs from the live catalog.`);
  } else {
    await writeFile(location, data, "utf8");
  }
}

console.log(`HEX catalog verified: ${models.length} available models.`);
