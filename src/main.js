const app = document.querySelector("#app");

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const excerpt = (text) =>
  `${text.slice(0, 120).trim()}${text.length > 120 ? "..." : ""}`;

const renderHome = (items) => {
  app.innerHTML = `
    <header class="hero-card">
      <p class="eyebrow">Business Basics</p>
      <h1>Running a business, one practical step at a time</h1>
      <p class="hero-copy">Browse the essentials, then open any card for the full routed detail page.</p>
      <div class="hero-meta">
        <span>${items.length} list items</span>
        <span>Express routed pages</span>
      </div>
    </header>
    <section class="card-grid" aria-label="Business basics list"></section>
  `;

  const grid = app.querySelector(".card-grid");

  grid.innerHTML = items
    .map(
      (item) => `
        <article class="business-card">
          
          <div class="card-body">
            <div class="card-kicker">${escapeHtml(item.category)}</div>
            <h2>${escapeHtml(item.title)}</h2>
            <p>${escapeHtml(excerpt(item.text))}</p>
            <ul class="card-attributes">
              <li><strong>Submitted by:</strong> ${escapeHtml(item.submittedBy)}</li>
              <li><strong>Route:</strong> /business/${escapeHtml(item.slug)}</li>
              
            </ul>
            <a class="contrast" href="/business/${encodeURIComponent(item.slug)}">View details</a>
          </div>
        </article>
      `,
    )
    .join("");
};

fetch("/api/business")
  .then((response) => response.json())
  .then((items) => renderHome(items))
  .catch((error) => {
    app.innerHTML = `
      <article class="error-state">
        <h1>Unable to load the list</h1>
        <p>${escapeHtml(error.message)}</p>
      </article>
    `;
  });
