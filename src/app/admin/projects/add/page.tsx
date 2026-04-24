"use client"
import { useEffect, useRef, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { getProjects } from "@/lib/actions/projects"
import { TagsInput } from "@/components/ui/TagsInput"
import type { Project, BrandColor, ProjectSection } from "@/types/project"
import "./add.css"

// ── Brand tree ────────────────────────────────────────────────────────────────

type BranchNode = { [key: string]: BranchNode | string[] | null }

const BRANDING_TREE: BranchNode = {
  Logo: {
    "Logo Horizontal": ["Aspect Ratio", "Safe Zone", "Minimum Sizes", "Monochrome"],
    "Vertical Logo":   ["Aspect Ratio", "Safe Zone", "Minimum Sizes", "Monochrome"],
    "Icon Logo":       ["Aspect Ratio", "Safe Zone", "Minimum Sizes", "Monochrome"],
    "Mascot Logo":     ["Aspect Ratio", "Safe Zone", "Sizes",         "Monochrome"],
    "Typography Logo": ["Aspect Ratio", "Safe Zone", "Minimum Sizes", "Monochrome"],
    "Badge Logo":      ["Minimum Sizes", "Monochrome"],
  },
  Colors: {
    Solid:    ["Primary", "Secondary", "Neutral"],
    Gradient: ["Primary", "Secondary", "Neutral"],
  },
  Typography:        ["Heading", "Body"],
  Patterns:          null,
  "Print / Physical": {
    Stationery: ["Envelope", "Business Cards", "LetterHead"],
    Packaging:  ["Box", "Label", "Wrapping"],
  },
  "Digital Branding": ["Email Signature", "Social Media Assets"],
}

const UI_TYPES = [
  { id: "website",     label: "Website",     icon: "⬚", implemented: true  },
  { id: "application", label: "Application", icon: "📱", implemented: false },
  { id: "wireframe",   label: "Wireframe",   icon: "⬜", implemented: false },
  { id: "prototype",   label: "Prototype",   icon: "⚡", implemented: false },
  { id: "ui-kit",      label: "UI Kit",      icon: "🎨", implemented: false },
  { id: "animation",   label: "Animation",   icon: "✦",  implemented: false },
]

function getTreeNode(path: string[]): BranchNode | string[] | null | undefined {
  let cur: BranchNode | string[] | null = BRANDING_TREE
  for (const seg of path) {
    if (cur === null || Array.isArray(cur)) return undefined
    const next: BranchNode | string[] | null | undefined = (cur as BranchNode)[seg]
    if (next === undefined) return undefined
    cur = next
  }
  return cur
}

function nodeChoices(path: string[]): string[] {
  const node = getTreeNode(path)
  if (node === undefined || node === null) return []
  if (Array.isArray(node)) return node
  return Object.keys(node)
}

function isColorSection(path: string[]): boolean {
  return path.some((s) => s.toLowerCase() === "colors")
}

function makeColorHeadline(path: string[]): string {
  if (!isColorSection(path)) return ""
  const last = path[path.length - 1]
  const prev = path[path.length - 2]?.toLowerCase()
  return prev === "gradient" ? `${last} Gradient` : `${last} Colors`
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
}

function getInitials(firstName: string, lastName: string) {
  return ((firstName.trim()[0] ?? "") + (lastName.trim()[0] ?? "")).toUpperCase() || "?"
}

function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgb(${r}, ${g}, ${b})`
}

function extractHexSet(svgText: string): Set<string> {
  const set = new Set<string>()
  const regex = /#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})\b/g
  let m
  while ((m = regex.exec(svgText)) !== null) {
    let h = m[1].toLowerCase()
    if (h.length === 3) h = h.split("").map((c) => c + c).join("")
    const full = `#${h}`
    if (full !== "#000000" && full !== "#ffffff") set.add(full)
  }
  return set
}

// ── Types ─────────────────────────────────────────────────────────────────────

interface SectionFile { file: File; name: string; preview: string }

interface SectionDraft {
  id: string
  path: string[]
  headline: string
  body: string
  sectionColors: BrandColor[]
  newFiles: SectionFile[]
  existingImages: string[]
}

interface UiSectionDraft {
  id: string
  type: string
  headline: string
  newFiles: SectionFile[]
  existingImages: string[]
  mobileUrl: string
  desktopUrl: string
  deviceType: "website" | "application"
}

type BuildMode = "navigate" | "form"

interface BuildState {
  editId: string | null
  path: string[]
  headline: string
  body: string
  sectionColors: BrandColor[]
  colorPickerHex: string
  newFiles: SectionFile[]
  existingImages: string[]
  mode: BuildMode
}

interface UiBuildState {
  editId: string | null
  type: string
  headline: string
  newFiles: SectionFile[]
  existingImages: string[]
  mobileUrl: string
  desktopUrl: string
  deviceType: "website" | "application"
}

// ── Section Card ──────────────────────────────────────────────────────────────

function SectionCard({
  draft, index, total, isEditing,
  onEdit, onDelete, onMoveUp, onMoveDown,
}: {
  draft: SectionDraft; index: number; total: number; isEditing: boolean
  onEdit: () => void; onDelete: () => void; onMoveUp: () => void; onMoveDown: () => void
}) {
  const pathLabel = draft.path.join(" / ")
  const imgCount = draft.existingImages.length + draft.newFiles.length
  const colorCount = draft.sectionColors.length
  return (
    <div className={`sb__card${isEditing ? " sb__card--editing" : ""}`}>
      <div className="sb__cardMove">
        <button type="button" onClick={onMoveUp} disabled={index === 0} title="Move up">↑</button>
        <button type="button" onClick={onMoveDown} disabled={index === total - 1} title="Move down">↓</button>
      </div>
      <div className="sb__cardMeta">
        <span className="sb__cardPath">{pathLabel}</span>
        <span className="sb__cardHeadline">{draft.headline || <em>No headline</em>}</span>
        <span className="sb__cardCount">
          {colorCount > 0 ? `${colorCount} color${colorCount !== 1 ? "s" : ""}` : `${imgCount} image${imgCount !== 1 ? "s" : ""}`}
        </span>
      </div>
      <div className="sb__cardActions">
        <button type="button" onClick={onEdit} className={`sb__cardEdit${isEditing ? " sb__cardEdit--active" : ""}`}>
          {isEditing ? "▲ Collapse" : "Edit"}
        </button>
        <button type="button" onClick={onDelete} className="sb__cardDelete">Delete</button>
      </div>
    </div>
  )
}

// ── Section Builder ───────────────────────────────────────────────────────────

function SectionBuilder({
  drafts, projectSlug, onChange,
}: {
  drafts: SectionDraft[]
  projectSlug: string
  onChange: (drafts: SectionDraft[]) => void
}) {
  const [build, setBuild] = useState<BuildState | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function startNew() {
    const lastPath = drafts.length > 0 ? drafts[drafts.length - 1].path.slice(1) : []
    setBuild({
      editId: null,
      path: lastPath.length > 0 ? lastPath.slice(0, -1) : [],
      headline: "",
      body: "",
      sectionColors: [],
      colorPickerHex: "#88D1D4",
      newFiles: [],
      existingImages: [],
      mode: "navigate",
    })
  }

  function startEdit(draft: SectionDraft) {
    if (build?.editId === draft.id) { setBuild(null); return }
    setBuild({
      editId: draft.id,
      path: draft.path.slice(1),
      headline: draft.headline,
      body: draft.body,
      sectionColors: draft.sectionColors,
      colorPickerHex: "#88D1D4",
      newFiles: draft.newFiles,
      existingImages: draft.existingImages,
      mode: "form",
    })
  }

  function selectNode(segment: string) {
    if (!build) return
    const newPath = [...build.path, segment]
    const parentNode = getTreeNode(build.path)
    const isLeafChoice = Array.isArray(parentNode) && parentNode.includes(segment)
    const node = getTreeNode(newPath)
    if (node === null || isLeafChoice) {
      const defaultHeadline = makeColorHeadline(newPath) || segment
      setBuild({ ...build, path: newPath, headline: build.headline || defaultHeadline, mode: "form" })
    } else {
      setBuild({ ...build, path: newPath })
    }
  }

  function saveSection() {
    if (!build) return
    const fullPath = ["Branding", ...build.path]
    const draft: SectionDraft = {
      id: build.editId ?? crypto.randomUUID(),
      path: fullPath,
      headline: build.headline || build.path[build.path.length - 1] || "Untitled",
      body: build.body,
      sectionColors: build.sectionColors,
      newFiles: build.newFiles,
      existingImages: build.existingImages,
    }
    if (build.editId) {
      onChange(drafts.map((d) => d.id === build.editId ? draft : d))
    } else {
      onChange([...drafts, draft])
    }
    setBuild(null)
  }

  const choices = build ? nodeChoices(build.path) : []
  const colorSection = build ? isColorSection(build.path) : false

  const builderPanel = build && (
    <div className="sb__panel">
      {/* Breadcrumb */}
      <div className="sb__crumb">
        <button type="button" className="sb__crumbSeg sb__crumbSeg--root"
          onClick={() => setBuild({ ...build, path: [], mode: "navigate" })}>Branding</button>
        {build.path.map((seg, i) => (
          <span key={i} className="sb__crumbPart">
            <span className="sb__crumbSep">/</span>
            <button type="button" className="sb__crumbSeg"
              onClick={() => setBuild({ ...build, path: build.path.slice(0, i + 1), mode: "navigate" })}>
              {seg}
            </button>
          </span>
        ))}
      </div>

      {build.mode === "navigate" ? (
        <div className="sb__nav">
          {choices.length > 0 && (
            <div className="sb__choices">
              {choices.map((choice) => (
                <button key={choice} type="button" className="sb__choice" onClick={() => selectNode(choice)}>
                  {choice}
                </button>
              ))}
            </div>
          )}
          {build.path.length > 0 && (
            <button type="button" className="sb__selectHere"
              onClick={() => setBuild({ ...build, headline: build.headline || makeColorHeadline(build.path) || build.path[build.path.length - 1] || "", mode: "form" })}>
              Create section here: <strong>{build.path.join(" / ")}</strong>
            </button>
          )}
          <button type="button" className="sb__cancelNav" onClick={() => setBuild(null)}>Cancel</button>
        </div>
      ) : (
        <div className="sb__form">
          <label className="sb__formLabel">
            Section Headline
            <input className="sb__formInput" value={build.headline}
              placeholder={build.path[build.path.length - 1] ?? "Headline"}
              onChange={(e) => setBuild({ ...build, headline: e.target.value })} />
          </label>

          <label className="sb__formLabel">
            Description <span className="apfa__hint">(optional)</span>
            <textarea className="sb__formTextarea" rows={3} value={build.body}
              placeholder="Describe this section..."
              onChange={(e) => setBuild({ ...build, body: e.target.value })} />
          </label>

          {/* Color editor for Colors sections */}
          {colorSection ? (
            <div className="sb__colorEditor">
              <p className="sb__colorEditorLabel">Color Palette</p>
              {build.sectionColors.length > 0 && (
                <div className="sb__colorRows">
                  {build.sectionColors.map((color, i) => (
                    <div key={i} className="sb__colorRowWrap">
                      {/* Parent row */}
                      <div className="sb__colorRow">
                        <label className="apfa__colorDotWrap" title="Click to change">
                          <div className="apfa__colorDot" style={{ background: color.hex }} />
                          <input type="color" value={color.hex} className="apfa__colorInput"
                            onChange={(e) => {
                              const hex = e.target.value
                              setBuild({ ...build, sectionColors: build.sectionColors.map((c, j) =>
                                j === i ? { ...c, hex, rgb: hexToRgb(hex) } : c
                              )})
                            }} />
                        </label>
                        <input className="sb__colorName" value={color.name ?? ""}
                          placeholder="e.g. Primary Red"
                          onChange={(e) => setBuild({ ...build, sectionColors: build.sectionColors.map((c, j) =>
                            j === i ? { ...c, name: e.target.value } : c
                          )})} />
                        <input className="sb__colorHexInput" value={color.hex} maxLength={7} spellCheck={false}
                          onChange={(e) => {
                            const raw = e.target.value
                            const hex = raw.startsWith("#") ? raw : "#" + raw
                            setBuild({ ...build, sectionColors: build.sectionColors.map((c, j) =>
                              j === i ? { ...c, hex, rgb: /^#[0-9A-Fa-f]{6}$/.test(hex) ? hexToRgb(hex) : c.rgb } : c
                            )})
                          }} />
                        <button type="button" className="sb__colorRemove"
                          onClick={() => setBuild({ ...build, sectionColors: build.sectionColors.filter((_, j) => j !== i) })}>
                          ✕
                        </button>
                        <button type="button" className="sb__colorAddChild"
                          onClick={() => setBuild({ ...build, sectionColors: build.sectionColors.map((c, j) =>
                            j === i ? { ...c, children: [...(c.children ?? []), { hex: c.hex, rgb: c.rgb, order: c.children?.length ?? 0, name: "" }] } : c
                          )})}>
                          Add Child
                        </button>
                      </div>

                      {/* Child rows */}
                      {color.children && color.children.length > 0 && (
                        <div className="sb__colorChildren">
                          {color.children.map((child, j) => (
                            <div key={j} className="sb__colorRow sb__colorRow--child">
                              <label className="apfa__colorDotWrap apfa__colorDotWrap--sm" title="Click to change">
                                <div className="apfa__colorDot apfa__colorDot--sm" style={{ background: child.hex }} />
                                <input type="color" value={child.hex} className="apfa__colorInput"
                                  onChange={(e) => {
                                    const hex = e.target.value
                                    setBuild({ ...build, sectionColors: build.sectionColors.map((c, ci) =>
                                      ci === i ? { ...c, children: c.children?.map((ch, cj) =>
                                        cj === j ? { ...ch, hex, rgb: hexToRgb(hex) } : ch
                                      ) } : c
                                    )})
                                  }} />
                              </label>
                              <input className="sb__colorName" value={child.name ?? ""}
                                placeholder={`${color.name || "Color"}-dark-tone`}
                                onChange={(e) => setBuild({ ...build, sectionColors: build.sectionColors.map((c, ci) =>
                                  ci === i ? { ...c, children: c.children?.map((ch, cj) =>
                                    cj === j ? { ...ch, name: e.target.value } : ch
                                  ) } : c
                                )})} />
                              <input className="sb__colorHexInput" value={child.hex} maxLength={7} spellCheck={false}
                                onChange={(e) => {
                                  const raw = e.target.value
                                  const hex = raw.startsWith("#") ? raw : "#" + raw
                                  setBuild({ ...build, sectionColors: build.sectionColors.map((c, ci) =>
                                    ci === i ? { ...c, children: c.children?.map((ch, cj) =>
                                      cj === j ? { ...ch, hex, rgb: /^#[0-9A-Fa-f]{6}$/.test(hex) ? hexToRgb(hex) : ch.rgb } : ch
                                    ) } : c
                                  )})
                                }} />
                              <button type="button" className="sb__colorRemove"
                                onClick={() => setBuild({ ...build, sectionColors: build.sectionColors.map((c, ci) =>
                                  ci === i ? { ...c, children: c.children?.filter((_, cj) => cj !== j) } : c
                                )})}>
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              <div className="sb__colorAddRow">
                <label className="apfa__colorDotWrap" title="Pick color">
                  <div className="apfa__colorDot" style={{ background: build.colorPickerHex }} />
                  <input type="color" value={build.colorPickerHex} className="apfa__colorInput"
                    onChange={(e) => setBuild({ ...build, colorPickerHex: e.target.value })} />
                </label>
                <button type="button" className="apfa__addImg"
                  onClick={() => setBuild({ ...build, sectionColors: [
                    ...build.sectionColors,
                    { hex: build.colorPickerHex, rgb: hexToRgb(build.colorPickerHex), order: build.sectionColors.length, name: "", usage: "" }
                  ]})}>
                  + Add Color
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Existing images */}
              {build.existingImages.length > 0 && (
                <div className="sb__existingImgs">
                  {build.existingImages.map((img) => (
                    <div key={img} className="sb__existingImg">
                      <button type="button" className="sb__removeImg"
                        onClick={() => setBuild({ ...build, existingImages: build.existingImages.filter((x) => x !== img) })}>✕</button>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img} alt="" />
                      <span>{img.split("/").pop()}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* New files */}
              {build.newFiles.length > 0 && (
                <div className="sb__fileGrid">
                  {build.newFiles.map((f, i) => (
                    <div key={i} className="sb__fileCard">
                      <button type="button" className="sb__removeImg"
                        onClick={() => setBuild({ ...build, newFiles: build.newFiles.filter((_, j) => j !== i) })}>✕</button>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={f.preview} alt={f.name} />
                      <span>{f.name}</span>
                    </div>
                  ))}
                </div>
              )}

              <input ref={fileInputRef} type="file" accept="image/*,.svg" multiple style={{ display: "none" }}
                onChange={(e) => {
                  const files = Array.from(e.target.files ?? []).map((f) => ({
                    file: f, name: f.name, preview: URL.createObjectURL(f),
                  }))
                  setBuild({ ...build, newFiles: [...build.newFiles, ...files] })
                  if (fileInputRef.current) fileInputRef.current.value = ""
                }} />

              <div className="sb__formActions">
                <button type="button" className="apfa__addImg" onClick={() => fileInputRef.current?.click()}>
                  + Upload Images
                </button>
                <button type="button" className="sb__changePathBtn"
                  onClick={() => setBuild({ ...build, mode: "navigate" })}>
                  Change Path
                </button>
              </div>
            </>
          )}

          <div className="sb__formFooter">
            <button type="button" className="sb__cancelNav" onClick={() => setBuild(null)}>Cancel</button>
            <button type="button" className="sb__saveSection" onClick={saveSection}>
              {build.editId ? "Update Section" : "Add Section"}
            </button>
          </div>
        </div>
      )}
    </div>
  )

  return (
    <div className="sb">
      {/* Cards list with inline edit */}
      {drafts.length > 0 && (
        <div className="sb__list">
          {drafts.map((draft, i) => {
            const isEditing = build?.editId === draft.id
            return (
              <div key={draft.id} className="sb__entry">
                <SectionCard
                  draft={draft} index={i} total={drafts.length} isEditing={isEditing}
                  onEdit={() => startEdit(draft)}
                  onDelete={() => onChange(drafts.filter((d) => d.id !== draft.id))}
                  onMoveUp={() => {
                    if (i === 0) return
                    const next = [...drafts]; [next[i - 1], next[i]] = [next[i], next[i - 1]]; onChange(next)
                  }}
                  onMoveDown={() => {
                    if (i === drafts.length - 1) return
                    const next = [...drafts]; [next[i], next[i + 1]] = [next[i + 1], next[i]]; onChange(next)
                  }}
                />
                {isEditing && builderPanel}
              </div>
            )
          })}
        </div>
      )}
      {/* New section panel at bottom */}
      {build && !build.editId && builderPanel}
      {!build && (
        <button type="button" className="sb__addBtn" onClick={startNew}>
          + Add Branding Section
        </button>
      )}
    </div>
  )
}

// ── UI Builder ────────────────────────────────────────────────────────────────

function UiCard({
  draft, index, total, isEditing,
  onEdit, onDelete, onMoveUp, onMoveDown,
}: {
  draft: UiSectionDraft; index: number; total: number; isEditing: boolean
  onEdit: () => void; onDelete: () => void; onMoveUp: () => void; onMoveDown: () => void
}) {
  return (
    <div className={`sb__card${isEditing ? " sb__card--editing" : ""}`}>
      <div className="sb__cardMove">
        <button type="button" onClick={onMoveUp} disabled={index === 0}>↑</button>
        <button type="button" onClick={onMoveDown} disabled={index === total - 1}>↓</button>
      </div>
      <div className="sb__cardMeta">
        <span className="sb__cardPath">UI / {draft.type.charAt(0).toUpperCase() + draft.type.slice(1)}</span>
        <span className="sb__cardHeadline">{draft.headline || draft.type}</span>
        <span className="sb__cardCount">
          {(draft.existingImages.length + draft.newFiles.length)} image{(draft.existingImages.length + draft.newFiles.length) !== 1 ? "s" : ""}
          {draft.mobileUrl && " · mobile video"}
          {draft.desktopUrl && " · desktop video"}
        </span>
      </div>
      <div className="sb__cardActions">
        <button type="button" onClick={onEdit} className={`sb__cardEdit${isEditing ? " sb__cardEdit--active" : ""}`}>
          {isEditing ? "▲ Collapse" : "Edit"}
        </button>
        <button type="button" onClick={onDelete} className="sb__cardDelete">Delete</button>
      </div>
    </div>
  )
}

function UIBuilder({
  uiDrafts, onChange, projectSlug,
}: {
  uiDrafts: UiSectionDraft[]
  onChange: (drafts: UiSectionDraft[]) => void
  projectSlug: string
}) {
  const [build, setBuild] = useState<UiBuildState | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function startNew(type: string) {
    setBuild({
      editId: null, type, headline: "",
      newFiles: [], existingImages: [],
      mobileUrl: "", desktopUrl: "", deviceType: type === "application" ? "application" : "website",
    })
  }

  function startEdit(draft: UiSectionDraft) {
    if (build?.editId === draft.id) { setBuild(null); return }
    setBuild({
      editId: draft.id, type: draft.type, headline: draft.headline,
      newFiles: draft.newFiles, existingImages: draft.existingImages,
      mobileUrl: draft.mobileUrl, desktopUrl: draft.desktopUrl, deviceType: draft.deviceType,
    })
  }

  function saveSection() {
    if (!build) return
    const draft: UiSectionDraft = {
      id: build.editId ?? crypto.randomUUID(),
      type: build.type,
      headline: build.headline || build.type.charAt(0).toUpperCase() + build.type.slice(1),
      newFiles: build.newFiles,
      existingImages: build.existingImages,
      mobileUrl: build.mobileUrl,
      desktopUrl: build.desktopUrl,
      deviceType: build.deviceType,
    }
    if (build.editId) {
      onChange(uiDrafts.map((d) => d.id === build.editId ? draft : d))
    } else {
      onChange([...uiDrafts, draft])
    }
    setBuild(null)
  }

  const buildPanel = build && build.type === "website" && (
    <div className="sb__panel">
      <div className="sb__crumb">
        <span className="sb__crumbSeg sb__crumbSeg--root">UI</span>
        <span className="sb__crumbPart"><span className="sb__crumbSep">/</span>
          <span className="sb__crumbSeg">Website</span>
        </span>
      </div>
      <div className="sb__form">
        <label className="sb__formLabel">
          Section Headline
          <input className="sb__formInput" value={build.headline} placeholder="Website"
            onChange={(e) => setBuild({ ...build, headline: e.target.value })} />
        </label>

        {/* Device type toggle */}
        <div className="sb__formLabel">
          Type
          <div className="apfa__toggleRow" style={{ marginTop: "0.35rem" }}>
            {(["website", "application"] as const).map((t) => (
              <button key={t} type="button"
                className={`apfa__toggleBtn${build.deviceType === t ? " apfa__toggleBtn--active" : ""}`}
                onClick={() => setBuild({ ...build, deviceType: t })}>
                {t === "website" ? "Website" : "Application"}
              </button>
            ))}
          </div>
        </div>

        {/* Preview images */}
        {(build.existingImages.length > 0 || build.newFiles.length > 0) && (
          <div className="sb__existingImgs">
            {build.existingImages.map((img) => (
              <div key={img} className="sb__existingImg">
                <button type="button" className="sb__removeImg"
                  onClick={() => setBuild({ ...build, existingImages: build.existingImages.filter((x) => x !== img) })}>✕</button>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt="" />
                <span>{img.split("/").pop()}</span>
              </div>
            ))}
            {build.newFiles.map((f, i) => (
              <div key={i} className="sb__existingImg">
                <button type="button" className="sb__removeImg"
                  onClick={() => setBuild({ ...build, newFiles: build.newFiles.filter((_, j) => j !== i) })}>✕</button>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={f.preview} alt={f.name} />
                <span>{f.name}</span>
              </div>
            ))}
          </div>
        )}

        <input ref={fileInputRef} type="file" accept="image/*,.svg,.webp,.avif" multiple style={{ display: "none" }}
          onChange={(e) => {
            const files = Array.from(e.target.files ?? []).map((f) => ({
              file: f, name: f.name, preview: URL.createObjectURL(f),
            }))
            setBuild({ ...build, newFiles: [...build.newFiles, ...files] })
            if (fileInputRef.current) fileInputRef.current.value = ""
          }} />
        <button type="button" className="apfa__addImg" onClick={() => fileInputRef.current?.click()}>
          + Upload Preview Image
        </button>

        <label className="sb__formLabel">
          Mobile video URL <span className="apfa__hint">— Firebase Storage URL</span>
          <input className="sb__formInput" type="url" value={build.mobileUrl}
            placeholder="https://firebasestorage.googleapis.com/..."
            onChange={(e) => setBuild({ ...build, mobileUrl: e.target.value })} />
        </label>

        <label className="sb__formLabel">
          Desktop video URL <span className="apfa__hint">— Firebase Storage URL</span>
          <input className="sb__formInput" type="url" value={build.desktopUrl}
            placeholder="https://firebasestorage.googleapis.com/..."
            onChange={(e) => setBuild({ ...build, desktopUrl: e.target.value })} />
        </label>

        <div className="sb__formFooter">
          <button type="button" className="sb__cancelNav" onClick={() => setBuild(null)}>Cancel</button>
          <button type="button" className="sb__saveSection" onClick={saveSection}>
            {build.editId ? "Update Section" : "Add Section"}
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="sb">
      {/* Existing UI section cards */}
      {uiDrafts.length > 0 && (
        <div className="sb__list">
          {uiDrafts.map((draft, i) => {
            const isEditing = build?.editId === draft.id
            return (
              <div key={draft.id} className="sb__entry">
                <UiCard
                  draft={draft} index={i} total={uiDrafts.length} isEditing={isEditing}
                  onEdit={() => startEdit(draft)}
                  onDelete={() => onChange(uiDrafts.filter((d) => d.id !== draft.id))}
                  onMoveUp={() => {
                    if (i === 0) return
                    const next = [...uiDrafts]; [next[i - 1], next[i]] = [next[i], next[i - 1]]; onChange(next)
                  }}
                  onMoveDown={() => {
                    if (i === uiDrafts.length - 1) return
                    const next = [...uiDrafts]; [next[i], next[i + 1]] = [next[i + 1], next[i]]; onChange(next)
                  }}
                />
                {isEditing && build?.type === "website" && buildPanel}
              </div>
            )
          })}
        </div>
      )}

      {/* New UI section panel */}
      {build && !build.editId && buildPanel}

      {/* Type grid — only when not building */}
      {!build && (
        <div className="uib__typeGrid">
          {UI_TYPES.map((t) => (
            <button key={t.id} type="button"
              className={`uib__typeBtn${t.implemented ? "" : " uib__typeBtn--soon"}`}
              onClick={() => t.implemented && startNew(t.id)}
              disabled={!t.implemented}>
              <span className="uib__typeIcon">{t.icon}</span>
              <span className="uib__typeLabel">{t.label}</span>
              {!t.implemented && <span className="uib__typeSoon">Soon</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────

const empty: Project = {
  slug: "", name: "", category: "branding", description: "",
  mission: "", vision: "", href: "", clientThumbnail: "",
  client: { firstName: "", lastName: "" },
  services: [], review: "", technologyUsed: [],
  thumbnails: [], heroSection: [], images: [], brandColors: [], sections: [],
}

type ActiveTab = "introducing" | "branding" | "ui"

export default function AddProjectPage() {
  const params = useSearchParams()
  const router = useRouter()
  const editSlug = params.get("slug")

  const [activeTab, setActiveTab] = useState<ActiveTab>("introducing")
  const [form, setForm] = useState<Project>(empty)
  const [sectionDrafts, setSectionDrafts] = useState<SectionDraft[]>([])
  const [uiDrafts, setUiDrafts] = useState<UiSectionDraft[]>([])
  const [clientThumbFile, setClientThumbFile] = useState<File | null>(null)
  const [clientThumbPreview, setClientThumbPreview] = useState<string>("")
  const [heroFiles, setHeroFiles] = useState<SectionFile[]>([])
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState<{ msg: string; ok: boolean } | null>(null)
  const clientThumbRef = useRef<HTMLInputElement>(null)
  const heroInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!editSlug) return
    getProjects().then((projects) => {
      const p = projects.find((pr) => pr.slug === editSlug)
      if (!p) return
      setForm(p)
      if (p.sections) {
        const brandDrafts = p.sections
          .filter((s) => s.path[0] === "Branding")
          .map((s) => ({
            id: s.id, path: s.path, headline: s.headline, body: s.body ?? "",
            sectionColors: s.colors ?? [],
            newFiles: [], existingImages: s.images,
          }))
        setSectionDrafts(brandDrafts)

        const uiLoaded = p.sections
          .filter((s) => s.path[0] === "UI")
          .map((s) => ({
            id: s.id, type: s.path[1]?.toLowerCase() ?? "website",
            headline: s.headline, newFiles: [], existingImages: s.images,
            mobileUrl: p.deviceVideos?.mobile ?? "",
            desktopUrl: p.deviceVideos?.desktop ?? "",
            deviceType: (p.deviceVideos?.type ?? "website") as "website" | "application",
          }))
        if (uiLoaded.length > 0) {
          setUiDrafts(uiLoaded)
        } else if (p.deviceVideos) {
          setUiDrafts([{
            id: crypto.randomUUID(),
            type: p.deviceVideos.type ?? "website",
            headline: p.deviceVideos.type === "application" ? "Application" : "Website",
            newFiles: [], existingImages: [],
            mobileUrl: p.deviceVideos.mobile ?? "",
            desktopUrl: p.deviceVideos.desktop ?? "",
            deviceType: (p.deviceVideos.type ?? "website") as "website" | "application",
          }])
        }
      } else if (p.deviceVideos) {
        setUiDrafts([{
          id: crypto.randomUUID(),
          type: p.deviceVideos.type ?? "website",
          headline: p.deviceVideos.type === "application" ? "Application" : "Website",
          newFiles: [], existingImages: [],
          mobileUrl: p.deviceVideos.mobile ?? "",
          desktopUrl: p.deviceVideos.desktop ?? "",
          deviceType: (p.deviceVideos.type ?? "website") as "website" | "application",
        }])
      }
    })
  }, [editSlug])

  const set = (field: keyof Project, value: unknown) =>
    setForm((f) => ({ ...f, [field]: value }))

  const setClient = (field: keyof Project["client"], value: string) =>
    setForm((f) => ({ ...f, client: { ...f.client, [field]: value } }))

  const initials = getInitials(form.client.firstName, form.client.lastName)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setStatus(null)
    try {
      const slug = form.slug

      // Branding sections
      const brandSections: ProjectSection[] = sectionDrafts.map((sd) => ({
        id: sd.id,
        path: sd.path,
        headline: sd.headline || sd.path[sd.path.length - 1] || "Untitled",
        ...(sd.body && { body: sd.body }),
        images: [...sd.existingImages, ...sd.newFiles.map((f) => `/my-work/${slug}/images/${f.name}`)],
        ...(sd.sectionColors.length > 0 && { colors: sd.sectionColors }),
      }))

      // UI sections
      const uiSections: ProjectSection[] = uiDrafts.map((ud) => ({
        id: ud.id,
        path: ["UI", ud.type.charAt(0).toUpperCase() + ud.type.slice(1)],
        headline: ud.headline || ud.type,
        images: [...ud.existingImages, ...ud.newFiles.map((f) => `/my-work/${slug}/images/${f.name}`)],
      }))

      // Brand colors from Color sections
      const colorSectionColors = sectionDrafts
        .filter((d) => isColorSection(d.path))
        .flatMap((d) => d.sectionColors)

      // Device videos from UI sections
      const websiteUi = uiDrafts.find((d) => d.type === "website" || d.type === "application")
      const deviceVideos = websiteUi
        ? { type: websiteUi.deviceType, mobile: websiteUi.mobileUrl || undefined, desktop: websiteUi.desktopUrl || undefined }
        : form.deviceVideos

      const heroImagePaths = heroFiles.map((f) => `/my-work/${slug}/images/${f.name}`)
      const allSectionImages = brandSections.flatMap((s) => s.images)
      const firstHero = heroImagePaths[0] ?? form.thumbnails?.[0] ?? allSectionImages[0] ?? ""

      const clientThumbPath = clientThumbFile
        ? `/my-work/${slug}/images/client-thumbnail.${clientThumbFile.name.split(".").pop()}`
        : form.clientThumbnail

      const project: Project = {
        ...form,
        href: form.href || `/my-work/${slug}`,
        clientThumbnail: clientThumbPath,
        brandColors: colorSectionColors.length > 0 ? colorSectionColors : form.brandColors,
        sections: [...brandSections, ...uiSections],
        deviceVideos,
        thumbnails: heroImagePaths.length > 0 ? heroImagePaths : form.thumbnails,
        heroSection: heroImagePaths.length > 0 ? heroImagePaths : form.heroSection,
        images: [firstHero, ...allSectionImages].filter(Boolean),
      }

      const fd = new FormData()
      fd.append("project", JSON.stringify(project))
      for (const sd of sectionDrafts)
        for (const f of sd.newFiles)
          fd.append("images", new File([f.file], f.name, { type: f.file.type }))
      for (const ud of uiDrafts)
        for (const f of ud.newFiles)
          fd.append("images", new File([f.file], f.name, { type: f.file.type }))
      for (const f of heroFiles)
        fd.append("images", new File([f.file], f.name, { type: f.file.type }))
      if (clientThumbFile) fd.append("clientThumbnail", clientThumbFile)

      const res = await fetch("/api/push-project", { method: "POST", body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Push failed")

      setStatus({ msg: `Pushed to GitHub! Slug: ${slug}`, ok: true })
      setTimeout(() => router.push("/admin/projects"), 1800)
    } catch (err) {
      setStatus({ msg: err instanceof Error ? err.message : "Error", ok: false })
    } finally {
      setSaving(false)
    }
  }

  const tabContent = (tab: ActiveTab) => ({ display: activeTab === tab ? "flex" : "none", flexDirection: "column" as const, gap: "2rem" })

  return (
    <div className="apfa">
      <h1 className="apfa__title">{editSlug ? "Edit Project" : "Add Project"}</h1>

      {/* Tab nav */}
      <div className="apfa__tabs">
        {(["introducing", "branding", "ui"] as const).map((tab) => (
          <button key={tab} type="button"
            className={`apfa__tab${activeTab === tab ? " apfa__tab--active" : ""}`}
            onClick={() => setActiveTab(tab)}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="apfa__form">

        {/* ── Introducing ── */}
        <div style={tabContent("introducing")}>

          <fieldset className="apfa__group">
            <legend>Project Info</legend>
            <label>Project Name
              <input value={form.name} onChange={(e) => {
                set("name", e.target.value)
                if (!editSlug) set("slug", slugify(e.target.value))
              }} required />
            </label>
            <label>Slug
              <input value={form.slug} onChange={(e) => set("slug", e.target.value)} required />
            </label>
            <label>Category
              <select value={form.category} onChange={(e) => set("category", e.target.value as "branding" | "other")}>
                <option value="branding">Branding</option>
                <option value="other">Other</option>
              </select>
            </label>
            <label>Description <span className="apfa__hint">(60–500 chars)</span>
              <textarea value={form.description} minLength={60} maxLength={500} rows={4}
                onChange={(e) => set("description", e.target.value)} required />
            </label>
            <label>Page Link <span className="apfa__hint">(leave blank for /my-work/{"{slug}"})</span>
              <input value={form.href} placeholder={`/my-work/${form.slug || "slug"}`}
                onChange={(e) => set("href", e.target.value)} />
            </label>
          </fieldset>

          <fieldset className="apfa__group">
            <legend>Mission & Vision</legend>
            <label>Mission <span className="apfa__hint">(what the brand does and for whom)</span>
              <textarea value={form.mission} rows={3} onChange={(e) => set("mission", e.target.value)}
                placeholder="We help X achieve Y through Z..." />
            </label>
            <label>Vision <span className="apfa__hint">(where the brand is going)</span>
              <textarea value={form.vision} rows={3} onChange={(e) => set("vision", e.target.value)}
                placeholder="To become the leading..." />
            </label>
          </fieldset>

          <fieldset className="apfa__group">
            <legend>Client</legend>
            <div className="apfa__clientThumb">
              <div className="apfa__clientAvatar"
                style={{ backgroundImage: clientThumbPreview ? `url(${clientThumbPreview})` : "none" }}>
                {!clientThumbPreview && <span>{initials}</span>}
              </div>
              <div className="apfa__clientAvatarMeta">
                <p>Client logo or photo <span className="apfa__hint">(optional)</span></p>
                <button type="button" onClick={() => clientThumbRef.current?.click()} className="apfa__addImg">
                  {clientThumbFile ? "Change Image" : "Upload Image"}
                </button>
                <input ref={clientThumbRef} type="file" accept="image/*" style={{ display: "none" }}
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (!file) return
                    setClientThumbFile(file)
                    setClientThumbPreview(URL.createObjectURL(file))
                  }} />
              </div>
            </div>
            <label>First Name <input value={form.client.firstName} onChange={(e) => setClient("firstName", e.target.value)} required /></label>
            <label>Last Name <input value={form.client.lastName} onChange={(e) => setClient("lastName", e.target.value)} required /></label>
          </fieldset>

          <fieldset className="apfa__group">
            <legend>Services</legend>
            <TagsInput tags={form.services}
              onAddTag={(t) => set("services", [...form.services, t])}
              onRemoveTag={(t) => set("services", form.services.filter((s) => s !== t))} />
          </fieldset>

          <fieldset className="apfa__group">
            <legend>Technology Used</legend>
            <TagsInput tags={form.technologyUsed}
              onAddTag={(t) => set("technologyUsed", [...form.technologyUsed, t])}
              onRemoveTag={(t) => set("technologyUsed", form.technologyUsed.filter((s) => s !== t))} />
          </fieldset>

          <fieldset className="apfa__group">
            <legend>Client Review</legend>
            <textarea value={form.review} onChange={(e) => set("review", e.target.value)} rows={4}
              placeholder="Client testimonial..." />
          </fieldset>

          <fieldset className="apfa__group">
            <legend>Hero / Thumbnail <span className="apfa__hint">— shown in portfolio grid and page hero</span></legend>
            {heroFiles.length > 0 && (
              <div className="apfa__assetGrid">
                {heroFiles.map((f, i) => (
                  <div key={i} className="apfa__assetCard apfa__assetCard--valid">
                    <button type="button" className="apfa__assetRemove"
                      onClick={() => setHeroFiles((prev) => prev.filter((_, j) => j !== i))}>✕</button>
                    <div className="apfa__assetPreview">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={f.preview} alt={f.name} />
                    </div>
                    <div className="apfa__assetInfo">
                      <span className="apfa__assetNameInput apfa__assetNameInput--readonly">{f.name}</span>
                      <span className="apfa__assetOk">✓ Ready</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {form.thumbnails && form.thumbnails.length > 0 && heroFiles.length === 0 && (
              <div className="apfa__existingSection">
                <p className="apfa__existingLabel">Current thumbnail</p>
                <div className="apfa__assetGrid">
                  {form.thumbnails.map((path) => (
                    <div key={path} className="apfa__assetCard apfa__assetCard--valid apfa__assetCard--existing">
                      <div className="apfa__assetPreview">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={path} alt="" />
                      </div>
                      <div className="apfa__assetInfo">
                        <span className="apfa__assetNameInput apfa__assetNameInput--readonly">{path.split("/").pop()}</span>
                        <span className="apfa__assetOk">✓ Saved</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <input ref={heroInputRef} type="file" accept="image/*,.svg,.avif,.webp" multiple
              style={{ display: "none" }}
              onChange={(e) => {
                const files = Array.from(e.target.files ?? []).map((f) => ({
                  file: f, name: f.name, preview: URL.createObjectURL(f),
                }))
                setHeroFiles((prev) => [...prev, ...files])
                if (heroInputRef.current) heroInputRef.current.value = ""
              }} />
            <button type="button" onClick={() => heroInputRef.current?.click()} className="apfa__addImg">
              + Upload Hero Image
            </button>
          </fieldset>
        </div>

        {/* ── Branding ── */}
        <div style={tabContent("branding")}>
          <fieldset className="apfa__group">
            <legend>Branding Sections</legend>
            <SectionBuilder
              drafts={sectionDrafts}
              projectSlug={form.slug}
              onChange={setSectionDrafts}
            />
          </fieldset>
        </div>

        {/* ── UI ── */}
        <div style={tabContent("ui")}>
          <fieldset className="apfa__group">
            <legend>UI Sections</legend>
            <UIBuilder
              uiDrafts={uiDrafts}
              onChange={setUiDrafts}
              projectSlug={form.slug}
            />
          </fieldset>
        </div>

        {/* ── Always visible ── */}
        {status && (
          <p className={`apfa__status${status.ok ? "" : " apfa__status--error"}`}>{status.msg}</p>
        )}
        <div className="apfa__footer">
          <button type="button" onClick={() => router.push("/admin/projects")} className="apfa__cancel">Cancel</button>
          <button type="submit" disabled={saving} className="apfa__save">
            {saving ? "Pushing to GitHub..." : "Save & Push"}
          </button>
        </div>
      </form>
    </div>
  )
}
