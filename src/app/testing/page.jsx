"use client";

import { useEffect, useState } from "react";

export default function BrandingCalculator() {
  const [LSD, setLSD] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("branding-calculator");

    if (!saved) {
      fetch("/api/branding-calculator")
        .then((res) => res.json())
        .then((data) => {
          setLSD(data);
          localStorage.setItem("branding-calculator", JSON.stringify(data));
        })
        .catch((err) => console.error("Fetch error:", err));
    } else {
      setLSD(JSON.parse(saved));
    }
  }, []);

  const handleToggle = (index) => {
   
    const newLSD = [...LSD]
    newLSD[index].status = !newLSD[index].status
    setLSD(newLSD)
    localStorage.setItem("branding-calculator", JSON.stringify(newLSD));
  }

const groupItems = LSD.reduce((acc, item) => {
  if (!acc[item.category]) {
    acc[item.category] = [];
  }
  
  acc[item.category].push(item);
  return acc;
}, {});

  return (
<div>
  {Object.entries(groupItems).map(([category, items]) => (
    <div key={category}>
      <h2>{category}</h2>
      {items.map((item, index) => (
        <div key={index}>
          <h3>{item.name}</h3>
          <p>{item.status ? "true" : "false"}</p>
          <input
            type="checkbox"
            checked={item.status}
            onChange={() => handleToggle(LSD.indexOf(item))}
          />
        </div>
      ))}
    </div>
  ))}
</div>

  );
}
