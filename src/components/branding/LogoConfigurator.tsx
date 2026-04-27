"use client"
import { useState, useEffect } from "react"
import "./LogoConfigurator.css"
import { T } from "./tokens"
import ProgressBar from "./shared/ProgressBar"
import ServiceSelection from "./screens/ServiceSelection"
import BrandInfoScreen from "./screens/BrandInfoScreen"
import UploadScreen from "./screens/UploadScreen"
import VariationsScreen from "./screens/VariationsScreen"
import StylePickerScreen from "./screens/StylePickerScreen"
import TypographyScreen from "./screens/TypographyScreen"
import ColorPickerScreen from "./screens/ColorPickerScreen"
import SummaryScreen from "./screens/SummaryScreen"
import type { Screen, ServiceType, Order } from "./types"

const FLOW_STEPS: Record<string, string[]> = {
  design_icon:  ["Service", "Brand",   "Variations", "Style", "Colors",      "Review"],
  design_other: ["Service", "Brand",   "Variations", "Style", "Typography",  "Colors", "Review"],
  redesign:     ["Service", "Upload",  "Style",      "Variations", "Typography", "Colors", "Review"],
  default:      ["Service", "Brand",   "Variations", "Style", "Colors",      "Review"],
}

const SCREEN_STEP: Record<string, Record<string, number>> = {
  service:      { design_icon: 0, design_other: 0, redesign: 0, default: 0 },
  "brand-info": { design_icon: 1, design_other: 1, default: 1 },
  upload:       { redesign: 1 },
  variations:   { design_icon: 2, design_other: 2, redesign: 3, default: 2 },
  "style-icon": { design_icon: 3, design_other: 3, default: 3 },
  "style-red":  { redesign: 2 },
  typography:   { design_other: 4, redesign: 4, default: 4 },
  colors:       { design_icon: 4, design_other: 5, redesign: 5, default: 4 },
  summary:      { design_icon: 5, design_other: 6, redesign: 6, default: 5 },
}

export default function LogoConfigurator() {
  const [screen, setScreen]           = useState<Screen>("service")
  const [serviceType, setServiceType] = useState<ServiceType>(null)
  const [variations, setVariations]   = useState<string[]>([])
  const [companyInfo, setCompanyInfo] = useState({})
  const [styleInfo, setStyleInfo]     = useState({})
  const [uploadInfo, setUploadInfo]   = useState({})
  const [colorInfo, setColorInfo]     = useState({})
  const [typographyInfo, setTypoInfo] = useState({})

  // Load Google Fonts for the typography screen
  useEffect(() => {
    const id = "lc-google-fonts"
    if (document.getElementById(id)) return
    const link = document.createElement("link")
    link.id   = id
    link.rel  = "stylesheet"
    link.href = "https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:wght@400;700&family=Lora:wght@400;600&family=Merriweather:wght@400;700&family=Cormorant+Garamond:wght@300;600&family=EB+Garamond:wght@400;700&family=Libre+Baskerville:wght@400;700&family=Crimson+Text:wght@400;700&family=Source+Serif+4:wght@400;700&family=Spectral:wght@400;700&family=Bitter:wght@400;700&family=Arvo:wght@400;700&family=PT+Serif:wght@400;700&family=Vollkorn:wght@400;700&family=Alegreya:wght@400;700&family=Outfit:wght@300;400;600;700&family=Plus+Jakarta+Sans:wght@300;400;600;700&family=Raleway:wght@300;400;600;700&family=Nunito:wght@300;400;600;700&family=Josefin+Sans:wght@300;400;600;700&family=Poppins:wght@300;400;600;700&family=Montserrat:wght@300;400;600;700&family=Work+Sans:wght@300;400;600;700&family=Barlow:wght@300;400;600;700&family=Manrope:wght@300;400;600;700&family=Rubik:wght@300;400;600;700&family=Urbanist:wght@300;400;600;700&family=Sora:wght@300;400;600;700&family=Figtree:wght@300;400;600;700&family=Pacifico&family=Dancing+Script:wght@400;700&family=Satisfy&family=Great+Vibes&family=Caveat:wght@400;700&family=Kaushan+Script&family=Sacramento&family=Allura&family=Lobster&display=swap"
    document.head.appendChild(link)
  }, [])

  const iconOnly  = variations.length > 0 && variations.every(v => v === "icon")
  const hasNonIcon = variations.some(v => v !== "icon")

  let flowKey = "default"
  if (serviceType === "redesign") flowKey = "redesign"
  else if (serviceType === "design" && iconOnly && !hasNonIcon) flowKey = "design_icon"
  else if (serviceType === "design" && (hasNonIcon || variations.length === 0)) flowKey = "design_other"

  const steps   = FLOW_STEPS[flowKey] || FLOW_STEPS.default
  const stepMap = SCREEN_STEP[screen] || {}
  const stepIdx = stepMap[flowKey] ?? stepMap["default"] ?? 0

  const order: Order = { serviceType, variations, ...companyInfo, ...styleInfo, ...uploadInfo, ...colorInfo, ...typographyInfo }

  const estimatedTotal = 150 + Math.max(0, variations.length - 1) * 25 + ((typographyInfo as any).typographyType === "custom" && (typographyInfo as any).customPrice > 0 ? (typographyInfo as any).customPrice : 0)

  return (
    <div className="lc-root" style={{ minHeight: "100vh", background: T.color.bg, display: "flex", flexDirection: "column", fontFamily: T.font.sans }}>

      {/* Header */}
      <header style={{ borderBottom: `1px solid ${T.color.border}`, background: T.color.surface, padding: `${T.space["5"]} ${T.space["8"]}`, display: "flex", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: T.space["3"] }}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect width="28" height="28" rx="7" fill={T.color.accent}/>
            <path d="M7 20L14 8L21 20" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9.5 16h9" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span style={{ fontSize: T.fontSize.md, fontWeight: T.fontWeight.bold, color: T.color.textPrimary, letterSpacing: "-0.02em" }}>Logo Services</span>
        </div>
      </header>

      {/* Progress */}
      <div style={{ borderBottom: `1px solid ${T.color.border}`, background: T.color.surface, padding: `${T.space["5"]} ${T.space["8"]}` }}>
        <div style={{ maxWidth: "560px" }}>
          <ProgressBar steps={steps} current={stepIdx} />
        </div>
      </div>

      {/* Main content */}
      <main style={{ flex: 1, display: "flex", justifyContent: "center", padding: `${T.space["12"]} ${T.space["8"]} ${T.space["24"]}` }}>
        <div style={{ width: "100%", maxWidth: "880px" }}>

          {screen === "service" && (
            <ServiceSelection onSelect={type => { setServiceType(type); setScreen(type === "design" ? "brand-info" : "upload") }} />
          )}

          {screen === "brand-info" && (
            <BrandInfoScreen onBack={() => setScreen("service")} onNext={info => { setCompanyInfo(info); setScreen("variations") }} />
          )}

          {screen === "upload" && (
            <UploadScreen onBack={() => setScreen("service")} onNext={info => { setUploadInfo(info); setScreen("style-red") }} />
          )}

          {screen === "style-red" && (
            <StylePickerScreen onBack={() => setScreen("upload")} onNext={info => { setStyleInfo(info); setScreen("variations") }} />
          )}

          {screen === "variations" && (
            <VariationsScreen onBack={() => setScreen(serviceType === "redesign" ? "style-red" : "brand-info")} onNext={vars => { setVariations(vars); setScreen("style-icon") }} />
          )}

          {screen === "style-icon" && (
            <StylePickerScreen
              nextLabel={variations.every(v => v === "icon") ? "Next — Colors" : "Next — Typography"}
              onBack={() => setScreen("variations")}
              onNext={info => { setStyleInfo(info); setScreen(variations.every(v => v === "icon") ? "colors" : "typography") }}
            />
          )}

          {screen === "typography" && (
            <TypographyScreen serviceType={serviceType} selectedVariations={variations}
              onBack={() => setScreen(serviceType === "redesign" ? "variations" : "style-icon")}
              onNext={info => { setTypoInfo(info); setScreen("colors") }}
            />
          )}

          {screen === "colors" && (
            <ColorPickerScreen serviceType={serviceType}
              onBack={() => setScreen(variations.every(v => v === "icon") ? "style-icon" : "typography")}
              onNext={info => { setColorInfo(info); setScreen("summary") }}
            />
          )}

          {screen === "summary" && (
            <SummaryScreen order={order} onBack={() => setScreen(serviceType === "redesign" ? "colors" : variations.every(v => v === "icon") ? "colors" : "colors")} />
          )}
        </div>
      </main>

      {/* Sticky price footer */}
      {screen !== "summary" && (
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50, background: T.color.surface, borderTop: `1px solid ${T.color.border}`, padding: `${T.space["4"]} ${T.space["8"]}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: T.space["3"] }}>
            <span style={{ fontSize: T.fontSize.sm, color: T.color.textMuted }}>Estimated total</span>
            {variations.length > 1 && (
              <span style={{ fontSize: T.fontSize.xs, color: T.color.textMuted, background: T.color.surfaceAlt, border: `1px solid ${T.color.border}`, borderRadius: T.radius.full, padding: `2px ${T.space["3"]}` }}>
                {variations.length - 1} extra variation{variations.length > 2 ? "s" : ""} +${(variations.length - 1) * 25}
              </span>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: T.space["1"] }}>
            <span style={{ fontSize: T.fontSize["2xl"], fontWeight: T.fontWeight.bold, color: T.color.textPrimary }}>${estimatedTotal}</span>
            <span style={{ fontSize: T.fontSize.sm, color: T.color.textMuted }}>total</span>
          </div>
        </div>
      )}
    </div>
  )
}
