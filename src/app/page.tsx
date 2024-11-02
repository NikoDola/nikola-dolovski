"use client"

import Image from "next/image";
import { useRef } from "react";

export default function Home() {
  const appDescription = useRef<HTMLDivElement | null>(null);

  const handleScroll = () => {
    if(appDescription.current){
      appDescription.current.scrollIntoView({behavior: 'smooth'})
    }
    
  };

  return (
    <main className="relative w-[80%] mx-auto">
      <div className="flex mx-auto items-center justify-center gap-4 w-1/2 mt-24">
        <h5 className="text-5xl text-right flex-1">Incident Counter WebApp</h5>
        <Image src={'/portfolio/niks/1.jpg'} width={600} height={400} alt="niks image" />

      </div>

      <div className="mt-24 mx-auto flex gap-24 justify-center ">
        <ul className=" list-disc flex flex-col gap-8">
          <li className="cursor-pointer" onClick={handleScroll}>App description</li>
          <li>Tools</li>
          <li>Code Stracture</li>
          <li>Style</li>
          <li>Colors</li>
          <li>Fonts</li>
          <li>Css</li>
        </ul>
        <ul className="list-disc flex flex-col gap-8">
        <li>Wireframes</li>
          <li>Desctop Screens</li>
          <li>Mobile Screens</li>
          <li>Icons</li>
          <li>UI elements</li>
          <li>Source Links</li>
          <li>Loading Screen </li>
          <li>Thank You</li>
        </ul>
      </div>

    <div ref={appDescription} className=" mt-24 mx-auto text-center flex gap-24">
      <div className="flex-1">
        <h5 className="text-left text-gray-600 mb-4">1.App Description</h5>
        <h5 className="text-4xl text-left text-pink-400">Incident Counter</h5>
        <h5 className="text-4xl text-left text-pink-400 mb-8">Web App</h5>
        <h5 className="text-left text-gray-300">Days Without Incident is a web application initially developed for Nik’s, a 
          Swedish chocolate company, to promote safety and track incident-free days in the workplace.
          The primary function of the app is to log and display the number of consecutive days without any incidents 
          or accidents, helping teams celebrate safety milestones and monitor progress.
          Beyond tracking incidents, Days Without Incident offers robust management features. Users can 
          organize and oversee departments, employees, and incidents in one centralized platform. This makes it a valuable 
          tool not only for safety tracking but also for maintaining an organized record of activities, 
          ensuring a safer, more efficient work environment.</h5>
      </div>
      <Image className="flex-2" src={'/portfolio/niks/1.jpg'} width={600} height={0} alt="niks image"></Image>
    </div>

    </main>
 
  );
}
