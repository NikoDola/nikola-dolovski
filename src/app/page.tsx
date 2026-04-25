"use client"
import { useState } from "react"
import Skills from "@/components/Skills"
import Loading from "@/components/ui/Loading"
import UnderConstruction from "@/featured/UnderConstruction"

export default function Home() {
  const [isSkillsLoading, setSkillsLoading] = useState(true)

  return (
    <main>
      {isSkillsLoading && <Loading />}

      <section
        className="heroSection"
        style={{
          opacity: isSkillsLoading ? 0 : 1,
          transition: 'opacity 0.3s ease',
          pointerEvents: isSkillsLoading ? 'none' : 'auto'
        }}
      >
        <h2 className="text-center">My Skills</h2>
        <Skills onLoadComplete={() => setSkillsLoading(false)} />
      </section>

      <UnderConstruction />
    </main>
  )
}
