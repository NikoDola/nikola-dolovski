"use client"
import Image from "next/image";
import { useRef } from "react";

export default function Home() {  
  const sections = {
    appDescription: useRef<HTMLDivElement | null>(null),
    tools: useRef<HTMLDivElement | null>(null)
  };

  const handleScroll = (section: keyof typeof sections) => {
    sections[section]?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className="relative w-[80%] mx-auto">
      <div className="flex mx-auto items-center justify-center gap-4 w-1/2 mt-24">
        <h5 className="text-5xl text-right flex-1">Incident Counter WebApp</h5>
        <Image src={'/portfolio/niks/niks.svg'} alt="niks logo" width={450} height={0} />
      </div>

      <div className="mt-24 mx-auto flex gap-24 justify-center">
        <ul className="list-disc flex flex-col gap-8">
          <li className="cursor-pointer" onClick={()=> handleScroll("appDescription")}>App description</li>
          <li className="cursor-pointer" onClick={()=> handleScroll("tools")}>Tools</li>
          <li>Code Structure</li>
          <li>Style</li>
          <li>Colors</li>
          <li>Fonts</li>
          <li>Css</li>
        </ul>
        <ul className="list-disc flex flex-col gap-8">
          <li>Wireframes</li>
          <li>Desktop Screens</li>
          <li>Mobile Screens</li>
          <li>Icons</li>
          <li>UI elements</li>
          <li>Source Links</li>
          <li>Loading Screen</li>
          <li>Thank You</li>
        </ul>
      </div>

        {/* App introducing */}
      <div ref={sections.appDescription} className="mt-24 mx-auto text-center flex gap-24 items-center">
        <div >
          <h5 className="text-left text-gray-600 mb-4">1. App Description</h5>
          <h5 className="text-4xl text-left text-pink-400">Incident Counter</h5>
          <h5 className="text-4xl text-left text-pink-400 mb-8">Web App</h5>
          <h5 className="text-left text-gray-300">
            Days Without Incident is a web application initially developed for Nik’s,
             a Swedish chocolate company, to promote safety and track incident-free days in
              the workplace. The primary function of the app is to log and display the number of 
              consecutive days without any incidents or accidents, helping teams celebrate safety 
              milestones and monitor progress. Beyond tracking incidents, Days Without Incident offers
               robust management features. Users can organize and oversee departments, employees, and incidents in 
               one centralized platform. This makes it a valuable tool not only for safety tracking but also for maintaining 
               an organized record of activities, ensuring a safer, more efficient work environment.
          </h5>
        </div>
        <Image src={'/portfolio/niks/1.jpg'} width={600} height={100} alt="niks image" />
      </div>

{/* Tolls */}
      <div ref={sections.tools} className="mt-24 mx-auto text-center flex flex-col gap-8 items-center">
        <div >
          <h5 className=" text-gray-600 mb-4 text-center">1. Tolls</h5>
          <h5 className="text-4xl  text-pink-400 mb-8 text-center">Tools Used</h5>
        </div>
        <div className="flex justify-between w-[40%]">
          <Image src={"/icons/figma.svg"} width={30} height={30} alt="figma"/>
          <hr className="w-[2px] h-16 border-none bg-gray-900 mx-2" />
          <Image src={"/icons/next.svg"} width={50} height={50} alt="next.js"/>
          <hr className="w-[2px] h-16 border-none bg-gray-900 mx-2" />
          <Image src={"/icons/typescript.svg"} width={50} height={50} alt="typescript"/>
          <hr className="w-[2px] h-16 border-none bg-gray-900 mx-2" />
          <Image src={"/icons/firebase.svg"} width={40} height={40} alt="firebase"/>
        </div>
       
          <div className="mt-24 w-full  flex justify-start gap-4">
            <h5 className="text-left text-4xl">Figma</h5>
            <Image src={"/icons/figma.svg"} width={30} height={30} alt="figma"/>
          </div>
          <h2 className="text-left">In addition to building the app, I used Figma to design its layout and user interface. Figma allowed me to plan and visualize the app’s
            structure before coding, ensuring a smoother development process. As someone who values good design, it was essential to create a user-friendly 
            and intuitive interface, and Figma made it easy to experiment with different layouts and elements. 
            This design foundation helped guide the development of the app, ensuring both functionality and aesthetics were aligned from the start.
          </h2>

          <div className="mt-14 w-full  flex justify-start gap-4">
            <h5 className="text-left text-4xl">Next.js</h5>
            <Image src={"/icons/next.svg"} width={30} height={30} alt="figma"/>
          </div>
          <h2 className="text-left">While I could have easily built this using React, 
            I deliberately chose Next.js to expand my skills in a more structured and feature-rich environment.
             Next.js not only simplifies creating dynamic routes but also enhances the flexibility of layouts, 
             making it an ideal framework for complex applications. Additionally, its built-in optimizations, 
             such as server-side rendering (SSR) and static site generation (SSG), provide significant performance benefits. 
             I’m enjoying the challenge of leveraging Next.js’s powerful features, which goes beyond what I could achieve with React alone.
          </h2>

          <div className="mt-14 w-full  flex justify-start gap-4">
            <h5 className="text-left text-4xl">Typescript</h5>
            <Image src={"/icons/typescript.svg"} width={30} height={30} alt="figma"/>
          </div>
          <h2 className="text-left">I decided to use TypeScript for this project, even though I’m still 
            a beginner with it. While it was challenging at first, especially in 
            setting up types for Firestore data and managing type safety, it has 
            been a great learning experience. TypeScript’s strong typing system 
            helped me catch errors early and define clear data structures for 
            departments, accidents, and employees. Despite the initial
             difficulty, using TypeScript ultimately made the app more 
             reliable and maintainable, and I’m excited to continue improving
              my skills with it.
          </h2>

          <div className="mt-14 w-full  flex justify-start gap-4">
            <h5 className="text-left text-4xl">Firebase</h5>
            <Image src={"/icons/firebase.svg"} width={30} height={30} alt="figma"/>
          </div>
          <h2 className="text-left">I chose Firebase for its versatile backend 
            services, particularly Authentication, Firestore, and Storage. 
            Firebase Authentication made it easy to set up secure user login, 
            while Firestore provided a flexible structure for managing data like 
            departments, accidents, and employee details. Firebase Storage was 
            also ideal for handling employee images, allowing for secure and 
            efficient media storage and retrieval. This combination streamlined 
            both data and media management, enabling me to focus on building 
            core features.
          </h2>
      </div>

      <div>
        <video></video>
      </div>

    </main>
  );
}
