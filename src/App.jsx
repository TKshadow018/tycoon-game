import { useEffect, useState } from 'react'
import DesktopGameView from './components/DesktopGameView'
import MobileGameView from './components/MobileGameView'
import ModelCreatorPage from './components/ModelCreatorPage'
import StaffCreatorPage from './components/StaffCreatorPage'
import { useGameStore } from './store/gameStore'
import themeNeumorphismUrl from './css/themes/theme-neumorphism.css?url'
import themeGlassmorphismUrl from './css/themes/theme-glassmorphism.css?url'
import themeClaymorphismUrl from './css/themes/theme-claymorphism.css?url'

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
      <main className="min-h-screen bg-slate-950 text-slate-100">
        <section className="mx-auto flex min-h-screen w-full max-w-5xl items-center px-4 py-8">
          <div className="grid w-full gap-6 overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-xl md:grid-cols-2">
            <img
              src="https://picsum.photos/seed/start-cover/900/1200"
              alt="Studio setup"
              className="h-64 w-full object-cover md:h-full"
            />
            <form className="flex flex-col gap-4 p-6" onSubmit={handleStart}>
              <h1 className="text-2xl font-bold">Start Studio Tycoon</h1>
              <p className="text-sm text-slate-300">Begin from zero: no studio, no staff, no models, and popularity starts at 0.</p>
              <div className="flex flex-wrap gap-2">
                <a
                  href="/model-creator"
                  className="w-fit rounded-md bg-sky-700 px-3 py-2 text-xs font-semibold text-slate-100 hover:bg-sky-600"
                >
                  Open Model Creator (130 Photos)
                </a>
                <a
                  href="/staff-creator"
                  className="w-fit rounded-md bg-cyan-700 px-3 py-2 text-xs font-semibold text-slate-100 hover:bg-cyan-600"
                >
                  Edit Skill (50 Staff)
                </a>
              </div>
              <label className="text-sm">
                Company Name
                <input
                  className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Enter your company name"
                />
              </label>
              <label className="text-sm">
                Initial Budget
                <input
                  type="number"
                  className="mt-1 w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2"
                  value={initialBudget}
                  onChange={(e) => setInitialBudget(e.target.value)}
                  min={5000}
                />
              </label>
              <button className="rounded-lg bg-emerald-600 px-4 py-3 font-semibold hover:bg-emerald-500">
                Start Game
              </button>
              <div className="grid grid-cols-3 gap-2 pt-2">
                <img src="https://picsum.photos/seed/start-1/240/180" alt="preview 1" className="h-20 w-full rounded-md object-cover" />
                <img src="https://picsum.photos/seed/start-2/240/180" alt="preview 2" className="h-20 w-full rounded-md object-cover" />
                <img src="https://picsum.photos/seed/start-3/240/180" alt="preview 3" className="h-20 w-full rounded-md object-cover" />
              </div>
            </form>
          </div>
        </section>

        {notice && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 md:items-center">
            <div className="w-full max-w-md rounded-xl border border-slate-600 bg-slate-900 p-4 text-slate-100">
              <p className="font-semibold">{notice.message}</p>
              <button className="mt-3 w-full rounded-md bg-slate-700 px-3 py-2" onClick={() => setNotice(null)}>
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

      {isMobile && <MobileGameView onNotify={setNotice} />}

      {notice && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 md:items-center">
          <div className="w-full max-w-md rounded-xl border border-slate-600 bg-slate-900 p-4 text-slate-100">
            <p className="font-semibold">{notice.message}</p>
            {notice.data && (
              <pre className="mt-2 max-h-44 overflow-auto rounded bg-slate-800 p-2 text-xs text-slate-300">{JSON.stringify(notice.data, null, 2)}</pre>
            )}
            <button className="mt-3 w-full rounded-md bg-slate-700 px-3 py-2" onClick={() => setNotice(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default App
