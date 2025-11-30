"use client";

import NextImage from "next/image";
import "./Skills.css";
import { useEffect, useState, useRef, useCallback, memo } from "react";
import Link from "next/link";
import Logo from "./Logo";

interface SkillData {
  name: string;
  description: string;
  color: {
    main: string;
    alt: string;
  };
  imagePath: string;
}

interface HeroSectionProps {
  onLoadComplete?: () => void;
}

const DEFAULT_TEXT =
  "I've always been deeply curious about how things work — especially in the digital world. That curiosity turned into a passion, and over the years, it pushed me to explore and learn a wide range of tools, software, and technologies. Whether it's design, development, or automation, I dive in with focus and genuine interest. Every skill I've picked up wasn't just a checkbox — it was part of a journey I truly enjoyed.";

const AUTO_ROTATION_INTERVAL = 15000;
const INACTIVITY_TIMEOUT = 30000;

const SKILL_CATEGORIES = [
  {
    title: "Graphic Design",
    skills: [
      "illustrator", "photoshop", "figma", "aftereffects", "premiere", "openai", "midjourney",
    ],
  },
  {
    title: "Web Developer",
    skills: ["HTML", "CSS", "canvas", "JS", "react", "next", "firebase"],
  },
];

// Predefined color schemes to avoid runtime calculations
const COLOR_SCHEMES: Record<string, { main: string; alt: string }> = {
  illustrator: { main: "#F7991C", alt: "#F7991C" },
  photoshop: { main: "#101519", alt: "#2ECEE8" },
  figma: { main: "#F27264", alt: "#53C0DD" },
  aftereffects: { main: "#101519", alt: "#918FC6" },
  premiere: { main: "#918FC6", alt: "#918FC6" },
  openai: { main: "white", alt: "#74A89A" },
  midjourney: { main: "black", alt: "white" },
  html: { main: "#E24E26", alt: "#E24E26" },
  css: { main: "#3555A5", alt: "#3555A5" },
  canvas: { main: "#47B97E", alt: "#47B97E" },
  js: { main: "#F5DE17", alt: "#F5DE17" },
  react: { main: "#101519", alt: "#2ECEE8" },
  next: { main: "#101519", alt: "#101519" },
  firebase: { main: "#DA3226", alt: "#FFC40D" },
};

const preloadImage = (src: string) => {
  // Only preload critical above-the-fold images
  const img = new Image();
  img.src = src;
};

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
      alt={`${skill.name} icon`}
      width={30}
      height={30}
      loading="eager"
      priority
    />
    <div className="hrLine" />
  </>
));

SkillIcon.displayName = "SkillIcon";

export default function HeroSection({ onLoadComplete }: HeroSectionProps) {
  const [currentImage, setCurrentImage] = useState("niko-dola");
  const [currentText, setCurrentText] = useState(DEFAULT_TEXT);
  const [skillsData, setSkillsData] = useState<SkillData[]>([]);
  const [color, setColor] = useState({ main: "#1e1e1e", alt: "#3ce5e5" });
  const [activeSkill, setActiveSkill] = useState<string | null>(null);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const allSkillNames = SKILL_CATEGORIES.flatMap((category) => category.skills);

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

  const startAutoRotation = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      const currentIndex = allSkillNames.findIndex(
        (skill) => skill.toLowerCase() === activeSkill?.toLowerCase()
      );
      const nextIndex = (currentIndex + 1) % allSkillNames.length;
      const nextSkill = allSkillNames[nextIndex];
      updateSkill(nextSkill);
    }, AUTO_ROTATION_INTERVAL);
  }, [updateSkill, activeSkill, allSkillNames]);

  const handleSkillClick = useCallback(
    (key: string) => {
      updateSkill(key);

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);

      timeoutRef.current = setTimeout(() => {
        startAutoRotation();
      }, INACTIVITY_TIMEOUT);
    },
    [updateSkill, startAutoRotation]
  );

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      try {
        const response = await fetch("/components/skills/skills.json");
        const dataJson: SkillData[] = await response.json();

        const processedData = dataJson.map((item) => {
          const lowerCaseName = item.name.toLowerCase();
          const colorScheme = COLOR_SCHEMES[lowerCaseName] || { main: "#1e1e1e", alt: "#3ce5e5" };
          
          return {
            ...item,
            color: colorScheme,
            imagePath: `/components/skills/skills-icon_${lowerCaseName}.svg`,
          };
        });

        if (isMounted) {
          setSkillsData(processedData);

          // Only preload critical images that are likely to be viewed first
          const criticalImages = [
            "/components/skills/clothing-niko-dola.webp",
            "/components/skills/head.webp",
            "/components/skills/left-hand.webp",
            "/components/skills/right-hand.webp"
          ];

          criticalImages.forEach(preloadImage);
          onLoadComplete?.();
        }
      } catch (error) {
        console.error("Failed to fetch skills data:", error);
        if (isMounted) {
          onLoadComplete?.();
        }
      }
    }

    fetchData();

    return () => {
      isMounted = false;
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [onLoadComplete]);

  useEffect(() => {
    if (skillsData.length > 0) {
      startAutoRotation();
    }
  }, [skillsData, startAutoRotation]);

  const getHeadImageSrc = useCallback(() => {
    switch (currentImage.toLowerCase()) {
      case "photoshop": return "head-sunglasess";
      case "illustrator": return "head-illustrator";
      default: return "head";
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
                if (!skill) return null;

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
            alt={`${currentImage} clothing`}
            width={180}
            height={120}
            priority
          />
          <div className="headWrapper">
            <NextImage
              className={`headImage ${activeSkill === "aftereffects" ? "animate-head" : ""}`}
              src={`/components/skills/${getHeadImageSrc()}.webp`}
              alt="Head"
              width={180}
              height={120}
              priority
            />
          </div>

          <div className="leftHandWrapper">
            <NextImage
              className={`leftHand ${activeSkill === "aftereffects" ? "animate-left" : ""}`}
              src={"/components/skills/left-hand.webp"}
              alt="Left hand"
              width={180}
              height={120}
              priority
            />
          </div>

          <NextImage
            className={`rightHand ${activeSkill === "aftereffects" ? "animate-right" : ""}`}
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

      <div className={activeSkill === "openai" ? "imageChat" : "hidden"}>
        <Logo size="0" link="" chat={true} loadingState={false} />
      </div>
    </div>
  );
}