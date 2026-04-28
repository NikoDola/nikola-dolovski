"use client"
import { useSearchParams } from "next/navigation"
import { useEffect, useState, useCallback, Suspense } from "react"
import Link from "next/link"
import type { Order } from "@/components/branding/types"
import "@/components/branding/tokens.css"
import "./page.css"

interface PendingOrderData {
  order: Order
  name: string
  email: string
  payOption: "deposit" | "full"
  addBrandGuide: boolean
  totalAmount: number
  logoFile: File | null
  inspirationFile: File | null
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open("BrandingCalculator", 1)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains("orders")) {
        db.createObjectStore("orders", { keyPath: "id" })
      }
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

function getOrderData(orderId: string): Promise<PendingOrderData | undefined> {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await openDB()
      const tx = db.transaction(["orders"], "readonly")
      const store = tx.objectStore("orders")
      const req = store.get(orderId)
      req.onsuccess = () => resolve(req.result as PendingOrderData | undefined)
      req.onerror = () => reject(req.error)
    } catch (err) {
      reject(err)
    }
  })
}

function deleteOrderData(orderId: string): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await openDB()
      const tx = db.transaction(["orders"], "readwrite")
      const store = tx.objectStore("orders")
      const req = store.delete(orderId)
      req.onsuccess = () => resolve()
      req.onerror = () => reject(req.error)
    } catch (err) {
      reject(err)
    }
  })
}

function PaymentSuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const [isSubmitting, setIsSubmitting] = useState(true)
  const [error, setError] = useState("")
  const [orderId, setOrderId] = useState("")

  const submitOrder = useCallback(async () => {
    try {
      const pendingOrderId = sessionStorage.getItem("pendingOrderId")
      if (!pendingOrderId) throw new Error("Order data not found")

      const orderData = await getOrderData(pendingOrderId)
      if (!orderData) throw new Error("Order data not found in storage")

      const formData = new FormData()
      formData.append("sessionId", sessionId!)
      formData.append("companyName", orderData.order.companyName || "")
      formData.append("tagline", orderData.order.tagline || "")
      formData.append("description", orderData.order.description || "")
      formData.append("contactEmail", orderData.email || "")
      formData.append("variations", JSON.stringify(orderData.order.variations || []))
      formData.append("styles", JSON.stringify(orderData.order.styles || []))
      formData.append("serviceType", orderData.order.serviceType || "")
      formData.append("typographyType", orderData.order.typographyType || "")
      formData.append("selectedFonts", JSON.stringify(orderData.order.selectedFonts || []))
      formData.append("fontLinks", JSON.stringify(orderData.order.fontLinks || []))
      formData.append("sameBrandFont", String(orderData.order.sameBrandFont || false))
      formData.append("colorFamilies", JSON.stringify(orderData.order.colorFamilies || []))
      formData.append("customColors", JSON.stringify(orderData.order.customColors || []))
      formData.append("useSameColors", String(orderData.order.useSameColors || false))
      formData.append("pinterestUrl", orderData.order.pinterestUrl || "")
      formData.append("totalAmount", String(orderData.totalAmount || 0))

      if (orderData.logoFile instanceof File) formData.append("logoFile", orderData.logoFile)
      if (orderData.inspirationFile instanceof File) formData.append("inspirationFile", orderData.inspirationFile)

      const res = await fetch("/api/submit-order", { method: "POST", body: formData })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error || "Failed to submit order")

      setOrderId(result.orderId)
      sessionStorage.removeItem("pendingOrderId")
      await deleteOrderData(pendingOrderId)
      setIsSubmitting(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Order submission failed")
      setIsSubmitting(false)
    }
  }, [sessionId])

  useEffect(() => {
    if (!sessionId) { setError("Invalid session"); setIsSubmitting(false); return }
    submitOrder()
  }, [sessionId, submitOrder])

  if (isSubmitting) {
    return (
      <div className="ps-page">
        <div className="ps-card">
          <div className="ps-icon ps-icon--loading">
            <svg className="ps-spinner" width="28" height="28" viewBox="0 0 28 28" fill="none">
              <circle cx="14" cy="14" r="11" stroke="var(--color-border)" strokeWidth="2.5"/>
              <path d="M14 3a11 11 0 0 1 11 11" stroke="var(--color-accent)" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </div>
          <p className="ps-loading-text">Confirming your payment and saving your order...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="ps-page">
        <div className="ps-card">
          <div className="ps-icon ps-icon--error">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path d="M7 7l14 14M21 7L7 21" stroke="#C0392B" strokeWidth="2.2" strokeLinecap="round"/>
            </svg>
          </div>
          <h1 className="ps-title">Something went wrong</h1>
          <div className="ps-error-msg">{error}</div>
          <Link href="/branding-calculator" className="ps-btn ps-btn--primary">
            Try again
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="ps-page">
      <div className="ps-card">
        <div className="ps-icon ps-icon--success">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d="M6 14l6 6 10-10" stroke="var(--color-success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <div className="ps-badge">
          <div className="ps-badge-dot" />
          <span className="ps-badge-label">Order Confirmed</span>
        </div>

        <h1 className="ps-title">Payment successful</h1>
        <p className="ps-subtitle">Your order is in. We&apos;ll take it from here.</p>

        {orderId && (
          <div className="ps-order-id">
            Order ID: <span className="ps-order-id-value">{orderId}</span>
          </div>
        )}

        <div className="ps-steps">
          <div className="ps-step">
            <div className="ps-step-num">1</div>
            <span>Check your inbox for a confirmation email with your order details.</span>
          </div>
          <div className="ps-step">
            <div className="ps-step-num">2</div>
            <span>We&apos;ll review your brief and reach out within 1 business day to align on any details.</span>
          </div>
          <div className="ps-step">
            <div className="ps-step-num">3</div>
            <span>Your first logo concept will be delivered within 5 business days.</span>
          </div>
        </div>

        <Link href="/" className="ps-btn ps-btn--primary">
          Back to homepage
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </Link>
      </div>
    </div>
  )
}

export default function PaymentSuccess() {
  return (
    <Suspense fallback={
      <div className="ps-page">
        <div className="ps-card">
          <p className="ps-loading-text">Loading...</p>
        </div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  )
}
