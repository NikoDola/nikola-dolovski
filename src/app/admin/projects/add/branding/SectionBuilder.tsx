"use client"
import { useState } from "react"
import type { SectionDraft, BuildState } from "../types"
import { SectionCard } from "./SectionCard"
import { ColorEditor } from "./editors/ColorEditor"
import { ImageEditor } from "./editors/ImageEditor"
import { nodeChoices, isColorSection, makeColorHeadline, getTreeNode } from "../tree"

interface Props {
  drafts: SectionDraft[]
  projectSlug: string
  onChange: (drafts: SectionDraft[]) => void
}

export function SectionBuilder({ drafts, onChange }: Props) {
  const [build, setBuild] = useState<BuildState | null>(null)

  function startNew() {
    const lastPath = drafts.length > 0 ? drafts[drafts.length - 1].path.slice(1) : []
    setBuild({
      editId: null,
      path: lastPath.length > 0 ? lastPath.slice(0, -1) : [],
      headline: "", body: "", sectionColors: [],
      colorPickerHex: "#88D1D4",
      newFiles: [], existingImages: [],
      mode: "navigate",
    })
  }

  function startEdit(draft: SectionDraft) {
    if (build?.editId === draft.id) { setBuild(null); return }
    setBuild({
      editId: draft.id,
      path: draft.path.slice(1),
      headline: draft.headline, body: draft.body,
      sectionColors: draft.sectionColors,
      colorPickerHex: "#88D1D4",
      newFiles: draft.newFiles, existingImages: draft.existingImages,
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
          onClick={() => setBuild({ ...build, path: [], mode: "navigate" })}>
          Branding
        </button>
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
              onClick={() => setBuild({
                ...build,
                headline: build.headline || makeColorHeadline(build.path) || build.path[build.path.length - 1] || "",
                mode: "form",
              })}>
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

          {colorSection ? (
            <ColorEditor
              colors={build.sectionColors}
              pickerHex={build.colorPickerHex}
              onChange={(sectionColors) => setBuild({ ...build, sectionColors })}
              onPickerChange={(colorPickerHex) => setBuild({ ...build, colorPickerHex })}
            />
          ) : (
            <>
              <ImageEditor
                existingImages={build.existingImages}
                newFiles={build.newFiles}
                onChange={(existingImages, newFiles) => setBuild({ ...build, existingImages, newFiles })}
              />
              <button type="button" className="sb__changePathBtn"
                onClick={() => setBuild({ ...build, mode: "navigate" })}>
                Change Path
              </button>
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
      {build && !build.editId && builderPanel}
      {!build && (
        <button type="button" className="sb__addBtn" onClick={startNew}>
          + Add Branding Section
        </button>
      )}
    </div>
  )
}
