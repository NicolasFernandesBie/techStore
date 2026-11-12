'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'

const slides = [
  { src: '/videos/hero-1.mp4', label: 'Periféricos' },
  { src: '/videos/hero-2.mp4', label: 'Hardware' },
  { src: '/videos/hero-3.mp4', label: 'Mesas digitalizadoras' },
]

const AUTOPLAY_MS = 8000

export function HeroCarousel() {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])

  function goTo(index: number) {
    setActive((index + slides.length) % slides.length)
  }

  useEffect(() => {
    if (paused) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const next = (active + 1) % slides.length
    const timer = window.setTimeout(() => setActive(next), AUTOPLAY_MS)
    return () => window.clearTimeout(timer)
  }, [active, paused])

  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (!video) return
      video.muted = true
      if (index === active) {
        video.play().catch(() => {})
      } else {
        video.pause()
      }
    })
  }, [active])

  return (
    <section
      id="hero"
      className="relative isolate -mt-[6.5rem] h-svh overflow-hidden bg-slate-950 lg:-mt-16"
      aria-roledescription="carrossel"
      aria-label="Destaques da TechStore"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {slides.map((slide, index) => (
        <video
          key={slide.src}
          ref={(element) => {
            videoRefs.current[index] = element
          }}
          src={slide.src}
          autoPlay
          muted
          loop
          playsInline
          preload={index === 0 ? 'auto' : 'metadata'}
          aria-hidden={index !== active}
          className={clsx(
            'absolute inset-0 h-full w-full object-cover transition-opacity duration-1000',
            index === active ? 'opacity-100' : 'opacity-0',
          )}
        />
      ))}

      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-slate-950/70 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/45 to-slate-950/10" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-slate-950/80 to-transparent" />

      <div className="container-page relative flex h-full flex-col justify-end pb-20 sm:justify-center sm:pb-0">
        <div className="max-w-xl text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
            TechStore
          </p>
          <h1 className="mt-4 text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            Seu próximo nível começa aqui.
          </h1>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/75 sm:text-base">
            Periféricos, hardware e mesas digitalizadoras para jogar, criar e produzir.
          </p>
          <div className="mt-7">
            <Link
              href="/produtos"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-white/25 bg-white/10 px-6 py-3 text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_8px_32px_rgba(0,0,0,0.28)] backdrop-blur-xl backdrop-saturate-150 transition duration-300 hover:border-white/40 hover:bg-white/20"
            >
              <span className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/25 via-white/5 to-transparent opacity-70 transition-opacity duration-300 group-hover:opacity-100" />
              <span className="relative z-10">Explorar catálogo</span>
              <ArrowRight className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-6 z-10">
        <div className="container-page flex items-center justify-between">
          <div className="flex items-center gap-2">
            {slides.map((slide, index) => (
              <button
                key={slide.src}
                type="button"
                onClick={() => goTo(index)}
                aria-label={`Ir para o slide ${index + 1}: ${slide.label}`}
                aria-current={index === active}
                className={clsx(
                  'h-1 rounded-full transition-all duration-300',
                  index === active ? 'w-8 bg-white' : 'w-4 bg-white/40 hover:bg-white/70',
                )}
              />
            ))}
          </div>

          <p className="font-mono text-[11px] tracking-[0.2em] text-white/60">
            {String(active + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
          </p>
        </div>
      </div>
    </section>
  )
}
