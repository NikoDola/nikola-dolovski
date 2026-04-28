"use client"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { db } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"
import { FONT_CATEGORIES, COLOR_FAMILIES, VARIATION_LABELS, STYLE_PRESETS } from "@/components/branding/data"
import AdminNav from "../../AdminNav"

const allFonts  = Object.values(FONT_CATEGORIES).flatMap(c => c.fonts)
const fontMap   = Object.fromEntries(allFonts.map(f => [f.id, f]))
const colorMap  = Object.fromEntries(COLOR_FAMILIES.map(c => [c.id, c]))
const styleMap  = Object.fromEntries(STYLE_PRESETS.map(s => [s.id, s]))

const FONTS_URL = "https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@400;700&family=Lora:wght@400;600&family=Merriweather:wght@400;700&family=Cormorant+Garamond:wght@300;600&family=EB+Garamond:wght@400;700&family=Libre+Baskerville:wght@400;700&family=Crimson+Text:wght@400;700&family=Source+Serif+4:wght@400;700&family=Spectral:wght@400;700&family=Bitter:wght@400;700&family=Arvo:wght@400;700&family=PT+Serif:wght@400;700&family=Vollkorn:wght@400;700&family=Alegreya:wght@400;700&family=Outfit:wght@300;400;600;700&family=Plus+Jakarta+Sans:wght@300;400;600;700&family=Raleway:wght@300;400;600;700&family=Nunito:wght@300;400;600;700&family=Josefin+Sans:wght@300;400;600;700&family=Poppins:wght@300;400;600;700&family=Montserrat:wght@300;400;600;700&family=Work+Sans:wght@300;400;600;700&family=Barlow:wght@300;400;600;700&family=Manrope:wght@300;400;600;700&family=Rubik:wght@300;400;600;700&family=Urbanist:wght@300;400;600;700&family=Sora:wght@300;400;600;700&family=Figtree:wght@300;400;600;700&family=Pacifico&family=Dancing+Script:wght@400;700&family=Satisfy&family=Great+Vibes&family=Caveat:wght@400;700&family=Kaushan+Script&family=Sacramento&family=Allura&family=Lobster&display=swap"

function isImage(url: string) {
  return /\.(jpg|jpeg|png|svg|webp|gif)(\?|$)/i.test(url)
}

function fmtDate(ts?: { seconds: number } | null) {
  if (!ts) return "—"
  return new Date(ts.seconds * 1000).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
}

interface OrderDoc {
  orderId?: string
  serviceType?: string
  companyName?: string
  tagline?: string
  description?: string
  variations?: string[]
  styles?: string[]
  pinterestUrl?: string
  typographyType?: string
  customPrice?: number
  selectedFonts?: string[]
  fontLinks?: string[]
  sameBrandFont?: boolean
  colorFamilies?: string[]
  customColors?: string[]
  useSameColors?: boolean
  logoUrl?: string | null
  inspirationUrl?: string | null
  totalAmount?: number
  paymentStatus?: string
  status?: string
  contactEmail?: string
  stripeSessionId?: string
  createdAt?: { seconds: number } | null
}

function Section({ num, label, children }: { num: number; label: string; children: React.ReactNode }) {
  return (
    <div className="od-section">
      <div className="od-section__head">
        <div className="od-section__num">{num}</div>
        <div className="od-section__label">{label}</div>
      </div>
      <div className="od-section__body">{children}</div>
    </div>
  )
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="od-row">
      <div className="od-row__key">{k}</div>
      <div className="od-row__val">{v}</div>
    </div>
  )
}

function FileBlock({ url, label }: { url: string; label: string }) {
  const img = isImage(url)
  return (
    <div className="od-file">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {img && <img src={url} alt={label} className="od-file__preview" />}
      <div className="od-file__info">
        <div className="od-file__type">{label} file</div>
        <a href={url} download target="_blank" rel="noopener noreferrer" className="od-file__link">
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M6.5 1v8M3.5 6.5l3 3 3-3M1 11h11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Download
        </a>
        {img && (
          <a href={url} target="_blank" rel="noopener noreferrer" className="od-file__link">
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <rect x="1" y="1" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="1.4"/>
              <path d="M4 6.5h5M6.5 4v5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
            View full size
          </a>
        )}
      </div>
    </div>
  )
}

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [order, setOrder]   = useState<OrderDoc | null>(null)
  const [loading, setLoad]  = useState(true)
  const [error, setError]   = useState("")

  useEffect(() => {
    if (!document.getElementById("od-gfonts")) {
      const link = document.createElement("link")
      link.id = "od-gfonts"
      link.rel = "stylesheet"
      link.href = FONTS_URL
      document.head.appendChild(link)
    }
  }, [])

  useEffect(() => {
    if (!id) return
    getDoc(doc(db, "orders", id as string))
      .then(snap => {
        if (!snap.exists()) { setError("Order not found"); setLoad(false); return }
        setOrder(snap.data() as OrderDoc)
        setLoad(false)
      })
      .catch(() => { setError("Failed to load order"); setLoad(false) })
  }, [id])

  const shell = (content: React.ReactNode) => (
    <div className="admin-page">
      <AdminNav backHref="/admin/orders" backLabel="All Orders" sectionLabel="Order Detail" />
      <div className="admin-inner">{content}</div>
    </div>
  )

  if (loading) return shell(<p style={{ color: "var(--color-text-muted)" }}>Loading order...</p>)
  if (error || !order) return shell(<p style={{ color: "var(--color-error)" }}>{error || "Order not found"}</p>)

  const company = order.companyName || "Unnamed order"

  const hasStyle      = !!(order.styles?.length || order.pinterestUrl || order.inspirationUrl)
  const hasTypography = !!order.typographyType
  const hasColors     = !!(order.colorFamilies?.length || order.customColors?.length || order.useSameColors)

  let n = 1
  const next = () => n++

  return shell(
    <>
      <div className="od-header">
        <div className="od-id-chip">Order ID: <span>{id}</span></div>
        <h1 className="od-company">{company}</h1>
        <p className="od-meta">
          {order.serviceType === "redesign" ? "Logo Redesign" : "Logo Design"} · {fmtDate(order.createdAt)}
          {order.paymentStatus === "paid" && (
            <span className="od-status od-status--paid" style={{ marginLeft: "10px" }}>Paid</span>
          )}
        </p>
      </div>

      <div className="od-sections">

        {/* 1. Service */}
        <Section num={next()} label="Service">
          <Row k="Type" v={order.serviceType === "redesign" ? "Logo Redesign" : "Logo Design"} />
        </Section>

        {/* 2. Brand Info / Uploaded Logo */}
        {(order.companyName || order.tagline || order.description || order.logoUrl) && (
          <Section num={next()} label={order.serviceType === "redesign" ? "Brand Info & Logo Upload" : "Brand Info"}>
            {order.companyName   && <Row k="Company Name" v={order.companyName} />}
            {order.tagline       && <Row k="Tagline" v={`"${order.tagline}"`} />}
            {order.description   && <Row k="About the Brand" v={order.description} />}
            {order.logoUrl       && <div className="od-row"><div className="od-row__key">Uploaded Logo</div><FileBlock url={order.logoUrl} label="Logo" /></div>}
          </Section>
        )}

        {/* 3. Style Direction */}
        {hasStyle && (
          <Section num={next()} label="Style Direction">
            {order.styles?.length ? (
              <div className="od-row">
                <div className="od-row__key">Design Styles</div>
                <div className="od-chips">
                  {order.styles.map(s => <span key={s} className="od-chip od-chip--neutral">{styleMap[s]?.label || s}</span>)}
                </div>
              </div>
            ) : null}
            {order.pinterestUrl && (
              <Row k="Pinterest Board" v={<a href={order.pinterestUrl} target="_blank" rel="noopener noreferrer">{order.pinterestUrl}</a>} />
            )}
            {order.inspirationUrl && (
              <div className="od-row">
                <div className="od-row__key">Inspiration File</div>
                <FileBlock url={order.inspirationUrl} label="Inspiration" />
              </div>
            )}
          </Section>
        )}

        {/* 4. Logo Variations */}
        {order.variations?.length ? (
          <Section num={next()} label="Logo Variations">
            <div className="od-row">
              <div className="od-row__key">Selected Variations</div>
              <div className="od-chips">
                {order.variations.map((v, i) => (
                  <span key={v} className="od-chip">
                    {VARIATION_LABELS[v] || v}{i === 0 ? " — included" : " — +$25"}
                  </span>
                ))}
              </div>
            </div>
            {order.variations.length > 1 && (
              <Row k="Extras Total" v={`${order.variations.length - 1} × $25 = $${(order.variations.length - 1) * 25}`} />
            )}
          </Section>
        ) : null}

        {/* 5. Typography */}
        {hasTypography && (
          <Section num={next()} label="Typography">
            <Row k="Type" v={
              order.typographyType === "custom"
                ? `Custom Typography${(order.customPrice ?? 0) > 0 ? ` (+$${order.customPrice})` : " (included)"}`
                : "Free Font"
            } />
            {order.sameBrandFont && <Row k="Font Preference" v="Using same font as current brand" />}
            {order.selectedFonts?.length ? (
              <div className="od-row">
                <div className="od-row__key">Font Inspirations</div>
                <div className="od-font-list">
                  {order.selectedFonts.map(fid => {
                    const font = fontMap[fid]
                    if (!font) return <div key={fid} className="od-font-item"><div className="od-font-item__id">{fid}</div></div>
                    return (
                      <div key={fid} className="od-font-item">
                        <div className="od-font-item__name" style={{ fontFamily: font.family, fontWeight: font.weight }}>{font.name}</div>
                        <div className="od-font-item__sample" style={{ fontFamily: font.family }}>{font.sample}</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ) : null}
            {order.fontLinks?.filter(l => l.trim()).length ? (
              <div className="od-row">
                <div className="od-row__key">Font Links</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-1)" }}>
                  {order.fontLinks!.filter(l => l.trim()).map((link, i) => (
                    <a key={i} href={link} target="_blank" rel="noopener noreferrer" style={{ fontSize: "var(--font-size-sm)", color: "var(--color-accent)" }}>{link}</a>
                  ))}
                </div>
              </div>
            ) : null}
          </Section>
        )}

        {/* 6. Colors */}
        {hasColors && (
          <Section num={next()} label="Color Direction">
            {order.useSameColors && <Row k="Color Source" v="Using colors from uploaded logo" />}
            {order.colorFamilies?.length ? (
              <div className="od-row">
                <div className="od-row__key">Color Families</div>
                <div className="od-swatches">
                  {order.colorFamilies.map(fid => {
                    const family = colorMap[fid]
                    if (!family) return null
                    return (
                      <div key={fid} className="od-swatch-group">
                        <div className="od-swatch-group__label">{family.label}</div>
                        <div className="od-swatch-dots">
                          {family.colors.slice(0, 6).map(c => (
                            <div key={c} className="od-swatch-dot" style={{ background: c }} title={c} />
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ) : null}
            {order.customColors?.length ? (
              <div className="od-row">
                <div className="od-row__key">Custom Colors</div>
                <div className="od-custom-swatches">
                  {order.customColors.map(c => (
                    <div key={c} className="od-custom-swatch">
                      <div className="od-custom-swatch__dot" style={{ background: c }} />
                      <span className="od-custom-swatch__hex">{c}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </Section>
        )}

        {/* 7. Payment & Contact */}
        <Section num={next()} label="Payment & Contact">
          <Row k="Total Amount" v={`$${order.totalAmount ?? 0}`} />
          <Row k="Payment Status" v={
            <span className={`od-status od-status--${order.paymentStatus === "paid" ? "paid" : "pending"}`}>
              {order.paymentStatus === "paid" ? "Paid" : "Pending"}
            </span>
          } />
          {order.status && <Row k="Order Status" v={order.status} />}
          <Row k="Contact Email" v={order.contactEmail || "—"} />
          <Row k="Stripe Session" v={
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--font-size-xs)", color: "var(--color-text-muted)", wordBreak: "break-all" }}>
              {order.stripeSessionId || "—"}
            </span>
          } />
        </Section>

      </div>
    </>
  )
}
