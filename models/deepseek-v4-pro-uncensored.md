# DeepSeek V4 Pro Uncensored API on HEX

| Setting | Value |
| --- | --- |
| API model ID | `deepseek-v4-pro-uncensored` |
| Model family | DeepSeek |
| Variant | Uncensored |
| Catalog availability | Active in this snapshot |

## First request

HEX workspace format: **Chat Completions**.

Set `HEX_API_KEY` in your terminal and run this command from the repository root.

~~~sh
node request-example.mjs deepseek-v4-pro-uncensored
~~~

## Capabilities in HEX workspace

| Feature | Support |
| --- | --- |
| Image input | Supported |
| Function tools | Supported |
| Adjustable reasoning | Supported |

Verify settings for your client and API format before using them.

HEX gateway limits: **1,000,000 context tokens**, up to **65,536 output tokens** per request. Client or provider settings can impose lower limits.

## Model variant

See the [uncensored and abliterated index](../UNCENSORED-MODELS.md) for related IDs and the [AI jailbreak terminology guide](../JAILBREAK-AND-MODEL-VARIANTS.md) for definitions.

[DeepSeek streaming guide](https://github.com/hexapi-io/deepseek-v4-pro-uncensored)

[Live pricing](https://hexapi.io/pricing) · [Service status](https://hexapi.io/status) · [API reference](https://hexapi.io/docs) · [All HEX models](../MODEL-INDEX.md)
