"use client";

import { createContext, useContext, useEffect, useState } from "react";

const ColorContext = createContext();

export function ColorProvider({ children, initialColor = "#ff0000" }) {
  const [color, setColor] = useState(initialColor);

  useEffect(() => {
    document.documentElement.style.setProperty("--theme-color", color);
  }, [color]);

  return (
    <ColorContext.Provider value={{ color, setColor }}>
      {children}
    </ColorContext.Provider>
  );
}

export function useColor() {
  const context = useContext(ColorContext);

  if (!context) {
    throw new Error("useColor must be used inside ColorProvider");
  }

  return context;
}