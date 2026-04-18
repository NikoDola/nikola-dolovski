# CLAUDE.md — nikola-dolovski portfolio

Portfolio and personal brand site for Nikola Dolovski (Niko Dola), designer and developer.

## Stack

- **Next.js 15** App Router, React 19, TypeScript strict
- **CSS Modules** (plain `.css` files co-located with components, no Tailwind)
- **Firebase Auth** — email/password + Google Sign-In, only `nikodola@gmail.com` is allowed
- **GitHub Contents API** — project data and images are pushed directly to the repo via `src/lib/github.ts`

## CSS design tokens

```css
--primary-color:   #88D1D4   /* teal */
--secondary-color: #121B41   /* navy */
```

Fonts: `Oswald` (headings, labels, nav), system sans-serif (body).

## Layout rules

- Navbar is `position: fixed; height: 72px`. On scroll the background goes from transparent to `rgba(255,255,255,0.7) + blur(12px)`.
- `src/app/layout.tsx` wraps `<main>` in a `<div style={{ paddingTop: "72px" }}>` to account for the fixed bar.
- Hero sections use `margin-top: -72px; height: 100vh; overflow: hidden` to bleed behind the navbar.
- Page copy must never use the em dash `—`. Use a colon or comma instead.

## Data flow

1. Admin saves a project → `POST /api/push-project`
2. Route pushes JSON + images to GitHub via Contents API AND writes locally
3. `src/data/projects.json` is the local index (written by the API route on every save)
4. `GET /api/projects` reads `projects.json` at runtime (`force-dynamic`) — always fresh
5. `HomePortfolio` fetches from `/api/projects` on mount so new projects appear without a rebuild
6. Portfolio pages at `/my-work/[slug]` read `projects.json` server-side (`force-dynamic`)

## Project data shape

```ts
interface Project {
  slug: string
  name: string
  category: "branding" | "other"
  description: string          // 60–500 chars
  mission: string
  vision: string
  href: string
  client: { firstName: string; lastName: string }
  clientThumbnail: string
  services: string[]
  review: string
  technologyUsed: string[]
  thumbnails: string[]         // auto-derived from uploaded images
  heroSection: string[]        // auto-derived from uploaded images
  images?: string[]            // all uploaded image paths
  brandColors?: BrandColor[]
}

interface BrandColor {
  hex: string
  rgb: string
  order: number
  name?: string   // e.g. "Signal Red"
  usage?: string  // e.g. "Primary: Passion & Energy"
}
```

## Image naming convention

### Core separators

| Separator | Meaning |
|-----------|---------|
| `_` | Moves to the next node in the tree (section boundary) |
| `-` | Stays within the same node (multi-word descriptor) |

`icon-outline` is one node. `icon_outline` means two separate nodes.

### Full pattern

```
@brand_branding_node1_node2_mod.ext
@brand_ui_node1_node2_mod.ext
```

- `@brand` — optional proper noun brand prefix, e.g. `@gmunchies` or `@gmunchies-vending`
- `branding` or `ui` — category, comes right after brand
- `node1_node2...` — path through the tree, each `_` descends one level
- `@label` — proper noun label at any node (e.g. `@aleksandar`, `@gym`), skipped in tree traversal
- `mod` — terminal modifier from the current node's `mods` list, or `mockup` (global, valid anywhere)
- `ext` — must be `svg | avif | webp | png | jpg | jpeg`

### Examples

| Filename | Category | Path | Label | Mod |
|---|---|---|---|---|
| `@gmunchies_branding_logo_primary_color.svg` | branding | logo → primary | — | color |
| `@gmunchies_branding_logo_mockup.svg` | branding | logo | — | mockup (global) |
| `@gmunchies_branding_icon_@aleksandar_outline.svg` | branding | icon | aleksandar | outline |
| `@gmunchies_branding_stationery_business-card_horizontal.svg` | branding | stationery → business-card | — | horizontal |
| `@gmunchies_ui_page_landing-page.svg` | ui | page → landing-page | — | — |
| `@gmunchies_ui_animation_@loading_@button-load.svg` | ui | animation | loading, button-load | — |

### Tree structure

Defined in `src/data/imageNames.json`. Add new nodes there — no code changes needed.

**Branding tree (top-level nodes):**
```
logo        → primary, horizontal, vertical, icon, badge, wordmark, monogram
              mods per variant: outline, fill, black, white, color, gradient
icon        → mods: outline, fill, colorful, black, white
mascot      → full, head, pose (mods: front, side, action)
illustration → mods: outline, fill, colorful, mono
pattern     → mods: geometric, organic, minimal, complex
color       → palette, usage, gradient
typography  → pairing, scale, hierarchy
brand-guidelines → book, cover, layout
stationery  → business-card, letterhead, envelope, invoice, email-signature
print       → brochure, flyer, poster, catalog, menu
packaging   → box, label, bottle, can, bag
merch       → t-shirt, hoodie, cap, sticker, tote-bag
social      → post, story, banner, ad
signage     → storefront, billboard, vehicle, wayfinding
```

**UI tree (top-level nodes):**
```
page        → landing-page, homepage, dashboard, web-app, mobile-app
structure   → wireframe, sitemap, user-flow, journey, workflow
components  → button, card, modal, table, form
navigation  → navbar, sidebar, footer
sections    → hero, features, pricing, testimonials, cta, faq
auth        → login, register, forgot-password, reset-password
user        → profile, settings, dashboard
ecommerce   → product-page, product-card, cart, checkout, pricing
email       → newsletter, transactional, email-signature
states      → empty, error, success, loading
animation   → loading, hover, transition, microinteraction, hero, scroll
visual      → typography, color-system, iconography, illustration, images
system      → design-system, ui-kit, style-guide
responsive  → mobile, tablet, desktop
theme       → dark-mode, light-mode
prototype   → interactive, flow
```

### Rules

- `mockup` is a **global mod** — valid after any node at any depth
- `@label` segments are skipped in tree traversal — they are proper nouns, not tree nodes
- Once a `mod` is consumed, the path is terminal (no further child nodes)
- Siblings close the previous branch — `logo_primary_outline` is valid; `logo_primary_outline_clearspace` is not
- Multiple `@label` segments group into the same section (used for animation batches)

## Portfolio page sections

Sections are auto-generated from the `images[]` array. The section is determined by the first tree node after the category.

**Section order:**
```
Logo → Icons → Mascot → Illustration → Pattern → Colors → Typography →
Brand Guidelines → Stationery → Print → Packaging → Merch → Social → Signage →
Pages → Structure → Components → Navigation → UI Sections → Auth → User →
E-Commerce → Email → States → Animation → Visual → Design System →
Responsive → Theme → Prototype
```

### Special rendering rules

| Section | Rule |
|---|---|
| **Logo** | Any file with `mockup` in its path → full-width hero at top; other logos → grid |
| **Icons** | All `branding_icon_*` files shown in a labeled grid; label comes from `@label` or path |
| **Colors** | Rendered from `brandColors[]` (not from images) — hex + RGB + optional name + usage |
| **Animation** | Multiple files with different `@labels` batch into one Animation section |

### Auto-derived fields on push

When images are uploaded via the admin CMS:
- `thumbnails` = first file with `mockup` in path, else first `logo` file, else first any
- `heroSection` = all files with `mockup` in path, else first file
- `images` = all uploaded image paths

## Brand colors — auto-extraction

When SVG files are uploaded in the admin, colors are extracted automatically:
- Parses hex values (`#rrggbb`) from all SVG files
- Pure black (`#000000`) and pure white (`#ffffff`) are excluded
- Colors are ranked by how many SVG **files** they appear in (cross-file frequency), not by how many times they appear in one file — this surfaces brand colors rather than fill repetitions
- Top 10 colors are taken
- Can be reordered by drag-and-drop; each color can be given a name and usage description

## Admin CMS

Route: `/admin` (requires Firebase auth, only `nikodola@gmail.com` allowed)

- `/admin/projects` — list all projects, edit/delete
- `/admin/projects/add?slug=xxx` — add or edit a project

### Add/edit project form order

1. **Project Assets** — batch upload (first, so auto-fill can run)
2. Project Info — name/slug auto-filled from brand prefix in filenames
3. Brand Strategy — mission, vision
4. Client — name + optional photo
5. Services — tag input
6. Technology Used — tag input
7. Client Review — testimonial textarea
8. **Brand Colors** — auto-extracted from SVGs, editable

## Key files

| File | Purpose |
|---|---|
| `src/lib/github.ts` | GitHub Contents API — read, create, update files |
| `src/lib/imageNames.ts` | Filename parser + validator + section detection |
| `src/data/imageNames.json` | Source of truth for all allowed image names |
| `src/data/projects.json` | Local index of all projects (written on every CMS save) |
| `src/types/project.ts` | `Project` and `BrandColor` type definitions |
| `src/app/api/push-project/route.ts` | Handles CMS saves — pushes to GitHub + writes locally |
| `src/app/api/projects/route.ts` | `GET` — reads projects.json at runtime, `force-dynamic` |
| `src/app/my-work/[slug]/page.tsx` | Dynamic portfolio page for CMS-created projects |
| `src/components/sections/HomePortfolio.tsx` | Home page portfolio grid — fetches from `/api/projects` |

## GitHub env vars required

```
GITHUB_TOKEN=...   # Fine-grained PAT with contents read+write on this repo
GITHUB_OWNER=NikoDola
GITHUB_REPO=nikola-dolovski
GITHUB_BRANCH=main
```

Set in `.env.local`. The API route validates these at runtime and throws friendly errors if missing.

## Existing hand-crafted portfolio pages

These have dedicated files and take precedence over the dynamic `[slug]` route:

- `/my-work/gmunchies` → `src/featured/PortfolioGmunchies.tsx`
- `/my-work/freaky`, `/my-work/bee-branded`, `/my-work/horny-rhino`, `/my-work/vexel`
