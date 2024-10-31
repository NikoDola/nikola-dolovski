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
        <Image src={'./portfolio/niks/niks.svg'} alt="niks logo" width={450} height={100}></Image>
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

    <div ref={appDescription} className=" mt-24 mx-auto text-center">
      <div>
        <h5 className="text-left text-gray-500">1.App Description</h5>
        <h5 className="text-4xl text-left">Incident Counter</h5>
        <h5 className="text-4xl text-left">Web App</h5>
        <h5 className="text-left">Lorem ipsum dolor sit amet, consectetuer adipiscing elit, 
          sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna 
          aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud 
          exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. 
          Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, 
          vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim 
          qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.
        Lorem ipsum dolor sit amet, cons ectetuer adipiscing d</h5>
      </div>
      
    </div>

    </main>
 
  );
}
