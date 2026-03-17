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
        <h3>Organize Party</h3>
        <p className="pc-muted">Choose a party type to boost team happiness.</p>
        <div className="pc-party-grid">
          {entries.map((option) => (
            <article key={option.key} className="pc-party-card">
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
                      Choose {option.label} ({formatMoney(totalCost)} · {apCost} AP)
                    </button>
                  )
                })()}
              </div>
            </article>
          ))}
        </div>

        <p className="pc-muted">Current Budget: {money}</p>
        <p className="pc-muted">Current AP: {actionPoints}/{maxActionPoints}</p>
      </div>
    </div>
  )
}

export default PartyModal
