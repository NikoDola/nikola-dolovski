"use client"

import { useState, useRef, useEffect } from "react"

export default function Counting({ text, number }: { text: string; number: number }) {
  const [count, setCount] = useState(0)
  const anmRef = useRef<number | null>(null)
  const scrollOnRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      const rect = scrollOnRef.current?.getBoundingClientRect()
      if (!rect) return

      const isVisible =
        rect.top < window.innerHeight &&
        rect.bottom >= 0

      if (isVisible && anmRef.current === null) {
        animate()
      }
    }

    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

function animate(startTime?: number) {
  const duration = 500 // 2 seconds total animation time

  anmRef.current = requestAnimationFrame((timestamp) => {
    if (!startTime) startTime = timestamp

    const progress = timestamp - startTime
    const percentage = Math.min(progress / duration, 1)

    const newValue = Math.floor(percentage * number)
    setCount(newValue)

    if (percentage < 1) {
      animate(startTime)
    } else {
      anmRef.current = null
    }
  })
}


  return (
    <div
      ref={scrollOnRef}
      className="cardWrapper">
      <p>{text}</p>
      <h3>{count}</h3>
    </div>
  )
}
