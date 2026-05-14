import { Building2 } from 'lucide-react'

function StudioSection({ activeStudio, onOpenStudioModal }) {
  return (
    <article className="pc-card">
      <div className="pb-head-row">
        <h2><Building2 size={16} /> Studio Bay</h2>
        <button className="pc-add-btn" onClick={onOpenStudioModal}>Open Studio Catalog</button>
      </div>
      <div className="pc-scroll">
        {!activeStudio && <p className="pc-muted">No studio owned or rented.</p>}
        {activeStudio && (
          <div className="pb-tile pb-tile-wide">
            <img src={activeStudio.imageUrl} alt={activeStudio.name} />
            <div>
              <strong>{activeStudio.name}</strong>
              <p>Quality bonus +{activeStudio.qualityBonus}</p>
              <p>Operation mode {activeStudio.mode}</p>
              {activeStudio.mode === 'rent' && <p>Rental days left {activeStudio.daysLeft}</p>}
            </div>
          </div>
        )}
      </div>
    </article>
  )
}

export default StudioSection
