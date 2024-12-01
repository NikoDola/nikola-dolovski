"use client"
import { timeStamp } from "console"
import { useState, useEffect } from "react"

export default function Home(){
  const [mainText, setMainText] = useState('Hello')
  useEffect(()=>{
    const move = (timestamp: number) =>{
      timestamp > 1000 && setMainText('My name is Nikola Dolovski')
      timestamp > 3000 && setMainText(`This is me`)
      timestamp > 4500 && setMainText(`I'm a graphic designer`)
      timestamp > 7000 && setMainText(`and this is my work!`)
      requestAnimationFrame(move)
    }
   requestAnimationFrame(move)
  }, [])
  return(
    <div>
      <p>{mainText}</p>

      <img src="./images/personal/working-pinestel.png"></img>
    </div>
  )
}