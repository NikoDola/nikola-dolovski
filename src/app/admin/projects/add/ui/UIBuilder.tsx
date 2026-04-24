"use client"
import { useState } from "react"
import type { UiSectionDraft, UiBuildState } from "../types"
import { UiCard } from "./UiCard"
import { WebsiteEditor } from "./editors/WebsiteEditor"
import { UI_TYPES } from "../tree"

interface Props {
  uiDrafts: UiSectionDraft[]
  onChange: (drafts: UiSectionDraft[]) => void
  projectSlug: string
}

export function UIBuilder({ uiDrafts, onChange }: Props) {
  const [build, setBuild] = useState<UiBuildState | null>(null)

  function startNew(type: string) {
    setBuild({
      editId: null, type, headline: "",
      newFiles: [], existingImages: [],
      mobileUrl: "", desktopUrl: "",
      deviceType: type === "application" ? "application" : "website",
    })
  }

  function startEdit(draft: UiSectionDraft) {
    if (build?.editId === draft.id) { setBuild(null); return }
    setBuild({
      editId: draft.id, type: draft.type, headline: draft.headline,
      newFiles: draft.newFiles, existingImages: draft.existingImages,
      mobileUrl: draft.mobileUrl, desktopUrl: draft.desktopUrl,
      deviceType: draft.deviceType,
    })
  }

  function saveSection() {
    if (!build) return
    const draft: UiSectionDraft = {
      id: build.editId ?? crypto.randomUUID(),
      type: build.type,
      headline: build.headline || build.type.charAt(0).toUpperCase() + build.type.slice(1),
      newFiles: build.newFiles, existingImages: build.existingImages,
      mobileUrl: build.mobileUrl, desktopUrl: build.desktopUrl,
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
        <span className="sb__crumbPart">
          <span className="sb__crumbSep">/</span>
          <span className="sb__crumbSeg">Website</span>
        </span>
      </div>
      <WebsiteEditor build={build} onChange={(patch) => setBuild({ ...build, ...patch })} />
      <div className="sb__formFooter">
        <button type="button" className="sb__cancelNav" onClick={() => setBuild(null)}>Cancel</button>
        <button type="button" className="sb__saveSection" onClick={saveSection}>
          {build.editId ? "Update Section" : "Add Section"}
        </button>
      </div>
    </div>
  )

  return (
    <div className="sb">
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
      {build && !build.editId && buildPanel}
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
