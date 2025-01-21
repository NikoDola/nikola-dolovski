"use client"

import { useState, useEffect } from "react"
import "@/components/Introduce.css"

export default function Home() {
  const [mainText, setMainText] = useState('Hello')
  const [styleText, setStyleText] = useState('hello')

  useEffect(() => {
    const move = (timestamp: number) => {
      if (timestamp > 1000){ 
        setMainText('My name is Nikola Dolovski') 
        setStyleText('nameLastName')}
      if (timestamp > 3000) setMainText('and I\' m a Visual Designer')
      if (timestamp > 4500) setMainText('I helped a lot of branding')
      if (timestamp > 7000) setMainText('Need Help with yours?')
      if (timestamp > 9000) setMainText('Le\'s connect!')

      requestAnimationFrame(move)
    }
    requestAnimationFrame(move)
  }, [])

  return (
    <div className="Div">
      <p className={styleText}>{mainText}</p>
    </div>
  )
}
