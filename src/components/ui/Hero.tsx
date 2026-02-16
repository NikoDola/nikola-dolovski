import "./Hero.css"
import Image from "next/image"
export default function Hero(){
  return(
    <section className="section-full heroWrapper">
      <div className="hrTextWrapper">
        <Image 
          src={"/images/personal/half-logo.svg"} 
          alt="niko dola" 
          width={800} 
          height={800}
          priority
          className="nikoLogo"
        />
        <div className="textWrapper">
        <p className="hrDescription">Branding & <br/> Web Designer</p>
        <h1 className="hrH1">NIKO <br/>DOLA</h1>
        </div>

      </div>
      <div className="imgWrapper">
      <Image 
        src={"/images/personal/half-image.webp"} 
        alt="niko dola" 
        width={800} 
        height={800}
        priority
        className="nikoImg"
        />

      </div>
    </section>
  )
}