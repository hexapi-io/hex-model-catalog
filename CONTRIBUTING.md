# Contributing

Report catalog corrections with the exact HEX API model ID, the page or file that needs updating, and a link to the matching entry in the [live catalog](https://hexapi.io/models). Share fictional examples when an issue involves input or generated text.

To update the catalog files locally:

~~~bash
node sync-models.mjs
node sync-models.mjs --check
~~~

Include both `MODEL-INDEX.md` and `models.json` when submitting a catalog refresh. Use the live pricing and status links for information that changes frequently.
