import Image from "next/image"
import "@/components/pages/freaky.css"

export default function Freaky() {
  return (
    <section className="frkSection">
      <h1 className="frkHeadline">Freaky 😜</h1>

      <p className="frkBody">
        I got a call from my neighbor who told me they were starting a fun new
        brand - they&apos;ll be selling pajamas with colorful, freaky patterns,
        and the brand name is <strong>Freaky</strong>! They were stuck with the
        logo and said they just couldn&apos;t create a fun, minimal design that
        really represents their brand.
      </p>

      <div className="frkSectionWrapper">
        <div className="frkTextWrapper">
          <h3 className="frkHeadline2">The Logo</h3>
          <p>
            So we set up a meeting. She came with her two partners and explained
            more about the brand - what they sell and what kind of character it
            has. We sat down to design the logo. I picked a font I liked, typed the
            name, and while staring at it, I noticed something funny - inside the
            text I could see a little face! 👀 I added circles inside the
            <strong> &quot;e&quot; </strong>and <strong> &quot;o&quot;</strong>,
            but at first, it looked like the character was looking down. So I
            adjusted the eyes to look a bit off-center, added a small smile below,
            and suddenly the text turned into a playful, freaky little face 😁.
          </p>
        </div>

        <div className="frkImageWrapper">
          <figure>
            <Image
              src="/portfolio/freaky/img-01.jpg"
              alt="Freaky logo variations"
              width={800}
              height={400}
              className="blogImage"
            />
            <figcaption>The Freaky logo - text, eyes, and full version</figcaption>
          </figure>
        </div>
      </div>

      <div className="frkSectionWrapper frkReverse">
        <div className="frkTextWrapper">
          <h3 className="frkHeadline2">The Duckies</h3>
          <p>
            Stefan, one of the partners, told me more about their patterns. I said
            I&apos;d love to see one of my designs printed on their pajamas -
            especially if the pattern was integrated right into the fabric itself.
            I showed him a few fun ideas for patterns, but he thought some were a
            bit too adult 😂. Then he said, &quot;I saw your duckies - I love them!
            We should use those for our pattern.&quot;
          </p>

          <p>
            At first, I hesitated since I was thinking about selling those as NFTs,
            but after some thought (and keeping everything clear and official 😉), I
            agreed. He asked for a few, and I said, &quot;Why not take them all?&quot;
            That way, the pajamas would look even more unique and full of character.
            We worked together on the colors and finally settled on a bright orange
            design.
          </p>
        </div>

        <div className="frkImageWrapper">
          <figure>
            <Image
              src="/portfolio/freaky/img-02.jpg"
              alt="The duckies pattern"
              width={800}
              height={400}
              className="blogImage"
            />
            <figcaption>The duckies pattern</figcaption>
          </figure>
        </div>
      </div>

      <div className="frkSectionWrapper">
        <div className="frkTextWrapper">
          <h3 className="frkHeadline2">The Pattern</h3>
          <p>
            Four years later, while I was working on another project, I needed a
            co-working space. I found one just five minutes from my house, and
            guess what - I met one of the Freaky partners there again! I was really
            happy to see how active they were on social media and how their pajamas
            were featured in fancy cafes ☕.
          </p>
        </div>

        <div className="frkImageWrapper">
          <figure>
            <Image
              src="/portfolio/freaky/img-03.jpg"
              alt="Freaky orange pattern"
              width={800}
              height={400}
              className="blogImage"
            />
            <figcaption>The final orange pattern we chose together</figcaption>
          </figure>
        </div>
      </div>

      <div className="frkSectionWrapper frkReverse">
        <div className="frkTextWrapper">
          <h2>The Appearance</h2>
          <p>
            I couldn&apos;t be happier with the pajamas! I love the material, the
            pockets, and how comfortable they feel. Seeing my design printed on
            them made me so proud 🔥. I even wore them outside a few times - just to
            show them off to my friends and family 😄.
          </p>
        </div>

        <div className="frkImageWrapper">
          <figure>
            <Image
              src="/portfolio/freaky/img-04.jpg"
              alt="Freaky appearance - me wearing, packages, and AI preview"
              width={800}
              height={400}
              className="blogImage"
            />
            <figcaption>
              Me wearing the Freaky pajamas, packaging, and AI preview concepts
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  )
}
