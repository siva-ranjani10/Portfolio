import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useActiveSection } from '../context/ActiveSection.jsx'
import { navLinks, profile } from '../data.js'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { activeSection, setActiveSection, setTimeOfLastClick } = useActiveSection()

  const select = (name) => {
    setActiveSection(name)
    setTimeOfLastClick(Date.now())
    setOpen(false)
  }

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setOpen(false)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-bg/85 via-bg/40 to-transparent backdrop-blur-[6px] [mask-image:linear-gradient(to_bottom,black_55%,transparent)] md:h-28"
      />
      <div className="safe-top relative flex justify-center px-3 pt-4 sm:px-4 sm:pt-5">
        <div className="flex w-full max-w-[1080px] items-center justify-between gap-3">
          <a href="#home" onClick={() => select('Home')} className="shrink-0 text-sm font-semibold tracking-tight text-text">
            {profile.shortName}
            <span className="text-dim">.j</span>
          </a>

          <nav
            aria-label="Primary"
            className="hidden items-center gap-0.5 rounded-full border border-border/60 bg-bg/40 p-1 backdrop-blur-xl md:flex"
          >
            {navLinks.map((link) => {
              const active = activeSection === link.name
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => select(link.name)}
                  aria-current={active ? 'true' : undefined}
                  className="relative rounded-full px-3.5 py-2 text-[13px] font-medium lg:px-4"
                >
                  {active && (
                    <motion.span
                      layoutId="capsule"
                      className="absolute inset-0 rounded-full bg-elevated/70"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className={`relative z-10 ${active ? 'text-text' : 'text-muted hover:text-text'}`}>{link.name}</span>
                </a>
              )
            })}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href={profile.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden rounded-full border border-border/60 bg-bg/40 px-4 py-2 text-[13px] font-medium text-text backdrop-blur-xl transition hover:border-dim sm:inline-flex"
            >
              Resume
            </a>
            <button
              type="button"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              className="rounded-full border border-border/60 bg-bg/40 px-4 py-2.5 text-[13px] text-text backdrop-blur-xl md:hidden"
              onClick={() => setOpen((o) => !o)}
            >
              {open ? 'Close' : 'Menu'}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.button
              type="button"
              aria-label="Close menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-bg/50 backdrop-blur-sm md:hidden"
              onClick={() => setOpen(false)}
            />
            <motion.div
              id="mobile-menu"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="absolute inset-x-3 top-[4.5rem] z-50 max-h-[calc(100dvh-5.5rem)] overflow-y-auto rounded-2xl border border-border/60 bg-bg/85 p-3 backdrop-blur-xl sm:inset-x-4 md:hidden"
            >
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => select(link.name)}
                  className={`block rounded-xl px-3 py-3.5 text-sm ${
                    activeSection === link.name ? 'bg-elevated/60 text-text' : 'text-muted hover:bg-elevated/50 hover:text-text'
                  }`}
                >
                  {link.name}
                </a>
              ))}
              <a
                href={profile.resume}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="mt-1 block rounded-xl bg-elevated/60 px-3 py-3.5 text-center text-sm text-text"
              >
                Resume
              </a>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
