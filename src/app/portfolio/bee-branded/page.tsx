import Image from "next/image";
import "@/app/_styles/pages/portfolio-single.css"

export default function BeeBranded() {
  return (
    <section className="section-regular">
      <div className="headLineWrapper">
        <h1 className="headline">BeeBranded</h1>
        <p className="tagline">Connecting Talent with Purpose</p>
      </div>
      <div className="textImageWrapperOne">
        <div className="descriptionWrapperOne">
          <h2 className="headlineTwo">About BeeBranded</h2>
          <p>
            Bee Branded is a creative matchmaking agency 🤝 that connects clients with the right digital professionals 🎨💻👩‍💼. Whether you
            need a designer, a developer, or a full creative team, Bee Branded helps you find the perfect fit 🧩.
            <br />
            <br />
            Think of it like a dating app 💘, but for work. They match you based on your brand style, project goals, and how you like to
            collaborate 🤓.
            <br />
            <br />
            With over 15 years of experience in branding, design, and digital development 📊🎯, the Bee Branded team knows that no one
            person can do everything. So they use their know-how 🧠 to hand-pick the right specialists for every project 🔍.
            <br />
            <br />
            They don’t just connect people. They find creatives who actually get your vision 👁️ and bring it to life 🎨✨.
            <br />
            <br />
            Bee Branded does not believe in random outsourcing 🙅‍♂️. Every connection is intentional and focused on real results ✅. You take
            care of your vision 🚀 and they make sure the right people help you get there 💼🔥.
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
