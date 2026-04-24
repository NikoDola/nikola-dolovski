"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import type { QuoteRequest } from "@/app/api/quotes/route"
import "../pricing.css"

export default function AdminQuotesPage() {
  const [quotes, setQuotes] = useState<QuoteRequest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/quotes").then((r) => r.json()).then((data) => {
      setQuotes(data)
      setLoading(false)
    })
  }, [])

  async function markSeen(id: string) {
    await fetch("/api/quotes", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: "seen" }),
    })
    setQuotes((prev) => prev.map((q) => q.id === id ? { ...q, status: "seen" } : q))
  }

  return (
    <div className="admp">
      <div className="admp__header">
        <h1 className="admp__title">Quote Requests</h1>
        <Link href="/admin/pricing" className="admp__view">← Back to Pricing</Link>
      </div>

      {loading ? (
        <p className="admp__status">Loading...</p>
      ) : quotes.length === 0 ? (
        <p className="admp__status">No quote requests yet.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {quotes.map((q) => (
            <div key={q.id} className={`admp__quote${q.status === "new" ? " admp__quote--new" : ""}`}>
              <div className="admp__quoteHeader">
                <div>
                  <strong>{q.name}</strong>
                  <span className="admp__quoteMeta"> · {q.email}</span>
                  {q.phone && <span className="admp__quoteMeta"> · {q.phone}</span>}
                </div>
                <div className="admp__quoteRight">
                  <span className="admp__quoteTotal">${q.total.toLocaleString()}</span>
                  <span className="admp__quoteDate">{new Date(q.submittedAt).toLocaleDateString()}</span>
                  {q.status === "new" && (
                    <button className="admp__seenBtn" onClick={() => markSeen(q.id)}>Mark Seen</button>
                  )}
                  {q.status !== "new" && <span className="admp__quoteStatus">{q.status}</span>}
                </div>
              </div>
              <ul className="admp__quoteItems">
                {q.selections.map((sel) => (
                  <li key={sel.categoryId}>
                    <strong>{sel.categoryLabel}</strong>
                    {sel.itemLabels.length > 0 && (
                      <span className="admp__quoteSubs"> — {sel.itemLabels.join(", ")}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
