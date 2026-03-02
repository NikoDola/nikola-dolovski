import Image from "next/image";
import "./Hero.css";

export default function Hero() {
  return (
    <section className="hero">
      <div className="imgWrapper">
        <Image src="/images/personal/half-logo.svg" width={300} height={300} alt="niko-dola logo" className="logo__half" />

        <div className="imageContainer">
          <div className="niko__image">
            <Image src="/images/personal/finger.webp" width={300} height={300} alt="niko dola" className="images finger" priority />
            <Image src="/images/personal/base.webp" width={300} height={300} alt="niko dola" className="images base" priority />
            <Image src="/images/personal/shadow.webp" width={300} height={300} alt="niko dola" className="images highlight" priority />
            <div className="color__mask"></div>
          </div>

          <div onClick={() => alert("hello")} className="globe"></div>
        </div>
      </div>
          <div className="textWrapper">
            <p className="beforeHr">Quiet brands speak the loudest.</p>
            <h1 className="hrHeadline">NIKO <br/> DOLA</h1>
            <button className="ctaButton">Get in touch</button>
          </div>
    </section>
  );
}
