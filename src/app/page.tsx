"use client"
import { useState } from "react"
import Skills from "@/components/Skills"

import Loading from "@/components/ui/Loading"
import ContactForm from "@/components/client/ContactForm"
import Footer from "@/components/client/Footer"
import Portfolio from "@/components/client/Portfolio"


export default function Home() {
  const [isSkillsLoading, setSkillsLoading] = useState(true)
  
  return (
    <main>
 
   
      {isSkillsLoading  && <Loading />}

      {/* Skills Section */}
      <section 
        className="heroSection" 
        style={{ 
          opacity: isSkillsLoading ? 0 : 1,
          transition: 'opacity 0.3s ease',
          pointerEvents: isSkillsLoading ? 'none' : 'auto'
        }}
      >
        <h2 className="text-center mb-[8rem]">My Skills</h2>
        <Skills onLoadComplete={() => setSkillsLoading(false)} />
      </section>

        <section className="section-regular">
          <h2>My Work</h2>
          <Portfolio/>
        </section>
             <section className="section-regular">
        <ContactForm />
      </section>
      <footer>
        <Footer />
      </footer>

    </main>
  )
}