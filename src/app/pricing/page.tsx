import { readFileSync } from "fs"
import path from "path"
import type { PricingData } from "@/app/api/pricing/route"
import { PricingForm } from "./PricingForm"
import "./page.css"

function getPricing(): PricingData {
  try {
    return JSON.parse(readFileSync(path.join(process.cwd(), "src/data/pricing.json"), "utf-8"))
  } catch {
    return { hourlyRate: 25, categories: [] }
  }
}

export default function PricingPage() {
  const pricing = getPricing()
  return (
    <main className="prc">
      <section className="prc__hero">
        <h1 className="prc__heroTitle">Pricing</h1>
        <p className="prc__heroSub">Select what you need and get an instant estimate.</p>
      </section>
      <PricingForm pricing={pricing} />
    </main>
  )
}
