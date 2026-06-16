# Business Basics Listicle

This is a simple business-basics listicle web app built with plain HTML, CSS, and JavaScript plus a small Express server. It stores list data in Postgres, renders a card-based homepage, and serves a dedicated routed page for each item.

## What the app does

- Displays a styled front page with a clear title and hero section.
- Loads list content from a Postgres database.
- Renders at least five unique list items in a responsive card grid.
- Shows at least three visible attributes per item, including title, description, submitted by, route, and image name.
- Lets users click each card to open a matching detail route.
- Serves a custom 404 page for unknown routes.
- Uses PicoCSS for base styling, with a custom theme layered on top.

## Tech Stack

- HTML for page structure
- CSS for custom layout and visual styling
- JavaScript for fetching and rendering the homepage cards
- Express for routing, page responses, and the JSON API
- Postgres for persistent list data
- `pg` for database queries
- PicoCSS for the base design system

## Project Structure

- `index.html` - Root document shell for the homepage
- `server.js` - Express app, routed pages, 404 page, and JSON API
- `business.json` - Seed source used to populate Postgres
- `db/schema.sql` - Database table definition
- `scripts/init-db.js` - Creates the database table
- `scripts/seed-db.js` - Seeds the table from `business.json`
- `scripts/db.js` - Shared Postgres connection pool
- `src/main.js` - Client-side homepage renderer
- `public/styles.css` - Shared styling for the whole app
- `public/favicon.svg` - Browser tab icon
- `src/counter.js` - Leftover starter file, not used by the current app

## Scripts

- `npm run dev` - Starts the Express app with `nodemon`
- `npm start` - Starts the Express app with Node
- `npm run db:init` - Creates the Postgres schema
- `npm run db:seed` - Seeds the Postgres table with the list items

The app runs at `http://localhost:3000` by default.

## Render Postgres Setup

Create a Postgres instance on Render, then copy its external database URL.

Set the URL in your shell before running the schema and seed commands:

```powershell
$env:DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
npm run db:init
npm run db:seed
npm start
```

On Render, add the same value as an environment variable named `DATABASE_URL` for the deployed web service. The server uses SSL automatically when `DATABASE_URL` is present.

## Routes

- `GET /` - Homepage with the business basics cards
- `GET /business/:slug` - Detail page for one item
- `GET /api/business` - JSON API used by the homepage renderer
- `GET *` - Custom 404 page for unmatched routes

Example item routes:

- `/business/solve-a-real-problem`
- `/business/start-small-and-validate`
- `/business/know-your-target-customer`
- `/business/track-every-dollar`
- `/business/choose-the-right-business-model`

## Data Model

Each row in the `business_items` table includes these fields:

- `title`
- `slug`
- `text`
- `category`
- `image`
- `submitted_by`

The server also derives one runtime value for visuals:

- `imageUrl` - Inline SVG image generated for the card and detail page

## Content Included

The app currently ships with 10 business-basics list items:

1. Solve a Real Problem
2. Start Small and Validate
3. Know Your Target Customer
4. Track Every Dollar
5. Choose the Right Business Model
6. Build a Professional Brand
7. Learn Basic Sales Skills
8. Focus on Customer Feedback
9. Document Your Processes
10. Build Relationships Early

## Visual Design

- PicoCSS provides the baseline typography, spacing, and form/button defaults.
- `public/styles.css` adds a warm background, soft glass-like cards, rounded surfaces, and responsive grids.
- The homepage is card-based and adapts to smaller screens.
- Detail pages use a two-column layout on wide screens and stack on narrow screens.

## Notes

- This app does not use a frontend framework.
- The homepage is rendered in the browser with JavaScript.
- Routed detail pages and the 404 page are served directly by Express.
- Database rows are returned through `GET /api/business` and rendered by the vanilla frontend.
- The browser favicon is `public/favicon.svg`.
