import { useEffect, useState } from 'react'
import DesktopGameView from './components/DesktopGameView'
import MobileGameView from './components/MobileGameView'
import ModelCreatorPage from './components/ModelCreatorPage'
import StaffCreatorPage from './components/StaffCreatorPage'
import { useGameStore } from '../common/store/gameStore'
import './css/index.css'
import themeNeumorphismUrl from './css/themes/theme-neumorphism.css?url'
import themeGlassmorphismUrl from './css/themes/theme-glassmorphism.css?url'
import themeClaymorphismUrl from './css/themes/theme-claymorphism.css?url'
import './css/App.css'

const THEME_OPTIONS = [
  { key: 'neumorphism', label: 'Neumorphism', href: themeNeumorphismUrl },
  { key: 'glassmorphism', label: 'Glassmorphism', href: themeGlassmorphismUrl },
  { key: 'claymorphism', label: 'Claymorphism', href: themeClaymorphismUrl },
]

const DEFAULT_THEME_KEY = 'neumorphism'

function App() {
  const isModelCreatorPage = window.location.pathname === '/model-creator'
  const isStaffCreatorPage = window.location.pathname === '/staff-creator'

  if (isModelCreatorPage) {
    return <ModelCreatorPage />
  }

  if (isStaffCreatorPage) {
    return <StaffCreatorPage />
  }

  const started = useGameStore((state) => state.started)
  const startGame = useGameStore((state) => state.startGame)

  const [isMobile, setIsMobile] = useState(window.innerWidth < 900)
  const [notice, setNotice] = useState(null)
  const [companyName, setCompanyName] = useState('')
  const [initialBudget, setInitialBudget] = useState(25000)
  const [activeTheme, setActiveTheme] = useState(() => {
    const saved = localStorage.getItem('ui-theme')
    return THEME_OPTIONS.some((theme) => theme.key === saved) ? saved : DEFAULT_THEME_KEY
  })

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 900)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    const selectedTheme = THEME_OPTIONS.find((theme) => theme.key === activeTheme) || THEME_OPTIONS[0]
    let linkTag = document.getElementById('app-theme-link')

    if (!linkTag) {
      linkTag = document.createElement('link')
      linkTag.setAttribute('id', 'app-theme-link')
      linkTag.setAttribute('rel', 'stylesheet')
      document.head.appendChild(linkTag)
    }

    if (linkTag.getAttribute('href') !== selectedTheme.href) {
      linkTag.setAttribute('href', selectedTheme.href)
    }

    localStorage.setItem('ui-theme', selectedTheme.key)
  }, [activeTheme])

  const handleStart = (event) => {
    event.preventDefault()
    const result = startGame(companyName, initialBudget)
    if (!result.ok) {
      setNotice({ type: 'error', message: result.error })
      return
    }

    setNotice({
      type: 'success',
      message: `Welcome, ${result.result.companyName}. Your studio journey begins with ${result.result.budget}.`,
    })
  }

  if (!started) {
    return (
      <main className="b-start-root">
        <section className="b-start-shell">
          <aside className="b-start-left">
            <p className="b-start-kicker">Pattern B</p>
            <h1>Studio Tycoon Control Room</h1>
            <p>
              Build your media empire from zero resources. Hire talent, direct productions,
              negotiate contracts, and dominate every channel.
            </p>
            <div className="b-start-links">
              <a href="/model-creator">Model Creator (130 Photos)</a>
              <a href="/staff-creator">Staff Creator (50 Profiles)</a>
            </div>
            <div className="b-start-gallery">
              <img src="https://picsum.photos/seed/start-1/240/180" alt="preview 1" />
              <img src="https://picsum.photos/seed/start-2/240/180" alt="preview 2" />
              <img src="https://picsum.photos/seed/start-3/240/180" alt="preview 3" />
            </div>
          </aside>

          <div className="b-start-right">
            <img
              src="https://picsum.photos/seed/start-cover/900/1200"
              alt="Studio setup"
              className="b-start-cover"
            />
            <form className="b-start-form" onSubmit={handleStart}>
              <h2>Launch New Company</h2>
              <p>Start with no studio, no staff, and no models. Popularity begins at 0.</p>

              <label>
                UI Theme
                <select
                  className="b-start-input"
                  value={activeTheme}
                  onChange={(event) => setActiveTheme(event.target.value)}
                >
                  {THEME_OPTIONS.map((theme) => (
                    <option key={theme.key} value={theme.key}>{theme.label}</option>
                  ))}
                </select>
              </label>

              <label>
                Company Name
                <input
                  className="b-start-input"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Enter your company name"
                />
              </label>

              <label>
                Initial Budget
                <input
                  type="number"
                  className="b-start-input"
                  value={initialBudget}
                  onChange={(e) => setInitialBudget(e.target.value)}
                  min={5000}
                />
              </label>

              <button className="b-start-submit">
                Start Game
              </button>
            </form>
          </div>
        </section>

        {notice && (
          <div className="b-notice-overlay">
            <div className="b-notice-card">
              <p>{notice.message}</p>
              <button onClick={() => setNotice(null)}>
                Close
              </button>
            </div>
          </div>
        )}
      </main>
    )
  }

  return (
    <>
      {!isMobile && (
        <DesktopGameView
          onNotify={setNotice}
          activeTheme={activeTheme}
          themeOptions={THEME_OPTIONS.map(({ key, label }) => ({ key, label }))}
          onThemeChange={setActiveTheme}
        />
      )}

      {isMobile && (
        <MobileGameView
          onNotify={setNotice}
          activeTheme={activeTheme}
          onThemeChange={setActiveTheme}
          themeOptions={THEME_OPTIONS.map(({ key, label }) => ({ key, label }))}
        />
      )}

      {notice && (
        <div className="b-notice-overlay">
          <div className="b-notice-card">
            <p>{notice.message}</p>
            {notice.data && (
              <pre>{JSON.stringify(notice.data, null, 2)}</pre>
            )}
            <button onClick={() => setNotice(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default App
