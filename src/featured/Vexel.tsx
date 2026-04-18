"use client";

import Image from "next/image";
import "./Vexel.css";

/* ─────────────────────────────────────────────────────
   TOC Data
   Each node maps to a section ID in the document.
───────────────────────────────────────────────────── */
type TocNode = {
  id: string;
  label: string;
  children?: TocNode[];
};

const tocTree: TocNode[] = [
  {
    id: "section--overview",
    label: "Overview",
    children: [],
  },
  {
    id: "section--brand-guidelines",
    label: "Brand Guidelines",
    children: [
      {
        id: "section--logo",
        label: "Logo",
        children: [
          {
            id: "section--symbol",
            label: "Symbol",
            children: [
              { id: "section--symbol-usage", label: "Symbol Usage" },
              { id: "section--symbol-aspect-ratio", label: "Symbol Aspect Ratio" },
              { id: "section--symbol-safe-zone", label: "Symbol Safe Zone" },
              { id: "section--symbol-minimal-scale", label: "Symbol Minimal Scale" },
            ],
          },
          {
            id: "section--text-logo",
            label: "Text Logo",
            children: [
              { id: "section--text-logo-aspect-ratio", label: "Text Logo Aspect Ratio" },
              { id: "section--text-logo-safe-zone", label: "Text Logo Safe Zone" },
            ],
          },
          { id: "section--logo-typography", label: "Typography" },
        ],
      },
      { id: "section--colors", label: "Colors" },
      { id: "section--brand-typography", label: "Typography" },
      { id: "section--animation", label: "Animation" },
      { id: "section--pattern", label: "Pattern" },
    ],
  },
  {
    id: "section--ui",
    label: "UI",
    children: [],
  },
  {
    id: "section--development",
    label: "Development",
    children: [],
  },
];

/* ─────────────────────────────────────────────────────
   Smooth scroll helper
───────────────────────────────────────────────────── */
function scrollTo(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ─────────────────────────────────────────────────────
   Recursive TOC renderer
───────────────────────────────────────────────────── */
function TocList({ nodes, depth = 0 }: { nodes: TocNode[]; depth?: number }) {
  if (!nodes.length) return null;
  return (
    <ul className={`vx-toc__list vx-toc__list--d${depth}`}>
      {nodes.map((node) => (
        <li key={node.id} className="vx-toc__item">
          <button className={`vx-toc__link vx-toc__link--d${depth}`} onClick={() => scrollTo(node.id)}>
            {node.label}
          </button>
          {node.children && <TocList nodes={node.children} depth={depth + 1} />}
        </li>
      ))}
    </ul>
  );
}

/* ─────────────────────────────────────────────────────
   Page
───────────────────────────────────────────────────── */
export default function Vexel() {
  return (
    <main className="vx-page">
      {/* ══════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════ */}
      <section className="section-full vx-hero">
        <div className="vx-container vx-hero__inner">
          <div className="vx-hero__identity">
            <p className="vx-hero__eyebrow">Design Document — v1.0</p>
            <h1 className="vx-hero__title">Vexel</h1>
            <p className="vx-hero__subtitle">
              Image Compressing &amp; Upscale
              <br />
              Desktop App
            </p>
          </div>

          <nav className="vx-toc" aria-label="Document contents">
            <p className="vx-toc__heading">Contents</p>
            <TocList nodes={tocTree} depth={0} />
          </nav>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          OVERVIEW — Mission & Vision
      ══════════════════════════════════════════════ */}
      <section className="section-regular vx-section" id="section--overview">
        <h2 className="vx-section__title">Mission &amp; Vision</h2>
        <div className="vx-mv-grid">
          <div className="vx-mv-card">
            <p className="vx-mv-card__title">Mission</p>
            <p className="vx-mv-card__body">
              Vexel&apos;s mission is to make image processing fast, simple, and accessible, giving users the power to compress and upscale
              images with high quality, without relying on heavy software or an internet connection. The goal is to deliver a smooth,
              local-first experience where anyone can improve their images in seconds.
            </p>
          </div>
          <div className="vx-mv-card">
            <p className="vx-mv-card__title">Vision</p>
            <p className="vx-mv-card__body">
              Vexel aims to become a go-to tool for fast image editing, where quality, speed, and simplicity come together in one
              lightweight app. The vision is to replace slow, complex workflows with a direct and efficient solution that works instantly,
              anytime, anywhere.
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          CHAPTER 01 — Brand Guidelines
      ══════════════════════════════════════════════ */}
      <div className="section-full vx-chapter" id="section--brand-guidelines">
        <div className="vx-container vx-chapter__inner">
          <span className="vx-chapter__index">01</span>
          <h2 className="vx-chapter__title">Brand Guidelines</h2>
        </div>
      </div>

      {/* ── Logo ────────────────────────────────────── */}
      <section className="section-regular vx-section" id="section--logo">
        <span className="vx-section__label">Brand Guidelines</span>
        <h2 className="vx-section__title">Logo</h2>
        <div className="vx-asset">
          <Image src="/portfolio/vexel/section-1_logo.svg" width={300} height={300} alt="Vexel logo versions" className="vx-asset__img" />
        </div>
      </section>

      {/* ── Symbol — Full-Bleed Hero ─────────────────── */}
      <div className="section-full vx-symbol-hero" id="section--symbol">
        <div className="vx-container vx-symbol-hero__header text-center">
          <span className="vx-section__label">Logo</span>
          <h2 className="vx-symbol-hero__title">Symbol</h2>
        </div>
        <div className="vx-symbol-hero__image-wrap">
          <Image
            src="/portfolio/vexel/section-6_logo-symbo_mockup-topaz-faceai-sharpen_AA.webp"
            width={1900}
            height={1400}
            alt="Vexel logo symbol mockup"
            className="vx-symbol-hero__img"
          />
        </div>
      </div>

      {/* ── Symbol Usage ────────────────────────────── */}
      <section className="section-regular vx-section" id="section--symbol-usage">
        <span className="vx-section__label">Symbol</span>
        <h3 className="vx-section__title">Symbol Usage</h3>
        <div className="vx-prose">
          <p>
The Vexel symbol is built from three geometric shapes forming an 
abstract fox. The structure creates a clear “V” linked to the name.
<br/>
The form communicates speed and precision.

Sharp edges follow pixel geometry. Symmetry keeps the mark balanced
 and recognizable.
The symbol must be used within a defined container (square or circle). Do not place it on uncontrolled backgrounds. Use the original background color when needed to maintain clarity.
          </p>
        </div>
        <div className="vx-asset">
          <Image
            src="/portfolio/vexel/section-2_logo-symbol.svg"
            width={300}
            height={300}
            alt="Vexel logo symbol"
            className="vx-asset__img"
          />
        </div>
      </section>

      {/* ── Symbol Aspect Ratio ─────────────────────── */}
      <section className="section-regular vx-section" id="section--symbol-aspect-ratio">
        <span className="vx-section__label">Symbol</span>
        <h3 className="vx-section__title">Symbol Aspect Ratio</h3>
        <p>
          The logo uses a 1:1 ratio to stay balanced and easy to use everywhere. A square fits perfectly for app icons and UI, keeps the fox
          centered, and makes sure it looks clean at any size.
        </p>
        <div className="vx-asset">
          <Image
            src="/portfolio/vexel/section-3_logo-symbol-aspect-ratio.svg"
            width={300}
            height={300}
            alt="Vexel symbol aspect ratio"
            className="vx-asset__img"
          />
        </div>
      </section>

      {/* ── Symbol Safe Zone ────────────────────────── */}
      <section className="section-regular vx-section" id="section--symbol-safe-zone">
        <span className="vx-section__label">Symbol</span>
        <h3 className="vx-section__title">Symbol Safe Zone</h3>
        <div className="vx-prose">
          <p>
          The safe zone is defined using a single unit taken from the symbol itself. This unit is applied consistently around all sides to maintain clear spacing.

No other elements should enter this area.
          </p>
        </div>
        <div className="vx-asset">
          <Image
            src="/portfolio/vexel/section-4_logo-symbol-safe-zone.svg"
            width={300}
            height={300}
            alt="Vexel symbol safe zone"
            className="vx-asset__img"
          />
        </div>
      </section>

      {/* ── Symbol Minimal Scale ────────────────────── */}
      <section className="section-regular vx-section" id="section--symbol-minimal-scale">
        <span className="vx-section__label">Symbol</span>
        <h3 className="vx-section__title">Symbol Minimal Scale</h3>
        <p>
        The minimum size is 22px for the app icon and 16px for the standalone symbol.
        </p>
        <div className="vx-asset">
          <Image
            src="/portfolio/vexel/section-5_logo-symbo_scale.svg"
            width={300}
            height={300}
            alt="Vexel symbol minimal scale"
            className="vx-asset__img"
          />
        </div>
      </section>

      {/* ── Text Logo ───────────────────────────────── */}
      <section className="section-full vx-section " id="section--text-logo">
        <div className="vx-container vx-symbol-hero__header text-center">
    <span className="vx-section__label">Logo</span>
        <h2 className="vx-section__title">Text Logo</h2>
        </div>
    
                <Image
          src="/portfolio/vexel/text-logo_mockup.webp"
          width={1900}
          height={1400}
          alt="Vexel symbol minimal scale"
          className="vx-asset__img"
        />

      </section>

      <section className="section-regular vx-section " id="section--text-logo-aspect-ratio">
        <span className="vx-section__label">Text Logo</span>
        <h3 className="vx-section__title">Text Logo Aspect Ratio</h3>
        <p>
          The primary horizontal wordmark is built on a 5:1 ratio, making it ideal for wide applications where space is limited in height
          but extended in width. It is designed to maintain strong readability, consistent spacing, and visual balance across all scales.
          This version should be used in headers, website navigation bars, banners, email signatures, and any layout that requires a clean
          horizontal presence.
        </p>
        <Image
          src="/portfolio/vexel/section-7_text-logo_aspect-ratio.svg"
          width={300}
          height={300}
          alt="Vexel symbol minimal scale"
          className="vx-asset__img"
        />
      </section>

      <section className="section-regular vx-section " id="section--text-logo-safe-zone">
        <span className="vx-section__label">Text Logo</span>
        <h3 className="vx-section__title">Text Logo Safe Zone</h3>
        <Image
          src="/portfolio/vexel/section-8_text-logo_safe-zone.svg"
          width={300}
          height={300}
          alt="Vexel symbol minimal scale"
          className="vx-asset__img"
        />
      </section>
      {/* section-9_text-logo-typography.svg */}
      <section className="section-regular vx-section " id="section--logo-typography">
        <span className="vx-section__label">Logo</span>
        <h3 className="vx-section__title">Typography</h3>
        <p>
          The Vexel logo uses custom typography designed to match the brand’s direction. Each letter follows geometric guides for consistent
          proportion and spacing, ensuring a clean, modern, and highly legible wordmark.
        </p>
        <Image
          src="/portfolio/vexel/section-9_text-logo-typography.svg"
          width={300}
          height={300}
          alt="Vexel symbol minimal scale"
          className="vx-asset__img"
        />
      </section>

      {/* ── Colors ──────────────────────────────────── */}
      <section className="section-regular vx-section " id="section--colors">
        <span className="vx-section__label">Brand Guidelines</span>
        <h2 className="vx-section__title">Colors</h2>
        <Image
          src="/portfolio/vexel/section-10_colors.svg"
          width={300}
          height={300}
          alt="Vexel symbol minimal scale"
          className="vx-asset__img"
        />
      </section>

      {/* ── Brand Typography ────────────────────────── */}
      <section className="section-regular vx-section vx-section--wip" id="section--brand-typography">
        <span className="vx-section__label">Brand Guidelines</span>
        <h2 className="vx-section__title">Typography</h2>
      </section>

      {/* ── Animation ───────────────────────────────── */}
      <section className="section-regular vx-section vx-section--wip" id="section--animation">
        <span className="vx-section__label">Brand Guidelines</span>
        <h2 className="vx-section__title">Animation</h2>
      </section>

      <section className="section-regular vx-section vx-section--wip" id="section--animation">
        <span className="vx-section__label">Brand Guidelines</span>
        <h2 className="vx-section__title">Animation Processing</h2>
      </section>

      <section className="section-regular vx-section vx-section--wip" id="section--animation">
        <span className="vx-section__label">Brand Guidelines</span>
        <h2 className="vx-section__title">Animation Loading</h2>
      </section>

      {/* ── Pattern ─────────────────────────────────── */}
      <section className="section-regular vx-section vx-section--wip" id="section--pattern">
        <span className="vx-section__label">Brand Guidelines</span>
        <h2 className="vx-section__title">Pattern</h2>
      </section>

      {/* ══════════════════════════════════════════════
          CHAPTER 02 — UI
      ══════════════════════════════════════════════ */}
      <div className="section-full vx-chapter" id="section--ui">
        <div className="vx-container vx-chapter__inner">
          <span className="vx-chapter__index">02</span>
          <h2 className="vx-chapter__title">UI</h2>
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          CHAPTER 03 — Development
      ══════════════════════════════════════════════ */}
      <div className="section-full vx-chapter" id="section--development">
        <div className="vx-container vx-chapter__inner">
          <span className="vx-chapter__index">03</span>
          <h2 className="vx-chapter__title">Development</h2>
        </div>
      </div>
    </main>
  );
}
