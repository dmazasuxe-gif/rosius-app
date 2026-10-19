"use client"

import { useState, useEffect, useCallback } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { LoginSlide } from "@/types/login-settings"

interface LoginCarouselProps {
  slides: LoginSlide[];
  welcomeLabel: string;
  welcomeTitle: string;
}

export function LoginCarousel({ slides, welcomeLabel, welcomeTitle }: LoginCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const activeSlides = slides.length > 0 ? slides : [
    {
      id: "fallback",
      imageUrl: "/slides/slide-1.jpg",
      tag: "Campus",
      title: "Ate"
    }
  ]

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % activeSlides.length)
  }, [activeSlides.length])

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + activeSlides.length) % activeSlides.length)
  }, [activeSlides.length])

  useEffect(() => {
    if (isPaused || activeSlides.length <= 1) return
    const timer = setInterval(nextSlide, 5000)
    return () => clearInterval(timer)
  }, [isPaused, nextSlide, activeSlides.length])

  const currentSlide = activeSlides[currentIndex] || activeSlides[0]

  return (
    <div 
      className="relative w-full h-full min-h-[560px] lg:min-h-[660px] overflow-hidden rounded-t-3xl lg:rounded-tr-none lg:rounded-l-3xl select-none group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Images */}
      {activeSlides.map((slide, index) => (
        <div
          key={slide.id || index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? "opacity-100 scale-100" : "opacity-0 scale-105 pointer-events-none"
          }`}
          style={{
            backgroundImage: `url('${slide.imageUrl}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      ))}

      {/* Blue & Navy Gradient Tint Overlay */}
      <div 
        className="absolute inset-0 bg-gradient-to-tr from-[#07182f]/95 via-[#0c2e5b]/80 to-[#124282]/65 mix-blend-multiply"
      />

      {/* Pinstripe Texture Overlay (Exact pattern like reference design) */}
      <div 
        className="absolute inset-0 opacity-25 pointer-events-none"
        style={{
          backgroundImage: "repeating-linear-gradient(90deg, transparent, transparent 18px, rgba(255, 255, 255, 0.08) 18px, rgba(255, 255, 255, 0.08) 20px)"
        }}
      />

      {/* Vertical Subtle Red Gradient on the right edge */}
      <div 
        className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#d31027]/30 to-transparent pointer-events-none"
      />

      {/* TOP-LEFT: Welcome Title with White Bar */}
      <div className="absolute top-10 left-10 z-10 flex items-start gap-3">
        <div className="w-[3px] h-12 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
        <div>
          <p className="text-[11px] font-semibold tracking-widest text-white/80 uppercase">
            {welcomeLabel}
          </p>
          <h2 className="text-2xl lg:text-3xl font-extrabold tracking-wide text-white drop-shadow-md">
            {welcomeTitle}
          </h2>
        </div>
      </div>

      {/* Navigation Arrows */}
      {activeSlides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            aria-label="Anterior diapositiva"
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full flex items-center justify-center text-cyan-400/80 hover:text-cyan-300 hover:scale-110 active:scale-95 transition-all bg-black/10 hover:bg-black/30 backdrop-blur-sm"
          >
            <ChevronLeft className="w-8 h-8 stroke-[2.5]" />
          </button>
          <button
            onClick={nextSlide}
            aria-label="Siguiente diapositiva"
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full flex items-center justify-center text-cyan-400/80 hover:text-cyan-300 hover:scale-110 active:scale-95 transition-all bg-black/10 hover:bg-black/30 backdrop-blur-sm"
          >
            <ChevronRight className="w-8 h-8 stroke-[2.5]" />
          </button>
        </>
      )}

      {/* BOTTOM-LEFT: Tag & Title (e.g. Campus / Ate) */}
      <div className="absolute bottom-10 left-10 z-10 transition-all duration-500">
        <span className="block text-lg lg:text-xl font-medium tracking-[0.25em] text-white/70 uppercase">
          {currentSlide.tag || "Campus"}
        </span>
        <h3 className="text-3xl lg:text-4xl font-black tracking-wider text-white drop-shadow-lg">
          {currentSlide.title || "Principal"}
        </h3>
      </div>

      {/* BOTTOM-CENTER: Pagination Dots */}
      {activeSlides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {activeSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Ir a diapositiva ${idx + 1}`}
              className={`h-2 transition-all rounded-full ${
                idx === currentIndex
                  ? "w-6 bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]"
                  : "w-2 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
