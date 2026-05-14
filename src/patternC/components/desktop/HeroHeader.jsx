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
    <header className="pc-hero pc-c-hero" style={{ backgroundImage: `url(${bannerUrl})` }}>
      <div className="pc-hero-content pc-c-hero-content">
        <div className="pc-c-hero-brand">
          <p className="pc-c-hero-kicker">Pattern C · Agency Tycoon</p>
          <h1>{companyName}</h1>
          <p className="pc-c-hero-studio">
            {activeStudio ? `${activeStudio.name} (${activeStudio.mode})` : 'No studio selected'}
          </p>
        </div>

        <div className="pc-c-hero-actions">
          <button className="pc-c-nextday-btn" onClick={onEndDay}>Proceed to Next Day</button>
          <button className="pc-c-ghost-btn" onClick={onSaveGame}>Save</button>
          <div className="pc-c-save-controls">
            <select value={selectedSaveSlot} onChange={(event) => onSelectSaveSlot(Number(event.target.value))}>
              {saveSlots.map((slotInfo) => (
                <option key={slotInfo.slot} value={slotInfo.slot}>
                  {`Slot ${slotInfo.slot}${slotInfo.occupied ? ` - ${slotInfo.companyName || 'Saved'} D${slotInfo.day ?? '-'}${Number.isFinite(slotInfo.money) ? ` (${money(slotInfo.money)})` : ''}` : ' - Empty'}`}
                </option>
              ))}
            </select>
            <button className="pc-c-ghost-btn" onClick={onLoadGame}>Load</button>
          </div>
        </div>

        <div className="pc-c-hero-metrics">
          <div className="pc-c-metric"><Clock3 size={14} /><span>Day</span><strong>{day}</strong></div>
          <div className="pc-c-metric"><TrendingUp size={14} /><span>Budget</span><strong>{money(budget)}</strong></div>
          <div className="pc-c-metric"><Users size={14} /><span>Team</span><strong>{staffCount + modelCount}</strong></div>
          <div className="pc-c-metric"><Users size={14} /><span>Popularity</span><strong>{popularity}</strong></div>
          <div className="pc-c-metric"><ShieldCheck size={14} /><span>Reputation</span><strong>{reputation}</strong></div>
          <div className="pc-c-metric pc-c-metric-ap">
            <div className="pc-c-metric-row"><Zap size={14} /><span>Action Points</span><strong>{actionPoints}/{maxActionPoints}</strong></div>
            <div className="pc-c-ap-bar">
              <i style={{ width: `${apPercent}%` }} />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default HeroHeader
