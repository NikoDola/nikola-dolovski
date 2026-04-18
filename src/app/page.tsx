import Hero from "@/components/sections/Hero"
import Results from "@/components/sections/Results"
import HomePortfolio from "@/components/sections/HomePortfolio"
import staticProjects from "@/data/projects.json"
import type { Project } from "@/types/project"

export default function Home() {
  return (
    <main>
      <Hero />
      <Results />
      <HomePortfolio defaultProjects={staticProjects as Project[]} />
    </main>
  )
}
