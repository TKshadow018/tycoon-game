import { UserPlus } from 'lucide-react'

function ModelsSection({ roster, onOpenModelModal, onRenewModelContract, money }) {
  const getModelContractFee = (model, term) => {
    const base = 500 + (model?.quality || 0) * 35
    if (term === 'day') return Math.max(100, Math.round(base * 0.2))
    if (term === 'week') return Math.max(400, Math.round(base * 0.95))
    return Math.max(1000, Math.round(base * 3.4))
  }

  const contractLabel = (hireType) => {
    if (hireType === 'day') return 'Daily'
    if (hireType === 'week') return 'Weekly'
    if (hireType === 'month') return 'Monthly'
    return 'Custom'
  }

  const averageQuality = roster.length
    ? Math.round(roster.reduce((sum, model) => sum + (model.quality || 0), 0) / roster.length)
    : 0

  return (
    <article className="pc-card">
      <div className="pb-head-row">
        <h2><UserPlus size={16} /> Talent Board</h2>
        <button className="pc-add-btn" onClick={onOpenModelModal}>Scout Models</button>
      </div>

      <div className="pb-mini-stats">
        <span>Roster {roster.length}</span>
        <span>Avg Quality {averageQuality}</span>
      </div>

      <div className="pc-scroll-lg">
        {roster.length === 0 && <p className="pc-muted">No models hired yet.</p>}
        {roster.map((model) => (
          <div key={model.id} className="pb-tile pb-tile-wide">
            <img src={model.imageUrl} alt={model.name} />
            <div>
              <strong>{model.name}</strong>
              <p>{model.gender} · {model.ethnicity}</p>
              <p>Age {model.age} · {model.height}cm · {model.weight}kg</p>
              <p>{model.bodyType} · {model.skinColor}</p>
              <p>Popularity {model.popularity} · Fitness {model.fitness} · Stamina {model.stamina} · Happiness {model.hapiness}</p>
              <p>Contract {contractLabel(model.hireType)} · Days left {model.contractDaysLeft ?? '-'}</p>
              <p>Status: {model.awaitingPayment ? 'Payment Pending' : (model.contractDaysLeft ?? 0) > 0 ? 'Active' : 'Expired'}</p>

              {(model.contractDaysLeft ?? 0) <= 0 && !model.awaitingPayment && (
                <div className="pb-inline-actions">
                  <button type="button" onClick={() => onRenewModelContract?.(model.id, 'day')}>
                    Renew Day ({money(getModelContractFee(model, 'day'))})
                  </button>
                  <button type="button" onClick={() => onRenewModelContract?.(model.id, 'week')}>
                    Renew Week ({money(getModelContractFee(model, 'week'))})
                  </button>
                  <button type="button" onClick={() => onRenewModelContract?.(model.id, 'month')}>
                    Renew Month ({money(getModelContractFee(model, 'month'))})
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </article>
  )
}

export default ModelsSection
