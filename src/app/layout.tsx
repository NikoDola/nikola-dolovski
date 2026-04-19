import type { Metadata } from "next";
import React from "react";
import { Oswald, Inter } from "next/font/google";
import { ColorProvider } from "@/context/ColorContext";
import Navbar from "@/components/sections/Navbar";
import "./_styles/globals.css";

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  display: "swap",
  variable: "--font-oswald",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Niko Dola",
  description: "Branding, UI/UX & Web Developer",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const primaryColor = "#88D1D4";
  const secondaryColor = "#121B41";

  return (
    <html
      lang="en"
      className={`${oswald.variable} ${inter.variable}`}
      style={
        { "--primary-color": primaryColor, "--secondary-color": secondaryColor } as React.CSSProperties
      }
    >
      <head>
        <link rel="preconnect" href="https://nikola-dolovski.firebaseapp.com" />
        <link rel="preconnect" href="https://www.googleapis.com" />
      </head>
      <body>
        <ColorProvider primaryColor={primaryColor}>
          <Navbar />
          <div style={{ paddingTop: "72px" }}>
            {children}
          </div>
        </ColorProvider>
      </body>
    </html>
  );
}
