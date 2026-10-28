import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowDownRight } from 'lucide-react'
import { useSectionInView } from '../context/ActiveSection.jsx'
import { profile, typewriterRoles } from '../data.js'
import Typewriter from './Typewriter.jsx'
import Lanyard from './Lanyard.jsx'

const ghostButton =
  'inline-flex min-h-11 items-center rounded-full border border-border px-5 py-2.5 text-sm font-medium text-muted transition hover:border-dim hover:text-text sm:px-6 sm:py-3'

export default function Hero() {
  const ref = useSectionInView('Home')
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0.15])

  return (
    <section ref={ref} id="home" className="relative min-h-[100svh]">
      <div className="shell relative grid min-h-[100svh] items-center gap-8 py-24 sm:gap-10 sm:py-28 md:static md:grid-cols-[1.05fr_0.95fr] md:gap-12 md:py-24 lg:gap-16">
        <motion.div style={{ opacity }} className="relative z-10 max-w-xl">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mono mb-4 flex items-center gap-2 text-[11px] tracking-[0.18em] text-dim uppercase sm:mb-5 sm:text-xs sm:tracking-[0.2em]"
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-growth/60 motion-reduce:animate-none" />
              <span className="relative inline-flex size-2 rounded-full bg-growth" />
            </span>
            Currently at {profile.company} · {profile.location.split(',')[0]}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-[clamp(2.15rem,9vw,5rem)] leading-[1.08] font-semibold tracking-tight break-words text-text"
          >
            {profile.name}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-3 min-h-[1.5rem] text-base text-muted sm:mt-4 sm:min-h-[1.6rem] sm:text-lg md:text-xl"
          >
            <Typewriter words={typewriterRoles} />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-5 max-w-md text-[0.95rem] leading-relaxed text-dim sm:mt-6 sm:text-base md:text-lg"
          >
            {profile.tagline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 flex flex-wrap gap-3 sm:mt-10"
          >
            <a
              href="#work"
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-text px-5 py-2.5 text-sm font-medium text-bg transition hover:bg-accent sm:px-6 sm:py-3"
            >
              View work
              <ArrowDownRight size={16} />
            </a>
            <a href={profile.resume} target="_blank" rel="noopener noreferrer" className={ghostButton}>
              Resume
            </a>
            <a href="#contact" className={ghostButton}>
              Contact
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative h-[460px] w-full min-w-0 sm:h-[520px] md:absolute md:inset-y-0 md:right-0 md:h-auto md:w-1/2"
        >
          <Lanyard className="h-full w-full" />
          <p className="mono pointer-events-none absolute bottom-10 left-1/2 hidden -translate-x-1/2 text-[11px] tracking-[0.16em] text-dim/70 uppercase motion-reduce:hidden md:block">
            Drag the badge
          </p>
        </motion.div>
      </div>
    </section>
  )
}
