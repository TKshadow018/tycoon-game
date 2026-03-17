import { BriefcaseBusiness } from 'lucide-react'
import { useState } from 'react'

function FreelanceSection({
  dailyFreelanceGigs,
  activeGigContracts,
  workTypes,
  popularity,
  getCompanyRelation,
  onBid,
  money,
}) {
  const [showContracts, setShowContracts] = useState(false)
  const [bidByGig, setBidByGig] = useState({})

  return (
    <article className="pc-card">
      <div className="pc-card-head">
        <h2><BriefcaseBusiness size={16} /> Freelance Work</h2>
        <button
          type="button"
          className="pc-toggle-btn"
          onClick={() => setShowContracts((current) => !current)}
        >
          {showContracts ? 'Works' : 'Contracts'}
        </button>
      </div>

      {showContracts ? (
        <>
          <p className="pc-muted">Active Contracts: {activeGigContracts.length}</p>
          <div className="pc-scroll pc-tight-scroll">
            {activeGigContracts.length === 0 && <p className="pc-muted">No active freelance contracts.</p>}
            {activeGigContracts.map((contract) => (
              <div key={contract.id} className="pc-gig-row">
                <strong>Company: {contract.companyName}</strong>
                <p>Ad Type: {workTypes[contract.requirements.shootType].label}</p>
                <p>Requirements: Cast {contract.requirements.castType} · Min Models {contract.requirements.minModels} · Min Grade {contract.requirements.minGrade}</p>
                <p>Relationship: {getCompanyRelation(contract.companyId)}</p>
                <p>Budget: {money(contract.agreedPayment)}</p>
                <p>Deadline: day {contract.expiresOnDay}</p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="pc-scroll pc-tight-scroll">
          {dailyFreelanceGigs.length === 0 && <p className="pc-muted">No new freelance ads today. End day to refresh gigs.</p>}
          {dailyFreelanceGigs.map((gig) => {
            const bidValue = bidByGig[gig.id] ?? gig.suggestedBudget
            return (
              <div key={gig.id} className="pc-gig-row">
                <strong>Company: {gig.companyName}</strong>
                <p>Ad Type: {workTypes[gig.requirements.shootType].label}</p>
                <p>Requirements: Cast {gig.requirements.castType} · Min Models {gig.requirements.minModels} · Min Grade {gig.requirements.minGrade}</p>
                <p>Relationship: {getCompanyRelation(gig.companyId)}</p>
                <p>Budget: {money(gig.suggestedBudget)}</p>
                <p>Deadline: {gig.deadlineDays} day(s)</p>
                <div className="pc-gig-actions">
                  <input
                    type="number"
                    value={bidValue}
                    onChange={(event) =>
                      setBidByGig((current) => ({ ...current, [gig.id]: event.target.value }))
                    }
                  />
                  <button
                    onClick={() => onBid(gig, Number(bidValue || gig.suggestedBudget))}
                    disabled={popularity < gig.minimumPopularity}
                  >
                    Bid
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </article>
  )
}

export default FreelanceSection
