"use client"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"

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

function getOrderData(orderId: string): Promise<any> {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await openDB()
      const tx = db.transaction(["orders"], "readonly")
      const store = tx.objectStore("orders")
      const req = store.get(orderId)
      req.onsuccess = () => resolve(req.result)
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

export default function PaymentSuccess() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const [isSubmitting, setIsSubmitting] = useState(true)
  const [error, setError] = useState("")
  const [orderId, setOrderId] = useState("")

  useEffect(() => {
    if (!sessionId) {
      setError("Invalid session")
      setIsSubmitting(false)
      return
    }

    submitOrder()
  }, [sessionId])

  const submitOrder = async () => {
    try {
      const pendingOrderId = sessionStorage.getItem("pendingOrderId")
      if (!pendingOrderId) {
        throw new Error("Order data not found")
      }

      const orderData = await getOrderData(pendingOrderId)
      if (!orderData) {
        throw new Error("Order data not found in storage")
      }

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

      if (orderData.logoFile && orderData.logoFile instanceof File) {
        formData.append("logoFile", orderData.logoFile)
      }

      if (orderData.inspirationFile && orderData.inspirationFile instanceof File) {
        formData.append("inspirationFile", orderData.inspirationFile)
      }

      const res = await fetch("/api/submit-order", {
        method: "POST",
        body: formData,
      })

      const result = await res.json()

      if (!res.ok) {
        throw new Error(result.error || "Failed to submit order")
      }

      setOrderId(result.orderId)

      sessionStorage.removeItem("pendingOrderId")
      await deleteOrderData(pendingOrderId)

      setIsSubmitting(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Order submission failed")
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        {isSubmitting ? (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-gray-100">
              <svg
                className="w-6 h-6 text-gray-600 animate-spin"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
            <p className="text-gray-600">Processing your order...</p>
          </div>
        ) : error ? (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-red-100">
              <svg
                className="w-6 h-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Oops!</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link
              href="/branding-calculator"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Try Again
            </Link>
          </div>
        ) : (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-green-100">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Payment Successful!
            </h1>
            <p className="text-gray-600 mb-2">Your order has been received.</p>
            <p className="text-sm text-gray-500 mb-6">
              Order ID: <span className="font-mono font-semibold">{orderId}</span>
            </p>
            <p className="text-gray-600 mb-6">
              We'll contact you shortly to confirm project details and get started.
            </p>
            <Link
              href="/"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Return Home
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
