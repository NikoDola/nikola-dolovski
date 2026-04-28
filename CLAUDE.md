# CLAUDE.md — nikola-dolovski

Personal portfolio and client-facing project for Nikola Dolovski (nikodola@gmail.com).

## Stack

- **Next.js 15** · App Router · TypeScript · Tailwind CSS v4
- **Stripe** for payment processing (test keys during dev, live keys for production)
- **Firebase Admin SDK** (`firebase-admin`) for server-side Firestore + Storage
- **Firebase Client SDK** (`firebase`) for client-side usage

## Key routes

| Route | Description |
|-------|-------------|
| `/` | Portfolio homepage |
| `/branding-calculator` | Multi-step logo order wizard |
| `/payment-success` | Stripe redirect target — submits order to Firebase after payment |
| `/my-work/*` | Case studies |
| `/proposal/*` | Client proposal pages |
| `/linktree` | Link-in-bio page |

## Branding Calculator (`src/components/branding/`)

Multi-step wizard for logo design / redesign orders. Entry point: `LogoConfigurator.tsx`.

### Flow

**Logo Design:** Service → Brand Info → Variations → Style → (Typography) → Colors → Summary → Stripe → Payment Success

**Logo Redesign:** Service → Upload/Brand Info → Style → Variations → (Typography) → Colors → Summary → Stripe → Payment Success

Typography step is skipped for icon-only variations.

### Screens

| File | Screen | Notes |
|------|--------|-------|
| `ServiceSelection` | Step 1 | Pick Design or Redesign |
| `BrandInfoScreen` | Brand info (design) | Company name, tagline, description |
| `UploadScreen` | Brand info (redesign) | Same fields + UploadZone for current logo |
| `StylePickerScreen` | Design style | Pinterest URL input, used as both `style-red` and `style-icon` |
| `VariationsScreen` | Logo variations | First free, +$25 each extra |
| `TypographyScreen` | Typography | Custom / Free Font / Designer's Choice tab |
| `ColorPickerScreen` | Color direction | Color families + custom hex picker |
| `SummaryScreen` | Order review | Stripe Checkout — stores order in IndexedDB before redirect |

### Key conventions

- **Redesign flow** — after Variations, goes directly to Typography/Colors (NOT back to style). `style-red` is the style step for redesign, `style-icon` is only for design.
- **Payment flow** — SummaryScreen creates Stripe session via `/api/create-checkout`, stores order data + files in IndexedDB, redirects to Stripe. On return, `/payment-success` retrieves from IndexedDB and POSTs to `/api/submit-order`.
- **File storage** — Files held in React state during wizard, staged in IndexedDB before Stripe redirect, uploaded to Firebase Storage only after payment is verified server-side.
- **Session reuse prevention** — used Stripe session IDs are tracked in Firestore `used_sessions` collection.
- **Footer breakpoint** at `1000px` (not 768px) — switches from desktop to mobile layout.
- **Progress bar** on mobile shows all steps with circles + connectors; only the active step's label is visible.
- **Color picker custom swatch** — click opens Edit/Delete menu, not immediate delete.
- **Style presets** repeat 3× (27 total) for prototype "Load more" behaviour.
- **Typography "Designer's Choice"** is a tab in the font browser, not a type option. Clicking it shows a message instead of font cards.

### API Routes (`src/app/api/`)

| Route | Method | Description |
|-------|--------|-------------|
| `/api/create-checkout` | POST | Creates Stripe Checkout session, returns `{ sessionId, url }` |
| `/api/submit-order` | POST | Verifies Stripe payment, uploads files to Firebase Storage, saves order to Firestore |

### Firebase Firestore schema

**Collection: `orders`** — one doc per confirmed order with all order fields + `logoUrl`, `inspirationUrl`, `stripeSessionId`, `paymentStatus`

**Collection: `used_sessions`** — doc ID = Stripe session ID, prevents double-submission

### Shared components (`src/components/branding/shared/`)

`ServiceCard`, `StyleCard`, `VariationCard`, `ProgressBar`, `Button`, `BackButton`, `TextInput`, `SummaryRow`, `UploadZone`.

### Tokens

All design tokens live in `tokens.css` and the `T` object in `tokens.ts`.

## Environment variables

| Variable | Used in |
|----------|---------|
| `NEXT_PUBLIC_FIREBASE_*` | Client-side Firebase SDK |
| `FIREBASE_PROJECT_ID`, `FIREBASE_PRIVATE_KEY`, etc. | Server-side Firebase Admin SDK (`/api/submit-order`) |
| `STRIPE_SECRET_KEY` | Server-side Stripe (`/api/create-checkout`, `/api/submit-order`) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Client-side Stripe (future use) |
| `NEXT_PUBLIC_APP_URL` | Stripe success/cancel redirect URLs |
