import { useEffect, useMemo, useState } from 'react'
import ModalCloseButton from './ModalCloseButton'
import {
  BANNER_STYLE_PRESETS,
  generateLocalProductionBanner,
} from '../../utils/localBannerGenerator'
import shootType1Base64 from '../../assets/shooting-type-1.base64.txt?raw'
import shootType2Base64 from '../../assets/shooting-type-2.base64.txt?raw'
import shootType3Base64 from '../../assets/shooting-type-3.base64.txt?raw'
import shootType4Base64 from '../../assets/shooting-type-4.base64.txt?raw'
import shootType5Base64 from '../../assets/shooting-type-5.base64.txt?raw'

const serviceImageByLevel = {
  low: '/service/2.jpg',
  medium: '/service/3.jpg',
  good: '/service/4.jpg',
  excellent: '/service/5.jpg',
}

const shootTypeImageByKey = {
  basic: `data:image/jpeg;base64,${shootType1Base64}`,
  ad: `data:image/jpeg;base64,${shootType2Base64}`,
  movie: `data:image/jpeg;base64,${shootType3Base64}`,
  body: `data:image/jpeg;base64,${shootType4Base64}`,
  special: `data:image/jpeg;base64,${shootType5Base64}`,
}

function ProductionModal({
  open,
  onClose,
  state,
  money,
  selectedGigId,
  setSelectedGigId,
  selectedModelIds,
  toggleModelSelection,
  staffByCategory,
  setStaffByCategory,
  shootType,
  setShootType,
  nameMode,
  setNameMode,
  customTitle,
  setCustomTitle,
  previousTitle,
  setPreviousTitle,
  previousBaseTitles,
  description,
  setDescription,
  locationId,
  setLocationId,
  serviceLevel,
  setServiceLevel,
  dressPartnerId,
  setDressPartnerId,
  selectedEquipmentIds,
  setSelectedEquipmentIds,
  ownedEquipment,
  productionPreview,
  canStartShoot,
  shootBlockReason,
  onStartShoot,
  isShootInProgress = false,
  bannerPresetKey,
  setBannerPresetKey,
  selectedBannerModelId,
  setSelectedBannerModelId,
}) {
  if (!open) return null

  const availableLocations = state.activeStudio
    ? state.shootLocations.filter((location) => location.id === `location-${state.activeStudio.id}`)
    : []

  const workTypeEntries = Object.entries(state.workTypes)

  const resolveShootTypeImage = (key, item) => {
    const mapped = shootTypeImageByKey[key]
    if (mapped) return mapped
    if (item?.imageUrl) return encodeURI(item.imageUrl)
    return shootTypeImageByKey.basic
  }

  const isShootTypeLocked = (item) => state.popularity < (item.unlockAt || 0)
  const visibleWorkTypeEntries = workTypeEntries.filter(([, item]) => {
    const shouldHideBeforeUnlock = item.hiddenBeforeUnlock === true
    return !(shouldHideBeforeUnlock && isShootTypeLocked(item))
  })

  const [livePreviewUrl, setLivePreviewUrl] = useState('')
  const [isPreviewGenerating, setIsPreviewGenerating] = useState(false)
  const [previewGenerationError, setPreviewGenerationError] = useState('')
  const [editorPage, setEditorPage] = useState('setup')

  const selectedModels = useMemo(
    () => state.roster.filter((model) => selectedModelIds.includes(model.id)),
    [state.roster, selectedModelIds],
  )

  const selectedBannerModel = useMemo(() => {
    if (selectedModels.length === 0) return null
    const picked = selectedModels.find((model) => model.id === selectedBannerModelId)
    return picked || selectedModels[0]
  }, [selectedModels, selectedBannerModelId])

  const liveDirectorName = useMemo(() => {
    const directorChoice = staffByCategory?.director
    if (!directorChoice || directorChoice === 'owner') return 'Owner (You)'

    const selectedDirector = state.hiredStaff.find((staff) => staff.hiredId === directorChoice)
    return selectedDirector?.name || 'Owner (You)'
  }, [staffByCategory, state.hiredStaff])

  const liveTitle = useMemo(() => {
    if (productionPreview?.ok && productionPreview?.result?.title) return productionPreview.result.title
    if (nameMode === 'previous') return previousTitle || 'Untitled Shoot'
    return customTitle || 'Untitled Shoot'
  }, [productionPreview, nameMode, previousTitle, customTitle])

  const liveShootTypeLabel = state.workTypes?.[shootType]?.label || 'Production'

  useEffect(() => {
    if (!open) return

    if (selectedModels.length === 0) {
      if (selectedBannerModelId) setSelectedBannerModelId('')
      return
    }

    const selectedStillValid = selectedModels.some((model) => model.id === selectedBannerModelId)
    if (!selectedStillValid) {
      setSelectedBannerModelId(selectedModels[0].id)
    }
  }, [open, selectedModels, selectedBannerModelId, setSelectedBannerModelId])

  useEffect(() => {
    if (!open) {
      setLivePreviewUrl('')
      setPreviewGenerationError('')
      setIsPreviewGenerating(false)
      return
    }

    let alive = true
    const timer = setTimeout(async () => {
      setIsPreviewGenerating(true)
      setPreviewGenerationError('')

      const previewResult = await generateLocalProductionBanner({
        companyName: state.companyName,
        title: liveTitle,
        shootType: liveShootTypeLabel,
        directorName: liveDirectorName,
        modelImageUrl: selectedBannerModel?.imageUrl || '',
        modelNames: selectedModels.map((model) => model.name),
        bannerPreset: bannerPresetKey,
      })

      if (!alive) return

      if (previewResult.ok) {
        setLivePreviewUrl(previewResult.result.coverImageUrl)
        setPreviewGenerationError('')
      } else {
        setPreviewGenerationError(previewResult.error || 'Preview generation failed.')
      }

      setIsPreviewGenerating(false)
    }, 180)

    return () => {
      alive = false
      clearTimeout(timer)
    }
  }, [
    open,
    state.companyName,
    liveTitle,
    description,
    liveShootTypeLabel,
    liveDirectorName,
    selectedModels,
    selectedBannerModel,
    bannerPresetKey,
  ])

  useEffect(() => {
    if (!open) {
      setEditorPage('setup')
    }
  }, [open])

  return (
    <div className="pc-modal-overlay" onClick={(event) => event.stopPropagation()}>
      <div className="pc-modal" onClick={(event) => event.stopPropagation()}>
        <ModalCloseButton onClose={onClose} />
        <h3>Create Production</h3>

        {editorPage === 'setup' && (
          <>
            <div className="pc-production-form">
          <section>
            <h4>0) Optional Freelance Contract</h4>
            <label className="pc-field">
              <select value={selectedGigId} onChange={(event) => setSelectedGigId(event.target.value)}>
                <option value="">No contract (normal production)</option>
                {state.activeGigContracts.map((gig) => (
                  <option key={gig.id} value={gig.id}>
                    {gig.title} · {gig.companyName} · {money(gig.agreedPayment)}
                  </option>
                ))}
              </select>
            </label>
            {selectedGigId && (
              <p className="pc-muted">
                Requirement: {
                  state.workTypes[
                    state.activeGigContracts.find((gig) => gig.id === selectedGigId)?.requirements
                      .shootType || 'basic'
                  ].label
                }
              </p>
            )}
          </section>

          <section>
            <h4>1) Select Models (1 to 8)</h4>
            <div className="pc-model-picker-grid">
              {state.roster.map((model) => {
                const contractInactive =
                  model.awaitingPayment === true ||
                  (typeof model.contractDaysLeft === 'number' && model.contractDaysLeft <= 0)

                return (
                  <button
                    key={model.id}
                    type="button"
                    className={`pc-production-card-btn pc-model-picker-card${selectedModelIds.includes(model.id) ? ' is-selected' : ''}${contractInactive ? ' is-locked' : ''}`}
                    onClick={() => {
                      if (contractInactive) return
                      toggleModelSelection(model.id)
                    }}
                    disabled={contractInactive}
                    title={contractInactive ? 'Contract ended. Renew from Models panel.' : model.name}
                  >
                    {selectedModelIds.includes(model.id) && <span className="pc-selected-chip">Selected</span>}
                    <img src={model.imageUrl} alt={model.name} className="pc-production-card-image pc-model-picker-thumb" />
                    <div className="pc-production-card-meta pc-model-picker-meta">
                      <p className="pc-production-card-name pc-model-picker-name">{model.name}</p>
                      <p>Quality {model.quality} · Popularity {model.popularity}</p>
                      <p>Stamina {model.stamina} · Happiness {model.hapiness}</p>
                      {contractInactive && <p>Contract expired or payment pending</p>}
                    </div>
                  </button>
                )
              })}
            </div>
          </section>

          <section>
            <h4>2) Select Staff (1 per category, owner available with low skill)</h4>
            <div className="pc-staff-category-list">
              {state.staffCategories.map((category) => (
                <div key={category} className="pc-staff-category-block">
                  <p className="pc-staff-category-title">{category}</p>
                  <div className="pc-staff-picker-grid">
                    <button
                      type="button"
                      className={`pc-production-card-btn pc-staff-picker-card${(staffByCategory[category] ?? 'owner') === 'owner' ? ' is-selected' : ''}`}
                      onClick={() =>
                        setStaffByCategory((current) => ({ ...current, [category]: 'owner' }))
                      }
                    >
                      {(staffByCategory[category] ?? 'owner') === 'owner' && (
                        <span className="pc-selected-chip">Selected</span>
                      )}
                      <span className="pc-production-card-image pc-staff-owner-badge">YOU</span>
                      <div className="pc-production-card-meta pc-staff-picker-meta">
                        <p className="pc-production-card-name pc-staff-picker-name">Owner</p>
                        <p>Skill {state.ownerSkills[category]}</p>
                      </div>
                    </button>

                    {state.hiredStaff
                      .filter(
                        (staff) =>
                          staff.category === category &&
                          !staff.awaitingPayment &&
                          (staff.contractDaysLeft ?? 0) > 0,
                      )
                      .map((staff) => {
                        const isSelected = staffByCategory[category] === staff.hiredId
                        return (
                          <button
                            key={staff.hiredId}
                            type="button"
                            className={`pc-production-card-btn pc-staff-picker-card${isSelected ? ' is-selected' : ''}`}
                            onClick={() =>
                              setStaffByCategory((current) => ({
                                ...current,
                                [category]: staff.hiredId,
                              }))
                            }
                          >
                            {isSelected && <span className="pc-selected-chip">Selected</span>}
                            <img src={staff.imageUrl} alt={staff.name} className="pc-production-card-image pc-staff-picker-thumb" />
                            <div className="pc-production-card-meta pc-staff-picker-meta">
                              <p className="pc-production-card-name pc-staff-picker-name">{staff.name}</p>
                              <p>{staff.role || category}</p>
                              <p>Skill {staff.skill}</p>
                            </div>
                          </button>
                        )
                      })}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h4>3) Select Shoot Type</h4>
            <div className="pc-shoot-type-grid">
              {visibleWorkTypeEntries.map(([key, item]) => {
                const isLocked = isShootTypeLocked(item)
                const isSelected = shootType === key
                return (
                  <button
                    key={key}
                    type="button"
                    className={`pc-production-card-btn pc-shoot-type-card${isSelected ? ' is-selected' : ''}${isLocked ? ' is-locked' : ''}`}
                    onClick={() => {
                      if (isLocked) return
                      setShootType(key)
                    }}
                    disabled={isLocked}
                    title={isLocked ? `Unlocks at popularity ${item.unlockAt || 0}` : item.label}
                  >
                    {isSelected && <span className="pc-selected-chip">Selected</span>}
                    <img
                      src={resolveShootTypeImage(key, item)}
                      alt={item.label}
                      className="pc-production-card-image pc-shoot-type-image"
                    />
                    <div className="pc-production-card-meta pc-shoot-type-meta">
                      <p className="pc-production-card-name pc-shoot-type-name">{item.label}</p>
                      <p>Action Point Cost: {state.projectActionPointCosts?.[key] ?? 0}</p>
                      <p>Stamina Cost: {item.staminaCost}</p>
                      <p>Base Revenue: {money(item.baseRevenue)}</p>
                      <p>Unlock At: {item.unlockAt || 0} popularity</p>
                    </div>
                  </button>
                )
              })}
            </div>
          </section>

          <section>
            <h4>4) Name It</h4>
            <div className="pc-radio-row">
              <label><input type="radio" checked={nameMode === 'new'} onChange={() => setNameMode('new')} /> New Name</label>
              <label><input type="radio" checked={nameMode === 'previous'} onChange={() => setNameMode('previous')} /> From Previous</label>
            </div>
            {nameMode === 'new' ? (
              <input value={customTitle} onChange={(event) => setCustomTitle(event.target.value)} placeholder="Shoot name" />
            ) : (
              <select value={previousTitle} onChange={(event) => setPreviousTitle(event.target.value)}>
                <option value="">Select previous shoot</option>
                {previousBaseTitles.map((title) => (
                  <option key={title} value={title}>{title}</option>
                ))}
              </select>
            )}
            {productionPreview.ok && <p className="pc-muted">Final Name: {productionPreview.result.title}</p>}
          </section>

          <section>
            <h4>5) Add Description</h4>
            <textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={3} />
          </section>

          <section>
            <h4>6) Choose Location</h4>
            <select value={locationId} onChange={(event) => setLocationId(event.target.value)}>
              {availableLocations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.name} (bonus {location.qualityBonus}, rent {money(location.extraCost)})
                </option>
              ))}
            </select>
            {availableLocations.length === 0 && <p className="pc-muted">No available location. Rent or buy a studio first.</p>}
          </section>

          <section>
            <h4>7) Select Equipment (camera required)</h4>
            {ownedEquipment.length === 0 ? (
              <p className="pc-muted">No equipment owned. Buy at least one camera from Equipment section.</p>
            ) : (
              <div className="pc-selection-grid">
                {ownedEquipment.map((item) => (
                  <label key={item.id} className="pc-check-item">
                    <input
                      type="checkbox"
                      checked={selectedEquipmentIds.includes(item.id)}
                      onChange={() =>
                        setSelectedEquipmentIds((current) =>
                          current.includes(item.id)
                            ? current.filter((entry) => entry !== item.id)
                            : [...current, item.id],
                        )
                      }
                    />
                    <span>
                      {item.name} ({item.category}) +{item.qualityBonus}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </section>

          <section>
            <h4>8) Service for Staff</h4>
            <div className="pc-service-grid">
              {Object.entries(state.serviceLevels).map(([key, service]) => {
                const isSelected = serviceLevel === key
                const serviceImage = serviceImageByLevel[key] || '/service/1.jpg'
                return (
                  <button
                    key={key}
                    type="button"
                    className={`pc-production-card-btn pc-service-card${isSelected ? ' is-selected' : ''}`}
                    onClick={() => setServiceLevel(key)}
                  >
                    {isSelected && <span className="pc-selected-chip">Selected</span>}
                    <img src={serviceImage} alt={service.label} className="pc-production-card-image pc-service-image" />
                    <div className="pc-production-card-meta pc-service-meta">
                      <p className="pc-production-card-name pc-service-name">{service.label}</p>
                      <p>Cost: {money(service.costPerStaff)} per staff</p>
                      <p>Model Buff: +{service.modelStaminaBoost || 0} Sta, +{service.modelHapinessBoost || 0} Happy</p>
                      <p>Staff Buff: +{service.staffStaminaBoost || 0} Sta, +{service.staffHapinessBoost || 0} Happy</p>
                    </div>
                  </button>
                )
              })}
            </div>
          </section>

          <section>
            <h4>9) Choose Dress Partner (15 brands)</h4>
            <div className="pc-dress-partner-grid">
              {state.dressPartners.map((brand) => (
                <button
                  key={brand.id}
                  type="button"
                  className={`pc-production-card-btn pc-dress-card${dressPartnerId === brand.id ? ' is-selected' : ''}${state.popularity < brand.requiredPopularity ? ' is-locked' : ''}`}
                  disabled={state.popularity < brand.requiredPopularity}
                  onClick={() => setDressPartnerId(brand.id)}
                >
                  {dressPartnerId === brand.id && <span className="pc-selected-chip">Selected</span>}
                  <img className="pc-production-card-image pc-dress-logo" src={brand.logo} alt={brand.name} />
                  <div className="pc-production-card-meta pc-dress-meta">
                    <p className="pc-production-card-name pc-dress-name">{brand.name}</p>
                    <p>Required Popularity: {brand.requiredPopularity}</p>
                    <p>Sponsorship Cost: {money(brand.sponsorshipCost)}</p>
                    <p>Quality Bonus: {brand.qualityBonus}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>
            </div>
            <div className="pc-preview-box">
              {productionPreview.ok ? (
                <>
                  <p>Validation: Ready to shoot</p>
                  <p>Estimated Grade: {productionPreview.result.estimatedGrade}</p>
                  <p>Gross Revenue: {money(productionPreview.result.grossRevenue)}</p>
                  <p>Operating Cost: {money(productionPreview.result.operatingCost)}</p>
                  <p>Estimated Profit: {money(productionPreview.result.estimatedProfit)}</p>
                  <p>Profitability Modifier: {productionPreview.result.profitabilityModifierPercent}%</p>
                  {productionPreview.result.keywordBonusPercent !== 0 && <p>Keyword Bonus: {productionPreview.result.keywordBonusPercent}%</p>}
                  {productionPreview.result.fameBonusPercent !== 0 && <p>Previous Name Fame Bonus: {productionPreview.result.fameBonusPercent}%</p>}
                  {productionPreview.result.freelancePayout > 0 && <p>Freelance Payout: {money(productionPreview.result.freelancePayout)}</p>}
                  <p>Estimated Total: {money(productionPreview.result.estimatedTotalProfit)}</p>
                  <p>Action Point Cost: {productionPreview.result.actionPointCost ?? 0}</p>
                </>
              ) : (
                <>
                  <p>Validation: Cannot start shoot</p>
                  <p>Reason: {shootBlockReason}</p>
                </>
              )}
            </div>

            <div className="pc-actions pc-actions-wrap">
              <button
                type="button"
                disabled={!canStartShoot}
                onClick={() => setEditorPage('banner')}
              >
                Next: Banner Editor
              </button>
            </div>
          </>
        )}

        {editorPage === 'banner' && (
          <div className="pc-banner-editor-page">
            <section className="pc-banner-editor-left">
              <h4>Banner Configuration</h4>
              <p className="pc-muted">Pick a preset style and choose which model photo to use.</p>

              <div className="pc-banner-preset-grid">
                {BANNER_STYLE_PRESETS.map((preset) => (
                  <button
                    key={preset.key}
                    type="button"
                    className={`pc-banner-preset-btn${bannerPresetKey === preset.key ? ' is-selected' : ''}`}
                    onClick={() => setBannerPresetKey(preset.key)}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              <div className="pc-banner-model-picker">
                <h5>Banner Photo Model</h5>
                {selectedModels.length === 0 && <p className="pc-muted">Select at least one model on setup page.</p>}
                {selectedModels.length > 0 && (
                  <div className="pc-cast-strip">
                    {selectedModels.map((model) => {
                      const isSelected = selectedBannerModel?.id === model.id
                      return (
                        <button
                          key={model.id}
                          type="button"
                          className={`pc-cast-chip pc-cast-chip-btn${isSelected ? ' is-selected' : ''}`}
                          onClick={() => setSelectedBannerModelId(model.id)}
                          title={model.name}
                        >
                          <img src={model.imageUrl} alt={model.name} />
                          <span>{model.name}</span>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>

              {!canStartShoot && <p className="pc-block-reason">Start Shoot is blocked: {shootBlockReason}</p>}
            </section>

            <section className="pc-banner-editor-right">
              <h4>Live Banner Preview</h4>
              <p className="pc-muted">Style: {BANNER_STYLE_PRESETS.find((preset) => preset.key === bannerPresetKey)?.label || 'Preset'}</p>
              {selectedBannerModel && <p className="pc-muted">Photo: {selectedBannerModel.name}</p>}
              <div className="pc-banner-live-preview">
                {livePreviewUrl && <img src={livePreviewUrl} alt="Live banner preview" className="pc-banner-live-preview-image" />}
                {isPreviewGenerating && <p className="pc-muted">Updating preview...</p>}
                {previewGenerationError && <p className="pc-inline-error">{previewGenerationError}</p>}
              </div>

              <div className="pc-actions pc-actions-wrap">
                <button type="button" className="pc-close-inline" onClick={() => setEditorPage('setup')}>
                  Back
                </button>
                <button
                  type="button"
                  disabled={!canStartShoot || isShootInProgress}
                  title={
                    isShootInProgress
                      ? 'Shoot already in progress.'
                      : canStartShoot
                        ? 'All checks passed. Ready to start shoot.'
                        : shootBlockReason
                  }
                  onClick={onStartShoot}
                >
                  {isShootInProgress ? 'Shooting...' : 'Start Shoot'}
                </button>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductionModal
