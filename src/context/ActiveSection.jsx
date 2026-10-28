import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

const ActiveSectionContext = createContext(null)

export function ActiveSectionProvider({ children }) {
  const [activeSection, setActiveSection] = useState('Home')
  const [timeOfLastClick, setTimeOfLastClick] = useState(0)

  return (
    <ActiveSectionContext.Provider value={{ activeSection, setActiveSection, timeOfLastClick, setTimeOfLastClick }}>
      {children}
    </ActiveSectionContext.Provider>
  )
}

export function useActiveSection() {
  const ctx = useContext(ActiveSectionContext)
  if (!ctx) throw new Error('useActiveSection must be used within ActiveSectionProvider')
  return ctx
}

// Marks a section as active in the navbar while it crosses the middle of the viewport.
// Ignored for a second after a nav click so the capsule doesn't flicker mid-scroll.
export function useSectionInView(name, margin = '-40% 0px -40% 0px') {
  const ref = useRef(null)
  const inView = useInView(ref, { margin })
  const { setActiveSection, timeOfLastClick } = useActiveSection()

  useEffect(() => {
    if (inView && Date.now() - timeOfLastClick > 1000) setActiveSection(name)
  }, [inView, setActiveSection, timeOfLastClick, name])

  return ref
}
