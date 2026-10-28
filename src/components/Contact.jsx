import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useSectionInView } from '../context/ActiveSection.jsx'
import { contactForm, profile } from '../data.js'

const mailtoFor = ({ name, email, message }) =>
  `mailto:${profile.email}?subject=${encodeURIComponent(`Portfolio message from ${name}`)}&body=${encodeURIComponent(
    `${message}\n\n— ${name} (${email})`,
  )}`

// Messages are delivered by Web3Forms (works on any host). Without an access key, or if
// sending fails, the visitor's email app opens with the message already filled in.
export default function Contact() {
  const ref = useSectionInView('Contact')
  const formRef = useRef(null)
  const [status, setStatus] = useState('idle')
  const [mailto, setMailto] = useState(`mailto:${profile.email}`)

  const onSubmit = async (e) => {
    e.preventDefault()
    const form = formRef.current
    const fields = Object.fromEntries(new FormData(form))
    const data = { name: fields.name.trim(), email: fields.email.trim(), message: fields.message.trim() }
    const fallback = mailtoFor(data)
    setMailto(fallback)

    if (!contactForm.web3formsKey) {
      window.location.href = fallback
      setStatus('mailto')
      return
    }

    // Sent as form data (not JSON) so the browser makes a simple request with no CORS preflight.
    const body = new FormData()
    body.append('access_key', contactForm.web3formsKey)
    Object.entries(data).forEach(([key, value]) => body.append(key, value))
    body.append('subject', `Portfolio message from ${data.name}`)
    body.append('from_name', `${profile.name} — Portfolio`)
    if (fields.botcheck) body.append('botcheck', 'true')

    setStatus('sending')
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body,
      })
      const result = await res.json().catch(() => ({}))
      if (!res.ok || !result.success) throw new Error(result.message || `HTTP ${res.status}`)
      setStatus('success')
      form.reset()
    } catch (err) {
      console.error('Contact form failed:', err)
      setStatus('error')
    }
  }

  const channels = [
    { label: 'Email', value: profile.email, href: `mailto:${profile.email}` },
    { label: 'Phone', value: profile.phone, href: profile.phoneHref },
    { label: 'LinkedIn', value: profile.linkedinHandle, href: profile.linkedin },
    { label: 'Location', value: profile.location },
  ]

  return (
    <section ref={ref} id="contact" className="scroll-mt-24 border-t border-border py-16 sm:scroll-mt-28 sm:py-20 md:py-32">
      <div className="shell grid gap-10 sm:gap-12 lg:grid-cols-2 lg:gap-20">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="mono text-[11px] tracking-[0.18em] text-dim uppercase sm:text-xs">Contact</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-text sm:mt-4 sm:text-3xl md:text-4xl">
            Let&apos;s build something great
          </h2>
          <p className="mt-3 max-w-md text-[0.95rem] text-muted sm:mt-4 sm:text-base">
            Need a website that ranks on Google and converts visitors? Or a Meta ad campaign that actually delivers ROI?
            Drop a message — I&apos;d love to hear about your project.
          </p>
          <ul className="mt-8 space-y-4 text-sm sm:mt-10">
            {channels.map((c) => (
              <li key={c.label} className="min-w-0">
                <span className="mono text-[11px] text-dim uppercase">{c.label}</span>
                {c.href ? (
                  <a
                    href={c.href}
                    target={c.href.startsWith('http') ? '_blank' : undefined}
                    rel={c.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="mt-0.5 block break-all text-text transition hover:text-muted"
                  >
                    {c.value}
                  </a>
                ) : (
                  <p className="mt-0.5 text-text">{c.value}</p>
                )}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.form
          ref={formRef}
          name="contact"
          onSubmit={onSubmit}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.08 }}
          className="flex w-full min-w-0 flex-col gap-3 sm:gap-4"
        >
          <label className="sr-only" htmlFor="contact-name">Name</label>
          <input id="contact-name" name="name" required placeholder="Name" autoComplete="name" className="field" />
          <label className="sr-only" htmlFor="contact-email">Email</label>
          <input id="contact-email" type="email" name="email" required placeholder="Email" autoComplete="email" className="field" />
          <label className="sr-only" htmlFor="contact-message">Message</label>
          <textarea id="contact-message" name="message" required rows={5} placeholder="Message" className="field resize-y" />
          <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
          <button
            type="submit"
            disabled={status === 'sending'}
            className="mt-1 min-h-11 w-full rounded-full bg-text px-7 py-3 text-sm font-medium text-bg transition hover:bg-accent disabled:opacity-60 sm:mt-2 sm:w-fit"
          >
            {status === 'sending' ? 'Sending…' : 'Send message'}
          </button>
          <p aria-live="polite" className="text-sm text-muted">
            {status === 'success' && 'Message sent. Thanks — I’ll get back to you soon!'}
            {status === 'mailto' && (
              <>
                Your email app should open with the message ready to send. If it doesn&apos;t, email me at{' '}
                <a href={mailto} className="text-text underline underline-offset-4">
                  {profile.email}
                </a>
                .
              </>
            )}
            {status === 'error' && (
              <>
                Couldn&apos;t send right now —{' '}
                <a href={mailto} className="text-text underline underline-offset-4">
                  send it by email instead
                </a>{' '}
                or write to {profile.email}.
              </>
            )}
          </p>
        </motion.form>
      </div>
    </section>
  )
}
