
import { useState } from 'react'
import { Link } from 'react-router-dom'
import './Onboarding.css'

const uriCardImage = new URL('../assets/url-card.svg', import.meta.url).href
const fileCardImage = new URL('../assets/file-card.svg', import.meta.url).href

const slides = [
  {
    key: 'url',
    title: 'URL Scan',
    image: uriCardImage,
    subtitle: 'Fast link analysis with remote lookup and provider context.',
    description:
      'Inspect a URL quickly, check for malicious redirects, and review safety data in a clean card layout.',
  },
  {
    key: 'file',
    title: 'File Scan',
    image: fileCardImage,
    subtitle: 'Provider-backed file inspection for safer assets.',
    description:
      'Use the file mode to submit a file scan workflow to your external provider and surface results in a focused summary.',
  },
]

function Onboarding() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [prevIndex, setPrevIndex] = useState(0)
  const [direction, setDirection] = useState<'forward' | 'back'>('forward')

  const handleDotClick = (index: number) => {
    if (index === activeIndex) return
    setDirection(index > activeIndex ? 'forward' : 'back')
    setPrevIndex(activeIndex)
    setActiveIndex(index)
  }

  return (
    <div className="onboarding-shell">
      <header className="onboarding-topbar">
        <div className="onboarding-brand">File_checker</div>
      </header>

      <h2 style={{ textAlign: 'center', marginTop: '30px' }}>Welcome to the File_checker📑</h2>

      <main className="onboarding-main">
        <div className="carousel-container">
          {slides.map((slide, index) => {
            const isActive = index === activeIndex
            const isPrev = index === prevIndex && activeIndex !== prevIndex
            const phase = isActive ? 'active' : isPrev ? 'exiting' : 'inactive'

            return (
              <div
                key={slide.key}
                className={`onboarding-slide ${phase} ${phase}-${direction}`}
              >
                <span className="onboarding-badge">Mode</span>
                <h1 className="onboarding-title">{slide.title}</h1>
                <div className="onboarding-card-grid">
                  <div className="onboarding-image-panel" aria-hidden="true">
                    {slide.image ? (
                      <img
                        className="onboarding-image"
                        src={slide.image}
                        alt={`${slide.title} illustration`}
                      />
                    ) : (
                      <div className="onboarding-image-gradient" />
                    )}
                  </div>
                  <div className="onboarding-copy-panel">
                    <p className="onboarding-subtitle">{slide.subtitle}</p>
                    <p className="onboarding-copy">{slide.description}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="onboarding-dots">
          {slides.map((slide, index) => (
            <button
              key={slide.key}
              type="button"
              className={`dot ${activeIndex === index ? 'active' : ''}`}
              onClick={() => handleDotClick(index)}
              aria-label={`Show ${slide.title}`}
            />
          ))}
        </div>

        <Link to="/app" className="onboarding-start-button">
          Get Started
        </Link>
      </main>
    </div>
  )
}

export default Onboarding
