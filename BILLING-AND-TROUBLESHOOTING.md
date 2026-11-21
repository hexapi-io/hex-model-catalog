# HEX pricing, usage, and troubleshooting

## Check price and usage

HEX uses a pay-as-you-go USD balance. Consult [live pricing](https://hexapi.io/pricing) and your account's own rates before running a workload. Individual models have separate rates for input, output, cache reads, and cache writes where available. Your client format can report these counters differently.

Use the cost estimator on the pricing page. Enter each token category once. When an API reports a total prompt count that includes cached tokens, use the usage breakdown to separate ordinary input from any tokens charged at cache rates.

After a call, check the API usage fields and compare them with the usage view in your [HEX account](https://hexapi.io/app). A request can have a temporary reservation and a later settlement. Review the final usage and settlement before reconciling the cost.

## Diagnose a request

| Symptom | Check first |
| --- | --- |
| Unauthorized request | Confirm the key belongs to the intended account, the base URL is `https://api.hexapi.io`, and the auth header matches the endpoint. |
| Model or endpoint unavailable | Compare the exact ID and request format with the [active model index](MODEL-INDEX.md). Check [service status](https://hexapi.io/status). |
| Empty or interrupted stream | Read all events, including completion, usage, and errors. Test a short text request in the same API format. |
| Output stops early | Inspect the completion status or stop reason. Adjust the output budget within the model's limits and check whether reasoning consumed part of it. |
| HTTP 502 | Record the request ID if present, model ID, format, and time. Check status. Review whether the original request completed or incurred usage before retrying. |
| Insufficient balance | Check available balance and the request's input size and maximum output. Try a smaller request or top up through your account if needed. |

When [contacting HEX support](https://hexapi.io/support), send the request ID and technical context. Keep API keys and private prompts out of the report.

[API formats](API-FORMATS.md) · [Model index](MODEL-INDEX.md) · [Integration guides](INTEGRATIONS.md)
