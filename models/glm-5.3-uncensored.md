# GLM 5.3 Uncensored API on HEX

| Setting | Value |
| --- | --- |
| API model ID | `glm-5.3-uncensored` |
| Model family | GLM |
| Variant | Uncensored |
| Catalog availability | Active in this snapshot |

## First request

HEX workspace format: **Chat Completions**.

Set `HEX_API_KEY` in your terminal and run this command from the repository root.

~~~sh
node request-example.mjs glm-5.3-uncensored
~~~

## Capabilities in HEX workspace

| Feature | Support |
| --- | --- |
| Image input | Not enabled in this configuration |
| Function tools | Supported |
| Adjustable reasoning | Supported |

Verify settings for your client and API format before using them.

HEX gateway limits: **1,000,000 context tokens**, up to **65,536 output tokens** per request. Client or provider settings can impose lower limits.

## Model variant

See the [uncensored and abliterated index](../UNCENSORED-MODELS.md) for related IDs and the [AI jailbreak terminology guide](../JAILBREAK-AND-MODEL-VARIANTS.md) for definitions.

[Live pricing](https://hexapi.io/pricing) · [Service status](https://hexapi.io/status) · [API reference](https://hexapi.io/docs) · [All HEX models](../MODEL-INDEX.md)
