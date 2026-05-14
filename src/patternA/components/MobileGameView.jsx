import { Building2, Camera, Users, UserPlus } from 'lucide-react'
import { useState } from 'react'
import { useGameStore } from '../../common/store/gameStore'
import '../css/mobile.css'

const money = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)

function MobileGameView({ onNotify, activeTheme, onThemeChange, themeOptions = [] }) {
  const state = useGameStore()
  const [staffModalOpen, setStaffModalOpen] = useState(false)
  const [studioModalOpen, setStudioModalOpen] = useState(false)
  const [modelModalOpen, setModelModalOpen] = useState(false)
  const [selectedQuickEquipmentIds, setSelectedQuickEquipmentIds] = useState([])

  const run = (result, message) => {
    if (!result.ok) {
      onNotify({ type: 'error', message: result.error })
      return
    }
    onNotify({ type: 'success', message, data: result.result })
  }

  const availableModels = state.modelPool.filter(
    (model) => !state.roster.some((r) => r.id === model.id),
  )
  const inventoryItems = state.inventoryItems
    .filter((item) => !item.uploadedWebsiteId)
    .sort(
    (a, b) => (b.producedAtTs || 0) - (a.producedAtTs || 0),
  )
  const ownedEquipment = state.equipmentCatalog.filter((item) =>
    state.ownedEquipmentIds.includes(item.id),
  )
  const selectedOwnedEquipmentIds = selectedQuickEquipmentIds.filter((id) =>
    state.ownedEquipmentIds.includes(id),
  )

  const toggleQuickEquipment = (equipmentId) => {
    setSelectedQuickEquipmentIds((current) =>
      current.includes(equipmentId)
        ? current.filter((entry) => entry !== equipmentId)
        : [...current, equipmentId],
    )
  }

  return (
    <main className="mobile-wrap">
      <img src={state.banners[state.day % state.banners.length]} alt="company banner" className="mobile-hero" />
      <div className="mobile-header">
        <h1>{state.companyName}</h1>
        <p>Day {state.day} · Budget {money(state.money)}</p>
        <p>Popularity {state.popularity} · Reputation {state.companyReputation}</p>
      </div>

      <section className="mobile-card">
        <h2>Theme</h2>
        <label className="mobile-muted" htmlFor="mobile-theme-switch">UI Theme</label>
        <select
          id="mobile-theme-switch"
          className="mobile-endday"
          style={{ marginTop: 8 }}
          value={activeTheme}
          onChange={(event) => onThemeChange?.(event.target.value)}
        >
          {themeOptions.map((theme) => (
            <option key={theme.key} value={theme.key}>{theme.label}</option>
          ))}
        </select>
      </section>

      {state.gameOver && (
        <section className="mobile-card" style={{ borderColor: '#ef4444' }}>
          <h2>Game Over</h2>
          <p className="mobile-muted">{state.gameOverReason?.message || 'Company operations are permanently closed.'}</p>
        </section>
      )}

      <section className="mobile-card">
        <h2><Users size={16} /> Staff</h2>
        <button className="mobile-add-btn" onClick={() => setStaffModalOpen(true)}>+ Add Staff</button>
        <div className="mobile-scroll">
          {state.hiredStaff.length === 0 && <p className="mobile-muted">No staff hired yet.</p>}
          {state.hiredStaff.map((staff) => (
            <article key={staff.id} className="mobile-unit">
              <img src={staff.imageUrl} alt={staff.name} />
              <div>
                <strong>{staff.name}</strong>
                <p>{staff.role} · Skill {staff.skill} · Type {staff.hireType.charAt(0).toUpperCase() + staff.hireType.slice(1)} Contract</p>
                <p>Contract days left: {staff.contractDaysLeft}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mobile-card">
        <h2><Building2 size={16} /> Studio</h2>
        <button className="mobile-add-btn" onClick={() => setStudioModalOpen(true)}>+ Add Studio</button>
        <p className="mobile-muted">Current: {state.activeStudio ? `${state.activeStudio.name} (${state.activeStudio.mode})` : 'None'}</p>
        <div className="mobile-scroll">
          {!state.activeStudio && <p className="mobile-muted">No studio owned or rented.</p>}
          {state.activeStudio && (
            <article className="mobile-unit">
              <img src={state.activeStudio.imageUrl} alt={state.activeStudio.name} />
              <div>
                <strong>{state.activeStudio.name}</strong>
                <p>Mode {state.activeStudio.mode} · Quality Bonus {state.activeStudio.qualityBonus}</p>
                {state.activeStudio.mode === 'rent' && <p>Days left: {state.activeStudio.daysLeft}</p>}
              </div>
            </article>
          )}
        </div>
      </section>

      <section className="mobile-card">
        <h2><UserPlus size={16} /> Models</h2>
        <button className="mobile-add-btn" onClick={() => setModelModalOpen(true)}>+ Add Model</button>
        <p className="mobile-muted">Only hired models are shown here.</p>
        <div className="mobile-scroll">
          {state.roster.length === 0 && <p className="mobile-muted">No models hired yet.</p>}
          {state.roster.map((model) => (
            <article key={model.id} className="mobile-unit">
              <img src={model.imageUrl} alt={model.name} />
              <div>
                <strong>{model.name}</strong>
                <p>{model.gender} · {model.ethnicity}</p>
                <p>Quality {model.quality} · Unlock Rep {model.unlockReputation}</p>
                <p>Age {model.age} · {model.height}cm · {model.weight}kg · {model.bodyType}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mobile-card">
        <h2><Camera size={16} /> Produce Work</h2>
        <div className="mobile-scroll">
          {ownedEquipment.length === 0 ? (
            <p className="mobile-muted">No equipment owned. Buy at least one camera first.</p>
          ) : (
            <>
              <p className="mobile-muted">Select equipment for quick production.</p>
              <div className="mobile-equipment-picker">
                {ownedEquipment.map((item) => (
                  <label key={item.id} className="mobile-check-item">
                    <input
                      type="checkbox"
                      checked={selectedOwnedEquipmentIds.includes(item.id)}
                      onChange={() => toggleQuickEquipment(item.id)}
                    />
                    <span>{item.name} ({item.category}) +{item.qualityBonus}</span>
                  </label>
                ))}
              </div>
            </>
          )}
          {state.roster.length === 0 && <p className="mobile-muted">No models hired yet.</p>}
          {state.roster.map((model) => (
            <article key={model.id} className="mobile-unit">
              <img src={model.imageUrl} alt={model.name} />
              <div>
                <strong>{model.name}</strong>
                <p>Popularity {model.popularity} · Fitness {model.fitness} · Stamina {model.stamina}</p>
                <div className="mobile-row-btn mobile-row-wrap">
                  {Object.entries(state.workTypes).map(([key, work]) => (
                    <button
                      key={`${model.id}-${key}`}
                      onClick={() => run(state.produceWork(model.id, key, selectedOwnedEquipmentIds), `${work.label} completed.`)}
                    >
                      {work.label}
                    </button>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mobile-card">
        <h2>Inventory Sales</h2>
        {Object.entries(state.workInventory).map(([key, item]) => (
          <div key={key} className="mobile-sale-row">
            <span>{state.workTypes[key].label} · Unsold {item.unsold} · Avg {item.avgGrade}</span>
            <div className="mobile-row-btn mobile-row-wrap">
              <button onClick={() => run(state.sellInventory(key, 'company'), 'Sold to Other Company.')}>Company</button>
              <button onClick={() => run(state.sellInventory(key, 'individual'), 'Sold to Individual.')}>Individual</button>
              <button onClick={() => run(state.sellInventory(key, 'sponsor'), 'Sold to Sponsor.')}>Sponsor</button>
            </div>
          </div>
        ))}

        <h3 className="mobile-subhead">Production List</h3>
        <div className="mobile-scroll">
          {inventoryItems.length === 0 && <p className="mobile-muted">No produced items yet.</p>}
          {inventoryItems.map((item) => (
            <article key={item.id} className="mobile-unit mobile-unit-wide">
              {item.coverImageUrl && (
                <img src={item.coverImageUrl} alt={`${item.title} cover`} className="mobile-cover-image" />
              )}
              <div className="mobile-unit-content">
                <strong>{item.title}</strong>
                <p>Type: {item.shootType} · Grade {item.grade} · Day {item.day}</p>
                <p>Status: {item.sold ? `Sold via ${item.soldChannel}` : 'Unsold'}</p>
                {item.models?.length > 0 && (
                  <div className="mobile-cast-strip">
                    {item.models.map((model) => (
                      <figure key={`${item.id}-${model.id}`} className="mobile-cast-chip" title={model.name}>
                        <img src={model.imageUrl} alt={model.name} />
                        <figcaption>{model.name}</figcaption>
                      </figure>
                    ))}
                  </div>
                )}
                {!item.sold && (
                  <div className="mobile-row-btn mobile-row-wrap">
                    {item.saleOffers?.company && (
                      <button onClick={() => run(state.sellInventoryItem(item.id, 'company'), 'Sold to company.')}>Company</button>
                    )}
                    {item.saleOffers?.individual && (
                      <button onClick={() => run(state.sellInventoryItem(item.id, 'individual'), 'Sold to individual.')}>Individual</button>
                    )}
                    {item.saleOffers?.sponsor && item.freelanceGig && (
                      <button onClick={() => run(state.sellInventoryItem(item.id, 'sponsor'), 'Sold to sponsor.')}>Sponsor</button>
                    )}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>

        <button className="mobile-endday" onClick={() => run(state.endDay(), 'Day ended. Contracts and rentals updated.')}>End Day</button>
      </section>

      {staffModalOpen && (
        <div className="mobile-modal-overlay" onClick={(event) => event.stopPropagation()}>
          <div className="mobile-modal" onClick={(event) => event.stopPropagation()}>
            <h3>Hire Staff</h3>
            <div className="mobile-scroll">
              {state.staffMarket.map((staff) => {
                const canHireDaily = state.money >= staff.dailyFee
                const canHireWeekly = state.money >= staff.weeklyFee
                const canHireMonthly = state.money >= staff.monthlyFee

                return (
                  <article key={staff.id} className="mobile-unit">
                    <img src={staff.imageUrl} alt={staff.name} />
                    <div>
                      <strong>{staff.name}</strong>
                      <p>Role: {staff.role}</p>
                      <p>Skill: {staff.skill}</p>
                      <p>Daily Fee: {money(staff.dailyFee)}</p>
                      <p>Weekly Fee: {money(staff.weeklyFee)}</p>
                      <p>Monthly Fee: {money(staff.monthlyFee)}</p>
                      <div className="mobile-row-btn mobile-row-wrap">
                        <button
                          disabled={!canHireDaily}
                          onClick={() => run(state.hireStaff(staff.id, 'daily'), `${staff.name} hired for daily contract.`)}
                        >
                          Hire Daily
                        </button>
                        <button
                          disabled={!canHireWeekly}
                          onClick={() => run(state.hireStaff(staff.id, 'weekly'), `${staff.name} hired for weekly contract.`)}
                        >
                          Hire Weekly
                        </button>
                        <button
                          disabled={!canHireMonthly}
                          onClick={() => run(state.hireStaff(staff.id, 'monthly'), `${staff.name} hired for monthly contract.`)}
                        >
                          Hire Monthly
                        </button>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
            <button className="mobile-close" onClick={() => setStaffModalOpen(false)}>Close</button>
          </div>
        </div>
      )}

      {studioModalOpen && (
        <div className="mobile-modal-overlay" onClick={(event) => event.stopPropagation()}>
          <div className="mobile-modal" onClick={(event) => event.stopPropagation()}>
            <h3>Rent or Buy Studio</h3>
            <div className="mobile-scroll">
              {state.studioCatalog.map((studio) => {
                const canRentDay = state.money >= studio.rentFees.day
                const canRentWeek = state.money >= studio.rentFees.week
                const canRentMonth = state.money >= studio.rentFees.month
                const canBuy = state.money >= studio.buyPrice

                return (
                  <article key={studio.id} className="mobile-unit">
                    <img src={studio.imageUrl} alt={studio.name} />
                    <div>
                      <strong>{studio.name}</strong>
                      <p>Quality Bonus: {studio.qualityBonus}</p>
                      <p>Rent Day: {money(studio.rentFees.day)}</p>
                      <p>Rent Week: {money(studio.rentFees.week)}</p>
                      <p>Rent Month: {money(studio.rentFees.month)}</p>
                      <p>Buy Price: {money(studio.buyPrice)}</p>
                      <div className="mobile-row-btn mobile-row-wrap">
                        <button disabled={!canRentDay} onClick={() => run(state.rentStudio(studio.id, 'day'), `${studio.name} rented for day.`)}>Rent Day</button>
                        <button disabled={!canRentWeek} onClick={() => run(state.rentStudio(studio.id, 'week'), `${studio.name} rented for week.`)}>Rent Week</button>
                        <button disabled={!canRentMonth} onClick={() => run(state.rentStudio(studio.id, 'month'), `${studio.name} rented for month.`)}>Rent Month</button>
                        <button disabled={!canBuy} onClick={() => run(state.buyStudio(studio.id), `${studio.name} purchased.`)}>Buy</button>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
            <button className="mobile-close" onClick={() => setStudioModalOpen(false)}>Close</button>
          </div>
        </div>
      )}

      {modelModalOpen && (
        <div className="mobile-modal-overlay" onClick={(event) => event.stopPropagation()}>
          <div className="mobile-modal" onClick={(event) => event.stopPropagation()}>
            <h3>Hire Models</h3>
            <div className="mobile-scroll">
              {availableModels.map((model) => {
                const hiringFee = 500 + model.quality * 35
                const unlocked = state.companyReputation >= model.unlockReputation
                const affordable = state.money >= hiringFee
                const canHire = unlocked && affordable

                return (
                  <article key={model.id} className="mobile-unit">
                    <img src={model.imageUrl} alt={model.name} />
                    <div>
                      <strong>{model.name}</strong>
                      <p>Gender: {model.gender}</p>
                      <p>Age: {model.age}</p>
                      <p>Ethnicity: {model.ethnicity}</p>
                      <p>Height: {model.height} cm</p>
                      <p>Weight: {model.weight} kg</p>
                      <p>Body Type: {model.bodyType}</p>
                      <p>Skin Color: {model.skinColor}</p>
                      <p>Popularity: {model.popularity}</p>
                      <p>Total Special Video: {model.totalSpecialVideo}</p>
                      <p>Total Body Shoot: {model.totalBodyShoot}</p>
                      <p>Total Basic Shoot: {model.totalBasicShoot}</p>
                      <p>Total Movie: {model.totalMovie}</p>
                      <p>Money: {money(model.money)}</p>
                      <p>Fitness: {model.fitness}</p>
                      <p>Stamina: {model.stamina}</p>
                      <p>Hapiness: {model.hapiness}</p>
                      <p>Quality: {model.quality}</p>
                      <p>Unlock Reputation: {model.unlockReputation}</p>
                      <p>Hiring Fee: {money(hiringFee)}</p>
                      <button disabled={!canHire} onClick={() => run(state.hireModel(model.id), `${model.name} joined your roster.`)}>
                        Hire
                      </button>
                    </div>
                  </article>
                )
              })}
            </div>
            <button className="mobile-close" onClick={() => setModelModalOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </main>
  )
}

export default MobileGameView
