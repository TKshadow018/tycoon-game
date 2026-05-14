import { Camera } from 'lucide-react'

function EquipmentSection({ ownedEquipment, onOpenEquipmentModal, onSellEquipment, money }) {
  const countByCategory = ownedEquipment.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1
    return acc
  }, {})

  return (
    <article className="pc-card">
      <div className="pb-head-row">
        <h2><Camera size={16} /> Gear Vault</h2>
        <button className="pc-add-btn" onClick={onOpenEquipmentModal}>Open Equipment Shop</button>
      </div>

      <div className="pb-mini-stats">
        <span>Cameras {countByCategory.camera || 0}</span>
        <span>Lights {countByCategory.lights || 0}</span>
        <span>Dress {countByCategory.dress || 0}</span>
      </div>

      <div className="pc-scroll">
        {ownedEquipment.length === 0 && <p className="pc-muted">No equipment owned. Buy a camera first.</p>}
        {ownedEquipment.length > 0 && (
          <>
            {ownedEquipment.map((item) => (
              <div key={item.id} className="pb-tile">
                <div>
                  <strong>{item.name}</strong>
                  <p>{item.category} · {item.subCategory || 'general'}</p>
                  <p>Quality bonus +{item.qualityBonus}</p>
                  <p>Sell value {money(Math.round(item.price * 0.5))}</p>
                  <div className="pb-inline-actions">
                    <button onClick={() => onSellEquipment(item.id, item.name)}>Liquidate</button>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </article>
  )
}

export default EquipmentSection
