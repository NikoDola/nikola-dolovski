"use client";
import Image from "next/image";
import "./Skills.css";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Data {
  description: string;
  name: string;
}

export default function HeroSection() {
  const [currentImage, setCurrentImage] = useState("niko-dola");
  const [currentText, setCurrentText] = useState(
    "I've always been deeply curious about how things work — especially in the digital world. That curiosity turned into a passion, and over the years, it pushed me to explore and learn a wide range of tools, software, and technologies. Whether it's design, development, or automation, I dive in with focus and genuine interest. Every skill I've picked up wasn't just a checkbox — it was part of a journey I truly enjoyed."
  );
  const [data, setData] = useState<Data[]>([]);
  const [color, setColor] = useState({ main: "#1e1e1e", alt: "#3ce5e5" });

  useEffect(() => {
    async function fetchData() {
      const response = await fetch("/components/skills/skills.json");
      const dataJson = await response.json();
      setData(dataJson);
    }
    fetchData();
  }, []);

  const handleImageAndText = (key: string) => {
    const item = data.find(
      (item) => item.name.toLowerCase() === key.toLowerCase()
    );
    if (item) {
      setCurrentText(item.description.slice(0, 150));
      setCurrentImage(item.name);
      if (key === "illustrator") setColor({ main: "#F7991C", alt: "#F7991C" });
      if (key === "photoshop") setColor({ main: "#101519", alt: "#2ECEE8" });
      if (key === "figma") setColor({ main: "#F27264", alt: "#53C0DD" });
      if (key === "aftereffects") setColor({ main: "#101519", alt: "#918FC6" });
      if (key === "premiere") setColor({ main: "#918FC6", alt: "#918FC6" });
      if (key === "openai") setColor({ main: "white", alt: "#74A89A" });
      if (key === "midjourney") setColor({ main: "black", alt: "white" });
      if (key === "HTML") setColor({ main: "#E24E26", alt: "#E24E26" });
      if (key === "CSS") setColor({ main: "#3555A5", alt: "#3555A5" });
      if (key === "canvas") setColor({ main: "#47B97E", alt: "#47B97E" });
      if (key === "JS") setColor({ main: "#F5DE17", alt: "#F5DE17" });
      if (key === "react") setColor({ main: "#101519", alt: "#2ECEE8" });
      if (key === "next") setColor({ main: "#101519", alt: "#101519" });
      if (key === "firebase") setColor({ main: "#DA3226", alt: "#FFC40D" });
    }
  };

  return (
    <div className="heroSectionWrapper">
      <div
        className="imagesWrapper"
        style={
          {
            "--after-background": color?.main,
            "--before-background": color?.alt,
          } as React.CSSProperties & { [key: string]: string }
        }
      >
        <div className="iconWrapper">
          <div className="designIcons">
            <p id="graphicDesign" className="skillsText">
              Graphic Design <b>▼</b>
            </p>

            <Image
              onClick={() => handleImageAndText("illustrator")}
              className="skillIcon"
              src={"/components/skills/skills-icon_illustrator.svg"}
              alt="Adobe Illustrator"
              width={30}
              height={30}
            />
            <div className="hrLine" />
            <Image
              onClick={() => handleImageAndText("photoshop")}
              className="skillIcon"
              src={"/components/skills/skills-icon_photoshop.svg"}
              alt="Adobe Photoshop"
              width={30}
              height={30}
            />
            <div className="hrLine" />
            <Image
              onClick={() => handleImageAndText("figma")}
              className="skillIcon"
              src={"/components/skills/skills-icon_figma.svg"}
              alt="Figma"
              width={30}
              height={30}
            />
            <div className="hrLine" />
            <Image
              onClick={() => handleImageAndText("aftereffects")}
              className="skillIcon"
              src={"/components/skills/skills-icon_aftereffects.svg"}
              alt="Adobe After Effects"
              width={30}
              height={30}
            />
            <div className="hrLine" />
            <Image
              onClick={() => handleImageAndText("premiere")}
              className="skillIcon"
              src={"/components/skills/skills-icon_premiere.svg"}
              alt="Adobe Premiere"
              width={30}
              height={30}
            />
            <div className="hrLine" />
            <Image
              onClick={() => handleImageAndText("openai")}
              className="skillIcon"
              src={"/components/skills/skills-icon_openai.svg"}
              alt="OpenAI"
              width={30}
              height={30}
            />
            <div className="hrLine" />
            <Image
              onClick={() => handleImageAndText("midjourney")}
              className="skillIcon"
              src={"/components/skills/skills-icon_midjourney.svg"}
              alt="Midjourney"
              width={30}
              height={30}
            />
          </div>
          <div className="codeIcons">
            <p  className="skillsText">
              Web Developer <b>▼</b>
            </p>

            <Image
              onClick={() => handleImageAndText("HTML")}
              className="skillIcon"
              src={"/components/skills/skills-icon_html.svg"}
              alt="HTML"
              width={30}
              height={30}
            />
            <div className="hrLine" />
            <Image
              onClick={() => handleImageAndText("CSS")}
              className="skillIcon"
              src={"/components/skills/skills-icon_css.svg"}
              alt="CSS"
              width={30}
              height={30}
            />
            <div className="hrLine" />
            <Image
              onClick={() => handleImageAndText("canvas")}
              className="skillIcon"
              src={"/components/skills/skills-icon_canvas.svg"}
              alt="Canvas"
              width={30}
              height={30}
            />
            <div className="hrLine" />
            <Image
              onClick={() => handleImageAndText("JS")}
              className="skillIcon"
              src={"/components/skills/skills-icon_js.svg"}
              alt="JavaScript"
              width={30}
              height={30}
            />
            <div className="hrLine" />
            <Image
              onClick={() => handleImageAndText("react")}
              className="skillIcon"
              src={"/components/skills/skills-icon_react.svg"}
              alt="React"
              width={30}
              height={30}
            />
            <div className="hrLine" />
            <Image
              onClick={() => handleImageAndText("next")}
              className="skillIcon"
              src={"/components/skills/skills-icon_next.svg"}
              alt="Next.js"
              width={30}
              height={30}
            />
            <div className="hrLine" />
            <Image
              onClick={() => handleImageAndText("firebase")}
              className="skillIcon"
              src={"/components/skills/skills-icon_firebase.svg"}
              alt="Firebase"
              width={30}
              height={30}
            />
          </div>
        </div>
        <div className="imageWrapper">
          <Image
            className="clothingImage"
            src={`/components/skills/clothing-${currentImage.toLocaleLowerCase()}.webp`}
            alt="Clothing"
            width={180}
            height={120}
          />
          <div className="headWrapper">
             <Image
            className={"headImage"}
            src={`/components/skills/${
              currentImage === "photoshop"
                ? "head-sunglasess"
                : currentImage === "illustrator"
                ? "head-illustrator"
                : "head"
            }.webp`}
            alt="Head"
            width={180}
            height={120}
          />
          </div>
         

          <div className="leftHandWrapper">
            <Image
              className="leftHand"
              src={"/components/skills/left-hand.webp"}
              alt="Left hand"
              width={180}
              height={120}
            />
          </div>

          <Image
            className="rightHand"
            src={"/components/skills/right-hand.webp"}
            alt="Right hand"
            width={180}
            height={120}
          />
        </div>
      </div>
      <div className="heroTextWrapper">
        <h2>
          {
            currentText.includes("deeply curious")
              ? "Skills"
              : currentImage
                  .replace(/([A-Z])/g, " $1") // Add space before capital letters
                  .replace(/^./, (str) => str.toUpperCase()) // Capitalize first letter
                  .replace(/-/g, " ") // Replace hyphens with spaces
          }
        </h2>
        <p>
          {currentText}{" "}
          <Link href={`/skills/#${currentImage.toLocaleLowerCase()}`}>
            <b>Read More...</b>
          </Link>
        </p>
      </div>
    </div>
  );
}
