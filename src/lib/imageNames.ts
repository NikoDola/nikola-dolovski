import imageNamesData from "@/data/imageNames.json"

export const ALLOWED_EXTENSIONS = ["svg", "avif", "webp", "png", "jpg", "jpeg"] as const
export type AllowedExtension = (typeof ALLOWED_EXTENSIONS)[number]
export type ImageSuffix = "branding" | "ui"

export interface ImageValidation {
  valid: boolean
  error?: string
  name?: string
  suffix?: ImageSuffix
  ext?: string
}

export function parseImageFilename(filename: string): {
  baseName: string
  name: string
  suffix: string
  ext: string
} | null {
  const lastDot = filename.lastIndexOf(".")
  if (lastDot === -1) return null
  const ext = filename.slice(lastDot + 1).toLowerCase()
  const baseName = filename.slice(0, lastDot).toLowerCase()
  const underscoreIdx = baseName.lastIndexOf("_")
  if (underscoreIdx === -1) return { baseName, name: baseName, suffix: "", ext }
  return {
    baseName,
    name: baseName.slice(0, underscoreIdx),
    suffix: baseName.slice(underscoreIdx + 1),
    ext,
  }
}

export function validateImageFile(filename: string): ImageValidation {
  const parsed = parseImageFilename(filename)

  if (!parsed) {
    return { valid: false, error: `No extension found. Format: name_branding.webp or name_ui.png` }
  }

  const { name, suffix, ext } = parsed

  if (!ALLOWED_EXTENSIONS.includes(ext as AllowedExtension)) {
    return { valid: false, error: `".${ext}" not allowed. Use: ${ALLOWED_EXTENSIONS.join(", ")}` }
  }

  if (!suffix) {
    return {
      valid: false,
      error: `Missing suffix. Rename to: ${name}_branding.${ext} or ${name}_ui.${ext}`,
    }
  }

  if (suffix !== "branding" && suffix !== "ui") {
    return { valid: false, error: `"_${suffix}" is not valid. Suffix must be _branding or _ui` }
  }

  const allowedNames: string[] = (imageNamesData as Record<string, string[]>)[suffix]
  if (!allowedNames.includes(name)) {
    return {
      valid: false,
      error: `"${name}" not in the ${suffix} list. Add it to src/data/imageNames.json to use it.`,
    }
  }

  return { valid: true, name, suffix: suffix as ImageSuffix, ext }
}

// Section grouping for portfolio page rendering
const BRANDING_SECTIONS: Array<{ section: string; names: string[] }> = [
  {
    section: "Logo",
    names: [
      "primary-logo", "horizontal-logo", "vertical-logo", "icon-logo", "badge-logo",
      "logo-mark", "logo-mockup", "logo-grid", "logo-clearspace", "logo-variations",
    ],
  },
  { section: "Colors", names: ["color-palette", "color-usage"] },
  { section: "Typography", names: ["typography", "font-pairing", "type-scale"] },
  { section: "Mascot", names: ["mascot"] },
  {
    section: "Guidelines",
    names: ["brand-guidelines", "brand-book", "visual-identity", "brand-strategy", "brand-positioning"],
  },
  {
    section: "Stationery",
    names: ["business-card", "letterhead", "envelope", "invoice", "email-signature"],
  },
  { section: "Print", names: ["brochure", "flyer", "poster", "catalog", "menu"] },
  { section: "Packaging", names: ["packaging", "label", "box", "bottle", "bag"] },
  {
    section: "Merch",
    names: ["merchandise", "t-shirt", "hoodie", "tote-bag", "sticker"],
  },
  {
    section: "Social",
    names: ["social-media", "social-post", "social-banner", "ad-creative", "billboard"],
  },
  { section: "Signage", names: ["signage", "storefront", "vehicle-branding", "exhibition"] },
]

export const SECTION_ORDER = [
  "Logo", "Colors", "Typography", "Mascot", "Guidelines",
  "Stationery", "Print", "Packaging", "Merch", "Social", "Signage",
  "UI", "Branding", "Other",
]

export function getImageSection(filename: string): string {
  const parsed = parseImageFilename(filename)
  if (!parsed) return "Other"
  const { name, suffix } = parsed
  if (suffix === "ui") return "UI"
  for (const group of BRANDING_SECTIONS) {
    if (group.names.includes(name)) return group.section
  }
  return "Branding"
}

export function isLogoMockup(filename: string): boolean {
  const parsed = parseImageFilename(filename)
  return parsed?.name === "logo-mockup"
}
