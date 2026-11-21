# AI jailbreak, prompt injection, and abliterated models

Developers encounter these terms when comparing GLM, DeepSeek, and other model variants. Each term describes a different part of a system.

| Term | What it describes |
| --- | --- |
| AI jailbreak or LLM jailbreak | A prompt-based attempt to make a model disregard intended behavior or restrictions. |
| Prompt injection | An attempt to change how an application follows instructions through untrusted text, documents, or tool output. |
| Abliterated model | A model variant whose weights or internal representations have been modified to change certain behaviors, such as refusal tendencies. |
| Uncensored model | A catalog label for a named variant that may respond differently from a standard release. Behavior can vary by model, context, and task. |

## Choose a variant on HEX

A model ID selects the variant for your API request. For example, `glm-5.3-abliterated` and `glm-5.3-uncensored` are separate entries, as are the standard GLM 5.3 and Flash entries. See the [active model index](MODEL-INDEX.md) for the current options.

## Evaluate model behavior in your app

Start with your own harmless tasks, such as drafting release checks, summarizing public documentation, or turning a fictional bug report into a ticket. Record output format, completion status, elapsed time, and usage. For applications that read external content, validate outputs against your application's rules and keep permissions on the application side.

[Run a repeatable evaluation](MODEL-EVALUATION.md) · [GLM 5.3 Abliterated](https://github.com/hexapi-io/glm-5.3-abliterated) · [DeepSeek V4 Pro Uncensored](https://github.com/hexapi-io/deepseek-v4-pro-uncensored)
