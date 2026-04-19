import Link from "next/link"
import Image from "next/image"
import staticProjects from "@/data/projects.json"
import type { Project } from "@/types/project"
import "./portfolio.css"

const projects = (staticProjects as Project[]).filter(
  (p) => p.images && p.images.length > 0
)

export default function PortfolioPage() {
  return (
    <main className="portfolioPage">
      <div className="portfolioPage__header section-regular">
        <span className="portfolioPage__tag">Work</span>
        <h1 className="portfolioPage__title">Portfolio</h1>
        <p className="portfolioPage__sub">
          500+ projects completed across branding, UI/UX, and web development.
          Here is a selection of the work I am most proud of.
        </p>
      </div>

      <div className="portfolioGrid section-regular">
        {projects.map((p) => (
          <Link key={p.slug} href={p.href} className="portfolioCard">
            <div className="portfolioCard__img-wrap">
              <Image
                src={p.thumbnails[0]}
                alt={p.name}
                fill
                className="portfolioCard__img"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="portfolioCard__info">
              <span className="portfolioCard__category">
                {p.services.slice(0, 2).join(", ")}
              </span>
              <h3 className="portfolioCard__title">{p.name}</h3>
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}
