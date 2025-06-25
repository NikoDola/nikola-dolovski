import Image from "next/image";
import Logo from "@/components/client/Logo";

export default function Skills() {
  return (
    <main>
      <section className="section-regular">
        <h1>My Skills</h1>
      </section>
    
      <section id="illustrator" className="section-regular">
        <h2 className="flex gap-8 item-end"> <Image src={"/components/skills/skills-icon_illustrator.svg"} width={35} height={35} alt="illustrator icon"/> Illustrator</h2>
        <p> 
          Adobe Illustrator was my gateway into digital design. Though I initially struggled coming from Photoshop, my passion for vector art and logo design made me persist. Now, I leverage its precision for everything from brand identities to complex illustrations, mastering bezier curves and the pen tool until they became second nature.
        </p>
      </section>

      <section id="photoshop" className="section-regular">
          <h2 className="flex gap-8 item-end"> <Image src={"/components/skills/skills-icon_photoshop.svg"} width={35} height={35} alt="Photoshop icon"/> Photoshop</h2>
        <p>
          My first professional design tool started as a playground for photo manipulation, but evolved into a versatile creative partner. Over 13+ years, I&apos;ve used Photoshop for everything from digital painting to UI mockups, developing deep expertise in non-destructive editing, compositing, and preparing perfect assets for any medium.
        </p>
      </section>

      <section id="figma" className="section-regular">
        <h2 className="flex gap-8 item-end"><Image src={"/components/skills/skills-icon_figma.svg"} width={35} height={35} alt="figma icon"/> Figma</h2>
        <p>
          Initially skeptical, Figma won me over completely. Its collaborative nature and powerful features like variables and auto-layout transformed my UI workflow. Now my go-to for interface design, I create comprehensive design systems where one change propagates beautifully across entire projects—a game changer for efficient, consistent design.
        </p>
      </section>

      <section id="aftereffects" className="section-regular">
        <h2 className="flex gap-8 item-end"><Image src={"/components/skills/skills-icon_aftereffects.svg"} width={35} height={35} alt="aftereffects icon"/> After Effects</h2>
        <p>
          After Effects added motion to my creative vocabulary. Mastering it not only brought my designs to life but unexpectedly improved my CSS/JS animation skills through understanding motion principles. From sleek UI animations to explainer videos, I love using AE to create engaging narratives through movement.
        </p>
      </section>

      <section id="premiere" className="section-regular">
        <h2 className="flex gap-8 item-end"><Image src={"/components/skills/skills-icon_premiere.svg"} width={35} height={35} alt="premiere icon"/> Premiere Pro</h2>
        <p>
          Though After Effects was my first love for video, Premiere Pro became essential for my YouTube channel and professional projects. I&apos;ve developed an efficient editing workflow for everything from social reels to long-form content, leveraging its powerful tools for color grading, multi-cam editing, and seamless integration with other Adobe apps.
        </p>
      </section>

      <section id="openai" className="section-regular">
        <h2 className="flex gap-8 item-end"><Image src={"/components/skills/skills-icon_openai.svg"} width={35} height={35} alt="openAI icon"/> OpenAI</h2>
        <p>
          ChatGPT has become my digital creative partner. Beyond just assistance, I&apos;ve created specialized agents for various tasks and developed global settings that make its output indistinguishable from human writing. I use it as a springboard for design inspiration and coding help—always cross-referencing with documentation to deepen my understanding.
        </p>
      </section>

      <section id="midjourney" className="section-regular">
        <h2 className="flex gap-8 item-end"><Image src={"/components/skills/skills-icon_midjourney.svg"} width={35} height={35} alt="midjourney icon"/> Midjourney</h2>
        <p>
          Combined with ChatGPT, Midjourney supercharges my creative process. I&apos;ve mastered prompt engineering to generate perfect references for illustrations, characters, and concepts. Constantly studying its evolving capabilities, I use it not as a crutch but as a collaborator that helps rapidly visualize ideas that would take days to sketch manually.
        </p>
      </section>

      <section  id="html" className="section-regular">
        <h2 className="flex gap-8 item-end"><Image src={"/components/skills/skills-icon_html.svg"} width={35} height={35} alt="HTML icon"/>HTML</h2>
        <p>
          My coding journey began with C++ and Python, but HTML&apos;s immediate visual feedback hooked me. While some dismiss it as simple, I&apos;ve discovered its hidden depths—semantic structure, accessibility features, and how it forms the foundation of every web experience. My philosophy: solve problems with HTML first, then CSS, and only then reach for JavaScript.
        </p>
      </section>

      <section id="css" className="section-regular">
        <h2 className="flex gap-8 item-end"><Image src={"/components/skills/skills-icon_css.svg"} width={35} height={35} alt="CSS icon"/> CSS</h2>
        <p>
          CSS transformed how I think about design. Where I once reached for Illustrator, I now visualize solutions in CSS first. Mastering animations, responsive layouts, and modern features like Grid and Flexbox has been revelatory. Tailwind CSS became my secret weapon for rapid prototyping and building maintainable design systems in CMS environments.
        </p>
      </section>
      <section id="canvas" className="section-regular">
        <h2 className="flex gap-8 item-end"><Image src={"/components/skills/skills-icon_canvas.svg"} width={35} height={35} alt="canvas icon"/> Canvas</h2>
        <p>
          What began as creating simple games for my nephew revealed Canvas API&apos;s incredible potential. I now use it for everything from interactive data visualizations to building a custom logo design tool. Its immediate visual feedback and programmatic drawing capabilities make it perfect for creative coding projects that need both precision and flair.
        </p>
      </section>

      <section id="js" className="section-regular">
        <h2 className="flex gap-8 item-end"><Image src={"/components/skills/skills-icon_js.svg"} width={35} height={35} alt="javascript icon"/> JavaScript</h2>
        <p>
          JavaScript opened a universe of interactive possibilities. From vanilla JS to modern frameworks, it lets me breathe life into designs. I particularly love working with requestAnimationFrame for buttery animations and the Canvas API for creative coding. JavaScript didn&apos;t just make me a better developer—it made me a better designer by expanding what&apos;s possible.
        </p>
      </section>

      <section id="react" className="section-regular">
        <h2 className="flex gap-8 item-end"><Image src={"/components/skills/skills-icon_react.svg"} width={35} height={35} alt="react icon"/> React</h2>
        <p>
          React revolutionized how I build for the web. After frustrating experiences with WordPress, its component-based architecture was liberating. I create reusable, maintainable UI systems that would be nightmares with traditional CMS tools. Combined with my design background, React lets me build exactly what I envision without compromise.
        </p>
      </section>

      <section id="next" className="section-regular">
        <h2 className="flex gap-8 item-end"><Image src={"/components/skills/skills-icon_next.svg"} width={35} height={35} alt="next.js icon"/> Next.js</h2>
        <p>
          Next.js is my foundation for every web project. Its file-based routing, server-side rendering, and API routes provide the perfect balance of power and simplicity. Whether building a marketing site or web app, Next.js gives me confidence that the solution will be performant, SEO-friendly, and scalable—without unnecessary complexity.
        </p>
        
      </section>
      <section id="firebase" className="section-regular">
        <h2 className="flex gap-8 item-end"><Image src={"/components/skills/skills-icon_firebase.svg"} width={35} height={35} alt="firebase icon"/>Firebase</h2>
        <p>
          As a designer who codes, Firebase bridges my frontend skills with backend needs. I&apos;ve built over 10 production apps with its authentication, Firestore, and hosting. While I plan to explore PostgreSQL, Firebase&apos;s real-time NoSQL database and generous free tier make it ideal for MVPs and projects where rapid iteration matters most.
        </p>
      </section>

            <section id="firebase" className="section-regular">
        <h2 className="flex gap-8 items-center"><Logo chat={false} size="35px" link="./" loadingState={false}/>Global</h2>
        <p>
          I&apos;ve always been deeply curious about how things work — especially in the digital world. That curiosity turned into a passion, and over the years, it pushed me to explore and learn a wide range of tools, software, and technologies. Whether it&apos;&apos; design, development, or automation, I dive in with focus and genuine interest. Every skill I&apos;ve picked up wasn&apos;t just a checkbox — it was part of a journey I truly enjoyed.
        </p>
      </section>
    </main>
  );
}