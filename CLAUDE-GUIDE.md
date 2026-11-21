# Claude models through the HEX Messages API

Choose the exact version you want from the [Claude model list](MODEL-INDEX.md#claude). This example uses the Messages format and a short text prompt.

```sh
node request-example.mjs claude-sonnet-5-5 --dry-run
```

With `HEX_API_KEY` set in your environment, omit `--dry-run` to submit a billable request.

```sh
curl --fail-with-body 'https://api.hexapi.io/v1/messages' \
  -H "x-api-key: $HEX_API_KEY" \
  -H 'anthropic-version: 2023-06-01' \
  -H 'Content-Type: application/json' \
  -d '{"model":"claude-sonnet-5-5","max_tokens":512,"messages":[{"role":"user","content":"Write a one-line software release title."}]}'
```

- Read the text blocks in `content`, and treat tool-use blocks as separate structured output.
- Read `stop_reason`. It tells you whether the model ended the turn, hit an output limit, or requested a tool.
- If streaming, consume the complete event stream and inspect the final stop reason before processing the output.
- Use the native Messages body when moving an integration from Chat Completions. See the individual model page for its workspace capabilities.

Use the [HEX Claude Code setup](https://hexapi.io/setup/claude-code) or [HEX for OpenCode Desktop](https://hexapi.io/setup/opencode) when working in an existing project.

[Model index](MODEL-INDEX.md) · [Other API formats](API-FORMATS.md) · [Troubleshooting](BILLING-AND-TROUBLESHOOTING.md)
