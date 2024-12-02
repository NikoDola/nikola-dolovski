"use client"

import { useState, useEffect } from "react"

export default function Home() {
  const [mainText, setMainText] = useState('Hello')

  useEffect(() => {
    const move = (timestamp: number) => {
      if (timestamp > 1000) setMainText('My name is Nikola Dolovski')
      if (timestamp > 3000) setMainText('This is me')
      if (timestamp > 4500) setMainText('I\'m a graphic designer')
      if (timestamp > 7000) setMainText('and this is my work!')
      requestAnimationFrame(move)
    }
    requestAnimationFrame(move)
  }, [])

  return (
    <div>
      <p>{mainText}</p>
      <img src="./images/personal/working-pinestel.png" alt="Working Pinestel" />
    </div>
  )
}
