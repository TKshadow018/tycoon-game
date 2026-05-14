import { Building2, Camera, Clock3, ListPlus, ShieldCheck, TrendingUp, Users, UserPlus } from 'lucide-react'
import { useMemo, useState } from 'react'
import ModalCloseButton from './ModalCloseButton'
import ModelMetaItem from './ModelMetaItem'

function ModelModal({ open, onClose, availableModels, companyReputation, onHire, money }) {
  const [modelSearch, setModelSearch] = useState('')
  const [modelGenderFilter, setModelGenderFilter] = useState('all')
  const [modelEthnicityFilter, setModelEthnicityFilter] = useState('all')
  const [modelLevelFilter, setModelLevelFilter] = useState('all')
  const [modelFitnessFilter, setModelFitnessFilter] = useState('all')
  const [modelSortBy, setModelSortBy] = useState('fee-asc')

  const getModelHiringFee = (model) => 500 + model.quality * 35

  const genderOptions = useMemo(
    () => [...new Set(availableModels.map((model) => model.gender).filter(Boolean))],
    [availableModels],
  )

  const ethnicityOptions = useMemo(
    () => [...new Set(availableModels.map((model) => model.ethnicity).filter(Boolean))],
    [availableModels],
  )

  const filteredAvailableModels = useMemo(() => {
    const searchTerm = modelSearch.trim().toLowerCase()

    const filtered = availableModels.filter((model) => {
      if (modelGenderFilter !== 'all' && model.gender !== modelGenderFilter) return false
      if (modelEthnicityFilter !== 'all' && model.ethnicity !== modelEthnicityFilter) return false

      if (modelLevelFilter === 'low' && model.quality > 33) return false
      if (modelLevelFilter === 'mid' && (model.quality <= 33 || model.quality > 66)) return false
      if (modelLevelFilter === 'high' && model.quality <= 66) return false

      if (modelFitnessFilter === 'low' && model.fitness > 40) return false
      if (modelFitnessFilter === 'mid' && (model.fitness <= 40 || model.fitness > 70)) return false
      if (modelFitnessFilter === 'high' && model.fitness <= 70) return false

      if (!searchTerm) return true

      const searchable = [model.name, model.gender, model.ethnicity, model.bodyType, model.skinColor]
        .join(' ')
        .toLowerCase()

      return searchable.includes(searchTerm)
    })

    return [...filtered].sort((first, second) => {
      switch (modelSortBy) {
        case 'name-desc':
          return second.name.localeCompare(first.name)
        case 'quality-desc':
          return second.quality - first.quality
        case 'quality-asc':
          return first.quality - second.quality
        case 'fitness-desc':
          return second.fitness - first.fitness
        case 'fitness-asc':
          return first.fitness - second.fitness
        case 'fee-desc':
          return getModelHiringFee(second) - getModelHiringFee(first)
        case 'fee-asc':
          return getModelHiringFee(first) - getModelHiringFee(second)
        case 'popularity-desc':
          return second.popularity - first.popularity
        case 'popularity-asc':
          return first.popularity - second.popularity
        default:
          return first.name.localeCompare(second.name)
      }
    })
  }, [
    availableModels,
    modelEthnicityFilter,
    modelFitnessFilter,
    modelGenderFilter,
    modelLevelFilter,
    modelSearch,
    modelSortBy,
  ])

  const averageQuality = filteredAvailableModels.length
    ? Math.round(filteredAvailableModels.reduce((sum, model) => sum + (model.quality || 0), 0) / filteredAvailableModels.length)
    : 0

  if (!open) return null

  return (
    <div className="pc-modal-overlay" onClick={(event) => event.stopPropagation()}>
      <div className="pc-modal" onClick={(event) => event.stopPropagation()}>
        <ModalCloseButton onClose={onClose} />
        <div className="pb-modal-head">
          <h3>Model Scouting Board</h3>
          <p className="pc-muted">Scout, filter, and sign talents that match your current brand trajectory.</p>
        </div>

        <div className="pb-mini-stats">
          <span>Visible {filteredAvailableModels.length}</span>
          <span>Average Quality {averageQuality}</span>
          <span>Reputation Gate {companyReputation}</span>
        </div>

        <div className="pc-model-toolbar">
          <input
            type="text"
            value={modelSearch}
            onChange={(event) => setModelSearch(event.target.value)}
            placeholder="Search by name, ethnicity, body type..."
          />

          <select value={modelGenderFilter} onChange={(event) => setModelGenderFilter(event.target.value)}>
            <option value="all">All Genders</option>
            {genderOptions.map((gender) => (
              <option key={gender} value={gender}>{gender}</option>
            ))}
          </select>

          <select value={modelLevelFilter} onChange={(event) => setModelLevelFilter(event.target.value)}>
            <option value="all">All Levels</option>
            <option value="low">Low Level (Quality up to 33)</option>
            <option value="mid">Mid Level (34 - 66)</option>
            <option value="high">High Level (67+)</option>
          </select>

          <select value={modelEthnicityFilter} onChange={(event) => setModelEthnicityFilter(event.target.value)}>
            <option value="all">All Ethnicities</option>
            {ethnicityOptions.map((ethnicity) => (
              <option key={ethnicity} value={ethnicity}>{ethnicity}</option>
            ))}
          </select>

          <select value={modelFitnessFilter} onChange={(event) => setModelFitnessFilter(event.target.value)}>
            <option value="all">All Fitness</option>
            <option value="low">Low Fitness (up to 40)</option>
            <option value="mid">Mid Fitness (41 - 70)</option>
            <option value="high">High Fitness (71+)</option>
          </select>

          <select value={modelSortBy} onChange={(event) => setModelSortBy(event.target.value)}>
            <option value="name-asc">Sort: Name A-Z</option>
            <option value="name-desc">Sort: Name Z-A</option>
            <option value="quality-desc">Sort: Level High-Low</option>
            <option value="quality-asc">Sort: Level Low-High</option>
            <option value="fitness-desc">Sort: Fitness High-Low</option>
            <option value="fitness-asc">Sort: Fitness Low-High</option>
            <option value="fee-desc">Sort: Fee High-Low</option>
            <option value="fee-asc">Sort: Fee Low-High</option>
            <option value="popularity-desc">Sort: Popularity High-Low</option>
            <option value="popularity-asc">Sort: Popularity Low-High</option>
          </select>

          <button
            type="button"
            className="pc-model-reset"
            onClick={() => {
              setModelSearch('')
              setModelGenderFilter('all')
              setModelEthnicityFilter('all')
              setModelLevelFilter('all')
              setModelFitnessFilter('all')
              setModelSortBy('fee-asc')
            }}
          >
            Reset
          </button>
        </div>

        <div className="pc-model-grid">
          {filteredAvailableModels.length === 0 && <p className="pc-muted">No models match your filters.</p>}
          {filteredAvailableModels.map((model) => {
            const hiringFee = getModelHiringFee(model)
            const unlocked = companyReputation >= model.unlockReputation
            const canHire = unlocked

            return (
              <div key={model.id} className="pb-market-card pb-model-card-b">
                <img src={model.imageUrl} alt={model.name} />
                <strong>{model.name}</strong>
                <ModelMetaItem icon={Users}>Gender: {model.gender}</ModelMetaItem>
                <ModelMetaItem icon={Clock3}>Age: {model.age}</ModelMetaItem>
                <ModelMetaItem icon={ShieldCheck}>Ethnicity: {model.ethnicity}</ModelMetaItem>
                <ModelMetaItem icon={TrendingUp}>Height: {model.height} cm</ModelMetaItem>
                <ModelMetaItem icon={TrendingUp}>Weight: {model.weight} kg</ModelMetaItem>
                <ModelMetaItem icon={UserPlus}>Body Type: {model.bodyType}</ModelMetaItem>
                <ModelMetaItem icon={Building2}>Skin Color: {model.skinColor}</ModelMetaItem>
                <ModelMetaItem icon={TrendingUp}>Popularity: {model.popularity}</ModelMetaItem>
                <ModelMetaItem icon={Camera}>Total Special Video: {model.totalSpecialVideo}</ModelMetaItem>
                <ModelMetaItem icon={Camera}>Total Body Shoot: {model.totalBodyShoot}</ModelMetaItem>
                <ModelMetaItem icon={Camera}>Total Basic Shoot: {model.totalBasicShoot}</ModelMetaItem>
                <ModelMetaItem icon={ListPlus}>Total Movie: {model.totalMovie}</ModelMetaItem>
                <ModelMetaItem icon={TrendingUp}>Money: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(model.money)}</ModelMetaItem>
                <ModelMetaItem icon={ShieldCheck}>Fitness: {model.fitness}</ModelMetaItem>
                <ModelMetaItem icon={Clock3}>Stamina: {model.stamina}</ModelMetaItem>
                <ModelMetaItem icon={Users}>Hapiness: {model.hapiness}</ModelMetaItem>
                <ModelMetaItem icon={ShieldCheck}>Quality: {model.quality}</ModelMetaItem>
                <ModelMetaItem icon={TrendingUp}>Unlock Reputation: {model.unlockReputation}</ModelMetaItem>
                <ModelMetaItem icon={ListPlus}>Hiring Fee: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(hiringFee)}</ModelMetaItem>
                <p>Payment is deferred to contract end.</p>
                <button type="button" disabled={!canHire} onClick={() => onHire(model.id, model.name)}>
                  {canHire ? 'Sign Model' : 'Reputation Too Low'}
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default ModelModal
