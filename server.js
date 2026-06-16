import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pool } from "./scripts/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;
const publicDir = path.join(__dirname, "public");
const srcDir = path.join(__dirname, "src");

const businessSelect = `
  SELECT
    id,
    title,
    slug,
    text,
    category,
    image,
    submitted_by AS "submittedBy"
  FROM business_items
`;

function withGeneratedFields(item) {
  return {
    ...item,
    imageUrl: createImageDataUri(item.title, item.category),
  };
}

async function getBusinessItems() {
  const result = await pool.query(`${businessSelect} ORDER BY id ASC`);
  return result.rows.map(withGeneratedFields);
}

async function getBusinessItemBySlug(slug) {
  const result = await pool.query(`${businessSelect} WHERE slug = $1`, [slug]);
  return result.rows[0] ? withGeneratedFields(result.rows[0]) : null;
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
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
      <title>${escapeHtml(title)}</title>
      <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
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
          <h1>${escapeHtml(item.title)}</h1>
          <p>${escapeHtml(item.text)}</p>
          <div class="hero-meta">
            <span class="detail-chip">${escapeHtml(item.category)}</span>
            <span class="detail-chip">${escapeHtml(item.submittedBy)}</span>
            <span class="detail-chip">/${escapeHtml(item.slug)}</span>
          </div>
          <img src="${item.imageUrl}" alt="${escapeHtml(item.title)}" class="detail-image" />
        </div>
        <aside class="detail-card detail-fields">
          <h2>All fields</h2>
          <dl>
            <dt>Title</dt>
            <dd>${escapeHtml(item.title)}</dd>
            <dt>Description</dt>
            <dd>${escapeHtml(item.text)}</dd>
            <dt>Category</dt>
            <dd>${escapeHtml(item.category)}</dd>
            <dt>Image</dt>
            <dd>${escapeHtml(item.image)}</dd>
            <dt>Submitted by</dt>
            <dd>${escapeHtml(item.submittedBy)}</dd>
          </dl>
          <a href="/">Back to all items</a>
        </aside>
      </article>
    `,
  });
}

app.use("/styles.css", express.static(path.join(publicDir, "styles.css")));
app.use("/src", express.static(srcDir));

app.get("/api/business", async (_request, response, next) => {
  try {
    const businessItems = await getBusinessItems();
    response.json(businessItems);
  } catch (error) {
    next(error);
  }
});

app.get("/", async (_request, response, next) => {
  try {
    const businessItems = await getBusinessItems();
    response.send(renderHomePage(businessItems));
  } catch (error) {
    next(error);
  }
});

app.get("/business/:slug", async (request, response, next) => {
  const item = await getBusinessItemBySlug(request.params.slug);

  if (!item) {
    next();
    return;
  }

  response.send(renderDetailPage(item));
});

app.use((error, _request, response, _next) => {
  console.error(error);
  response.status(500).send(
    renderLayout({
      title: "Server Error | Business Basics",
      content: `
        <article class="error-state">
          <p class="eyebrow">Database Error</p>
          <h1>Unable to load business items</h1>
          <p>Check that DATABASE_URL points to your Render Postgres database and that the schema has been seeded.</p>
        </article>
      `,
    }),
  );
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
