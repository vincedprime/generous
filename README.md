# Generous

A static free-tier directory with search, category and offer filters, editorial score sorting, and locally stored company icons.

## Preview

Run `python3 -m http.server 4173 --directory dist`, then open http://localhost:4173.

## Source

- `dist/index.html`: page structure and metadata.
- `dist/styles.css`: responsive styles.
- `dist/app.js`: rendering, filtering, sorting and score breakdowns.
- `dist/data.js`: 99 catalog records; the three marked Exclude are hidden.
- `dist/logos/`: local company website icons, with provenance in `sources.json`.
- `scripts/fetch-logos.mjs`: refreshes icons using Google's website favicon service (requires Node 22+ and network access).
- `.openai/hosting.json`: existing Sites project identity and static output folder.

No build step or package installation is required. Deploy the contents of `dist` on any static host. Fonts load from Google Fonts with system fallbacks. Icons are served locally; visitors do not contact the favicon service.

## Data and rankings

Scores are draft editorial estimates from the initial September 15, 2026 catalog. They average five equally weighted dimensions scored 0–4, scaled to 100. Vendor plan details need verification before presenting the catalog as authoritative. Brand icons identify the respective products; trademarks belong to their owners and do not imply endorsement.
