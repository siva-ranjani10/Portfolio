import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { useSectionInView } from '../context/ActiveSection.jsx'
import { liveSites, projects } from '../data.js'
import SectionHeader from './SectionHeader.jsx'
import DesignGallery from './DesignGallery.jsx'

function ProjectMedia({ project }) {
  return (
    <div className="relative aspect-[16/10] overflow-hidden border-b border-border bg-[#0a0910] sm:aspect-[16/11] md:aspect-auto md:min-h-[280px] md:border-r md:border-b-0 lg:min-h-[320px]">
      <div className="absolute inset-0 flex items-center justify-center p-3 sm:p-5">
        <img
          src={project.image}
          alt={`${project.title} — screenshot`}
          loading="lazy"
          className="max-h-full max-w-full rounded-lg object-contain"
        />
      </div>
    </div>
  )
}

function ProjectLinks({ project }) {
  if (!project.links.length) {
    return <p className="mt-6 text-sm text-dim sm:mt-8">{project.note ?? 'Details available on request'}</p>
  }
  return (
    <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2 sm:mt-8">
      {project.links.map((link, i) => (
        <a
          key={link.href}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex min-h-10 items-center gap-1 text-sm font-medium ${
            i === 0 ? 'text-text hover:text-muted' : 'text-muted hover:text-text'
          }`}
        >
          {link.label} <ArrowUpRight size={14} />
        </a>
      ))}
    </div>
  )
}

function LiveSites() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      className="mt-16 sm:mt-24"
    >
      <div className="flex items-end justify-between gap-4">
        <div className="max-w-xl">
          <p className="mono text-[11px] tracking-[0.18em] text-dim uppercase sm:text-xs">Live websites</p>
          <h3 className="mt-3 text-xl font-semibold tracking-tight text-text sm:text-2xl">Built and deployed for real clients</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted sm:text-base">
            Sports venues, cafés, SaaS, education, catering, jewellery, logistics, healthcare and more.
          </p>
        </div>
        <p className="mono shrink-0 text-[11px] text-dim sm:text-xs">{liveSites.length} sites</p>
      </div>
      <ul className="mt-6 grid gap-x-8 border-t border-border sm:mt-8 sm:grid-cols-2 lg:grid-cols-3">
        {liveSites.map((site, i) => (
          <li key={site.domain} className="border-b border-border/60">
            <a
              href={site.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex min-h-12 items-center gap-3 py-3 text-sm text-muted transition hover:text-text"
            >
              <span className="mono w-6 shrink-0 text-[11px] text-dim">{String(i + 1).padStart(2, '0')}</span>
              <span className="min-w-0 truncate">{site.domain}</span>
              <ArrowUpRight
                size={14}
                className="ml-auto shrink-0 opacity-40 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
              />
            </a>
          </li>
        ))}
      </ul>
    </motion.div>
  )
}

export default function Work() {
  const ref = useSectionInView('Work')

  return (
    <section ref={ref} id="work" className="scroll-mt-24 border-t border-border py-16 sm:scroll-mt-28 sm:py-20 md:py-32">
      <div className="shell">
        <SectionHeader label="Work" title="Selected work">
          Booking systems, SEO case studies, paid campaigns and social growth — plus the websites and designs behind them.
        </SectionHeader>

        <div className="flex flex-col gap-4 sm:gap-6">
          {projects.map((project, i) => (
            <motion.article
              key={project.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="overflow-hidden rounded-xl border border-border/70 bg-bg/35 backdrop-blur-md sm:rounded-2xl"
            >
              <div className="grid md:grid-cols-2">
                <ProjectMedia project={project} />
                <div className="flex flex-col justify-center p-4 sm:p-6 md:p-8">
                  <span className="mono text-xs text-dim">{project.index}</span>
                  <p className="mt-2 text-sm font-medium text-growth sm:mt-3">{project.highlight}</p>
                  <h3 className="mt-1.5 text-xl font-semibold tracking-tight text-text sm:mt-2 sm:text-2xl md:text-3xl">
                    {project.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted sm:mt-4 md:text-base">{project.description}</p>
                  <ul className="mt-4 space-y-2 sm:mt-5">
                    {project.points.map((point) => (
                      <li key={point} className="flex gap-2 text-sm leading-relaxed text-dim">
                        <span className="mt-2 size-1 shrink-0 rounded-full bg-muted" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mono mt-4 text-[11px] leading-relaxed break-words text-dim sm:mt-5 sm:text-xs">
                    {project.stack.join(' · ')}
                  </p>
                  <ProjectLinks project={project} />
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <LiveSites />
        <DesignGallery />
      </div>
    </section>
  )
}
