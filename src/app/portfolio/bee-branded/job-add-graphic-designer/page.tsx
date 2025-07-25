import Image from "next/image";
import "@/app/_styles/pages/portfolio-single.css";
export default function PortfolioPost() {
  return (
    <section className="section-regular portfolioSectionWrapper">
      <div className="headLineWrapper">
        <h1 className="headline">Employment Add</h1>
        <p className="tagline">Bee Branded – Connecting Talent with Purpose</p>
      </div>
      <div className="textImageWrapper1">
        <div className="descriptionWrapperOne">
          <h2 className="headline2">About BeeBranded</h2>
          <p>
            Bee Branded is a creative matchmaking agency that connects clients with the right digital professionals — whether it’s a
            designer, developer, or full creative team. Think of it like a dating app, but for work: our job is to pair you with the perfect
            creative or tech partner based on your project’s needs, brand guidelines, and working style. With over 15 years of experience in
            branding, design, and digital development, our team understands the reality — no single designer or developer can master every
            skill. That’s why we use our deep industry knowledge to carefully select the right specialists for your project. We don’t just
            fill roles — we make sure you’re working with someone who understands your vision and can bring it to life, the right way. At
            Bee Branded, it’s not about outsourcing blindly. It’s about thoughtful curation. You focus on your goals — we’ll make sure the
            right people help you reach them.
          </p>
        </div>
        <div className="imageWrapper">
          <Image
            src={"/portfolio/bee-branded/graphic-design_add/graphic-design_job-add-feed.webp"}
            width={300}
            height={400}
            alt="bee branded graphic design employee add"
          />
        </div>
      </div>
      <div className="textImageWrapper2">
        <div className="descriptionWrapperOne">
          <h2 className="headline2">The feel</h2>
          <p>
            This ad was created as part of a brand guideline for a creative agency.
            <br /> <br />
            The design combines playful elements like hand-drawn sketches and icons with bold, clean typography to clearly communicate the
            job role.
            <br /> <br />
            The central figure, a classic graphic designer, adds a premium and confident tone that makes it clear the position is not for a
            junior.
            <br />
            Despite the varied text styles, the layout keeps the message easy to read. The mix of fun visuals with a polished look reflects
            the agency’s creative edge while signaling the search for a skilled, experienced designer.
          </p>
        </div>
        <div className="imageWrapper">
          <Image
            src={"/portfolio/bee-branded/graphic-design_add/graphic-design_job-add-feed.webp"}
            width={300}
            height={400}
            alt="bee branded graphic design employee add"
          />
        </div>
      </div>
    </section>
  );
}
