import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { useSectionInView } from '../context/ActiveSection.jsx'
import { education, experience, languages } from '../data.js'
import SectionHeader from './SectionHeader.jsx'

const row = 'grid gap-1.5 border-t border-border py-6 sm:grid-cols-[150px_1fr] sm:gap-8 sm:py-8 md:grid-cols-[170px_1fr] md:gap-10'

export default function Journey() {
  const ref = useSectionInView('Journey')

  return (
    <section ref={ref} id="journey" className="shell scroll-mt-24 py-16 sm:scroll-mt-28 sm:py-20 md:py-32">
      <SectionHeader label="Journey" title="Experience">
        From frontend internships to leading SEO and marketing projects — the roles that shaped how I build and grow.
      </SectionHeader>

      <div className="flex flex-col">
        {experience.map((job, i) => (
          <motion.div
            key={job.title + job.place}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className={row}
          >
            <p className="mono text-xs text-dim sm:text-sm">{job.period}</p>
            <div className="min-w-0">
              <h3 className="text-base font-semibold text-text sm:text-lg">{job.title}</h3>
              <p className="mt-1 text-sm text-muted">{job.place}</p>
              <ul className="mt-3 max-w-xl space-y-1.5">
                {job.highlights.map((point) => (
                  <li key={point} className="flex gap-2 text-sm leading-relaxed text-dim">
                    <span className="mt-2 size-1 shrink-0 rounded-full bg-muted" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
              {job.link && (
                <a
                  href={job.link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex min-h-10 items-center gap-1 text-sm font-medium text-text hover:text-muted"
                >
                  {job.link.label} <ArrowUpRight size={14} />
                </a>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <SectionHeader label="Qualifications" title="Education & certifications" className="mt-16 sm:mt-24" />

      <div className="flex flex-col">
        {education.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className={row}
          >
            <p className="mono text-xs text-dim sm:text-sm">{item.period}</p>
            <div className="min-w-0">
              <h3 className="text-base font-semibold text-text sm:text-lg">{item.title}</h3>
              <p className="mt-1 text-sm text-muted">{item.place}</p>
            </div>
          </motion.div>
        ))}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`${row} border-b`}
        >
          <p className="mono text-xs text-dim sm:text-sm">Languages</p>
          <ul className="flex flex-wrap gap-x-8 gap-y-2">
            {languages.map((lang) => (
              <li key={lang.name} className="text-base">
                <span className="font-semibold text-text">{lang.name}</span>
                <span className="text-muted"> — {lang.level}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  )
}
