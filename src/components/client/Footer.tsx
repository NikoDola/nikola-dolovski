import "./Footer.css"
import Link from "next/link"
import Image
 from "next/image"
export default function Footer(){
  return(
    <div className="footerWrapper">
           <div className="otherLinksWrapper">
        <h4>Other Links</h4>
        <div className="socialIconsWrapper">
          <Link
            href="https://www.youtube.com/@Niko_Dola"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/icons/social_youtube.svg"
              width={40}
              height={40}
              alt="youtube"
            />
          </Link>

          <Link
            className="socialIcon"
            href="https://www.linkedin.com/in/nikola-dolovski-b932b0ba?originalSubdomain=mk"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/icons/social_linkedin.svg"
              width={40}
              height={40}
              alt="linkedin"
            />
          </Link>

          <Link
            href="https://dribbble.com/NikoDOla"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/icons/social_dribbble.svg"
              width={40}
              height={40}
              alt="dribbble icon svg"
            />
          </Link>

          <Link
            href="https://www.shutterstock.com/g/Niko+Dola"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/icons/social_shutterstock.svg"
              width={40}
              height={40}
              alt="shutterstock icon svg"
            />
          </Link>
        </div>
      </div>
      <div className="copyrights">Copyrights Niko Dola 2025</div>
    </div>
  )
}