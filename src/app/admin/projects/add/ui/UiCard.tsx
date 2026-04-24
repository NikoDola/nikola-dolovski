"use client"
import type { UiSectionDraft } from "../types"

interface Props {
  draft: UiSectionDraft
  index: number
  total: number
  isEditing: boolean
  onEdit: () => void
  onDelete: () => void
  onMoveUp: () => void
  onMoveDown: () => void
}

export function UiCard({ draft, index, total, isEditing, onEdit, onDelete, onMoveUp, onMoveDown }: Props) {
  const imgCount = draft.existingImages.length + draft.newFiles.length

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
          {imgCount} image{imgCount !== 1 ? "s" : ""}
          {draft.mobileUrl && " · mobile video"}
          {draft.desktopUrl && " · desktop video"}
        </span>
      </div>
      <div className="sb__cardActions">
        <button type="button" onClick={onEdit}
          className={`sb__cardEdit${isEditing ? " sb__cardEdit--active" : ""}`}>
          {isEditing ? "▲ Collapse" : "Edit"}
        </button>
        <button type="button" onClick={onDelete} className="sb__cardDelete">Delete</button>
      </div>
    </div>
  )
}
