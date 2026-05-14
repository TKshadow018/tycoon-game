import { lazy, Suspense } from 'react'

// Discovers every src/pattern*/App.jsx at build time — add a new folder and update VITE_UI_PATTERN, done.
const patternModules = import.meta.glob('./pattern*/App.jsx')

const pattern = (import.meta.env.VITE_UI_PATTERN || 'a').trim().toLowerCase()
const patternKey = `./pattern${pattern}/App.jsx`
// Case-insensitive fallback: find matching key regardless of folder casing (e.g. patternB vs patternb)
const resolvedKey = Object.keys(patternModules).find(k => k.toLowerCase() === patternKey.toLowerCase()) ?? './patternA/App.jsx'

const PatternApp = lazy(patternModules[resolvedKey])

function App() {
  return (
    <Suspense fallback={null}>
      <PatternApp pattern={pattern} />
    </Suspense>
  )
}

export default App
