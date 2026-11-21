# HEX API formats and model availability

## Discover models

Use the [active model index](MODEL-INDEX.md) to pick an API ID. Your account's authenticated model response lists the models it can discover at request time.

~~~bash
curl --fail-with-body https://api.hexapi.io/v1/models \
  -H "Authorization: Bearer $HEX_API_KEY"
~~~

The GitHub index is a snapshot of the public HEX catalog. It includes entries whose availability field was true when the list was refreshed. Use the [status page](https://hexapi.io/status) before production jobs and recheck model availability after an error.

## Pick the request format

Use the [HEX API reference](https://hexapi.io/docs) to select the format supported by your model and client.

| Format | Typical integration |
| --- | --- |
| Chat Completions | OpenAI-style message history with a chat model such as GLM or DeepSeek |
| Responses | Supported GPT integrations that expect the Responses API |
| Messages | Supported Claude integrations that expect the Messages API |

Each API request should use one model ID and one request format. Verify streaming, tool calls, reasoning parameters, and image support for that specific model before enabling them in your app.

For a runnable request, open the model's page or start with the [GPT Responses example](GPT-GUIDE.md), [Claude Messages example](CLAUDE-GUIDE.md), or [Chat Completions quickstart](https://github.com/hexapi-io/hex-api-quickstart).

## Match usage to price

[Live token pricing](https://hexapi.io/pricing) shows the current rates. Budget for the input and output your workflow creates. Check the usage returned with the response before comparing different models, and keep your HEX key on your own server or development machine.

[Quickstart](https://github.com/hexapi-io/hex-api-quickstart) · [OpenCode Desktop setup](https://hexapi.io/setup/opencode)
