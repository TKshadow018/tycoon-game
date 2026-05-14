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
        <h2><BriefcaseBusiness size={16} /> Contract Pipeline</h2>
        <button
          type="button"
          className="pc-toggle-btn"
          onClick={() => setShowContracts((current) => !current)}
        >
          {showContracts ? 'Show Bids' : 'Show Active'}
        </button>
      </div>

      {showContracts ? (
        <>
          <p className="pc-muted">Active contracts: {activeGigContracts.length}</p>
          <div className="pc-scroll pc-tight-scroll">
            {activeGigContracts.length === 0 && <p className="pc-muted">No active freelance contracts.</p>}
            {activeGigContracts.map((contract) => (
              <div key={contract.id} className="pb-gig-tile">
                <div className="pb-gig-top">
                  <strong>{contract.companyName}</strong>
                  <span>Deadline D{contract.expiresOnDay}</span>
                </div>
                <p>{workTypes[contract.requirements.shootType].label} · Cast {contract.requirements.castType}</p>
                <p>Req: {contract.requirements.minModels} models · Grade {contract.requirements.minGrade}+</p>
                <p>Relation {getCompanyRelation(contract.companyId)} · Budget {money(contract.agreedPayment)}</p>
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
              <div key={gig.id} className="pb-gig-tile">
                <div className="pb-gig-top">
                  <strong>{gig.companyName}</strong>
                  <span>{workTypes[gig.requirements.shootType].label}</span>
                </div>
                <p>Cast {gig.requirements.castType} · Min models {gig.requirements.minModels}</p>
                <p>Min grade {gig.requirements.minGrade} · Deadline {gig.deadlineDays}d</p>
                <p>Relation {getCompanyRelation(gig.companyId)} · Suggested {money(gig.suggestedBudget)}</p>
                <div className="pb-gig-actions">
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
                    Submit Bid
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
