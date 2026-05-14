import ModalCloseButton from './ModalCloseButton'

function StudioModal({ open, onClose, studioCatalog, moneyValue, activeStudio, onRent, onBuy, money }) {
  if (!open) return null

  const hasPurchasedStudio =
    activeStudio?.mode === 'owned' && activeStudio.id !== 'studio-own-house'

  return (
    <div className="pc-modal-overlay" onClick={(event) => event.stopPropagation()}>
      <div className="pc-modal" onClick={(event) => event.stopPropagation()}>
        <ModalCloseButton onClose={onClose} />
        <div className="pb-modal-head">
          <h3>Studio Marketplace</h3>
          <p className="pc-muted">Rent for flexibility or buy for long-term control.</p>
        </div>

        <div className="pb-mini-stats">
          <span>Catalog {studioCatalog.length}</span>
          <span>Mode {activeStudio?.mode || 'none'}</span>
          <span>Budget {money(moneyValue)}</span>
        </div>

        <div className="pc-scroll-lg pc-studio-catalog-scroll">
          <div className="pc-studio-catalog-grid">
          {studioCatalog.map((studio) => {
            const isOwnHouse = studio.id === 'studio-own-house'
            const isOwnedStudio = activeStudio?.mode === 'owned' && activeStudio.id === studio.id
            const isRentedStudio = activeStudio?.mode === 'rent' && activeStudio.id === studio.id
            const disableForPurchasedRule =
              hasPurchasedStudio && !isOwnedStudio && !isOwnHouse

            const canRentDay = moneyValue >= studio.rentFees.day
            const canRentWeek = moneyValue >= studio.rentFees.week
            const canRentMonth = moneyValue >= studio.rentFees.month
            const canBuy = moneyValue >= studio.buyPrice

            const disableRentButtons =
              isOwnHouse ||
              isOwnedStudio ||
              disableForPurchasedRule

            const disableBuyButton =
              isOwnHouse ||
              isOwnedStudio ||
              disableForPurchasedRule

            const statusLabel = isOwnHouse
              ? 'Owned By Default'
              : isOwnedStudio
                ? 'Owned'
                : isRentedStudio
                  ? 'Currently Rented'
                  : disableForPurchasedRule
                    ? 'Disabled (Another Studio Owned)'
                    : 'Available'

            return (
              <article key={studio.id} className={`pc-studio-card pb-market-card${isOwnedStudio || isOwnHouse ? ' is-owned' : ''}`}>
                <div className="pc-studio-card-image-wrap">
                  <img src={studio.imageUrl} alt={studio.name} className="pc-studio-card-image" />
                  <span className="pc-studio-badge pc-studio-badge-status">{statusLabel}</span>
                  <span className="pc-studio-badge pc-studio-badge-quality">QB +{studio.qualityBonus}</span>
                </div>

                <div className="pc-studio-card-info">
                  <strong>{studio.name}</strong>
                </div>

                <div className="pc-studio-card-actions">
                  <div className="pc-studio-card-actions-grid pb-studio-action-grid">
                    <button
                      disabled={disableRentButtons || !canRentDay}
                      onClick={() => onRent(studio.id, 'day', studio.name)}
                    >
                      {`Rent Day (${money(studio.rentFees.day)})`}
                    </button>
                    <button
                      disabled={disableRentButtons || !canRentWeek}
                      onClick={() => onRent(studio.id, 'week', studio.name)}
                    >
                      {`Rent Week (${money(studio.rentFees.week)})`}
                    </button>
                    <button
                      disabled={disableRentButtons || !canRentMonth}
                      onClick={() => onRent(studio.id, 'month', studio.name)}
                    >
                      {`Rent Month (${money(studio.rentFees.month)})`}
                    </button>
                    <button
                      disabled={disableBuyButton || !canBuy}
                      onClick={() => onBuy(studio.id, studio.name)}
                    >
                      {`Buy (${money(studio.buyPrice)})`}
                    </button>
                  </div>
                </div>
              </article>
            )
          })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudioModal
