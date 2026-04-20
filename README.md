# Complex Analysis — Interactive Visualizations

[![License: MIT](https://img.shields.io/badge/License-MIT-gold.svg)](LICENSE)
[![Pages](https://img.shields.io/badge/GitHub%20Pages-deployed-blueviolet)](#live-site)
[![Chapters](https://img.shields.io/badge/Chapters-6-teal)]()
[![Simulations](https://img.shields.io/badge/Simulations-14-coral)]()

> A fully interactive, browser-based companion to an undergraduate complex analysis
> course. No server, no build step — just open `index.html`.

---

## What is this?

An **open-source educational website** that pairs rigorous mathematical exposition
(rendered with KaTeX) with real-time, draggable, animated Canvas 2D and Three.js
simulations. Every concept — from Cauchy–Riemann equations to the Riemann surface
of √z — has a hands-on visualisation you can explore.

## Live Site

After pushing to GitHub, enable **GitHub Pages** (Settings → Pages → Source: GitHub
Actions). The included workflow at `.github/workflows/deploy.yml` deploys
automatically on every push to `main`.

> Or simply open `index.html` locally — no web server required.

---

## Chapter Overview

| # | Chapter | Simulations | Key Topics |
|---|---------|:-----------:|------------|
| 1 | [Complex Numbers](chapters/1-complex-numbers/) | 3 | Argand diagram, polar form, roots of unity, Euler's formula |
| 2 | [Analytic Functions](chapters/2-analytic-functions/) | 3 | Domain coloring, Cauchy–Riemann, conformal grids |
| 3 | [Complex Integration](chapters/3-complex-integration/) | 2 | Contour integrals, Cauchy's theorem, winding numbers |
| 4 | [Series & Residues](chapters/4-series-residues/) | 2 | Taylor convergence, Laurent series, pole/zero visualizer |
| 5 | [Conformal Mappings](chapters/5-conformal-mappings/) | 2 | Möbius transformations, Joukowski airfoil |
| 6 | [Applications](chapters/6-applications/) | 3 | Potential flow, Julia sets, 3D Riemann surfaces |

**Total: 15 interactive simulations** across 6 chapters.

---

## Simulation Gallery

| Simulation | Chapter | Type |
|------------|---------|------|
| Complex Plane Explorer | 1 | Drag / Click |
| Complex Arithmetic Visualizer | 1 | Drag |
| Roots of Unity | 1 | Animated |
| Domain Coloring Explorer | 2 | Interactive |
| Cauchy–Riemann Visualizer | 2 | Hover |
| Conformal Grid Mapping | 2 | Animated |
| Contour Integral Visualizer | 3 | Animated |
| Winding Number Calculator | 3 | Draw |
| Taylor Series Convergence | 4 | Animated |
| Pole / Zero Visualizer | 4 | Interactive |
| Möbius Transformation Explorer | 5 | Animated |
| Joukowski Airfoil | 5 | Drag / Slider |
| 2D Potential Flow | 6 | Animated |
| Julia Set Explorer | 6 | Interactive |
| 3D Riemann Surface | 6 | 3D / Drag |

---

## Coursework Portfolio

The [`coursework/`](coursework/) section provides a template-based system for
organising homework solutions and project write-ups.

### How to Add New Coursework

1. **Copy** `coursework/template/` to a new folder (e.g. `coursework/hw5/`).
2. **Edit** `data.json` with the title, date, topics, and description.
3. **Upload** your solution PDF into the folder.
4. **Register** the entry in the `ENTRIES` array in `coursework/index.html`.

---

## Run Locally

```bash
# Clone the repository
git clone https://github.com/<your-username>/complex-analysis.git
cd complex-analysis

# Open in the browser (no build step needed)
# macOS
open index.html

# Linux
xdg-open index.html

# Windows
start index.html
```

Or use a local HTTP server for best results:

```bash
# Python
python -m http.server 8000

# Node
npx serve .
```

---

## Mathematical Prerequisites

- Single-variable calculus (derivatives, integrals, Taylor series)
- Multivariable calculus (partial derivatives, line integrals, Green's theorem)
- Linear algebra basics (matrices, determinants)
- Real analysis (sequences, limits, continuity, uniform convergence)
- Basic point-set topology (open/closed sets, compactness, connectedness)

---

## Topics Covered

**Complex Numbers** · Argand diagram · Polar form · Euler's formula · Roots of unity
· Triangle inequality · Open disks · Connected sets

**Analytic Functions** · Complex differentiability · Cauchy–Riemann equations
· Harmonic functions · Branch cuts · Elementary functions (exp, log, trig, power)

**Complex Integration** · Contour integrals · ML inequality · Cauchy–Goursat theorem
· Cauchy integral formula · Liouville's theorem · Maximum modulus principle · Winding numbers

**Series & Residues** · Taylor series · Laurent series · Singularity classification
· Casorati–Weierstrass · Residue theorem · Evaluating real integrals · Argument principle · Rouché's theorem

**Conformal Mappings** · Möbius transformations · Cross-ratio · Schwarz lemma
· Joukowski transform · Riemann mapping theorem · Schwarz–Christoffel

**Applications** · Complex potential · 2D fluid flow · Electrostatics · Julia sets
· Riemann surfaces

---

## Notation Reference

| Symbol | Meaning |
|--------|---------|
| $\mathbb{C}$ | Complex numbers |
| $\mathbb{D}$ | Open unit disk |
| $\mathbb{H}$ | Upper half-plane |
| $\hat{\mathbb{C}}$ | Riemann sphere |
| $\bar{z}$ | Conjugate |
| $\operatorname{Res}_{z=a} f$ | Residue at $a$ |
| $n(\gamma, z_0)$ | Winding number |

See the full [Reference page](reference/) for the complete notation table and theorem list.

---

## References & Textbooks

1. **Stein, E. M. & Shakarchi, R.** *Complex Analysis.* Princeton Lectures in Analysis II, Princeton University Press, 2003.
2. **Brown, J. W. & Churchill, R. V.** *Complex Variables and Applications.* 9th ed., McGraw-Hill, 2013.
3. **Saff, E. B. & Snider, A. D.** *Fundamentals of Complex Analysis.* 3rd ed., Pearson, 2003.
4. **Ahlfors, L. V.** *Complex Analysis.* 3rd ed., McGraw-Hill, 1979.
5. **Needham, T.** *Visual Complex Analysis.* Oxford University Press, 1997.

---

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| KaTeX | 0.16.9 | Math rendering |
| Three.js | r128 | 3D Riemann surfaces |
| Canvas 2D | — | All 2D simulations |
| Google Fonts | — | Cinzel Decorative, EB Garamond, Lora, JetBrains Mono |

No build tools, no npm, no bundler. Pure static HTML/CSS/JS.

---

## Contributing

Contributions are welcome! To add a simulation or fix a bug:

1. Fork the repository.
2. Create a feature branch (`git checkout -b feat/new-simulation`).
3. Write your changes — keep simulations self-contained with inline JS.
4. Test locally by opening the HTML file in a browser.
5. Submit a pull request with a clear description.

Please follow the existing code style: vanilla JS, pointer events for touch/mouse,
`requestAnimationFrame` for animation loops, and consistent CSS class naming.

---

## License

This project is licensed under the [MIT License](LICENSE).

---

<p align="center">
  <em>"The shortest path between two truths in the real domain passes through the complex domain."</em><br>
  — Jacques Hadamard
</p>
