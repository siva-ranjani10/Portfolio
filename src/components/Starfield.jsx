import { useEffect, useMemo, useState } from 'react'

// Deterministic PRNG so the star layout is stable between renders.
function makeStars(count, seed) {
  let s = seed
  const rand = () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
  return Array.from({ length: count }, (_, id) => ({
    id,
    x: rand() * 100,
    y: rand() * 100,
    size: rand() * 2.2 + 0.6,
    opacity: rand() * 0.55 + 0.2,
    duration: rand() * 3.5 + 2,
    delay: rand() * 5,
  }))
}

export default function Starfield() {
  const [mobile, setMobile] = useState(false)

  useEffect(() => {
    const onResize = () => setMobile(window.innerWidth < 768)
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const faint = useMemo(() => makeStars(mobile ? 70 : 140, 42), [mobile])
  const bright = useMemo(() => makeStars(mobile ? 18 : 40, 99), [mobile])

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_15%_10%,rgba(255,255,255,0.035),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_45%_at_90%_80%,rgba(255,255,255,0.02),transparent_50%)]" />
      {faint.map((star) => (
        <span
          key={`f-${star.id}`}
          className="site-star absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            opacity: star.opacity,
            animationDuration: `${star.duration}s`,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}
      {bright.map((star) => (
        <span
          key={`b-${star.id}`}
          className="site-star-bright absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size + 0.8,
            height: star.size + 0.8,
            animationDuration: `${star.duration + 1}s`,
            animationDelay: `${star.delay}s`,
            boxShadow: '0 0 6px rgba(255,255,255,0.4)',
          }}
        />
      ))}
    </div>
  )
}
