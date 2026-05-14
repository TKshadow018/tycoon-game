import { useEffect, useMemo, useState } from 'react'
import ModalWizard from './ModalWizard'
import {
  BANNER_STYLE_PRESETS,
  generateLocalProductionBanner,
} from '../../../common/utils/localBannerGenerator'
import shootType1Base64 from '../../../common/assets/shooting-type-1.base64.txt?raw'
import shootType2Base64 from '../../../common/assets/shooting-type-2.base64.txt?raw'
import shootType3Base64 from '../../../common/assets/shooting-type-3.base64.txt?raw'
import shootType4Base64 from '../../../common/assets/shooting-type-4.base64.txt?raw'
import shootType5Base64 from '../../../common/assets/shooting-type-5.base64.txt?raw'
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
  inline = false,
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
  if (!open && !inline) return null

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
  const [currentStep, setCurrentStep] = useState('contract')
  const [completedSteps, setCompletedSteps] = useState(new Set())

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

  // Wizard steps configuration
  const wizardSteps = [
    { id: 'contract', title: 'Contract Context', description: 'Select or skip a gig contract' },
    { id: 'cast', title: 'Cast Selection', description: 'Pick 1-8 models for this shoot' },
    { id: 'crew', title: 'Crew Assignment', description: 'Assign directors, editors, and more' },
    { id: 'shootType', title: 'Shoot Type & Title', description: 'Choose shoot type and production name' },
    { id: 'equipment', title: 'Equipment & Location', description: 'Select camera loadout and location' },
    { id: 'service', title: 'Service Level & Partner', description: 'Choose team service level and brand partner' },
    { id: 'banner', title: 'Banner & Review', description: 'Configure banner and review final details' },
  ]

  const handleStepChange = (stepId) => {
    setCurrentStep(stepId)
  }

  const handleFinish = async () => {
    if (canStartShoot && !isShootInProgress) {
      onStartShoot()
    }
  }

  useEffect(() => {
    if (!open) {
      setCurrentStep('contract')
      setCompletedSteps(new Set())
      setLivePreviewUrl('')
      setPreviewGenerationError('')
      setIsPreviewGenerating(false)
      return
    }

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

  // Render step content based on current step
  const renderStepContent = () => {
    switch (currentStep) {
      case 'contract':
        return (
          <section>
            <h4>Select or Skip Contract</h4>
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
        )

      case 'cast':
        return (
          <section>
            <h4>Select Cast (1 to 8 models)</h4>
            <p className="pc-muted">Selected: {selectedModelIds.length}</p>
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
        )

      case 'crew':
        return (
          <section>
            <h4>Assign Crew (owner fallback available)</h4>
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
                      .filter((staff) => staff.category === category)
                      .map((staff) => (
                        <button
                          key={staff.hiredId}
                          type="button"
                          className={`pc-production-card-btn pc-staff-picker-card${staffByCategory[category] === staff.hiredId ? ' is-selected' : ''}`}
                          onClick={() =>
                            setStaffByCategory((current) => ({ ...current, [category]: staff.hiredId }))
                          }
                        >
                          {staffByCategory[category] === staff.hiredId && (
                            <span className="pc-selected-chip">Selected</span>
                          )}
                          <img src={staff.imageUrl} alt={staff.name} className="pc-production-card-image pc-staff-picker-thumb" />
                          <div className="pc-production-card-meta pc-staff-picker-meta">
                            <p className="pc-production-card-name pc-staff-picker-name">{staff.name}</p>
                            <p>Skill {staff.skill}</p>
                          </div>
                        </button>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )

      case 'shootType':
        return (
          <section>
            <h4>Select Shoot Type & Production Name</h4>
            <div className="pc-shoot-type-grid">
              {visibleWorkTypeEntries.map(([key, item]) => (
                <button
                  key={key}
                  type="button"
                  className={`pc-production-card-btn${shootType === key ? ' is-selected' : ''}${isShootTypeLocked(item) ? ' is-locked' : ''}`}
                  onClick={() => !isShootTypeLocked(item) && setShootType(key)}
                  disabled={isShootTypeLocked(item)}
                >
                  {shootType === key && <span className="pc-selected-chip">Selected</span>}
                  <img src={resolveShootTypeImage(key, item)} alt={item.label} className="pc-production-card-image pc-shoot-type-image" />
                  <div className="pc-production-card-meta">
                    <p className="pc-production-card-name pc-shoot-type-name">{item.label}</p>
                    {isShootTypeLocked(item) && <p>Requires popularity {item.unlockAt}</p>}
                  </div>
                </button>
              ))}
            </div>

            <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.15)' }}>
              <h5 style={{ margin: '0 0 8px', fontSize: '12px' }}>Production Name</h5>
              <div className="pc-radio-row">
                <label>
                  <input
                    type="radio"
                    name="nameMode"
                    value="custom"
                    checked={nameMode === 'custom'}
                    onChange={() => setNameMode('custom')}
                  />
                  Custom
                </label>
                {previousBaseTitles.length > 0 && (
                  <label>
                    <input
                      type="radio"
                      name="nameMode"
                      value="previous"
                      checked={nameMode === 'previous'}
                      onChange={() => setNameMode('previous')}
                    />
                    Previous
                  </label>
                )}
              </div>

              {nameMode === 'custom' && (
                <label className="pc-field">
                  <input
                    type="text"
                    value={customTitle}
                    onChange={(event) => setCustomTitle(event.target.value)}
                    placeholder="Enter custom title"
                  />
                </label>
              )}

              {nameMode === 'previous' && previousBaseTitles.length > 0 && (
                <label className="pc-field">
                  <select value={previousTitle} onChange={(event) => setPreviousTitle(event.target.value)}>
                    {previousBaseTitles.map((title) => (
                      <option key={title} value={title}>
                        {title}
                      </option>
                    ))}
                  </select>
                </label>
              )}
            </div>

            <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.15)' }}>
              <h5 style={{ margin: '0 0 8px', fontSize: '12px' }}>Description (Required)</h5>
              <label className="pc-field">
                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Describe the concept, mood, and shoot intent..."
                  rows={4}
                />
              </label>
            </div>
          </section>
        )

      case 'equipment':
        return (
          <section>
            <h4>Equipment & Location</h4>
            <div style={{ marginBottom: '12px' }}>
              <h5 style={{ margin: '0 0 8px', fontSize: '12px' }}>Equipment Loadout (camera required)</h5>
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
            </div>

            <div style={{ paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.15)' }}>
              <h5 style={{ margin: '0 0 8px', fontSize: '12px' }}>Location</h5>
              <select value={locationId} onChange={(event) => setLocationId(event.target.value)} className="pc-field">
                {availableLocations.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.name} (bonus {location.qualityBonus}, rent {money(location.extraCost)})
                  </option>
                ))}
              </select>
              {availableLocations.length === 0 && <p className="pc-muted">No available location. Rent or buy a studio first.</p>}
            </div>
          </section>
        )

      case 'service':
        return (
          <section>
            <h4>Service Level & Brand Partner</h4>
            <div style={{ marginBottom: '12px' }}>
              <h5 style={{ margin: '0 0 8px', fontSize: '12px' }}>Team Service Level</h5>
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
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            <div style={{ paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.15)' }}>
              <h5 style={{ margin: '0 0 8px', fontSize: '12px' }}>Brand Partner</h5>
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
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </section>
        )

      case 'banner':
        return (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', maxHeight: '56vh', overflow: 'auto' }}>
            <section style={{ border: '1px solid rgba(255,255,255,0.15)', borderRadius: '11px', padding: '8px', background: 'rgba(30,41,59,0.5)' }}>
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
                {selectedModels.length === 0 && <p className="pc-muted">Select at least one model on cast step.</p>}
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
            </section>

            <section style={{ border: '1px solid rgba(255,255,255,0.15)', borderRadius: '11px', padding: '8px', background: 'rgba(30,41,59,0.5)' }}>
              <h4>Live Banner Preview & Review</h4>
              <p className="pc-muted">Style: {BANNER_STYLE_PRESETS.find((preset) => preset.key === bannerPresetKey)?.label || 'Preset'}</p>
              {selectedBannerModel && <p className="pc-muted">Photo: {selectedBannerModel.name}</p>}
              <p className="pc-muted">Description: {description?.trim() || 'Not provided yet'}</p>
              <div className="pc-banner-live-preview">
                {livePreviewUrl && <img src={livePreviewUrl} alt="Live banner preview" className="pc-banner-live-preview-image" />}
                {isPreviewGenerating && <p className="pc-muted">Updating preview...</p>}
                {previewGenerationError && <p className="pc-inline-error">{previewGenerationError}</p>}
              </div>

              <div className="pc-preview-box pb-preview-box" style={{ marginTop: '10px' }}>
                {productionPreview.ok ? (
                  <>
                    <p style={{ fontWeight: 600 }}>✓ All Systems Ready</p>
                    <p>Grade: {productionPreview.result.estimatedGrade}</p>
                    <p>Gross Revenue: {money(productionPreview.result.grossRevenue)}</p>
                    <p>Operating Cost: {money(productionPreview.result.operatingCost)}</p>
                    <p>Est. Profit: {money(productionPreview.result.estimatedTotalProfit)}</p>
                  </>
                ) : (
                  <>
                    <p style={{ color: '#fda4af', fontWeight: 600 }}>✗ Launch Blocked</p>
                    <p>{shootBlockReason}</p>
                  </>
                )}
              </div>
            </section>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <ModalWizard
      open={open}
      onClose={onClose}
      inline={inline}
      steps={wizardSteps}
      currentStep={currentStep}
      onStepChange={handleStepChange}
      completedSteps={completedSteps}
      onFinish={handleFinish}
      canProceed={currentStep === 'banner' ? canStartShoot : true}
      isProcessing={isShootInProgress}
      blockReason={currentStep === 'banner' && !canStartShoot ? shootBlockReason : ''}
      title="Production Pipeline Wizard"
      subtitle="Configure cast, crew, equipment, and banner to launch your next production."
    >
      {renderStepContent()}
    </ModalWizard>
  )
}

export default ProductionModal
