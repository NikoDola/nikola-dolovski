"use client"
import "./UnderConstraction.css"
import Logo from "@/components/client/Logo"

export default function UnderConstraction(){
  return(
   
      <div className="underWrapper">
        <h1>UNDER <br/>CONSTRUCTION</h1>
        <p>Click me</p>
        <span className="inline-block rotate-[270deg] text-2xl mb-4">&lt;</span>
        <Logo  size="10em" link="/"/>
      </div>
   
  )
}