"use client";

import NextImage from "next/image";
import "./Skills.css";
import { useEffect, useState, useRef, useCallback, memo } from "react";
import Link from "next/link";
import Logo from "./client/Logo"; // Assuming this is a client component

// --- Interfaces ---
interface SkillData {
  name: string;
  description: string;
  color: {
    main: string;
    alt: string;
  };
  imagePath: string; // Add imagePath for skill icon
}

// --- Constants ---
const DEFAULT_TEXT =
  "I've always been deeply curious about how things work — especially in the digital world. That curiosity turned into a passion, and over the years, it pushed me to explore and learn a wide range of tools, software, and technologies. Whether it's design, development, or automation, I dive in with focus and genuine interest. Every skill I've picked up wasn't just a checkbox — it was part of a journey I truly enjoyed.";
const AUTO_ROTATION_INTERVAL = 5000; // 5 seconds
const INACTIVITY_TIMEOUT = 15000; // 10 seconds

const SKILL_CATEGORIES = [
  {
    title: "Graphic Design",
    skills: [
      "illustrator", "photoshop","figma", "aftereffects", "premiere", "openai", "midjourney",],
  },
  {
    title: "Web Developer",
    skills: ["HTML", "CSS", "canvas", "JS", "react", "next", "firebase"],
  },
];

// --- Utility Functions ---
const preloadImage = (src: string) => {
  const img = new Image();
  img.src = src;
};

// --- Sub-components ---

interface SkillIconProps {
  skill: SkillData;
  isActive: boolean;
  onClick: (key: string) => void;
}

const SkillIcon = memo(({ skill, isActive, onClick }: SkillIconProps) => (
  <>
    <NextImage
      onClick={() => onClick(skill.name)}
      className={`skillIcon ${isActive ? "active" : ""}`}
      src={skill.imagePath}
      alt={skill.name}
      width={30}
      height={30}
      loading="eager" // Preload immediately
    />
    <div className="hrLine" />
  </>
));

SkillIcon.displayName = "SkillIcon"; // For better debugging with memo

// --- Main Component ---
export default function HeroSection() {
  const [currentImage, setCurrentImage] = useState("niko-dola");
  const [currentText, setCurrentText] = useState(DEFAULT_TEXT);
  const [skillsData, setSkillsData] = useState<SkillData[]>([]);
  const [color, setColor] = useState({ main: "#1e1e1e", alt: "#3ce5e5" });

  const [activeSkill, setActiveSkill] = useState<string | null>(null);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const allSkillNames = SKILL_CATEGORIES.flatMap((category) => category.skills);

  // Function to update skill details
  const updateSkill = useCallback(
    (key: string) => {
      const item = skillsData.find(
        (skill) => skill.name.toLowerCase() === key.toLowerCase()
      );
      if (item) {
        setCurrentText(item.description.slice(0, 150));
        setCurrentImage(item.name);
        setActiveSkill(key.toLowerCase());
        setColor(item.color);
      }
    },
    [skillsData]
  );

  // Start or restart the auto-rotation
const startAutoRotation = useCallback(() => {
  if (intervalRef.current) {
    clearInterval(intervalRef.current);
  }

  intervalRef.current = setInterval(() => {
    const currentIndex = allSkillNames.findIndex(
      (skill) => skill.toLowerCase() === activeSkill?.toLowerCase()
    );
    const nextIndex = (currentIndex + 1) % allSkillNames.length;
    const nextSkill = allSkillNames[nextIndex];
    updateSkill(nextSkill);
  }, AUTO_ROTATION_INTERVAL);
}, [updateSkill, activeSkill]); // Removed allSkillNames


  const handleSkillClick = useCallback(
    (key: string) => {
      // Find the index of the selected skill
      updateSkill(key);

      // Clear any existing timeout and interval
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      // Restart auto-rotation after inactivity
      timeoutRef.current = setTimeout(() => {
        startAutoRotation();
      }, INACTIVITY_TIMEOUT);
    },
    [allSkillNames, updateSkill, startAutoRotation]
  );

  // --- Effects ---

  // Fetch data and preload images on mount
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/components/skills/skills.json");
        const dataJson: SkillData[] = await response.json();

        // Map colors and image paths to the data
        const processedData = dataJson.map((item) => {
          let colorScheme = { main: "#1e1e1e", alt: "#3ce5e5" }; // Default
          const lowerCaseName = item.name.toLowerCase();

          switch (lowerCaseName) {
            case "illustrator":
              colorScheme = { main: "#F7991C", alt: "#F7991C" };
              break;
            case "photoshop":
              colorScheme = { main: "#101519", alt: "#2ECEE8" };
              break;
            case "figma":
              colorScheme = { main: "#F27264", alt: "#53C0DD" };
              break;
            case "aftereffects":
              colorScheme = { main: "#101519", alt: "#918FC6" };
              break;
            case "premiere":
              colorScheme = { main: "#918FC6", alt: "#918FC6" };
              break;
            case "openai":
              colorScheme = { main: "white", alt: "#74A89A" };
              break;
            case "midjourney":
              colorScheme = { main: "black", alt: "white" };
              break;
            case "html":
              colorScheme = { main: "#E24E26", alt: "#E24E26" };
              break;
            case "css":
              colorScheme = { main: "#3555A5", alt: "#3555A5" };
              break;
            case "canvas":
              colorScheme = { main: "#47B97E", alt: "#47B97E" };
              break;
            case "js":
              colorScheme = { main: "#F5DE17", alt: "#F5DE17" };
              break;
            case "react":
              colorScheme = { main: "#101519", alt: "#2ECEE8" };
              break;
            case "next":
              colorScheme = { main: "#101519", alt: "#101519" };
              break;
            case "firebase":
              colorScheme = { main: "#DA3226", alt: "#FFC40D" };
              break;
          }
          return {
            ...item,
            color: colorScheme,
            imagePath: `/components/skills/skills-icon_${lowerCaseName}.svg`,
          };
        });

        setSkillsData(processedData);

        // Preload dynamic images (clothing, head, hands)
        processedData.forEach((item) => {
          const name = item.name.toLowerCase();
          preloadImage(`/components/skills/clothing-${name}.webp`);
          preloadImage(
            `/components/skills/${
              name === "photoshop"
                ? "head-sunglasess"
                : name === "illustrator"
                ? "head-illustrator"
                : "head"
            }.webp`
          );
        });

        preloadImage("/components/skills/left-hand.webp");
        preloadImage("/components/skills/right-hand.webp");
      } catch (error) {
        console.error("Failed to fetch skills data:", error);
      }
    }

    fetchData();
  }, []);

  // Initialize auto-rotation on component mount and data load
  useEffect(() => {
    if (skillsData.length > 0) {
      startAutoRotation();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [skillsData, startAutoRotation]); // Depend on skillsData to ensure it's loaded

  // Determine the head image based on currentImage
  const getHeadImageSrc = useCallback(() => {
    switch (currentImage.toLowerCase()) {
      case "photoshop":
        return "head-sunglasess";
      case "illustrator":
        return "head-illustrator";
      default:
        return "head";
    }
  }, [currentImage]);

  const displayTitle = currentText.includes("deeply curious")
    ? "Skills"
    : currentImage
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str) => str.toUpperCase())
        .replace(/-/g, " ");

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
          {SKILL_CATEGORIES.map((category) => (
            <div key={category.title} className="skillCategory">
              <p className="skillsText">
                {category.title} <b>▼</b>
              </p>
              {category.skills.map((skillName) => {
                const skill = skillsData.find(
                  (s) => s.name.toLowerCase() === skillName.toLowerCase()
                );
                if (!skill) return null; // Should not happen with correct data

                return (
                  <SkillIcon
                    key={skill.name}
                    skill={skill}
                    isActive={activeSkill === skill.name.toLowerCase()}
                    onClick={handleSkillClick}
                  />
                );
              })}
            </div>
          ))}
        </div>

        <div className="imageWrapper">
          <NextImage
            className="clothingImage"
            src={`/components/skills/clothing-${currentImage.toLocaleLowerCase()}.webp`}
            alt="Clothing"
            width={180}
            height={120}
            priority // High priority for initial load
          />
          <div className="headWrapper">
            <NextImage
              className={"headImage"}
              src={`/components/skills/${getHeadImageSrc()}.webp`}
              alt="Head"
              width={180}
              height={120}
              priority
            />
          </div>

          <div className="leftHandWrapper">
            <NextImage
              className="leftHand"
              src={"/components/skills/left-hand.webp"}
              alt="Left hand"
              width={180}
              height={120}
              priority
            />
          </div>

          <NextImage
            className="rightHand"
            src={"/components/skills/right-hand.webp"}
            alt="Right hand"
            width={180}
            height={120}
            priority
          />
        </div>
      </div>
      <div className="heroTextWrapper">
        <h3>{displayTitle}</h3>
        <p>
          {currentText}{" "}
          <Link href={`/skills/#${currentImage.toLocaleLowerCase()}`}>
            <b>Read More...</b>
          </Link>
        </p>
      </div>
      
        <div className={activeSkill === "openai"?  "imageChat": "hidden"}>
          <Logo size="0" link="" chat={true} />
        </div>
     
    </div>
  );
}