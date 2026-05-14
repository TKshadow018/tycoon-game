import { useMemo, useState } from 'react'
import { useGameStore } from '../../common/store/gameStore'
import EquipmentModal from './desktop/EquipmentModal'
import EquipmentSection from './desktop/EquipmentSection'
import FreelanceSection from './desktop/FreelanceSection'
import HeroHeader from './desktop/HeroHeader'
import InventorySection from './desktop/InventorySection'
import InterviewModal from './desktop/InterviewModal'
import ModelModal from './desktop/ModelModal'
import ModelsSection from './desktop/ModelsSection'
import PartyModal from './desktop/PartyModal'
import ProductionModal from './desktop/ProductionModal'
import ProductionSection from './desktop/ProductionSection'
import StaffModal from './desktop/StaffModal'
import StaffSection from './desktop/StaffSection'
import StatisticsModal from './desktop/StatisticsModal'
import StudioModal from './desktop/StudioModal'
import StudioSection from './desktop/StudioSection'
import {
  BANNER_STYLE_PRESETS,
  generateLocalProductionBanner,
} from '../../common/utils/localBannerGenerator'
import '../css/desktop.css'

const money = (value) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)

const INTERVIEW_POPUP_CHANCE = 0.15
const DEFAULT_BANNER_PRESET_KEY = BANNER_STYLE_PRESETS[0]?.key || 'studio-classic'

function DesktopGameView({ onNotify, activeTheme = 'neumorphism', onThemeChange, themeOptions = [] }) {
  const state = useGameStore()

  const [staffModalOpen, setStaffModalOpen] = useState(false)
  const [studioModalOpen, setStudioModalOpen] = useState(false)
  const [modelModalOpen, setModelModalOpen] = useState(false)
  const [productionModalOpen, setProductionModalOpen] = useState(false)
  const [equipmentModalOpen, setEquipmentModalOpen] = useState(false)
  const [createWebsiteModalOpen, setCreateWebsiteModalOpen] = useState(false)
  const [manageWebsiteModalOpen, setManageWebsiteModalOpen] = useState(false)
  const [partyModalOpen, setPartyModalOpen] = useState(false)
  const [trainingModalOpen, setTrainingModalOpen] = useState(false)
  const [statisticsModalOpen, setStatisticsModalOpen] = useState(false)
  const [trainingTarget, setTrainingTarget] = useState(null)
  const [ownerTrainingSkill, setOwnerTrainingSkill] = useState('')
  const [paymentBonusById, setPaymentBonusById] = useState({})
  const [interviewModalOpen, setInterviewModalOpen] = useState(false)
  const [interviewSession, setInterviewSession] = useState(null)
  const [activeLeftTab, setActiveLeftTab] = useState('staff')

  const [selectedModelIds, setSelectedModelIds] = useState([])
  const [staffByCategory, setStaffByCategory] = useState({})
  const [shootType, setShootType] = useState('basic')
  const [nameMode, setNameMode] = useState('new')
  const [customTitle, setCustomTitle] = useState('')
  const [previousTitle, setPreviousTitle] = useState('')
  const [description, setDescription] = useState('')
  const [locationId, setLocationId] = useState('')
  const [serviceLevel, setServiceLevel] = useState('none')
  const [dressPartnerId, setDressPartnerId] = useState('brand-1')
  const [selectedGigId, setSelectedGigId] = useState('')
  const [selectedEquipmentIds, setSelectedEquipmentIds] = useState([])
  const [websiteName, setWebsiteName] = useState('')
  const [websiteExtension, setWebsiteExtension] = useState('.com')
  const [websiteLogo, setWebsiteLogo] = useState('')
  const [websiteLogoFileName, setWebsiteLogoFileName] = useState('No file selected')
  const [selectedWebsiteId, setSelectedWebsiteId] = useState('')
  const [createWebsiteError, setCreateWebsiteError] = useState('')
  const [isShootInProgress, setIsShootInProgress] = useState(false)
  const [shootProgressText, setShootProgressText] = useState('')
  const [bannerPresetKey, setBannerPresetKey] = useState(DEFAULT_BANNER_PRESET_KEY)
  const [selectedBannerModelId, setSelectedBannerModelId] = useState('')
  const [selectedSaveSlot, setSelectedSaveSlot] = useState(1)

  const run = (result, message) => {
    if (!result.ok) {
      onNotify({ type: 'error', message: result.error })
      return false
    }

    onNotify({ type: 'success', message, data: result.result })
    return true
  }

  const availableModels = useMemo(
    () => state.modelPool.filter((model) => !state.roster.some((r) => r.id === model.id)),
    [state.modelPool, state.roster],
  )

  const previousBaseTitles = useMemo(
    () => [...new Set(state.shootingHistory.map((item) => item.baseTitle))],
    [state.shootingHistory],
  )

  const ownedEquipment = useMemo(
    () => state.equipmentCatalog.filter((item) => state.ownedEquipmentIds.includes(item.id)),
    [state.equipmentCatalog, state.ownedEquipmentIds],
  )

  const selectedWebsite = useMemo(
    () => state.websites.find((site) => site.id === selectedWebsiteId) || null,
    [state.websites, selectedWebsiteId],
  )

  const uploadedVideosForSelectedWebsite = useMemo(() => {
    if (!selectedWebsiteId) return []
    return state.inventoryItems.filter((item) => item.uploadedWebsiteId === selectedWebsiteId)
  }, [state.inventoryItems, selectedWebsiteId])

  const trainingTargets = useMemo(() => {
    const ownerTarget = {
      type: 'owner',
      id: 'owner',
      label: 'Owner (You)',
      detail: `Stamina ${state.ownerStamina ?? 100}`,
    }

    const modelTargets = state.roster.map((model) => ({
      type: 'model',
      id: model.id,
      label: model.name,
      detail: `Model · Quality ${model.quality} · Stamina ${model.stamina}`,
    }))

    const staffTargets = state.hiredStaff.map((staff) => ({
      type: 'staff',
      id: staff.hiredId,
      label: staff.name,
      detail: `${staff.role || staff.category} · Skill ${staff.skill} · Stamina ${staff.stamina ?? 100}`,
    }))

    return [ownerTarget, ...modelTargets, ...staffTargets]
  }, [state.ownerStamina, state.roster, state.hiredStaff])

  const ownerTrainingTarget = useMemo(
    () => trainingTargets.find((target) => target.type === 'owner') || null,
    [trainingTargets],
  )

  const modelTrainingTargets = useMemo(
    () => trainingTargets.filter((target) => target.type === 'model'),
    [trainingTargets],
  )

  const staffTrainingTargets = useMemo(
    () => trainingTargets.filter((target) => target.type === 'staff'),
    [trainingTargets],
  )

  const getTrainingCostPreview = (target, option, ownerSkillKey) => {
    if (!target || !option) return null

    let currentStat = 0

    if (target.type === 'model') {
      const model = state.roster.find((entry) => entry.id === target.id)
      currentStat = model?.quality || 0
    }

    if (target.type === 'staff') {
      const staff = state.hiredStaff.find((entry) => entry.hiredId === target.id)
      currentStat = staff?.skill || 0
    }

    if (target.type === 'owner') {
      if (!ownerSkillKey) return null
      currentStat = state.ownerSkills?.[ownerSkillKey] || 0
    }

    return Math.round((option.baseCost || 0) + currentStat * (option.costPerCurrentStat || 0))
  }

  const actionCostLabels = useMemo(() => {
    const partyCosts = Object.values(state.partyOptions || {}).map((option) => option.actionPointCost || 0)
    const minPartyCost = partyCosts.length ? Math.min(...partyCosts) : 0
    const maxPartyCost = partyCosts.length ? Math.max(...partyCosts) : 0

    const trainingCosts = Object.values(state.ownerTrainingOptions || {}).map((option) => option.actionPointCost || 0)
    const minTrainingCost = trainingCosts.length ? Math.min(...trainingCosts) : 0
    const maxTrainingCost = trainingCosts.length ? Math.max(...trainingCosts) : 0

    const partyLabel = minPartyCost === maxPartyCost ? `${minPartyCost} AP` : `${minPartyCost}-${maxPartyCost} AP`
    const trainingLabel = minTrainingCost === maxTrainingCost
      ? `${minTrainingCost} AP`
      : `${minTrainingCost}-${maxTrainingCost} AP`

    return {
      'create-website': `${state.websiteActionPointCost || 0} AP`,
      'organize-party': partyLabel,
      training: trainingLabel,
    }
  }, [state.partyOptions, state.ownerTrainingOptions, state.websiteActionPointCost])

  const duePayments = useMemo(
    () =>
      state.paymentsToMake
        .filter((entry) => entry.status === 'pending' && entry.dueDay <= state.day)
        .sort((left, right) => (left.dueDay - right.dueDay) || left.targetName.localeCompare(right.targetName)),
    [state.paymentsToMake, state.day],
  )

  const handleEndDay = () => {
    const endDayResult = state.endDay()
    if (!run(endDayResult, 'Day ended. Contracts, gigs, and rentals updated.')) return

    if (Math.random() > INTERVIEW_POPUP_CHANCE) return

    const interviewResult = state.beginInterviewSession({ force: true })
    if (!interviewResult.ok) return

    setInterviewSession(interviewResult.result)
    setInterviewModalOpen(true)
  }

  const handleSaveGame = () => {
    const result = state.saveGameSlot(selectedSaveSlot)
    if (!result.ok) {
      onNotify({ type: 'error', message: result.error })
      return
    }

    onNotify({
      type: 'success',
      message: `Game saved to slot ${result.result.slot} (${result.result.companyName}, day ${result.result.day}).`,
    })
  }

  const handleLoadGame = () => {
    const result = state.loadGameSlot(selectedSaveSlot)
    if (!result.ok) {
      onNotify({ type: 'error', message: result.error })
      return
    }

    onNotify({
      type: 'success',
      message: `Loaded slot ${result.result.slot}: ${result.result.companyName} (day ${result.result.day}).`,
    })
  }

  const openProductionModal = () => {
    const staffDefault = Object.fromEntries(
      state.staffCategories.map((category) => {
        const hired = state.hiredStaff.find(
          (item) => item.category === category && !item.awaitingPayment && (item.contractDaysLeft ?? 0) > 0,
        )
        return [category, hired ? hired.hiredId : 'owner']
      }),
    )

    setSelectedModelIds([])
    setSelectedBannerModelId('')
    setBannerPresetKey(DEFAULT_BANNER_PRESET_KEY)
    setStaffByCategory(staffDefault)
    const firstUnlockedShootType =
      Object.entries(state.workTypes).find(([, item]) => state.popularity >= (item.unlockAt || 0))?.[0] ||
      'basic'

    setShootType(firstUnlockedShootType)
    setNameMode('new')
    setCustomTitle('')
    setPreviousTitle(previousBaseTitles[0] ?? '')
    setDescription('')
    setLocationId(state.activeStudio?.id ? `location-${state.activeStudio.id}` : '')
    setServiceLevel('none')
    setDressPartnerId(state.dressPartners[0]?.id ?? 'brand-1')
    setSelectedGigId(state.activeGigContracts[0]?.id ?? '')
    setSelectedEquipmentIds(
      state.ownedEquipmentIds.filter((equipmentId) => {
        const item = state.equipmentCatalog.find((entry) => entry.id === equipmentId)
        return item?.category === 'camera'
      }),
    )
    setProductionModalOpen(true)
  }

  const toggleModelSelection = (modelId) => {
    setSelectedModelIds((current) => {
      if (current.includes(modelId)) return current.filter((id) => id !== modelId)
      if (current.length >= 8) return current
      return [...current, modelId]
    })
  }

  const payload = {
    modelIds: selectedModelIds,
    staffByCategory,
    shootType,
    nameMode,
    customTitle,
    previousTitle,
    description,
    locationId,
    serviceLevel,
    dressPartnerId,
    equipmentIds: selectedEquipmentIds,
    gigId: selectedGigId || undefined,
  }

  const productionPreview = productionModalOpen
    ? state.previewProduction(payload)
    : { ok: false, error: 'Open production modal.' }

  const canStartShoot = productionPreview.ok
  const shootBlockReason = canStartShoot
    ? ''
    : productionPreview.error || 'Fill all required production fields.'

  const handleStartProduction = async () => {
    if (!canStartShoot) {
      onNotify({ type: 'error', message: shootBlockReason })
      return
    }

    setIsShootInProgress(true)
    setShootProgressText('Shooting going on... Creating production output.')

    const result = state.startProduction(payload)
    if (!result.ok) {
      setIsShootInProgress(false)
      setShootProgressText('')
      onNotify({ type: 'error', message: result.error })
      return
    }

    const producedItem = result.result
    const directorEntry = producedItem.staff?.find((entry) => entry.category === 'director')
    const directorName = directorEntry?.name || 'Owner'

    setShootProgressText('Shooting going on... Generating local banner.')

    let coverGenerated = false
    try {
      const selectedBannerModel = (producedItem.models || []).find((model) => model.id === selectedBannerModelId)
        || (producedItem.models || [])[0]

      const coverResult = await generateLocalProductionBanner({
        companyName: state.companyName,
        title: producedItem.title,
        shootType: producedItem.shootType,
        directorName,
        modelImageUrl: selectedBannerModel?.imageUrl || '',
        modelNames: (producedItem.models || []).map((model) => model.name).filter(Boolean),
        bannerPreset: bannerPresetKey,
      })

      if (coverResult.ok) {
        state.setInventoryItemCover({
          itemId: producedItem.id,
          coverImageUrl: coverResult.result.coverImageUrl,
          coverMimeType: coverResult.result.coverMimeType,
          source: 'local-banner',
        })
        coverGenerated = true
      } else {
        onNotify({
          type: 'error',
          message: `Shoot completed but local banner generation failed: ${coverResult.error}`,
        })
      }
    } catch (error) {
      onNotify({
        type: 'error',
        message: `Shoot completed but local banner generation failed: ${error?.message || 'Unexpected error.'}`,
      })
    } finally {
      setIsShootInProgress(false)
      setShootProgressText('')
    }

    onNotify({
      type: 'success',
      message: `Shoot ${producedItem.title} completed.${coverGenerated ? ' Local banner generated.' : ''}`,
      data: producedItem,
    })

    setProductionModalOpen(false)
  }

  const handleFreelanceBid = (gig, bidAmount) => {
    const result = state.placeFreelanceBid(gig.id, bidAmount)
    if (!result.ok) {
      onNotify({ type: 'error', message: result.error })
      return
    }

    if (result.result.won) {
      onNotify({
        type: 'success',
        message: `Bid won: ${gig.title} · ${gig.companyName} · Payment ${money(result.result.payment)}`,
      })
      return
    }

    onNotify({
      type: 'error',
      message: `Bid lost for ${gig.title}. Win chance was ${result.result.winChance}%.`,
    })
  }

  const getCompanyRelation = (companyId) =>
    state.companies.find((company) => company.id === companyId)?.relation ?? 0

  const handlePaymentDecision = (paymentId, decision) => {
    const payment = duePayments.find((entry) => entry.id === paymentId)
    if (!payment) return

    const bonusValue = paymentBonusById[paymentId] ?? '10'

    const result = state.resolvePaymentDecision({
      paymentId,
      decision,
      bonusPercent: bonusValue,
    })

    if (!result.ok) {
      onNotify({ type: 'error', message: result.error })
      return
    }

    const deltaText = result.result.happinessDelta >= 0
      ? `+${result.result.happinessDelta}`
      : `${result.result.happinessDelta}`

    if (decision === 'delay') {
      onNotify({
        type: 'error',
        message: `Payment delayed for ${result.result.targetName}. Happiness ${deltaText}. Will ask again on day ${result.result.nextDueDay}.`,
        data: result.result,
      })
      return
    }

    const paidText = money(result.result.paidAmount)
    const discountText = result.result.negotiatedDiscountPercent > 0
      ? ` (discount ${result.result.negotiatedDiscountPercent}%)`
      : ''
    const bonusText = result.result.bonusPercent > 0
      ? ` (bonus ${result.result.bonusPercent}%)`
      : ''

    onNotify({
      type: 'success',
      message: `Payment settled for ${result.result.targetName}. Paid ${paidText}${discountText}${bonusText}. Happiness ${deltaText}.`,
      data: result.result,
    })

    setPaymentBonusById((current) => {
      if (!(paymentId in current)) return current
      const next = { ...current }
      delete next[paymentId]
      return next
    })
  }

  const handleCreateWebsite = () => {
    const result = state.createWebsite(websiteName, websiteExtension, websiteLogo)
    if (!result.ok) {
      setCreateWebsiteError(result.error)
      return
    }

    setCreateWebsiteError('')
    onNotify({
      type: 'success',
      message: `Website ${result.result.name} created successfully.`,
      data: result.result,
    })
    setSelectedWebsiteId(result.result.id)
    setWebsiteName('')
    setWebsiteExtension('.com')
    setWebsiteLogo('')
    setWebsiteLogoFileName('No file selected')
    setCreateWebsiteModalOpen(false)
  }

  const handleActionSelect = (actionKey, actionLabel) => {
    if (actionKey === 'create-website') {
      if (state.websites.length >= 5) {
        onNotify({ type: 'error', message: 'Maximum 5 websites reached. Creation is disabled.' })
        return
      }
      setCreateWebsiteModalOpen(true)
      setCreateWebsiteError('')
      setWebsiteLogoFileName('No file selected')
      return
    }

    if (actionKey === 'manage-website') {
      if (state.websites.length === 0) {
        onNotify({ type: 'error', message: 'Create at least one website first.' })
        return
      }
      setSelectedWebsiteId((current) => current || state.websites[0].id)
      setManageWebsiteModalOpen(true)
      return
    }

    if (actionKey === 'organize-party') {
      setPartyModalOpen(true)
      return
    }

    if (actionKey === 'training') {
      setTrainingTarget(null)
      setOwnerTrainingSkill('')
      setTrainingModalOpen(true)
      return
    }

    if (actionKey === 'see-statistics') {
      setStatisticsModalOpen(true)
      return
    }

    if (actionKey === 'manage-economy') {
      setStatisticsModalOpen(true)
      onNotify({
        type: 'success',
        message: 'Economy manager opened in Statistics view.',
      })
      return
    }

    onNotify({
      type: 'success',
      message: `${actionLabel} clicked. This action UI is ready for logic hookup.`,
    })
  }

  const leftTabItems = [
    { key: 'staff', label: `Staff (${state.hiredStaff.length})` },
    { key: 'models', label: `Models (${state.roster.length})` },
    { key: 'studio', label: `Studio (${state.activeStudio ? '1' : '0'})` },
    { key: 'equipment', label: `Equipment (${ownedEquipment.length})` },
  ]

  const tickerItems = [
    `Day ${state.day}`,
    `Budget ${money(state.money)}`,
    `AP ${state.actionPoints}/${state.maxActionPoints}`,
    `Open Gigs ${state.dailyFreelanceGigs.length}`,
    `Pending Payments ${duePayments.length}`,
    `Inventory ${state.inventoryItems.length}`,
  ]

  const dockActions = [
    {
      key: 'pipeline',
      label: 'Pipeline',
      onClick: openProductionModal,
      disabled: false,
    },
    {
      key: 'website',
      label: 'Website',
      onClick: () => handleActionSelect('create-website', 'Launch Website'),
      disabled: state.websites.length >= 5,
    },
    {
      key: 'train',
      label: 'Training',
      onClick: () => handleActionSelect('training', 'Training Ops'),
      disabled: false,
    },
    {
      key: 'party',
      label: 'Party',
      onClick: () => handleActionSelect('organize-party', 'Team Event'),
      disabled: false,
    },
    {
      key: 'stats',
      label: 'Stats',
      onClick: () => handleActionSelect('see-statistics', 'Trend Analytics'),
      disabled: false,
    },
  ]

  const widgetBoardItems = [
    {
      key: 'staff',
      label: 'Staff',
      value: state.hiredStaff.length,
      hint: 'Crew desk',
      accent: 'pb-widget-accent-staff',
    },
    {
      key: 'models',
      label: 'Models',
      value: state.roster.length,
      hint: 'Talent pool',
      accent: 'pb-widget-accent-models',
    },
    {
      key: 'studio',
      label: 'Studio',
      value: state.activeStudio ? 1 : 0,
      hint: state.activeStudio ? state.activeStudio.name : 'Offline',
      accent: 'pb-widget-accent-studio',
    },
    {
      key: 'equipment',
      label: 'Gear',
      value: ownedEquipment.length,
      hint: 'Inventory',
      accent: 'pb-widget-accent-gear',
    },
  ]

  const activeWidget = widgetBoardItems.find((item) => item.key === activeLeftTab) || widgetBoardItems[0]

  return (
    <main className="pc-wrap">
      <div className="pc-shell">
        <HeroHeader
          companyName={state.companyName}
          activeStudio={state.activeStudio}
          staffCount={state.hiredStaff.length}
          modelCount={state.roster.length}
          day={state.day}
          budget={state.money}
          popularity={state.popularity}
          reputation={state.companyReputation}
          actionPoints={state.actionPoints}
          maxActionPoints={state.maxActionPoints}
          onEndDay={handleEndDay}
          onSaveGame={handleSaveGame}
          onLoadGame={handleLoadGame}
          selectedSaveSlot={selectedSaveSlot}
          onSelectSaveSlot={setSelectedSaveSlot}
          saveSlots={state.saveSlots || []}
          bannerUrl={state.banners[state.day % state.banners.length]}
          money={money}
        />

        {state.gameOver && (
          <section className="pc-card" style={{ borderColor: '#ef4444' }}>
            <h2>Game Over</h2>
            <p className="pc-muted">{state.gameOverReason?.message || 'Company operations are permanently closed.'}</p>
          </section>
        )}

        <section className="pb-orbit-layout">
          <div className="pb-live-ribbon" aria-label="Live operations ticker">
            <span className="pb-live-ribbon-tag">LIVE FEED</span>
            <div className="pb-live-ribbon-track">
              <div className="pb-live-ribbon-inner">
                {tickerItems.map((item, index) => (
                  <span key={`ticker-a-${index}`} className="pb-live-ribbon-item">{item}</span>
                ))}
                {tickerItems.map((item, index) => (
                  <span key={`ticker-b-${index}`} className="pb-live-ribbon-item">{item}</span>
                ))}
              </div>
            </div>
          </div>

          <aside className="pb-command-deck">
            <div className="pb-command-deck-head">
              <div>
                <p className="pb-command-deck-kicker">Widget Board</p>
                <h2>Resource Console</h2>
              </div>
              <button type="button" className="pb-command-dock-btn" onClick={() => setActiveLeftTab('staff')}>
                Focus Staff
              </button>
            </div>

            <div className="pb-widget-grid" role="tablist" aria-label="PC resource widgets">
              {widgetBoardItems.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  role="tab"
                  aria-selected={activeLeftTab === tab.key}
                  className={`pb-widget-tile ${tab.accent}${activeLeftTab === tab.key ? ' is-active' : ''}`}
                  onClick={() => setActiveLeftTab(tab.key)}
                >
                  <span>{tab.label}</span>
                  <strong>{tab.value}</strong>
                  <small>{tab.hint}</small>
                </button>
              ))}
            </div>

            <div className="pb-widget-focus">
              <div className="pb-widget-focus-head">
                <div>
                  <p className="pb-command-deck-kicker">Active Module</p>
                  <h3>{activeWidget.label}</h3>
                </div>
                <div className="pb-widget-focus-badge">{activeWidget.value} live</div>
              </div>

              {activeLeftTab === 'staff' && (
                <StaffSection
                  hiredStaff={state.hiredStaff}
                  onOpenStaffModal={() => setStaffModalOpen(true)}
                  onRenewStaffContract={(hiredId, term) => {
                    const result = state.renewStaffContract(hiredId, term)
                    if (!result.ok) {
                      onNotify({ type: 'error', message: result.error })
                      return
                    }

                    onNotify({
                      type: 'success',
                      message: `${result.result.name} contract renewed for ${result.result.term}. Deferred payment ${money(result.result.deferredPayment)} due at contract end.`,
                      data: result.result,
                    })
                  }}
                  money={money}
                />
              )}
              {activeLeftTab === 'models' && (
                <ModelsSection
                  roster={state.roster}
                  onOpenModelModal={() => setModelModalOpen(true)}
                  onRenewModelContract={(modelId, term) => {
                    const result = state.renewModelContract(modelId, term)
                    if (!result.ok) {
                      onNotify({ type: 'error', message: result.error })
                      return
                    }

                    onNotify({
                      type: 'success',
                      message: `${result.result.name} contract renewed for ${result.result.term}. Deferred payment ${money(result.result.deferredPayment)} due at contract end.`,
                      data: result.result,
                    })
                  }}
                  money={money}
                />
              )}
              {activeLeftTab === 'studio' && (
                <StudioSection
                  activeStudio={state.activeStudio}
                  onOpenStudioModal={() => setStudioModalOpen(true)}
                />
              )}
              {activeLeftTab === 'equipment' && (
                <EquipmentSection
                  ownedEquipment={ownedEquipment}
                  onOpenEquipmentModal={() => setEquipmentModalOpen(true)}
                  onSellEquipment={(equipmentId, equipmentName) => {
                    const result = state.sellEquipment(equipmentId)
                    if (!result.ok) {
                      onNotify({ type: 'error', message: result.error })
                      return
                    }

                    onNotify({
                      type: 'success',
                      message: `${equipmentName} sold for ${money(result.result.sellPrice)}.`,
                      data: result.result,
                    })
                  }}
                  money={money}
                />
              )}
            </div>
          </aside>

          <div className="pb-core-grid">
            <section className="pb-core-primary">
              <ProductionSection
                onOpenProductionModal={openProductionModal}
                onSelectAction={handleActionSelect}
                isCreateWebsiteDisabled={state.websites.length >= 5}
                isManageWebsiteDisabled={state.websites.length === 0}
                actionCostLabels={actionCostLabels}
                activeTheme={activeTheme}
                onThemeChange={onThemeChange}
                themeOptions={themeOptions}
              />
            </section>

            <section className="pb-core-secondary">
              <FreelanceSection
                dailyFreelanceGigs={state.dailyFreelanceGigs}
                activeGigContracts={state.activeGigContracts}
                workTypes={state.workTypes}
                popularity={state.popularity}
                getCompanyRelation={getCompanyRelation}
                onBid={handleFreelanceBid}
                money={money}
              />
            </section>
          </div>

          <aside className="pb-logistics-stack">
            <InventorySection
              inventoryItems={state.inventoryItems}
              money={money}
              websites={state.websites}
              onSellItem={(itemId, channel, options) => {
                const result = state.sellInventoryItem(itemId, channel, options)
                if (!result.ok) {
                  onNotify({ type: 'error', message: result.error })
                  return
                }

                const tipText = result.result.tip > 0 ? ` · Tip ${money(result.result.tip)}` : ''
                const viewsText = result.result.views ? ` · Views ${result.result.views}` : ''
                const postedText = channel === 'website' ? ' · Posted to website banner feed' : ''
                onNotify({
                  type: 'success',
                  message: `${result.result.title} ${channel === 'website' ? 'uploaded' : 'sold'} via ${result.result.channel} for ${money(result.result.total)}${tipText}${viewsText}${postedText}`,
                  data: result.result,
                })
              }}
            />
          </aside>

          <div className="pb-quick-dock" aria-label="Quick command dock">
            {dockActions.map((action) => (
              <button
                key={action.key}
                type="button"
                className="pb-quick-dock-btn"
                onClick={action.onClick}
                disabled={action.disabled}
              >
                {action.label}
              </button>
            ))}
          </div>
        </section>
      </div>

      <StaffModal
        open={staffModalOpen}
        onClose={() => setStaffModalOpen(false)}
        staffMarket={state.staffMarket}
        moneyValue={state.money}
        money={money}
        onHireDaily={(staff) => {
          const result = state.hireStaff(staff.id, 'daily')
          if (!result.ok) {
            onNotify({ type: 'error', message: result.error })
            return
          }

          const message = result.result.extended
            ? `${staff.name} contract extended by ${result.result.daysAdded} day(s). Deferred payment +${money(result.result.deferredPaymentAdded)}.`
            : `${staff.name} hired on daily contract. Payment deferred to contract end.`

          onNotify({ type: 'success', message, data: result.result })
        }}
        onHireWeekly={(staff) => {
          const result = state.hireStaff(staff.id, 'weekly')
          if (!result.ok) {
            onNotify({ type: 'error', message: result.error })
            return
          }

          const message = result.result.extended
            ? `${staff.name} contract extended by ${result.result.daysAdded} day(s). Deferred payment +${money(result.result.deferredPaymentAdded)}.`
            : `${staff.name} hired on weekly contract. Payment deferred to contract end.`

          onNotify({ type: 'success', message, data: result.result })
        }}
        onHireMonthly={(staff) => {
          const result = state.hireStaff(staff.id, 'monthly')
          if (!result.ok) {
            onNotify({ type: 'error', message: result.error })
            return
          }

          const message = result.result.extended
            ? `${staff.name} contract extended by ${result.result.daysAdded} day(s). Deferred payment +${money(result.result.deferredPaymentAdded)}.`
            : `${staff.name} hired on monthly contract. Payment deferred to contract end.`

          onNotify({ type: 'success', message, data: result.result })
        }}
      />

      <StudioModal
        open={studioModalOpen}
        onClose={() => setStudioModalOpen(false)}
        studioCatalog={state.studioCatalog}
        moneyValue={state.money}
        activeStudio={state.activeStudio}
        money={money}
        onRent={(studioId, term, studioName) =>
          run(state.rentStudio(studioId, term), `${studioName} rented for ${term}.`)
        }
        onBuy={(studioId, studioName) => run(state.buyStudio(studioId), `${studioName} purchased.`)}
      />

      <ModelModal
        open={modelModalOpen}
        onClose={() => setModelModalOpen(false)}
        availableModels={availableModels}
        companyReputation={state.companyReputation}
        money={state.money}
        onHire={(modelId, modelName) => run(state.hireModel(modelId), `${modelName} hired. Payment deferred to contract end.`)}
      />

      <EquipmentModal
        open={equipmentModalOpen}
        onClose={() => setEquipmentModalOpen(false)}
        equipmentCatalog={state.equipmentCatalog}
        ownedEquipmentIds={state.ownedEquipmentIds}
        moneyValue={state.money}
        money={money}
        onBuy={(equipmentId, equipmentName) =>
          run(state.buyEquipment(equipmentId), `${equipmentName} purchased.`)
        }
      />

      <InterviewModal
        open={interviewModalOpen}
        onClose={() => {
          setInterviewModalOpen(false)
          setInterviewSession(null)
        }}
        session={interviewSession}
        onSubmit={(payload) => {
          const result = state.submitInterviewSession(payload)
          if (!result.ok) {
            onNotify({ type: 'error', message: result.error })
            return
          }

          const popText = result.result.popularityChange >= 0
            ? `+${result.result.popularityChange}`
            : `${result.result.popularityChange}`
          const repText = result.result.reputationChange >= 0
            ? `+${result.result.reputationChange}`
            : `${result.result.reputationChange}`

          onNotify({
            type: 'success',
            message: `Interview completed. Popularity ${popText}, Reputation ${repText}.`,
            data: result.result,
          })
          setInterviewModalOpen(false)
          setInterviewSession(null)
        }}
        onSkip={(payload) => {
          const result = state.skipInterviewSession(payload)
          if (!result.ok) {
            onNotify({ type: 'error', message: result.error })
            return
          }

          onNotify({
            type: 'error',
            message: 'Interview skipped. Popularity -1, Reputation -1.',
            data: result.result,
          })
          setInterviewModalOpen(false)
          setInterviewSession(null)
        }}
      />

      <PartyModal
        open={partyModalOpen}
        onClose={() => setPartyModalOpen(false)}
        partyOptions={state.partyOptions}
        money={money(state.money)}
        moneyValue={state.money}
        formatMoney={money}
        actorCount={state.roster.length}
        staffCount={state.hiredStaff.length}
        actionPoints={state.actionPoints}
        maxActionPoints={state.maxActionPoints}
        onSelectParty={(partyKey) => {
          const result = state.organizeParty(partyKey)
          if (!result.ok) {
            onNotify({ type: 'error', message: result.error })
            return
          }

          const actorDelta = result.result.actorHapinessDelta >= 0
            ? `+${result.result.actorHapinessDelta}`
            : `${result.result.actorHapinessDelta}`
          const staffDelta = result.result.staffHapinessDelta >= 0
            ? `+${result.result.staffHapinessDelta}`
            : `${result.result.staffHapinessDelta}`

          onNotify({
            type: 'success',
            message: `${result.result.partyLabel} organized. Cost ${money(result.result.totalCost)}. Actor happiness ${actorDelta}, Staff happiness ${staffDelta}.`,
            data: result.result,
          })
          setPartyModalOpen(false)
        }}
      />

      {duePayments.length > 0 && (
        <div className="pc-modal-overlay" onClick={(event) => event.stopPropagation()}>
          <div className="pc-modal pc-payment-modal" onClick={(event) => event.stopPropagation()}>
            <h3>Payments Due ({duePayments.length})</h3>
            <p className="pc-muted">Make a decision for all due payments to continue.</p>
            <p className="pc-muted">Current Budget: {money(state.money)}</p>

            <div className="pc-payment-list">
              {duePayments.map((payment) => (
                <article key={payment.id} className="pc-payment-card">
                  <p className="pc-muted"><strong>{payment.targetName}</strong></p>
                  <p className="pc-muted">Type: {payment.targetType} · Source: {payment.source}</p>
                  <p className="pc-muted">Predefined Amount: {money(payment.amount)}</p>

                  <div className="pc-payment-actions">
                    <button type="button" onClick={() => handlePaymentDecision(payment.id, 'pay-now')}>
                      Pay Now ({money(payment.amount)})
                    </button>
                    <button type="button" onClick={() => handlePaymentDecision(payment.id, 'delay')}>
                      Delay Payment
                    </button>
                    <button type="button" onClick={() => handlePaymentDecision(payment.id, 'negotiate')}>
                      Negotiate Lower Price (up to 20% less)
                    </button>
                  </div>

                  <div className="pc-payment-bonus-row">
                    <label htmlFor={`payment-bonus-input-${payment.id}`}>Bonus %</label>
                    <input
                      id={`payment-bonus-input-${payment.id}`}
                      type="number"
                      min="0"
                      step="1"
                      value={paymentBonusById[payment.id] ?? '10'}
                      onChange={(event) =>
                        setPaymentBonusById((current) => ({
                          ...current,
                          [payment.id]: event.target.value,
                        }))
                      }
                    />
                    <button type="button" onClick={() => handlePaymentDecision(payment.id, 'pay-bonus')}>
                      Pay With Bonus
                    </button>
                  </div>
                </article>
              ))}
            </div>
            <p className="pc-muted">Bonus payment happiness gain: +2 + (bonus% / 10).</p>
          </div>
        </div>
      )}

      {trainingModalOpen && (
        <div className="pc-modal-overlay" onClick={(event) => event.stopPropagation()}>
          <div className="pc-modal pc-training-modal" onClick={(event) => event.stopPropagation()}>
            <h3>Training Center</h3>
            <p className="pc-muted">Step 1: choose who to train. Step 2: choose intensity.</p>
            <p className="pc-muted">Available AP: {state.actionPoints}/{state.maxActionPoints}</p>
            <p className="pc-muted">Current Budget: {money(state.money)}</p>

            {!trainingTarget && (
              <div className="pc-training-targets">
                {ownerTrainingTarget && (
                  <>
                    <p className="pc-muted"><strong>Owner Training</strong></p>
                    <button
                      key={`${ownerTrainingTarget.type}-${ownerTrainingTarget.id}`}
                      type="button"
                      className="pc-training-target-btn"
                      onClick={() => {
                        setTrainingTarget(ownerTrainingTarget)
                        setOwnerTrainingSkill('')
                      }}
                    >
                      <span>{ownerTrainingTarget.label}</span>
                      <span>{ownerTrainingTarget.detail}</span>
                    </button>
                  </>
                )}

                <p className="pc-muted"><strong>Model Training</strong></p>
                {modelTrainingTargets.length === 0 ? (
                  <p className="pc-muted">No hired models available for training.</p>
                ) : (
                  modelTrainingTargets.map((target) => (
                    <button
                      key={`${target.type}-${target.id}`}
                      type="button"
                      className="pc-training-target-btn"
                      onClick={() => {
                        setTrainingTarget(target)
                        setOwnerTrainingSkill('')
                      }}
                    >
                      <span>{target.label}</span>
                      <span>{target.detail}</span>
                    </button>
                  ))
                )}

                <p className="pc-muted"><strong>Staff Training</strong></p>
                {staffTrainingTargets.length === 0 ? (
                  <p className="pc-muted">No hired staff available for training.</p>
                ) : (
                  staffTrainingTargets.map((target) => (
                    <button
                      key={`${target.type}-${target.id}`}
                      type="button"
                      className="pc-training-target-btn"
                      onClick={() => {
                        setTrainingTarget(target)
                        setOwnerTrainingSkill('')
                      }}
                    >
                      <span>{target.label}</span>
                      <span>{target.detail}</span>
                    </button>
                  ))
                )}
              </div>
            )}

            {trainingTarget && (
              <>
                <div className="pc-training-target-head">
                  <p className="pc-muted">Selected: <strong>{trainingTarget.label}</strong></p>
                  <button type="button" className="pc-close-inline" onClick={() => {
                    setTrainingTarget(null)
                    setOwnerTrainingSkill('')
                  }}>
                    Change Target
                  </button>
                </div>

                {trainingTarget.type === 'owner' && (
                  <div className="pc-training-skill-picker">
                    <p className="pc-muted">Choose which owner skill to upgrade:</p>
                    <div className="pc-training-skill-grid">
                      {state.staffCategories.map((skillKey) => (
                        <button
                          key={skillKey}
                          type="button"
                          className={`pc-training-skill-btn${ownerTrainingSkill === skillKey ? ' is-selected' : ''}`}
                          onClick={() => setOwnerTrainingSkill(skillKey)}
                        >
                          {skillKey} ({state.ownerSkills?.[skillKey] || 0})
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pc-training-options">
                  {Object.values(state.ownerTrainingOptions).map((option) => {
                    const moneyCost = getTrainingCostPreview(trainingTarget, option, ownerTrainingSkill)
                    const needsOwnerSkill = trainingTarget.type === 'owner' && !ownerTrainingSkill
                    const insufficientAp = state.actionPoints < option.actionPointCost
                    const insufficientMoney = moneyCost !== null && state.money < moneyCost

                    return (
                      <button
                        key={option.key}
                        type="button"
                        className="pc-training-option"
                        disabled={needsOwnerSkill || insufficientAp || insufficientMoney || moneyCost === null}
                        onClick={() => {
                          const result = state.trainMember({
                            targetType: trainingTarget.type,
                            targetId: trainingTarget.id,
                            intensityKey: option.key,
                            ownerSkillKey: ownerTrainingSkill,
                          })

                          if (!result.ok) {
                            onNotify({ type: 'error', message: result.error })
                            return
                          }

                          const statLabel = result.result.targetType === 'model'
                            ? 'quality'
                            : 'skill'
                          const ownerSkillLabel = result.result.ownerSkill
                            ? ` (${result.result.ownerSkill})`
                            : ''

                          onNotify({
                            type: 'success',
                            message: `${result.result.targetLabel}${ownerSkillLabel} trained with ${result.result.intensity}. ${statLabel} ${result.result.statBefore} -> ${result.result.statAfter}, stamina -${result.result.staminaLoss}, AP -${result.result.actionPointCost}, cost ${money(result.result.moneyCost)}.`,
                            data: result.result,
                          })
                          setTrainingModalOpen(false)
                          setTrainingTarget(null)
                          setOwnerTrainingSkill('')
                        }}
                      >
                        <span>{option.label}</span>
                        <span>
                          {trainingTarget.type === 'model' ? `Quality +${option.statIncrease}` : `Skill +${option.statIncrease}`}
                          {' · '}
                          Stamina -{option.staminaLoss}
                          {' · '}
                          AP {option.actionPointCost}
                          {' · '}
                          Cost {moneyCost === null ? '-' : money(moneyCost)}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </>
            )}

            <button type="button" className="pc-close" onClick={() => setTrainingModalOpen(false)}>
              Close
            </button>
          </div>
        </div>
      )}

      {createWebsiteModalOpen && (
        <div className="pc-modal-overlay" onClick={(event) => event.stopPropagation()}>
          <div className="pc-modal pc-site-modal" onClick={(event) => event.stopPropagation()}>
            <h3>Create Website</h3>
            <p className="pc-muted">Use plain text domain name. Select extension from list. No http required.</p>

            <div className="pc-site-form">
              <div className="pc-site-form-row">
                <label className="pc-form-label" htmlFor="site-name-input">Website Domain</label>
                <div className="pc-input-group">
                  <input
                    id="site-name-input"
                    className="pc-form-control"
                    value={websiteName}
                    onChange={(event) => {
                      setWebsiteName(event.target.value)
                      if (createWebsiteError) setCreateWebsiteError('')
                    }}
                    placeholder="glam-stream"
                  />
                  <select
                    className="pc-form-select"
                    value={websiteExtension}
                    onChange={(event) => {
                      setWebsiteExtension(event.target.value)
                      if (createWebsiteError) setCreateWebsiteError('')
                    }}
                  >
                    {state.websiteExtensions.map((ext) => (
                      <option key={ext} value={ext}>{ext}</option>
                    ))}
                  </select>
                </div>
                <p className="pc-field-help">3-24 chars, letters/numbers/hyphens. Example: glam-stream.com</p>
              </div>

              <div className="pc-site-form-row">
                <label className="pc-form-label" htmlFor="site-logo-image-input">Logo Image</label>
                <label className="pc-file-picker" htmlFor="site-logo-image-input">
                  <span className="pc-file-picker-btn">Choose File</span>
                  <span className="pc-file-picker-name">{websiteLogoFileName}</span>
                </label>
                <input
                  id="site-logo-image-input"
                  className="pc-file-picker-input"
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    const file = event.target.files?.[0]
                    if (!file) {
                      setWebsiteLogo('')
                      setWebsiteLogoFileName('No file selected')
                      return
                    }

                    setWebsiteLogoFileName(file.name)
                    const reader = new FileReader()
                    reader.onload = () => {
                      const dataUrl = typeof reader.result === 'string' ? reader.result : ''
                      setWebsiteLogo(dataUrl)
                    }
                    reader.readAsDataURL(file)
                    if (createWebsiteError) setCreateWebsiteError('')
                  }}
                />
                <p className="pc-field-help">Pick a logo image file (PNG/JPG/WebP). Required.</p>
                {websiteLogo && <img src={websiteLogo} alt="Website logo preview" className="pc-site-logo-preview" />}
              </div>
            </div>

            <div className="pc-site-domain-preview">
              Preview: <strong>{`${(websiteName || 'your-site').trim().toLowerCase()}${websiteExtension}`}</strong>
            </div>
            <p className="pc-muted">Websites: {state.websites.length}/5</p>
            <p className="pc-muted">Action Point Cost: {state.websiteActionPointCost} AP · Current AP: {state.actionPoints}/{state.maxActionPoints}</p>

            <div className="pc-site-form-footer">
              <div className="pc-actions pc-actions-wrap">
                <button
                  type="button"
                  onClick={handleCreateWebsite}
                  disabled={state.websites.length >= 5 || state.actionPoints < state.websiteActionPointCost}
                >
                  Create Website ({state.websiteActionPointCost} AP)
                </button>
                <button type="button" className="pc-close-inline" onClick={() => setCreateWebsiteModalOpen(false)}>
                  Cancel
                </button>
              </div>
              {createWebsiteError && <p className="pc-inline-error">{createWebsiteError}</p>}
            </div>
          </div>
        </div>
      )}

      {manageWebsiteModalOpen && (
        <div className="pc-modal-overlay" onClick={(event) => event.stopPropagation()}>
          <div className="pc-modal pc-site-modal" onClick={(event) => event.stopPropagation()}>
            <h3>Manage Website</h3>
            <label className="pc-field">
              <span>Select Website</span>
              <select value={selectedWebsiteId} onChange={(event) => setSelectedWebsiteId(event.target.value)}>
                {state.websites.map((site) => (
                  <option key={site.id} value={site.id}>{site.name}</option>
                ))}
              </select>
            </label>

            {selectedWebsite && (
              <div className="pc-site-preview">
                <header className="pc-site-header">
                  <img src={selectedWebsite.logo} alt={selectedWebsite.name} className="pc-site-logo" />
                  <div>
                    <h4>{selectedWebsite.name}</h4>
                    <p>
                      Banners: {selectedWebsite.videosUploaded} · Views: {selectedWebsite.totalViews} · Popularity: {selectedWebsite.popularity || 0}
                    </p>
                    <p>
                      Today Income: {money(selectedWebsite.todayIncome || 0)} · Withdrawable: {money(selectedWebsite.withdrawableIncome || 0)}
                    </p>
                    <p>
                      Total Income: {money(selectedWebsite.totalIncomeEarned || 0)} · Withdrawn: {money(selectedWebsite.totalWithdrawnIncome || 0)}
                    </p>
                  </div>
                </header>

                <div className="pc-actions pc-actions-wrap">
                  <button
                    type="button"
                    onClick={() => {
                      const withdrawResult = state.withdrawWebsiteIncome({ websiteId: selectedWebsite.id })
                      if (!withdrawResult.ok) {
                        onNotify({ type: 'error', message: withdrawResult.error })
                        return
                      }

                      onNotify({
                        type: 'success',
                        message: `${selectedWebsite.name} income withdrawn: ${money(withdrawResult.result.withdrawAmount)}.`,
                      })
                    }}
                    disabled={(selectedWebsite.withdrawableIncome || 0) <= 0}
                  >
                    Withdraw Income ({money(selectedWebsite.withdrawableIncome || 0)})
                  </button>
                </div>

                <div className="pc-site-video-grid">
                  {uploadedVideosForSelectedWebsite.length === 0 && (
                    <p className="pc-muted">No posted banners yet. Upload from Inventory section.</p>
                  )}
                  {uploadedVideosForSelectedWebsite.map((videoItem) => (
                    <article key={videoItem.id} className="pc-site-video-card">
                      <img
                        src={videoItem.coverImageUrl || videoItem.models?.[0]?.imageUrl || selectedWebsite.logo}
                        alt={videoItem.title}
                        className="pc-site-video"
                      />
                      <p>{videoItem.title}</p>
                      <p>Grade {videoItem.grade} · Day {videoItem.day}</p>
                      <p>Today Views {videoItem.websiteTodayViews || 0} · Total Views {videoItem.websiteViews || 0}</p>
                      <p>Today Income {money(videoItem.websiteTodayIncome || 0)} · Total Income {money(videoItem.websiteIncome || 0)}</p>
                      <button
                        type="button"
                        className="pc-close-inline"
                        onClick={() => {
                          const removeResult = state.removeInventoryFromWebsite({ itemId: videoItem.id })
                          if (!removeResult.ok) {
                            onNotify({ type: 'error', message: removeResult.error })
                            return
                          }

                          onNotify({ type: 'success', message: `${videoItem.title} put down from ${selectedWebsite.name}.` })
                        }}
                      >
                        Put Down Banner
                      </button>
                    </article>
                  ))}
                </div>
              </div>
            )}

            <button type="button" className="pc-close" onClick={() => setManageWebsiteModalOpen(false)}>
              Close
            </button>
          </div>
        </div>
      )}

      <ProductionModal
        open={productionModalOpen}
        onClose={() => setProductionModalOpen(false)}
        state={state}
        money={money}
        selectedGigId={selectedGigId}
        setSelectedGigId={setSelectedGigId}
        selectedModelIds={selectedModelIds}
        toggleModelSelection={toggleModelSelection}
        staffByCategory={staffByCategory}
        setStaffByCategory={setStaffByCategory}
        shootType={shootType}
        setShootType={setShootType}
        nameMode={nameMode}
        setNameMode={setNameMode}
        customTitle={customTitle}
        setCustomTitle={setCustomTitle}
        previousTitle={previousTitle}
        setPreviousTitle={setPreviousTitle}
        previousBaseTitles={previousBaseTitles}
        description={description}
        setDescription={setDescription}
        locationId={locationId}
        setLocationId={setLocationId}
        serviceLevel={serviceLevel}
        setServiceLevel={setServiceLevel}
        dressPartnerId={dressPartnerId}
        setDressPartnerId={setDressPartnerId}
        selectedEquipmentIds={selectedEquipmentIds}
        setSelectedEquipmentIds={setSelectedEquipmentIds}
        ownedEquipment={ownedEquipment}
        productionPreview={productionPreview}
        canStartShoot={canStartShoot}
        shootBlockReason={shootBlockReason}
        onStartShoot={handleStartProduction}
        isShootInProgress={isShootInProgress}
        bannerPresetKey={bannerPresetKey}
        setBannerPresetKey={setBannerPresetKey}
        selectedBannerModelId={selectedBannerModelId}
        setSelectedBannerModelId={setSelectedBannerModelId}
      />

      {isShootInProgress && (
        <div className="pc-modal-overlay pc-shoot-loading-overlay" onClick={(event) => event.stopPropagation()}>
          <div className="pc-shoot-loading-card" onClick={(event) => event.stopPropagation()}>
            <div className="pc-shoot-spinner" aria-hidden="true" />
            <h3>Shooting going on...</h3>
            <p>{shootProgressText || 'Please wait while production is being processed.'}</p>
          </div>
        </div>
      )}

      <StatisticsModal
        open={statisticsModalOpen}
        onClose={() => setStatisticsModalOpen(false)}
        state={state}
        money={money}
      />
    </main>
  )
}

export default DesktopGameView
