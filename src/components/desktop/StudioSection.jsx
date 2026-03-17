import { Building2 } from 'lucide-react'

function StudioSection({ activeStudio, onOpenStudioModal }) {
  return (
    <article className="pc-card">
      <h2><Building2 size={16} /> Studio</h2>
      <button className="pc-add-btn" onClick={onOpenStudioModal}>+ Add Studio</button>
      <div className="pc-scroll">
        {!activeStudio && <p className="pc-muted">No studio owned or rented.</p>}
        {activeStudio && (
          <div className="pc-unit">
            <img src={activeStudio.imageUrl} alt={activeStudio.name} />
            <div>
              <strong>{activeStudio.name}</strong>
              <p>Quality Bonus {activeStudio.qualityBonus}</p>
              <p>Mode: {activeStudio.mode}</p>
              {activeStudio.mode === 'rent' && <p>Days Left: {activeStudio.daysLeft}</p>}
            </div>
          </div>
        )}
      </div>
    </article>
  )
}

export default StudioSection
