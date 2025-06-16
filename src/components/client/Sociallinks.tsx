import "./SocialLinks.css";
import Image from "next/image";
import Link from "next/link";
export default function Social() {
  return (
    <div>
      <div className="socialWrapperCards">
        <Link
          href={"http://instagram.com/niko_dola"}
          className="socialWrapperCard"
        >
          <Image
            src={"/icons/social_instagram.svg"}
            width={60}
            height={60}
            alt="instagram icon"
          />
          <h3>Iconography & Typography</h3>
          <p>
            I share icons, lettering, and some illustrations — mostly just for fun and visual exploration.
            </p>
        </Link>
        <Link
          href={"https://www.behance.net/nikodola?"}
          className="socialWrapperCard"
        >
          <Image
            src={"/icons/social_behance.svg"}
            width={60}
            height={60}
            alt="behance icon"
          />
          <h3>Branding & User Interface</h3>
          <p>
             I post full brand identities and soon, UI projects too. Not super active yet, but more is coming.
          </p>
        </Link>
                <Link
          href={"https://github.com/NikoDola"}
          className="socialWrapperCard"
        >
          <Image
            src={"/icons/social_github.svg"}
            width={60}
            height={60}
            alt="github icon"
          />
          <h3>Software Dvelopment</h3>
          <p>
This is where I commit code. Many projects are private for now, but it&apos;s my main dev space.
          </p>
        </Link>
                        <Link
          href={"https://stock.adobe.com/contributor/207890119/nikodola"}
          className="socialWrapperCard"
        >
          <Image
            src={"/icons/social_adobestock.svg"}
            width={60}
            height={60}
            alt="github icon"
          />
          <h3>Stock art work</h3>
          <p>
        I upload design assets I&apos;ve built over time — over 1,000 so far. It&apos;s a side hustle I enjoy when I find the time.

          </p>
        </Link>
      </div>
      <div className="otherLinksWrapper">
        <h2>Other Links</h2>
        <Link href={"https://www.youtube.com/@Niko_Dola"}>
         <Image src={"/icons/social_youtube.svg"} width={40} height={40} alt="youtube"></Image>
        </Link>
          <Link href={"https://www.linkedin.com/in/nikola-dolovski-b932b0ba?originalSubdomain=mk"}>
         <Image src={"/icons/social_linkedin.svg"} width={40} height={40} alt="linkedin"></Image>
        </Link>
                  <Link href={"https://dribbble.com/NikoDOla"}>
         <Image src={"/icons/social_dribbble.svg"} width={40} height={40} alt="dribbble icon svg"></Image>
        </Link>
                          <Link href={"https://dribbble.com/https://www.shutterstock.com/g/niko+dola"}>
         <Image src={"/icons/social_shutterstock.svg"} width={40} height={40} alt="shutterstock icon svg"></Image>
        </Link>
      </div>
    </div>
  );
}
