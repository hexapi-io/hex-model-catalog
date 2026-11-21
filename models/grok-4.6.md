# Grok 4.6 API on HEX

| Setting | Value |
| --- | --- |
| API model ID | `grok-4.6` |
| Model family | Grok |
| Variant | Standard |
| Catalog availability | Active in this snapshot |

## First request

HEX workspace format: **Chat Completions**.

Set `HEX_API_KEY` in your terminal and run this command from the repository root.

~~~sh
node request-example.mjs grok-4.6
~~~

## Capabilities in HEX workspace

| Feature | Support |
| --- | --- |
| Image input | Supported |
| Function tools | Not enabled in this configuration |
| Adjustable reasoning | Not enabled in this configuration |

Verify settings for your client and API format before using them.

HEX gateway limits: **500,000 context tokens**, up to **65,536 output tokens** per request. Client or provider settings can impose lower limits.

[Live pricing](https://hexapi.io/pricing) · [Service status](https://hexapi.io/status) · [API reference](https://hexapi.io/docs) · [All HEX models](../MODEL-INDEX.md)
