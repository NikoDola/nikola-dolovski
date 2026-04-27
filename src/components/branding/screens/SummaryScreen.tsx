"use client"
import { useState } from "react"
import { T } from "../tokens"
import SummaryRow from "../shared/SummaryRow"
import BackButton from "../shared/BackButton"
import Button from "../shared/Button"
import { BRAND_SERVICES, VARIATION_LABELS, COLOR_FAMILIES, FONT_CATEGORIES } from "../data"
import { calcTotal, calcDeposit, calcBrandGuidelinesPrice } from "../utils"
import type { Order } from "../types"

function InfoTip({ text }: { text: string }) {
  const [show, setShow] = useState(false)
  return (
    <div style={{ position: "relative", display: "inline-flex" }} onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      <div style={{ width: "16px", height: "16px", borderRadius: "50%", border: `1.5px solid ${T.color.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "help", color: T.color.textMuted, flexShrink: 0 }}>
        <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><circle cx="4" cy="4" r="3.5" stroke="currentColor" strokeWidth="1"/><path d="M4 3.5v2M4 2.5v.3" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/></svg>
      </div>
      {show && (
        <div style={{ position: "absolute", bottom: "calc(100% + 6px)", left: "50%", transform: "translateX(-50%)", width: "220px", background: T.color.textPrimary, color: "#fff", fontSize: T.fontSize.xs, lineHeight: T.lineHeight.normal, borderRadius: T.radius.md, padding: `${T.space["3"]} ${T.space["4"]}`, zIndex: 100, pointerEvents: "none", boxShadow: T.shadow.lg }}>
          {text}
          <div style={{ position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)", width: 0, height: 0, borderLeft: "5px solid transparent", borderRight: "5px solid transparent", borderTop: `5px solid ${T.color.textPrimary}` }} />
        </div>
      )}
    </div>
  )
}

function BrandGuidelinesAddon({ numVariations, selected, onToggle }: { numVariations: number; selected: boolean; onToggle: () => void }) {
  const price = calcBrandGuidelinesPrice(numVariations)
  const perVarCount = BRAND_SERVICES.filter(s => s.perVariation).length
  const totalHrs = perVarCount * numVariations + (BRAND_SERVICES.length - perVarCount)
  return (
    <div style={{ marginBottom: T.space["6"] }}>
      <div style={{ fontSize: T.fontSize.sm, fontWeight: T.fontWeight.semibold, color: T.color.textPrimary, marginBottom: T.space["4"] }}>Enhance your package</div>
      <div onClick={onToggle} style={{ border: `2px solid ${selected ? T.color.accent : T.color.border}`, borderRadius: T.radius.xl, background: selected ? T.color.accentLight : T.color.surface, cursor: "pointer", transition: "all 180ms ease", overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: `${T.space["5"]} ${T.space["6"]}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: T.space["4"] }}>
            <div style={{ width: "42px", height: "42px", borderRadius: T.radius.md, background: selected ? T.color.accent : T.color.surfaceAlt, border: `1px solid ${selected ? T.color.accent : T.color.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 180ms ease" }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="2" y="3" width="16" height="14" rx="2" stroke={selected ? "#fff" : T.color.textMuted} strokeWidth="1.5"/><path d="M5 7h10M5 10h7M5 13h5" stroke={selected ? "#fff" : T.color.textMuted} strokeWidth="1.5" strokeLinecap="round"/></svg>
            </div>
            <div>
              <div style={{ fontSize: T.fontSize.base, fontWeight: T.fontWeight.semibold, color: selected ? T.color.accent : T.color.textPrimary }}>Mini Brand Guidelines</div>
              <div style={{ fontSize: T.fontSize.sm, color: T.color.textSecondary, marginTop: "2px" }}>Complete visual identity guide · {BRAND_SERVICES.length} deliverables · {numVariations} logo variation{numVariations > 1 ? "s" : ""}</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: T.space["4"] }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: T.fontSize.xl, fontWeight: T.fontWeight.bold, color: selected ? T.color.accent : T.color.textPrimary }}>+${price}</div>
              <div style={{ fontSize: T.fontSize.xs, color: T.color.textMuted }}>${25}/hr · {totalHrs} hrs total</div>
            </div>
            <div style={{ width: "24px", height: "24px", borderRadius: T.radius.full, border: `2px solid ${selected ? T.color.accent : T.color.border}`, background: selected ? T.color.accent : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 180ms ease" }}>
              {selected && <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M1.5 5.5l2.5 2.5 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
            </div>
          </div>
        </div>
        {selected && (
          <div style={{ borderTop: `1px solid ${T.color.accentMuted}`, padding: `${T.space["4"]} ${T.space["6"]} ${T.space["5"]}` }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: `${T.space["3"]} ${T.space["6"]}` }}>
              {BRAND_SERVICES.map(svc => (
                <div key={svc.id} style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: T.space["3"], padding: `${T.space["2"]} 0`, borderBottom: `1px solid ${T.color.accentMuted}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: T.space["2"], flex: 1 }}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}><path d="M2 6l3 3 5-5" stroke={T.color.accent} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    <span style={{ fontSize: T.fontSize.sm, color: T.color.textPrimary, lineHeight: T.lineHeight.snug }}>{svc.label}</span>
                    <InfoTip text={svc.tooltip} />
                  </div>
                  <span style={{ fontSize: T.fontSize.sm, fontWeight: T.fontWeight.semibold, color: T.color.textSecondary, flexShrink: 0 }}>${svc.perVariation ? 25 * numVariations : 25}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: T.space["4"], display: "flex", justifyContent: "flex-end", fontSize: T.fontSize.sm, color: T.color.textSecondary }}>
              Subtotal: <strong style={{ color: T.color.accent, marginLeft: T.space["2"] }}>${price}</strong>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function PaymentOption({ label, sublabel, amount, recommended, selected, onClick }: { label: string; sublabel: string; amount: number; recommended?: boolean; selected: boolean; onClick: () => void }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div onClick={onClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{ flex: 1, padding: T.space["5"], borderRadius: T.radius.lg, cursor: "pointer", border: `2px solid ${selected ? T.color.accent : hovered ? T.color.accentMuted : T.color.border}`, background: selected ? T.color.accentLight : T.color.surface, transition: "all 180ms ease", position: "relative" }}>
      {recommended && <div style={{ position: "absolute", top: "-11px", left: T.space["5"], background: T.color.accent, color: "#fff", fontSize: T.fontSize.xs, fontWeight: T.fontWeight.bold, borderRadius: T.radius.full, padding: `2px ${T.space["3"]}`, letterSpacing: T.letterSpacing.wide }}>RECOMMENDED</div>}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: T.space["3"] }}>
        <div>
          <div style={{ fontSize: T.fontSize.base, fontWeight: T.fontWeight.semibold, color: selected ? T.color.accent : T.color.textPrimary, marginBottom: T.space["1"] }}>{label}</div>
          <div style={{ fontSize: T.fontSize.sm, color: T.color.textSecondary, lineHeight: T.lineHeight.normal }}>{sublabel}</div>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{ fontSize: T.fontSize.xl, fontWeight: T.fontWeight.bold, color: selected ? T.color.accent : T.color.textPrimary }}>${amount}</div>
        </div>
      </div>
      <div style={{ marginTop: T.space["3"], width: "22px", height: "22px", borderRadius: T.radius.full, border: `2px solid ${selected ? T.color.accent : T.color.border}`, background: selected ? T.color.accent : "transparent", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 180ms ease" }}>
        {selected && <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
      </div>
    </div>
  )
}

export default function SummaryScreen({ order, onBack }: { order: Order; onBack: () => void }) {
  const [submitted, setSubmitted]     = useState(false)
  const [payOption, setPayOption]     = useState<"deposit"|"full">("deposit")
  const [addBrandGuide, setBrandGuide] = useState(false)

  const numVariations   = order.variations?.length || 1
  const brandGuidePrice = addBrandGuide ? calcBrandGuidelinesPrice(numVariations) : 0
  const total           = calcTotal(order) + brandGuidePrice
  const deposit         = calcDeposit(total)
  const dueNow          = payOption === "deposit" ? deposit : total
  const dueLater        = payOption === "deposit" ? total - deposit : 0

  if (submitted) {
    return (
      <div className="screen-enter" style={{ textAlign: "center", padding: `${T.space["16"]} 0` }}>
        <div style={{ width: "72px", height: "72px", borderRadius: T.radius.full, background: T.color.accentLight, border: `2px solid ${T.color.accentMuted}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto", marginBottom: T.space["6"] }}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><path d="M6 16l8 8 12-12" stroke={T.color.accent} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <h2 style={{ fontSize: T.fontSize.xl, fontWeight: T.fontWeight.bold, color: T.color.textPrimary, marginBottom: T.space["3"] }}>Order received!</h2>
        <p style={{ fontSize: T.fontSize.base, color: T.color.textSecondary, lineHeight: T.lineHeight.normal, maxWidth: "380px", margin: "0 auto" }}>
          We'll be in touch within 24 hours to confirm your project details and get started.
        </p>
      </div>
    )
  }

  const allFonts = Object.values(FONT_CATEGORIES).flatMap(c => c.fonts)
  const rows: [string, string][] = [
    ["Service", order.serviceType === "design" ? "Logo Design" : "Logo Redesign"],
    ...(order.description ? [["About the company", order.description] as [string,string]] : []),
    ...(order.tagline ? [["Tagline", `"${order.tagline}"`] as [string,string]] : []),
    ...(order.variations?.length ? [["Variations", order.variations.map(v => VARIATION_LABELS[v]).join(", ")] as [string,string]] : []),
    ...(order.typographyType ? [["Typography", order.typographyType === "custom" ? `Custom${(order.customPrice ?? 0) > 0 ? ` (+$${order.customPrice})` : " (included)"}` : "Free Font"] as [string,string]] : []),
    ...(order.selectedFonts?.length ? [["Font inspirations", order.selectedFonts.map(id => allFonts.find(f => f.id === id)?.name).filter(Boolean).join(", ")] as [string,string]] : []),
    ...((order.variations?.length ?? 0) > 1 ? [["Variation extras", `${(order.variations?.length ?? 0) - 1} × $25`] as [string,string]] : []),
    ...(order.colorFamilies?.length ? [["Color palettes", order.colorFamilies.map(id => COLOR_FAMILIES.find(f => f.id === id)?.label).join(", ")] as [string,string]] : []),
    ...(order.customColors?.length ? [["Custom colors", order.customColors.join("  ")] as [string,string]] : []),
    ...(order.useSameColors ? [["Logo colors", "Using colors from uploaded logo"] as [string,string]] : []),
    ...(order.inspirationFile ? [["Inspiration file", order.inspirationFile.name] as [string,string]] : []),
    ["Delivery", "SVG + PNG + PDF"],
    ["Revisions", "2 rounds included"],
  ]

  return (
    <div className="screen-enter">
      <BackButton onClick={onBack} />
      <div style={{ marginBottom: T.space["8"] }}>
        <h1 style={{ fontSize: T.fontSize["2xl"], fontWeight: T.fontWeight.bold, color: T.color.textPrimary, letterSpacing: T.letterSpacing.tight, lineHeight: T.lineHeight.tight, marginBottom: T.space["3"] }}>Review your order</h1>
        <p style={{ fontSize: T.fontSize.base, color: T.color.textSecondary }}>Everything looks good? Choose how you'd like to pay.</p>
      </div>

      <div style={{ background: T.color.surface, border: `1px solid ${T.color.border}`, borderRadius: T.radius.xl, padding: T.space["8"], marginBottom: T.space["6"] }}>
        {rows.map(([label, value]) => <SummaryRow key={label} label={label} value={value} />)}
        <div style={{ marginTop: T.space["2"] }}><SummaryRow label="Total" value={`$${total}`} highlight /></div>
      </div>

      <BrandGuidelinesAddon numVariations={numVariations} selected={addBrandGuide} onToggle={() => setBrandGuide(v => !v)} />

      <div style={{ marginBottom: T.space["6"] }}>
        <div style={{ fontSize: T.fontSize.sm, fontWeight: T.fontWeight.semibold, color: T.color.textPrimary, marginBottom: T.space["5"] }}>How would you like to pay?</div>
        <div style={{ display: "flex", gap: T.space["4"] }}>
          <PaymentOption label="35% Deposit" sublabel={`Pay now to get started. Remaining $${dueLater > 0 ? dueLater : total - deposit} due on delivery.`} amount={deposit} recommended selected={payOption === "deposit"} onClick={() => setPayOption("deposit")} />
          <PaymentOption label="Full Payment" sublabel="Pay the complete amount upfront. No balance due on delivery." amount={total} selected={payOption === "full"} onClick={() => setPayOption("full")} />
        </div>
      </div>

      <div style={{ background: T.color.accentLight, border: `1px solid ${T.color.accentMuted}`, borderRadius: T.radius.lg, padding: T.space["5"], marginBottom: T.space["8"], display: "flex", gap: T.space["3"] }}>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0, marginTop: "1px" }}><circle cx="9" cy="9" r="8" stroke={T.color.accent} strokeWidth="1.5"/><path d="M9 8v5M9 6v.5" stroke={T.color.accent} strokeWidth="1.8" strokeLinecap="round"/></svg>
        <p style={{ fontSize: T.fontSize.sm, color: T.color.textSecondary, lineHeight: T.lineHeight.normal }}>We accept all major cards and bank transfers. Work begins once payment is confirmed.</p>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button onClick={() => setSubmitted(true)} size="lg"
          icon={<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}>
          Pay ${dueNow} Now
        </Button>
      </div>
    </div>
  )
}
