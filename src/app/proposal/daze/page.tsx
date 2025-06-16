
"use client"
import Image from "next/image";

import { useState } from "react"
import "./Proposal.css"
import Logo from "@/components/client/Logo";

type ServiceValue = {
  bool: boolean;
  value: number;
  description: string;
};

export default function Proposals() {
  const [time, setTime] = useState(0)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  const services: Record<string, ServiceValue> = {
    colorPalete: { bool: false, value: 6, description: "Carefully define and refine the brand's core color palette to ensure visual consistency and flexibility across all media — digital and print. This will include primary, secondary, and supporting colors with proper usage guidelines." },
    typography: { bool: false, value: 8, description: "Select primary and supporting typefaces that best reflect the brand personality and values. Define font sizes, weights, and hierarchy for use in web, print, and digital materials." },
    carning: { bool: false, value: 4, description: "Fine-tune the spacing between individual letters in the logo and brand text to improve readability and aesthetic balance. Ensures the brand typography looks polished and professional in all formats." },
    gridLayout: { bool: false, value: 18, description: "Create a consistent layout system using grids, margins, and spacing rules. This helps to maintain visual harmony across all brand collateral and ensures scalable and reusable design patterns." },
    logoSpace: { bool: false, value: 3, description: "Define the minimum amount of clear space required around the logo to maintain its impact and prevent crowding from other elements." },
    logoVariation: { bool: false, value: 8, description: "Develop multiple variations of the logo (horizontal, stacked/vertical, badge format) to provide flexibility across different contexts and layouts." },
    aspectRatio: { bool: false, value: 2, description: "Set precise aspect ratios for each logo version to ensure consistent scaling and alignment across different devices and media." },
    minimumLogoSize: { bool: false, value: 1, description: "Define the smallest size at which the logo can be used while preserving its legibility and brand integrity." },
    howNotTo: { bool: false, value: 5, description: "Provide examples of incorrect logo and brand element usage (distortion, color misuse, overcrowding, wrong backgrounds), helping prevent misuse by partners and designers." },
    logoColors: { bool: false, value: 3, description: "Export and prepare the logo in various color variations (light, dark, black & white, monochrome) to suit different backgrounds and use cases." },
    logo3DMockup: { bool: false, value: 8, description: "Create 3D visual mockups of the logo for presentations, product previews, packaging, and marketing materials, enhancing perceived professionalism and brand impact." },
    logoAnimation: { bool: false, value: 8, description: "Develop simple, tasteful animations of the logo (for example, fade-in, bounce, line drawing effect) for use in videos, intros, websites, and social media." },
    logoHoverAnimation: { bool: false, value: 4, description: "Add a subtle interactive hover animation to the logo on websites (typically on the home button or header), adding personality and improving engagement." },
    brandPattern: { bool: false, value: 14, description: "Design a brand pattern (repeating or dynamic visual motif) that complements the brand identity and can be used in backgrounds, packaging, or marketing collateral." },
    iconography: { bool: false, value: 14, description: "Create a cohesive set of custom icons that align with the brand's visual style, ensuring consistency across all digital and print applications while maintaining clarity and recognizability." },
    appIcon: { bool: false, value: 1, description: "Design a custom app icon based on the brand identity, optimized for both iOS and Android platforms, following app store guidelines." },
    appIconsMerged: { bool: false, value: 4, description: "Create additional app icons variations and social media avatars derived from the main app icon design." },
    creativeStickers: { bool: false, value: 4, description: "Design custom digital or print sticker sets for brand promotion, packaging, marketing campaigns, or social media use." },
    qrCode: { bool: false, value: 2, description: "Design a branded QR code that visually aligns with the brand identity while remaining scannable, for use on packaging, business cards, and marketing materials." },
    stationeryDesign: { bool: false, value: 6, description: "Design branded stationery such as business cards, letterheads, envelopes, and presentation templates to ensure consistent offline brand presence." },
    packageDesign: { bool: false, value: 6, description: "Design packaging for products in alignment with brand guidelines, ensuring visual consistency and professional presentation." },
    printMiniBranding: { bool: false, value: 6, description: "Prepare branded assets optimized for print, including versions of the logo, patterns, typography, and color profiles (CMYK versions)." },
    socialBanners: { bool: false, value: 6, description: "Design cover images and banners optimized for key social platforms (Facebook, LinkedIn, Twitter, YouTube), ensuring they adapt well to different screen sizes and devices." },
    hotelBranding: { bool: false, value: 8, description: "Customize the look and feel of a hotel portal (or similar digital platform) with the client's brand elements — logo, colors, typography — to maintain visual consistency and enhance customer trust." },
    brandReel: { bool: false, value: 10, description: "Produce a short brand video reel (animated logo, key brand visuals, messaging) suitable for use on websites, social channels, and presentations." },
    emailSignature: { bool: false, value: 4, description: "Design a professional, responsive email signature that reflects the brand identity and can be easily implemented across the organization's email system." },
    emailTemplates: { bool: false, value: 10, description: "Create custom-branded email templates (newsletter, transactional, announcement) optimized for mobile and desktop, built with responsive HTML and CSS." },
    emailIcons: { bool: false, value: 4, description: "Design a custom set of icons for use in email templates and digital communication to enhance visual consistency." },
    transactionalEmails: { bool: false, value: 2, description: "Style and format automated transactional emails (order confirmations, password resets, etc.) to match the brand look and feel." },
    newsletterLayout: { bool: false, value: 10, description: "Design reusable newsletter layouts for marketing communications, optimized for visual hierarchy and engagement." },
    brandingDocs: { bool: false, value: 6, description: "Create an internal documentation page (web-based) summarizing the brand's HTML/CSS styling rules, components, and code snippets for developers." },
    loadingAnimation: { bool: false, value: 4, description: "Design a simple branded loading animation (spinner, bar, logo animation) for use on web apps or mobile apps to maintain brand presence during loading states." },
  };

  const [value, setValue] = useState<Record<string, ServiceValue>>(services);

const handleTime = (key: string) => {
  setValue((prev) => {
    const newValue = {
      ...prev,
      [key]: {
        ...prev[key],
        bool: !prev[key].bool
      }
    };
    
    // Recalculate total time from all selected services
    const newTime = Object.values(newValue)
      .filter(service => service.bool)
      .reduce((sum, service) => sum + service.value, 0);
    
    setTime(newTime);
    return newValue;
  });
};
  const handleMouseEnter = (key: string) => {
    setHoveredItem(key);
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

  return (
    <>
        <hr className="mt-8"/>
    <section className="section-regular flex justify-center gap-[10%]">
      <Logo size="100px" link="/" />
      <Image src={"/proposals/daze/daze.svg"} width={90} height={100} alt="daze logo"/>
    </section>
    <hr className="mb-8"/>
        <main className="offersWrapper" onMouseMove={handleMouseMove}>
 
      {/* Tooltip */}
      {hoveredItem && (
        <div 
          className="tooltip"
          style={{
            left: `${mousePosition.x + 15}px`,
            top: `${mousePosition.y + 15}px`,
          }}
        >
          {value[hoveredItem].description}
        </div>
      )}

      {/* Core Brand Identity */}
      <section className="section-regular offerWrapper">
        <h2>Core Brand Identity</h2>
         <ul className="servicesWrapper">
          <li 
            className={value.colorPalete.bool ? "selected" : ""} 
            onClick={() => handleTime("colorPalete")}
            onMouseEnter={() => handleMouseEnter("colorPalete")}
            onMouseLeave={handleMouseLeave}
          >
            <input 
              type="checkbox" 
              checked={value.colorPalete.bool} 
              readOnly 
            />
            1. Color Palette Design <span></span>
            
          </li>
          <li 
            className={value.typography.bool ? "selected" : ""} 
            onClick={() => handleTime("typography")}
            onMouseEnter={() => handleMouseEnter("typography")}
            onMouseLeave={handleMouseLeave}
          >
            <input 
              type="checkbox" 
              checked={value.typography.bool} 
              readOnly 
            />
            2. Typography
          </li>
          <li 
            className={value.carning.bool ? "selected" : ""} 
            onClick={() => handleTime("carning")}
            onMouseEnter={() => handleMouseEnter("carning")}
            onMouseLeave={handleMouseLeave}
          >
            <input 
              type="checkbox" 
              checked={value.carning.bool} 
              readOnly 
            />
            3. Carning the text (font)
          </li>
          <li 
            className={value.gridLayout.bool ? "selected" : ""} 
            onClick={() => handleTime("gridLayout")}
            onMouseEnter={() => handleMouseEnter("gridLayout")}
            onMouseLeave={handleMouseLeave}
          >
            <input 
              type="checkbox" 
              checked={value.gridLayout.bool} 
              readOnly 
            />
            4. Grid & Layout System
          </li>
          <li 
            className={value.logoSpace.bool ? "selected" : ""} 
            onClick={() => handleTime("logoSpace")}
            onMouseEnter={() => handleMouseEnter("logoSpace")}
            onMouseLeave={handleMouseLeave}
          >
            <input 
              type="checkbox" 
              checked={value.logoSpace.bool} 
              readOnly 
            />
            5. Logo Clear Space Rules
          </li>
          <li 
            className={value.logoVariation.bool ? "selected" : ""} 
            onClick={() => handleTime("logoVariation")}
            onMouseEnter={() => handleMouseEnter("logoVariation")}
            onMouseLeave={handleMouseLeave}
          >
            <input 
              type="checkbox" 
              checked={value.logoVariation.bool} 
              readOnly 
            />
            6. Logo variation 
          </li>
          <li 
            className={value.aspectRatio.bool ? "selected" : ""} 
            onClick={() => handleTime("aspectRatio")}
            onMouseEnter={() => handleMouseEnter("aspectRatio")}
            onMouseLeave={handleMouseLeave}
          >
            <input 
              type="checkbox" 
              checked={value.aspectRatio.bool} 
              readOnly 
            />
            7.Aspect Ratio for the logo versions
          </li>
          <li 
            className={value.minimumLogoSize.bool ? "selected" : ""} 
            onClick={() => handleTime("minimumLogoSize")}
            onMouseEnter={() => handleMouseEnter("minimumLogoSize")}
            onMouseLeave={handleMouseLeave}
          >
            <input 
              type="checkbox" 
              checked={value.minimumLogoSize.bool} 
              readOnly 
            />
            8. Minimum Logo Size
          </li>
          <li 
            className={value.howNotTo.bool ? "selected" : ""} 
            onClick={() => handleTime("howNotTo")}
            onMouseEnter={() => handleMouseEnter("howNotTo")}
            onMouseLeave={handleMouseLeave}
          >
            <input 
              type="checkbox" 
              checked={value.howNotTo.bool} 
              readOnly 
            />
            9. &apos;How Not To&apos; usage guide
          </li>
        </ul>
      </section>

      {/* Logo Assets & Interactions */}
      <section className="section-regular offerWrapper">
        <h2>Logo Assets & Interactions</h2>
          <ul className="servicesWrapper">
          <li 
            className={value.logoColors.bool ? "selected" : ""} 
            onClick={() => handleTime("logoColors")}
            onMouseEnter={() => handleMouseEnter("logoColors")}
            onMouseLeave={handleMouseLeave}
          >
            <input 
              type="checkbox" 
              checked={value.logoColors.bool} 
              readOnly 
            />
            1. Saving the logo in multiple colors 
          </li>
          <li 
            className={value.logo3DMockup.bool ? "selected" : ""} 
            onClick={() => handleTime("logo3DMockup")}
            onMouseEnter={() => handleMouseEnter("logo3DMockup")}
            onMouseLeave={handleMouseLeave}
          >
            <input 
              type="checkbox" 
              checked={value.logo3DMockup.bool} 
              readOnly 
            />
            2. 3D mockups for  presentation
          </li>
          <li 
            className={value.logoAnimation.bool ? "selected" : ""} 
            onClick={() => handleTime("logoAnimation")}
            onMouseEnter={() => handleMouseEnter("logoAnimation")}
            onMouseLeave={handleMouseLeave}
          >
            <input 
              type="checkbox" 
              checked={value.logoAnimation.bool} 
              readOnly 
            />
            3. Logo animation
          </li>
          <li 
            className={value.logoHoverAnimation.bool ? "selected" : ""} 
            onClick={() => handleTime("logoHoverAnimation")}
            onMouseEnter={() => handleMouseEnter("logoHoverAnimation")}
            onMouseLeave={handleMouseLeave}
          >
            <input 
              type="checkbox" 
              checked={value.logoHoverAnimation.bool} 
              readOnly 
            />
            4. JavaScript hover animation for the logo 
          </li>
        </ul>
      </section>

      {/* Visual Assets & Patterns */}
      <section className="section-regular offerWrapper">
        <h2>Visual Assets & Patterns</h2>
          <ul className="servicesWrapper">
          <li 
            className={value.brandPattern.bool ? "selected" : ""} 
            onClick={() => handleTime("brandPattern")}
            onMouseEnter={() => handleMouseEnter("brandPattern")}
            onMouseLeave={handleMouseLeave}
          >
            <input 
              type="checkbox" 
              checked={value.brandPattern.bool} 
              readOnly 
            />
            1. Creating a brand pattern
          </li>
          <li 
            className={value.iconography.bool ? "selected" : ""} 
            onClick={() => handleTime("iconography")}
            onMouseEnter={() => handleMouseEnter("iconography")}
            onMouseLeave={handleMouseLeave}
          >
            <input 
              type="checkbox" 
              checked={value.iconography.bool} 
              readOnly 
            />
            2. Iconography Set
          </li>
          <li 
            className={value.appIcon.bool ? "selected" : ""} 
            onClick={() => handleTime("appIcon")}
            onMouseEnter={() => handleMouseEnter("appIcon")}
            onMouseLeave={handleMouseLeave}
          >
            <input 
              type="checkbox" 
              checked={value.appIcon.bool} 
              readOnly 
            />
            3. App Icon Design
          </li>
          <li 
            className={value.appIconsMerged.bool ? "selected" : ""} 
            onClick={() => handleTime("appIconsMerged")}
            onMouseEnter={() => handleMouseEnter("appIconsMerged")}
            onMouseLeave={handleMouseLeave}
          >
            <input 
              type="checkbox" 
              checked={value.appIconsMerged.bool} 
              readOnly 
            />
            4. App Icons
          </li>
          <li 
            className={value.creativeStickers.bool ? "selected" : ""} 
            onClick={() => handleTime("creativeStickers")}
            onMouseEnter={() => handleMouseEnter("creativeStickers")}
            onMouseLeave={handleMouseLeave}
          >
            <input 
              type="checkbox" 
              checked={value.creativeStickers.bool} 
              readOnly 
            />
            5. Creative Sticker 
          </li>
          <li 
            className={value.qrCode.bool ? "selected" : ""} 
            onClick={() => handleTime("qrCode")}
            onMouseEnter={() => handleMouseEnter("qrCode")}
            onMouseLeave={handleMouseLeave}
          >
            <input 
              type="checkbox" 
              checked={value.qrCode.bool} 
              readOnly 
            />
            6. Custom QR Code Design
          </li>
        </ul>
      </section>

      {/* Digital & Print Material */}
      <section className="section-regular offerWrapper">
        <h2>Digital & Print Material</h2>
        <ul className="servicesWrapper">
          <li 
            className={value.stationeryDesign.bool ? "selected" : ""} 
            onClick={() => handleTime("stationeryDesign")}
            onMouseEnter={() => handleMouseEnter("stationeryDesign")}
            onMouseLeave={handleMouseLeave}
          >
            <input 
              type="checkbox" 
              checked={value.stationeryDesign.bool} 
              readOnly 
            />
            1. Stationery Design
          </li>
          <li 
            className={value.packageDesign.bool ? "selected" : ""} 
            onClick={() => handleTime("packageDesign")}
            onMouseEnter={() => handleMouseEnter("packageDesign")}
            onMouseLeave={handleMouseLeave}
          >
            <input 
              type="checkbox" 
              checked={value.packageDesign.bool} 
              readOnly 
            />
            2. Package Design (if needed)
          </li>
          <li 
            className={value.printMiniBranding.bool ? "selected" : ""} 
            onClick={() => handleTime("printMiniBranding")}
            onMouseEnter={() => handleMouseEnter("printMiniBranding")}
            onMouseLeave={handleMouseLeave}
          >
            <input 
              type="checkbox" 
              checked={value.printMiniBranding.bool} 
              readOnly 
            />
            3. Print Mini Branding
          </li>
        </ul>
      </section>

      {/* Online & Social Presence */}
      <section className="section-regular offerWrapper">
        <h2>Online & Social Presence</h2>
        <ul className="servicesWrapper">
          <li 
            className={value.socialBanners.bool ? "selected" : ""} 
            onClick={() => handleTime("socialBanners")}
            onMouseEnter={() => handleMouseEnter("socialBanners")}
            onMouseLeave={handleMouseLeave}
          >
            <input 
              type="checkbox" 
              checked={value.socialBanners.bool} 
              readOnly 
            />
            1. Creating banners for Social.
          </li>
          <li 
            className={value.hotelBranding.bool ? "selected" : ""} 
            onClick={() => handleTime("hotelBranding")}
            onMouseEnter={() => handleMouseEnter("hotelBranding")}
            onMouseLeave={handleMouseLeave}
          >
            <input 
              type="checkbox" 
              checked={value.hotelBranding.bool} 
              readOnly 
            />
            2. Hotel Portal White-label Branding
          </li>
          <li 
            className={value.brandReel.bool ? "selected" : ""} 
            onClick={() => handleTime("brandReel")}
            onMouseEnter={() => handleMouseEnter("brandReel")}
            onMouseLeave={handleMouseLeave}
          >
            <input 
              type="checkbox" 
              checked={value.brandReel.bool} 
              readOnly 
            />
            3. Brand Reel
          </li>
        </ul>
      </section>

      {/* Email & Web Assets */}
      <section className="section-regular offerWrapper">
        <h2>Email & Web Assets</h2>
        <ul className="servicesWrapper">
          <li 
            className={value.emailSignature.bool ? "selected" : ""} 
            onClick={() => handleTime("emailSignature")}
            onMouseEnter={() => handleMouseEnter("emailSignature")}
            onMouseLeave={handleMouseLeave}
          >
            <input 
              type="checkbox" 
              checked={value.emailSignature.bool} 
              readOnly 
            />
            1. Creating an Email Signature
          </li>
          <li 
            className={value.emailTemplates.bool ? "selected" : ""} 
            onClick={() => handleTime("emailTemplates")}
            onMouseEnter={() => handleMouseEnter("emailTemplates")}
            onMouseLeave={handleMouseLeave}
          >
            <input 
              type="checkbox" 
              checked={value.emailTemplates.bool} 
              readOnly 
            />
            2. Custom Email Templates
          </li>
          <li 
            className={value.emailIcons.bool ? "selected" : ""} 
            onClick={() => handleTime("emailIcons")}
            onMouseEnter={() => handleMouseEnter("emailIcons")}
            onMouseLeave={handleMouseLeave}
          >
            <input 
              type="checkbox" 
              checked={value.emailIcons.bool} 
              readOnly 
            />
            3. Email Icon Set
          </li>
          <li 
            className={value.transactionalEmails.bool ? "selected" : ""} 
            onClick={() => handleTime("transactionalEmails")}
            onMouseEnter={() => handleMouseEnter("transactionalEmails")}
            onMouseLeave={handleMouseLeave}
          >
            <input 
              type="checkbox" 
              checked={value.transactionalEmails.bool} 
              readOnly 
            />
            4. Transactional Email Styling
          </li>
          <li 
            className={value.newsletterLayout.bool ? "selected" : ""} 
            onClick={() => handleTime("newsletterLayout")}
            onMouseEnter={() => handleMouseEnter("newsletterLayout")}
            onMouseLeave={handleMouseLeave}
          >
            <input 
              type="checkbox" 
              checked={value.newsletterLayout.bool} 
              readOnly 
            />
            5. Newsletter Layout Design
          </li>
          <li 
            className={value.brandingDocs.bool ? "selected" : ""} 
            onClick={() => handleTime("brandingDocs")}
            onMouseEnter={() => handleMouseEnter("brandingDocs")}
            onMouseLeave={handleMouseLeave}
          >
            <input 
              type="checkbox" 
              checked={value.brandingDocs.bool} 
              readOnly 
            />
            6. Branding Documentation Web Page
          </li>
          <li 
            className={value.loadingAnimation.bool ? "selected" : ""} 
            onClick={() => handleTime("loadingAnimation")}
            onMouseEnter={() => handleMouseEnter("loadingAnimation")}
            onMouseLeave={handleMouseLeave}
            style={{marginBottom: "10rem"}}
          >
            <input 
              type="checkbox" 
              checked={value.loadingAnimation.bool} 
              readOnly 
            />
            7. Loading Animation
          </li>
        </ul>
      </section>

     <section className="section-regular   estimationsWrapper">
        <p>⏳ <span className="text-gray-200">Hours</span>:{Math.round(parseFloat(time.toFixed(1)))}</p>
        <p>💲 Cost ${Math.round(parseFloat(time.toFixed(1)) * 4 * 8)}</p>
     </section>
    </main>
    </>
  );
}