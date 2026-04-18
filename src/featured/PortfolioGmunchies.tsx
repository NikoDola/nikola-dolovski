"use client";

import Image from "next/image";
import "./PortfolioGmunchies.css";

/* ─────────────────────────────────────────────────────
   TOC Data
───────────────────────────────────────────────────── */
type TocNode = {
  id: string;
  label: string;
  children?: TocNode[];
};

const tocTree: TocNode[] = [
  { id: "gm--logo", label: "Logo", children: [] },
  { id: "gm--colors", label: "Colors", children: [] },
  { id: "gm--mascot", label: "Mascot", children: [] },
  { id: "gm--text-logo", label: "Text Logo", children: [] },
  {
    id: "gm--icons",
    label: "Icons",
    children: [
      { id: "gm--icons-custom", label: "Custom Icons" },
      { id: "gm--icons-stock", label: "Stock Icons" },
    ],
  },
  { id: "gm--business-cards", label: "Business Cards", children: [] },
  { id: "gm--website", label: "Website", children: [] },
];

/* ─────────────────────────────────────────────────────
   Smooth scroll
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
    <ul className={`gm-toc__list gm-toc__list--d${depth}`}>
      {nodes.map((node) => (
        <li key={node.id} className="gm-toc__item">
          <button
            className={`gm-toc__link gm-toc__link--d${depth}`}
            onClick={() => scrollTo(node.id)}
          >
            {node.label}
          </button>
          {node.children && node.children.length > 0 && (
            <TocList nodes={node.children} depth={depth + 1} />
          )}
        </li>
      ))}
    </ul>
  );
}

/* ─────────────────────────────────────────────────────
   Brand Colors
───────────────────────────────────────────────────── */
const brandColors = [
  { name: "Signal Red",      hex: "#E0251A", role: "Primary: Passion & Energy"      },
  { name: "Midnight Black",  hex: "#1A1A1A", role: "Base: Strength & Contrast"      },
  { name: "Sunshine Yellow", hex: "#F5C01E", role: "Secondary: Joy & Optimism"      },
  { name: "Warm Tan",        hex: "#C49A72", role: "Supporting: Warmth & Comfort"   },
];

/* ─────────────────────────────────────────────────────
   Icon Sets
───────────────────────────────────────────────────── */
const customIcons = [
  { src: "/portfolio/gmunchies/portfolio_vending-icon_main.svg",          label: "Vending Machine"  },
  { src: "/portfolio/gmunchies/portfolio_coffee-icon_main.svg",           label: "Coffee"            },
  { src: "/portfolio/gmunchies/portfolio_micro-services-icon_main.svg",   label: "Micro Services"    },
  { src: "/portfolio/gmunchies/portfolio_drink-icon_vending.svg",         label: "Drink"             },
  { src: "/portfolio/gmunchies/portfolio_drinks-and-snacks-icon_vending.svg", label: "Drinks & Snacks" },
  { src: "/portfolio/gmunchies/portfolio_food-icon_vending.svg",          label: "Food"              },
];

const stockIcons = [
  { src: "/portfolio/gmunchies/portfolio_Appartment-icon_stock.svg",       label: "Apartment"        },
  { src: "/portfolio/gmunchies/portfolio_gym-icon_stock.svg",              label: "Gym"              },
  { src: "/portfolio/gmunchies/portfolio_hospital-icon_stock.svg",         label: "Hospital"         },
  { src: "/portfolio/gmunchies/portfolio_location-icon_stock.svg",         label: "Location"         },
  { src: "/portfolio/gmunchies/portfolio_office-building-icon_stock.svg",  label: "Office Building"  },
  { src: "/portfolio/gmunchies/portfolio_school-icon_stock.svg",           label: "School"           },
  { src: "/portfolio/gmunchies/portfolio_ware-house-icon_stock.svg",       label: "Warehouse"        },
];

/* ─────────────────────────────────────────────────────
   Page
───────────────────────────────────────────────────── */
export default function PortfolioGmunchies() {
  return (
    <main className="gm-page">

      {/* ══════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════ */}
      <section className="section-full gm-hero">
        <div className="gm-container gm-hero__inner">
          <div className="gm-hero__identity">
            <p className="gm-hero__eyebrow">Brand Identity 2025</p>
            <h1 className="gm-hero__title">Gmunchies</h1>
            <p className="gm-hero__subtitle">Vending Machine Brand</p>
            <p className="gm-hero__desc">
              Gmunchies brings good energy to every vending interaction. Built around
              the idea that a quick snack or coffee should feel like a moment worth
              having, the brand fuses bold visuals with a playful character to make
              every touchpoint memorable. From the first glance to the last sip,
              Gmunchies is designed to make you smile.
            </p>
          </div>

          <nav className="gm-toc" aria-label="Document contents">
            <p className="gm-toc__heading">Contents</p>
            <TocList nodes={tocTree} depth={0} />
          </nav>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          LOGO
      ══════════════════════════════════════════════ */}
      <section className="section-regular gm-section" id="gm--logo">
        <span className="gm-section__label">Branding</span>
        <h2 className="gm-section__title">Logo</h2>
        <p className="gm-section__desc">
          The Gmunchies logo is a direct expression of the brand's character. Bold,
          rounded, and unapologetically fun, it commands attention without aggression.
          Designed to work at any scale, from a vending machine fascia to a mobile
          screen, the mark always lands with clarity, warmth, and a personality that
          is impossible to ignore.
        </p>
        <div className="gm-asset">
          <Image
            src="/portfolio/gmunchies/portfolio_logo.svg"
            width={600}
            height={600}
            alt="Gmunchies logo"
            className="gm-asset__img gm-asset__img--centered"
          />
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          COLORS
      ══════════════════════════════════════════════ */}
      <section className="section-regular gm-section" id="gm--colors">
        <span className="gm-section__label">Branding</span>
        <h2 className="gm-section__title">Colors</h2>
        <p className="gm-section__desc">
          Signal red and sunshine yellow are the brand's energy drivers: vivid, warm,
          and impossible to ignore. Together they communicate passion, appetite, and joy.
          Midnight black provides the structural contrast that anchors the palette and
          makes everything pop. A warm tan rounds out the system, adding approachability
          and comfort that softens the overall tone without losing the brand's fire.
        </p>
        <div className="gm-colors">
          {brandColors.map((color) => (
            <div key={color.hex} className="gm-color-card">
              <div className="gm-color-card__swatch" style={{ backgroundColor: color.hex }} />
              <div className="gm-color-card__info">
                <p className="gm-color-card__name">{color.name}</p>
                <p className="gm-color-card__hex">{color.hex}</p>
                <p className="gm-color-card__role">{color.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          MASCOT
      ══════════════════════════════════════════════ */}
      <section className="section-regular gm-section" id="gm--mascot">
        <span className="gm-section__label">Branding</span>
        <h2 className="gm-section__title">Mascot</h2>
        <p className="gm-section__desc">
          The Gmunchies mascot is drawn in the Rubber Hose style, a nod to the golden
          age of animation, reimagined for 2026. The character is exaggerated, expressive,
          and full of life. Every curve and pose radiates the same message: this is fun,
          this is easy, this is Gmunchies. Vintage in spirit, completely modern in
          execution.
        </p>
        <div className="gm-asset gm-asset--mascot">
          <Image
            src="/portfolio/gmunchies/portfolio_mascot.svg"
            width={800}
            height={800}
            alt="Gmunchies mascot"
            className="gm-asset__img gm-asset__img--mascot"
          />
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          TEXT LOGO
      ══════════════════════════════════════════════ */}
      <section className="section-regular gm-section" id="gm--text-logo">
        <span className="gm-section__label">Branding</span>
        <h2 className="gm-section__title">Text Logo</h2>
        <p className="gm-section__desc">
          The typographic identity mirrors the mascot's attitude. Playful, rounded
          letterforms carry the same cartoonish energy as the visual system, binding
          the wordmark and the character into a cohesive whole. The tagline delivers
          the brand promise without overthinking it. Vending that is easy, enjoyable,
          and always there when you need it.
        </p>
        <div className="gm-asset">
          <Image
            src="/portfolio/gmunchies/portfolio_typography.svg"
            width={900}
            height={400}
            alt="Gmunchies text logo and typography"
            className="gm-asset__img"
          />
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          ICONS intro
      ══════════════════════════════════════════════ */}
      <section className="section-regular gm-section" id="gm--icons">
        <span className="gm-section__label">Branding</span>
        <h2 className="gm-section__title">Icons</h2>
        <p className="gm-section__desc">
          The Gmunchies icon system is built in two tiers. Custom icons define the
          core product world, crafted exclusively for this brand. Stock location icons
          extend that identity into every environment where a Gmunchies machine might
          live: consistent, clear, and always on-brand.
        </p>
      </section>

      {/* ── Custom Icons ─────────────────────────────── */}
      <section className="section-regular gm-section" id="gm--icons-custom">
        <span className="gm-section__label">Icons</span>
        <h3 className="gm-section__title">Custom Icons</h3>
        <p className="gm-section__desc">
          Each custom icon is stripped to its essential form: legible at small sizes,
          colorful enough to carry the brand tone, and consistent enough to read as a
          family. They cover the core product categories: drinks, snacks, coffee, and
          the machine itself. Minimal in structure, unmistakably Gmunchies in character.
        </p>
        <div className="gm-icons-grid">
          {customIcons.map((icon) => (
            <div key={icon.src} className="gm-icon-card">
              <div className="gm-icon-card__img-wrap">
                <Image
                  src={icon.src}
                  width={120}
                  height={120}
                  alt={icon.label}
                  className="gm-icon-card__img"
                />
              </div>
              <p className="gm-icon-card__label">{icon.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Stock Icons ──────────────────────────────── */}
      <section className="section-regular gm-section" id="gm--icons-stock">
        <span className="gm-section__label">Icons</span>
        <h3 className="gm-section__title">Stock Icons</h3>
        <p className="gm-section__desc">
          The stock location set covers every environment where a Gmunchies machine
          might be placed: gyms, hospitals, schools, offices, warehouses, and beyond.
          Clean and consistent, they communicate placement context without competing
          with the brand's visual identity.
        </p>
        <div className="gm-icons-grid gm-icons-grid--stock">
          {stockIcons.map((icon) => (
            <div key={icon.src} className="gm-icon-card gm-icon-card--stock">
              <div className="gm-icon-card__img-wrap">
                <Image
                  src={icon.src}
                  width={100}
                  height={100}
                  alt={icon.label}
                  className="gm-icon-card__img"
                />
              </div>
              <p className="gm-icon-card__label">{icon.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          BUSINESS CARDS
      ══════════════════════════════════════════════ */}
      <section className="section-regular gm-section" id="gm--business-cards">
        <span className="gm-section__label">Branding</span>
        <h2 className="gm-section__title">Business Cards</h2>
        <p className="gm-section__desc">
          The business card takes the brand into the physical world. Front and back
          are tightly coordinated: bold enough to make an immediate impression,
          structured enough to communicate the essentials. The card is the brand
          in your hand.
        </p>
        <div className="gm-cards-surface">
          <div className="gm-card-wrap">
            <Image
              src="/portfolio/gmunchies/portfolio_business-cards_front.svg"
              width={600}
              height={340}
              alt="Gmunchies business card front"
              className="gm-card__img"
            />
          </div>
          <div className="gm-card-wrap">
            <Image
              src="/portfolio/gmunchies/portfolio_business-cards_back.svg"
              width={600}
              height={340}
              alt="Gmunchies business card back"
              className="gm-card__img"
            />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          WEBSITE WIP
      ══════════════════════════════════════════════ */}
      <section className="section-regular gm-section gm-section--wip" id="gm--website">
        <span className="gm-section__label">Branding</span>
        <h2 className="gm-section__title">Website</h2>
        <p className="gm-section__desc">Coming soon.</p>
      </section>

    </main>
  );
}
