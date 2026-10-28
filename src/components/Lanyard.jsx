import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'
import { profile } from '../data.js'

// A 2D take on the hanging ID-badge: the strap end is a point mass on an elastic
// rope, and the card turns to follow the strap with a damped angular spring.
const GRAVITY = 2400 // px/s²
const ROPE_K = 420 // strap stiffness once it's stretched past its length
const ROPE_DAMP = 16 // damping along the strap
const AIR = 0.9 // velocity decay per second
const SPIN_K = 140 // how hard the card turns towards the strap angle
const SPIN_DAMP = 11
const BREEZE = 50 // faint sideways sway so the badge never sits dead still
const STEP = 1 / 120

const STRAP_TEXT = `${profile.name.toUpperCase()}  ·  ${profile.role.toUpperCase()}  ·  `.repeat(8)
const BARS = [1, 2, 1, 1, 3, 1, 2, 1, 1, 2, 3, 1, 1, 2, 1, 3, 1, 1, 2, 1, 2, 1]

const clamp = (n, min, max) => Math.min(max, Math.max(min, n))

export default function Lanyard({ className = '' }) {
  const wrapRef = useRef(null)
  const cardRef = useRef(null)
  const pathRef = useRef(null)
  const sheenRef = useRef(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    const wrap = wrapRef.current
    const card = cardRef.current
    const path = pathRef.current
    const sheen = sheenRef.current
    if (!wrap || !card || !path) return

    const anchor = { x: 0, y: 0 }
    const p = { x: 0, y: 0 } // strap end = top of the clasp
    const v = { x: 0, y: 0 }
    let ropeLen = 0
    let cardW = 0
    let angle = 0
    let spin = 0
    let time = 0
    let placed = false
    let drag = null
    let raf = 0
    let last = 0

    const measure = () => {
      const h = wrap.clientHeight
      cardW = card.offsetWidth
      const desktop = window.matchMedia('(min-width: 768px)').matches
      anchor.x = wrap.clientWidth / 2
      anchor.y = desktop ? -48 : -8
      ropeLen = Math.max(80, h * 0.5 - card.offsetHeight / 2 - anchor.y)

      if (!placed || reduce) {
        // Start mid-swing so the badge swings in and settles.
        const start = placed || reduce ? 0 : 0.6
        p.x = anchor.x + Math.sin(start) * ropeLen
        p.y = anchor.y + Math.cos(start) * ropeLen
        angle = -start
        placed = true
      }
    }

    const step = (dt) => {
      time += dt
      if (!drag) {
        const dx = p.x - anchor.x
        const dy = p.y - anchor.y
        const len = Math.hypot(dx, dy) || 1
        let ax = Math.sin(time * 0.9) * BREEZE
        let ay = GRAVITY
        if (len > ropeLen) {
          const nx = dx / len
          const ny = dy / len
          const pull = ROPE_K * (len - ropeLen) + ROPE_DAMP * (v.x * nx + v.y * ny)
          ax -= nx * pull
          ay -= ny * pull
        }
        v.x += ax * dt
        v.y += ay * dt
        const decay = Math.exp(-AIR * dt)
        v.x *= decay
        v.y *= decay
        p.x += v.x * dt
        p.y += v.y * dt
      }
      // Lean along the strap and trail a little when moving sideways.
      const target = -Math.atan2(p.x - anchor.x, p.y - anchor.y) + clamp(v.x * 0.00045, -0.45, 0.45)
      spin += (SPIN_K * (target - angle) - SPIN_DAMP * spin) * dt
      angle += spin * dt
    }

    const render = () => {
      card.style.transform = `translate3d(${p.x - cardW / 2}px, ${p.y}px, 0) rotate(${angle}rad)`
      card.style.visibility = 'visible'
      if (sheen) sheen.style.transform = `translateX(${clamp(angle * 160, -60, 60)}%)`

      const dx = p.x - anchor.x
      const dy = p.y - anchor.y
      const len = Math.hypot(dx, dy)
      const sag = len < ropeLen ? Math.sqrt(ropeLen * ropeLen - len * len) * 0.6 : 0
      const cx = (anchor.x + p.x) / 2
      const cy = (anchor.y + p.y) / 2 + sag
      path.setAttribute('d', `M${anchor.x},${anchor.y} Q${cx},${cy} ${p.x},${p.y}`)
    }

    const frame = (now) => {
      raf = requestAnimationFrame(frame)
      const elapsed = Math.min(0.05, last ? (now - last) / 1000 : STEP)
      last = now
      const n = Math.max(1, Math.round(elapsed / STEP))
      for (let i = 0; i < n; i++) step(elapsed / n)
      render()
    }

    const start = () => {
      if (raf) return
      last = 0
      raf = requestAnimationFrame(frame)
    }
    const stop = () => {
      cancelAnimationFrame(raf)
      raf = 0
    }

    measure()
    render()

    const resize = new ResizeObserver(() => {
      measure()
      render()
    })
    resize.observe(wrap)

    if (reduce) {
      return () => resize.disconnect()
    }

    // Only simulate while the hero is on screen.
    const visibility = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()))
    visibility.observe(wrap)

    const local = (e) => {
      const r = wrap.getBoundingClientRect()
      return { x: e.clientX - r.left, y: e.clientY - r.top }
    }

    const onDown = (e) => {
      if (e.button !== 0) return
      const pt = local(e)
      drag = { ox: pt.x - p.x, oy: pt.y - p.y, t: performance.now() }
      v.x = 0
      v.y = 0
      card.setPointerCapture(e.pointerId)
      card.style.cursor = 'grabbing'
      start()
    }

    const onMove = (e) => {
      if (!drag) return
      const pt = local(e)
      let nx = pt.x - drag.ox
      let ny = pt.y - drag.oy
      // The strap is elastic, but only so far.
      const dx = nx - anchor.x
      const dy = ny - anchor.y
      const len = Math.hypot(dx, dy)
      const max = ropeLen * 1.35
      if (len > max) {
        nx = anchor.x + (dx / len) * max
        ny = anchor.y + (dy / len) * max
      }
      const now = performance.now()
      const dt = Math.max(0.008, (now - drag.t) / 1000)
      v.x = v.x * 0.4 + ((nx - p.x) / dt) * 0.6
      v.y = v.y * 0.4 + ((ny - p.y) / dt) * 0.6
      p.x = nx
      p.y = ny
      drag.t = now
    }

    const onUp = (e) => {
      if (!drag) return
      // Holding still before letting go shouldn't fling the badge.
      if (performance.now() - drag.t > 80) {
        v.x = 0
        v.y = 0
      }
      const speed = Math.hypot(v.x, v.y)
      const cap = 3200
      if (speed > cap) {
        v.x *= cap / speed
        v.y *= cap / speed
      }
      drag = null
      card.style.cursor = ''
      if (card.hasPointerCapture(e.pointerId)) card.releasePointerCapture(e.pointerId)
    }

    card.addEventListener('pointerdown', onDown)
    card.addEventListener('pointermove', onMove)
    card.addEventListener('pointerup', onUp)
    card.addEventListener('pointercancel', onUp)

    return () => {
      stop()
      resize.disconnect()
      visibility.disconnect()
      card.removeEventListener('pointerdown', onDown)
      card.removeEventListener('pointermove', onMove)
      card.removeEventListener('pointerup', onUp)
      card.removeEventListener('pointercancel', onUp)
    }
  }, [reduce])

  return (
    <div ref={wrapRef} className={`relative ${className}`}>
      <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" aria-hidden>
        <defs>
          <path id="lanyard-strap" ref={pathRef} />
        </defs>
        <use href="#lanyard-strap" fill="none" stroke="#2c2c31" strokeWidth="20" />
        <use href="#lanyard-strap" fill="none" stroke="#141417" strokeWidth="17" />
        <text className="mono" fontSize="8.5" letterSpacing="2.2" fill="#8b8b94" dominantBaseline="central">
          <textPath href="#lanyard-strap">{STRAP_TEXT}</textPath>
        </text>
      </svg>

      <div
        ref={cardRef}
        className={`absolute left-0 top-0 w-[214px] origin-top select-none sm:w-[244px] ${reduce ? '' : 'cursor-grab touch-none'}`}
        style={{ visibility: 'hidden' }}
      >
        {/* clasp */}
        <div aria-hidden className="relative mx-auto h-8 w-6">
          <div className="absolute left-1/2 top-0 size-3.5 -translate-x-1/2 rounded-full border-2 border-zinc-400/80" />
          <div className="absolute bottom-0 left-1/2 h-5 w-6 -translate-x-1/2 rounded-md bg-gradient-to-b from-zinc-300 to-zinc-500 shadow-md" />
        </div>

        <div className="relative -mt-1 overflow-hidden rounded-2xl border border-border bg-[#0e0e11] p-3 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9),inset_0_0_0_1px_rgba(255,255,255,0.03)]">
          <div aria-hidden className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-bg ring-1 ring-border" />

          <div className="flex items-center justify-between px-0.5">
            <span className="mono text-[10px] tracking-[0.16em] text-dim uppercase">ID · SJ-2020</span>
            <span className="mono flex items-center gap-1.5 text-[10px] text-muted">
              <span className="size-1.5 rounded-full bg-growth" />
              {profile.company}
            </span>
          </div>

          <div className="mt-2.5 aspect-[4/5] overflow-hidden rounded-xl bg-elevated">
            <img
              src={profile.photo}
              alt={profile.name}
              width="600"
              height="900"
              draggable={false}
              className="h-full w-full origin-[50%_28%] scale-[1.3] object-cover object-[50%_25%]"
            />
          </div>

          <p className="mt-3 text-[17px] font-semibold tracking-tight text-text">{profile.name}</p>
          <p className="text-[12px] text-muted">{profile.role}</p>

          <div className="mt-3 flex items-end justify-between gap-3 border-t border-border/70 pt-3">
            <p className="mono text-[9.5px] leading-relaxed tracking-[0.12em] text-dim uppercase">
              Coimbatore · IN
              <br />
              Since 2020
            </p>
            <div aria-hidden className="flex h-6 items-stretch gap-px">
              {BARS.map((w, i) => (
                <span key={i} className="bg-muted/60" style={{ width: w }} />
              ))}
            </div>
          </div>

          <div
            ref={sheenRef}
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,transparent_35%,rgba(255,255,255,0.06)_50%,transparent_65%)]"
          />
        </div>
      </div>
    </div>
  )
}
