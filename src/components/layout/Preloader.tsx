import { useState, useEffect, useRef } from 'react'

interface PreloaderProps {
  onComplete: () => void
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [isMobile, setIsMobile] = useState<boolean | null>(null)
  const [fade, setFade] = useState(false)
  const [visible, setVisible] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)

  // 1. Detect screen size on mount
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (mobile) {
        // If mobile, bypass the preloader immediately
        setVisible(false)
        onComplete()
      }
    }
    checkMobile()
  }, [onComplete])

  // 2. Lock body scrolling while the preloader is visible (desktop only)
  useEffect(() => {
    if (visible && isMobile === false) {
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
  }, [visible, isMobile])

  // 3. Desktop Video Autoplay Assurance & Fallback
  useEffect(() => {
    if (isMobile === false) {
      // Safety fallback: if video fails to play/end, auto-close after 3.5s
      const fallbackTimer = setTimeout(() => {
        handleExit()
      }, 3500)

      if (videoRef.current) {
        videoRef.current.muted = true
        const playPromise = videoRef.current.play()
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.warn("Autoplay was prevented or video failed to play:", error)
            handleExit()
          })
        }
      }

      return () => clearTimeout(fallbackTimer)
    }
  }, [isMobile])

  const handleExit = () => {
    setFade(true)
    const exitTimer = setTimeout(() => {
      setVisible(false)
      onComplete()
    }, 800) // matches transition duration-800
    return () => clearTimeout(exitTimer)
  }

  // If mobile or not visible, render nothing
  if (isMobile === true || !visible) return null

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-black overflow-hidden transition-opacity duration-800 ease-out flex items-center justify-center ${
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
        onEnded={handleExit}
        className="w-full h-full object-cover pointer-events-none select-none"
        style={{
          willChange: 'opacity',
          transform: 'translateZ(0)', // Force GPU rendering
        }}
      />
    </div>
  )
}

