"use client";
import Link from "next/link";
import "./Logo.css";
import { useState } from "react";

export default function Logo({ size, link }: { size: string; link: string }) {
  const [message] = useState<string[]>([
    'Comming Soon',
    'I also cant wait!',
    'Be patient...',
    'Please stop.',
    "Please stop!!",
    "Ok you are being annoying.",
    "I will ignore you!",
    "Ignoring you...",
    "Again, ignoring you...",
    "...",

  ]);
  const [counter, setCoutner] = useState(0)
  const handleClick = () => {
    setCoutner((prev) => prev +1 ) 
  };
  if(counter >= message.length){
     window.location.href ='https://www.youtube.com/watch?v=5Y-HoOFMlpI'
 
  }
  return (
      <Link className="flex flex-col gap-4 items-center" onClick={handleClick} href={link}>
        <div style={{ width: size, height: size }} className="logoWrapper">
          <div className="hair"> </div>
          <div className="glasses">
            <div className="glassessMask"></div>
          </div>
          <div className="beard"></div>
          <div className="lips"></div>
        </div>
              <div>{message[counter]}</div>
      </Link>
  );
}
