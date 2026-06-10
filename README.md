# Business Basics Listicle

This is a simple business-basics listicle web app built with plain HTML, CSS, and JavaScript plus a small Express server. It uses `business.json` as the content source, renders a card-based homepage, and serves a dedicated routed page for each item.

## What the app does

- Displays a styled front page with a clear title and hero section.
- Loads list content from `business.json`.
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
- PicoCSS for the base design system

## Project Structure

- `index.html` - Root document shell for the homepage
- `server.js` - Express app, routed pages, 404 page, and JSON API
- `business.json` - Source data for the list items
- `src/main.js` - Client-side homepage renderer
- `public/styles.css` - Shared styling for the whole app
- `public/favicon.svg` - Browser tab icon
- `src/counter.js` - Leftover starter file, not used by the current app

## Scripts

- `npm run dev` - Starts the Express app with `nodemon`
- `npm start` - Starts the Express app with Node

The app runs at `http://localhost:3000` by default.

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

Each item in `business.json` includes these fields:

- `title`
- `text`
- `category`
- `image`
- `submittedBy`

The server also derives two runtime values for routing and visuals:

- `slug` - URL-safe identifier generated from the title
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
- The browser favicon is `public/favicon.svg`.
