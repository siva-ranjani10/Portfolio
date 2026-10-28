import { useEffect, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

export default function Typewriter({ words, typeSpeed = 45, deleteSpeed = 28, pause = 1600 }) {
  const reduce = useReducedMotion()
  const [index, setIndex] = useState(0)
  const [text, setText] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (reduce) return
    const word = words[index % words.length]
    let timer

    if (!deleting && text === word) {
      timer = setTimeout(() => setDeleting(true), pause)
    } else if (deleting && text === '') {
      timer = setTimeout(() => {
        setDeleting(false)
        setIndex((i) => i + 1)
      }, 250)
    } else {
      const next = deleting ? word.slice(0, text.length - 1) : word.slice(0, text.length + 1)
      timer = setTimeout(() => setText(next), deleting ? deleteSpeed : typeSpeed)
    }

    return () => clearTimeout(timer)
  }, [text, deleting, index, words, typeSpeed, deleteSpeed, pause, reduce])

  return (
    <>
      <span className="sr-only">{words.join(', ')}</span>
      <span aria-hidden>
        {reduce ? words[0] : text}
        <span className="caret ml-0.5 text-dim">|</span>
      </span>
    </>
  )
}
