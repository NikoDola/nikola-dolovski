import Link from "next/link"
import Image from "next/image"
import "./portfolio.css"

const projects = [
  {
    slug: "freaky",
    title: "Freaky",
    category: "Branding, Visual Identity",
    cover: "/portfolio/freaky/freaky-cover-pattern.webp",
    href: "/my-work/freaky",
  },
  {
    slug: "bee-branded",
    title: "Bee Branded",
    category: "Graphic Design, Social Media",
    cover: "/portfolio/bee-branded/graphic-design_add/graphic-design_job-add-feed.webp",
    href: "/my-work/bee-branded",
  },
  {
    slug: "gmunchies",
    title: "GMunchies",
    category: "Branding, Illustration",
    cover: "/portfolio/gmunchies/portfolio_logo.svg",
    href: "/my-work/gmunchies",
  },
  {
    slug: "horny-rhino",
    title: "Horny Rhino",
    category: "Brand Identity, Packaging",
    cover: "/portfolio/horny-rhino/mood-bord copy.jpg",
    href: "/my-work/horny-rhino",
  },
  {
    slug: "vexel",
    title: "Vexel",
    category: "Brand Identity, Web Design",
    cover: "/portfolio/vexel/section-6_logo-symbo_mockup-topaz-faceai-sharpen_AA.webp",
    href: "/my-work/vexel",
  },
]

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
                src={p.cover}
                alt={p.title}
                fill
                className="portfolioCard__img"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="portfolioCard__info">
              <span className="portfolioCard__category">{p.category}</span>
              <h3 className="portfolioCard__title">{p.title}</h3>
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}
