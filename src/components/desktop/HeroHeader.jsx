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
  return (
    <header className="pc-hero" style={{ backgroundImage: `url(${bannerUrl})` }}>
      <div className="pc-hero-content">
        <div>
          <h1>{companyName}</h1>
          <p>
            Studio: {activeStudio ? `${activeStudio.name} (${activeStudio.mode})` : 'None'} · Staff {staffCount} · Models {modelCount}
          </p>
        </div>
        <div className="pc-kpi-row">
          <button className="pc-hero-endday" onClick={onEndDay}>End Day</button>
          <button className="pc-hero-save" onClick={onSaveGame}>Save Game</button>
          <div className="pc-hero-save-controls">
            <select value={selectedSaveSlot} onChange={(event) => onSelectSaveSlot(Number(event.target.value))}>
              {saveSlots.map((slotInfo) => (
                <option key={slotInfo.slot} value={slotInfo.slot}>
                  {`Slot ${slotInfo.slot}${slotInfo.occupied ? ` - ${slotInfo.companyName || 'Saved'} D${slotInfo.day ?? '-'}${Number.isFinite(slotInfo.money) ? ` (${money(slotInfo.money)})` : ''}` : ' - Empty'}`}
                </option>
              ))}
            </select>
            <button className="pc-hero-load" onClick={onLoadGame}>Load</button>
          </div>
          <div className="pc-kpi-pill"><Clock3 size={14} /> Day {day}</div>
          <div className="pc-kpi-pill"><TrendingUp size={14} /> Budget {money(budget)}</div>
          <div className="pc-kpi-pill"><Users size={14} /> Popularity {popularity}</div>
          <div className="pc-kpi-pill"><ShieldCheck size={14} /> Reputation {reputation}</div>
          <div className="pc-kpi-pill"><Zap size={14} /> AP {actionPoints}/{maxActionPoints}</div>
        </div>
      </div>
    </header>
  )
}

export default HeroHeader
