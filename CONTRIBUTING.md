# Contributing

Report catalog corrections with the exact HEX API model ID, the page or file that needs updating, and a link to the matching entry in the [live catalog](https://hexapi.io/models). Share fictional examples when an issue involves input or generated text.

To update the catalog files locally:

~~~bash
node sync-models.mjs
node --test catalog.test.mjs
node sync-models.mjs --offline --check
~~~

Include the generated indexes, `models.json`, and `models/` pages in a catalog refresh. Retired models keep their existing URLs and move to the archive. Use the live pricing and status links for information that changes frequently.

The **Model catalog** workflow runs daily and can also be run from the Actions tab. It opens or updates a draft on the `automation/model-catalog` branch. Where organization policy blocks the workflow's built-in credential from creating pull requests, the workflow summary links to the comparison. A repository secret named `CATALOG_PR_TOKEN` can provide an approved credential scoped to pull request write access for this repository. Review changes before merging.

`capabilities.json` contains reviewed HEX workspace formats and settings. Add capabilities after reviewing the exact model ID against the deployed HEX configuration. New catalog IDs without a reviewed entry still receive a page.
