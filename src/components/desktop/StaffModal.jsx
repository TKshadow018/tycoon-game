import { useMemo, useState } from 'react'
import ModalCloseButton from './ModalCloseButton'

function StaffModal({ open, onClose, staffMarket, moneyValue, onHireDaily, onHireWeekly, onHireMonthly, money }) {
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

  if (!open) return null

  return (
    <div className="pc-modal-overlay" onClick={(event) => event.stopPropagation()}>
      <div className="pc-modal" onClick={(event) => event.stopPropagation()}>
        <ModalCloseButton onClose={onClose} />
        <h3>Hire Staff</h3>

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

        <p className="pc-muted">Showing {visibleStaff.length} of {staffMarket.length} staff.</p>

        <div className="pc-scroll-lg pc-staff-results">
          <div className="pc-staff-grid">
            {visibleStaff.map((staff) => {
              return (
                <div key={staff.id} className="pc-unit">
                  <img src={staff.imageUrl} alt={staff.name} />
                  <div>
                    <strong>{staff.name}</strong>
                    <p>Role: {staff.role}</p>
                    <p>Category: {staff.category}</p>
                    <p>Level: {staff.tier}</p>
                    <p>Age: {staff.age ?? '-'}</p>
                    <p>Reputation: {staff.reputation ?? '-'}</p>
                    <p>Skill: {staff.skill}</p>
                    <p>Daily Fee: {money(staff.dailyFee)}</p>
                    <p>Weekly Fee: {money(staff.weeklyFee)}</p>
                    <p>Monthly Fee: {money(staff.monthlyFee)}</p>
                    <p>Payment is deferred to contract end.</p>
                    <div className="pc-actions pc-actions-wrap">
                      <button onClick={() => onHireDaily(staff)}>Hire Daily</button>
                      <button onClick={() => onHireWeekly(staff)}>Hire Weekly</button>
                      <button onClick={() => onHireMonthly(staff)}>Hire Monthly</button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default StaffModal
