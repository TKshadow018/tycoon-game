import { Users } from 'lucide-react'

function StaffSection({ hiredStaff, onOpenStaffModal, onRenewStaffContract, money }) {
  const contractLabel = (hireType) => {
    if (hireType === 'daily') return 'Daily'
    if (hireType === 'weekly') return 'Weekly'
    if (hireType === 'monthly') return 'Monthly'
    return 'Custom'
  }

  const activeCount = hiredStaff.filter((staff) => (staff.contractDaysLeft ?? 0) > 0 && !staff.awaitingPayment).length
  const pendingCount = hiredStaff.filter((staff) => staff.awaitingPayment).length
  const expiredCount = hiredStaff.filter((staff) => (staff.contractDaysLeft ?? 0) <= 0 && !staff.awaitingPayment).length

  return (
    <article className="pc-card">
      <div className="pb-head-row">
        <h2><Users size={16} /> Crew Desk</h2>
        <button className="pc-add-btn" onClick={onOpenStaffModal}>Recruit Crew</button>
      </div>

      <div className="pb-mini-stats">
        <span>Active {activeCount}</span>
        <span>Pending {pendingCount}</span>
        <span>Expired {expiredCount}</span>
      </div>

      <div className="pc-scroll">
        {hiredStaff.length === 0 && <p className="pc-muted">No staff hired yet.</p>}
        {hiredStaff.map((staff) => (
          <div key={staff.hiredId} className="pb-tile">
            <img src={staff.imageUrl} alt={staff.name} />
            <div>
              <strong>{staff.name}</strong>
              <p>{staff.role} · {staff.category} · Skill {staff.skill}</p>
              <p>Tier {staff.tier} · Contract {contractLabel(staff.hireType)}</p>
              <p>Days left {staff.contractDaysLeft ?? '-'}</p>
              <p>Status: {staff.awaitingPayment ? 'Payment Pending' : (staff.contractDaysLeft ?? 0) > 0 ? 'Active' : 'Expired'}</p>

              {(staff.contractDaysLeft ?? 0) <= 0 && !staff.awaitingPayment && (
                <div className="pb-inline-actions">
                  <button type="button" onClick={() => onRenewStaffContract?.(staff.hiredId, 'day')}>
                    Renew Day ({money(staff.dailyFee)})
                  </button>
                  <button type="button" onClick={() => onRenewStaffContract?.(staff.hiredId, 'week')}>
                    Renew Week ({money(staff.weeklyFee)})
                  </button>
                  <button type="button" onClick={() => onRenewStaffContract?.(staff.hiredId, 'month')}>
                    Renew Month ({money(staff.monthlyFee)})
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

export default StaffSection
