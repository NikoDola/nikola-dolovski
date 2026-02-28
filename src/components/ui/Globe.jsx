"use client";

import { useColor } from "@/context/ColorContext";
import "./Globe.css";

export default function ThemeColorPicker({color}) {
  const { primary, setPrimary, secondary, setSecondary } = useColor();

  return (
    <input
      type="color"
      value={primary}
      onChange={(e) => setPrimary(e.target.value)}
      className="globePicker"
    />
  );
}