import { Camera, Lightbulb, Shirt } from 'lucide-react'

function EquipmentSection({ ownedEquipment, onOpenEquipmentModal, onSellEquipment, money }) {
  const countByCategory = ownedEquipment.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1
    return acc
  }, {})

  return (
    <article className="pc-card">
      <h2><Camera size={16} /> Equipment</h2>
      <button className="pc-add-btn" onClick={onOpenEquipmentModal}>+ Buy Equipment</button>
      <div className="pc-scroll">
        {ownedEquipment.length === 0 && <p className="pc-muted">No equipment owned. Buy a camera first.</p>}
        {ownedEquipment.length > 0 && (
          <>
            <p className="pc-muted">
              Cameras: {countByCategory.camera || 0} · Lights: {countByCategory.lights || 0} · Dress: {countByCategory.dress || 0}
            </p>
            {ownedEquipment.map((item) => (
              <div key={item.id} className="pc-unit">
                <div>
                  <strong>{item.name}</strong>
                  <p>Category: {item.category}</p>
                  <p>Sub Category: {item.subCategory || 'general'}</p>
                  <p>Quality Bonus: +{item.qualityBonus}</p>
                  <p>Sell Price: {money(Math.round(item.price * 0.5))}</p>
                  <div className="pc-actions">
                    <button onClick={() => onSellEquipment(item.id, item.name)}>Sell</button>
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
