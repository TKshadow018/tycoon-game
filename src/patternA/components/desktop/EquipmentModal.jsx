import { useMemo, useState } from 'react'
import ModalCloseButton from './ModalCloseButton'

function EquipmentModal({
  open,
  onClose,
  equipmentCatalog,
  ownedEquipmentIds,
  moneyValue,
  money,
  onBuy,
}) {
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [subCategoryFilter, setSubCategoryFilter] = useState('all')
  const [ownershipFilter, setOwnershipFilter] = useState('all')
  const [affordabilityFilter, setAffordabilityFilter] = useState('all')
  const [sortBy, setSortBy] = useState('price-asc')

  const categoryOptions = useMemo(
    () => [...new Set(equipmentCatalog.map((item) => item.category))],
    [equipmentCatalog],
  )

  const subCategoryOptions = useMemo(() => {
    const source =
      categoryFilter === 'all'
        ? equipmentCatalog
        : equipmentCatalog.filter((item) => item.category === categoryFilter)

    return [...new Set(source.map((item) => item.subCategory).filter(Boolean))]
  }, [categoryFilter, equipmentCatalog])

  const visibleEquipment = useMemo(() => {
    const searchTerm = search.trim().toLowerCase()

    const filtered = equipmentCatalog.filter((item) => {
      const isOwned = ownedEquipmentIds.includes(item.id)
      const canAfford = moneyValue >= item.price

      if (categoryFilter !== 'all' && item.category !== categoryFilter) return false
      if (subCategoryFilter !== 'all' && item.subCategory !== subCategoryFilter) return false
      if (ownershipFilter === 'owned' && !isOwned) return false
      if (ownershipFilter === 'not-owned' && isOwned) return false
      if (affordabilityFilter === 'affordable' && !canAfford) return false
      if (affordabilityFilter === 'too-expensive' && canAfford) return false

      if (!searchTerm) return true
      const searchable = `${item.name} ${item.category} ${item.subCategory || ''}`.toLowerCase()
      return searchable.includes(searchTerm)
    })

    return [...filtered].sort((first, second) => {
      switch (sortBy) {
        case 'name-desc':
          return second.name.localeCompare(first.name)
        case 'price-asc':
          return first.price - second.price
        case 'price-desc':
          return second.price - first.price
        case 'quality-asc':
          return first.qualityBonus - second.qualityBonus
        case 'quality-desc':
          return second.qualityBonus - first.qualityBonus
        default:
          return first.name.localeCompare(second.name)
      }
    })
  }, [
    affordabilityFilter,
    categoryFilter,
    equipmentCatalog,
    moneyValue,
    ownedEquipmentIds,
    subCategoryFilter,
    ownershipFilter,
    search,
    sortBy,
  ])

  if (!open) return null

  return (
    <div className="pc-modal-overlay" onClick={(event) => event.stopPropagation()}>
      <div className="pc-modal" onClick={(event) => event.stopPropagation()}>
        <ModalCloseButton onClose={onClose} />
        <h3>Buy Equipment</h3>

        <div className="pc-equipment-toolbar">
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search equipment..."
          />

          <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
            <option value="all">All Categories</option>
            {categoryOptions.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          <select value={subCategoryFilter} onChange={(event) => setSubCategoryFilter(event.target.value)}>
            <option value="all">All Sub Categories</option>
            {subCategoryOptions.map((subCategory) => (
              <option key={subCategory} value={subCategory}>{subCategory}</option>
            ))}
          </select>

          <select value={ownershipFilter} onChange={(event) => setOwnershipFilter(event.target.value)}>
            <option value="all">All Ownership</option>
            <option value="not-owned">Not Owned</option>
            <option value="owned">Owned</option>
          </select>

          <select value={affordabilityFilter} onChange={(event) => setAffordabilityFilter(event.target.value)}>
            <option value="all">All Budgets</option>
            <option value="affordable">Affordable</option>
            <option value="too-expensive">Too Expensive</option>
          </select>

          <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
            <option value="name-asc">Sort: Name A-Z</option>
            <option value="name-desc">Sort: Name Z-A</option>
            <option value="price-asc">Sort: Price Low-High</option>
            <option value="price-desc">Sort: Price High-Low</option>
            <option value="quality-asc">Sort: Bonus Low-High</option>
            <option value="quality-desc">Sort: Bonus High-Low</option>
          </select>

          <button
            type="button"
            className="pc-model-reset"
            onClick={() => {
              setSearch('')
              setCategoryFilter('all')
              setSubCategoryFilter('all')
              setOwnershipFilter('all')
              setAffordabilityFilter('all')
              setSortBy('price-asc')
            }}
          >
            Reset
          </button>
        </div>

        <p className="pc-muted">Showing {visibleEquipment.length} of {equipmentCatalog.length} items.</p>

        <div className="pc-scroll-lg">
          {visibleEquipment.length === 0 && <p className="pc-muted">No equipment matches the current filters.</p>}
          <div className="pc-equipment-grid">
            {visibleEquipment.map((item) => {
              const isOwned = ownedEquipmentIds.includes(item.id)
              const canBuy = !isOwned && moneyValue >= item.price
              const imageUrl = item.imageUrl || '/equipment/kit/1.jpg'

              return (
                <div key={item.id} className="pc-equipment-card">
                  <img src={imageUrl} alt={item.name} />
                  <div>
                    <strong>{item.name}</strong>
                    <p>Category: {item.category}</p>
                    <p>Sub Category: {item.subCategory || 'general'}</p>
                    <p>Price: {money(item.price)}</p>
                    <p>Quality Bonus: +{item.qualityBonus}</p>
                    {item.category === 'camera' && <p>Required Item</p>}
                    <div className="pc-actions">
                      <button
                        disabled={!canBuy}
                        onClick={() => onBuy(item.id, item.name)}
                      >
                        {isOwned ? 'Owned' : 'Buy'}
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default EquipmentModal
