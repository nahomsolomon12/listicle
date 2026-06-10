import express from "express";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;
const businessPath = path.join(__dirname, "business.json");
const publicDir = path.join(__dirname, "public");
const srcDir = path.join(__dirname, "src");

const businessItems = JSON.parse(readFileSync(businessPath, "utf8")).map(
  (item) => ({
    ...item,
    slug: slugify(item.title),
    imageUrl: createImageDataUri(item.title, item.category),
  }),
);

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function createImageDataUri(title, category) {
  const safeTitle = escapeXml(title);
  const safeCategory = escapeXml(category);
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" role="img" aria-label="${safeTitle}">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0b1320" />
          <stop offset="100%" stop-color="#243b55" />
        </linearGradient>
      </defs>
      <rect width="640" height="360" rx="28" fill="url(#bg)" />
      <circle cx="535" cy="75" r="48" fill="rgba(255,255,255,0.08)" />
      <circle cx="115" cy="285" r="72" fill="rgba(255,255,255,0.06)" />
      <text x="48" y="122" fill="#f8fafc" font-size="34" font-family="Arial, sans-serif" font-weight="700">${safeCategory}</text>
      <text x="48" y="190" fill="#dbeafe" font-size="24" font-family="Arial, sans-serif">Business basics</text>
      <text x="48" y="246" fill="#ffffff" font-size="40" font-family="Arial, sans-serif" font-weight="700">${safeTitle}</text>
    </svg>
  `.trim();

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function renderLayout({ title, content, includeScript = false }) {
  return `<!doctype html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${title}</title>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.min.css" />
      <link rel="stylesheet" href="/styles.css" />
      ${includeScript ? '<script type="module" src="/src/main.js"></script>' : ""}
    </head>
    <body>
      <main class="page-shell container">
        <div id="app" aria-live="polite">${content}</div>
      </main>
    </body>
  </html>`;
}

function renderHomePage(items) {
  return renderLayout({
    title: "Business Basics Listicle",
    includeScript: true,
    content: `
      <header class="hero-card">
        <p class="eyebrow">Business Basics</p>
        <h1>Running a business, one practical step at a time</h1>
        <p class="hero-copy">Browse the essentials, then open any card for the full routed detail page.</p>
        <div class="hero-meta">
          <span>${items.length} list items</span>
          <span>Picocss styled</span>
          <span>Express routed pages</span>
        </div>
      </header>
      <section class="card-grid" aria-label="Business basics list"></section>
    `,
  });
}

function renderDetailPage(item) {
  return renderLayout({
    title: `${item.title} | Business Basics`,
    content: `
      <article class="detail-layout">
        <div class="detail-card detail-hero">
          <p class="eyebrow">Business Detail</p>
          <h1>${item.title}</h1>
          <p>${item.text}</p>
          <div class="hero-meta">
            <span class="detail-chip">${item.category}</span>
            <span class="detail-chip">${item.submittedBy}</span>
            <span class="detail-chip">/${item.slug}</span>
          </div>
          <img src="${item.imageUrl}" alt="${item.title}" class="detail-image" />
        </div>
        <aside class="detail-card detail-fields">
          <h2>All fields</h2>
          <dl>
            <dt>Title</dt>
            <dd>${item.title}</dd>
            <dt>Description</dt>
            <dd>${item.text}</dd>
            <dt>Category</dt>
            <dd>${item.category}</dd>
            <dt>Image</dt>
            <dd>${item.image}</dd>
            <dt>Submitted by</dt>
            <dd>${item.submittedBy}</dd>
          </dl>
          <a href="/">Back to all items</a>
        </aside>
      </article>
    `,
  });
}

app.use("/styles.css", express.static(path.join(publicDir, "styles.css")));
app.use("/src", express.static(srcDir));

app.get("/api/business", (_request, response) => {
  response.json(businessItems);
});

app.get("/", (_request, response) => {
  response.send(renderHomePage(businessItems));
});

app.get("/business/:slug", (request, response, next) => {
  const item = businessItems.find(
    (entry) => entry.slug === request.params.slug,
  );

  if (!item) {
    next();
    return;
  }

  response.send(renderDetailPage(item));
});

app.use((_request, response) => {
  response.status(404).send(
    renderLayout({
      title: "Page Not Found | Business Basics",
      content: `
        <article class="not-found-card">
          <p class="eyebrow">404</p>
          <h1>That route does not exist</h1>
          <p>Check the URL or go back to the business list.</p>
          <a href="/">Return home</a>
        </article>
      `,
    }),
  );
});

app.listen(port, () => {
  console.log(`Business basics app running at http://localhost:${port}`);
});
