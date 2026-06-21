import { useState, useEffect, useRef } from 'react'

interface PreloaderProps {
  onComplete: () => void
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [videoReady, setVideoReady] = useState(false)
  const [fade, setFade] = useState(false)
  const [visible, setVisible] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    // Lock body scrolling while the preloader is visible
    if (visible) {
      document.body.style.overflow = 'hidden'
      document.documentElement.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
    }
  }, [visible])

  // Autoplay assurance & safety fallback
  useEffect(() => {
    // Safety fallback: if video fails to play/end, auto-close after 3.5s
    const fallbackTimer = setTimeout(() => {
      handleExit()
    }, 3500)

    if (videoRef.current) {
      videoRef.current.muted = true
      // Explicitly call play to ensure modern mobile browsers trigger autoplay
      const playPromise = videoRef.current.play()
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.warn("Autoplay was prevented or video failed to play:", error)
          // Fade out immediately to avoid blocking the user if autoplay fails
          handleExit()
        })
      }
    }

    return () => {
      clearTimeout(fallbackTimer)
    }
  }, [])

  const handleExit = () => {
    setFade(true)
    const exitTimer = setTimeout(() => {
      setVisible(false)
      onComplete()
    }, 800) // matches transition duration-800
    return () => clearTimeout(exitTimer)
  }

  if (!visible) return null

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-[#0F1E3A] overflow-hidden transition-opacity duration-800 ease-out flex items-center justify-center ${
        fade ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <video
        ref={videoRef}
        src="/Create_a_premium_AI_powered_re_processed.mp4"
        autoPlay
        muted
        playsInline
        preload="auto"
        onPlay={() => setVideoReady(true)}
        onEnded={handleExit}
        className={`w-full h-full object-cover pointer-events-none select-none transition-opacity duration-500 ease-in-out ${
          videoReady ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          willChange: 'opacity',
          transform: 'translateZ(0)', // Force GPU rendering
        }}
      />
    </div>
  )
}

