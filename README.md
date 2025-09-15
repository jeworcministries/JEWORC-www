# STEYA ENGINEERING LTD — Starter Website (Astro + React + Tailwind)

This repository is a visual-forward starter scaffold for the STEYA ENGINEERING LTD marketing site.
It includes an example structure, pages, reusable components, seed data and a GitHub Actions workflow to deploy to GitHub Pages.

## Quickstart (locally)
1. `npm install`
2. `npm run dev` (open http://localhost:3000)

## Build & deploy
1. Create a GitHub repo (e.g. `steya-engineering-site`)
2. Push this project to the repo
3. Update `astro.config.mjs` -> `site` with your GitHub Pages URL (https://YOUR_USERNAME.github.io/REPO_NAME)
4. GitHub Actions workflow (`.github/workflows/deploy.yml`) will build on push and publish to `gh-pages` branch.

Files of interest:
- `src/pages/` — pages for the 8-site structure
- `src/components/` — reusable UI components
- `data/` — services, sectors, products, projects seed files
- `public/images/` — placeholder assets

Customize fonts, copy, and images to match your brand (Teal: #0F9D9D, Maroon: #7A1C23, White: #FFFFFF).

