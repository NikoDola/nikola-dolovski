"use client"
import { useState, useEffect, useRef } from "react"
import "./tokens.css"
import "./LogoConfigurator.css"
import ProgressBar from "./shared/ProgressBar"
import Button from "./shared/Button"
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

const STEP_SCREEN: Record<string, Screen[]> = {
  design_icon:  ["service", "brand-info", "variations", "style-icon", "colors",      "summary"],
  design_other: ["service", "brand-info", "variations", "style-icon", "typography",  "colors", "summary"],
  redesign:     ["service", "upload",     "style-red",  "variations", "typography",  "colors", "summary"],
  default:      ["service", "brand-info", "variations", "style-icon", "colors",      "summary"],
}

const NEXT_LABEL: Partial<Record<Screen, string>> = {
  "service":    "Continue",
  "brand-info": "Next — Variations",
  "upload":     "Next — Variations",
  "style-red":  "Next — Variations",
  "variations": "Next — Style",
  "typography": "Next — Colors",
  "colors":     "Next — Review",
}

export type SubmitRef = { current: (() => void) | null }


export default function LogoConfigurator() {
  const [screen, setScreen]           = useState<Screen>("service")
  const [serviceType, setServiceType] = useState<ServiceType>(null)
  const [variations, setVariations]   = useState<string[]>([])
  const [companyInfo, setCompanyInfo] = useState<{ companyName?: string; tagline?: string; description?: string }>({})
  const [styleInfo, setStyleInfo]     = useState<{ styles?: string[]; pinterestUrl?: string; inspirationFile?: File | null }>({})
  const [uploadInfo, setUploadInfo]   = useState<{ companyName?: string; tagline?: string; description?: string; file?: File | null }>({})
  const [colorInfo, setColorInfo]     = useState<{ colorFamilies?: string[]; customColors?: string[]; useSameColors?: boolean }>({})
  const [typographyInfo, setTypoInfo] = useState<{ typographyType?: "custom"|"free"|null; customPrice?: number; selectedFonts?: string[]; sameBrandFont?: boolean; fontLinks?: string[] }>({})
  const [files, setFiles]             = useState<{ logo: File | null; inspiration: File | null }>({ logo: null, inspiration: null })
  const [liveVariations, setLiveVariations] = useState<string[]>(variations)
  const [liveTypoPrice, setLiveTypoPrice]   = useState(0)
  const [liveSummaryTotal, setLiveSummaryTotal] = useState<number | null>(null)

  const submitRef = useRef<(() => void) | null>(null)
  const [nextDisabled, setNextDisabled] = useState(true)
  const [maxReachedStep, setMaxReachedStep] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1000)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" }) }, [screen])

  // Reset state when screen changes
  useEffect(() => {
    submitRef.current = null
    setNextDisabled(screen === "service")
  }, [screen])


  // Sync browser back button with wizard screens
  useEffect(() => {
    window.history.replaceState({ ...window.history.state, screen: "service" }, "")

    const handlePop = (e: PopStateEvent) => {
      if (e.state?.screen) setScreen(e.state.screen as Screen)
    }

    window.addEventListener("popstate", handlePop)
    return () => window.removeEventListener("popstate", handlePop)
  }, [])

  const navigateTo = (next: Screen) => {
    window.history.pushState({ screen: next }, "")
    setScreen(next)
  }

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

  const iconOnly   = variations.length > 0 && variations.every(v => v === "icon")
  const hasNonIcon = variations.some(v => v !== "icon")

  let flowKey = "default"
  if (serviceType === "redesign") flowKey = "redesign"
  else if (serviceType === "design" && iconOnly && !hasNonIcon) flowKey = "design_icon"
  else if (serviceType === "design" && (hasNonIcon || variations.length === 0)) flowKey = "design_other"

  const steps   = FLOW_STEPS[flowKey] || FLOW_STEPS.default
  const stepMap = SCREEN_STEP[screen] || {}
  const stepIdx = stepMap[flowKey] ?? stepMap["default"] ?? 0

  // Track the furthest step ever reached so going back doesn't wipe progress
  useEffect(() => {
    setMaxReachedStep(prev => Math.max(prev, stepIdx))
  }, [stepIdx])

  const nextLabel = screen === "style-icon"
    ? (variations.every(v => v === "icon") ? "Next — Colors" : "Next — Typography")
    : NEXT_LABEL[screen]

  const order: Order = { serviceType, variations, ...companyInfo, ...styleInfo, ...uploadInfo, ...colorInfo, ...typographyInfo }

  const estimatedTotal = liveSummaryTotal ?? (150 + Math.max(0, liveVariations.length - 1) * 25 + liveTypoPrice)

  return (
    <div className="lc-root">

      {/* Main content */}
      <main className="lc-main">
        <div className="lc-main__inner">

          {screen === "service" && (
            <ServiceSelection submitRef={submitRef} setNextDisabled={setNextDisabled}
              initialValue={serviceType}
              onSelect={type => { setServiceType(type); navigateTo(type === "design" ? "brand-info" : "upload") }} />
          )}

          {screen === "brand-info" && (
            <BrandInfoScreen submitRef={submitRef} onBack={() => window.history.back()} initialValue={companyInfo} onNext={info => { setCompanyInfo(info); navigateTo("variations") }} />
          )}

          {screen === "upload" && (
            <UploadScreen submitRef={submitRef} onBack={() => window.history.back()} initialValue={uploadInfo} initialFile={files.logo} onNext={info => { setUploadInfo(info); setFiles(prev => ({ ...prev, logo: info.file || null })); navigateTo("style-red") }} />
          )}

          {screen === "style-red" && (
            <StylePickerScreen submitRef={submitRef} onBack={() => window.history.back()} initialValue={{ styles: styleInfo.styles ?? [], pinterestUrl: styleInfo.pinterestUrl ?? "" }} onNext={info => { setStyleInfo(info); setFiles(prev => ({ ...prev, inspiration: info.inspirationFile })); navigateTo("variations") }} />
          )}

          {screen === "variations" && (
            <VariationsScreen submitRef={submitRef} onBack={() => window.history.back()}
              initialValue={variations}
              onChange={vars => setLiveVariations(vars)}
              onNext={vars => {
                setVariations(vars)
                setLiveVariations(vars)
                if (serviceType === "redesign") {
                  navigateTo(vars.every(v => v === "icon") ? "colors" : "typography")
                } else {
                  navigateTo("style-icon")
                }
              }} />
          )}

          {screen === "style-icon" && (
            <StylePickerScreen submitRef={submitRef}
              onBack={() => window.history.back()}
              initialValue={{ styles: styleInfo.styles ?? [], pinterestUrl: styleInfo.pinterestUrl ?? "" }}
              onNext={info => { setStyleInfo(info); setFiles(prev => ({ ...prev, inspiration: info.inspirationFile })); navigateTo(variations.every(v => v === "icon") ? "colors" : "typography") }}
            />
          )}

          {screen === "typography" && (
            <TypographyScreen submitRef={submitRef} serviceType={serviceType} selectedVariations={variations}
              onBack={() => window.history.back()}
              initialValue={typographyInfo}
              onChange={(type, price) => setLiveTypoPrice(type === "custom" ? price : 0)}
              onNext={info => { setTypoInfo(info); setLiveTypoPrice(info.typographyType === "custom" ? (info.customPrice ?? 0) : 0); navigateTo("colors") }}
            />
          )}

          {screen === "colors" && (
            <ColorPickerScreen submitRef={submitRef} serviceType={serviceType}
              onBack={() => window.history.back()}
              initialValue={colorInfo.colorFamilies ? { colorFamilies: colorInfo.colorFamilies, customColors: colorInfo.customColors ?? [], useSameColors: colorInfo.useSameColors ?? false } : undefined}
              onNext={info => { setColorInfo(info); navigateTo("summary") }}
            />
          )}

          {screen === "summary" && (
            <SummaryScreen order={order} onBack={() => window.history.back()} files={files} onPriceChange={setLiveSummaryTotal} />
          )}
        </div>
      </main>

      {/* Sticky footer: progress + price + next */}
      <div className={`lc-footer${isMobile ? " lc-footer--mobile" : ""}`}>
        {isMobile ? (
          <div className="lc-footer__mobile-col">
            <ProgressBar steps={steps} current={stepIdx} maxReached={maxReachedStep}
              onStepClick={i => { const target = STEP_SCREEN[flowKey]?.[i]; if (target) navigateTo(target) }}
            />
            <div className="lc-footer__actions-row">
              <div className="lc-price">
                <span className="lc-price__label">Estimate</span>
                <span className="lc-price__amount">${estimatedTotal}</span>
                {variations.length > 1 && (
                  <span className="lc-price__extras">
                    +${(variations.length - 1) * 25}
                  </span>
                )}
              </div>
              {nextLabel && (
                <Button onClick={() => submitRef.current?.()} disabled={nextDisabled} size="md"
                  icon={<svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}>
                  {nextLabel}
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="lc-footer__desktop-row">
            <div className="lc-footer__progress-wrap">
              <ProgressBar steps={steps} current={stepIdx} maxReached={maxReachedStep}
                onStepClick={i => { const target = STEP_SCREEN[flowKey]?.[i]; if (target) navigateTo(target) }}
              />
            </div>
            <div className="lc-price">
              <span className="lc-price__label">Estimate</span>
              <span className="lc-price__amount">${estimatedTotal}</span>
              {variations.length > 1 && (
                <span className="lc-price__extras lc-price__extras--desktop">
                  +${(variations.length - 1) * 25} extras
                </span>
              )}
            </div>
            {nextLabel && (
              <Button onClick={() => submitRef.current?.()} disabled={nextDisabled} size="lg"
                icon={<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}>
                {nextLabel}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
