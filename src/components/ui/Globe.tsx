"use client";

import { useColor } from "@/context/ColorContext";
import "./Globe.css";

export default function ThemeColorPicker() {
  const { color, setColor } = useColor();

  return (
    <input
      type="color"
      value={color}
      onChange={(e) => setColor(e.target.value)}
      className="globePicker"
    />
  );
}