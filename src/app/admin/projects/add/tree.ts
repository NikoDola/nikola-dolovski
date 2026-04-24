export type BranchNode = { [key: string]: BranchNode | string[] | null }

export const BRANDING_TREE: BranchNode = {
  Logo: {
    Variations: {
      "Horizontal Logo": ["Aspect Ratio", "Safe Zone", "Mono"],
      "Vertical Logo":   ["Aspect Ratio", "Safe Zone", "Mono"],
      "Badge":           ["Aspect Ratio", "Safe Zone", "Mono"],
      "Icon":            ["Aspect Ratio", "Safe Zone", "Mono"],
      "Mascot":          ["Aspect Ratio", "Safe Zone", "Mono"],
    },
    Animation: null,
  },
  Colors: {
    Solid:    ["Primary", "Secondary", "Gray Scale"],
    Gradient: ["Primary", "Secondary"],
  },
  Typography: ["Heading", "Body"],
  Iconography: {
    "Custom Icons": ["Fill", "Outline", "Illustration"],
    "Stock Icons":  ["Fill", "Outline", "Illustration"],
  },
  Print: {
    Stationery: ["Business Cards", "Letterhead & Envelope"],
    Menu:       null,
    Flyers:     null,
    Brochures:  ["Bi-Fold", "Tri-Fold"],
    Magazine:   null,
  },
  Packaging: ["Box", "Label", "Wrapper"],
  "Social Media": {
    "Profile Image": null,
    "Cover Image":   null,
    Post: ["Standard Posts", "Ads Posts"],
  },
  "Pattern & Texture": null,
}

export const UI_TYPES = [
  { id: "website",     label: "Website",     icon: "⬚", implemented: true  },
  { id: "application", label: "Application", icon: "📱", implemented: false },
  { id: "wireframe",   label: "Wireframe",   icon: "⬜", implemented: false },
  { id: "prototype",   label: "Prototype",   icon: "⚡", implemented: false },
  { id: "ui-kit",      label: "UI Kit",      icon: "🎨", implemented: false },
  { id: "animation",   label: "Animation",   icon: "✦",  implemented: false },
]

export function getTreeNode(path: string[]): BranchNode | string[] | null | undefined {
  let cur: BranchNode | string[] | null = BRANDING_TREE
  for (const seg of path) {
    if (cur === null || Array.isArray(cur)) return undefined
    const next: BranchNode | string[] | null | undefined = (cur as BranchNode)[seg]
    if (next === undefined) return undefined
    cur = next
  }
  return cur
}

export function nodeChoices(path: string[]): string[] {
  const node = getTreeNode(path)
  if (node === undefined || node === null) return []
  if (Array.isArray(node)) return node
  return Object.keys(node)
}

export function isColorSection(path: string[]): boolean {
  return path.some((s) => s.toLowerCase() === "colors")
}

export function makeColorHeadline(path: string[]): string {
  if (!isColorSection(path)) return ""
  const last = path[path.length - 1]
  const prev = path[path.length - 2]?.toLowerCase()
  return prev === "gradient" ? `${last} Gradient` : `${last} Colors`
}
