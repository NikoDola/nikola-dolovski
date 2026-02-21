import { useState } from "react";
import "./BrandingCalculator.css";

const SERVICES = [
  { id: 1, label: "Logo Design", description: "Custom logo tailored to your brand identity" },
  { id: 2, label: "Brand Identity Guide", description: "Full style guide with colors, fonts, and usage rules" },
  { id: 3, label: "Business Card Design", description: "Print-ready professional business card layout" },
  { id: 4, label: "Social Media Kit", description: "Branded templates for Instagram, Facebook & LinkedIn" },
  { id: 5, label: "Email Signature", description: "Consistent branded email signature design" },
  { id: 6, label: "Brand Color Palette", description: "Curated primary and secondary color system" },
  { id: 7, label: "Typography Selection", description: "Font pairing that matches your brand tone" },
  { id: 8, label: "Website Banner", description: "Hero banner design for your homepage" },
  { id: 9, label: "Packaging Design", description: "Product packaging that stands out on shelves" },
  { id: 10, label: "Brand Photography Direction", description: "Art direction guide for your brand photo shoots" },
];

const PRICE_PER_SERVICE = 20;

export default function BrandingCalculator() {
  const [selected, setSelected] = useState<number[]>([]);

  const toggle = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const total = selected.length * PRICE_PER_SERVICE;

  const handleSubmit = () => {
    alert(`Order submitted!\n${selected.length} services — Total: $${total}`);
  };

  return (
    <div className="bcWrapper">
      <h1 className="bcTitle">Branding Calculator</h1>
      <p className="bcSubtitle">Select the services you need. Each service is <strong>$20</strong>.</p>

      <div className="bcGrid">
        {SERVICES.map((service) => {
          const isChecked = selected.includes(service.id);
          return (
            <label
              key={service.id}
              className={`bcCard ${isChecked ? "bcCard--active" : ""}`}
            >
              <input
                type="checkbox"
                className="bcCheckbox"
                checked={isChecked}
                onChange={() => toggle(service.id)}
              />
              <div className="bcCardContent">
                <span className="bcCardLabel">{service.label}</span>
                <span className="bcCardDesc">{service.description}</span>
                <span className="bcCardPrice">$20</span>
              </div>
            </label>
          );
        })}
      </div>

      <div className="bcSummary">
        <div className="bcSummaryInfo">
          <span className="bcSummaryItem">
            Services selected: <strong>{selected.length}</strong>
          </span>
          <span className="bcSummaryItem">
            Total price: <strong>${total}</strong>
          </span>
        </div>
        <button
          className="bcSubmitBtn"
          onClick={handleSubmit}
          disabled={selected.length === 0}
        >
          Submit Order
        </button>
      </div>
    </div>
  );
}
