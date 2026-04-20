"use client"
import { useEffect, useRef, useState } from "react"
import styles from "./ProjectHero.module.css"

const PX_PER_SECOND = 50

interface Props {
  thumbnail: string
  eyebrow: string
  title: string
  desc?: string
}

export default function ProjectHero({ thumbnail, eyebrow, title, desc }: Props) {
  const [duration, setDuration] = useState<number | null>(null)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    if (imgRef.current?.complete && imgRef.current.naturalWidth) {
      setDuration(imgRef.current.naturalWidth / PX_PER_SECOND)
    }
  }, [])

  return (
    <section className={styles.hero}>
      <div
        className={styles.marquee}
        style={duration ? { animationDuration: `${duration}s` } : { animationPlayState: "paused" }}
      >
        <img
          ref={imgRef}
          src={thumbnail}
          className={styles.img}
          alt=""
          draggable={false}
          onLoad={(e) => {
            const w = (e.currentTarget as HTMLImageElement).naturalWidth
            setDuration(w / PX_PER_SECOND)
          }}
        />
        <img src={thumbnail} className={styles.img} alt="" draggable={false} aria-hidden="true" />
      </div>
      <div className={styles.overlay} />
      <div className={styles.content}>
        <p className={`proj-hero__eyebrow ${styles.eyebrow}`}>{eyebrow}</p>
        <h1 className={`proj-hero__title ${styles.title}`}>{title}</h1>
        {desc && <p className={`proj-hero__desc ${styles.desc}`}>{desc}</p>}
      </div>
    </section>
  )
}
