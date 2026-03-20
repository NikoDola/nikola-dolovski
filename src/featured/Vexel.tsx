"use client";

import Image from "next/image";
import "./Vexel.css"

export default function Vexel() {
  return (
    <main>
      <section className="section-regular">
        <h1>Vexel</h1>

        <div className="content">
          <p>Brand guidelines</p>
          <ul>
            <li>
              Logo
              <ul>
                <li>Symbol</li>
                <li>Symbol Aspect Ratio</li>
                <li>Symbol Save Zone</li>
                <br />
                <li>Text-Logo</li>
                <li>Text-Logo Aspect Ratio</li>
                <li>Text-Logo Save Zone</li>
                <br />
              </ul>
            </li>
          </ul>
        </div>
      </section>

      <section className="section-regular mission-vision_wrapper ">
        <h2>Mission & Vission</h2>
        <div className="mission-wrapper">
          <h3>Mission</h3>
          <p className="vision-body">
            Vexel’s mission is to make image processing fast, simple, and accessible, giving users the power to compress and upscale images
            with high quality, without relying on heavy software or internet connection. The goal is to deliver a smooth, local-first
            experience where anyone can improve their images in seconds.
          </p>
        </div>
        <div className="mission-wrapper">
          <h3>Vision</h3>
          <p className="mission-body">
            Vexel aims to become a go-to tool for fast image editing, where quality, speed, and simplicity come together in one lightweight
            app. The vision is to replace slow, complex workflows with a direct and efficient solution that works instantly, anytime,
            anywhere.
          </p>
        </div>
      </section>

      <section className=" section-regular  section-main-wrapper">
        <h2>Logo</h2>
        <Image src={"/portfolio/vexel/section-1_logo.svg"} width={300} height={300} alt=" vexel logo versions" className="my-work_img" />
      </section>
      <section className="section-regular">
        <h3>Symbol</h3>
        <p>
          Symbol Concept The Vexel symbol is built from three simple geometric shapes forming an abstract fox, using orange and white for
          strong contrast and clarity.
          <br />
          <br />
          The shape also creates a clear &quot;V&quot; form, directly connecting the symbol to the name Vexel.
          <br />
          <br />
          The fox represents speed, intelligence, and precision, matching how Vexel works. It processes images fast, keeps quality, and
          avoids unnecessary complexity. Just like a fox, the app is efficient and focused, doing more with less.
          <br />
          <br />
          The sharp shapes reflect pixel structure, while the symmetry keeps the symbol clean and balanced.
          <br />
          <br />
          The symbol is designed to be used inside a defined background, either a square app icon or a circular container. It should not be
          placed directly on random backgrounds. If needed, it must sit on its original background color to keep visibility and consistency.
        </p>
        <div className="logo-img_wrapper">
        <Image
          src={"/portfolio/vexel/section-2_logo-symbol.svg"}
          width={300}
          height={300}
          alt="vexel logo symbol process"
          className="my-work_img"
        />


        </div>
      </section>

      <section className="section-regular">
        <h3>Symbol Aspect Ratio</h3>
        <p>
          The logo uses a 1:1 ratio to stay balanced and easy to use everywhere. A square fits perfectly for app icons and UI, keeps the fox
          centered, and makes sure it looks clean at any size.
        </p>
        <Image
          src={"/portfolio/vexel/section-3_logo-symbol-aspect-ratio.svg"}
          width={300}
          height={300}
          alt="vexel logo symbol process"
          className="my-work_img"
        />
      </section>
      <section className="section-regular">
        <h3>Symbol Safe Zone</h3>
        <p>
          Step 1 Select the top center anchor point (red point) of the logo.
          <br />
          Step 2 Cut the shape vertically from that point to isolate one side of the fox.
          <br />
          Step 3 Use the extracted shape as a reference unit.
          <br />
          Step 4 Apply this shape around the logo to define the safe zone spacing.
        </p>
        <Image
          src={"/portfolio/vexel/section-4_logo-symbol-safe-zone.svg"}
          width={300}
          height={300}
          alt="vexel logo symbol process"
          className="my-work_img"
        />
      </section>
          <section className="section-regular">
          <h3>Symbol Minimal Scale</h3>
          <p>The icon is optimized for clarity at small sizes.
          On light backgrounds, the minimum size is 22px to maintain shape definition.
          On dark backgrounds, higher contrast allows the icon to scale down to 16px while 
          remaining clear and recognizable.</p>
        <Image
          src={"/portfolio/vexel/section-5_logo-symbo_scale.svg"}
          width={300}
          height={300}
          alt="vexel logo symbol process"
          className="my-work_img"
        />
      </section>
    </main>
  );
}
