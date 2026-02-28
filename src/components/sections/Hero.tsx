import Image from "next/image";
import "./Hero.css";


export default function Hero() {
  return (
    <div>
      <div className="imgWrapper">
        <Image src="/images/personal/half-logo.svg" width={300} height={300} alt="niko-dola logo" className="logo__half" />

        <div className="imageContainer">
          <div className="niko__image">
            <Image src="/images/personal/finger.webp" width={300} height={300} alt="niko dola" className="images finger" priority />
            <Image src="/images/personal/base.webp" width={300} height={300} alt="niko dola" className="images base" priority/>
            <Image src="/images/personal/shadow.webp" width={300} height={300} alt="niko dola" className="images highlight" priority />
            <div className="color__mask"></div>
            <Image src="/images/personal/highlight.webp" width={300} height={300} alt="niko dola" className="images shadow" priority/>
           
          </div>
          <div className="textWrapper">
            <p className="beforeHr">Quiet brands speak the loudest.</p>
            <h1 className="hrHeadline">NIKO DOLA</h1>
            <button>Get in touch</button>
          </div>
         
          <div onClick={()=> alert('hello')} className="globe"></div>
          <div className="globe2"></div>
        </div>
      </div>
      <div className="other__section"></div>
    </div>
  );
}
