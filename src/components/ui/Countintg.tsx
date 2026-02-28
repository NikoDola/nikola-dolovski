"use client"

import { useState, useRef, useEffect, useCallback } from "react"

export default function Counting({ text, number }: { text: string; number: number }) {
  const [count, setCount] = useState(0)
  const anmRef = useRef<number | null>(null)
  const scrollOnRef = useRef<HTMLDivElement | null>(null)
  const startedRef = useRef(false)

  const animate = useCallback((startTime?: number) => {
    const duration = 500

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
  }, [number])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]

        if (entry.isIntersecting && !startedRef.current) {
          startedRef.current = true
          animate()
        }
      },
      { threshold: 0.5 }
    )

    if (scrollOnRef.current) {
      observer.observe(scrollOnRef.current)
    }

    return () => {
      observer.disconnect()
      if (anmRef.current) {
        cancelAnimationFrame(anmRef.current)
      }
    }
  }, [animate])

  return (
    <div ref={scrollOnRef} className="cardWrapper">
      <p>{text}</p>
      <h3>{count}</h3>
    </div>
  )
}