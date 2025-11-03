"use client"
import { useState } from "react"
import Skills from "@/components/Skills"
import SocialLinks from "@/components/client/Sociallinks"
import Loading from "@/components/ui/Loading"
import ContactForm from "@/components/ContactForm"
import Footer from "@/components/client/Footer"


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

      {/* Portfolio Section */}
      <section 
        className="section-regular"
       
      >
        <h2>Portfolio</h2>
        <p className="mb-8">More items coming soon!</p>
        <SocialLinks />
        <ContactForm />
      </section>
      <footer>
        <Footer />
      </footer>
    </main>
  )
}