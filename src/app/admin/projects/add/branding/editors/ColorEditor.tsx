"use client"
import type { BrandColor } from "@/types/project"
import { hexToRgb } from "../../useProjectForm"

interface Props {
  colors: BrandColor[]
  pickerHex: string
  onChange: (colors: BrandColor[]) => void
  onPickerChange: (hex: string) => void
}

function normalizeHex(raw: string): string {
  return raw.startsWith("#") ? raw : "#" + raw
}

function isValidHex(hex: string): boolean {
  return /^#[0-9A-Fa-f]{6}$/.test(hex)
}

export function ColorEditor({ colors, pickerHex, onChange, onPickerChange }: Props) {
  function updateParent(i: number, patch: Partial<BrandColor>) {
    onChange(colors.map((c, ci) => ci === i ? { ...c, ...patch } : c))
  }

  function updateChild(i: number, j: number, patch: Partial<BrandColor>) {
    onChange(colors.map((c, ci) =>
      ci === i
        ? { ...c, children: c.children?.map((ch, cj) => cj === j ? { ...ch, ...patch } : ch) }
        : c
    ))
  }

  function addChild(i: number) {
    const parent = colors[i]
    onChange(colors.map((c, ci) =>
      ci === i
        ? { ...c, children: [...(c.children ?? []), { hex: parent.hex, rgb: parent.rgb, order: c.children?.length ?? 0, name: "" }] }
        : c
    ))
  }

  function removeChild(i: number, j: number) {
    onChange(colors.map((c, ci) =>
      ci === i ? { ...c, children: c.children?.filter((_, cj) => cj !== j) } : c
    ))
  }

  function addColor() {
    onChange([...colors, { hex: pickerHex, rgb: hexToRgb(pickerHex), order: colors.length, name: "", usage: "" }])
  }

  return (
    <div className="sb__colorEditor">
      <p className="sb__colorEditorLabel">Color Palette</p>

      {colors.length > 0 && (
        <div className="sb__colorRows">
          {colors.map((color, i) => (
            <div key={i} className="sb__colorRowWrap">

              {/* Parent row */}
              <div className="sb__colorRow">
                <label className="apfa__colorDotWrap" title="Click to change">
                  <div className="apfa__colorDot" style={{ background: color.hex }} />
                  <input type="color" value={isValidHex(color.hex) ? color.hex : "#000000"}
                    className="apfa__colorInput"
                    onChange={(e) => {
                      const hex = e.target.value
                      updateParent(i, { hex, rgb: hexToRgb(hex) })
                    }} />
                </label>
                <input className="sb__colorName" value={color.name ?? ""}
                  placeholder="e.g. Primary Red"
                  onChange={(e) => updateParent(i, { name: e.target.value })} />
                <input className="sb__colorHexInput" value={color.hex} maxLength={7} spellCheck={false}
                  onChange={(e) => {
                    const hex = normalizeHex(e.target.value)
                    updateParent(i, { hex, rgb: isValidHex(hex) ? hexToRgb(hex) : color.rgb })
                  }} />
                <button type="button" className="sb__colorRemove"
                  onClick={() => onChange(colors.filter((_, ci) => ci !== i))}>✕</button>
                <button type="button" className="sb__colorAddChild" onClick={() => addChild(i)}>
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
                        <input type="color" value={isValidHex(child.hex) ? child.hex : "#000000"}
                          className="apfa__colorInput"
                          onChange={(e) => {
                            const hex = e.target.value
                            updateChild(i, j, { hex, rgb: hexToRgb(hex) })
                          }} />
                      </label>
                      <input className="sb__colorName" value={child.name ?? ""}
                        placeholder={`${color.name || "Color"}-dark-tone`}
                        onChange={(e) => updateChild(i, j, { name: e.target.value })} />
                      <input className="sb__colorHexInput" value={child.hex} maxLength={7} spellCheck={false}
                        onChange={(e) => {
                          const hex = normalizeHex(e.target.value)
                          updateChild(i, j, { hex, rgb: isValidHex(hex) ? hexToRgb(hex) : child.rgb })
                        }} />
                      <button type="button" className="sb__colorRemove"
                        onClick={() => removeChild(i, j)}>✕</button>
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
          <div className="apfa__colorDot" style={{ background: pickerHex }} />
          <input type="color" value={pickerHex} className="apfa__colorInput"
            onChange={(e) => onPickerChange(e.target.value)} />
        </label>
        <button type="button" className="apfa__addImg" onClick={addColor}>+ Add Color</button>
      </div>
    </div>
  )
}
