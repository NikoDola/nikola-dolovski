"use client"
import { useState } from "react"
import type { PricingData, PricingItem } from "@/app/api/pricing/route"

interface Props {
  pricing: PricingData
}

function isMascot(item: PricingItem) {
  return item.label.toLowerCase().includes("mascot")
}

export function PricingForm({ pricing }: Props) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")

  // Logo: one primary type (radio) + variation extras (checkboxes)
  const [primaryLogoId, setPrimaryLogoId] = useState<string | null>(null)
  const [logoVariationIds, setLogoVariationIds] = useState<Set<string>>(new Set())

  // All other categories: map of catId → Set of selected itemIds
  const [otherSelections, setOtherSelections] = useState<Map<string, Set<string>>>(new Map())

  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

  const logoCat = pricing.categories.find((c) => c.id === "logo")
  const otherCats = pricing.categories.filter((c) => c.id !== "logo")

  function selectPrimaryLogo(id: string) {
    setPrimaryLogoId(id)
    // Drop any variation that is now invalid (selected primary itself, or mascot if non-mascot chosen)
    const item = logoCat?.items.find((i) => i.id === id)
    const choosingMascot = item ? isMascot(item) : false
    setLogoVariationIds((prev) => {
      const next = new Set(prev)
      next.delete(id)
      if (!choosingMascot) {
        for (const vid of next) {
          const v = logoCat?.items.find((i) => i.id === vid)
          if (v && isMascot(v)) next.delete(vid)
        }
      }
      return next
    })
  }

  function toggleLogoVariation(id: string) {
    setLogoVariationIds((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function toggleOtherItem(catId: string, itemId: string) {
    setOtherSelections((prev) => {
      const next = new Map(prev)
      const ids = new Set(next.get(catId) ?? [])
      ids.has(itemId) ? ids.delete(itemId) : ids.add(itemId)
      if (ids.size === 0) next.delete(catId)
      else next.set(catId, ids)
      return next
    })
  }

  // Variations = all logo items except the chosen primary, and exclude mascot if non-mascot chosen
  function getLogoVariations(): PricingItem[] {
    if (!primaryLogoId || !logoCat) return []
    const primary = logoCat.items.find((i) => i.id === primaryLogoId)
    if (!primary) return []
    const choosingMascot = isMascot(primary)
    return logoCat.items.filter((item) => {
      if (item.id === primaryLogoId) return false
      if (!choosingMascot && isMascot(item)) return false
      return true
    })
  }

  function calcTotal(): number {
    let total = 0
    if (primaryLogoId && logoCat) {
      total += logoCat.hours * pricing.hourlyRate
      for (const id of logoVariationIds) {
        const item = logoCat.items.find((i) => i.id === id)
        if (item) total += item.hours * pricing.hourlyRate
      }
    }
    for (const [catId, itemIds] of otherSelections) {
      const cat = otherCats.find((c) => c.id === catId)
      if (!cat) continue
      for (const id of itemIds) {
        const item = cat.items.find((i) => i.id === id)
        if (item) total += item.hours * pricing.hourlyRate
      }
    }
    return total
  }

  const total = calcTotal()
  const hasSelection = !!primaryLogoId || Array.from(otherSelections.values()).some((s) => s.size > 0)
  const logoVariations = getLogoVariations()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!hasSelection) { setError("Please select at least one service."); return }
    setError("")
    setSubmitting(true)

    const selections: {
      categoryId: string; categoryLabel: string; itemIds: string[]; itemLabels: string[]
    }[] = []

    if (primaryLogoId && logoCat) {
      const primary = logoCat.items.find((i) => i.id === primaryLogoId)
      const varIds = Array.from(logoVariationIds)
      selections.push({
        categoryId: "logo",
        categoryLabel: "Logo",
        itemIds: [primaryLogoId, ...varIds],
        itemLabels: [
          `${primary?.label ?? primaryLogoId} (primary)`,
          ...varIds.map((id) => `${logoCat.items.find((i) => i.id === id)?.label ?? id} (variation)`),
        ],
      })
    }

    for (const [catId, itemIds] of otherSelections) {
      const cat = otherCats.find((c) => c.id === catId)
      if (!cat) continue
      const ids = Array.from(itemIds)
      selections.push({
        categoryId: catId,
        categoryLabel: cat.label,
        itemIds: ids,
        itemLabels: ids.map((id) => cat.items.find((i) => i.id === id)?.label ?? id),
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

  if (pricing.categories.length === 0) {
    return (
      <div className="prc__body">
        <p className="prc__empty">Pricing details coming soon.</p>
      </div>
    )
  }

  return (
    <form className="prc__body" onSubmit={handleSubmit}>

      {/* Client details */}
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

      {/* Services */}
      <div className="prc__servicesSection">
        <h2 className="prc__sectionTitle">Select Services</h2>

        {/* ── LOGO (special) ── */}
        {logoCat && logoCat.items.length > 0 && (
          <div className="prc__logoSection">
            <div className="prc__logoHeader">
              <h3 className="prc__logoTitle">Logo Design</h3>
              {logoCat.hours > 0 && (
                <span className="prc__logoPrice">
                  from ${(logoCat.hours * pricing.hourlyRate).toLocaleString()}
                </span>
              )}
            </div>
            <p className="prc__logoHint">Choose one style — included in the base price.</p>

            <div className="prc__logoOptions">
              {logoCat.items.map((item) => {
                const isChosen = primaryLogoId === item.id
                return (
                  <label key={item.id} className={`prc__logoOpt${isChosen ? " prc__logoOpt--chosen" : ""}`}>
                    <input
                      type="radio"
                      name="logoType"
                      value={item.id}
                      checked={isChosen}
                      onChange={() => selectPrimaryLogo(item.id)}
                      className="prc__logoRadio"
                    />
                    <span className="prc__logoOptName">{item.label}</span>
                    <span className="prc__included">Included</span>
                  </label>
                )
              })}
            </div>

            {/* Logo Variations — appear only after a type is chosen */}
            {primaryLogoId && logoVariations.length > 0 && (
              <div className="prc__logoVariations">
                <p className="prc__variationsLabel">Logo Variations <span className="prc__opt">— extra styles, each billed separately</span></p>
                {logoVariations.map((item) => {
                  const checked = logoVariationIds.has(item.id)
                  const extraPrice = item.hours * pricing.hourlyRate
                  return (
                    <label key={item.id} className={`prc__item${checked ? " prc__item--checked" : ""}`}>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleLogoVariation(item.id)}
                        className="prc__itemCheck"
                      />
                      <span className="prc__itemName">{item.label}</span>
                      {extraPrice > 0 && (
                        <span className="prc__itemPrice">+${extraPrice.toLocaleString()}</span>
                      )}
                    </label>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* ── ALL OTHER CATEGORIES ── */}
        {otherCats.length > 0 && (
          <div className="prc__categories">
            {otherCats.map((cat) => {
              const selectedIds = otherSelections.get(cat.id) ?? new Set<string>()
              const pricedItems = cat.items.filter((i) => i.hours > 0)
              if (pricedItems.length === 0) return null

              return (
                <div key={cat.id} className="prc__cat">
                  <div className="prc__catHeader">
                    <span className="prc__catName">{cat.label}</span>
                  </div>
                  <div className="prc__catItems">
                    {pricedItems.map((item) => {
                      const checked = selectedIds.has(item.id)
                      const itemPrice = item.hours * pricing.hourlyRate
                      return (
                        <label key={item.id} className={`prc__item${checked ? " prc__item--checked" : ""}`}>
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleOtherItem(cat.id, item.id)}
                            className="prc__itemCheck"
                          />
                          <span className="prc__itemName">{item.label}</span>
                          {itemPrice > 0 && (
                            <span className="prc__itemPrice">${itemPrice.toLocaleString()}</span>
                          )}
                        </label>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Running total */}
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

      <button
        type="submit"
        className="prc__submitBtn"
        disabled={submitting || !name || !email || !hasSelection}
      >
        {submitting ? "Sending..." : "Request Quote"}
      </button>
    </form>
  )
}
