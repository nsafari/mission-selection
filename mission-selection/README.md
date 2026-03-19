# Mission Selection

A mission evaluation and prioritization app built with Angular 18+, Tailwind CSS, and Signals.

## Features

- **Dashboard** – View evaluated missions/topics sorted by priority with rank badges (Critical/High/Medium/Low)
- **New Eval** – Evaluate topics with configurable dimensions (1–5 sliders) and live descriptions
- **Rules** – CRUD for scoring dimensions (Name, Weight, Level Descriptions 1/3/5)

## Tech Stack

- Angular 18+ (standalone components, Signals, routing)
- Tailwind CSS
- lucide-angular (icons)
- LocalStorage for persistence

## Development

```bash
npm install
ng serve
```

Navigate to `http://localhost:4200/`.

## Build

```bash
ng build
```

Output is in `dist/mission-selection/`.

## Deploy to GitHub Pages

**One-time setup:**
1. Go to **Settings** → **Pages** in this repo
2. Under **Build and deployment** → **Source**, select **GitHub Actions**

**Deployment:** Each push to `main` triggers the workflow. After the run completes, the site is live at the URL above.

## Default Dimensions

On first load, the app seeds 6 default dimensions:

- Mission Alignment, Impact, Feasibility, Resource Requirements, Strategic Fit, Sustainability

You can edit or remove these in the Rules page.
