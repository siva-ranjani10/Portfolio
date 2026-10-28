import { MotionConfig } from 'framer-motion'
import { ActiveSectionProvider } from './context/ActiveSection.jsx'
import Starfield from './components/Starfield.jsx'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import About from './components/About.jsx'
import Work from './components/Work.jsx'
import Journey from './components/Journey.jsx'
import Contact from './components/Contact.jsx'
import Footer from './components/Footer.jsx'

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <ActiveSectionProvider>
        <div className="relative min-h-screen bg-bg text-text">
          <Starfield />
          <div className="relative z-10">
            <Navbar />
            <main>
              <Hero />
              <About />
              <Work />
              <Journey />
              <Contact />
            </main>
            <Footer />
          </div>
        </div>
      </ActiveSectionProvider>
    </MotionConfig>
  )
}
