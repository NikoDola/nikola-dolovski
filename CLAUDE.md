# CLAUDE.md — nikola-dolovski

Personal portfolio and client-facing project for Nikola Dolovski (nikodola@gmail.com).

## Stack

- **Next.js 15** · App Router · TypeScript · Tailwind CSS v4
- **EmailJS** (`@emailjs/browser`) for contact and order forms
- Service ID: `service_75xc7kn` · Public key: `Qki0lVqKeYPFzsg1j`

## Key routes

| Route | Description |
|-------|-------------|
| `/` | Portfolio homepage |
| `/branding-calculator` | Multi-step logo order wizard |
| `/my-work/*` | Case studies |
| `/proposal/*` | Client proposal pages |
| `/linktree` | Link-in-bio page |

## Branding Calculator (`src/components/branding/`)

Multi-step wizard for logo design / redesign orders. Entry point: `LogoConfigurator.tsx`.

### Flow

**Logo Design:** Service → Brand Info → Variations → Style → (Typography) → Colors → Summary

**Logo Redesign:** Service → Upload/Brand Info → Style → Variations → (Typography) → Colors → Summary

Typography step is skipped for icon-only variations.

### Screens

| File | Screen | Notes |
|------|--------|-------|
| `ServiceSelection` | Step 1 | Pick Design or Redesign |
| `BrandInfoScreen` | Brand info (design) | Company name, tagline, description |
| `UploadScreen` | Brand info (redesign) | Same fields + UploadZone for current logo |
| `StylePickerScreen` | Design style | Pinterest URL input instead of file upload |
| `VariationsScreen` | Logo variations | First free, +$25 each extra |
| `TypographyScreen` | Typography | Custom / Free Font / Designer's Choice tab |
| `ColorPickerScreen` | Color direction | Color families + custom hex picker |
| `SummaryScreen` | Order review | EmailJS submit with name + email required |

### Key conventions

- **Redesign upload** — UploadScreen has a drag-and-drop UploadZone for the current logo. StylePickerScreen uses a Pinterest URL input instead of a file upload.
- **EmailJS order email** fires on "Pay Now" in SummaryScreen using `template_5zdgufx`. Subject includes "Congratulations! You got a logo order!".
- **Footer breakpoint** at `1000px` (not 768px) — switches from desktop to mobile layout.
- **Progress bar** on mobile shows all steps with circles + connectors; only the active step's label is visible.
- **Color picker custom swatch** — click opens Edit/Delete menu, not immediate delete.
- **Style presets** repeat 3× (27 total) for prototype "Load more" behaviour.
- **Typography "Designer's Choice"** is a tab in the font browser, not a type option. Clicking it shows a message instead of font cards.

### Shared components (`src/components/branding/shared/`)

`ServiceCard`, `StyleCard`, `VariationCard`, `ProgressBar`, `Button`, `BackButton`, `TextInput`, `SummaryRow`, `UploadZone` (unused — kept for reference).

### Tokens

All design tokens live in `tokens.css` and the `T` object in `tokens.ts`.
