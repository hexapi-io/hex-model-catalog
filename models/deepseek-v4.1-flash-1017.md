# DeepSeek V4.1 Flash 1017 API on HEX

| Setting | Value |
| --- | --- |
| API model ID | `deepseek-v4.1-flash-1017` |
| Model family | DeepSeek |
| Variant | Standard |
| Catalog availability | Active in this snapshot |

## First request

HEX workspace format: **Chat Completions**.

Set `HEX_API_KEY` in your terminal and run this command from the repository root.

~~~sh
node request-example.mjs deepseek-v4.1-flash-1017
~~~

## Capabilities in HEX workspace

| Feature | Support |
| --- | --- |
| Image input | Not enabled in this configuration |
| Function tools | Supported |
| Adjustable reasoning | Supported |

Verify settings for your client and API format before using them.

HEX gateway limits: **1,000,000 context tokens**, up to **65,536 output tokens** per request. Client or provider settings can impose lower limits.

[Live pricing](https://hexapi.io/pricing) · [Service status](https://hexapi.io/status) · [API reference](https://hexapi.io/docs) · [All HEX models](../MODEL-INDEX.md)
