import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { designCategories, designs } from '../data.js'

const INITIAL_COUNT = 12

function Lightbox({ items, index, onClose, onStep }) {
  const closeRef = useRef(null)
  const item = items[index]

  useEffect(() => {
    closeRef.current?.focus()
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onStep(1)
      if (e.key === 'ArrowLeft') onStep(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, onStep])

  const navButton =
    'flex size-11 items-center justify-center rounded-full border border-border/70 bg-bg/60 text-muted backdrop-blur-xl transition hover:border-dim hover:text-text'

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex flex-col bg-bg/90 backdrop-blur-md"
      onClick={onClose}
    >
      <div className="flex items-center justify-between gap-3 px-4 pt-4 sm:px-6 sm:pt-6">
        <p className="mono text-[11px] text-dim tabular-nums">
          {String(index + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
        </p>
        <button ref={closeRef} type="button" aria-label="Close" onClick={onClose} className={navButton}>
          <X size={18} />
        </button>
      </div>

      <div className="flex min-h-0 flex-1 items-center justify-center gap-2 px-2 py-4 sm:gap-4 sm:px-6">
        <button
          type="button"
          aria-label="Previous design"
          onClick={(e) => {
            e.stopPropagation()
            onStep(-1)
          }}
          className={`${navButton} hidden shrink-0 sm:flex`}
        >
          <ChevronLeft size={18} />
        </button>
        <motion.figure
          key={item.src}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25 }}
          className="flex h-full min-w-0 flex-col items-center justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={item.src}
            alt={item.title}
            className="max-h-[66vh] max-w-full rounded-xl border border-border/60 object-contain sm:max-h-[74vh]"
          />
          <figcaption className="mt-4 text-center">
            <p className="text-sm font-medium text-text">{item.title}</p>
            <p className="mono mt-1 text-[11px] tracking-[0.12em] text-dim uppercase">{item.category}</p>
          </figcaption>
        </motion.figure>
        <button
          type="button"
          aria-label="Next design"
          onClick={(e) => {
            e.stopPropagation()
            onStep(1)
          }}
          className={`${navButton} hidden shrink-0 sm:flex`}
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="flex justify-center gap-3 pb-6 sm:hidden" onClick={(e) => e.stopPropagation()}>
        <button type="button" aria-label="Previous design" onClick={() => onStep(-1)} className={navButton}>
          <ChevronLeft size={18} />
        </button>
        <button type="button" aria-label="Next design" onClick={() => onStep(1)} className={navButton}>
          <ChevronRight size={18} />
        </button>
      </div>
    </motion.div>
  )
}

export default function DesignGallery() {
  const [filter, setFilter] = useState('All')
  const [showAll, setShowAll] = useState(false)
  const [open, setOpen] = useState(null)

  const filtered = filter === 'All' ? designs : designs.filter((d) => d.category === filter)
  const visible = showAll ? filtered : filtered.slice(0, INITIAL_COUNT)
  const countFor = (category) => (category === 'All' ? designs.length : designs.filter((d) => d.category === category).length)

  const step = (dir) => setOpen((i) => (i + dir + filtered.length) % filtered.length)

  return (
    <div id="design" className="mt-16 scroll-mt-24 sm:mt-24 sm:scroll-mt-28">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        className="max-w-xl"
      >
        <p className="mono text-[11px] tracking-[0.18em] text-dim uppercase sm:text-xs">Graphic design</p>
        <h3 className="mt-3 text-xl font-semibold tracking-tight text-text sm:text-2xl">Posters, packaging &amp; brand design</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted sm:text-base">
          Brand posters, product creatives, social media graphics and packaging — built with Canva &amp; Photoshop for real
          clients across industries.
        </p>
      </motion.div>

      <div className="mt-6 flex flex-wrap gap-2 sm:mt-8" role="group" aria-label="Filter designs">
        {designCategories.map((category) => (
          <button
            key={category}
            type="button"
            aria-pressed={filter === category}
            onClick={() => {
              setFilter(category)
              setShowAll(false)
            }}
            className={`inline-flex min-h-9 items-center gap-2 rounded-full border px-3.5 py-1.5 text-[13px] transition ${
              filter === category
                ? 'border-dim bg-elevated text-text'
                : 'border-border/70 text-muted hover:border-dim hover:text-text'
            }`}
          >
            {category}
            <span className="mono text-[11px] text-dim">{countFor(category)}</span>
          </button>
        ))}
      </div>

      <div className="mt-6 columns-2 gap-3 sm:mt-8 sm:columns-3 sm:gap-4 lg:columns-4">
        {visible.map((item, i) => (
          <motion.button
            key={item.src}
            type="button"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: Math.min(i, 8) * 0.03 }}
            onClick={() => setOpen(i)}
            className="group mb-3 block w-full break-inside-avoid text-left sm:mb-4"
          >
            <span className="block overflow-hidden rounded-xl border border-border/70 bg-elevated/40">
              <img
                src={item.src}
                alt={item.title}
                width={item.w}
                height={item.h}
                loading="lazy"
                className="h-auto w-full transition duration-500 group-hover:scale-[1.03]"
              />
            </span>
            <span className="mt-2 block px-0.5">
              <span className="block text-[13px] leading-snug text-muted transition group-hover:text-text">{item.title}</span>
              <span className="mono mt-0.5 block text-[10.5px] tracking-[0.1em] text-dim uppercase">{item.category}</span>
            </span>
          </motion.button>
        ))}
      </div>

      {filtered.length > INITIAL_COUNT && (
        <div className="mt-4 flex justify-center sm:mt-6">
          <button
            type="button"
            onClick={() => setShowAll((s) => !s)}
            className="inline-flex min-h-11 items-center rounded-full border border-border px-6 py-2.5 text-sm font-medium text-muted transition hover:border-dim hover:text-text"
          >
            {showAll ? 'Show less' : `Show all ${filtered.length}`}
          </button>
        </div>
      )}

      <AnimatePresence>
        {open !== null && <Lightbox items={filtered} index={open} onClose={() => setOpen(null)} onStep={step} />}
      </AnimatePresence>
    </div>
  )
}
