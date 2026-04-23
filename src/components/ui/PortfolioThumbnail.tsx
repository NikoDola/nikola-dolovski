"use client"
import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import "./PortfolioThumbnail.css"

interface Props {
  images: string[]
  name: string
  description: string
  client: string
  href: string
}

const PX_PER_SECOND = 50

export default function PortfolioThumbnail({ images, name, description, client, href }: Props) {
  const isSlideshow = images.length > 1
  const [current, setCurrent] = useState(0)
  const [duration, setDuration] = useState<number | null>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearAll = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
  }

  const startInterval = () => {
    intervalRef.current = setInterval(() => {
      setCurrent((i) => (i + 1) % images.length)
    }, 3000)
  }

  useEffect(() => {
    if (!isSlideshow) return
    startInterval()
    return clearAll
  }, [isSlideshow]) // eslint-disable-line

  useEffect(() => {
    if (isSlideshow) return
    if (imgRef.current?.complete && imgRef.current.naturalWidth) {
      setDuration(imgRef.current.naturalWidth / PX_PER_SECOND)
    }
  }, [isSlideshow])

  const handleMouseEnter = () => {
    if (!isSlideshow) return
    clearAll()
    setCurrent((i) => (i + 1) % images.length)
    startInterval()
  }

  const handleMouseLeave = () => {
    if (!isSlideshow) return
    clearAll()
    timeoutRef.current = setTimeout(() => startInterval(), 3000)
  }

  const desc = description.length > 60 ? description.slice(0, 57) + "..." : description

  return (
    <Link href={href} className="pThumb" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div className="pThumb__frame">
        {isSlideshow ? (
          images.map((src, i) => (
            <div
              key={src}
              className={`pThumb__slide${i === current ? " pThumb__slide--active" : ""}`}
              style={{ backgroundImage: `url(${src})` }}
            />
          ))
        ) : (
          <div
            className="pThumb__marquee"
            style={{
              animationDuration: `${duration ?? 18}s`,
              animationPlayState: duration ? "running" : "paused",
            }}
          >
            <img
              ref={imgRef}
              src={images[0]}
              className="pThumb__img"
              alt=""
              draggable={false}
              onLoad={(e) => {
                const w = (e.currentTarget as HTMLImageElement).naturalWidth
                setDuration(w / PX_PER_SECOND)
              }}
            />
            <img src={images[0]} className="pThumb__img" alt="" draggable={false} aria-hidden="true" />
          </div>
        )}
      </div>
      <div className="pThumb__info">
        <span className="pThumb__client">{client}</span>
        <h3 className="pThumb__name">{name}</h3>
        <p className="pThumb__desc">{desc}</p>
      </div>
    </Link>
  )
}
