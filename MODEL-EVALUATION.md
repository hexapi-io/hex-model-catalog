# Compare API model behavior

Decide what a useful answer looks like before testing. Keep the input, output limit, and evaluation criteria the same across the variants you compare.

## Small evaluation set

| Task | Pass criterion |
| --- | --- |
| Convert a fictional bug report to JSON | The object parses and has the requested fields without invented details. |
| Summarize public release notes | Each point can be traced to a note in the source. |
| Stream a QA checklist | The stream produces visible text and a valid completion signal. |
| Describe a change in Turkish | The response stays in Turkish and preserves names and technical terms. |

Record the exact API model ID, request format, reasoning setting when supported, finish reason, elapsed time, input and output token counts, and whether the answer passed. Report missing usage and incomplete output as distinct outcomes.

Repeat each case before drawing a conclusion. Publish the test conditions with any totals or percentages.

[GLM JSON example](https://github.com/hexapi-io/glm-5.3-abliterated/blob/main/chat.py) · [DeepSeek stream example](https://github.com/hexapi-io/deepseek-v4-pro-uncensored/blob/main/stream.mjs) · [Current models](MODEL-INDEX.md)
