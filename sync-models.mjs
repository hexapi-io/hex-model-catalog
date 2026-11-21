import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const source = "https://hexapi.io/api/models";
const familyNames = {
  claude: "Claude", deepseek: "DeepSeek", gemini: "Gemini", glm: "GLM",
  gpt: "GPT", grok: "Grok", kimi: "Kimi", qwen: "Qwen",
};

const formatLabels = {
  chat: "Chat Completions",
  messages: "Anthropic-compatible Messages",
  responses: "OpenAI-compatible Responses",
};

const integrationGuides = {
  "glm-5.3-abliterated": ["GLM implementation guide", "https://github.com/hexapi-io/glm-5.3-abliterated"],
  "deepseek-v4-pro-uncensored": ["DeepSeek streaming guide", "https://github.com/hexapi-io/deepseek-v4-pro-uncensored"],
};

function normalizeModel(model) {
  const name = typeof model?.name === "string" ? model.name.replace(/\s*\(100% Uncensored\)$/i, "") : "";
  if (typeof model?.id !== "string" || !/^[a-zA-Z0-9][a-zA-Z0-9_.:/-]{0,119}$/.test(model.id)
      || !/^[a-zA-Z0-9][a-zA-Z0-9 ().:+/_-]{0,119}$/.test(name)
      || typeof model.family !== "string" || !/^[a-zA-Z0-9][a-zA-Z0-9 ._-]{0,39}$/.test(model.family)) {
    throw new Error("HEX returned an invalid model identity.");
  }

  const familyKey = model.family.toLowerCase();
  const canonicalFamily = familyKey.startsWith("qwen") ? "qwen" : familyKey;
  const family = Object.hasOwn(familyNames, canonicalFamily) ? familyNames[canonicalFamily] : model.family;
  const variant = /abliterated/i.test(model.id) ? "Abliterated"
    : model.uncensored === true || /uncensored/i.test(model.id) ? "Uncensored" : "Standard";
  return { id: model.id, name, family, variant };
}

const byFamilyAndId = (a, b) => a.family.localeCompare(b.family, "en") || a.id.localeCompare(b.id, "en");

export function buildSnapshot(rows, previous) {
  if (!Array.isArray(rows) || rows.some(model => typeof model?.available !== "boolean")) {
    throw new Error("HEX catalog response is missing valid availability values.");
  }
  const indexed = new Map();
  for (const row of rows) {
    const model = normalizeModel(row);
    if (indexed.has(model.id)) throw new Error("HEX catalog returned a duplicate model ID.");
    indexed.set(model.id, { model, available: row.available });
  }
  const models = [...indexed.values()].filter(row => row.available).map(row => row.model).sort(byFamilyAndId);
  if (!models.length) throw new Error("HEX catalog returned no available models.");

  const archivedModels = [...(previous?.models ?? []), ...(previous?.archivedModels ?? [])]
    .filter(model => !indexed.get(model.id)?.available)
    .map(previousModel => indexed.get(previousModel.id)?.model ?? previousModel)
    .sort(byFamilyAndId);

  return { catalog: "HEX API", source, liveCatalog: "https://hexapi.io/models",
    pricing: "https://hexapi.io/pricing", status: "https://hexapi.io/status", models, archivedModels };
}

const tick = String.fromCharCode(96);

function pageName(id) {
  const simple = /^[a-z0-9][a-z0-9._-]*$/.test(id);
  const windowsDevice = /^(aux|con|nul|prn|com[1-9]|lpt[1-9])(?:\.|$)/i.test(id);
  return (simple && !windowsDevice ? id : "~" + Buffer.from(id).toString("hex")) + ".md";
}

function table(models, from = "models/") {
  return [
    "| Model page | API model ID | Variant |",
    "| --- | --- | --- |",
    ...models.map(model => "| [" + model.name + "](" + from + pageName(model.id) + ") | "
      + tick + model.id + tick + " | " + model.variant + " |"),
  ].join("\n");
}

function modelPage(model, capabilities, available) {
  const lines = [
    "# " + model.name + " API on HEX",
    "",
    "| Setting | Value |",
    "| --- | --- |",
    "| API model ID | " + tick + model.id + tick + " |",
    "| Model family | " + model.family + " |",
    "| Variant | " + model.variant + " |",
    "| Catalog availability | " + (available ? "Active in this snapshot" : "Archived") + " |",
    "",
  ];
  if (!available) {
    lines.push("This ID was previously listed on HEX. Check the [active model index](../MODEL-INDEX.md) for current options.", "");
  } else if (capabilities) {
    lines.push("## First request", "", "HEX workspace format: **" + formatLabels[capabilities.format] + "**.", "",
      "Set " + tick + "HEX_API_KEY" + tick + " in your terminal and run this command from the repository root.", "",
      "~~~sh", "node request-example.mjs " + model.id, "~~~", "");
    const features = [
      ["Image input", capabilities.vision],
      ["Function tools", capabilities.tools],
      ["Adjustable reasoning", capabilities.reasoning],
    ].filter(([, value]) => typeof value === "boolean");
    if (features.length) {
      lines.push("## Capabilities in HEX workspace", "", "| Feature | Support |", "| --- | --- |",
        ...features.map(([label, supported]) => "| " + label + " | " + (supported ? "Supported" : "Not enabled in this configuration") + " |"), "");
      lines.push("Verify settings for your client and API format before using them.", "");
    }
    if (Number.isSafeInteger(capabilities.context) && Number.isSafeInteger(capabilities.output)) {
      lines.push("HEX gateway limits: **" + capabilities.context.toLocaleString("en-US") + " context tokens**, up to **"
        + capabilities.output.toLocaleString("en-US") + " output tokens** per request. Client or provider settings can impose lower limits.", "");
    }
  } else {
    lines.push("## First request", "", "See [HEX API formats](../API-FORMATS.md) for available endpoints. Per-model format and settings are pending review.", "");
  }

  if (model.variant !== "Standard") {
    lines.push("## Model variant", "", "See the [uncensored and abliterated index](../UNCENSORED-MODELS.md) for related IDs and the [AI jailbreak terminology guide](../JAILBREAK-AND-MODEL-VARIANTS.md) for definitions.", "");
  }
  if (model.family === "GPT") lines.push("[GPT Responses guide](../GPT-GUIDE.md)", "");
  if (model.family === "Claude") lines.push("[Claude Messages guide](../CLAUDE-GUIDE.md)", "");
  const guide = Object.hasOwn(integrationGuides, model.id) ? integrationGuides[model.id] : undefined;
  if (guide) lines.push("[" + guide[0] + "](" + guide[1] + ")", "");
  lines.push("[Live pricing](https://hexapi.io/pricing) · [Service status](https://hexapi.io/status) · [API reference](https://hexapi.io/docs) · [All HEX models](../MODEL-INDEX.md)", "");
  return lines.join("\n");
}

export function renderFiles(snapshot, capabilities) {
  const groups = Map.groupBy(snapshot.models, model => model.family);
  const index = [
    "# Active HEX API models", "",
    "**" + snapshot.models.length + " models across " + groups.size + " families** in this snapshot of the public HEX catalog.", "",
    "[Uncensored and abliterated models](UNCENSORED-MODELS.md) · [Live availability](https://hexapi.io/status) · [Live pricing](https://hexapi.io/pricing) · [JSON list](models.json)", "",
    ...Array.from(groups, ([family, entries]) => "## " + family + "\n\n" + table(entries) + "\n"),
    "[Catalog home](README.md) · [API formats](API-FORMATS.md) · [Model variants](JAILBREAK-AND-MODEL-VARIANTS.md)", "",
  ];
  if (snapshot.archivedModels.length) {
    index.push("## Archived models", "", "These IDs had a previous page in the catalog.", "", table(snapshot.archivedModels), "");
  }
  const abliterated = snapshot.models.filter(model => model.variant === "Abliterated");
  const uncensored = snapshot.models.filter(model => model.variant === "Uncensored");
  const variants = [
    "# Uncensored and abliterated AI models on HEX", "",
    "Use an exact model ID with the HEX API. Model availability, features, and behavior can vary by variant.", "",
    "## Abliterated models", "", table(abliterated), "",
    "## Uncensored models", "", table(uncensored), "",
    "[AI jailbreak and variant terminology](JAILBREAK-AND-MODEL-VARIANTS.md) · [All active models](MODEL-INDEX.md) · [Live pricing](https://hexapi.io/pricing)", "",
  ];
  const files = new Map([
    ["MODEL-INDEX.md", index.join("\n")],
    ["UNCENSORED-MODELS.md", variants.join("\n")],
    ["models.json", JSON.stringify(snapshot, null, 2) + "\n"],
  ]);
  const activeIds = new Set(snapshot.models.map(model => model.id));
  for (const model of [...snapshot.models, ...snapshot.archivedModels]) {
    const path = "models/" + pageName(model.id);
    if (files.has(path)) throw new Error("Catalog snapshot repeats a model page path.");
    const details = Object.hasOwn(capabilities, model.id) ? capabilities[model.id] : undefined;
    files.set(path, modelPage(model, details, activeIds.has(model.id)));
  }
  return files;
}

async function run(args) {
  const flags = new Set(args);
  if (args.some(arg => !["--check", "--offline"].includes(arg)) || args.length !== flags.size) {
    throw new Error("Usage: node sync-models.mjs [--check] [--offline]");
  }
  const catalogPath = new URL("models.json", import.meta.url);
  const previous = JSON.parse(await readFile(catalogPath, "utf8"));
  previous.archivedModels ??= [];
  const capabilities = JSON.parse(await readFile(new URL("capabilities.json", import.meta.url), "utf8"));
  let snapshot = previous;
  if (!flags.has("--offline")) {
    const response = await fetch(source, {
      headers: { Accept: "application/json" }, redirect: "error", signal: AbortSignal.timeout(20_000),
    });
    if (!response.ok) throw new Error("HEX catalog returned HTTP " + response.status + ".");
    snapshot = buildSnapshot((await response.json()).models, previous);
  }
  const files = renderFiles(snapshot, capabilities);
  const modelDirectory = new URL("models/", import.meta.url);
  if (flags.has("--check")) {
    for (const [name, value] of files) {
      const current = await readFile(new URL(name, import.meta.url), "utf8");
      if (current.replace(/\r\n/g, "\n") !== value) throw new Error(name + " differs from the catalog snapshot.");
    }
    for (const file of await readdir(modelDirectory)) {
      if (file.endsWith(".md") && !files.has("models/" + file)) {
        throw new Error("Untracked model page: " + file);
      }
    }
  } else {
    await mkdir(modelDirectory, { recursive: true });
    for (const [name, value] of files) await writeFile(new URL(name, import.meta.url), value, "utf8");
  }
  console.log("HEX catalog: " + snapshot.models.length + " active, " + snapshot.archivedModels.length + " archived.");
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  await run(process.argv.slice(2));
}
