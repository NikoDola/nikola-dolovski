"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { SERVICE_TREE, pathToId, LABEL_MAP } from "@/lib/serviceTree"
import type { ServiceTree } from "@/lib/serviceTree"
import type { PricingData } from "@/app/api/pricing/route"
import "./pricing.css"

// ── Recursive tree node ───────────────────────────────────────────────────────

function TreeNode({
  label, path, subtree, hours, hourlyRate, expanded, depth,
  onToggle, onSetHours,
}: {
  label: string
  path: string[]
  subtree: ServiceTree | null
  hours: Record<string, number>
  hourlyRate: number
  expanded: Set<string>
  depth: number
  onToggle: (id: string) => void
  onSetHours: (id: string, h: number) => void
}) {
  const id = pathToId(path)
  const isLeaf = subtree === null
  const isOpen = expanded.has(id)
  const h = hours[id] ?? 0
  const price = h * hourlyRate

  return (
    <div className={`admp__node admp__node--d${Math.min(depth, 4)}`}>
      <div className="admp__nodeRow">
        {!isLeaf && (
          <button type="button" className={`admp__nodeToggle${isOpen ? " admp__nodeToggle--open" : ""}`}
            onClick={() => onToggle(id)}>
            {isOpen ? "▾" : "▸"}
          </button>
        )}
        {isLeaf && <span className="admp__nodeLeafDot" />}
        <span className="admp__nodeLabel">{label}</span>
        <div className="admp__nodePrice">
          <input
            type="number" min={0} step={0.5}
            className="admp__hoursInput"
            value={h || ""}
            placeholder="0"
            onChange={(e) => onSetHours(id, parseFloat(e.target.value) || 0)}
          />
          <span className="admp__hoursUnit">h</span>
          <span className={`admp__priceTag${price > 0 ? " admp__priceTag--active" : ""}`}>
            {price > 0 ? `$${price.toLocaleString()}` : "—"}
          </span>
        </div>
      </div>

      {!isLeaf && isOpen && subtree && (
        <div className="admp__nodeChildren">
          {Object.entries(subtree).map(([childLabel, childSubtree]) => (
            <TreeNode
              key={childLabel}
              label={childLabel}
              path={[...path, childLabel]}
              subtree={childSubtree}
              hours={hours}
              hourlyRate={hourlyRate}
              expanded={expanded}
              depth={depth + 1}
              onToggle={onToggle}
              onSetHours={onSetHours}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function AdminPricingPage() {
  const [hourlyRate, setHourlyRate] = useState(25)
  const [logoBaseHours, setLogoBaseHours] = useState(10)
  const [hours, setHours] = useState<Record<string, number>>({})
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState<{ ok: boolean; msg: string } | null>(null)

  useEffect(() => {
    fetch("/api/pricing")
      .then((r) => r.json())
      .then((data: PricingData) => {
        setHourlyRate(data.hourlyRate ?? 25)
        setLogoBaseHours(data.logoBaseHours ?? 10)
        setHours(data.items ?? {})
        setLoading(false)
      })
  }, [])

  function toggleExpand(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function expandAll() {
    const ids = new Set(Object.keys(LABEL_MAP))
    setExpanded(ids)
  }

  function collapseAll() {
    setExpanded(new Set())
  }

  function setNodeHours(id: string, h: number) {
    setHours((prev) => {
      const next = { ...prev }
      if (h <= 0) delete next[id]
      else next[id] = h
      return next
    })
  }

  async function save() {
    setSaving(true)
    setStatus(null)
    const body: PricingData = { hourlyRate, logoBaseHours, items: hours }
    try {
      const res = await fetch("/api/pricing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      setStatus(res.ok
        ? { ok: true, msg: "Saved and pushed to GitHub." }
        : { ok: false, msg: "Save failed." }
      )
    } catch {
      setStatus({ ok: false, msg: "Network error." })
    } finally {
      setSaving(false)
    }
  }

  const filledCount = Object.keys(hours).length
  const totalHours = Object.values(hours).reduce((s, h) => s + h, 0)

  return (
    <div className="admp">
      <div className="admp__header">
        <h1 className="admp__title">Custom Service</h1>
        <div className="admp__headerRight">
          <Link href="/pricing" target="_blank" className="admp__view">View Public Page →</Link>
          <Link href="/admin/pricing/quotes" className="admp__quotesLink">Quotes</Link>
        </div>
      </div>

      {loading ? (
        <p className="admp__status">Loading...</p>
      ) : (
        <>
          {/* Global settings */}
          <div className="admp__globals">
            <div className="admp__rate">
              <label className="admp__rateLabel">
                Hourly Rate ($)
                <input type="number" min={0} className="admp__rateInput"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(parseFloat(e.target.value) || 0)} />
              </label>
            </div>
            <div className="admp__rate">
              <label className="admp__rateLabel">
                Logo Base Hours
                <input type="number" min={0} step={0.5} className="admp__rateInput"
                  value={logoBaseHours}
                  onChange={(e) => setLogoBaseHours(parseFloat(e.target.value) || 0)} />
              </label>
              <span className="admp__rateHint">
                = ${(logoBaseHours * hourlyRate).toLocaleString()} (Logo package base price)
              </span>
            </div>
          </div>

          {/* Stats + expand controls */}
          <div className="admp__treeBar">
            <span className="admp__treeStats">
              {filledCount} items priced · {totalHours}h total · ${(totalHours * hourlyRate).toLocaleString()}
            </span>
            <div className="admp__treeControls">
              <button type="button" className="admp__treeCtrl" onClick={expandAll}>Expand All</button>
              <button type="button" className="admp__treeCtrl" onClick={collapseAll}>Collapse All</button>
            </div>
          </div>

          {/* Full service tree */}
          <div className="admp__tree">
            {Object.entries(SERVICE_TREE).map(([sectionLabel, sectionTree]) => {
              const sectionId = pathToId([sectionLabel])
              const isOpen = expanded.has(sectionId)
              return (
                <div key={sectionLabel} className="admp__section">
                  <button type="button"
                    className={`admp__sectionBtn${isOpen ? " admp__sectionBtn--open" : ""}`}
                    onClick={() => toggleExpand(sectionId)}>
                    <span>{isOpen ? "▾" : "▸"}</span>
                    <span>{sectionLabel}</span>
                  </button>
                  {isOpen && sectionTree && (
                    <div className="admp__sectionBody">
                      {Object.entries(sectionTree).map(([label, subtree]) => (
                        <TreeNode
                          key={label}
                          label={label}
                          path={[sectionLabel, label]}
                          subtree={subtree}
                          hours={hours}
                          hourlyRate={hourlyRate}
                          expanded={expanded}
                          depth={1}
                          onToggle={toggleExpand}
                          onSetHours={setNodeHours}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {status && (
            <p className={`admp__msg${status.ok ? "" : " admp__msg--error"}`}>{status.msg}</p>
          )}

          <div className="admp__footer">
            <Link href="/admin" className="admp__back">← Admin</Link>
            <button className="admp__save" onClick={save} disabled={saving}>
              {saving ? "Saving..." : "Save & Push to GitHub"}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
