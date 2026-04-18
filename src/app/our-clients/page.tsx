import "./clients.css"

const clients = [
  { name: "Freaky", industry: "Fashion and Lifestyle", description: "Full brand identity, visual guidelines, and packaging design for an urban fashion brand targeting Gen Z." },
  { name: "Bee Branded", industry: "Marketing Agency", description: "Ongoing graphic design support, social media assets, and recruitment campaign materials." },
  { name: "GMunchies", industry: "Food and Vending", description: "Complete brand system including mascot illustration, icon library, business cards, and logo suite." },
  { name: "Horny Rhino", industry: "Lifestyle / Bar", description: "Brand identity, mood boarding, and packaging design for a premium lifestyle label." },
  { name: "Vexel", industry: "Technology", description: "Logo design, brand guidelines, UI kit, and website design for a tech startup." },
  { name: "Charging Rhino", industry: "E-Commerce", description: "Next.js storefront, UI design, and brand touchpoints for an online retail brand." },
]

export default function ClientsPage() {
  return (
    <main className="clientsPage">
      <section className="clientsHero section-full">
        <div className="section-regular clientsHero__inner">
          <span className="clientsTag">Partners</span>
          <h1 className="clientsTitle">130 Partners and Counting</h1>
          <p className="clientsSub">
            Over the years I have worked with a wide range of clients, from early-stage startups to
            established businesses. Every project is a partnership built on trust, clarity, and shared goals.
          </p>
        </div>
      </section>

      <section className="clientsGrid section-regular">
        {clients.map((c) => (
          <div key={c.name} className="clientCard">
            <div className="clientCard__header">
              <h3 className="clientCard__name">{c.name}</h3>
              <span className="clientCard__industry">{c.industry}</span>
            </div>
            <p className="clientCard__desc">{c.description}</p>
          </div>
        ))}
      </section>

      <section className="clientsCta section-full">
        <div className="section-regular clientsCta__inner">
          <h2>Want to work together?</h2>
          <p>I am always open to new collaborations. Drop a message and let&apos;s talk.</p>
          <a href="/contact" className="clientsCta__btn">Get in Touch</a>
        </div>
      </section>
    </main>
  )
}
