"use client"
import { useEffect, useRef } from "react"
import Image from "next/image"
import styles from "./AboutHero.module.css"

export default function AboutHero() {
  const imgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => {
      if (imgRef.current) {
        imgRef.current.style.transform = `translateY(${window.scrollY * 0.35}px)`
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <section className={styles.hero}>
      <div className={styles.imgWrapper} ref={imgRef}>
        <Image
          src="/about-hero.jpg"
          alt="Nikola Dolovski"
          fill
          priority
          style={{ objectFit: "cover", objectPosition: "center top" }}
        />
      </div>
      <div className={styles.overlay} />
      <div className={styles.text}>
        <h1 className={styles.title}>NIKOLA<br />DOLOVSKI</h1>
        <p className={styles.role}>Branding, UI/UX and Web Developer</p>
        <p className={styles.bio}>
          I help brands find their visual voice. From naming and identity to interfaces and code,
          I work across the full spectrum of brand building, combining strategic thinking with a sharp eye
          for design and a developer&apos;s instinct for making it work in the real world.
          With over 14 years in the field, I have partnered with startups, established businesses,
          and creative studios across multiple industries.
        </p>
        <a className={styles.cv} href="/about-me/Nikola-Dolovski_CV.pdf" download>
          Download CV
        </a>
      </div>
    </section>
  )
}
