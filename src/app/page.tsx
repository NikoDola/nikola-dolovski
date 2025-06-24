
// import ChatGPT from "@/components/client/ChatGPT"
import Skills from "@/components/Skills"
import SocialLinks from "@/components/client/Sociallinks"
export default function Home(){
  return(
    <main>
      <section className="heroSection">
        <h2 className="text-center mb-[4rem]">My Skills</h2>
        <Skills />
      </section>

      <section className="section-regular ">
        <h2>Portfolio</h2>
        <p className="mb-8"> Lot more items comming soon! </p>
        <SocialLinks />
      </section>
    </main>
  )
}