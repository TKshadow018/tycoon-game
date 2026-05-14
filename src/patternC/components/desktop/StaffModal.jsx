import { useMemo, useState } from 'react'
import ModalCloseButton from './ModalCloseButton'

function StaffModal({ open, onClose, staffMarket, moneyValue, onHireDaily, onHireWeekly, onHireMonthly, money, inline = false }) {
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [sortBy, setSortBy] = useState('day-fee-asc')

  const categoryOptions = useMemo(
    () => [...new Set(staffMarket.map((staff) => staff.category))],
    [staffMarket],
  )

  const visibleStaff = useMemo(() => {
    const searchTerm = search.trim().toLowerCase()

    const filtered = staffMarket.filter((staff) => {
      if (categoryFilter !== 'all' && staff.category !== categoryFilter) {
        return false
      }

      if (!searchTerm) {
        return true
      }

      const searchable = `${staff.name} ${staff.role} ${staff.category}`.toLowerCase()
      return searchable.includes(searchTerm)
    })

    return [...filtered].sort((first, second) => {
      switch (sortBy) {
        case 'skill-asc':
          return first.skill - second.skill
        case 'day-fee-asc':
          return first.dailyFee - second.dailyFee
        case 'day-fee-desc':
          return second.dailyFee - first.dailyFee
        case 'weekly-fee-asc':
          return first.weeklyFee - second.weeklyFee
        case 'weekly-fee-desc':
          return second.weeklyFee - first.weeklyFee
        case 'monthly-fee-asc':
          return first.monthlyFee - second.monthlyFee
        case 'monthly-fee-desc':
          return second.monthlyFee - first.monthlyFee
        case 'name-asc':
          return first.name.localeCompare(second.name)
        case 'name-desc':
          return second.name.localeCompare(first.name)
        default:
          return second.skill - first.skill
      }
    })
  }, [categoryFilter, search, sortBy, staffMarket])

  const totalDaily = visibleStaff.reduce((sum, staff) => sum + (staff.dailyFee || 0), 0)
  const avgSkill = visibleStaff.length
    ? Math.round(visibleStaff.reduce((sum, staff) => sum + (staff.skill || 0), 0) / visibleStaff.length)
    : 0

  if (!open && !inline) return null

  const modalContent = (
      <div className={`pc-modal${inline ? ' pc-c-inline-modal' : ''}`} onClick={(event) => event.stopPropagation()}>
        {!inline && <ModalCloseButton onClose={onClose} />}
        <div className="pb-modal-head">
          <h3>Crew Acquisition Console</h3>
          <p className="pc-muted">Review specialist talent, compare fees, and sign contracts instantly.</p>
        </div>

        <div className="pb-mini-stats">
          <span>Visible {visibleStaff.length}</span>
          <span>Average Skill {avgSkill}</span>
          <span>Total Daily Exposure {money(totalDaily)}</span>
        </div>

        <div className="pc-staff-toolbar">
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name, role, category..."
          />

          <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
            <option value="all">All Categories</option>
            {categoryOptions.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
            <option value="skill-desc">Sort: Skill High-Low</option>
            <option value="skill-asc">Sort: Skill Low-High</option>
            <option value="day-fee-asc">Sort: Day Fee Low-High</option>
            <option value="day-fee-desc">Sort: Day Fee High-Low</option>
            <option value="weekly-fee-asc">Sort: Weekly Fee Low-High</option>
            <option value="weekly-fee-desc">Sort: Weekly Fee High-Low</option>
            <option value="monthly-fee-asc">Sort: Monthly Fee Low-High</option>
            <option value="monthly-fee-desc">Sort: Monthly Fee High-Low</option>
            <option value="name-asc">Sort: Name A-Z</option>
            <option value="name-desc">Sort: Name Z-A</option>
          </select>
        </div>

        <div className="pc-scroll-lg pc-staff-results">
          <div className="pc-staff-grid">
            {visibleStaff.map((staff) => {
              return (
                <div key={staff.id} className="pb-market-card">
                  <img src={staff.imageUrl} alt={staff.name} />
                  <div>
                    <strong>{staff.name}</strong>
                    <p>{staff.role} · {staff.category} · Tier {staff.tier}</p>
                    <p>Age {staff.age ?? '-'} · Reputation {staff.reputation ?? '-'} · Skill {staff.skill}</p>
                    <p>Daily {money(staff.dailyFee)} · Weekly {money(staff.weeklyFee)} · Monthly {money(staff.monthlyFee)}</p>
                    <p>All payments are deferred until contract completion.</p>
                    <div className="pb-inline-actions">
                      <button type="button" onClick={() => onHireDaily(staff)}>Daily</button>
                      <button type="button" onClick={() => onHireWeekly(staff)}>Weekly</button>
                      <button type="button" onClick={() => onHireMonthly(staff)}>Monthly</button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
  )

  if (inline) {
    return <div className="pc-c-inline-modal-host">{modalContent}</div>
  }

  return (
    <div className="pc-modal-overlay" onClick={(event) => event.stopPropagation()}>
      {modalContent}
    </div>
  )
}

export default StaffModal
