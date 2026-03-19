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
        {/* <div className="statusWrapper">
          <p className="beforeHr">Currently Avaible</p>
          <div className="hrStatusLight"></div>
        </div> */}

        <h1 className="hrHeadline">
          NIKO <br /> DOLA
        </h1>

        <p className="afterHr">Branding, UI/UX & Web Devoloper</p>
        <div className="buttonWrapper">
          <a className="ctaButton download__CV" href="/documents/Nikola-Dolovski_CV.pdf" download="My_Custom_Name.pdf">
            <span>Download CV</span>

          </a>
          <button className="ctaButton get__in__touch">
            <span>Get in Touch</span>
          
          </button>
        </div>
      </div>
    </section>
  );
}
