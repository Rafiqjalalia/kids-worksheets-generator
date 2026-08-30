# Kids Worksheets Generator

A complete, self-contained web app that lets anyone **create kids worksheets, puzzles, logic games, educational printables and complete activity books in minutes** — then export them as clean, ready-to-print pages or PDFs.

Everything runs **client-side in the browser** (React + Vite). There is **no database and no server**, so it deploys to any static host for free and stays completely off a VPS.

---

## ✨ What it does

- **Landing / marketing page** — full sales page with hero, features, activity gallery, pricing ($9 starter offer), FAQ and more.
- **20 activity generators** across four categories:
  - **Math** — Addition, Subtraction, Multiplication, Division, Fractions, Number Sequences, Counting
  - **Puzzles** — Themed Word Search, Word Scramble, Guaranteed-solution Maze, 4×4 & 9×9 Sudoku, Dot-to-Dot
  - **Logic & Games** — Matching Pairs, Tic-Tac-Toe, Hangman, Pattern Challenges
  - **Educational** — Coloring Pages, Letter Tracing & Phonics, Word Handwriting & Tracing, Grid Drawing & Symmetry
- **Deterministic generation** — every worksheet is produced from a seed, so the same settings always give the same printable (regenerate for a fresh one with one click).
- **Customization** — grade level, difficulty, question count, grid size, theme word banks, and more per activity.
- **Answer keys** — every activity optionally includes show-on-page answers and a printable answer page.
- **Book Builder** — combine any activities into a multi-page activity book, reorder/remove pages, customize each, and print the whole book.
- **My Projects** — save activities and books to your browser (localStorage), reprint, duplicate, or delete them.
- **Export** — Print / Save-as-PDF opens a clean, styled print window (A4) for a single page, an answer page, or a full book.
- **$9 Starter Offer / Checkout** — a real-looking checkout flow. Includes a clear demo-mode notice and a single integration point for Stripe / Lemon Squeezy to accept real payments.

---

## 🚀 Get started locally

Prerequisite: [Node.js 18+](https://nodejs.org).

```bash
npm install
npm run dev        # start dev server → http://localhost:5173
```

Build a production bundle:

```bash
npm run build      # outputs to dist/
npm run preview    # preview the production build locally
```

Tests (generates + renders every activity to catch logic errors):

```bash
npm test
```

Lint:

```bash
npm run lint
```

---

## ☁️ Deploy anywhere (no VPS required)

The app is a **static site** — the `dist/` folder is all you need. Deploy it to any of these free hosts:

### Netlify (recommended)
1. Push this folder to a GitHub repo.
2. Netlify → **Add new site → Import an existing project**.
3. Build command: `npm run build` — Publish directory: `dist`.

### Vercel
1. Import the GitHub repo.
2. Framework preset: **Vite** (auto-detected). It handles build + publish automatically.

### GitHub Pages
```bash
npm run build
# push the contents of dist/ to the gh-pages branch
```

### Any other static host (nginx, S3, Cloudflare Pages, Firebase Hosting…)
Upload the contents of `dist/` as the site root. The app uses **hash-based routing**, so **no server rewrite rules are needed** — it works from any static file server, or even from a local file.

> Because there is no backend, there are no environment variables, secrets, or databases to configure on the host.

---

## 🧱 Project structure

```
kids-worksheets-generator/
├─ index.html
├─ public/               favicon, static assets
├─ src/
│  ├─ main.jsx           entry
│  ├─ App.jsx            routing (hash router)
│  ├─ index.css          design system + worksheet/print styles
│  ├─ data/themes.js     word banks & theme data
│  ├─ lib/               rng (seeded), storage (localStorage), export (print)
│  ├─ components/        Layout, AppShell, Icon, Generator, worksheet shell
│  ├─ activities/        math.jsx, puzzles.jsx, logic.jsx, educational.jsx, registry.js
│  └─ pages/             Landing, Create, Activities, BookBuilder, Projects, Checkout
├─ scripts/run-smoke.js  test runner
└─ tests/smoke.jsx       generator + render smoke test
```

### How to add a new activity type
1. Add a `<name>.jsx` module in `src/activities/` exporting `{ name, category, icon, configSchema, generator, render }`.
   - `generator(config)` → `{ data, answers, title }`
   - `render({ data, answers, showAnswers })` → JSX
2. Register it in `src/activities/registry.js`.

---

## 💳 Accepting real payments (optional)

The checkout page currently runs in **demo mode** (no card is charged) and records the purchase locally. To accept real payments, add your provider of choice (e.g. Stripe Checkout, Payhip, or Lemon Squeezy — none of which require your own server) and point the checkout submit handler at your payment link / session URL in `src/pages/Checkout.jsx`.

---

## 🔒 Notes

- Projects are stored in the user's own browser (localStorage) — no accounts, no server-stored data, maximally private and zero-cost.
- Print output uses A4 page size and `@page` margins via the print stylesheet.
