"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import "./OrderModal.css"

interface SelectedService {
  name: string
  category: string
  hours: number
  option?: string
  price: number
}

interface OrderModalProps {
  isOpen: boolean
  onClose: () => void
  selectedServices: SelectedService[]
  totalHours: number
  totalDiscount: number
  grandTotal: number
}

type FileCategory = "logos" | "fonts" | "inspiration"

const FILE_LIMITS = {
  logos: { maxSize: 2 * 1024 * 1024, label: "2 MB", accept: "image/*", desc: "Your existing logo or brand files (PNG, SVG, JPG)" },
  inspiration: { maxSize: 5 * 1024 * 1024, label: "5 MB", accept: "image/*", desc: "Mood board or reference images you like" },
  fonts: { maxSize: 1 * 1024 * 1024, label: "1 MB", accept: ".ttf,.otf,.woff,.woff2", desc: "Preferred fonts if you have them" },
}

export default function OrderModal({ isOpen, onClose, selectedServices, totalHours, totalDiscount, grandTotal }: OrderModalProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [notes, setNotes] = useState("")
  const [files, setFiles] = useState<Record<FileCategory, File[]>>({ logos: [], fonts: [], inspiration: [] })
  const [fileErrors, setFileErrors] = useState<Record<FileCategory, string>>({ logos: "", fonts: "", inspiration: "" })
  const [captchaToken, setCaptchaToken] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [orderId, setOrderId] = useState("")

  const captchaRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<number | null>(null)

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = "" }
  }, [])

  // Load reCAPTCHA
  useEffect(() => {
    const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY
    if (!SITE_KEY) return

    const render = () => {
      if (!captchaRef.current || widgetIdRef.current !== null) return
      widgetIdRef.current = (window as any).grecaptcha.render(captchaRef.current, {
        sitekey: SITE_KEY,
        callback: (token: string) => setCaptchaToken(token),
        "expired-callback": () => setCaptchaToken(""),
      })
    }

    if ((window as any).grecaptcha?.render) {
      render()
    } else {
      (window as any).__recaptchaOnLoad = render
      if (!document.querySelector("script[data-recaptcha]")) {
        const script = document.createElement("script")
        script.src = "https://www.google.com/recaptcha/api.js?onload=__recaptchaOnLoad&render=explicit"
        script.async = true
        script.setAttribute("data-recaptcha", "1")
        document.body.appendChild(script)
      }
    }
  }, [])

  const handleFiles = useCallback((category: FileCategory, incoming: FileList | null) => {
    if (!incoming) return
    const limit = FILE_LIMITS[category]
    const current = files[category]
    const newFiles: File[] = []
    let err = ""

    Array.from(incoming).forEach(f => {
      if (current.length + newFiles.length >= 3) {
        err = "Maximum 3 files per category"
        return
      }
      if (f.size > limit.maxSize) {
        err = `${f.name} exceeds ${limit.label} limit`
        return
      }
      newFiles.push(f)
    })

    setFiles(prev => ({ ...prev, [category]: [...prev[category], ...newFiles] }))
    setFileErrors(prev => ({ ...prev, [category]: err }))
  }, [files])

  const removeFile = useCallback((category: FileCategory, index: number) => {
    setFiles(prev => ({ ...prev, [category]: prev[category].filter((_, i) => i !== index) }))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY
    if (SITE_KEY && !captchaToken) {
      setError("Please complete the captcha before submitting.")
      return
    }

    setSubmitting(true)
    try {
      const form = new FormData()
      form.append("clientName", name.trim())
      form.append("clientEmail", email.trim())
      form.append("notes", notes.trim())
      form.append("selectedServices", JSON.stringify(selectedServices))
      form.append("totalHours", String(totalHours))
      form.append("grandTotal", String(grandTotal))
      form.append("captchaToken", captchaToken)

      files.logos.forEach(f => form.append("logos", f))
      files.fonts.forEach(f => form.append("fonts", f))
      files.inspiration.forEach(f => form.append("inspiration", f))

      const res = await fetch("/api/branding-calculator/submit", { method: "POST", body: form })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.")
        return
      }

      setOrderId(data.orderId)
    } catch {
      setError("Network error. Please check your connection and try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose()
  }

  if (orderId) {
    return (
      <div className="orderOverlay" onClick={handleBackdropClick}>
        <div className="orderModal orderSuccess">
          <div className="successIcon">✓</div>
          <h2>Order Submitted!</h2>
          <p className="successSub">
            Your brief has been received. I&apos;ll review it and get back to you at <strong>{email}</strong> within 24–48 hours.
          </p>
          <div className="successId">
            <span>Order ID</span>
            <code>{orderId}</code>
          </div>
          <button className="closeSuccessBtn" onClick={onClose}>Close</button>
        </div>
      </div>
    )
  }

  return (
    <div className="orderOverlay" onClick={handleBackdropClick}>
      <div className="orderModal">
        <div className="orderHeader">
          <h2>Complete Your Order</h2>
          <button className="orderCloseBtn" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className="orderScroll">
          {/* Order summary */}
          <div className="orderSummaryBox">
            <h3>Your selection</h3>
            <div className="orderSummaryList">
              {selectedServices.map((s, i) => (
                <div key={i} className="orderSummaryRow">
                  <span className="osSvcName">{s.name}{s.option ? ` — ${s.option}` : ""}</span>
                  <span className="osSvcHours">{s.hours}h · ${s.price}</span>
                </div>
              ))}
            </div>
            <div className="orderSummaryTotals">
              {totalDiscount > 0 && <div className="osTotalRow"><span>Discount</span><span className="osDiscount">−${totalDiscount}</span></div>}
              <div className="osTotalRow osFinal"><span>Estimated Total</span><span>${grandTotal}</span></div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="orderForm">
            {/* Contact info */}
            <div className="orderSection">
              <h3>Your details</h3>
              <div className="orderField">
                <label htmlFor="om-name">Full name *</label>
                <input id="om-name" type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="Jane Smith" />
              </div>
              <div className="orderField">
                <label htmlFor="om-email">Email address *</label>
                <input id="om-email" type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="jane@example.com" />
              </div>
              <div className="orderField">
                <label htmlFor="om-notes">Brief / notes <span className="optional">(optional)</span></label>
                <textarea
                  id="om-notes"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  rows={4}
                  placeholder="Describe your brand, target audience, color preferences, style references, anything that helps..."
                />
              </div>
            </div>

            {/* File uploads */}
            <div className="orderSection">
              <h3>File uploads <span className="optional">(all optional)</span></h3>
              {(Object.keys(FILE_LIMITS) as FileCategory[]).map(cat => (
                <div key={cat} className="fileUploadBlock">
                  <div className="fileUploadLabel">
                    <span className="fileUploadTitle">{cat.charAt(0).toUpperCase() + cat.slice(1)}</span>
                    <span className="fileUploadDesc">{FILE_LIMITS[cat].desc} — max 3 files, {FILE_LIMITS[cat].label} each</span>
                  </div>
                  <label className="fileDropZone">
                    <input
                      type="file"
                      multiple
                      accept={FILE_LIMITS[cat].accept}
                      onChange={e => handleFiles(cat, e.target.files)}
                      style={{ display: "none" }}
                    />
                    <span>+ Choose files</span>
                  </label>
                  {fileErrors[cat] && <p className="fileError">{fileErrors[cat]}</p>}
                  {files[cat].length > 0 && (
                    <ul className="fileList">
                      {files[cat].map((f, i) => (
                        <li key={i} className="fileItem">
                          <span>{f.name}</span>
                          <button type="button" onClick={() => removeFile(cat, i)} aria-label="Remove">✕</button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>

            {/* reCAPTCHA */}
            {process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && (
              <div className="orderSection captchaSection">
                <div ref={captchaRef} />
              </div>
            )}

            {error && <p className="orderError">{error}</p>}

            <button
              type="submit"
              className="orderSubmitBtn"
              disabled={submitting || (!!process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && !captchaToken)}
            >
              {submitting ? "Submitting…" : "Submit Order"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
