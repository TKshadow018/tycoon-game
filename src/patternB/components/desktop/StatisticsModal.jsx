import { useMemo } from 'react'
import { Activity, BanknoteArrowDown, BanknoteArrowUp, CalendarDays, ChartLine, TrendingUp } from 'lucide-react'
import ModalCloseButton from './ModalCloseButton'

const formatSigned = (value, money) => {
  const amount = Number(value) || 0
  return `${amount >= 0 ? '+' : ''}${money(amount)}`
}

const colorByEventType = {
  success: 'is-success',
  error: 'is-error',
  info: 'is-info',
}

function StatisticsModal({ open, onClose, state, money }) {
  const dailyStatsAsc = useMemo(
    () => [...(state.dailyStats || [])].sort((left, right) => left.day - right.day),
    [state.dailyStats],
  )

  const latestSnapshot = dailyStatsAsc[dailyStatsAsc.length - 1] || null

  const chartData = useMemo(() => {
    const points = dailyStatsAsc.slice(-40)
    if (points.length === 0) {
      return {
        moneyPath: '',
        deltaPath: '',
        labels: [],
      }
    }

    const moneyValues = points.map((item) => item.money)
    const deltaValues = points.map((item) => item.moneyDelta)

    const moneyMin = Math.min(...moneyValues)
    const moneyMax = Math.max(...moneyValues)
    const deltaMin = Math.min(...deltaValues)
    const deltaMax = Math.max(...deltaValues)

    const normalize = (value, min, max) => {
      if (max === min) return 20
      return 4 + ((max - value) / (max - min)) * 32
    }

    const toPath = (values, min, max) =>
      values
        .map((value, index) => {
          const x = points.length === 1 ? 0 : (index / (points.length - 1)) * 100
          const y = normalize(value, min, max)
          return `${x},${y}`
        })
        .join(' ')

    return {
      moneyPath: toPath(moneyValues, moneyMin, moneyMax),
      deltaPath: toPath(deltaValues, deltaMin, deltaMax),
      labels: points.map((item) => item.day),
    }
  }, [dailyStatsAsc])

  const financeSummary = useMemo(() => {
    const entries = state.financeEntries || []
    return entries.reduce(
      (acc, entry) => {
        const amount = Number(entry.amount) || 0
        if (amount >= 0) acc.totalIn += amount
        else acc.totalOut += Math.abs(amount)
        return acc
      },
      { totalIn: 0, totalOut: 0 },
    )
  }, [state.financeEntries])

  const growthSummary = useMemo(() => {
    const first = dailyStatsAsc[0]
    const last = dailyStatsAsc[dailyStatsAsc.length - 1]
    if (!first || !last) {
      return {
        moneyGrowth: 0,
        popularityGrowth: 0,
        reputationGrowth: 0,
      }
    }

    return {
      moneyGrowth: (last.money || 0) - (first.money || 0),
      popularityGrowth: (last.popularity || 0) - (first.popularity || 0),
      reputationGrowth: (last.companyReputation || 0) - (first.companyReputation || 0),
    }
  }, [dailyStatsAsc])

  if (!open) return null

  return (
    <div className="pc-modal-overlay" onClick={(event) => event.stopPropagation()}>
      <div className="pc-modal pc-stats-modal" onClick={(event) => event.stopPropagation()}>
        <ModalCloseButton onClose={onClose} />
        <div className="pb-modal-head">
          <h3>Analytics Hub</h3>
          <p className="pc-muted">Finance flow, growth signals, event history, and balance trends in one place.</p>
        </div>

        <div className="pb-mini-stats">
          <span>Days Tracked {dailyStatsAsc.length}</span>
          <span>Events {(state.gameEvents || []).length}</span>
          <span>Ledger Entries {(state.financeEntries || []).length}</span>
        </div>

        <div className="pc-stats-summary-grid">
          <article className="pc-stats-summary-card pb-market-card">
            <p><BanknoteArrowUp size={14} /> Total Income</p>
            <strong>{money(financeSummary.totalIn)}</strong>
          </article>
          <article className="pc-stats-summary-card pb-market-card">
            <p><BanknoteArrowDown size={14} /> Total Expenses</p>
            <strong>{money(financeSummary.totalOut)}</strong>
          </article>
          <article className="pc-stats-summary-card pb-market-card">
            <p><TrendingUp size={14} /> Net Growth</p>
            <strong>{formatSigned(growthSummary.moneyGrowth, money)}</strong>
          </article>
          <article className="pc-stats-summary-card pb-market-card">
            <p><CalendarDays size={14} /> Active Day</p>
            <strong>{latestSnapshot?.day || state.day}</strong>
          </article>
        </div>

        <div className="pc-stats-chart-grid">
          <section className="pc-stats-panel">
            <h4><ChartLine size={14} /> Budget Trend</h4>
            <svg className="pc-stats-line-chart" viewBox="0 0 100 40" preserveAspectRatio="none" role="img" aria-label="Budget trend chart">
              <polyline points={chartData.moneyPath} className="pc-stats-line pc-stats-line-money" />
            </svg>
            <p className="pc-muted">Last {chartData.labels.length} day snapshots</p>
          </section>

          <section className="pc-stats-panel">
            <h4><Activity size={14} /> Daily Profit / Loss</h4>
            <svg className="pc-stats-line-chart" viewBox="0 0 100 40" preserveAspectRatio="none" role="img" aria-label="Daily profit or loss chart">
              <polyline points={chartData.deltaPath} className="pc-stats-line pc-stats-line-delta" />
            </svg>
            <p className="pc-muted">Positive days trend upward, negative days trend downward.</p>
          </section>
        </div>

        <div className="pc-stats-growth-grid">
          <article className="pc-stats-growth-card">
            <p>Popularity Growth</p>
            <strong>{growthSummary.popularityGrowth >= 0 ? '+' : ''}{growthSummary.popularityGrowth}</strong>
          </article>
          <article className="pc-stats-growth-card">
            <p>Reputation Growth</p>
            <strong>{growthSummary.reputationGrowth >= 0 ? '+' : ''}{growthSummary.reputationGrowth}</strong>
          </article>
          <article className="pc-stats-growth-card">
            <p>Current Budget</p>
            <strong>{money(state.money)}</strong>
          </article>
          <article className="pc-stats-growth-card">
            <p>Today Change</p>
            <strong>{formatSigned(latestSnapshot?.moneyDelta || 0, money)}</strong>
          </article>
          <article className="pc-stats-growth-card">
            <p>Roster / Staff</p>
            <strong>{state.roster.length} / {state.hiredStaff.length}</strong>
          </article>
          <article className="pc-stats-growth-card">
            <p>Unsold Inventory</p>
            <strong>{state.inventoryItems.filter((item) => !item.sold).length}</strong>
          </article>
        </div>

        <div className="pc-stats-timeline-grid">
          <section className="pc-stats-panel">
            <h4>Day By Day Events</h4>
            <div className="pc-stats-event-list pc-scroll-lg">
              {(state.gameEvents || []).length === 0 && <p className="pc-muted">No actions logged yet.</p>}
              {(state.gameEvents || []).map((entry) => (
                <article key={entry.id} className={`pc-stats-event-item ${colorByEventType[entry.type] || 'is-info'}`}>
                  <p className="pc-stats-event-head">Day {entry.day} · {entry.title}</p>
                  <p className="pc-stats-event-text">{entry.description}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="pc-stats-panel">
            <h4>Finance Ledger</h4>
            <div className="pc-stats-finance-list pc-scroll-lg">
              {(state.financeEntries || []).length === 0 && <p className="pc-muted">No finance entries yet.</p>}
              {(state.financeEntries || []).map((entry) => (
                <article key={entry.id} className="pc-stats-finance-item">
                  <p>Day {entry.day} · {entry.category}</p>
                  <p>{entry.note}</p>
                  <p className={entry.amount >= 0 ? 'pc-finance-positive' : 'pc-finance-negative'}>
                    {formatSigned(entry.amount, money)} · Balance {money(entry.balanceAfter)}
                  </p>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default StatisticsModal
