# Generous

A static free-tier directory with search, category and offer filters, editorial score sorting, and locally stored company icons.

## Preview

Open `index.html` in a browser to preview the site.

## Hosting

GitHub Pages publishes the static site files from the repository root whenever `main` is pushed, through `.github/workflows/pages.yml`. The published address is https://vincedprime.github.io/generous/.

Git identity is configured locally as `vincedprime <vinayparida099@gmail.com>`.

## Files

- `index.html`: page structure and metadata.
- `styles.css`: responsive styles.
- `app.js`: rendering, filtering, sorting and score breakdowns.
- `data.js`: catalog records; entries marked Exclude are hidden.
- `logos/`: local company website icons, with provenance in `sources.json`.
- `scripts/fetch-logos.mjs`: refreshes icons using Google's website favicon service (requires Node 22+ and network access).

No build step, runtime, or package installation is required. Deploy the repository root on any static host. Fonts load from Google Fonts with system fallbacks. Icons are served locally; visitors do not contact the favicon service.

## Data and rankings

Scores are draft editorial estimates from the initial September 15, 2026 catalog. They average five equally weighted dimensions scored 0–4, scaled to 100. Vendor plan details need verification before presenting the catalog as authoritative. Brand icons identify the respective products; trademarks belong to their owners and do not imply endorsement.
