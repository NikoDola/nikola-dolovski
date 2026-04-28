"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { db } from "@/lib/firebase"
import { collection, getDocs, orderBy, query } from "firebase/firestore"
import { deleteOrder } from "@/lib/actions/adminOrders"
import AdminNav from "../AdminNav"

interface OrderDoc {
  id: string
  serviceType?: string
  companyName?: string
  contactEmail?: string
  totalAmount?: number
  paymentStatus?: string
  status?: string
  createdAt?: { seconds: number } | null
}

function formatDate(ts?: { seconds: number } | null) {
  if (!ts) return "—"
  return new Date(ts.seconds * 1000).toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
  })
}

export default function OrdersPage() {
  const router = useRouter()
  const [orders, setOrders]       = useState<OrderDoc[]>([])
  const [loading, setLoading]     = useState(true)
  const [toDelete, setToDelete]   = useState<OrderDoc | null>(null)
  const [deleting, setDeleting]   = useState(false)

  useEffect(() => {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"))
    getDocs(q).then(snap => {
      setOrders(snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<OrderDoc, "id">) })))
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const handleDelete = async () => {
    if (!toDelete) return
    setDeleting(true)
    const result = await deleteOrder(toDelete.id)
    if (result.success) {
      setOrders(prev => prev.filter(o => o.id !== toDelete.id))
    }
    setDeleting(false)
    setToDelete(null)
  }

  return (
    <div className="admin-page">
      <AdminNav backHref="/admin" backLabel="Dashboard" sectionLabel="Orders" />

      <div className="admin-inner">
        <div className="admin-header">
          <div className="admin-badge">
            <div className="admin-badge-dot" />
            <span className="admin-badge-label">Studio</span>
          </div>
          <div className="admin-title-row">
            <h1 className="admin-title" style={{ margin: 0 }}>Client Orders</h1>
            {!loading && <span className="admin-count">{orders.length}</span>}
          </div>
          <p className="admin-subtitle">Every confirmed order from the branding calculator. Click a card to view the full brief.</p>
        </div>

        {loading ? (
          <p style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-sans)" }}>Loading orders...</p>
        ) : (
          <div className="orders-grid">
            {orders.length === 0 && (
              <div className="orders-empty">No orders yet. They will appear here after clients complete checkout.</div>
            )}
            {orders.map(order => (
              <div key={order.id} className="order-card order-card--clickable">
                <div className="order-card__body" onClick={() => router.push(`/admin/orders/${order.id}`)}>
                  <div className="order-card__top">
                    <span className="order-card__service-badge">
                      {order.serviceType === "redesign" ? "Redesign" : "Design"}
                    </span>
                    <button
                      className="order-card__delete-btn"
                      onClick={e => { e.stopPropagation(); setToDelete(order) }}
                      title="Delete order"
                    >
                      <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                        <path d="M1 3h12M5 3V2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1M11 3l-.8 9a1 1 0 0 1-1 .9H4.8a1 1 0 0 1-1-.9L3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                  <div className="order-card__company">{order.companyName || "Unnamed order"}</div>
                  <div className="order-card__email">{order.contactEmail || "—"}</div>
                </div>
                <div className="order-card__footer">
                  <span className="order-card__date">{formatDate(order.createdAt)}</span>
                  <span className="order-card__amount">${order.totalAmount ?? 0}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {toDelete && (
        <div className="delete-overlay" onClick={() => setToDelete(null)}>
          <div className="delete-modal" onClick={e => e.stopPropagation()}>
            <div className="delete-modal__icon">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path d="M2 5h18M8 5V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M18 5l-1.2 14a1 1 0 0 1-1 .9H6.2a1 1 0 0 1-1-.9L4 5" stroke="#C0392B" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="delete-modal__title">Delete this order?</div>
            <div className="delete-modal__desc">
              <strong>{toDelete.companyName || "This order"}</strong> will be permanently removed from Firebase. This cannot be undone.
            </div>
            <div className="delete-modal__actions">
              <button className="delete-modal__cancel" onClick={() => setToDelete(null)}>Cancel</button>
              <button className="delete-modal__confirm" onClick={handleDelete} disabled={deleting}>
                {deleting ? "Deleting..." : "Yes, delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
