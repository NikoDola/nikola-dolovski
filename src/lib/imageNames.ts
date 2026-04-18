import treeData from "@/data/imageNames.json"

export const ALLOWED_EXTENSIONS = ["svg", "avif", "webp", "png", "jpg", "jpeg"] as const
export type AllowedExtension = (typeof ALLOWED_EXTENSIONS)[number]
export type ImageCategory = "branding" | "ui"

// ── Types ─────────────────────────────────────────────────────────────────────

type TreeNode = Record<string, unknown>

export interface ParsedImage {
  baseName: string
  ext: string
  brand?: string
  category: ImageCategory
  /** segments that navigate the tree (no @labels, no brand, no category) */
  pathSegments: string[]
  /** proper noun labels from @label segments */
  labels: string[]
}

export interface ImageValidation {
  valid: boolean
  error?: string
  section?: string
}

// ── Parse ──────────────────────────────────────────────────────────────────────

/**
 * Format: @brand_branding_logo_primary_color.svg
 *   @brand   = optional proper noun brand prefix
 *   branding = category ("branding" or "ui")
 *   logo     = first tree node
 *   primary  = child node
 *   color    = mod
 *
 * @label segments anywhere after the category are proper noun labels —
 * skipped in tree traversal but recorded in labels[].
 * mockup is a global mod valid at any tree node.
 */
export function parseImageFilename(filename: string): ParsedImage | null {
  const lastDot = filename.lastIndexOf(".")
  if (lastDot === -1) return null
  const ext = filename.slice(lastDot + 1).toLowerCase()
  const baseName = filename.slice(0, lastDot).toLowerCase()
  const parts = baseName.split("_")

  let idx = 0
  let brand: string | undefined

  if (parts[idx]?.startsWith("@")) {
    brand = parts[idx].slice(1)
    idx++
  }

  const category = parts[idx]
  if (category !== "branding" && category !== "ui") return null
  idx++

  const rest = parts.slice(idx)
  const labels = rest.filter((p) => p.startsWith("@")).map((p) => p.slice(1))
  const pathSegments = rest.filter((p) => !p.startsWith("@"))

  return { baseName, ext, brand, category: category as ImageCategory, pathSegments, labels }
}

// ── Tree helpers ───────────────────────────────────────────────────────────────

function getTree(category: ImageCategory): TreeNode {
  return (treeData as Record<string, TreeNode>)[category] ?? {}
}

function walkTree(
  tree: TreeNode,
  segments: string[]
): { valid: boolean; error?: string } {
  let current: TreeNode = tree
  let atMod = false

  for (const seg of segments) {
    if (seg === "mockup") { atMod = true; continue }

    const mods = (current["mods"] as string[] | undefined) ?? []
    if (mods.includes(seg)) { atMod = true; continue }

    if (atMod) {
      return { valid: false, error: `"${seg}" cannot follow a modifier.` }
    }

    if (seg in current && seg !== "mods") {
      current = current[seg] as TreeNode
      continue
    }

    const childKeys = Object.keys(current).filter((k) => k !== "mods")
    const hint = [...childKeys, ...mods, "mockup"].slice(0, 6).join(", ")
    return { valid: false, error: `"${seg}" is not valid here. Options: ${hint}` }
  }

  return { valid: true }
}

// ── Section map ────────────────────────────────────────────────────────────────

const SECTION_DISPLAY: Record<string, string> = {
  logo: "Logo",
  icon: "Icons",
  mascot: "Mascot",
  illustration: "Illustration",
  pattern: "Pattern",
  color: "Colors",
  typography: "Typography",
  "brand-guidelines": "Brand Guidelines",
  stationery: "Stationery",
  print: "Print",
  packaging: "Packaging",
  merch: "Merch",
  social: "Social",
  signage: "Signage",
  page: "Pages",
  structure: "Structure",
  components: "Components",
  navigation: "Navigation",
  sections: "UI Sections",
  auth: "Auth",
  user: "User",
  ecommerce: "E-Commerce",
  email: "Email",
  states: "States",
  animation: "Animation",
  visual: "Visual",
  system: "Design System",
  responsive: "Responsive",
  theme: "Theme",
  prototype: "Prototype",
}

export const SECTION_ORDER = [
  "Logo", "Icons", "Mascot", "Illustration", "Pattern", "Colors", "Typography",
  "Brand Guidelines", "Stationery", "Print", "Packaging", "Merch", "Social", "Signage",
  "Pages", "Structure", "Components", "Navigation", "UI Sections", "Auth", "User",
  "E-Commerce", "Email", "States", "Animation", "Visual", "Design System",
  "Responsive", "Theme", "Prototype",
  "Other",
]

// ── Public API ─────────────────────────────────────────────────────────────────

export function validateImageFile(filename: string): ImageValidation {
  const parsed = parseImageFilename(filename)

  if (!parsed) {
    return {
      valid: false,
      error: `Invalid format. Use: @brand_branding_logo_primary.svg or @brand_ui_page_landing-page.svg`,
    }
  }

  if (!ALLOWED_EXTENSIONS.includes(parsed.ext as AllowedExtension)) {
    return { valid: false, error: `".${parsed.ext}" not allowed. Use: ${ALLOWED_EXTENSIONS.join(", ")}` }
  }

  if (parsed.pathSegments.length === 0) {
    return { valid: false, error: `Missing path after category. Add a section like _logo or _icon` }
  }

  const tree = getTree(parsed.category)
  const result = walkTree(tree, parsed.pathSegments)

  if (!result.valid) return { valid: false, error: result.error }

  return { valid: true, section: SECTION_DISPLAY[parsed.pathSegments[0]] ?? "Other" }
}

export function getImageSection(filename: string): string {
  const parsed = parseImageFilename(filename)
  if (!parsed || parsed.pathSegments.length === 0) return "Other"
  return SECTION_DISPLAY[parsed.pathSegments[0]] ?? "Other"
}

export function isLogoMockup(filename: string): boolean {
  const parsed = parseImageFilename(filename)
  if (!parsed) return false
  return parsed.pathSegments[0] === "logo" && parsed.pathSegments.includes("mockup")
}

export function isBrandIcon(filename: string): boolean {
  const parsed = parseImageFilename(filename)
  if (!parsed) return false
  return parsed.category === "branding" && parsed.pathSegments[0] === "icon"
}

export function getIconLabel(filename: string): string {
  const parsed = parseImageFilename(filename)
  if (!parsed) return filename
  if (parsed.labels.length > 0) return parsed.labels.join(" ").replace(/-/g, " ")
  return parsed.pathSegments.slice(1).join(" ").replace(/-/g, " ") || "icon"
}

// ── Collect all valid paths from tree ─────────────────────────────────────────

function collectPaths(node: TreeNode, prefix: string[] = [], out: string[][] = []): string[][] {
  out.push(prefix)
  const mods = (node["mods"] as string[] | undefined) ?? []
  for (const mod of mods) out.push([...prefix, mod])
  for (const key of Object.keys(node)) {
    if (key === "mods") continue
    collectPaths(node[key] as TreeNode, [...prefix, key], out)
  }
  return out
}

// ── Fuzzy helpers ──────────────────────────────────────────────────────────────

function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length
  const dp = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  )
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])
  return dp[m][n]
}

function tokenize(s: string): string[] {
  return s.toLowerCase().replace(/[@_]/g, "-").split("-").filter(Boolean)
}

function scorePath(inputTokens: string[], pathTokens: string[]): number {
  const shared = inputTokens.filter((t) => pathTokens.includes(t)).length
  const tokenScore = shared / Math.max(inputTokens.length, pathTokens.length, 1)
  const inputStr = inputTokens.join("")
  const pathStr = pathTokens.join("")
  const lev = levenshtein(inputStr, pathStr)
  const maxLen = Math.max(inputStr.length, pathStr.length, 1)
  const levScore = 1 - lev / maxLen
  return tokenScore * 0.7 + levScore * 0.3
}

// ── Auto-correct ───────────────────────────────────────────────────────────────

/**
 * Finds the closest valid tree path for an invalid filename and returns the
 * corrected full filename, or null if no confident match (score < 0.2).
 *
 * @label segments are preserved in the corrected filename.
 * The brand prefix is preserved if present.
 */
export function autoCorrectFilename(baseName: string, ext: string): string | null {
  const parts = baseName.toLowerCase().split("_")
  let idx = 0

  let brand: string | undefined
  if (parts[idx]?.startsWith("@")) { brand = parts[idx]; idx++ }

  const category: ImageCategory = parts[idx] === "ui" ? "ui" : "branding"

  const rest = parts.slice(idx + 1)
  const labels = rest.filter((p) => p.startsWith("@"))
  const pathParts = rest.filter((p) => !p.startsWith("@"))
  const inputTokens = tokenize(pathParts.join("-"))

  const tree = getTree(category)
  const allPaths = collectPaths(tree).filter((p) => p.length > 0)

  let best: { path: string[]; score: number } = { path: [], score: 0 }
  for (const path of allPaths) {
    const score = scorePath(inputTokens, tokenize(path.join("-")))
    if (score > best.score) best = { path, score }
  }

  if (best.score < 0.2) return null

  const segments: string[] = []
  if (brand) segments.push(brand)
  segments.push(category)
  if (labels.length > 0) segments.push(...labels)
  segments.push(...best.path)

  return `${segments.join("_")}.${ext}`
}