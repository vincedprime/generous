import fs from "node:fs/promises";
import vm from "node:vm";
import path from "node:path";
import { fileURLToPath } from "node:url";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const context = { window: {} };
vm.runInNewContext(
  await fs.readFile(path.join(root, "dist/data.js"), "utf8"),
  context,
);
const products = context.window.CATALOG.filter((p) => p.price !== "Exclude");
const overrides = {
  "Microsoft Azure": "azure.microsoft.com",
  "Microsoft Clarity": "clarity.microsoft.com",
  "Google Forms": "docs.google.com",
  "Google AI Studio": "aistudio.google.com",
  "GitHub Codespaces": "github.com",
  "Cloudflare R2": "cloudflare.com",
  "Cloudflare Zero Trust": "cloudflare.com",
  "WorkOS AuthKit": "workos.com",
  GroqCloud: "groq.com",
  SonarQube: "sonarsource.com",
  "Backblaze B2": "backblaze.com",
};
const slug = (p) =>
  p.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
const manifest = [];
const failures = [];
const previous = JSON.parse(
  await fs
    .readFile(path.join(root, "dist/logos/sources.json"), "utf8")
    .catch(() => "[]"),
);
await fs.mkdir(path.join(root, "dist/logos"), { recursive: true });
let cursor = 0;
await Promise.all(
  Array.from({ length: 6 }, async () => {
    while (cursor < products.length) {
      const p = products[cursor++];
      const domain =
        overrides[p.name] ||
        new URL(p.source).hostname.replace(/^(www|docs|about|console)\./, "");
      const source = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=128`;
      try {
        const response = await fetch(source, {
          signal: AbortSignal.timeout(25000),
        });
        if (!response.ok) throw Error(`HTTP ${response.status}`);
        const bytes = Buffer.from(await response.arrayBuffer());
        if (!response.headers.get("content-type")?.startsWith("image/"))
          throw Error("Not an image");
        await fs.writeFile(
          path.join(root, "dist/logos", slug(p) + ".png"),
          bytes,
        );
        manifest.push({
          name: p.name,
          file: `logos/${slug(p)}.png`,
          domain,
          source,
        });
      } catch (e) {
        const prior = previous.find((s) => s.name === p.name);
        if (prior) {
          try {
            await fs.access(path.join(root, "dist", prior.file));
            manifest.push(prior);
            continue;
          } catch {}
        }
        failures.push({ name: p.name, error: e.message });
      }
    }
  }),
);
manifest.sort((a, b) => a.name.localeCompare(b.name));
await fs.writeFile(
  path.join(root, "dist/logos/sources.json"),
  JSON.stringify(manifest, null, 2) + "\n",
);
console.log(JSON.stringify({ saved: manifest.length, failures }, null, 2));
if (failures.length) process.exitCode = 1;
