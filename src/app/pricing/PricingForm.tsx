"use client"
import { useState } from "react"
import { LABEL_MAP } from "@/lib/serviceTree"
import type { PricingData } from "@/app/api/pricing/route"

interface Props {
  pricing: PricingData
}

// ── Tree building ─────────────────────────────────────────────────────────────

interface FormTreeNode {
  label: string
  id: string
  hours: number
  children: Record<string, FormTreeNode>
}

function buildFormTree(
  items: Record<string, number>,
  filterPrefix?: string
): Record<string, FormTreeNode> {
  const root: Record<string, FormTreeNode> = {}
  const entries = Object.entries(items)
    .filter(([id, h]) => h > 0 && (!filterPrefix || id.startsWith(filterPrefix)))
    .map(([id, h]) => ({ id, h, parts: id.split("/") }))

  for (const { id, h, parts } of entries) {
    const label = LABEL_MAP[id] ?? parts[parts.length - 1]
    let cur = root
    for (let i = 0; i < parts.length; i++) {
      const seg = parts[i]
      const segId = parts.slice(0, i + 1).join("/")
      if (!cur[seg]) {
        cur[seg] = {
          label: LABEL_MAP[segId] ?? seg,
          id: segId,
          hours: i === parts.length - 1 ? h : 0,
          children: {},
        }
      }
      if (i === parts.length - 1) {
        cur[seg].hours = h
        cur[seg].label = label
      }
      cur = cur[seg].children
    }
  }
  return root
}

// ── Tree renderer ─────────────────────────────────────────────────────────────

function FormTreeNodes({
  nodes, depth, hourlyRate, selected, onToggle,
}: {
  nodes: Record<string, FormTreeNode>
  depth: number
  hourlyRate: number
  selected: Set<string>
  onToggle: (id: string) => void
}) {
  return (
    <>
      {Object.values(nodes).map((node) => (
        <FormTreeNode key={node.id} node={node} depth={depth}
          hourlyRate={hourlyRate} selected={selected} onToggle={onToggle} />
      ))}
    </>
  )
}

function FormTreeNode({
  node, depth, hourlyRate, selected, onToggle,
}: {
  node: FormTreeNode
  depth: number
  hourlyRate: number
  selected: Set<string>
  onToggle: (id: string) => void
}) {
  const [open, setOpen] = useState(false)
  const isLeaf = Object.keys(node.children).length === 0
  const indent = `${0.9 + depth * 1.1}rem`

  if (isLeaf) {
    const checked = selected.has(node.id)
    const price = node.hours * hourlyRate
    return (
      <label className={`prc__item${checked ? " prc__item--checked" : ""}`}
        style={{ paddingLeft: indent }}>
        <input type="checkbox" className="prc__itemCheck"
          checked={checked} onChange={() => onToggle(node.id)} />
        <span className="prc__itemName">{node.label}</span>
        {price > 0 && <span className="prc__itemPrice">${price.toLocaleString()}</span>}
      </label>
    )
  }

  return (
    <>
      <button type="button"
        className={`prc__treeBranch${open ? " prc__treeBranch--open" : ""}`}
        style={{ paddingLeft: indent }}
        onClick={() => setOpen((o) => !o)}>
        <span className="prc__treeArrow">{open ? "▾" : "▸"}</span>
        <span className="prc__treeBranchName">{node.label}</span>
      </button>
      {open && (
        <FormTreeNodes nodes={node.children} depth={depth + 1}
          hourlyRate={hourlyRate} selected={selected} onToggle={onToggle} />
      )}
    </>
  )
}

// ── Main form ─────────────────────────────────────────────────────────────────

export function PricingForm({ pricing }: Props) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")

  // Logo
  const [logoActive, setLogoActive] = useState(false)
  const [logoVariationOrder, setLogoVariationOrder] = useState<string[]>([])

  // Non-logo selected leaf ids
  const [otherSelected, setOtherSelected] = useState<Set<string>>(new Set())

  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

  const logoBasePrice = pricing.logoBaseHours * pricing.hourlyRate

  // Logo variants: direct children of branding/logo (one level deep)
  const logoVariants = Object.entries(pricing.items)
    .filter(([id, h]) => {
      if (h <= 0) return false
      if (!id.startsWith("branding/logo/")) return false
      const rest = id.slice("branding/logo/".length)
      return !rest.includes("/")
    })
    .map(([id, h]) => ({ id, label: LABEL_MAP[id] ?? id.split("/").pop() ?? id, hours: h }))

  // Non-logo tree: all items except branding/logo/*
  const otherItems = Object.fromEntries(
    Object.entries(pricing.items).filter(([id, h]) => h > 0 && !id.startsWith("branding/logo/"))
  )
  const otherTree = buildFormTree(otherItems)

  // ── Logo handlers ──

  function toggleLogoVariation(id: string) {
    setLogoVariationOrder((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  function logoVariantDisplay(id: string, h: number): { text: string; cls: string } {
    const idx = logoVariationOrder.indexOf(id)
    if (idx === -1) {
      if (logoVariationOrder.length === 0) return { text: "—", cls: "none" }
      const p = h * pricing.hourlyRate
      return { text: p > 0 ? `+$${p.toLocaleString()}` : "—", cls: "price" }
    }
    if (idx === 0) return { text: "Included", cls: "free" }
    const p = h * pricing.hourlyRate
    return { text: p > 0 ? `+$${p.toLocaleString()}` : "Included", cls: p > 0 ? "price" : "free" }
  }

  // ── Other handlers ──

  function toggleOtherLeaf(id: string) {
    setOtherSelected((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  // ── Total ──

  function calcTotal(): number {
    let total = 0
    if (logoActive) {
      total += pricing.logoBaseHours * pricing.hourlyRate
      for (const id of logoVariationOrder.slice(1)) {
        total += (pricing.items[id] ?? 0) * pricing.hourlyRate
      }
    }
    for (const id of otherSelected) {
      total += (pricing.items[id] ?? 0) * pricing.hourlyRate
    }
    return total
  }

  const hasSelection = logoActive || otherSelected.size > 0
  const total = calcTotal()

  // ── Submit ──

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!hasSelection) { setError("Please select at least one service."); return }
    setError("")
    setSubmitting(true)

    const selections: { categoryId: string; categoryLabel: string; itemIds: string[]; itemLabels: string[] }[] = []

    if (logoActive) {
      selections.push({
        categoryId: "logo",
        categoryLabel: "Logo Design",
        itemIds: logoVariationOrder,
        itemLabels: logoVariationOrder.map((id, i) => {
          const label = LABEL_MAP[id] ?? id
          return i === 0 ? `${label} (primary — included)` : `${label} (variation)`
        }),
      })
    }

    if (otherSelected.size > 0) {
      const ids = Array.from(otherSelected)
      selections.push({
        categoryId: "other",
        categoryLabel: "Additional Services",
        itemIds: ids,
        itemLabels: ids.map((id) => {
          const parts = id.split("/").map((p) => LABEL_MAP[id.split("/").slice(0, id.split("/").indexOf(p) + 1).join("/")] ?? p)
          return parts.join(" / ")
        }),
      })
    }

    try {
      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone: phone || undefined, selections, total }),
      })
      if (res.ok) setSubmitted(true)
      else setError("Something went wrong. Please try again.")
    } catch {
      setError("Network error. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  // ── Render ──

  if (submitted) {
    return (
      <div className="prc__body">
        <div className="prc__success">
          <h2 className="prc__successTitle">Request Sent</h2>
          <p className="prc__successText">
            Thanks {name}, I&apos;ll get back to you at {email} as soon as possible.
          </p>
        </div>
      </div>
    )
  }

  const hasAnyPriced = logoVariants.length > 0 || Object.keys(otherItems).length > 0

  if (!hasAnyPriced && logoBasePrice === 0) {
    return (
      <div className="prc__body">
        <p className="prc__empty">Custom service details coming soon.</p>
      </div>
    )
  }

  return (
    <form className="prc__body" onSubmit={handleSubmit}>

      <div className="prc__clientSection">
        <h2 className="prc__sectionTitle">Your Details</h2>
        <div className="prc__clientFields">
          <label className="prc__label">
            Full Name <span className="prc__req">*</span>
            <input className="prc__input" required value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <label className="prc__label">
            Email Address <span className="prc__req">*</span>
            <input className="prc__input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <label className="prc__label">
            Phone <span className="prc__opt">(optional)</span>
            <input className="prc__input" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </label>
        </div>
      </div>

      <div className="prc__servicesSection">
        <h2 className="prc__sectionTitle">Select Services</h2>

        {/* Logo */}
        {logoBasePrice > 0 && (
          <div className={`prc__logoCard${logoActive ? " prc__logoCard--active" : ""}`}>
            <button type="button" className="prc__logoCardBtn"
              onClick={() => { setLogoActive((v) => !v); if (logoActive) setLogoVariationOrder([]) }}>
              <span className="prc__logoCardCheck">{logoActive ? "✓" : ""}</span>
              <div className="prc__logoCardInfo">
                <span className="prc__logoCardName">New Logo</span>
                <span className="prc__logoCardSub">Full logo design package</span>
              </div>
              <span className="prc__logoCardPrice">${logoBasePrice.toLocaleString()}</span>
            </button>

            {logoActive && logoVariants.length > 0 && (
              <div className="prc__logoVariants">
                <p className="prc__logoVariantsHint">
                  {logoVariationOrder.length === 0
                    ? "Choose your logo style — one is included in the package."
                    : "First selection is included. Add more styles for an extra fee."}
                </p>
                {logoVariants.map(({ id, label, hours }) => {
                  const checked = logoVariationOrder.includes(id)
                  const display = logoVariantDisplay(id, hours)
                  return (
                    <label key={id} className={`prc__logoVariant${checked ? " prc__logoVariant--checked" : ""}`}>
                      <input type="checkbox" className="prc__itemCheck"
                        checked={checked} onChange={() => toggleLogoVariation(id)} />
                      <span className="prc__itemName">{label}</span>
                      <span className={`prc__variantPrice prc__variantPrice--${display.cls}`}>
                        {display.text}
                      </span>
                    </label>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Other categories tree */}
        {Object.entries(otherTree).map(([sectionKey, sectionNode]) => {
          const hasLeaves = Object.keys(sectionNode.children).length > 0 || sectionNode.hours > 0
          if (!hasLeaves) return null
          return (
            <div key={sectionKey} className="prc__cat">
              <div className="prc__catHeader">
                <span className="prc__catName">{sectionNode.label}</span>
              </div>
              <div className="prc__catTree">
                <FormTreeNodes
                  nodes={sectionNode.children}
                  depth={0}
                  hourlyRate={pricing.hourlyRate}
                  selected={otherSelected}
                  onToggle={toggleOtherLeaf}
                />
              </div>
            </div>
          )
        })}
      </div>

      {hasSelection && (
        <div className="prc__summary">
          <div className="prc__summaryRow">
            <span>Estimated Total</span>
            <span className="prc__summaryTotal">${total.toLocaleString()}</span>
          </div>
          <p className="prc__summaryNote">Final price confirmed before work begins.</p>
        </div>
      )}

      {error && <p className="prc__error">{error}</p>}

      <button type="submit" className="prc__submitBtn"
        disabled={submitting || !name || !email || !hasSelection}>
        {submitting ? "Sending..." : "Request Quote"}
      </button>
    </form>
  )
}
