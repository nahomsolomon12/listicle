const app = document.querySelector("#app");

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
            <div class="card-kicker">${item.category}</div>
            <h2>${item.title}</h2>
            <p>${excerpt(item.text)}</p>
            <ul class="card-attributes">
              <li><strong>Submitted by:</strong> ${item.submittedBy}</li>
              <li><strong>Route:</strong> /business/${item.slug}</li>
              
            </ul>
            <a class="contrast" href="/business/${item.slug}">View details</a>
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
        <p>${error.message}</p>
      </article>
    `;
  });
