"use client";
import { useState, createContext, useContext } from "react";

const SettingContext = createContext(undefined);

export function SettingProvider({ children, defaultOpen = true }) {
  const [autoColor, setAutoColor] = useState(defaultOpen);
  
  const toggle = () => setAutoColor(prev => !prev);

  return (
    <SettingContext.Provider value={{ autoColor, setAutoColor, toggle }}>
      {children}
    </SettingContext.Provider>
  );
}

export function useSetting() {
  const context = useContext(SettingContext);

  if (!context) {
    throw new Error("useSetting must be used inside SettingProvider");
  }

  return context;
}