import { Users } from 'lucide-react'

function StaffSection({ hiredStaff, onOpenStaffModal, onRenewStaffContract, money }) {
  const contractLabel = (hireType) => {
    if (hireType === 'daily') return 'Daily'
    if (hireType === 'weekly') return 'Weekly'
    if (hireType === 'monthly') return 'Monthly'
    return 'Custom'
  }

  return (
    <article className="pc-card">
      <h2><Users size={16} /> Staff</h2>
      <button className="pc-add-btn" onClick={onOpenStaffModal}>+ Add Staff</button>
      <div className="pc-scroll">
        {hiredStaff.length === 0 && <p className="pc-muted">No staff hired yet.</p>}
        {hiredStaff.map((staff) => (
          <div key={staff.hiredId} className="pc-unit">
            <img src={staff.imageUrl} alt={staff.name} />
            <div>
              <strong>{staff.name}</strong>
              <p>{staff.role} · Category: {staff.category} · Skill {staff.skill}</p>
              <p>Level: {staff.tier}</p>
              <p>Type: {contractLabel(staff.hireType)} Contract</p>
              <p>Days Left: {staff.contractDaysLeft ?? '-'}</p>
              <p>Status: {staff.awaitingPayment ? 'Payment Pending' : (staff.contractDaysLeft ?? 0) > 0 ? 'Active' : 'Expired'}</p>

              {(staff.contractDaysLeft ?? 0) <= 0 && !staff.awaitingPayment && (
                <div className="pc-actions pc-actions-wrap">
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
