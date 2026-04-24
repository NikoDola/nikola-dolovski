"use client"
import type { SectionDraft } from "../types"

interface Props {
  draft: SectionDraft
  index: number
  total: number
  isEditing: boolean
  onEdit: () => void
  onDelete: () => void
  onMoveUp: () => void
  onMoveDown: () => void
}

export function SectionCard({ draft, index, total, isEditing, onEdit, onDelete, onMoveUp, onMoveDown }: Props) {
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
          {colorCount > 0
            ? `${colorCount} color${colorCount !== 1 ? "s" : ""}`
            : `${imgCount} image${imgCount !== 1 ? "s" : ""}`}
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
