# GPT models through the HEX Responses API

Use an active GPT model ID from the [GPT model list](MODEL-INDEX.md#gpt). Start with a text request, then open the model page for workspace capabilities and gateway limits.

```sh
node request-example.mjs gpt-6.2-sol --dry-run
```

With `HEX_API_KEY` set in your environment, omit `--dry-run` to submit a billable request. The script reports visible text, usage, and completion status.

```sh
curl --fail-with-body 'https://api.hexapi.io/v1/responses' \
  -H "Authorization: Bearer $HEX_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{"model":"gpt-6.2-sol","input":"Write a one-line software release title.","max_output_tokens":512,"store":false}'
```

- Read visible answer text from output messages. Other output items may represent reasoning or a tool call.
- Check the response status and incomplete details before using a result. A low output limit can be consumed before the model writes visible text.
- In a streaming client, read through the terminal response event and handle incomplete or failed results.
- Review the model's capability notes before sending images, function definitions, or reasoning settings.

For a local development project, use the [HEX Codex setup guide](https://hexapi.io/setup/codex) or [HEX for OpenCode Desktop](https://hexapi.io/setup/opencode).

[Model index](MODEL-INDEX.md) · [Other API formats](API-FORMATS.md) · [Troubleshooting](BILLING-AND-TROUBLESHOOTING.md)
