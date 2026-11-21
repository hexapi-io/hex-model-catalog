# GPT-6.1 Sol API on HEX

| Setting | Value |
| --- | --- |
| API model ID | `gpt-6.1-sol` |
| Model family | GPT |
| Variant | Standard |
| Catalog availability | Active in this snapshot |

## First request

HEX workspace format: **OpenAI-compatible Responses**.

Set `HEX_API_KEY` in your terminal and run this command from the repository root.

~~~sh
node request-example.mjs gpt-6.1-sol
~~~

## Capabilities in HEX workspace

| Feature | Support |
| --- | --- |
| Image input | Supported |
| Function tools | Supported |
| Adjustable reasoning | Supported |

Verify settings for your client and API format before using them.

HEX gateway limits: **1,000,000 context tokens**, up to **128,000 output tokens** per request. Client or provider settings can impose lower limits.

[GPT Responses guide](../GPT-GUIDE.md)

[Live pricing](https://hexapi.io/pricing) · [Service status](https://hexapi.io/status) · [API reference](https://hexapi.io/docs) · [All HEX models](../MODEL-INDEX.md)
