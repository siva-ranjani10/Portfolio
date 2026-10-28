import { motion } from 'framer-motion'

export default function SectionHeader({ label, title, children, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`mb-8 max-w-xl sm:mb-12 md:mb-14 ${className}`}
    >
      <p className="mono text-[11px] tracking-[0.18em] text-dim uppercase sm:text-xs">{label}</p>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-text sm:mt-4 sm:text-3xl md:text-4xl">{title}</h2>
      {children && <p className="mt-3 text-sm leading-relaxed text-muted sm:mt-4 sm:text-base">{children}</p>}
    </motion.div>
  )
}
