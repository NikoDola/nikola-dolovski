"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import type { PricingData, PricingCategory, PricingItem } from "@/app/api/pricing/route"
import "./pricing.css"

interface ProjectSection {
  id: string
  path: string[]
  headline: string
}

interface Project {
  slug: string
  name: string
  sections?: ProjectSection[]
}

function pathToId(path: string[]): string {
  return path.join("/").toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9/-]/g, "")
}

function catId(label: string): string {
  return label.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
}

export default function AdminPricingPage() {
  const [data, setData] = useState<PricingData>({ hourlyRate: 25, categories: [] })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState<{ ok: boolean; msg: string } | null>(null)
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  useEffect(() => {
    async function load() {
      const [pricingRes, projectsRes] = await Promise.all([
        fetch("/api/pricing"),
        fetch("/api/projects"),
      ])
      const pricing: PricingData = await pricingRes.json()
      const projects: Project[] = await projectsRes.json()

      // Group sections by their top-level category (path[1])
      const catMap = new Map<string, { label: string; items: Map<string, { label: string; sectionPath: string[] }> }>()

      for (const proj of projects) {
        for (const section of proj.sections ?? []) {
          const catLabel = section.path[1]
          if (!catLabel) continue
          const cid = catId(catLabel)
          if (!catMap.has(cid)) catMap.set(cid, { label: catLabel, items: new Map() })
          const cat = catMap.get(cid)!
          if (section.path.length > 2) {
            const itemPath = section.path
            const iid = pathToId(itemPath)
            if (!cat.items.has(iid)) {
              cat.items.set(iid, {
                label: itemPath.slice(2).join(" / "),
                sectionPath: itemPath,
              })
            }
          }
        }
      }

      // Merge with existing pricing data
      const categories: PricingCategory[] = Array.from(catMap.entries()).map(([cid, catDef]) => {
        const existing = pricing.categories.find((c) => c.id === cid)
        const items: PricingItem[] = Array.from(catDef.items.entries()).map(([iid, itemDef]) => {
          const existingItem = existing?.items.find((i) => i.id === iid)
          return existingItem ?? { id: iid, label: itemDef.label, sectionPath: itemDef.sectionPath, hours: 0 }
        })
        return {
          id: cid,
          label: catDef.label,
          hours: existing?.hours ?? 0,
          items,
        }
      })

      setData({ hourlyRate: pricing.hourlyRate, categories })
      setLoading(false)
    }
    load()
  }, [])

  function toggleExpand(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function setCatHours(id: string, hours: number) {
    setData((d) => ({
      ...d,
      categories: d.categories.map((c) => c.id === id ? { ...c, hours } : c),
    }))
  }

  function setItemHours(catId: string, itemId: string, hours: number) {
    setData((d) => ({
      ...d,
      categories: d.categories.map((c) =>
        c.id === catId
          ? { ...c, items: c.items.map((i) => i.id === itemId ? { ...i, hours } : i) }
          : c
      ),
    }))
  }

  async function save() {
    setSaving(true)
    setStatus(null)
    try {
      const res = await fetch("/api/pricing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      setStatus(res.ok ? { ok: true, msg: "Saved and pushed to GitHub." } : { ok: false, msg: "Save failed." })
    } catch {
      setStatus({ ok: false, msg: "Network error." })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="admp">
      <div className="admp__header">
        <h1 className="admp__title">Pricing</h1>
        <div className="admp__headerRight">
          <Link href="/pricing" target="_blank" className="admp__view">View Public Page →</Link>
          <Link href="/admin/pricing/quotes" className="admp__quotesLink">View Quotes</Link>
        </div>
      </div>

      {loading ? (
        <p className="admp__status">Loading...</p>
      ) : (
        <>
          <div className="admp__rate">
            <label className="admp__rateLabel">
              Hourly Rate ($)
              <input
                type="number" min={0} className="admp__rateInput"
                value={data.hourlyRate}
                onChange={(e) => setData((d) => ({ ...d, hourlyRate: Number(e.target.value) }))}
              />
            </label>
            <span className="admp__rateHint">Base rate applied to all hours</span>
          </div>

          {data.categories.length === 0 ? (
            <p className="admp__status">No sections posted yet. Add project sections and they will appear here.</p>
          ) : (
            <div className="admp__cats">
              {data.categories.map((cat) => {
                const isLogo = cat.id === "logo"
                return (
                  <div key={cat.id} className="admp__cat">
                    <div className="admp__catRow">
                      <button
                        type="button"
                        className={`admp__catToggle${expanded.has(cat.id) ? " admp__catToggle--open" : ""}`}
                        onClick={() => toggleExpand(cat.id)}
                      >
                        {expanded.has(cat.id) ? "▼" : "▶"} {cat.label}
                        {cat.items.length > 0 && (
                          <span className="admp__catCount">
                            {cat.items.length} {isLogo ? "variations" : "items"}
                          </span>
                        )}
                      </button>

                      {/* Base hours only for Logo */}
                      {isLogo && (
                        <div className="admp__catPrice">
                          <label className="admp__inlineLabel">Base hours</label>
                          <input
                            type="number" min={0} className="admp__hoursInput"
                            value={cat.hours}
                            onChange={(e) => setCatHours(cat.id, Number(e.target.value))}
                          />
                          <span className="admp__priceTag">
                            {cat.hours > 0 ? `$${(cat.hours * data.hourlyRate).toLocaleString()}` : "—"}
                          </span>
                        </div>
                      )}
                    </div>

                    {expanded.has(cat.id) && cat.items.length > 0 && (
                      <div className="admp__items">
                        {cat.items.map((item) => (
                          <div key={item.id} className="admp__itemRow">
                            <span className="admp__itemLabel">
                              {isLogo ? `+ ${item.label}` : item.label}
                            </span>
                            <div className="admp__catPrice">
                              <label className="admp__inlineLabel">
                                {isLogo ? "Extra hours" : "Hours"}
                              </label>
                              <input
                                type="number" min={0} className="admp__hoursInput"
                                value={item.hours}
                                onChange={(e) => setItemHours(cat.id, item.id, Number(e.target.value))}
                              />
                              <span className="admp__priceTag">
                                {item.hours > 0 ? `$${(item.hours * data.hourlyRate).toLocaleString()}` : "—"}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}

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
