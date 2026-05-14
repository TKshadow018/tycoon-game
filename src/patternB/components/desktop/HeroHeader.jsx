import { Clock3, ShieldCheck, TrendingUp, Users, Zap } from 'lucide-react'

function HeroHeader({
  companyName,
  activeStudio,
  staffCount,
  modelCount,
  day,
  budget,
  popularity,
  reputation,
  actionPoints,
  maxActionPoints,
  onEndDay,
  onSaveGame,
  onLoadGame,
  selectedSaveSlot,
  onSelectSaveSlot,
  saveSlots = [],
  bannerUrl,
  money,
}) {
  const apPercent = Math.max(0, Math.min(100, Math.round((actionPoints / Math.max(1, maxActionPoints)) * 100)))

  return (
    <header className="pc-hero pb-hero-shell" style={{ backgroundImage: `url(${bannerUrl})` }}>
      <div className="pc-hero-content pb-hero-content-grid">
        <div className="pb-hero-brand">
          <p className="pb-hero-label">Command Node</p>
          <h1>{companyName}</h1>
          <p className="pb-hero-studio">
            {activeStudio ? `${activeStudio.name} (${activeStudio.mode})` : 'No studio selected'}
          </p>
        </div>

        <div className="pb-hero-ops">
          <button className="pc-hero-endday pb-hero-op-btn" onClick={onEndDay}>End Day</button>
          <button className="pc-hero-save pb-hero-op-btn" onClick={onSaveGame}>Save</button>
          <div className="pc-hero-save-controls pb-hero-save-controls">
            <select value={selectedSaveSlot} onChange={(event) => onSelectSaveSlot(Number(event.target.value))}>
              {saveSlots.map((slotInfo) => (
                <option key={slotInfo.slot} value={slotInfo.slot}>
                  {`Slot ${slotInfo.slot}${slotInfo.occupied ? ` - ${slotInfo.companyName || 'Saved'} D${slotInfo.day ?? '-'}${Number.isFinite(slotInfo.money) ? ` (${money(slotInfo.money)})` : ''}` : ' - Empty'}`}
                </option>
              ))}
            </select>
            <button className="pc-hero-load pb-hero-op-btn" onClick={onLoadGame}>Load</button>
          </div>
        </div>

        <div className="pb-hero-metrics">
          <div className="pb-kpi-card"><Clock3 size={14} /><span>Day</span><strong>{day}</strong></div>
          <div className="pb-kpi-card"><TrendingUp size={14} /><span>Budget</span><strong>{money(budget)}</strong></div>
          <div className="pb-kpi-card"><Users size={14} /><span>Team</span><strong>{staffCount + modelCount}</strong></div>
          <div className="pb-kpi-card"><Users size={14} /><span>Popularity</span><strong>{popularity}</strong></div>
          <div className="pb-kpi-card"><ShieldCheck size={14} /><span>Reputation</span><strong>{reputation}</strong></div>
          <div className="pb-kpi-card pb-kpi-card-ap">
            <div className="pb-kpi-card-row"><Zap size={14} /><span>Action Points</span><strong>{actionPoints}/{maxActionPoints}</strong></div>
            <div className="pb-hero-ap-bar">
              <i style={{ width: `${apPercent}%` }} />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default HeroHeader
