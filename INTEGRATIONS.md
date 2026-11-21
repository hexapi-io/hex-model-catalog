# Use HEX from an SDK or coding tool

Get an API key from your HEX account and pick a model from the [active catalog](MODEL-INDEX.md). The model page identifies the format that HEX workspace uses for that ID. Keep the key in your environment, development tool, or server configuration.

## Run one request

| API format | Example | Start here |
| --- | --- | --- |
| Chat Completions | `node request-example.mjs glm-5.3-abliterated` | [Chat quickstart](https://github.com/hexapi-io/hex-api-quickstart) |
| Responses | `node request-example.mjs gpt-6.2-sol` | [GPT guide](GPT-GUIDE.md) |
| Messages | `node request-example.mjs claude-sonnet-5-5` | [Claude guide](CLAUDE-GUIDE.md) |

Add `--dry-run` to print the URL and JSON without a key, network request, or usage charge.

## Work in your editor

- [OpenCode Desktop](https://hexapi.io/setup/opencode) for local projects and selection among HEX model groups.
- [Claude Code](https://hexapi.io/setup/claude-code) for Claude workflows that use the Messages format.
- [Codex](https://hexapi.io/setup/codex) for supported GPT workflows that use Responses.
- [Cursor](https://hexapi.io/setup/cursor) for current HEX compatibility notes and alternatives where custom API settings are restricted.

The HEX setup selector lists the applicable Windows, macOS, and Linux instructions for each tool. Check your tool's documented compatibility before choosing a model with image input, function tools, or reasoning settings.

[HEX API reference](https://hexapi.io/docs) · [Billing and troubleshooting](BILLING-AND-TROUBLESHOOTING.md)
