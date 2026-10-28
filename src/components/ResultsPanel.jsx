import { useRef, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { caseStudy, metaCampaigns } from '../data.js'

const tabs = [
  { id: 'rankings', label: 'Rankings', caption: `Brainery Spot · keyword positions as of ${caseStudy.rankingsAsOf}` },
  { id: 'before-after', label: 'Before / after', caption: 'Brainery Spot · 5 months from audit to page 1' },
  { id: 'meta', label: 'Meta Ads', caption: `${metaCampaigns.length} campaigns · Facebook & Instagram · 2025` },
]

const number = (n) => n.toLocaleString('en-IN')
const rupees = (n) => `₹${n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

const th =
  'mono px-2 py-3 text-[11px] font-normal tracking-[0.12em] text-dim uppercase first:pl-4 last:pr-4 sm:px-3 sm:first:pl-6 sm:last:pr-6'
const td = 'px-2 py-3.5 first:pl-4 last:pr-4 sm:px-3 sm:first:pl-6 sm:last:pr-6'

// Short header on phones, full header from sm up.
const Label = ({ short, full }) => (
  <>
    <span className="sm:hidden">{short}</span>
    <span className="hidden sm:inline">{full}</span>
  </>
)

function Rankings() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left text-[13px] sm:text-sm">
        <thead>
          <tr className="border-b border-border/60">
            <th scope="col" className={th}>Keyword</th>
            <th scope="col" className={`${th} text-right`}>
              <Label short="Pos." full="Position" />
            </th>
            <th scope="col" className={`${th} text-right`}>
              <Label short="Chg." full="Change" />
            </th>
            <th scope="col" className={`${th} text-right`}>
              <Label short="Vol." full="Volume / mo" />
            </th>
          </tr>
        </thead>
        <tbody className="tabular-nums">
          {caseStudy.keywords.map((row) => (
            <tr key={row.keyword} className="border-b border-border/40 last:border-0 hover:bg-elevated/30">
              <td className={`${td} text-muted`}>{row.keyword}</td>
              <td className={`${td} text-right font-medium text-text`}>#{row.position}</td>
              <td className={`${td} text-right whitespace-nowrap text-growth`}>
                <span aria-hidden>↑ </span>
                <span className="sr-only">up </span>
                {row.change}
              </td>
              <td className={`${td} text-right text-muted`}>{number(row.volume)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function BeforeAfter() {
  return (
    <div className="grid gap-6 px-4 py-5 sm:px-6 sm:py-6 lg:grid-cols-[1.2fr_1fr] lg:gap-10">
      <ul>
        {caseStudy.beforeAfter.map((row) => (
          <li key={row.label} className="grid grid-cols-[1fr_auto] items-baseline gap-3 border-b border-border/40 py-3.5 first:pt-0 last:border-0">
            <span className="text-sm text-muted">{row.label}</span>
            <span className="text-right text-sm">
              <span className="text-dim">{row.before}</span>
              <span className="mx-2 text-dim" aria-label="to">→</span>
              <span className="font-medium text-text">{row.after}</span>
            </span>
          </li>
        ))}
      </ul>
      <div>
        <p className="mono text-[11px] tracking-[0.14em] text-dim uppercase">Local SEO · Google My Business</p>
        <ul className="mt-3 grid grid-cols-2 gap-2.5">
          {caseStudy.local.map((item) => (
            <li key={item.label} className="rounded-xl border border-border/60 bg-elevated/30 p-3.5">
              <p className="text-lg font-semibold tracking-tight text-text">{item.value}</p>
              <p className="mt-0.5 text-xs text-dim">{item.label}</p>
            </li>
          ))}
        </ul>
      </div>
      <ol className="flex flex-col gap-2 border-t border-border/50 pt-5 sm:flex-row sm:gap-0 lg:col-span-2">
        {caseStudy.timeline.map((item, i) => (
          <li key={item.month} className="flex-1 sm:border-l sm:border-border/50 sm:px-3 sm:first:border-0 sm:first:pl-0">
            <p className="mono text-[11px] text-dim">
              {String(i + 1).padStart(2, '0')} · {item.month}
            </p>
            <p className="mt-1 text-[13px] leading-snug text-muted">{item.step}</p>
          </li>
        ))}
      </ol>
    </div>
  )
}

function MetaAds() {
  const totals = metaCampaigns.reduce(
    (t, c) => ({ views: t.views + c.views, results: t.results + c.results, spent: t.spent + c.spent }),
    { views: 0, results: 0, spent: 0 },
  )

  return (
    <>
      <ul className="tabular-nums sm:hidden">
        {[...metaCampaigns, { name: 'Total', dates: `${metaCampaigns.length} campaigns`, ...totals }].map((c) => (
          <li key={c.name} className="border-b border-border/40 px-4 py-4 last:border-0">
            <div className="flex items-baseline justify-between gap-3">
              <p className={c.name === 'Total' ? 'font-medium text-text' : 'text-text'}>{c.name}</p>
              <p className="mono text-[11px] text-dim">{c.objective ? `${c.objective} · ${c.dates}` : c.dates}</p>
            </div>
            <dl className="mt-2.5 grid grid-cols-4 gap-2 text-[13px]">
              {[
                ['Views', number(c.views)],
                ['Results', c.results],
                ['Spent', rupees(c.spent)],
                ['CPR', rupees(c.spent / c.results)],
              ].map(([label, value]) => (
                <div key={label} className="min-w-0">
                  <dt className="mono text-[10px] tracking-[0.1em] text-dim uppercase">{label}</dt>
                  <dd className="mt-0.5 truncate text-muted">{value}</dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ul>
      <div className="hidden overflow-x-auto sm:block">
        <table className="w-full min-w-[640px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border/60">
              <th scope="col" className={th}>Campaign</th>
              <th scope="col" className={th}>Objective</th>
              <th scope="col" className={`${th} text-right`}>Views</th>
              <th scope="col" className={`${th} text-right`}>Results</th>
              <th scope="col" className={`${th} text-right`}>Spent</th>
              <th scope="col" className={`${th} text-right`}>Cost / result</th>
            </tr>
          </thead>
          <tbody className="tabular-nums">
            {metaCampaigns.map((c) => (
              <tr key={c.name} className="border-b border-border/40 hover:bg-elevated/30">
                <td className={td}>
                  <p className="text-text">{c.name}</p>
                  <p className="mono mt-0.5 text-[11px] text-dim">{c.dates}</p>
                </td>
                <td className={`${td} text-muted`}>{c.objective}</td>
                <td className={`${td} text-right text-muted`}>{number(c.views)}</td>
                <td className={`${td} text-right text-text`}>{c.results}</td>
                <td className={`${td} text-right text-muted`}>{rupees(c.spent)}</td>
                <td className={`${td} text-right text-muted`}>{rupees(c.spent / c.results)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="tabular-nums">
            <tr>
              <th scope="row" className={`${td} text-left font-medium text-text`}>
                Total
              </th>
              <td className={`${td} text-dim`}>{metaCampaigns.length} campaigns</td>
              <td className={`${td} text-right font-medium text-text`}>{number(totals.views)}</td>
              <td className={`${td} text-right font-medium text-text`}>{totals.results}</td>
              <td className={`${td} text-right font-medium text-text`}>{rupees(totals.spent)}</td>
              <td className={`${td} text-right font-medium text-text`}>{rupees(totals.spent / totals.results)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </>
  )
}

const panels = { rankings: Rankings, 'before-after': BeforeAfter, meta: MetaAds }

export default function ResultsPanel() {
  const [active, setActive] = useState(tabs[0].id)
  const tabRefs = useRef([])
  const current = tabs.find((t) => t.id === active)
  const Panel = panels[active]

  const onKeyDown = (e, i) => {
    const dir = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
    if (!dir) return
    e.preventDefault()
    const next = (i + dir + tabs.length) % tabs.length
    setActive(tabs[next].id)
    tabRefs.current[next]?.focus()
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border/70 bg-[#0c0c0e]/90 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)] backdrop-blur-xl">
      <div className="flex flex-col gap-4 border-b border-border/60 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5">
        <div className="min-w-0">
          <p className="mono text-[11px] tracking-[0.16em] text-dim uppercase">Results</p>
          <p className="mt-1 text-sm text-muted">
            {active === 'meta' ? (
              current.caption
            ) : (
              <a
                href={caseStudy.site}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 transition hover:text-text"
              >
                {current.caption}
                <ArrowUpRight size={13} className="shrink-0 opacity-70" />
              </a>
            )}
          </p>
        </div>
        <div role="tablist" aria-label="Results" className="flex w-fit rounded-full border border-border/70 bg-bg/50 p-1">
          {tabs.map((tab, i) => (
            <button
              key={tab.id}
              ref={(el) => (tabRefs.current[i] = el)}
              type="button"
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={active === tab.id}
              aria-controls="results-panel"
              tabIndex={active === tab.id ? 0 : -1}
              onClick={() => setActive(tab.id)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className={`mono rounded-full px-3 py-1.5 text-[11px] whitespace-nowrap transition sm:text-xs ${
                active === tab.id ? 'bg-elevated text-text shadow-sm' : 'text-dim hover:text-muted'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      <div id="results-panel" role="tabpanel" aria-labelledby={`tab-${active}`}>
        <Panel />
      </div>
    </div>
  )
}
