# KESH AURA — Digital Marketing & Growth Agency Website (2026)

## Overview

**Kesh Aura** is the official web presence for a **Digital Marketing Agency Marrakesh** clients trust for strategy, creative, and measurable growth. The site positions the brand as a **360° Growth Partner**: one team spanning social, brand, performance media, web, **SEO & AI Automation Morocco**-wide and internationally.

The experience is built for clarity, speed, and conversion—reflecting a modern agency that delivers **360° digital solutions** without noise.

---

## Tech Stack

| Layer | Technologies |
|--------|----------------|
| **Markup & structure** | HTML5 (semantic sections, accessible landmarks) |
| **Styling** | CSS3 (custom properties, responsive layouts, component-scoped styles) |
| **Motion** | **GSAP** (scroll-linked and UI animations) |
| **Lead capture** | **Formspree** (AJAX-ready contact flows on key pages) |
| **Navigation & UX** | JavaScript (`navbar.js`, `mobile.js`, splash and widget scripts) |

Supporting assets include web fonts, optimized imagery, `site.webmanifest`, and structured data where implemented on core pages.

---

## Key Features

### Multilingual experience (English / French)

- Parallel **English** and **French** page sets (`index` / `index-fr`, services, about, contact, articles, and article detail pages).
- **`hreflang`** alternates (`en`, `fr`, **`x-default`**) on designated URLs so search engines understand language targeting.
- Language switcher integrated with navigation for a consistent journey across locales.

### Technical SEO

- **Canonical** URLs on primary templates, aligned with the production host (**`https://keshaura.com`**, apex / no `www`—consistent with **Google Search Console Domain property** verification and indexing).
- Optimized **metadata** (titles, descriptions) and social tags on key templates.
- Repository **audited and cleaned**: legacy **`sections/`**-style stub partials and obsolete fragment files have been **removed** from the documented codebase so the project reflects a single, maintainable set of **production HTML pages** at the repository root—no duplicate or orphaned section scaffolding in the official tree.

### Performance & delivery

- Lean, page-local CSS where appropriate; shared scripts loaded intentionally.
- Fast first paint priorities: critical UI, deferred non-blocking resources where possible, and disciplined asset references for **performance-focused** delivery and **clean asset management**.

---

## Project layout (high level)

```
keshaura-website/
├── index.html / index-fr.html     # Home (EN / FR)
├── services.html / services-fr.html
├── about.html / about-fr.html
├── contact.html / contact-fr.html
├── articles.html / articles-fr.html
├── article-*.html                   # Article detail pages (EN / FR)
├── navbar.js                        # Shared navigation + language logic
├── mobile.js / mobile.css           # Responsive behaviors
├── splash.js                        # Entry experience
├── whatsapp-widget.js
├── style-variables.css, franklin-gothic-heavy.css
├── robots.txt, sitemap-new.xml, site.webmanifest
└── README.md
```

*Adjust filenames to match your deployment root; paths assume a flat static host.*

---

## Performance & indexing

This project is intended to be served under a **Search Console Domain property** for **`keshaura.com`**, with canonical and alternate URLs using **`https://keshaura.com/...`** (HTTPS, no `www`) so reported coverage, hreflang, and URL inspection stay aligned with how the site is crawled and indexed.

---

## Local preview

1. Clone or download the repository.
2. Open **`index.html`** in a modern browser, or serve the folder with any static file server (recommended for full path behavior).
3. Use the in-site **EN | FR** switcher and navigation to validate both locales.

---

## Vision

Kesh Aura’s digital flagship should feel as intentional as the campaigns it runs: **professional**, **bold**, and **visionary**—a **Digital Marketing Agency Marrakesh** can be proud of, and a **360° Growth Partner** global brands can rely on.

© 2026 **Kesh Aura**. All rights reserved.
