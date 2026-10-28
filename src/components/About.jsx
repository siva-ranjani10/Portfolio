import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { useSectionInView } from '../context/ActiveSection.jsx'
import { achievements, capabilities, profile, proficiency, stats } from '../data.js'
import CountUp from './CountUp.jsx'
import ResultsPanel from './ResultsPanel.jsx'

const reveal = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
}

export default function About() {
  const ref = useSectionInView('About')
  const capabilityCount = capabilities.reduce((n, group) => n + group.items.length, 0)

  return (
    <section ref={ref} id="about" className="scroll-mt-24 border-t border-border py-16 sm:scroll-mt-28 sm:py-24 md:py-32">
      <div className="shell">
        <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
          <motion.div {...reveal} transition={{ duration: 0.5 }} className="max-w-2xl">
            <p className="mono text-[11px] tracking-[0.18em] text-dim uppercase sm:text-xs">About</p>
            <h2 className="mt-4 text-[clamp(1.85rem,4.5vw,2.75rem)] leading-[1.15] font-semibold tracking-tight text-text">
              I build sites that rank &amp; convert.
            </h2>
            <p className="mt-5 max-w-xl text-[0.95rem] leading-relaxed text-muted sm:mt-6 sm:text-base">
              A results-driven Frontend Engineer &amp; Digital Marketing Specialist with 6+ years of experience — building
              responsive web apps and driving growth through SEO, paid campaigns and data-driven strategies. I bridge
              engineering and marketing, from pixel-perfect React interfaces to profitable Meta ad campaigns.
            </p>
            <p className="mt-4 max-w-xl text-[0.95rem] leading-relaxed text-dim sm:text-base">
              Currently at {profile.company}, delivering React.js applications and Meta Ads campaigns — with a proven track
              record of improving traffic, engagement and conversions.
            </p>
          </motion.div>
          <motion.a
            href={`mailto:${profile.email}`}
            {...reveal}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="inline-flex w-fit items-center gap-1.5 text-sm text-muted transition hover:text-text"
          >
            <span className="break-all">{profile.email}</span>
            <ArrowUpRight size={14} className="shrink-0" />
          </motion.a>
        </div>

        <motion.ul
          {...reveal}
          transition={{ duration: 0.45, delay: 0.05 }}
          className="mt-12 grid grid-cols-2 gap-6 border-y border-border py-8 sm:mt-14 sm:grid-cols-4 sm:gap-8 sm:py-10"
        >
          {stats.map((stat) => (
            <li key={stat.label}>
              <p className="text-3xl font-semibold tracking-tight text-text sm:text-4xl">
                <CountUp value={stat.value} decimals={stat.decimals} suffix={stat.suffix} />
              </p>
              <p className="mt-1.5 text-sm text-dim">{stat.label}</p>
            </li>
          ))}
        </motion.ul>

        <div className="mt-12 grid gap-10 sm:mt-14 lg:grid-cols-2 lg:gap-12">
          <motion.div {...reveal} transition={{ duration: 0.5 }}>
            <p className="mono text-[11px] tracking-[0.14em] text-dim uppercase sm:text-xs">Key achievements</p>
            <ol className="mt-5">
              {achievements.map((item, i) => (
                <li key={item.title} className="grid grid-cols-[2.25rem_1fr] gap-2 border-t border-border/70 py-4 last:border-b">
                  <span className="mono pt-0.5 text-xs text-dim">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <h3 className="text-sm font-medium text-text sm:text-base">{item.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-dim">{item.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </motion.div>

          <motion.div {...reveal} transition={{ duration: 0.5, delay: 0.06 }}>
            <p className="mono text-[11px] tracking-[0.14em] text-dim uppercase sm:text-xs">Proficiency</p>
            <ul className="mt-5 space-y-5 rounded-xl border border-border/70 bg-bg/30 p-5 backdrop-blur-md sm:rounded-2xl sm:p-6">
              {proficiency.map((skill, i) => (
                <li key={skill.label}>
                  <div className="flex items-baseline justify-between gap-3 text-sm">
                    <span className="text-muted">{skill.label}</span>
                    <span className="mono text-xs text-text tabular-nums">{skill.value}%</span>
                  </div>
                  <div aria-hidden className="mt-2 h-1.5 overflow-hidden rounded-full bg-elevated">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.value}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.1 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                      className="h-full rounded-full bg-accent"
                    />
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <motion.div {...reveal} transition={{ duration: 0.5, delay: 0.08 }} className="mt-12 sm:mt-14">
          <div className="flex items-end justify-between gap-4">
            <p className="mono text-[11px] tracking-[0.14em] text-dim uppercase sm:text-xs">Capabilities</p>
            <p className="mono text-[11px] text-dim sm:text-xs">{capabilityCount}</p>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-3 sm:mt-8 sm:grid-cols-2 sm:gap-4">
            {capabilities.map((group, i) => (
              <motion.div
                key={group.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-24px' }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="min-w-0 rounded-xl border border-border/70 bg-bg/30 p-4 backdrop-blur-md sm:rounded-2xl sm:p-5"
              >
                <div className="flex items-baseline justify-between gap-3 border-b border-border/50 pb-3">
                  <h3 className="text-sm font-medium tracking-tight text-text sm:text-base">{group.label}</h3>
                  <span className="mono shrink-0 text-[11px] text-dim">
                    {String(i + 1).padStart(2, '0')} · {group.items.length}
                  </span>
                </div>
                <ul className="mt-3.5 flex flex-wrap gap-2 sm:mt-4">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="max-w-full rounded-lg border border-border/60 bg-elevated/40 px-2.5 py-1.5 text-[12px] leading-snug break-words text-muted transition hover:border-dim hover:text-text sm:px-3 sm:text-[13px]"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div {...reveal} transition={{ duration: 0.5, delay: 0.1 }} className="mt-14 sm:mt-16">
          <ResultsPanel />
        </motion.div>
      </div>
    </section>
  )
}
