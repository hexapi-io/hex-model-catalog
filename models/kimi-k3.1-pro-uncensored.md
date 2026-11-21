# Kimi K3.1 Pro Uncensored API on HEX

| Setting | Value |
| --- | --- |
| API model ID | `kimi-k3.1-pro-uncensored` |
| Model family | Kimi |
| Variant | Uncensored |
| Catalog availability | Active in this snapshot |

## First request

HEX workspace format: **Chat Completions**.

Set `HEX_API_KEY` in your terminal and run this command from the repository root.

~~~sh
node request-example.mjs kimi-k3.1-pro-uncensored
~~~

## Capabilities in HEX workspace

| Feature | Support |
| --- | --- |
| Image input | Not enabled in this configuration |
| Function tools | Supported |
| Adjustable reasoning | Not enabled in this configuration |

Verify settings for your client and API format before using them.

HEX gateway limits: **1,000,000 context tokens**, up to **8,192 output tokens** per request. Client or provider settings can impose lower limits.

## Model variant

See the [uncensored and abliterated index](../UNCENSORED-MODELS.md) for related IDs and the [AI jailbreak terminology guide](../JAILBREAK-AND-MODEL-VARIANTS.md) for definitions.

[Live pricing](https://hexapi.io/pricing) · [Service status](https://hexapi.io/status) · [API reference](https://hexapi.io/docs) · [All HEX models](../MODEL-INDEX.md)
