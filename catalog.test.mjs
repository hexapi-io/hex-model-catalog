import test from "node:test";
import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { buildSnapshot, fetchModelRows, parsePublicModelPage, renderFiles } from "./sync-models.mjs";
import { buildRequest } from "./request-example.mjs";

const sample = { id: "example-standard", name: "Example Standard", family: "glm", available: true };
const abliterated = { id: "example-abliterated", name: "Example Abliterated", family: "glm", available: true };
const uncensored = { id: "example-uncensored", name: "Example (100% Uncensored)", family: "qwen3", available: true };
const readJson = async name => JSON.parse(await readFile(new URL(name, import.meta.url), "utf8"));

test("a catalog refresh preserves exact IDs and lists abliterated variants before uncensored variants", () => {
  const rows = [uncensored, sample, abliterated];
  const snapshot = buildSnapshot(rows);
  const files = renderFiles(snapshot, {});
  assert.equal(snapshot.models.length, 3);
  assert.equal(snapshot.models.find(model => model.id === uncensored.id).name, "Example");
  assert.equal(snapshot.models.find(model => model.id === uncensored.id).family, "Qwen");
  const variants = files.get("UNCENSORED-MODELS.md");
  assert.ok(variants.indexOf(abliterated.id) < variants.indexOf(uncensored.id));
  assert.ok(!variants.includes(sample.id));
  assert.deepEqual(renderFiles(buildSnapshot([...rows].reverse(), snapshot), {}), files);
});

test("removals preserve page addresses and reactivations restore the active entry", () => {
  const first = buildSnapshot([sample, abliterated]);
  const disabled = buildSnapshot([sample, { ...abliterated, available: false }], first);
  const removed = buildSnapshot([sample], disabled);
  const path = "models/example-abliterated.md";
  assert.equal(removed.archivedModels.length, 1);
  assert.match(renderFiles(removed, {}).get(path), /\| Archived \|/);
  const back = buildSnapshot([sample, abliterated], removed);
  assert.deepEqual(back.archivedModels, []);
  assert.match(renderFiles(back, {}).get(path), /\| Active in this snapshot \|/);
});

test("unsafe, empty, and duplicate feed values fail before regeneration", () => {
  assert.throws(() => buildSnapshot([]), /no available/);
  assert.throws(() => buildSnapshot([{ ...sample, available: "true" }]), /availability/);
  assert.throws(() => buildSnapshot([sample, sample]), /duplicate model/);
  assert.throws(() => buildSnapshot([{ ...sample, name: "Unexpected [link]" }]), /invalid model/);
  assert.throws(() => buildSnapshot([{ ...sample, id: "../private" }]), /invalid model/);
});

test("namespaced IDs generate self-contained page paths", () => {
  const special = { ...sample, id: "vendor/example:1" };
  const files = renderFiles(buildSnapshot([special]), {});
  const name = [...files.keys()].find(path => path.startsWith("models/"));
  assert.match(name, /^models\/~[a-f0-9]+\.md$/);
  assert.ok(files.get("MODEL-INDEX.md").includes(name));
  assert.ok(!files.get(name).includes("node request-example.mjs"));
});

test("the public model page yields complete identities and availability states", () => {
  const html = [
    '<tr data-model-row data-family="GLM" data-uncensored="false"><td><strong>Example Standard</strong><code>example-standard</code></td><td><i class="status-dot up"></i></td></tr>',
    '<tr data-model-row data-family="Qwen" data-uncensored="true"><td><strong>Example</strong><code>example-uncensored</code></td><td><i class="status-dot down"></i></td></tr>',
  ].join("\n");
  const rows = parsePublicModelPage(html);
  assert.equal(rows.length, 2);
  assert.equal(rows[0].available, true);
  assert.equal(rows[1].available, false);
  assert.equal(rows[1].uncensored, true);
  assert.throws(() => parsePublicModelPage("<html>Unavailable</html>"), /no catalog rows/);
  assert.throws(() => parsePublicModelPage(html.replace('class="status-dot down"', "")), /unrecognized catalog row/);
});

test("a catalog API 403 falls back to the current model explorer markup", async () => {
  const html = [
    '<tr data-model-row data-model="example-standard" data-family="GLM" data-variant="standard" data-uncensored="false" data-available="true">\n' +
      '<td class="model-explorer-identity"><strong data-model-name>Example Standard</strong><code dir="ltr">example-standard</code></td></tr>',
    '<tr data-model-row data-model="example-uncensored" data-family="Qwen" data-variant="uncensored" data-uncensored="true" data-available="false">\n' +
      '<td class="model-explorer-identity"><strong data-model-name>Example</strong><code dir="ltr">example-uncensored</code></td></tr>',
  ].join("\n");
  const requests = [];
  const rows = await fetchModelRows(async (url, options) => {
    requests.push([url, options.headers.Accept]);
    return requests.length === 1 ? new Response(null, { status: 403 }) : new Response(html);
  });
  assert.deepEqual(requests, [["https://hexapi.io/api/models", "application/json"], ["https://hexapi.io/models", "text/html"]]);
  assert.deepEqual(rows, [
    { id: "example-standard", name: "Example Standard", family: "GLM", uncensored: false, available: true },
    { id: "example-uncensored", name: "Example", family: "Qwen", uncensored: true, available: false },
  ]);
  assert.deepEqual(buildSnapshot(rows).models.map(model => model.id), ["example-standard"]);
  assert.throws(() => parsePublicModelPage(html.replace('data-available="false"', 'data-available="unknown"')), /unrecognized catalog row/);
});

test("request examples use the native path and parameters without embedding a key", () => {
  const model = "test-model";
  const paths = { chat: "/v1/chat/completions", messages: "/v1/messages", responses: "/v1/responses" };
  for (const [format, path] of Object.entries(paths)) {
    const { url, body } = buildRequest(model, format);
    assert.equal(url, "https://api.hexapi.io" + path);
    assert.equal(body.model, model);
    if (format === "responses") {
      assert.equal(body.store, false);
      assert.equal(typeof body.input, "string");
      assert.equal(body.max_output_tokens, 512);
      assert.ok(!Object.hasOwn(body, "messages"));
    } else {
      assert.equal(body.messages[0].role, "user");
      assert.equal(body.max_tokens, 512);
    }
    assert.ok(!JSON.stringify(body).includes("Authorization"));
  }
  assert.throws(() => buildRequest(model, null), /No request format/);
});

test("published model pages, reviewed formats, and relative guide links agree", async () => {
  const snapshot = await readJson("models.json");
  const capabilities = await readJson("capabilities.json");
  for (const entry of Object.values(capabilities)) {
    assert.ok(["chat", "responses", "messages"].includes(entry.format));
    for (const key of ["vision", "tools", "reasoning"]) {
      if (Object.hasOwn(entry, key)) assert.equal(typeof entry[key], "boolean");
    }
  }
  const docs = renderFiles(snapshot, capabilities);
  for (const name of ["README.md", "API-FORMATS.md", "GPT-GUIDE.md", "CLAUDE-GUIDE.md",
    "INTEGRATIONS.md", "BILLING-AND-TROUBLESHOOTING.md", "MODEL-EVALUATION.md",
    "JAILBREAK-AND-MODEL-VARIANTS.md", "CONTRIBUTING.md"]) {
    docs.set(name, await readFile(new URL(name, import.meta.url), "utf8"));
  }
  assert.equal(snapshot.models.length + snapshot.archivedModels.length, [...docs.keys()].filter(name => name.startsWith("models/")).length);
  for (const [name, content] of docs) {
    if (!name.endsWith(".md")) continue;
    for (const [, href] of content.matchAll(/\]\(([^)\s]+)\)/g)) {
      if (/^(https?:|mailto:|#)/.test(href)) continue;
      const [path, anchor] = href.split("#");
      const location = new URL(path, new URL(name, import.meta.url));
      await access(location);
      if (anchor) {
        const target = await readFile(location, "utf8");
        assert.ok(target.split(/\r?\n/).some(line => line.toLowerCase() === "## " + anchor), name + " → " + href);
      }
    }
  }
});
