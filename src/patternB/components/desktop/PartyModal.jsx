import ModalCloseButton from './ModalCloseButton'

function PartyModal({
  open,
  onClose,
  partyOptions,
  money,
  moneyValue,
  formatMoney,
  actorCount,
  staffCount,
  actionPoints,
  maxActionPoints,
  onSelectParty,
}) {
  if (!open) return null

  const entries = Object.values(partyOptions || {})

  return (
    <div className="pc-modal-overlay" onClick={(event) => event.stopPropagation()}>
      <div className="pc-modal pc-party-modal" onClick={(event) => event.stopPropagation()}>
        <ModalCloseButton onClose={onClose} />
        <div className="pb-modal-head">
          <h3>Team Event Planner</h3>
          <p className="pc-muted">Select an event format to recover morale and improve team output.</p>
        </div>

        <div className="pb-mini-stats">
          <span>Options {entries.length}</span>
          <span>Budget {money}</span>
          <span>AP {actionPoints}/{maxActionPoints}</span>
        </div>

        <div className="pc-party-grid">
          {entries.map((option) => (
            <article key={option.key} className="pc-party-card pb-market-card">
              <img src={option.imageUrl} alt={option.label} className="pc-party-image" />
              <div className="pc-party-content">
                <h4>{option.label}</h4>
                <p>{option.description}</p>
                {(() => {
                  const totalCost = typeof option.cost === 'function'
                    ? option.cost({ actorCount, staffCount })
                    : 0
                  const cannotAfford = moneyValue < totalCost
                  const apCost = option.actionPointCost || 0
                  const insufficientAp = actionPoints < apCost
                  return (
                    <button
                      type="button"
                      onClick={() => onSelectParty(option.key)}
                      disabled={cannotAfford || insufficientAp}
                    >
                      Schedule ({formatMoney(totalCost)} · {apCost} AP)
                    </button>
                  )
                })()}
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PartyModal
