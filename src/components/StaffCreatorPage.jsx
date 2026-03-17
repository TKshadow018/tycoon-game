import { useMemo, useState } from 'react'
import { createStaffMarket } from '../data/staff'
import { STAFF_CREATOR_CATEGORIES, recalculateStaffBySkill } from '../data/staffCreatorUtils'

const ROLE_GROUPS = STAFF_CREATOR_CATEGORIES.map((category) => ({
  key: category.key,
  title: category.role,
  variableName: `${category.key}Staff`,
}))

const stringifyStaffFile = (staffEntries) => {
  const roleArrays = ROLE_GROUPS.map(({ key, variableName }) => {
    const roleEntries = staffEntries
      .filter((entry) => entry.category === key)
      .sort((a, b) => (a.skill - b.skill) || a.name.localeCompare(b.name))

    return `const ${variableName} = ${JSON.stringify(roleEntries, null, 2)}`
  })

  return `${roleArrays.join('\n\n')}\n\nconst staff = [\n  ...directorStaff,\n  ...cameraStaff,\n  ...lightingStaff,\n  ...soundStaff,\n  ...editorStaff\n]\n\nexport const createStaffMarket = () => staff\n`
}

function StaffCreatorPage() {
  const [copied, setCopied] = useState(false)
  const [staffEntries, setStaffEntries] = useState(() =>
    createStaffMarket().map((entry) => recalculateStaffBySkill(entry, entry.skill)),
  )

  const staffByRole = useMemo(
    () =>
      ROLE_GROUPS.map(({ key, title }) => ({
        key,
        title,
        entries: staffEntries.filter((entry) => entry.category === key),
      })),
    [staffEntries],
  )

  const generatedFileText = useMemo(() => stringifyStaffFile(staffEntries), [staffEntries])

  const handleSkillChange = (staffId, rawValue) => {
    setStaffEntries((previous) =>
      previous.map((entry) => {
        if (entry.id !== staffId) return entry
        return recalculateStaffBySkill(entry, rawValue)
      }),
    )
  }

  const copyOutput = async () => {
    try {
      await navigator.clipboard.writeText(generatedFileText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-6 rounded-2xl border border-slate-700 bg-slate-900 p-4 shadow-xl lg:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-bold">Edit Staff Skill</h1>
          <a className="rounded-md bg-slate-700 px-3 py-2 text-sm hover:bg-slate-600" href="/">
            Back To Game
          </a>
        </div>

        <p className="text-sm text-slate-300">
          All 50 staff are shown by role. Change skill only, and the page auto-updates reputation (skill/2), tier, and fees.
        </p>

        {staffByRole.map((group) => (
          <section key={group.key} className="rounded-xl border border-slate-700 bg-slate-800/40 p-4">
            <h2 className="text-lg font-semibold">{group.title} ({group.entries.length})</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {group.entries.map((entry) => (
                <article key={entry.id} className="rounded-lg border border-slate-700 bg-slate-900/70 p-3">
                  <img src={entry.imageUrl} alt={entry.name} className="h-36 w-full rounded-md object-cover" />
                  <p className="mt-2 text-sm font-semibold">{entry.name}</p>
                  <p className="text-xs text-slate-400">Age {entry.age} · {entry.tier}</p>

                  <label className="mt-2 block text-xs text-slate-300">
                    Skill
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={entry.skill}
                      onChange={(event) => handleSkillChange(entry.id, event.target.value)}
                      className="mt-1 w-full rounded-md border border-slate-600 bg-slate-950 px-2 py-1 text-sm"
                    />
                  </label>

                  <p className="mt-2 text-xs text-slate-300">Reputation: {entry.reputation}</p>
                  <p className="text-xs text-slate-300">Daily: {entry.dailyFee}</p>
                  <p className="text-xs text-slate-300">Weekly: {entry.weeklyFee}</p>
                  <p className="text-xs text-slate-300">Monthly: {entry.monthlyFee}</p>
                </article>
              ))}
            </div>
          </section>
        ))}

        <section className="rounded-xl border border-slate-700 bg-slate-800/40 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-semibold">Generated `staff.js` Content</h2>
            <button className="rounded-md bg-sky-700 px-3 py-2 text-sm hover:bg-sky-600" onClick={copyOutput}>
              {copied ? 'Copied' : 'Copy Output'}
            </button>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Copy and replace `src/data/staff.js` with this content to persist your skill edits.
          </p>
          <textarea
            readOnly
            className="mt-3 h-80 w-full rounded-md border border-slate-700 bg-slate-950 p-3 font-mono text-xs text-slate-200"
            value={generatedFileText}
          />
        </section>
      </section>
    </main>
  )
}

export default StaffCreatorPage
