"use client"
import "./Portfolio.css"
import Link from "next/link"
import Image from "next/image"

export default function Portfolio(){
  return(
    <div className="prfWrapper">
      <Link href={"/my-work/freaky"} className="card">
      <Image className="imageCard" src={"/portfolio/freaky/freaky-cover-pattern.webp"} alt="freaky-banner" width={800} height={800}/>
      </Link>

    </div>
  )
}