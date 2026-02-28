"use client";

import { createContext, useContext, useEffect, useState } from "react";

const ColorContext = createContext(undefined);

export function ColorProvider({
  children,
  primaryColor = "#4B69C6",
  secondaryColor = "#121B41",
}) {
  const [primary, setPrimary] = useState(primaryColor);
  const [secondary, setSecondary] = useState(secondaryColor);

  useEffect(() => {
    document.documentElement.style.setProperty("--primary-color", primary);
    document.documentElement.style.setProperty("--secondary-color", secondary);
  }, [primary, secondary]);

  return (
    <ColorContext.Provider
      value={{ primary, setPrimary, secondary, setSecondary }}
    >
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