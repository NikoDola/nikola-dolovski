import "./about.css"
import AboutHero from "@/components/sections/AboutHero"
import SkillsSection from "@/components/sections/SkillsSection"

export default function AboutPage() {
  return (
    <main className="aboutPage">

      {/* General about */}
      <AboutHero />

      {/* Skills */}
      <section className="aboutSection section-regular">
        <span className="aboutSection__tag">Skills</span>
        <h2>Tools &amp; Technologies</h2>
        <SkillsSection />
      </section>

      {/* Contest Winner */}
      <section id="contest-winner" className="aboutSection section-regular">
        <span className="aboutSection__tag">Recognition</span>
        <h2>350 Contest Wins</h2>
        <p>
          Competing on global design platforms, I have accumulated over 350 contest wins across
          branding, logo design, and visual identity projects. Each win represents a client brief,
          a creative challenge, and a design that stood out in a competitive field.
          These competitions sharpened my ability to deliver high-impact work under tight constraints
          and gave me exposure to a wide range of industries and audience expectations.
        </p>
        <div className="aboutSection__grid">
          <div className="aboutSection__card">
            <span className="aboutSection__cardNum">350+</span>
            <span className="aboutSection__cardLabel">Contest Wins</span>
          </div>
          <div className="aboutSection__card">
            <span className="aboutSection__cardNum">Top 1%</span>
            <span className="aboutSection__cardLabel">Designer Ranking</span>
          </div>
          <div className="aboutSection__card">
            <span className="aboutSection__cardNum">Global</span>
            <span className="aboutSection__cardLabel">Platform Presence</span>
          </div>
        </div>
      </section>

      {/* Experience */}
      <section id="experience" className="aboutSection aboutSection--dark section-full">
        <div className="section-regular">
          <span className="aboutSection__tag aboutSection__tag--light">Experience</span>
          <h2>14 Years in the Field</h2>
          <p>
            My career spans over a decade of work across branding, UI/UX design, and front-end development.
            I have built brand identities from scratch, redesigned legacy products, and shipped production-ready
            web applications using modern stacks including Next.js, React, TypeScript, and Tailwind CSS.
          </p>
          <div className="timeline">
            <div className="timeline__item">
              <span className="timeline__year">2010</span>
              <div className="timeline__content">
                <h4>Started in Graphic Design</h4>
                <p>Began with print and identity design, working with local businesses and agencies.</p>
              </div>
            </div>
            <div className="timeline__item">
              <span className="timeline__year">2014</span>
              <div className="timeline__content">
                <h4>Moved into Digital and UI/UX</h4>
                <p>Expanded into digital product design, user research, and interface prototyping.</p>
              </div>
            </div>
            <div className="timeline__item">
              <span className="timeline__year">2018</span>
              <div className="timeline__content">
                <h4>Added Web Development</h4>
                <p>Started building and shipping full web products, bridging the gap between design and code.</p>
              </div>
            </div>
            <div className="timeline__item">
              <span className="timeline__year">Now</span>
              <div className="timeline__content">
                <h4>Full-Stack Brand Building</h4>
                <p>Working with clients globally on brand strategy, identity systems, and web platforms.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
  )
}
