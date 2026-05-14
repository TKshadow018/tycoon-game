import { useEffect, useMemo, useState } from 'react'

const ETHNICITY_OPTIONS = [
  'East Asian',
  'South Asian',
  'Southeast Asian',
  'European',
  'Middle Eastern',
  'African',
  'Latina/Latino',
  'Mixed',
]

const SKIN_COLOR_OPTIONS = ['Light', 'Tan', 'Brown', 'Olive', 'Dark']
const BODY_TYPES = ['Slim', 'Athletic', 'Curvy', 'Lean', 'Fit']
const STORAGE_KEY = 'tycoon-model-creator-v2'

const maleNameGroups = {
  southAsian: {
    ethnicity: 'South Asian (Indian/Pakistani)',
    firstNames: ['Arjun', 'Kabir', 'Rehan', 'Ayaan', 'Zayan', 'Rohan', 'Sameer'],
    lastNames: ['Khan', 'Malik', 'Patel', 'Iyer', 'Rahman', 'Singh'],
  },
  eastAsian: {
    ethnicity: 'East Asian (Japanese/Korean)',
    firstNames: ['Kenji', 'Haruto', 'Ren', 'Minho', 'Jisoo', 'Daichi', 'Taeyang'],
    lastNames: ['Sato', 'Kim', 'Nakamura', 'Park', 'Yamamoto', 'Lee'],
  },
  african: {
    ethnicity: 'African',
    firstNames: ['Kwame', 'Amari', 'Kofi', 'Jelani', 'Tendai', 'Bakari', 'Sefu'],
    lastNames: ['Mensah', 'Okoro', 'Banda', 'Diallo', 'Abebe', 'Ndlovu'],
  },
  mena: {
    ethnicity: 'Middle Eastern (Turkish/Arab)',
    firstNames: ['Omar', 'Yusuf', 'Emir', 'Kerem', 'Tariq', 'Zayd', 'Nasser'],
    lastNames: ['Yildiz', 'Haddad', 'Demir', 'Farah', 'Karim', 'Aydin'],
  },
  latin: {
    ethnicity: 'Latina/Latino',
    firstNames: ['Mateo', 'Diego', 'Rafael', 'Enzo', 'Javier', 'Tiago', 'Luis'],
    lastNames: ['Moreno', 'Santos', 'Ortega', 'Costa', 'Rivera', 'Vargas'],
  },
  caucasian: {
    ethnicity: 'European (Caucasian)',
    firstNames: ['Luca', 'Felix', 'Noah', 'Elias', 'Milan', 'Leo', 'Adrian'],
    lastNames: ['Novak', 'Petrov', 'Ivanov', 'Muller', 'Schneider', 'Weber'],
  },
}

const femaleNameGroups = {
  eastAsiaMixed: {
    ethnicity: 'East Asian (Japanese/Korean)',
    firstNames: ['Aiko', 'Yuna', 'Sora', 'Mina', 'Hana', 'Jiyu', 'Nari'],
    lastNames: ['Sato', 'Kim', 'Nakamura', 'Park', 'Ito', 'Lee'],
  },
  southeastAsia: {
    ethnicity: 'Southeast Asian (Thai/Indonesian)',
    firstNames: ['Anong', 'Suda', 'Rinlada', 'Dewi', 'Putri', 'Ayu', 'Nadya'],
    lastNames: ['Wijaya', 'Saputra', 'Sukma', 'Pranoto', 'Kirana', 'Utami'],
  },
  japanese: {
    ethnicity: 'East Asian (Japanese)',
    firstNames: ['Sakura', 'Mei', 'Rina', 'Yui', 'Hikari', 'Ami', 'Nozomi'],
    lastNames: ['Tanaka', 'Sato', 'Kobayashi', 'Yamada', 'Kato', 'Watanabe'],
  },
  arab: {
    ethnicity: 'Middle Eastern (Arab)',
    firstNames: ['Layla', 'Nadia', 'Noor', 'Yasmin', 'Amira', 'Farah', 'Samira'],
    lastNames: ['Haddad', 'Karim', 'Farah', 'Nasser', 'Khalil', 'Rahal'],
  },
  african: {
    ethnicity: 'African',
    firstNames: ['Zuri', 'Ama', 'Imani', 'Nia', 'Abeni', 'Adanna', 'Malaika'],
    lastNames: ['Mensah', 'Okafor', 'Diallo', 'Adebayo', 'Ndlovu', 'Abebe'],
  },
  nordic: {
    ethnicity: 'European (Nordic)',
    firstNames: ['Freya', 'Ingrid', 'Sigrid', 'Astrid', 'Elin', 'Liv', 'Maja'],
    lastNames: ['Larsen', 'Nielsen', 'Johansson', 'Andersen', 'Bergstrom', 'Svensson'],
  },
  southAsian: {
    ethnicity: 'South Asian (Pakistani/Indian)',
    firstNames: ['Anaya', 'Ayesha', 'Meher', 'Sana', 'Ira', 'Kiara', 'Zoya'],
    lastNames: ['Khan', 'Malik', 'Patel', 'Sharma', 'Iqbal', 'Rahman'],
  },
  latin: {
    ethnicity: 'Latina/Latino',
    firstNames: ['Sofia', 'Camila', 'Elena', 'Valeria', 'Lucia', 'Maya', 'Isla'],
    lastNames: ['Moreno', 'Santos', 'Costa', 'Ortega', 'Rivera', 'Vega'],
  },
  european: {
    ethnicity: 'European',
    firstNames: ['Chloe', 'Emma', 'Amelia', 'Clara', 'Lina', 'Nora', 'Elise'],
    lastNames: ['Novak', 'Petrov', 'Muller', 'Dubois', 'Rossi', 'Schmidt'],
  },
}

const getUnlockReputation = (quality) => {
  if (quality <= 25) return 0
  if (quality <= 40) return 15
  if (quality <= 55) return 30
  if (quality <= 70) return 45
  if (quality <= 85) return 60
  return 80
}

const clamp = (value, min, max) => Math.max(min, Math.min(max, value))
const hashSeed = (input) => {
  let hash = 0
  for (let index = 0; index < input.length; index += 1) {
    hash = (hash * 31 + input.charCodeAt(index)) >>> 0
  }
  return hash
}

const seededRandom = (seedInput) => {
  const hash = hashSeed(seedInput)
  return (hash % 100000) / 100000
}

const seededInt = (seedInput, min, max) => {
  const random = seededRandom(seedInput)
  return Math.floor(random * (max - min + 1)) + min
}

const buildModelQueue = () => {
  const girls = Array.from({ length: 100 }, (_, index) => ({
    id: `female-${index + 1}`,
    gender: 'female',
    imageUrl: `/models/girls/${index + 1}.jpg`,
    ordinal: index + 1,
  }))

  const boys = Array.from({ length: 30 }, (_, index) => ({
    id: `male-${index + 1}`,
    gender: 'male',
    imageUrl: `/models/boys/${index + 1}.jpg`,
    ordinal: index + 1,
  }))

  return [...girls, ...boys]
}

const pickFrom = (values, seedInput) => values[seededInt(seedInput, 0, values.length - 1)]

const maleGroupForOrdinal = (ordinal) => {
  if (ordinal <= 5) return maleNameGroups.southAsian
  if (ordinal <= 10) return maleNameGroups.eastAsian
  if (ordinal <= 15) return maleNameGroups.african
  if (ordinal <= 20) return maleNameGroups.mena
  if (ordinal <= 25) return maleNameGroups.latin
  return maleNameGroups.caucasian
}

const femaleGroupForOrdinal = (ordinal) => {
  if (ordinal <= 5) return femaleNameGroups.eastAsiaMixed
  if (ordinal <= 10) return femaleNameGroups.southeastAsia
  if (ordinal <= 15) return femaleNameGroups.japanese
  if (ordinal <= 20) return femaleNameGroups.arab
  if (ordinal <= 30) return femaleNameGroups.african
  if (ordinal <= 35) return femaleNameGroups.nordic
  if (ordinal <= 60) return femaleNameGroups.southAsian
  if (ordinal <= 80) return femaleNameGroups.latin
  return femaleNameGroups.european
}

const defaultsForModel = (meta) => {
  const group = meta.gender === 'male' ? maleGroupForOrdinal(meta.ordinal) : femaleGroupForOrdinal(meta.ordinal)
  const first = pickFrom(group.firstNames, `${meta.id}-first`)
  const last = pickFrom(group.lastNames, `${meta.id}-last`)
  const heightRange = meta.gender === 'male' ? [170, 190] : [160, 180]
  const weightRange = meta.gender === 'male' ? [65, 80] : [45, 70]

  return {
    name: `${first} ${last}`,
    age: 22,
    ethnicity: group.ethnicity,
    height: seededInt(`${meta.id}-height`, heightRange[0], heightRange[1]),
    weight: seededInt(`${meta.id}-weight`, weightRange[0], weightRange[1]),
    skinColor: SKIN_COLOR_OPTIONS[0],
  }
}

const sanitizeForm = (form) => {
  return {
    name: (form.name || '').trim(),
    age: clamp(Number(form.age) || 18, 18, 80),
    ethnicity: form.ethnicity || ETHNICITY_OPTIONS[0],
    height: clamp(Number(form.height) || 150, 120, 230),
    weight: clamp(Number(form.weight) || 50, 30, 180),
    skinColor: form.skinColor || SKIN_COLOR_OPTIONS[0],
  }
}

const buildModelObject = (meta, form) => {
  const data = sanitizeForm(form)
  const quality = seededInt(`${meta.id}-quality`, 10, 100)
  const popularity = seededInt(`${meta.id}-popularity`, 1, 100)
  const bodyType = pickFrom(BODY_TYPES, `${meta.id}-bodyType`)

  return {
    id: meta.id,
    gender: meta.gender,
    name: data.name || `${meta.gender === 'female' ? 'Model Girl' : 'Model Boy'} ${meta.ordinal}`,
    age: data.age,
    ethnicity: data.ethnicity,
    height: data.height,
    weight: data.weight,
    bodyType,
    skinColor: data.skinColor,
    quality,
    unlockReputation: getUnlockReputation(quality),
    popularity,
    totalSpecialVideo: 0,
    totalBodyShoot: 0,
    totalBasicShoot: 0,
    totalMovie: 0,
    totalAdShoot: 0,
    money: 0,
    fitness: seededInt(`${meta.id}-fitness`, 20, 80),
    stamina: 100,
    hapiness: seededInt(`${meta.id}-hapiness`, 45, 90),
    imageUrl: meta.imageUrl,
  }
}

const stringifyModelsFile = (models) => {
  const serialized = JSON.stringify(models, null, 2)
  return `const models = ${serialized}\n\nexport const createInitialModels = () => models\n`
}

function ModelCreatorPage() {
  const modelQueue = useMemo(() => buildModelQueue(), [])
  const [currentIndex, setCurrentIndex] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return 0
      const parsed = JSON.parse(raw)
      return clamp(Number(parsed.currentIndex) || 0, 0, 129)
    } catch {
      return 0
    }
  })
  const [savedForms, setSavedForms] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return {}
      const parsed = JSON.parse(raw)
      return parsed.savedForms && typeof parsed.savedForms === 'object' ? parsed.savedForms : {}
    } catch {
      return {}
    }
  })
  const [formState, setFormState] = useState(() => defaultsForModel(modelQueue[currentIndex]))
  const [copied, setCopied] = useState(false)

  const currentMeta = modelQueue[currentIndex]
  const totalCount = modelQueue.length

  const goToIndex = (nextIndex, formsOverride = savedForms) => {
    const safeIndex = clamp(nextIndex, 0, totalCount - 1)
    const nextMeta = modelQueue[safeIndex]
    setCurrentIndex(safeIndex)
    setFormState(formsOverride[nextMeta.id] || defaultsForModel(nextMeta))
  }

  useEffect(() => {
    setFormState(savedForms[currentMeta.id] || defaultsForModel(currentMeta))
  }, [currentMeta.id, savedForms])

  useEffect(() => {
    const payload = JSON.stringify({
      currentIndex,
      savedForms,
    })
    localStorage.setItem(STORAGE_KEY, payload)
  }, [currentIndex, savedForms])

  const handleChange = (field, value) => {
    setFormState((previous) => ({
      ...previous,
      [field]: value,
    }))
  }

  const saveCurrent = () => {
    const normalized = sanitizeForm(formState)
    const updated = {
      ...savedForms,
      [currentMeta.id]: normalized,
    }
    setSavedForms(updated)
    return updated
  }

  const handleSaveAndNext = () => {
    const updated = saveCurrent()
    goToIndex(currentIndex + 1, updated)
  }

  const handlePrevious = () => {
    const updated = saveCurrent()
    goToIndex(currentIndex - 1, updated)
  }

  const completedCount = Object.keys(savedForms).length
  const hasCurrentSaved = Boolean(savedForms[currentMeta.id])

  const generatedModels = modelQueue
    .filter((meta) => Boolean(savedForms[meta.id]))
    .map((meta) => buildModelObject(meta, savedForms[meta.id]))

  const generatedFileText = stringifyModelsFile(generatedModels)

  const copyOutput = async () => {
    try {
      await navigator.clipboard.writeText(generatedFileText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  const clearAllProgress = () => {
    localStorage.removeItem(STORAGE_KEY)
    setSavedForms({})
    setCurrentIndex(0)
    setFormState(defaultsForModel(modelQueue[0]))
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 rounded-2xl border border-slate-700 bg-slate-900 p-4 shadow-xl lg:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-bold">Model Creator</h1>
          <a className="rounded-md bg-slate-700 px-3 py-2 text-sm hover:bg-slate-600" href="/">
            Back To Game
          </a>
        </div>

        <p className="text-sm text-slate-300">
          Fill models one by one. Current: {currentIndex + 1}/{totalCount} | Completed: {completedCount}/{totalCount}
        </p>

        <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
          <div className="rounded-xl border border-slate-700 bg-slate-800/60 p-3">
            <img
              src={currentMeta.imageUrl}
              alt={`${currentMeta.gender} model ${currentMeta.ordinal}`}
              className="h-[520px] w-full rounded-lg object-cover"
            />
            <p className="mt-2 text-xs text-slate-400">
              Path: {currentMeta.imageUrl} | Gender: {currentMeta.gender} | Ref: {currentMeta.ordinal}
            </p>
          </div>

          <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-sm">
                Name
                <input
                  className="mt-1 w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-2"
                  value={formState.name}
                  onChange={(event) => handleChange('name', event.target.value)}
                  placeholder="Enter model name"
                />
              </label>

              <label className="text-sm">
                Age
                <input
                  type="number"
                  min={18}
                  max={80}
                  className="mt-1 w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-2"
                  value={formState.age}
                  onChange={(event) => handleChange('age', event.target.value)}
                />
              </label>

              <label className="text-sm">
                Ethnicity
                <input
                  className="mt-1 w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-2"
                  value={formState.ethnicity}
                  onChange={(event) => handleChange('ethnicity', event.target.value)}
                  list="ethnicity-suggestions"
                />
              </label>

              <label className="text-sm">
                Height (cm)
                <input
                  type="number"
                  className="mt-1 w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-2"
                  value={formState.height}
                  onChange={(event) => handleChange('height', event.target.value)}
                />
              </label>

              <label className="text-sm">
                Weight (kg)
                <input
                  type="number"
                  className="mt-1 w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-2"
                  value={formState.weight}
                  onChange={(event) => handleChange('weight', event.target.value)}
                />
              </label>

              <label className="text-sm">
                Skin Color
                <select
                  className="mt-1 w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-2"
                  value={formState.skinColor}
                  onChange={(event) => handleChange('skinColor', event.target.value)}
                >
                  {SKIN_COLOR_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <p className="text-xs text-slate-400 sm:col-span-2">
                Quality and popularity are auto-randomized for each model.
              </p>
            </div>

            <datalist id="ethnicity-suggestions">
              {ETHNICITY_OPTIONS.map((option) => (
                <option key={option} value={option} />
              ))}
            </datalist>

            <div className="mt-5 flex flex-wrap gap-2">
              <button
                type="button"
                className="rounded-md bg-slate-700 px-3 py-2 text-sm hover:bg-slate-600"
                onClick={handlePrevious}
                disabled={currentIndex === 0}
              >
                Save + Previous
              </button>
              <button
                type="button"
                className="rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold hover:bg-emerald-500"
                onClick={handleSaveAndNext}
              >
                Save + Next
              </button>
              <span className="self-center text-xs text-slate-400">
                {hasCurrentSaved ? 'Current model is saved.' : 'Current model not saved yet.'}
              </span>
            </div>
          </div>
        </div>

        <section className="rounded-xl border border-slate-700 bg-slate-800/40 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-semibold">Generated `models.js` Content</h2>
            <div className="flex flex-wrap gap-2">
              <button className="rounded-md bg-rose-700 px-3 py-2 text-sm hover:bg-rose-600" onClick={clearAllProgress}>
                Clear All Progress
              </button>
              <button className="rounded-md bg-sky-700 px-3 py-2 text-sm hover:bg-sky-600" onClick={copyOutput}>
                {copied ? 'Copied' : 'Copy Output'}
              </button>
            </div>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            This output only includes saved models. Save all 130 models first, then replace `src/data/models.js` with this code.
          </p>
          <textarea
            readOnly
            className="mt-3 h-72 w-full rounded-md border border-slate-700 bg-slate-950 p-3 font-mono text-xs text-slate-200"
            value={generatedFileText}
          />
        </section>
      </section>
    </main>
  )
}

export default ModelCreatorPage
