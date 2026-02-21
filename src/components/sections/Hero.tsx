import "./Hero.css"
import HalfLogo from "@/components/ui/HalfLogo"
import Image from "next/image"
import Globe from "@/components/ui/Globe"
export default function Hero(){
  return(
    <section className="hrWrapper">
      <div className="hrChild left">
        <HalfLogo className="logo" />
        {/* Text/Content goes here */}
      </div>
      
      <div className="hrChild right">
          <Image 
          src="/images/personal/finger.webp" 
          width={500} 
          height={1250} 
          alt="finger" 
          className="heroImage" 
          priority 
          style={{ objectFit: 'contain', objectPosition: 'bottom left' }}
        />
        
      
        
        <Globe />
        
        <Image 
          src="/images/personal/base.webp" 
          width={500} 
          height={1250} 
          alt="base" 
          className="heroImage" 
          priority 
          style={{ objectFit: 'contain', objectPosition: 'bottom left' }}
        />

        <div className="colorLayer"></div>

        <Image 
          src="/images/personal/shadow.webp" 
          width={500} 
          height={1250} 
          alt="shadow" 
          className="heroImage shadow" 
          priority 
          style={{ objectFit: 'contain', objectPosition: 'bottom left' }}
        />

        <Image 
          src="/images/personal/highlight.webp" 
          width={500} 
          height={1250} 
          alt="highlight" 
          className="heroImage highlight" 
          priority 
          style={{ objectFit: 'contain', objectPosition: 'bottom left' }}
        />
        
        <span className="dummy-text">ee</span>
      </div>
    </section>
  )
}