"use client"
import Image from "next/image";
import { useRef } from "react";
import ContactForm from '@/components/ContactForm'
import Loader from "./loader/LoaderScreen"

export default function Home() {  
  const sections = {
    appDescription: useRef<HTMLDivElement | null>(null),
    tools: useRef<HTMLDivElement | null>(null),
    figma: useRef<HTMLDivElement | null>(null),
    next: useRef<HTMLDivElement | null>(null),
    firebase: useRef<HTMLDivElement | null>(null),
    typescript: useRef<HTMLDivElement | null>(null),
    codeStracture: useRef<HTMLDivElement | null>(null),
    style: useRef<HTMLDivElement | null>(null),
    loader: useRef<HTMLDialogElement | null>(null)

  };

  const handleScroll = (section: keyof typeof sections) => {
    sections[section]?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main >
      <div className="text-center items-center flex flex-col justify-center">
        
        <div className="flex gap-2 mt-3 text-4xl font-bold max-[1000px]:flex-col">
          <p className="selection:bg-pink-500">Incident Counter Web App</p>
        </div>
        <p className="font-bold tracking-widest text-lg">For</p>
        <img className=" w-1/6 mt-2 max-[1000px]:w-1/2" src={'/portfolio/niks/niks.svg'}/>
  
      </div>

      <section className="tableContents">
        <h5 className=" mt-24 mb-8 text-4xl text-center text-[#ff32ab]">Table Of Contents</h5>
        <div  className=" mx-auto flex min-w-[300px] justify-center gap-24 max-[1000px]:text-lg max-[1000px]:w-[88%] ">
          <ul className="list-disc flex flex-col gap-12" >
            <li className="cursor-pointer hover:text-[#ff32ab]" onClick={()=> handleScroll("appDescription")}> Description</li>
            <li className="cursor-pointer hover:text-[#ff32ab] m-0 leading-3"  onClick={()=> handleScroll("tools")}>Tools
              <ul className="list-decimal flex flex-col gap-4 mt-4 pl-6  text-gray-400">
                <li>Figma</li>
                <li>Next.js</li>
                <li>Typescript</li>
                <li>Firebase</li>
                </ul>
            </li>
            <li className="cursor-pointer hover:text-[#ff32ab]" onClick={()=> handleScroll("codeStracture")}>Code Structure 
              <ul className="list-decimal flex flex-col gap-2 mt-4 pl-6 text-lg text-gray-400">
                <li>Folder Structure</li>
                <li>App Flow</li>
              </ul>
            </li>
            <li>Style
              <ul className="list-decimal flex flex-col gap-4 mt-4 pl-6">
                <li>Colors</li>
                <li>Fonts</li>
                <li>Css</li>
              </ul>
            </li>
          
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
      </section>

        {/* App introducing */}
      <section ref={sections.appDescription} className="mt-24 mx-auto text-center flex gap-24 items-start max-[1200px]:flex-col">
        <div >
          <h5 className="text-left text-gray-600 mb-4">1. App Description</h5>
          <h5 className="text-4xl text-left text-[#ff32ab]">Incident Counter</h5>
          <h5 className="text-4xl text-left text-[#ff32ab] mb-8">Web App</h5>
          <h5 className="text-left text-gray-300 ">
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
      </section>

{/* Tolls */}
      <section ref={sections.tools} className="mt-24 mx-auto text-center flex flex-col gap-8 items-center">
        <div >
          <h5 className=" text-gray-600 mb-4 text-center">1. Tolls</h5>
          <h5 className="text-4xl  text-[#ff32ab] text-center">Tools Used</h5>
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
       
          <div className="mt-4 w-full flex justify-start gap-4">
            <h5 ref={sections.figma} className="text-left text-3xl">Figma</h5>
            <Image src={"/icons/figma.svg"} width={20} height={20} alt="figma"/>
          </div>
          <h2 className="text-left">In addition to building the app, I used Figma to design its layout and user interface. Figma allowed me to plan and visualize the app’s
            structure before coding, ensuring a smoother development process. As someone who values good design, it was essential to create a user-friendly 
            and intuitive interface, and Figma made it easy to experiment with different layouts and elements. 
            This design foundation helped guide the development of the app, ensuring both functionality and aesthetics were aligned from the start.
          </h2>

          <div className="mt-14 w-full   flex justify-start gap-4">
            <h5 className="text-left text-3xl">Next.js</h5>
            <Image src={"/icons/next.svg"} width={30} height={30} alt="Next.js icon svg"/>
          </div>
          <h2 className="text-left">While I could have easily built this using React, 
            I deliberately chose Next.js to expand my skills in a more structured and feature-rich environment.
             Next.js not only simplifies creating dynamic routes but also enhances the flexibility of layouts, 
             making it an ideal framework for complex applications. Additionally, its built-in optimizations, 
             such as server-side rendering (SSR) and static site generation (SSG), provide significant performance benefits. 
             I’m enjoying the challenge of leveraging Next.js’s powerful features, which goes beyond what I could achieve with React alone.
          </h2>

          <div className="mt-14 w-full   flex justify-start gap-4">
            <h5 className="text-left text-3xl">Typescript</h5>
            <Image src={"/icons/typescript.svg"} width={30} height={30} alt="Typescript icon svg"/>
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

          <div className="mt-14 w-full   flex justify-start gap-4 ">
            <h5 className="text-left text-3xl">Firebase</h5>
            <Image src={"/icons/firebase.svg"} width={30} height={30} alt="Firebase icon svg"/>
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
      </section>

      <section ref={sections.codeStracture} className="mt-24 mx-auto text-center ">
        <div>
          <h5 className="text-left text-gray-600 mb-4">1. Code Stracture</h5>
          <h5 className="text-4xl text-left mb-12 text-[#ff32ab]">Developer guidelines</h5>

          <div className="flex gap-8 mt-4 mb-24  max-[1200px]:flex-col ">

          <div className="flex gap-4 items-center ">
            <div className="w-4 h-4 bg-[#8A8A8A]"></div>
            <h5>Counter</h5>
          </div>

          <div className="flex gap-4 items-center">
            <div className="w-4 h-4 bg-yellow-300"></div>
            <h5>DashBoard</h5>
          </div>

          <div className="flex gap-4 items-center">
            <div className="w-4 h-4 bg-[#ff32ab]"></div>
            <h5>Authoriziation</h5>
          </div>

          <div className="flex gap-4 items-center">
            <div className="w-4 h-4 bg-blue-600"></div>
            <h5>Departments</h5>
          </div>

          <div className="flex gap-4 items-center ">
            <div className="w-4 h-4 bg-teal-400"></div>
            <h5>Employees</h5>
          </div>

          <div className="flex gap-4 items-center">
            <div className="w-4 h-4 bg-[#dc8cff]"></div>
            <h5>Employees</h5>
          </div>
    
          </div>

        <div className="flex justify-between mb-24 max-[1200px]:flex-col gap-8">
          <div>
            <h5 className="text-left mb-8 text-3xl">Folder Stracture</h5>
            <Image src={"/portfolio/niks/3.png"} width={200} height={40} alt="folder stracture next-app"></Image>
          </div>
          <div>
            <h5 className="text-left mb-8 text-3xl">App Flow</h5>
            <Image src={"/portfolio/niks/4.png"} width={600} height={40} alt="folder stracture next-app"></Image>
          </div>
         
        </div>

        <div>
          
        </div>
        </div>
      </section>

      <section className="mb-24" ref={sections.style}>
        <h5 className="text-left text-gray-600 mb-4">1. Style</h5>
        <h5 className="text-4xl text-left mb-12 text-[#ff32ab]">Style guildines</h5>
        <div className="mx-auto ">
          <h2 className="text-left text-3xl mb-14">Colors</h2>
          <div className="flex flex-wrap">
            <div className="flex-col rounded-2xl ml-[-30px] mt-[-30px] min-w-[300px] h-60 bg-[#ED4599] p-12  text-white z-[6]">
              <h5>#ED4599</h5>
              <h5 className="text-sm">R:237 G:69 B:153</h5>
            </div>
            <div className="flex-col rounded-2xl ml-[-30px] mt-[-30px] min-w-[300px] h-60 bg-[#EE6FAA] p-12  text-white z-[5]">
              <h5>#EE6FAA</h5>
              <h5 className="text-sm">R:237 G:69 B:153</h5>
            </div>
            <div className="flex-col rounded-2xl ml-[-30px] mt-[-30px] min-w-[300px] h-60 bg-[#FFFFFF] p-12  text-black z-[4]">
              <h5>#FFFFFF</h5>
              <h5 className="text-sm">R:237 G:69 B:153</h5>
            </div>
            <div className="flex-col rounded-2xl ml-[-30px] mt-[-30px] min-w-[300px] h-60 bg-[#EBEBEB] p-12  text-black z-[3]">
              <h5>#EBEBEB</h5>
              <h5 className="text-sm">R:237 G:69 B:153</h5>
            </div>
            <div className="flex-col rounded-2xl ml-[-30px] mt-[-30px] min-w-[300px] h-60 bg-[#282827] p-12  text-white z-[2]">
              <h5>#282827</h5>
              <h5 className="text-sm">R:237 G:69 B:153</h5>
            </div>
            <div className="flex-col rounded-2xl ml-[-30px] mt-[-30px] min-w-[300px] h-60 bg-[#111111] p-12  text-white z-[1]">
              <h5>#111111</h5>
              <h5 className="text-sm">R:237 G:69 B:153</h5>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-24" ref={sections.loader}>
        <h5 className="text-left text-gray-600 mb-4">1. Loader Animation</h5>
        <h5 className="text-4xl text-left mb-12 text-[#ff32ab]">Loader</h5>
  
        <div className="flex flex-col items-start gap-32  w-full">
        <h5>The Loader was inspired from the Nik&apos;s exclamation mark. 
            They use the exclemation mark for a symbol icon for there brand.
            And the loader represent the searching for the right path.
          </h5>
          <div className="flex gap-24 justify-start">
            <Loader/>
  
            <img className="w-[60rem]" src="/portfolio/niks/niks-loader-example.svg"/>
          </div>
         
        </div>
       
       
      </section>
      <section>
      <video className="h-[100vh] w-full" src="/images/personal/vide%20mockup.mp4" autoPlay muted loop>
  Your browser does not support the video tag.
</video>


      </section>
      
    <ContactForm/>
    </main>
  );
}
