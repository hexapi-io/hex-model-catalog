[![HEX Model Catalog · Uncensored and abliterated AI models](cover.png)](https://hexapi.io/models)

# HEX Model Catalog

Find the exact model ID to use with HEX. This directory covers selected uncensored and abliterated variants listed in the live catalog on **November 21, 2026**. Use the live catalog and status page to check availability before running a workload.

[Live model catalog](https://hexapi.io/models) · [Token pricing](https://hexapi.io/pricing) · [Service status](https://hexapi.io/status) · [Machine-readable model IDs](models.json)

## Choose a starting point

| Task | Start with | Example |
| --- | --- | --- |
| Turn a bug report into a structured engineering ticket | GLM 5.3 Abliterated | [Python walkthrough](https://github.com/hexapi-io/glm-5.3-abliterated) |
| Stream a release checklist from change notes | DeepSeek V4 Pro Uncensored | [Node.js streaming walkthrough](https://github.com/hexapi-io/deepseek-v4-pro-uncensored) |
| Try a model before integrating it | HEX web workspace | [Open HEX in your browser](https://hexapi.io/app/chat) |

## Model IDs

### GLM

| API model ID | Variant | Guide |
| --- | --- | --- |
| `glm-5.3-abliterated` | Abliterated | [Examples](https://github.com/hexapi-io/glm-5.3-abliterated) |
| `glm-5.3-flash-abliterated` | Abliterated | [Live catalog](https://hexapi.io/models) |
| `glm-5.3-uncensored` | Uncensored | [Live catalog](https://hexapi.io/models) |
| `glm-5.3-flash-uncensored` | Uncensored | [Live catalog](https://hexapi.io/models) |

### DeepSeek

| API model ID | Variant | Guide |
| --- | --- | --- |
| `deepseek-v4-pro-uncensored` | Uncensored | [Examples](https://github.com/hexapi-io/deepseek-v4-pro-uncensored) |
| `deepseek-v4-pro-abliterated` | Abliterated | [Live catalog](https://hexapi.io/models) |
| `deepseek-v4.1-flash-1017-abliterated` | Abliterated | [Live catalog](https://hexapi.io/models) |
| `deepseek-v4.1-flash-1017-uncensored` | Uncensored | [Live catalog](https://hexapi.io/models) |

### Kimi and Qwen

| API model ID | Variant | Guide |
| --- | --- | --- |
| `kimi-k3.1-pro-uncensored` | Uncensored | [Live catalog](https://hexapi.io/models) |
| `qwen3.8-max-uncensored` | Uncensored | [Live catalog](https://hexapi.io/models) |

## Connect your tools

Use `https://api.hexapi.io/v1` as the base URL and set your HEX API key as a bearer token. The authenticated `GET /v1/models` endpoint shows IDs visible to your account. To make the first request, use the [API quickstart](https://github.com/hexapi-io/hex-api-quickstart) or connect [OpenCode Desktop](https://github.com/hexapi-io/hex-opencode-setup).

The variant labels identify separate API models. Check capabilities and output on a small sample from your own workload when comparing them. Model names belong to their respective owners.
