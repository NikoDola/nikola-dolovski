export interface ServiceTree {
  [key: string]: ServiceTree | null
}

function segToSlug(seg: string): string {
  return seg.toLowerCase()
    .replace(/&/g, "and")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

export function pathToId(path: string[]): string {
  return path.map(segToSlug).join("/")
}

export const SERVICE_TREE: ServiceTree = {
  Branding: {
    Logo: {
      "Horizontal Logo": { "Aspect Ratio": null, "Safe Zone": null, "Mono": null },
      "Vertical Logo":   { "Aspect Ratio": null, "Safe Zone": null, "Mono": null },
      "Badge":           { "Aspect Ratio": null, "Safe Zone": null, "Mono": null },
      "Icon":            { "Aspect Ratio": null, "Safe Zone": null, "Mono": null },
      "Mascot":          { "Aspect Ratio": null, "Safe Zone": null, "Mono": null },
      Animation: null,
    },
    Print: {
      Stationery: {
        "Business Cards": null,
        "Letterhead & Envelope": null,
      },
      Menu: null,
      Flyers: null,
      Brochures: {
        "Bi-Fold": null,
        "Tri-Fold": null,
      },
      Magazine: null,
    },
    Packaging: {
      Box: null,
      Label: null,
      Wrapper: null,
    },
    Iconography: {
      "Custom Icons": {
        Fill: null,
        Outline: null,
        Illustration: null,
      },
      "Stock Icons": {
        Fill: null,
        Outline: null,
        Illustration: null,
      },
    },
    Typography: {
      Heading: null,
      Body: null,
    },
    Colors: {
      Solid: {
        Primary: null,
        Secondary: null,
        "Gray Scale": null,
      },
      Gradient: {
        Primary: null,
        Secondary: null,
      },
    },
    "Social Media": {
      "Profile Image": null,
      "Cover Image": null,
      Post: {
        "Standard Posts": null,
        "Ads Posts": null,
      },
    },
    "Pattern & Texture": null,
  },
  "Web Design": {
    "Navigation and Footer": null,
    "Hero Section": null,
    Typography: null,
    Colors: null,
    "User Flow": null,
    "Digital Assets": {
      "Email Signature": null,
      "Email Template": null,
    },
    Maintenance: null,
    "Payment System": {
      Stripe: null,
      PayPal: null,
      Venmo: null,
      CashApp: null,
    },
    Pages: {
      Landing: null,
      About: null,
      Location: null,
      Product: null,
      "Custom Page": null,
      Contact: null,
      "Thank You Page": null,
      "404 Page not found": null,
      Portfolio: null,
      Services: null,
    },
    Animation: {
      "Logo Hover": null,
      Loading: null,
    },
  },
}

// Build a label lookup map: id → original label string
function buildLabelMap(tree: ServiceTree, prefix: string[] = []): Record<string, string> {
  const map: Record<string, string> = {}
  for (const [label, child] of Object.entries(tree)) {
    const path = [...prefix, label]
    map[pathToId(path)] = label
    if (child !== null) Object.assign(map, buildLabelMap(child, path))
  }
  return map
}

export const LABEL_MAP: Record<string, string> = buildLabelMap(SERVICE_TREE)
