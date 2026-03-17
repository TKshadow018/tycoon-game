import { create } from 'zustand'
import { createCompanies } from '../data/companies'
import { interview_1 } from '../data/interview_1'
import { createInitialModels } from '../data/models'
import { createStaffMarket } from '../data/staff'
import shootType1Base64 from '../assets/shooting-type-1.base64.txt?raw'
import shootType2Base64 from '../assets/shooting-type-2.base64.txt?raw'
import shootType3Base64 from '../assets/shooting-type-3.base64.txt?raw'
import shootType4Base64 from '../assets/shooting-type-4.base64.txt?raw'
import shootType5Base64 from '../assets/shooting-type-5.base64.txt?raw'

const clamp = (value, min = 0, max = 100) => Math.max(min, Math.min(max, value))
const randomModifier = () => Math.round(Math.random() * 20) - 10

const staffCategories = ['director', 'camera', 'lighting', 'sound', 'editor']

const ownerSkills = {
  director: 8,
  camera: 8,
  lighting: 8,
  sound: 8,
  editor: 8,
}

const serviceLevels = {
  none: { label: 'None', costPerStaff: 0, modelStaminaBoost: 0, modelHapinessBoost: 0, staffStaminaBoost: 0, staffHapinessBoost: 0 },
  low: { label: 'Low', costPerStaff: 80, modelStaminaBoost: 3, modelHapinessBoost: 1, staffStaminaBoost: 2, staffHapinessBoost: 1 },
  medium: { label: 'Medium', costPerStaff: 180, modelStaminaBoost: 6, modelHapinessBoost: 2, staffStaminaBoost: 4, staffHapinessBoost: 2 },
  good: { label: 'Good', costPerStaff: 320, modelStaminaBoost: 10, modelHapinessBoost: 3, staffStaminaBoost: 7, staffHapinessBoost: 3 },
  excellent: { label: 'Excellent', costPerStaff: 520, modelStaminaBoost: 15, modelHapinessBoost: 4, staffStaminaBoost: 10, staffHapinessBoost: 4 },
}

const dressPartners = [
  { id: 'brand-1', name: 'Velvet Arc', requiredPopularity: 0, sponsorshipCost: 150, qualityBonus: 1, logo: "/dressPartner/1.jpg", relation: 0 },
  { id: 'brand-2', name: 'Neon Muse', requiredPopularity: 5, sponsorshipCost: 220, qualityBonus: 1.5, logo: "/dressPartner/2.jpg", relation: 0 },
  { id: 'brand-3', name: 'Urban Silk', requiredPopularity: 8, sponsorshipCost: 260, qualityBonus: 2, logo: "/dressPartner/3.jpg", relation: 0 },
  { id: 'brand-4', name: 'Golden Petal', requiredPopularity: 12, sponsorshipCost: 320, qualityBonus: 2.5, logo: "/dressPartner/4.jpg", relation: 0 },
  { id: 'brand-5', name: 'Astra Line', requiredPopularity: 16, sponsorshipCost: 380, qualityBonus: 3, logo: "/dressPartner/5.jpg", relation: 0 },
  { id: 'brand-6', name: 'Royal Knit', requiredPopularity: 22, sponsorshipCost: 450, qualityBonus: 3.5, logo: "/dressPartner/6.jpg", relation: 0 },
  { id: 'brand-7', name: 'Diamond Loom', requiredPopularity: 28, sponsorshipCost: 540, qualityBonus: 4, logo: "/dressPartner/7.jpg", relation: 0 },
  { id: 'brand-8', name: 'Ivory Edge', requiredPopularity: 34, sponsorshipCost: 620, qualityBonus: 4.5, logo: "/dressPartner/8.jpg", relation: 0 },
  { id: 'brand-9', name: 'Scarlet Nova', requiredPopularity: 40, sponsorshipCost: 700, qualityBonus: 5, logo: "/dressPartner/9.jpg", relation: 0 },
  { id: 'brand-10', name: 'Obsidian Vogue', requiredPopularity: 46, sponsorshipCost: 820, qualityBonus: 5.5, logo: "/dressPartner/10.jpg", relation: 0 },
  { id: 'brand-11', name: 'Luxe Orbit', requiredPopularity: 52, sponsorshipCost: 940, qualityBonus: 6, logo: "/dressPartner/11.jpg", relation: 0 },
  { id: 'brand-12', name: 'Pure Halo', requiredPopularity: 58, sponsorshipCost: 1100, qualityBonus: 6.5, logo: "/dressPartner/12.jpg", relation: 0 },
  { id: 'brand-13', name: 'Noir Atelier', requiredPopularity: 65, sponsorshipCost: 1280, qualityBonus: 7, logo: "/dressPartner/13.jpg", relation: 0 },
  { id: 'brand-14', name: 'Prism Crown', requiredPopularity: 72, sponsorshipCost: 1450, qualityBonus: 7.5, logo: "/dressPartner/14.jpg", relation: 0 },
  { id: 'brand-15', name: 'Eclipse Signature', requiredPopularity: 80, sponsorshipCost: 1650, qualityBonus: 8, logo: "/dressPartner/15.jpg", relation: 0 },
]

const staffMarket = createStaffMarket()

const createStudioCatalog = () => {
  const baseStudios = [
    {
      id: 'studio-own-house',
      name: 'Own House',
      qualityBonus: 0.5,
      buyPrice: 0,
      rentFees: { day: 0, week: 0, month: 0 },
      imageUrl: '/location/1.jpg',
    },
  ]

  const generatedStudios = Array.from({ length: 19 }, (_, index) => {
    const number = index + 1
    let increaseBy = (number > 15 ? 4 : number > 10 ? 3 : number > 5 ? 2 : 1) * 50
    const qualityBonus = 1 + number/2
    const dayRent = 100 + number * increaseBy
    const weekRent = Math.round(dayRent * 5.5)
    const monthRent = Math.round(dayRent * 20)
    const buyPrice = monthRent * 12 * 10

    return {
      id: `studio-${number}`,
      name: `Shooting Location ${number}`,
      qualityBonus,
      buyPrice,
      rentFees: { day: dayRent, week: weekRent, month: monthRent },
      imageUrl: `/location/${number+1}.jpg`,
    }
  })

  return [...baseStudios, ...generatedStudios]
}

const studioCatalog = createStudioCatalog()

const shootLocations = studioCatalog.map((studio) => ({
  id: `location-${studio.id}`,
  name: studio.name,
  qualityBonus: Math.max(0, Math.round(studio.qualityBonus * 0.5)),
  extraCost: studio.rentFees.day,
}))

const createDefaultActiveStudio = () => {
  const ownHouse = studioCatalog.find((studio) => studio.id === 'studio-own-house')
  if (!ownHouse) return null

  return {
    id: ownHouse.id,
    name: ownHouse.name,
    qualityBonus: ownHouse.qualityBonus,
    mode: 'owned',
    term: 'permanent',
    daysLeft: null,
    imageUrl: ownHouse.imageUrl,
  }
}

const cameraSubCategories = ['dslr', 'mirrorless', 'cinema', 'action', 'broadcast']
const dressSubCategories = [
  'headware',
  'bodyware',
  'pantware',
  'innerware',
  'shoes',
  'accessories',
  'outerwear',
  'sportswear',
  'swimwear',
  'nightwear',
  'formalwear',
  'jewelry',
]

const createCameraEquipment = () =>
  cameraSubCategories.flatMap((subCategory, subIndex) =>
    Array.from({ length: 10 }, (_, itemIndex) => {
      const rank = itemIndex + 1
      const qualityBonus = 1 + parseFloat((subIndex + (rank / 2)))
      const price = 1500 + subIndex * 850 + rank * 320

      return {
        id: `equip-camera-${subCategory}-${rank}`,
        name: `${subCategory.toUpperCase()} Camera ${rank}`,
        category: 'camera',
        subCategory,
        price,
        qualityBonus,
        imageUrl: `https://picsum.photos/seed/equip-camera-${subCategory}-${rank}/360/220`,
      }
    }),
  )

const createDressEquipment = () =>
  dressSubCategories.flatMap((subCategory, subIndex) =>
    Array.from({ length: 20 }, (_, itemIndex) => {
      const rank = itemIndex + 1
      const qualityBonus = 1 + Math.floor(rank / 3) + Math.floor(subIndex / 2)
      const price = 500 + subIndex * 140 + rank * 95

      return {
        id: `equip-dress-${subCategory}-${rank}`,
        name: `${subCategory.toUpperCase()} Dress ${rank}`,
        category: 'dress',
        subCategory,
        price,
        qualityBonus,
        imageUrl: `https://picsum.photos/seed/equip-dress-${subCategory}-${rank}/360/220`,
      }
    }),
  )

const equipmentCatalog = [
  ...createCameraEquipment(),
  ...createDressEquipment(),
  { id: 'equip-light-soft', name: 'Soft Light Set', category: 'lights', subCategory: 'softbox', price: 1800, qualityBonus: 1, imageUrl: '/equipment/light/1.jpg' },
  { id: 'equip-light-neon', name: 'Neon Light Wall', category: 'lights', subCategory: 'neon', price: 4200, qualityBonus: 2, imageUrl: '/equipment/light/2.jpg' },
  { id: 'equip-light-stage', name: 'Stage Lighting Grid', category: 'lights', subCategory: 'stage', price: 9800, qualityBonus: 3, imageUrl: '/equipment/light/3.jpg' },
  { id: 'equip-kit-makeup', name: 'Makeup Kit', category: 'kits', subCategory: 'makeup', price: 1300, qualityBonus: 1, imageUrl: '/equipment/kit/1.jpg' },
  { id: 'equip-kit-skin', name: 'Skin Care Kit', category: 'kits', subCategory: 'skin', price: 2600, qualityBonus: 2, imageUrl: '/equipment/kit/3.jpg' },
  { id: 'equip-kit-pro', name: 'Pro Styling Kit', category: 'kits', subCategory: 'styling', price: 5800, qualityBonus: 2.5, imageUrl: '/equipment/kit/4.jpg' },
  { id: 'equip-audio-basic', name: 'Audio Recorder', category: 'audio', subCategory: 'recorder', price: 1900, qualityBonus: 1, imageUrl: '/equipment/audio/1.jpg' },
  { id: 'equip-audio-pro', name: 'Pro Audio Suite', category: 'audio', subCategory: 'suite', price: 6800, qualityBonus: 2.5, imageUrl: '/equipment/audio/2.jpg' },
  { id: 'equip-drone', name: 'Drone Camera', category: 'special', subCategory: 'drone', price: 8800, qualityBonus: 3, imageUrl: '/equipment/special/3.jpg' },
  { id: 'equip-fx-smoke', name: 'Smoke FX Kit', category: 'special', subCategory: 'fx', price: 2100, qualityBonus: 1, imageUrl: '/equipment/special/1.jpg' },
  { id: 'equip-fx-water', name: 'Water FX Setup', category: 'special', subCategory: 'fx', price: 4200, qualityBonus: 2, imageUrl: '/equipment/special/2.jpg' },
  { id: 'equip-bg-led', name: 'LED Background Wall', category: 'background', subCategory: 'led', price: 7300, qualityBonus: 2.5, imageUrl: '/equipment/background/2.jpg' },
  { id: 'equip-bg-green', name: 'Green Screen Pro', category: 'background', subCategory: 'greenscreen', price: 3600, qualityBonus: 1.5, imageUrl: '/equipment/background/1.jpg' },
  { id: 'equip-monitor', name: 'Director Monitoring Station', category: 'production', subCategory: 'monitor', price: 5400, qualityBonus: 2, imageUrl: '/equipment/production/1.jpg' },
]

const workTypes = {
  basic: {
    label: "Photoshoot",
    staminaCost: 15,
    baseRevenue: 500,
    imageUrl: `data:image/jpeg;base64,${shootType1Base64}`,
    unlockAt: 0,
    hiddenBeforeUnlock: false,
  },
  ad: {
    label: "Advertisement Shoot",
    staminaCost: 20,
    baseRevenue: 800,
    imageUrl: `data:image/jpeg;base64,${shootType2Base64}`,
    unlockAt: 5,
    hiddenBeforeUnlock: false,
  },
  movie: {
    label: "Shortfilm Shoot",
    staminaCost: 40,
    baseRevenue: 1200,
    imageUrl: `data:image/jpeg;base64,${shootType3Base64}`,
    unlockAt: 10,
    hiddenBeforeUnlock: false,
  },
  body: {
    label: "Body Photoshoot",
    staminaCost: 30,
    baseRevenue: 1500,
    imageUrl: `data:image/jpeg;base64,${shootType4Base64}`,
    unlockAt: 70,
    hiddenBeforeUnlock: true,
  },
  special: {
    label: "Special Shoot",
    staminaCost: 50,
    baseRevenue: 3000,
    imageUrl: `data:image/jpeg;base64,${shootType5Base64}`,
    unlockAt: 90,
    hiddenBeforeUnlock: true,
  },
};

const salesChannels = {
  company: { label: 'Other Company', multiplier: 1.1 },
  individual: { label: 'Individual', multiplier: 0.95 },
  sponsor: { label: 'Sponsor Deal', multiplier: 1.35 },
}

const partyOptions = {
  small: {
    key: 'small',
    label: 'Small Party for Actors',
    actorHapinessDelta: 2,
    staffHapinessDelta: -1,
    imageUrl: '/party/1.jpg',
    description: 'Happiness +2 for all actors, -1 for all staff.',
    actionPointCost: 1,
    cost: ({ actorCount }) => 100 * actorCount,
  },
  medium: {
    key: 'medium',
    label: 'Mid Level Party for Crew and Actors',
    actorHapinessDelta: 3,
    staffHapinessDelta: 3,
    imageUrl: '/party/2.jpg',
    description: 'Happiness +3 for all actors and staff.',
    actionPointCost: 2,
    cost: ({ actorCount, staffCount }) => 120 * (actorCount + staffCount),
  },
  massive: {
    key: 'massive',
    label: 'Massive Party for Crew, Actors, and Families',
    actorHapinessDelta: 5,
    staffHapinessDelta: 5,
    imageUrl: '/party/3.jpg',
    description: 'Happiness +5 for all actors and staff.',
    actionPointCost: 3,
    cost: ({ actorCount, staffCount }) => 250 * (actorCount + staffCount),
  },
}

const makeEmptyInventory = () => ({
  basic: { produced: 0, unsold: 0, avgGrade: 0 },
  body: { produced: 0, unsold: 0, avgGrade: 0 },
  movie: { produced: 0, unsold: 0, avgGrade: 0 },
  ad: { produced: 0, unsold: 0, avgGrade: 0 },
  special: { produced: 0, unsold: 0, avgGrade: 0 },
})

const companyBannerImages = [
  'https://picsum.photos/seed/banner-1/1280/420',
  'https://picsum.photos/seed/banner-2/1280/420',
  'https://picsum.photos/seed/banner-3/1280/420',
  'https://picsum.photos/seed/banner-4/1280/420',
]

const average = (values) => (values.length ? values.reduce((sum, val) => sum + val, 0) / values.length : 0)

const gigCastTypes = ['any', 'female', 'male', 'mixed']
const gigTitlePrefixes = ['Campaign', 'Brand Story', 'Launch Visual', 'Seasonal Promo', 'Creator Series']
const buyerFirstNames = [
  'Liam', 'Noah', 'Oliver', 'Elijah', 'Mateo', 'Ethan', 'Lucas', 'Ava', 'Emma', 'Sophia',
  'Mia', 'Amelia', 'Isabella', 'Evelyn', 'Harper', 'Aria', 'Layla', 'Nora', 'Zoe', 'Mila',
]
const buyerLastNames = [
  'Carter', 'Brooks', 'Bennett', 'Coleman', 'Diaz', 'Reed', 'Jensen', 'Sullivan', 'Parker', 'Hayes','Morgan','Rivera','Cooper','Richardson','Cox'
]
const profitabilityKeywords = {
  plus2: ['nude', 'love', 'sexy', 'boob', 'kiss', 'sensual', 'erotic', 'intimate', 'romantic', 'sultry'],
  plus5: ['sex', 'fuck','cum','blowjob','titjob','pussy','whore','slut','dick','penis'],
  plus10: ['incest','taboo','bdsm','force'],
}
const nameQualityKeywords = {
  high: [...profitabilityKeywords.plus10],
  medium: [...profitabilityKeywords.plus5],
  low: [...profitabilityKeywords.plus2],
}

const randomPick = (items) => items[Math.floor(Math.random() * items.length)]
const randomBetween = (min, max) => min + Math.random() * (max - min)
const randomizeItems = (items) => [...items].sort(() => Math.random() - 0.5)
const websiteNameRegex = /^(?=.{3,24}$)[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i
const allowedWebsiteExtensions = ['.com', '.net', '.org', '.ai', '.io', '.co', '.app', '.dev', '.gg', '.tv', '.onion']
const INTERVIEW_CYCLE_DAYS = 7
const INTERVIEW_QUESTION_COUNT = 3
const DAILY_ACTION_POINTS = 7
const DAILY_STAMINA_RECOVERY = 10
const MAX_GAME_EVENTS = 600
const MAX_FINANCE_ENTRIES = 1200
const MAX_DAILY_STATS = 400
const INTERVIEW_ACTION_POINT_COST = 1
const WEBSITE_ACTION_POINT_COST = 1
const INDIVIDUAL_OFFER_CHANCE = 0.2
const PROJECT_ACTION_POINT_COST_BY_SHOOT_TYPE = {
  basic: 4,
  ad: 4,
  body: 5,
  special: 6,
  movie: 7,
}
const MAX_SAVE_SLOTS = 3
const BANKRUPTCY_GRACE_DAYS = 7

const clampCompanyMetric = (value) => clamp(value, -100, 100)

const evaluateLoseCondition = (state) => {
  if (!state?.started || state?.gameOver) return null

  if ((state.money ?? 0) < 0 && (state.negativeMoneyDays ?? 0) > BANKRUPTCY_GRACE_DAYS) {
    return {
      code: 'bankruptcy',
      title: 'Game Over: Bankruptcy',
      message:
        'Company budget stayed negative for more than 1 week. Bankruptcy declared and the company is closed.',
    }
  }

  const violatingModel = (state.roster || []).find(
    (model) => (model.hapiness ?? 0) <= 0 || (model.stamina ?? 0) <= 0,
  )
  if (violatingModel) {
    return {
      code: 'labour-law-model',
      title: 'Game Over: Labour Law Case',
      message: `${violatingModel.name} filed a labour law case after stamina/happiness dropped too low. Court seized the company.`,
    }
  }

  const violatingStaff = (state.hiredStaff || []).find(
    (staff) => (staff.hapiness ?? 0) <= 0 || (staff.stamina ?? 0) <= 0,
  )
  if (violatingStaff) {
    return {
      code: 'labour-law-staff',
      title: 'Game Over: Labour Law Case',
      message: `${violatingStaff.name} filed a labour law case after stamina/happiness dropped too low. Court seized the company.`,
    }
  }

  if ((state.popularity ?? 0) < 0 && (state.companyReputation ?? 0) < 0) {
    return {
      code: 'public-collapse',
      title: 'Game Over: Public Collapse',
      message:
        'Popularity and reputation both fell below zero. The brand collapsed under public depression and trust loss.',
    }
  }

  return null
}

const toLoseResult = (loss) => ({
  ok: false,
  error: loss.message,
  result: {
    gameOver: true,
    reason: loss,
  },
})
const SAVE_STORAGE_PREFIX = 'tycoon-game-save-slot-'

const normalizeSaveSlot = (slot) => {
  const parsed = Number(slot)
  if (!Number.isInteger(parsed)) return null
  if (parsed < 1 || parsed > MAX_SAVE_SLOTS) return null
  return parsed
}

const getSaveStorageKey = (slot) => `${SAVE_STORAGE_PREFIX}${slot}`

const readSaveSlotMeta = () => {
  if (typeof window === 'undefined' || !window.localStorage) return []

  const slots = []
  for (let slot = 1; slot <= MAX_SAVE_SLOTS; slot += 1) {
    const raw = window.localStorage.getItem(getSaveStorageKey(slot))
    if (!raw) {
      slots.push({ slot, occupied: false, savedAt: null, companyName: '', day: null, money: null })
      continue
    }

    try {
      const parsed = JSON.parse(raw)
      const meta = parsed?.meta || {}
      slots.push({
        slot,
        occupied: true,
        savedAt: typeof meta.savedAt === 'string' ? meta.savedAt : null,
        companyName: typeof meta.companyName === 'string' ? meta.companyName : '',
        day: Number.isFinite(meta.day) ? meta.day : null,
        money: Number.isFinite(meta.money) ? meta.money : null,
      })
    } catch {
      slots.push({ slot, occupied: false, savedAt: null, companyName: '', day: null, money: null })
    }
  }

  return slots
}

const getSaveableStateSnapshot = (state) => ({
  started: state.started,
  companyName: state.companyName,
  day: state.day,
  money: state.money,
  popularity: state.popularity,
  companyReputation: state.companyReputation,
  ownerStamina: state.ownerStamina,
  modelPool: state.modelPool,
  roster: state.roster,
  hiredStaff: state.hiredStaff,
  activeStudio: state.activeStudio,
  ownedEquipmentIds: state.ownedEquipmentIds,
  workInventory: state.workInventory,
  inventoryItems: state.inventoryItems,
  shootingHistory: state.shootingHistory,
  companies: state.companies,
  dailyFreelanceGigs: state.dailyFreelanceGigs,
  activeGigContracts: state.activeGigContracts,
  completedGigContracts: state.completedGigContracts,
  paymentsToMake: state.paymentsToMake,
  websites: state.websites,
  gameEvents: state.gameEvents,
  financeEntries: state.financeEntries,
  dailyStats: state.dailyStats,
  actionPoints: state.actionPoints,
  lastInterviewDay: state.lastInterviewDay,
  gameOver: state.gameOver,
  gameOverReason: state.gameOverReason,
  negativeMoneyDays: state.negativeMoneyDays,
})

const roundTo2 = (value) => Math.round((Number(value) || 0) * 100) / 100

const contractDaysByType = { day: 1, week: 7, month: 30 }
const contractKeysByType = { day: 'dailyFee', week: 'weeklyFee', month: 'monthlyFee' }

const makeLogId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

const createGameEvent = ({ day, type = 'info', title, description = '', meta = {} }) => ({
  id: makeLogId('event'),
  day,
  type,
  title,
  description,
  meta,
  createdAt: new Date().toISOString(),
  createdAtTs: Date.now(),
})

const createFinanceEntry = ({ day, category = 'other', amount = 0, balanceAfter = 0, note = '' }) => ({
  id: makeLogId('finance'),
  day,
  category,
  amount: Math.round(amount),
  balanceAfter: Math.round(balanceAfter),
  note,
  createdAt: new Date().toISOString(),
  createdAtTs: Date.now(),
})

const createDailyStatSnapshot = ({
  day,
  money,
  popularity,
  companyReputation,
  rosterCount,
  staffCount,
  websiteCount,
  unsoldInventory,
  producedInventory,
  previousMoney,
  label = 'snapshot',
}) => ({
  id: makeLogId('daily'),
  day,
  label,
  money: Math.round(money),
  popularity,
  companyReputation,
  rosterCount,
  staffCount,
  websiteCount,
  unsoldInventory,
  producedInventory,
  moneyDelta: Math.round((money ?? 0) - (previousMoney ?? 0)),
  createdAt: new Date().toISOString(),
  createdAtTs: Date.now(),
})

const getModelContractFee = (model, term) => {
  const base = 500 + (model?.quality || 0) * 35
  if (term === 'day') return Math.max(100, Math.round(base * 0.2))
  if (term === 'week') return Math.max(400, Math.round(base * 0.95))
  return Math.max(1000, Math.round(base * 3.4))
}

const ownerTrainingOptions = {
  low: {
    key: 'low',
    label: 'Low Intensity',
    actionPointCost: 1,
    statIncrease: 1,
    staminaLoss: 1,
    baseCost: 100,
    costPerCurrentStat: 2,
  },
  medium: {
    key: 'medium',
    label: 'Medium Intensity',
    actionPointCost: 2,
    statIncrease: 2,
    staminaLoss: 2,
    baseCost: 200,
    costPerCurrentStat: 3,
  },
  high: {
    key: 'high',
    label: 'High Intensity',
    actionPointCost: 3,
    statIncrease: 3,
    staminaLoss: 3,
    baseCost: 300,
    costPerCurrentStat: 5,
  },
}

const getInterviewAvailability = (day, lastInterviewDay = 0) => {
  const daysUntilCycleOpen = (INTERVIEW_CYCLE_DAYS - (day % INTERVIEW_CYCLE_DAYS)) % INTERVIEW_CYCLE_DAYS
  const availableByCycle = daysUntilCycleOpen === 0
  const alreadyUsedToday = lastInterviewDay === day

  if (availableByCycle && !alreadyUsedToday) {
    return { isAvailable: true, daysUntilNext: 0 }
  }

  if (alreadyUsedToday) {
    return { isAvailable: false, daysUntilNext: INTERVIEW_CYCLE_DAYS }
  }

  return {
    isAvailable: false,
    daysUntilNext: daysUntilCycleOpen,
  }
}

const averageGradeForBaseTitle = (state, baseTitle) => {
  if (!baseTitle) return null

  const gradedHistory = state.shootingHistory.filter(
    (entry) => entry.baseTitle === baseTitle && Number.isFinite(entry.grade),
  )

  if (gradedHistory.length > 0) {
    return average(gradedHistory.map((entry) => entry.grade))
  }

  const gradedInventory = state.inventoryItems.filter(
    (entry) => entry.baseTitle === baseTitle && Number.isFinite(entry.grade),
  )

  if (gradedInventory.length > 0) {
    return average(gradedInventory.map((entry) => entry.grade))
  }

  return null
}

const keywordModifierPercent = (textValue) => {
  return 0
}

const previousTitleFameModifierPercent = (avgGrade) => {
  return 0
}

const getNameQualityBonus = (nameValue) => {
  let totalBonus = 0
  if (!nameValue?.trim()) return 0

  const text = nameValue.toLowerCase()
  if (nameQualityKeywords.high.some((word) => text.includes(word))) totalBonus = 10
  else if (nameQualityKeywords.medium.some((word) => text.includes(word))) totalBonus = 5
  else if (nameQualityKeywords.low.some((word) => text.includes(word))) totalBonus = 2
  console.log("---> getNameQualityBonus",totalBonus)
  return totalBonus
}

const buildProfitabilityModifier = ({ state, payload, titleResult }) => {
  const textToScan = `${titleResult?.baseTitle || ''} ${payload.description || ''}`
  const keywordBonusPercent = keywordModifierPercent(textToScan)

  const previousTitleAvgGrade =
    payload.nameMode === 'previous'
      ? averageGradeForBaseTitle(state, titleResult?.baseTitle)
      : null
  const fameBonusPercent = previousTitleFameModifierPercent(previousTitleAvgGrade)

  return {
    keywordBonusPercent,
    fameBonusPercent,
    totalPercent: keywordBonusPercent + fameBonusPercent,
    previousTitleAvgGrade,
  }
}

const applyProfitabilityModifierToOutcome = (outcome, modifierPercent) => {
  if (!modifierPercent) {
    return {
      ...outcome,
      profitabilityModifierPercent: 0,
    }
  }

  const adjustedGrossRevenue = Math.max(
    0,
    Math.round(outcome.grossRevenue * (1 + modifierPercent / 100)),
  )
  const adjustedModelPayoutTotal = Math.round(adjustedGrossRevenue * 0.2)
  const adjustedOperatingCost =
    adjustedModelPayoutTotal + outcome.serviceCost + outcome.locationCost + outcome.dressCost
  const adjustedNetProfit = adjustedGrossRevenue - adjustedOperatingCost

  return {
    ...outcome,
    grossRevenue: adjustedGrossRevenue,
    modelPayoutTotal: adjustedModelPayoutTotal,
    operatingCost: adjustedOperatingCost,
    netProfit: adjustedNetProfit,
    profitabilityModifierPercent: modifierPercent,
  }
}

const createInventorySaleOffers = ({ grossRevenue, companies, freelanceGig }) => {
  const companyBuyer = randomPick(companies)
  const personName = `${randomPick(buyerFirstNames)} ${randomPick(buyerLastNames)}`

  const baseCompanyOffer = Math.round(grossRevenue * randomBetween(0.8, 1.2))
  const companyOffer = freelanceGig
    ? Math.max(0, Math.round(baseCompanyOffer * 0.5))
    : baseCompanyOffer
  const shouldIncludeIndividualOffer = !freelanceGig && Math.random() < INDIVIDUAL_OFFER_CHANCE
  const individualOffer = shouldIncludeIndividualOffer
    ? Math.round(grossRevenue * randomBetween(0.5, 1.5))
    : null

  const sponsorOffer = freelanceGig
    ? {
        name: freelanceGig.companyName,
        offer: Math.round(freelanceGig.contractOffer ?? freelanceGig.payout ?? 0),
      }
    : null

  return {
    company: {
      name: companyBuyer?.name ?? 'Partner Company',
      offer: companyOffer,
    },
    individual: individualOffer
      ? {
          name: personName,
          offer: individualOffer,
        }
      : null,
    sponsor: sponsorOffer,
  }
}

const pickGigShootType = (difficulty) => {
  if (difficulty < 25) return randomPick(['basic', 'ad'])
  if (difficulty < 50) return randomPick(['basic', 'ad', 'body'])
  if (difficulty < 70) return randomPick(['body', 'ad', 'movie'])
  return randomPick(['movie', 'special', 'ad'])
}

const deriveCastTypeFromModels = (models) => {
  const genders = [...new Set(models.map((model) => model.gender))]
  if (genders.length === 1) return genders[0]
  return 'mixed'
}

const createFreelanceGig = ({ company, popularity, reputation, day, sequence }) => {
  const userLevel = clamp(Math.round(popularity + reputation * 1.15 + day * 0.5), 0, 100)
  const difficulty = clamp(Math.round(company.minimumPopularity * 0.7 + userLevel * 0.3), 8, 96)
  const shootType = pickGigShootType(difficulty)
  const castType = randomPick(gigCastTypes)
  const minModels = shootType === 'movie' || shootType === 'special' ? 2 + (difficulty > 65 ? 1 : 0) : 1
  const minGrade = clamp(Math.round(38 + difficulty * 0.45), 35, 90)
  const deadlineDays = difficulty > 70 ? 2 : difficulty > 45 ? 3 : 4
  const budgetBase = workTypes[shootType].baseRevenue * minModels
  const suggestedBudget = Math.round(
    budgetBase * (1 + difficulty / 120) + company.valuation / 220000,
  )

  return {
    id: `gig-${day}-${company.id}-${sequence}`,
    day,
    companyId: company.id,
    companyName: company.name,
    companySector: company.sectorLabel || company.sectorKey || 'General',
    companyRelation: company.relation,
    minimumPopularity: company.minimumPopularity,
    title: `${randomPick(gigTitlePrefixes)} ${day}-${sequence + 1}`,
    difficulty,
    suggestedBudget,
    minBudget: Math.round(suggestedBudget * 0.72),
    maxBudget: Math.round(suggestedBudget * 1.4),
    deadlineDays,
    requirements: {
      shootType,
      castType,
      minModels,
      minGrade,
    },
  }
}

const createDailyFreelanceGigs = ({ companies, popularity, reputation, day }) => {
  const targetLevel = clamp(Math.round(popularity + reputation * 1.2 + day * 0.5), 0, 100)

  const ranked = companies
    .map((company) => {
      const distance = Math.abs(company.minimumPopularity - targetLevel)
      const relationBoost = company.relation * 0.35
      const randomNoise = Math.random() * 12
      return {
        company,
        score: distance - relationBoost + randomNoise,
      }
    })
    .sort((left, right) => left.score - right.score)

  const selected = ranked.slice(0, 20)
  const randomized = selected.sort(() => Math.random() - 0.5).slice(0, 10)

  return randomized.map(({ company }, index) =>
    createFreelanceGig({ company, popularity, reputation, day, sequence: index }),
  )
}

const resetCompanyRelations = (companies) =>
  companies.map((company) => ({ ...company, relation: 0 }))

const getRejectFactorByRelation = (relation) => {
  if (relation < 20) return 1.1
  if (relation < 35) return 1.25
  if (relation < 50) return 1.5
  if (relation < 75) return 1.75
  if (relation < 90) return 2
  return 2
}

const INITIAL_COMPANIES = createCompanies()

const resolveShootTitle = (history, mode, customTitle, selectedPreviousTitle) => {
  const baseTitle = mode === 'previous' ? selectedPreviousTitle : customTitle.trim()
  if (!baseTitle) return { error: 'Shoot name is required.' }

  const sameBaseCount = history.filter((item) => item.baseTitle === baseTitle).length

  if (mode === 'previous') {
    return {
      baseTitle,
      finalTitle: `${baseTitle} ${sameBaseCount + 1}`,
    }
  }

  return {
    baseTitle,
    finalTitle: sameBaseCount === 0 ? baseTitle : `${baseTitle} ${sameBaseCount + 1}`,
  }
}

const buildStaffSelection = (state, staffByCategory) => {
  const selected = []

  for (const category of staffCategories) {
    const choice = staffByCategory?.[category]
    if (!choice) return { error: `Select one ${category} staff.` }

    if (choice === 'owner') {
      selected.push({
        category,
        source: 'owner',
        personKey: 'owner',
        name: 'Owner (You)',
        skill: state.ownerSkills[category],
        stamina: state.ownerStamina ?? 100,
      })
      continue
    }

    const hired = state.hiredStaff.find(
      (staff) =>
        staff.hiredId === choice &&
        staff.category === category &&
        !staff.awaitingPayment &&
        (staff.contractDaysLeft ?? 0) > 0,
    )
    if (!hired) return { error: `Selected ${category} staff is invalid.` }

    selected.push({
      category,
      source: 'staff',
      personKey: hired.hiredId,
      hiredId: hired.hiredId,
      name: hired.name,
      role: hired.role,
      skill: hired.skill,
      stamina: hired.stamina ?? 100,
    })
  }

  return { selected }
}

const calculateProductionOutcome = ({
  state,
  selectedModels,
  selectedStaff,
  shootTypeKey,
  shootName,
  location,
  service,
  dress,
  selectedEquipment,
}) => {
  const shootType = state.workTypes[shootTypeKey]
  const totalModelPopularity = selectedModels.reduce((total, item) => total + (item.popularity || 0), 0)
  const modelQualityScore = selectedModels.reduce(
    (total, item) => total + ((item.quality || 0) * 5) / 100,
    0,
  )
  const staffSkillScore = selectedStaff.reduce(
    (total, item) => total + ((item.skill || 0) * 5) / 100,
    0,
  )
  const locationScore = (location.qualityBonus || 0)
  const selectedEquipmentQualityBonus = selectedEquipment.reduce(
    (total, item) => total + (item.qualityBonus || 0),
    0,
  )
  const equipmentScore = Math.min(10, selectedEquipmentQualityBonus)
  const nameScore = getNameQualityBonus(shootName)
  const reputationScore = state.companyReputation / 10

  const videoQualityRaw =
    modelQualityScore +
    staffSkillScore +
    locationScore +
    equipmentScore +
    nameScore +
    reputationScore

  const grade = clamp(Math.round(videoQualityRaw), 0, 100)
  const grossRevenue = Math.max(
    0,
    Math.round(totalModelPopularity * (state.companyReputation + grade)),
  )
  const modelPayoutTotal = Math.round(grossRevenue * 0.2)
  const serviceCost = service.costPerStaff * selectedStaff.length
  const locationCost = location.extraCost
  const dressCost = dress.sponsorshipCost
  const operatingCost = modelPayoutTotal + serviceCost + locationCost + dressCost
  const netProfit = grossRevenue - operatingCost

  return {
    shootType,
    grade,
    grossRevenue,
    modelPayoutTotal,
    serviceCost,
    locationCost,
    dressCost,
    operatingCost,
    netProfit,
  }
}

const getAllowedShootLocationIds = (state) => {
  if (!state.activeStudio?.id) return []
  return [`location-${state.activeStudio.id}`]
}

export const useGameStore = create((set, get) => ({
  started: false,
  companyName: '',
  day: 1,
  money: 0,
  popularity: 0,
  companyReputation: 0,
  ownerStamina: 100,
  modelPool: createInitialModels(),
  roster: [],
  hiredStaff: [],
  staffMarket,
  staffCategories,
  ownerSkills,
  studioCatalog,
  activeStudio: createDefaultActiveStudio(),
  shootLocations,
  equipmentCatalog,
  ownedEquipmentIds: [],
  serviceLevels,
  dressPartners,
  workTypes,
  salesChannels,
  workInventory: makeEmptyInventory(),
  inventoryItems: [],
  shootingHistory: [],
  banners: companyBannerImages,
  companies: INITIAL_COMPANIES,
  dailyFreelanceGigs: createDailyFreelanceGigs({
    companies: INITIAL_COMPANIES,
    popularity: 0,
    reputation: 0,
    day: 1,
  }),
  activeGigContracts: [],
  completedGigContracts: [],
  paymentsToMake: [],
  websites: [],
  gameEvents: [],
  financeEntries: [],
  dailyStats: [],
  websiteExtensions: allowedWebsiteExtensions,
  maxActionPoints: DAILY_ACTION_POINTS,
  actionPoints: DAILY_ACTION_POINTS,
  interviewActionPointCost: INTERVIEW_ACTION_POINT_COST,
  websiteActionPointCost: WEBSITE_ACTION_POINT_COST,
  projectActionPointCosts: PROJECT_ACTION_POINT_COST_BY_SHOOT_TYPE,
  ownerTrainingOptions,
  partyOptions,
  interviewCycleDays: INTERVIEW_CYCLE_DAYS,
  interviewQuestionsPerSession: INTERVIEW_QUESTION_COUNT,
  lastInterviewDay: 0,
  gameOver: false,
  gameOverReason: null,
  negativeMoneyDays: 0,
  maxSaveSlots: MAX_SAVE_SLOTS,
  saveSlots: readSaveSlotMeta(),

  ensureGameActive: () => {
    const state = get()
    if (!state.gameOver) return null
    return {
      ok: false,
      error: state.gameOverReason?.message || 'Game over. Start a new company to continue.',
    }
  },

  checkAndApplyLoseCondition: () => {
    const state = get()
    const loss = evaluateLoseCondition(state)
    if (!loss) return null

    const enrichedLoss = {
      ...loss,
      day: state.day,
      triggeredAt: new Date().toISOString(),
    }

    set(() => ({
      gameOver: true,
      gameOverReason: enrichedLoss,
    }))

    get().recordGameEvent({
      type: 'error',
      title: enrichedLoss.title,
      description: enrichedLoss.message,
      meta: { code: enrichedLoss.code },
    })

    return enrichedLoss
  },

  refreshSaveSlots: () => {
    const slots = readSaveSlotMeta()
    set(() => ({ saveSlots: slots }))
    return { ok: true, result: slots }
  },

  saveGameSlot: (slot) => {
    const normalizedSlot = normalizeSaveSlot(slot)
    if (!normalizedSlot) {
      return { ok: false, error: `Invalid save slot. Choose 1-${MAX_SAVE_SLOTS}.` }
    }

    const state = get()
    if (!state.started) {
      return { ok: false, error: 'Start a game before saving.' }
    }

    if (typeof window === 'undefined' || !window.localStorage) {
      return { ok: false, error: 'Save is unavailable in this environment.' }
    }

    const payload = {
      version: 1,
      meta: {
        slot: normalizedSlot,
        savedAt: new Date().toISOString(),
        companyName: state.companyName,
        day: state.day,
        money: state.money,
      },
      gameState: getSaveableStateSnapshot(state),
    }

    try {
      window.localStorage.setItem(getSaveStorageKey(normalizedSlot), JSON.stringify(payload))
      const slots = readSaveSlotMeta()
      set(() => ({ saveSlots: slots }))

      return {
        ok: true,
        result: {
          slot: normalizedSlot,
          savedAt: payload.meta.savedAt,
          companyName: payload.meta.companyName,
          day: payload.meta.day,
        },
      }
    } catch {
      return { ok: false, error: 'Unable to save game. Storage may be full.' }
    }
  },

  loadGameSlot: (slot) => {
    const normalizedSlot = normalizeSaveSlot(slot)
    if (!normalizedSlot) {
      return { ok: false, error: `Invalid save slot. Choose 1-${MAX_SAVE_SLOTS}.` }
    }

    if (typeof window === 'undefined' || !window.localStorage) {
      return { ok: false, error: 'Load is unavailable in this environment.' }
    }

    const raw = window.localStorage.getItem(getSaveStorageKey(normalizedSlot))
    if (!raw) {
      return { ok: false, error: `Save slot ${normalizedSlot} is empty.` }
    }

    try {
      const parsed = JSON.parse(raw)
      const loadedState = parsed?.gameState

      if (!loadedState || typeof loadedState !== 'object') {
        return { ok: false, error: 'Save file is invalid.' }
      }

      if (!loadedState.started) {
        return { ok: false, error: 'Save file is not a started game.' }
      }

      set((current) => ({
        ...current,
        ...loadedState,
        gameOver: Boolean(loadedState.gameOver),
        gameOverReason: loadedState.gameOverReason || null,
        negativeMoneyDays: Number.isFinite(loadedState.negativeMoneyDays) ? loadedState.negativeMoneyDays : 0,
        saveSlots: readSaveSlotMeta(),
      }))

      return {
        ok: true,
        result: {
          slot: normalizedSlot,
          companyName: loadedState.companyName,
          day: loadedState.day,
          savedAt: parsed?.meta?.savedAt || null,
        },
      }
    } catch {
      return { ok: false, error: 'Unable to load save file.' }
    }
  },

  recordGameEvent: ({ day, type = 'info', title, description = '', meta = {} }) => {
    const state = get()
    const event = createGameEvent({
      day: Number.isInteger(day) ? day : state.day,
      type,
      title,
      description,
      meta,
    })

    set((current) => ({
      gameEvents: [event, ...(current.gameEvents || [])].slice(0, MAX_GAME_EVENTS),
    }))

    return event
  },

  recordFinanceEntry: ({ day, category = 'other', amount = 0, balanceAfter, note = '' }) => {
    const state = get()
    const entry = createFinanceEntry({
      day: Number.isInteger(day) ? day : state.day,
      category,
      amount,
      balanceAfter: Number.isFinite(balanceAfter) ? balanceAfter : state.money,
      note,
    })

    set((current) => ({
      financeEntries: [entry, ...(current.financeEntries || [])].slice(0, MAX_FINANCE_ENTRIES),
    }))

    return entry
  },

  captureDailyStatSnapshot: ({ day, label = 'snapshot', moneyOverride } = {}) => {
    const state = get()
    const resolvedDay = Number.isInteger(day) ? day : state.day
    const resolvedMoney = Number.isFinite(moneyOverride) ? moneyOverride : state.money
    const previous = (state.dailyStats || []).find((entry) => entry.day < resolvedDay) || null

    const snapshot = createDailyStatSnapshot({
      day: resolvedDay,
      money: resolvedMoney,
      popularity: state.popularity,
      companyReputation: state.companyReputation,
      rosterCount: state.roster.length,
      staffCount: state.hiredStaff.length,
      websiteCount: state.websites.length,
      unsoldInventory: state.inventoryItems.filter((entry) => !entry.sold).length,
      producedInventory: state.inventoryItems.length,
      previousMoney: previous?.money ?? 0,
      label,
    })

    set((current) => ({
      dailyStats: [snapshot, ...(current.dailyStats || [])]
        .sort((left, right) => right.day - left.day || right.createdAtTs - left.createdAtTs)
        .slice(0, MAX_DAILY_STATS),
    }))

    return snapshot
  },

  startGame: (companyName, initialBudget) => {
    const trimmed = companyName.trim()
    const budget = Number(initialBudget)

    if (!trimmed) return { ok: false, error: 'Company name is required.' }
    if (!Number.isFinite(budget) || budget < 5000) {
      return { ok: false, error: 'Initial budget must be at least 5000.' }
    }

    const openingBudget = Math.floor(budget)
    const startEvent = createGameEvent({
      day: 1,
      type: 'success',
      title: 'Company Started',
      description: `${trimmed} launched with ${openingBudget} budget.`,
      meta: { companyName: trimmed, openingBudget },
    })
    const openingFinance = createFinanceEntry({
      day: 1,
      category: 'capital',
      amount: openingBudget,
      balanceAfter: openingBudget,
      note: 'Initial company capital',
    })
    const openingDailySnapshot = createDailyStatSnapshot({
      day: 1,
      money: openingBudget,
      popularity: 0,
      companyReputation: 0,
      rosterCount: 0,
      staffCount: 0,
      websiteCount: 0,
      unsoldInventory: 0,
      producedInventory: 0,
      previousMoney: 0,
      label: 'day-start',
    })

    set(() => ({
      started: true,
      companyName: trimmed,
      money: openingBudget,
      day: 1,
      popularity: 0,
      companyReputation: 0,
      ownerStamina: 100,
      roster: [],
      hiredStaff: [],
      staffMarket: createStaffMarket(),
      activeStudio: createDefaultActiveStudio(),
      ownedEquipmentIds: [],
      workInventory: makeEmptyInventory(),
      inventoryItems: [],
      shootingHistory: [],
      companies: resetCompanyRelations(createCompanies()),
      dailyFreelanceGigs: createDailyFreelanceGigs({
        companies: resetCompanyRelations(createCompanies()),
        popularity: 0,
        reputation: 0,
        day: 1,
      }),
      activeGigContracts: [],
      completedGigContracts: [],
      paymentsToMake: [],
      websites: [],
      gameEvents: [startEvent],
      financeEntries: [openingFinance],
      dailyStats: [openingDailySnapshot],
      actionPoints: DAILY_ACTION_POINTS,
      lastInterviewDay: 0,
      gameOver: false,
      gameOverReason: null,
      negativeMoneyDays: 0,
    }))

    return { ok: true, result: { companyName: trimmed, budget: openingBudget } }
  },

  hireStaff: (staffId, mode) => {
    const state = get()
    const blocked = get().ensureGameActive()
    if (blocked) return blocked
    const staff = state.staffMarket.find((item) => item.id === staffId)
    if (!staff) return { ok: false, error: 'Staff not found.' }

    const hireType = ['daily', 'weekly', 'monthly'].includes(mode) ? mode : 'daily'
    const feeByType = {
      daily: staff.dailyFee,
      weekly: staff.weeklyFee,
      monthly: staff.monthlyFee,
    }
    const cost = feeByType[hireType]

    const existingHire = state.hiredStaff.find((item) => item.id === staff.id)
    if (existingHire) {
      const hasPendingPayment = state.paymentsToMake.some(
        (entry) =>
          entry.status === 'pending' &&
          entry.targetType === 'staff' &&
          entry.targetId === existingHire.hiredId,
      )

      if (existingHire.awaitingPayment || hasPendingPayment) {
        return { ok: false, error: 'Settle pending payment before extending this contract.' }
      }

      const daysToAdd = hireType === 'daily' ? 1 : hireType === 'weekly' ? 7 : 30

      set((current) => ({
        hiredStaff: current.hiredStaff.map((item) => {
          if (item.hiredId !== existingHire.hiredId) return item

          return {
            ...item,
            hireType,
            contractDaysLeft: Math.max(0, item.contractDaysLeft ?? 0) + daysToAdd,
            agreedFee: (item.agreedFee || 0) + cost,
            awaitingPayment: false,
          }
        }),
      }))

      get().recordGameEvent({
        type: 'info',
        title: 'Staff Contract Extended',
        description: `${staff.name} extended for ${daysToAdd} day(s). Deferred payment increased by ${cost}.`,
        meta: { staffId: staff.id, mode: hireType, daysAdded: daysToAdd, deferredPaymentAdded: cost },
      })
      get().recordFinanceEntry({
        category: 'commitment',
        amount: -cost,
        note: `Deferred staff payment commitment: ${staff.name} (${hireType})`,
      })

      return {
        ok: true,
        result: {
          name: staff.name,
          mode: hireType,
          extended: true,
          daysAdded: daysToAdd,
          deferredPaymentAdded: cost,
        },
      }
    }

    const uniqueId = `${staff.id}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    const hireItem = {
      ...staff,
      hireType,
      agreedFee: cost,
      contractDaysLeft: hireType === 'daily' ? 1 : hireType === 'weekly' ? 7 : 30,
      awaitingPayment: false,
      hiredId: uniqueId,
    }

    set((current) => ({
      hiredStaff: [...current.hiredStaff, hireItem],
    }))

    get().recordGameEvent({
      type: 'success',
      title: 'Staff Hired',
      description: `${staff.name} hired on ${hireType} contract. Deferred payment ${cost}.`,
      meta: { staffId: staff.id, mode: hireType, deferredPayment: cost },
    })
    get().recordFinanceEntry({
      category: 'commitment',
      amount: -cost,
      note: `Deferred staff payment commitment: ${staff.name} (${hireType})`,
    })

    return { ok: true, result: { name: staff.name, mode: hireType, deferredPayment: cost, extended: false } }
  },

  rentStudio: (studioId, term) => {
    const state = get()
    const blocked = get().ensureGameActive()
    if (blocked) return blocked
    const studio = state.studioCatalog.find((item) => item.id === studioId)
    if (!studio) return { ok: false, error: 'Studio not found.' }

    const hasPurchasedStudio =
      state.activeStudio?.mode === 'owned' && state.activeStudio.id !== 'studio-own-house'
    if (studio.id === 'studio-own-house') {
      return { ok: false, error: 'Own House is already owned and does not require rent.' }
    }
    if (hasPurchasedStudio && state.activeStudio.id !== studio.id) {
      return { ok: false, error: 'Another studio is already owned. Other studio actions are disabled.' }
    }
    if (state.activeStudio?.mode === 'owned' && state.activeStudio.id === studio.id) {
      return { ok: false, error: 'This studio is already owned.' }
    }

    if (!['day', 'week', 'month'].includes(term)) {
      return { ok: false, error: 'Invalid rent term.' }
    }

    const cost = studio.rentFees[term]
    if (state.money < cost) return { ok: false, error: 'Not enough budget for studio rent.' }

    const termDays = term === 'day' ? 1 : term === 'week' ? 7 : 30

    set((current) => ({
      money: current.money - cost,
      activeStudio: {
        id: studio.id,
        name: studio.name,
        qualityBonus: studio.qualityBonus,
        mode: 'rent',
        term,
        daysLeft: termDays,
        imageUrl: studio.imageUrl,
      },
    }))

    get().recordGameEvent({
      type: 'info',
      title: 'Studio Rented',
      description: `${studio.name} rented for ${term}.`,
      meta: { studioId, term, cost },
    })
    get().recordFinanceEntry({
      category: 'studio',
      amount: -cost,
      note: `Studio rent: ${studio.name} (${term})`,
      balanceAfter: get().money,
    })

    return { ok: true, result: { studio: studio.name, term, cost } }
  },

  buyStudio: (studioId) => {
    const state = get()
    const blocked = get().ensureGameActive()
    if (blocked) return blocked
    const studio = state.studioCatalog.find((item) => item.id === studioId)
    if (!studio) return { ok: false, error: 'Studio not found.' }

    if (studio.id === 'studio-own-house') {
      return { ok: false, error: 'Own House is already pre-owned.' }
    }

    const hasPurchasedStudio =
      state.activeStudio?.mode === 'owned' && state.activeStudio.id !== 'studio-own-house'
    if (hasPurchasedStudio && state.activeStudio.id !== studio.id) {
      return { ok: false, error: 'Another studio is already owned. Other studio actions are disabled.' }
    }
    if (state.activeStudio?.mode === 'owned' && state.activeStudio.id === studio.id) {
      return { ok: false, error: 'This studio is already owned.' }
    }

    if (state.money < studio.buyPrice) {
      return { ok: false, error: 'Not enough budget to buy this studio.' }
    }

    set((current) => ({
      money: current.money - studio.buyPrice,
      companyReputation: clampCompanyMetric(current.companyReputation + 4),
      activeStudio: {
        id: studio.id,
        name: studio.name,
        qualityBonus: studio.qualityBonus,
        mode: 'owned',
        term: 'permanent',
        daysLeft: null,
        imageUrl: studio.imageUrl,
      },
    }))

    get().recordGameEvent({
      type: 'success',
      title: 'Studio Purchased',
      description: `${studio.name} purchased for ${studio.buyPrice}.`,
      meta: { studioId, cost: studio.buyPrice },
    })
    get().recordFinanceEntry({
      category: 'studio',
      amount: -studio.buyPrice,
      note: `Studio purchase: ${studio.name}`,
      balanceAfter: get().money,
    })

    return { ok: true, result: { studio: studio.name, cost: studio.buyPrice } }
  },

  buyEquipment: (equipmentId) => {
    const state = get()
    const blocked = get().ensureGameActive()
    if (blocked) return blocked
    const equipment = state.equipmentCatalog.find((item) => item.id === equipmentId)
    if (!equipment) return { ok: false, error: 'Equipment not found.' }

    if (state.ownedEquipmentIds.includes(equipmentId)) {
      return { ok: false, error: 'Equipment already owned.' }
    }

    if (state.money < equipment.price) {
      return { ok: false, error: 'Not enough budget to buy this equipment.' }
    }

    set((current) => ({
      money: current.money - equipment.price,
      ownedEquipmentIds: [...current.ownedEquipmentIds, equipmentId],
    }))

    get().recordGameEvent({
      type: 'info',
      title: 'Equipment Purchased',
      description: `${equipment.name} purchased for ${equipment.price}.`,
      meta: { equipmentId, cost: equipment.price },
    })
    get().recordFinanceEntry({
      category: 'equipment',
      amount: -equipment.price,
      note: `Equipment purchase: ${equipment.name}`,
      balanceAfter: get().money,
    })

    return { ok: true, result: { name: equipment.name, cost: equipment.price } }
  },

  sellEquipment: (equipmentId) => {
    const state = get()
    const blocked = get().ensureGameActive()
    if (blocked) return blocked
    const equipment = state.equipmentCatalog.find((item) => item.id === equipmentId)
    if (!equipment) return { ok: false, error: 'Equipment not found.' }

    if (!state.ownedEquipmentIds.includes(equipmentId)) {
      return { ok: false, error: 'This equipment is not owned.' }
    }

    const sellPrice = Math.round(equipment.price * 0.5)

    set((current) => ({
      money: current.money + sellPrice,
      ownedEquipmentIds: current.ownedEquipmentIds.filter((id) => id !== equipmentId),
    }))

    get().recordGameEvent({
      type: 'success',
      title: 'Equipment Sold',
      description: `${equipment.name} sold for ${sellPrice}.`,
      meta: { equipmentId, sellPrice },
    })
    get().recordFinanceEntry({
      category: 'equipment',
      amount: sellPrice,
      note: `Equipment sale: ${equipment.name}`,
      balanceAfter: get().money,
    })

    return { ok: true, result: { name: equipment.name, sellPrice } }
  },

  hireModel: (modelId) => {
    const state = get()
    const blocked = get().ensureGameActive()
    if (blocked) return blocked
    const model = state.modelPool.find((item) => item.id === modelId)
    if (!model) return { ok: false, error: 'Model not found.' }

    if (state.roster.some((item) => item.id === modelId)) {
      return { ok: false, error: 'Model already hired.' }
    }

    if (state.companyReputation < model.unlockReputation) {
      return {
        ok: false,
        error: `Requires reputation ${model.unlockReputation} to unlock this model.`,
      }
    }

    const hireType = 'month'
    const agreedFee = getModelContractFee(model, hireType)

    set((current) => ({
      roster: [
        ...current.roster,
        {
          ...model,
          hireType,
          contractDaysLeft: contractDaysByType[hireType],
          agreedFee,
          awaitingPayment: false,
        },
      ],
    }))

    get().recordGameEvent({
      type: 'success',
      title: 'Model Hired',
      description: `${model.name} joined on ${hireType} contract. Deferred payment ${agreedFee}.`,
      meta: { modelId, term: hireType, deferredPayment: agreedFee },
    })
    get().recordFinanceEntry({
      category: 'commitment',
      amount: -agreedFee,
      note: `Deferred model payment commitment: ${model.name} (${hireType})`,
    })

    return { ok: true, result: { model: model.name, mode: hireType, deferredPayment: agreedFee } }
  },

  previewProduction: (payload) => {
    const state = get()

    if (!state.activeStudio) return { ok: false, error: 'Rent or buy a studio first.' }

    const selectedModels = state.roster.filter((item) => payload.modelIds?.includes(item.id))
    if (selectedModels.length < 1 || selectedModels.length > 8) {
      return { ok: false, error: 'Select between 1 and 8 models.' }
    }

    const modelWithExpiredContract = selectedModels.find(
      (item) =>
        item.awaitingPayment === true ||
        (typeof item.contractDaysLeft === 'number' && item.contractDaysLeft <= 0),
    )
    if (modelWithExpiredContract) {
      return {
        ok: false,
        error: `${modelWithExpiredContract.name} contract ended. Renew contract before assigning to project.`,
      }
    }

    const work = state.workTypes[payload.shootType]
    if (!work) return { ok: false, error: 'Select a valid shoot type.' }

    const projectActionPointCost = PROJECT_ACTION_POINT_COST_BY_SHOOT_TYPE[payload.shootType] || 0
    if (state.actionPoints < projectActionPointCost) {
      return {
        ok: false,
        error: `Not enough action points. Requires ${projectActionPointCost} AP, you have ${state.actionPoints}.`,
      }
    }

    const staffResult = buildStaffSelection(state, payload.staffByCategory)
    if (staffResult.error) return { ok: false, error: staffResult.error }

    const lowStaminaModels = selectedModels
      .filter((item) => (item.stamina ?? 0) < work.staminaCost)
      .map((item) => `${item.name} (${item.stamina ?? 0}/${work.staminaCost})`)

    const lowStaminaStaff = [...new Map(
      staffResult.selected.map((item) => [item.personKey, item]),
    ).values()]
      .filter((item) => (item.stamina ?? 0) < work.staminaCost)
      .map((item) => `${item.name} (${item.stamina ?? 0}/${work.staminaCost})`)

    if (lowStaminaModels.length > 0 || lowStaminaStaff.length > 0) {
      const parts = []
      if (lowStaminaModels.length > 0) parts.push(`Models: ${lowStaminaModels.join(', ')}`)
      if (lowStaminaStaff.length > 0) parts.push(`Staff: ${lowStaminaStaff.join(', ')}`)

      return {
        ok: false,
        error: `Not enough stamina for ${work.label}. ${parts.join(' | ')}`,
      }
    }

    const titleResult = resolveShootTitle(
      state.shootingHistory,
      payload.nameMode,
      payload.customTitle || '',
      payload.previousTitle || '',
    )
    if (titleResult.error) return { ok: false, error: titleResult.error }

    if (!payload.description?.trim()) {
      return { ok: false, error: 'Description is required.' }
    }

    const allowedLocationIds = getAllowedShootLocationIds(state)
    const location = state.shootLocations.find((item) => item.id === payload.locationId)
    if (!location) return { ok: false, error: 'Select a shoot location.' }
    if (!allowedLocationIds.includes(location.id)) {
      return { ok: false, error: 'Selected location is not available. Rent or buy that studio first.' }
    }

    const service = state.serviceLevels[payload.serviceLevel]
    if (!service) return { ok: false, error: 'Select staff service level.' }

    const dress = state.dressPartners.find((item) => item.id === payload.dressPartnerId)
    if (!dress) return { ok: false, error: 'Select a dress partner.' }

    if (state.popularity < dress.requiredPopularity) {
      return { ok: false, error: `Dress partner requires popularity ${dress.requiredPopularity}.` }
    }

    const selectedEquipment = state.equipmentCatalog.filter((item) =>
      payload.equipmentIds?.includes(item.id),
    )

    if (selectedEquipment.length === 0) {
      return { ok: false, error: 'Select equipment for production.' }
    }

    const hasCamera = selectedEquipment.some((item) => item.category === 'camera')
    if (!hasCamera) {
      return { ok: false, error: 'Camera is required. Select at least one camera equipment.' }
    }

    const hasUnownedEquipment = selectedEquipment.some(
      (item) => !state.ownedEquipmentIds.includes(item.id),
    )
    if (hasUnownedEquipment) {
      return { ok: false, error: 'Some selected equipment is not owned yet.' }
    }

    const rawOutcome = calculateProductionOutcome({
      state,
      selectedModels,
      selectedStaff: staffResult.selected,
      shootTypeKey: payload.shootType,
      shootName: titleResult.baseTitle,
      location,
      service,
      dress,
      selectedEquipment,
    })

    const modifier = buildProfitabilityModifier({ state, payload, titleResult })
    const outcome = applyProfitabilityModifierToOutcome(rawOutcome, modifier.totalPercent)

    if (payload.gigId) {
      const selectedGig = state.activeGigContracts.find((gig) => gig.id === payload.gigId)
      if (!selectedGig) {
        return { ok: false, error: 'Selected freelance contract is no longer active.' }
      }

      if (selectedGig.requirements.shootType !== payload.shootType) {
        return {
          ok: false,
          error: `Freelance contract requires ${state.workTypes[selectedGig.requirements.shootType].label}.`,
        }
      }

      if (selectedModels.length < selectedGig.requirements.minModels) {
        return {
          ok: false,
          error: `Freelance contract requires at least ${selectedGig.requirements.minModels} models.`,
        }
      }

      if (
        selectedGig.requirements.castType !== 'any' &&
        deriveCastTypeFromModels(selectedModels) !== selectedGig.requirements.castType
      ) {
        return {
          ok: false,
          error: `Freelance contract requires cast type: ${selectedGig.requirements.castType}.`,
        }
      }

      if (outcome.grade < selectedGig.requirements.minGrade) {
        return {
          ok: false,
          error: `Estimated grade ${outcome.grade} is below required ${selectedGig.requirements.minGrade}.`,
        }
      }
    }

    if (state.money + outcome.netProfit < 0) {
      return { ok: false, error: 'Budget is too low for this shoot setup.' }
    }

    const selectedGig = payload.gigId
      ? state.activeGigContracts.find((gig) => gig.id === payload.gigId)
      : null
    const freelancePayout = selectedGig ? selectedGig.agreedPayment : 0

    return {
      ok: true,
      result: {
        title: titleResult.finalTitle,
        baseTitle: titleResult.baseTitle,
        estimatedGrade: outcome.grade,
        grossRevenue: outcome.grossRevenue,
        operatingCost: outcome.operatingCost,
        estimatedProfit: outcome.netProfit,
        freelancePayout,
        estimatedTotalProfit: outcome.netProfit + freelancePayout,
        actionPointCost: projectActionPointCost,
        profitabilityModifierPercent: outcome.profitabilityModifierPercent,
        keywordBonusPercent: modifier.keywordBonusPercent,
        fameBonusPercent: modifier.fameBonusPercent,
        previousTitleAvgGrade: modifier.previousTitleAvgGrade,
      },
    }
  },

  startProduction: (payload) => {
    const state = get()
    const blocked = get().ensureGameActive()
    if (blocked) return blocked
    const preview = get().previewProduction(payload)
    if (!preview.ok) return preview
    const projectActionPointCost = PROJECT_ACTION_POINT_COST_BY_SHOOT_TYPE[payload.shootType] || 0

    const selectedModels = state.roster.filter((item) => payload.modelIds.includes(item.id))
    const staffResult = buildStaffSelection(state, payload.staffByCategory)
    const titleResult = resolveShootTitle(
      state.shootingHistory,
      payload.nameMode,
      payload.customTitle || '',
      payload.previousTitle || '',
    )
    const location = state.shootLocations.find((item) => item.id === payload.locationId)
    const service = state.serviceLevels[payload.serviceLevel]
    const dress = state.dressPartners.find((item) => item.id === payload.dressPartnerId)
    const selectedEquipment = state.equipmentCatalog.filter((item) =>
      payload.equipmentIds?.includes(item.id),
    )

    const rawOutcome = calculateProductionOutcome({
      state,
      selectedModels,
      selectedStaff: staffResult.selected,
      shootTypeKey: payload.shootType,
      shootName: titleResult.baseTitle,
      location,
      service,
      dress,
      selectedEquipment,
    })
    const modifier = buildProfitabilityModifier({ state, payload, titleResult })
    const outcome = applyProfitabilityModifierToOutcome(rawOutcome, modifier.totalPercent)

    const selectedGig = payload.gigId
      ? state.activeGigContracts.find((gig) => gig.id === payload.gigId)
      : null
    const freelancePayout = selectedGig ? selectedGig.agreedPayment : 0

    const perModelPay = Math.round(outcome.modelPayoutTotal / selectedModels.length)
    const modelStaminaBoost = service?.modelStaminaBoost || 0
    const modelHapinessBoost = service?.modelHapinessBoost || 0
    const staffStaminaBoost = service?.staffStaminaBoost || 0
    const staffHapinessBoost = service?.staffHapinessBoost || 0
    const selectedHiredStaffIds = new Set(
      staffResult.selected
        .filter((entry) => entry.source === 'staff' && entry.hiredId)
        .map((entry) => entry.hiredId),
    )
    const ownerParticipated = staffResult.selected.some((entry) => entry.source === 'owner')
    const shootTypeKey = payload.shootType
    const inventory = state.workInventory[shootTypeKey]
    const nextProduced = inventory.produced + 1
    const nextAvgGrade =
      Math.round((inventory.avgGrade * inventory.produced + outcome.grade) / nextProduced) ||
      outcome.grade

    const inventoryItem = {
      id: `inv-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      day: state.day,
      producedAt: new Date().toISOString(),
      producedAtTs: Date.now(),
      title: titleResult.finalTitle,
      baseTitle: titleResult.baseTitle,
      description: payload.description.trim(),
      shootTypeKey,
      shootType: outcome.shootType.label,
      models: selectedModels.map((item) => ({ id: item.id, name: item.name, imageUrl: item.imageUrl })),
      staff: staffResult.selected,
      location,
      serviceLevel: payload.serviceLevel,
      service,
      dressPartner: dress,
      equipment: selectedEquipment,
      grade: outcome.grade,
      grossRevenue: outcome.grossRevenue,
      modelPayoutTotal: outcome.modelPayoutTotal,
      operatingCost: outcome.operatingCost,
      netProfit: outcome.netProfit,
      sold: false,
      freelanceGig: selectedGig
        ? {
            id: selectedGig.id,
            title: selectedGig.title,
            companyId: selectedGig.companyId,
            companyName: selectedGig.companyName,
            payout: selectedGig.agreedPayment,
            contractOffer: selectedGig.agreedPayment,
            requiredGrade: selectedGig.requirements.minGrade,
          }
        : null,
    }

    inventoryItem.saleOffers = createInventorySaleOffers({
      grossRevenue: inventoryItem.grossRevenue,
      companies: state.companies,
      freelanceGig: inventoryItem.freelanceGig,
    })

    set((current) => ({
      actionPoints: Math.max(0, current.actionPoints - projectActionPointCost),
      ownerStamina: ownerParticipated
        ? clamp((current.ownerStamina ?? 100) - outcome.shootType.staminaCost)
        : current.ownerStamina,
      money: current.money + outcome.netProfit + freelancePayout,
      popularity: clampCompanyMetric(current.popularity + (outcome.grade >= 70 ? 3 : 1) + (selectedGig ? 1 : 0)),
      companyReputation: clampCompanyMetric(
        current.companyReputation + (outcome.grade >= 75 ? 2 : outcome.grade >= 55 ? 1 : 0) + (selectedGig ? 1 : 0),
      ),
      roster: current.roster.map((item) => {
        if (!payload.modelIds.includes(item.id)) return item

        const updated = {
          ...item,
          stamina: clamp(item.stamina - outcome.shootType.staminaCost + modelStaminaBoost),
          fitness: clamp(item.fitness - 1),
          hapiness: clamp(item.hapiness - 1 + modelHapinessBoost),
          money: item.money + perModelPay,
          popularity: clamp(item.popularity + (outcome.grade >= 70 ? 2 : 1)),
        }

        if (shootTypeKey === 'basic') updated.totalBasicShoot += 1
        if (shootTypeKey === 'body') updated.totalBodyShoot += 1
        if (shootTypeKey === 'movie') updated.totalMovie += 1
        if (shootTypeKey === 'ad') updated.totalAdShoot += 1
        if (shootTypeKey === 'special') updated.totalSpecialVideo += 1

        return updated
      }),
      hiredStaff: current.hiredStaff.map((staff) => {
        if (!selectedHiredStaffIds.has(staff.hiredId)) return staff

        return {
          ...staff,
          stamina: clamp((staff.stamina ?? 100) - outcome.shootType.staminaCost + staffStaminaBoost),
          hapiness: clamp((staff.hapiness ?? 70) + staffHapinessBoost),
        }
      }),
      workInventory: {
        ...current.workInventory,
        [shootTypeKey]: {
          produced: nextProduced,
          unsold: inventory.unsold + 1,
          avgGrade: nextAvgGrade,
        },
      },
      inventoryItems: [inventoryItem, ...current.inventoryItems],
      shootingHistory: [
        {
          id: inventoryItem.id,
          baseTitle: titleResult.baseTitle,
          title: titleResult.finalTitle,
          shootTypeKey,
          day: current.day,
          grade: outcome.grade,
        },
        ...current.shootingHistory,
      ],
      activeGigContracts: selectedGig
        ? current.activeGigContracts.filter((gig) => gig.id !== selectedGig.id)
        : current.activeGigContracts,
      completedGigContracts: selectedGig
        ? [
            {
              id: `${selectedGig.id}-done-${current.day}`,
              gigId: selectedGig.id,
              title: selectedGig.title,
              companyId: selectedGig.companyId,
              companyName: selectedGig.companyName,
              completedDay: current.day,
              payout: selectedGig.agreedPayment,
            },
            ...current.completedGigContracts,
          ]
        : current.completedGigContracts,
      companies: selectedGig
        ? current.companies.map((company) =>
            company.id === selectedGig.companyId
              ? { ...company, relation: clamp(company.relation + 6, -100, 100) }
              : company,
          )
        : current.companies,
    }))

    const totalPayout = outcome.netProfit + freelancePayout
    get().recordGameEvent({
      type: 'success',
      title: 'Production Completed',
      description: `${inventoryItem.title} finished with grade ${outcome.grade}. Total profit ${totalPayout}.`,
      meta: {
        shootType: shootTypeKey,
        grade: outcome.grade,
        netProfit: outcome.netProfit,
        freelancePayout,
        totalPayout,
      },
    })
    get().recordFinanceEntry({
      category: 'production',
      amount: totalPayout,
      note: `Production result: ${inventoryItem.title}`,
      balanceAfter: get().money,
    })

    const loss = get().checkAndApplyLoseCondition()
    if (loss) return toLoseResult(loss)

    return { ok: true, result: inventoryItem }
  },

  setInventoryItemCover: ({ itemId, coverImageUrl, coverMimeType = 'image/png', source = 'gemini' }) => {
    const state = get()
    const itemExists = state.inventoryItems.some((item) => item.id === itemId)
    if (!itemExists) return { ok: false, error: 'Inventory item not found.' }

    if (!coverImageUrl) {
      return { ok: false, error: 'Cover image data is required.' }
    }

    const generatedAt = new Date().toISOString()

    set((current) => ({
      inventoryItems: current.inventoryItems.map((item) =>
        item.id === itemId
          ? {
              ...item,
              coverImageUrl,
              coverMimeType,
              coverSource: source,
              coverGeneratedAt: generatedAt,
            }
          : item,
      ),
    }))

    return { ok: true, result: { itemId, coverGeneratedAt: generatedAt } }
  },

  produceWork: (modelId, workType, equipmentIds) => {
    const state = get()
    const defaultLocationId = state.activeStudio?.id ? `location-${state.activeStudio.id}` : ''
    const selectedCategoryChoice = Object.fromEntries(
      state.staffCategories.map((category) => {
        const hired = state.hiredStaff.find((item) => item.category === category)
        return [category, hired ? hired.hiredId : 'owner']
      }),
    )
    const fallbackCameraEquipmentIds = state.ownedEquipmentIds.filter((equipmentId) => {
      const item = state.equipmentCatalog.find((entry) => entry.id === equipmentId)
      return item?.category === 'camera'
    })
    const selectedEquipmentIds = Array.isArray(equipmentIds) && equipmentIds.length > 0
      ? equipmentIds
      : fallbackCameraEquipmentIds

    return get().startProduction({
      modelIds: [modelId],
      staffByCategory: selectedCategoryChoice,
      shootType: workType,
      nameMode: 'new',
      customTitle: state.workTypes[workType]?.label || 'Untitled Shoot',
      previousTitle: '',
      description: 'Single-model quick production.',
      locationId: defaultLocationId,
      serviceLevel: 'none',
      dressPartnerId: state.dressPartners[0].id,
      equipmentIds: selectedEquipmentIds,
    })
  },

  sellInventory: (workType, channelKey) => {
    const state = get()
    const blocked = get().ensureGameActive()
    if (blocked) return blocked
    const inventory = state.workInventory[workType]
    const channel = state.salesChannels[channelKey]

    if (!inventory || !channel) return { ok: false, error: 'Invalid inventory or channel.' }
    if (inventory.unsold <= 0) return { ok: false, error: 'No inventory to sell.' }

    const unsoldItems = state.inventoryItems.filter(
      (item) => item.shootTypeKey === workType && !item.sold,
    )
    const castBoostByModelId = unsoldItems.reduce((acc, item) => {
      item.models?.forEach((model) => {
        acc[model.id] = (acc[model.id] || 0) + 1
      })
      return acc
    }, {})

    const unitPrice = Math.round(550 * channel.multiplier * (1 + inventory.avgGrade / 100))
    const total = unitPrice * inventory.unsold

    set((current) => ({
      money: current.money + total,
      roster: current.roster.map((model) => {
        const boost = castBoostByModelId[model.id] || 0
        if (!boost) return model
        return {
          ...model,
          popularity: clamp(model.popularity + boost),
          hapiness: clamp(model.hapiness + boost),
        }
      }),
      workInventory: {
        ...current.workInventory,
        [workType]: {
          ...current.workInventory[workType],
          unsold: 0,
        },
      },
      inventoryItems: current.inventoryItems.map((item) => {
        if (item.shootTypeKey !== workType || item.sold) return item
        return {
          ...item,
          sold: true,
          soldChannel: channel.label,
          soldDay: current.day,
        }
      }),
    }))

    get().recordGameEvent({
      type: 'success',
      title: 'Inventory Sold (Bulk)',
      description: `${state.workTypes[workType].label} inventory sold via ${channel.label} for ${total}.`,
      meta: { workType, channel: channelKey, total, units: inventory.unsold },
    })
    get().recordFinanceEntry({
      category: 'sales',
      amount: total,
      note: `Bulk inventory sale (${state.workTypes[workType].label}) via ${channel.label}`,
      balanceAfter: get().money,
    })

    return {
      ok: true,
      result: {
        workType: state.workTypes[workType].label,
        channel: channel.label,
        total,
      },
    }
  },

  sellInventoryItem: (itemId, channelKey, options = {}) => {
    const state = get()
    const blocked = get().ensureGameActive()
    if (blocked) return blocked
    const item = state.inventoryItems.find((entry) => entry.id === itemId)
    const channel = ['company', 'individual', 'sponsor', 'website'].includes(channelKey) ? channelKey : null

    if (!item) return { ok: false, error: 'Inventory item not found.' }
    if (!channel) return { ok: false, error: 'Invalid sales channel.' }
    if (item.sold) return { ok: false, error: 'This item is already sold.' }
    if (channel !== 'website' && item.uploadedWebsiteId) {
      return { ok: false, error: 'This item is currently posted on a website. Put it down first.' }
    }

    if (channel === 'website') {
      const websiteId = options.websiteId
      const website = state.websites.find((entry) => entry.id === websiteId)
      if (!website) {
        return { ok: false, error: 'Select a valid website to upload.' }
      }
      if (item.uploadedWebsiteId) {
        return { ok: false, error: 'This item is already posted on a website.' }
      }

      set((current) => ({
        roster: current.roster.map((model) => {
          const wasInCast = item.models?.some((castMember) => castMember.id === model.id)
          if (!wasInCast) return model
          return {
            ...model,
            popularity: clamp(model.popularity + 1),
            hapiness: clamp(model.hapiness + 1),
          }
        }),
        inventoryItems: current.inventoryItems.map((entry) => {
          if (entry.id !== itemId) return entry
          return {
            ...entry,
            uploadedWebsiteId: website.id,
            uploadedWebsiteName: website.name,
            websiteViews: entry.websiteViews || 0,
            websiteIncome: roundTo2(entry.websiteIncome || 0),
            websiteTodayViews: 0,
            websiteTodayIncome: 0,
          }
        }),
        websites: current.websites.map((entry) =>
          entry.id === website.id
            ? {
                ...entry,
                videosUploaded: (entry.videosUploaded || 0) + 1,
              }
            : entry,
        ),
      }))

      get().recordGameEvent({
        type: 'info',
        title: 'Posted Website Banner',
        description: `${item.title} posted on ${website.name}. Daily viewers and income start from next day.`,
        meta: { itemId, websiteId: website.id, websiteName: website.name },
      })

      return {
        ok: true,
        result: {
          title: item.title,
          channel: `Website: ${website.name}`,
          offer: 0,
          tip: 0,
          total: 0,
          views: item.websiteViews || 0,
        },
      }
    }

    const offers = item.saleOffers || {}
    const selectedOffer = offers[channel]
    if (!selectedOffer) {
      return { ok: false, error: `No ${channel} offer available for this item.` }
    }

    if (channel === 'sponsor' && !item.freelanceGig) {
      return {
        ok: false,
        error: 'Sponsor sale is only available for videos created under sponsor contract.',
      }
    }

    let tip = 0
    if (channel === 'sponsor' && item.freelanceGig) {
      const requiredGrade = item.freelanceGig.requiredGrade ?? 0
      if (item.grade > requiredGrade) {
        const gradeDelta = item.grade - requiredGrade
        const tipRate = Math.min(0.25, 0.05 + gradeDelta * 0.01)
        tip = Math.round(selectedOffer.offer * tipRate)
      }
    }

    const total = Math.round(selectedOffer.offer + tip)
    const castBoost = channel === 'sponsor' ? 2 : 1

    const soldChannelLabel =
      channel === 'company'
        ? `Company: ${selectedOffer.name}`
        : channel === 'individual'
          ? `Individual: ${selectedOffer.name}`
          : `Sponsor: ${selectedOffer.name}`

    set((current) => ({
      money: current.money + total,
      roster: current.roster.map((model) => {
        const wasInCast = item.models?.some((castMember) => castMember.id === model.id)
        if (!wasInCast) return model
        return {
          ...model,
          popularity: clamp(model.popularity + castBoost),
          hapiness: clamp(model.hapiness + castBoost),
        }
      }),
      workInventory: {
        ...current.workInventory,
        [item.shootTypeKey]: {
          ...current.workInventory[item.shootTypeKey],
          unsold: Math.max(0, current.workInventory[item.shootTypeKey].unsold - 1),
        },
      },
      inventoryItems: current.inventoryItems.map((entry) => {
        if (entry.id !== itemId) return entry
        return {
          ...entry,
          sold: true,
          soldChannel: soldChannelLabel,
          soldDay: current.day,
          soldAmount: total,
          sponsorTip: tip,
        }
      }),
      companies:
        channel === 'sponsor' && tip > 0 && item.freelanceGig
          ? current.companies.map((company) =>
              company.id === item.freelanceGig.companyId
                ? { ...company, relation: clamp(company.relation + 3, -100, 100) }
                : company,
            )
          : current.companies,
    }))

    get().recordGameEvent({
      type: 'success',
      title: 'Inventory Item Sold',
      description: `${item.title} sold via ${soldChannelLabel} for ${total}.`,
      meta: { itemId, channel, total, tip },
    })
    get().recordFinanceEntry({
      category: 'sales',
      amount: total,
      note: `Inventory sale: ${item.title} via ${soldChannelLabel}`,
      balanceAfter: get().money,
    })

    return {
      ok: true,
      result: {
        title: item.title,
        channel: soldChannelLabel,
        offer: selectedOffer.offer,
        tip,
        total,
      },
    }
  },

  removeInventoryFromWebsite: ({ itemId }) => {
    const state = get()
    const blocked = get().ensureGameActive()
    if (blocked) return blocked
    const item = state.inventoryItems.find((entry) => entry.id === itemId)
    if (!item) return { ok: false, error: 'Inventory item not found.' }
    if (!item.uploadedWebsiteId) return { ok: false, error: 'This item is not posted on a website.' }

    set((current) => ({
      websites: current.websites.map((entry) =>
        entry.id === item.uploadedWebsiteId
          ? {
              ...entry,
              videosUploaded: Math.max(0, (entry.videosUploaded || 0) - 1),
            }
          : entry,
      ),
      inventoryItems: current.inventoryItems.map((entry) => {
        if (entry.id !== itemId) return entry
        return {
          ...entry,
          uploadedWebsiteId: null,
          uploadedWebsiteName: null,
          websiteTodayViews: 0,
          websiteTodayIncome: 0,
        }
      }),
    }))

    get().recordGameEvent({
      type: 'info',
      title: 'Website Banner Put Down',
      description: `${item.title} removed from website posting.`,
      meta: { itemId, previousWebsiteId: item.uploadedWebsiteId },
    })

    return { ok: true, result: { itemId, title: item.title } }
  },

  withdrawWebsiteIncome: ({ websiteId }) => {
    const state = get()
    const blocked = get().ensureGameActive()
    if (blocked) return blocked
    const website = state.websites.find((entry) => entry.id === websiteId)
    if (!website) return { ok: false, error: 'Website not found.' }

    const withdrawAmount = roundTo2(website.withdrawableIncome || 0)
    if (withdrawAmount <= 0) {
      return { ok: false, error: 'No withdrawable website income available.' }
    }

    set((current) => ({
      money: current.money + withdrawAmount,
      websites: current.websites.map((entry) =>
        entry.id === websiteId
          ? {
              ...entry,
              withdrawableIncome: 0,
              totalWithdrawnIncome: roundTo2((entry.totalWithdrawnIncome || 0) + withdrawAmount),
            }
          : entry,
      ),
    }))

    get().recordGameEvent({
      type: 'success',
      title: 'Website Income Withdrawn',
      description: `${website.name} income withdrawn: ${withdrawAmount}.`,
      meta: { websiteId, withdrawAmount },
    })
    get().recordFinanceEntry({
      category: 'website',
      amount: withdrawAmount,
      note: `Website income withdrawn: ${website.name}`,
      balanceAfter: get().money,
    })

    return { ok: true, result: { websiteId, withdrawAmount } }
  },

  createWebsite: (websiteName, extension, logoValue) => {
    const state = get()
    const blocked = get().ensureGameActive()
    if (blocked) return blocked
    const name = (websiteName || '').trim().toLowerCase()
    const ext = (extension || '').trim().toLowerCase()
    const logo = (logoValue || '').trim()

    if (state.websites.length >= 5) {
      return { ok: false, error: 'Maximum 5 websites allowed.' }
    }

    if (!name) {
      return { ok: false, error: 'Website name is required.' }
    }

    if (!ext || !allowedWebsiteExtensions.includes(ext)) {
      return { ok: false, error: 'Select a valid website extension.' }
    }

    if (!websiteNameRegex.test(name)) {
      return {
        ok: false,
        error: 'Invalid website name. Use 3-24 chars with letters, numbers, and hyphens only.',
      }
    }

    const fullName = `${name}${ext}`

    const duplicate = state.websites.some(
      (entry) => (entry.domain || entry.name).toLowerCase() === fullName.toLowerCase(),
    )
    if (duplicate) {
      return { ok: false, error: 'Website name already exists. Use a unique name.' }
    }

    if (!logo) {
      return { ok: false, error: 'Logo image is required.' }
    }

    if (state.actionPoints < WEBSITE_ACTION_POINT_COST) {
      return {
        ok: false,
        error: `Not enough action points. Requires ${WEBSITE_ACTION_POINT_COST} AP, you have ${state.actionPoints}.`,
      }
    }

    const website = {
      id: `site-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: fullName,
      baseName: name,
      extension: ext,
      domain: fullName,
      logo,
      createdDay: state.day,
      videosUploaded: 0,
      totalViews: 0,
      popularity: 0,
      todayViews: 0,
      todayIncome: 0,
      totalIncomeEarned: 0,
      withdrawableIncome: 0,
      totalWithdrawnIncome: 0,
    }

    set((current) => ({
      actionPoints: Math.max(0, current.actionPoints - WEBSITE_ACTION_POINT_COST),
      websites: [...current.websites, website],
    }))

    get().recordGameEvent({
      type: 'success',
      title: 'Website Created',
      description: `${website.name} created.`,
      meta: { websiteId: website.id, domain: website.domain },
    })

    return { ok: true, result: website }
  },

  placeFreelanceBid: (gigId, bidAmount) => {
    const state = get()
    const blocked = get().ensureGameActive()
    if (blocked) return blocked
    const gig = state.dailyFreelanceGigs.find((entry) => entry.id === gigId)

    if (!gig) return { ok: false, error: 'Gig not found or already closed.' }
    if (state.popularity < gig.minimumPopularity) {
      return {
        ok: false,
        error: `This company requires popularity ${gig.minimumPopularity}.`,
      }
    }

    const bid = Number(bidAmount)
    if (!Number.isFinite(bid) || bid <= 0) {
      return { ok: false, error: 'Enter a valid bid amount.' }
    }

    const company = state.companies.find((entry) => entry.id === gig.companyId)
    const relation = company?.relation ?? 0
    const budget = gig.suggestedBudget
    const rejectFactor = getRejectFactorByRelation(relation)
    const rejectThreshold = budget * rejectFactor

    if (bid > rejectThreshold) {
      return {
        ok: true,
        result: {
          won: false,
          winChance: 0,
          title: gig.title,
          company: gig.companyName,
          payment: 0,
          reason: `Bid rejected: exceeds limit ${Math.round(rejectThreshold)} for current relation.`,
        },
      }
    }

    let winChance = 0

    if (bid > budget && bid < rejectThreshold) {
      winChance = relation < 50 ? 25 : 50
    } else {
      if (relation < 50) {
        const discountPercent = budget > 0 ? Math.max(0, ((budget - bid) / budget) * 100) : 0
        const bonusChance = discountPercent * 2
        winChance = clamp(Math.round(50 + bonusChance), 0, 100)
      } else {
        winChance = 100
      }
    }

    const won = Math.random() * 100 <= winChance

    const activeContract = won
      ? {
          id: `contract-${gig.id}`,
          gigId: gig.id,
          title: gig.title,
          companyId: gig.companyId,
          companyName: gig.companyName,
          companySector: gig.companySector,
          requirements: gig.requirements,
          agreedPayment: Math.round(bid),
          acceptedDay: state.day,
          expiresOnDay: state.day + gig.deadlineDays,
        }
      : null

    set((current) => ({
      dailyFreelanceGigs: current.dailyFreelanceGigs.filter((entry) => entry.id !== gigId),
      activeGigContracts: won
        ? [activeContract, ...current.activeGigContracts].slice(0, 12)
        : current.activeGigContracts,
      companies: current.companies.map((entry) => {
        if (entry.id !== gig.companyId) return entry
        return {
          ...entry,
          relation: clamp(entry.relation + (won ? 2 : -1), -100, 100),
        }
      }),
    }))

    get().recordGameEvent({
      type: won ? 'success' : 'error',
      title: won ? 'Freelance Bid Won' : 'Freelance Bid Lost',
      description: `${gig.title} · ${gig.companyName} · Bid ${Math.round(bid)} · Win chance ${winChance}%.`,
      meta: {
        gigId,
        companyId: gig.companyId,
        bid: Math.round(bid),
        winChance,
        won,
        payment: won ? Math.round(bid) : 0,
      },
    })

    return {
      ok: true,
      result: {
        won,
        winChance,
        title: gig.title,
        company: gig.companyName,
        payment: won ? Math.round(bid) : 0,
      },
    }
  },

  endDay: () => {
    const state = get()
    const blocked = get().ensureGameActive()
    if (blocked) return blocked

    set((current) => {
      const nextDay = current.day + 1
      const generatedPayments = []
      const updatedStaff = current.hiredStaff.map((item) => {
        if (item.awaitingPayment) return item

        const nextDaysLeft = Math.max(0, (item.contractDaysLeft ?? 0) - 1)
        if (nextDaysLeft > 0) {
          return {
            ...item,
            contractDaysLeft: nextDaysLeft,
          }
        }

        const paymentId = `pay-staff-${item.hiredId}-${nextDay}`
        generatedPayments.push({
          id: paymentId,
          targetType: 'staff',
          targetId: item.hiredId,
          targetName: item.name,
          source: 'contract-end',
          amount: item.agreedFee || 0,
          dueDay: nextDay,
          status: 'pending',
          createdDay: current.day,
          delayCount: 0,
        })

        return {
          ...item,
          contractDaysLeft: 0,
          awaitingPayment: true,
        }
      })

      const updatedRoster = current.roster.map((model) => {
        const hasContractCounter = typeof model.contractDaysLeft === 'number'
        if (!hasContractCounter || model.awaitingPayment) return model

        const nextDaysLeft = Math.max(0, (model.contractDaysLeft ?? 0) - 1)
        if (nextDaysLeft > 0) {
          return {
            ...model,
            contractDaysLeft: nextDaysLeft,
          }
        }

        const paymentId = `pay-model-${model.id}-${nextDay}`
        generatedPayments.push({
          id: paymentId,
          targetType: 'model',
          targetId: model.id,
          targetName: model.name,
          source: 'contract-end',
          amount: model.agreedFee || getModelContractFee(model, model.hireType || 'month'),
          dueDay: nextDay,
          status: 'pending',
          createdDay: current.day,
          delayCount: 0,
        })

        return {
          ...model,
          contractDaysLeft: 0,
          awaitingPayment: true,
        }
      })

      const updatedStudio = current.activeStudio
        ? current.activeStudio.mode === 'rent'
          ? {
              ...current.activeStudio,
              daysLeft: Math.max(0, (current.activeStudio.daysLeft ?? 0) - 1),
            }
          : current.activeStudio
        : null

      const expiredContracts = current.activeGigContracts.filter((contract) => contract.expiresOnDay < nextDay)
      const activeContracts = current.activeGigContracts.filter((contract) => contract.expiresOnDay >= nextDay)

      let companies = current.companies
      if (expiredContracts.length > 0) {
        companies = companies.map((company) => {
          const expiredCount = expiredContracts.filter((contract) => contract.companyId === company.id).length
          if (!expiredCount) return company
          return {
            ...company,
            relation: clamp(company.relation - expiredCount * 2, -100, 100),
          }
        })
      }

      const nextDailyGigs = createDailyFreelanceGigs({
        companies,
        popularity: current.popularity,
        reputation: current.companyReputation,
        day: nextDay,
      })

      const postedItemsByWebsite = current.inventoryItems.reduce((acc, entry) => {
        if (!entry.uploadedWebsiteId) return acc
        if (!acc[entry.uploadedWebsiteId]) acc[entry.uploadedWebsiteId] = []
        acc[entry.uploadedWebsiteId].push(entry)
        return acc
      }, {})

      const websiteDailyByItemId = {}
      const updatedWebsites = current.websites.map((website) => {
        const postedItems = postedItemsByWebsite[website.id] || []
        const calculatedPopularity = clamp(
          Math.round((website.popularity || 0) * 0.55 + (current.popularity || 0) * 0.45),
        )

        let todayViews = 0
        let todayIncome = 0
        for (const postedItem of postedItems) {
          const randomDaily = Math.floor(Math.random() * 500) + 1
          const viewers = Math.floor((postedItem.grade || 0) * 3 + calculatedPopularity * 15 + randomDaily)
          const income = roundTo2(viewers / 75)

          todayViews += viewers
          todayIncome = roundTo2(todayIncome + income)
          websiteDailyByItemId[postedItem.id] = { viewers, income }
        }

        return {
          ...website,
          popularity: calculatedPopularity,
          videosUploaded: postedItems.length,
          todayViews,
          todayIncome,
          totalViews: (website.totalViews || 0) + todayViews,
          totalIncomeEarned: roundTo2((website.totalIncomeEarned || 0) + todayIncome),
          withdrawableIncome: roundTo2((website.withdrawableIncome || 0) + todayIncome),
        }
      })

      const updatedInventoryItems = current.inventoryItems.map((entry) => {
        const websiteDaily = websiteDailyByItemId[entry.id]
        if (!websiteDaily) {
          if (!entry.uploadedWebsiteId) return entry
          return {
            ...entry,
            websiteTodayViews: 0,
            websiteTodayIncome: 0,
          }
        }

        return {
          ...entry,
          websiteViews: (entry.websiteViews || 0) + websiteDaily.viewers,
          websiteIncome: roundTo2((entry.websiteIncome || 0) + websiteDaily.income),
          websiteTodayViews: websiteDaily.viewers,
          websiteTodayIncome: websiteDaily.income,
        }
      })

      return {
        day: nextDay,
        activeStudio:
          updatedStudio && updatedStudio.mode === 'rent' && updatedStudio.daysLeft === 0
            ? null
            : updatedStudio,
        companies,
        activeGigContracts: activeContracts,
        dailyFreelanceGigs: nextDailyGigs,
        websites: updatedWebsites,
        inventoryItems: updatedInventoryItems,
        paymentsToMake: [...generatedPayments, ...current.paymentsToMake],
        actionPoints: current.maxActionPoints,
        negativeMoneyDays: current.money < 0 ? (current.negativeMoneyDays || 0) + 1 : 0,
        ownerStamina: clamp((current.ownerStamina ?? 100) + DAILY_STAMINA_RECOVERY),
        hiredStaff: updatedStaff.map((staff) => ({
          ...staff,
          stamina: clamp((staff.stamina ?? 100) + DAILY_STAMINA_RECOVERY),
        })),
        roster: updatedRoster.map((model) => ({
          ...model,
          stamina: clamp(model.stamina + DAILY_STAMINA_RECOVERY),
          fitness: clamp(model.fitness + 2),
          hapiness: clamp(model.hapiness + 2),
        })),
      }
    })

    const updatedState = get()
    const snapshot = get().captureDailyStatSnapshot({
      day: updatedState.day,
      label: 'day-end',
    })
    get().recordGameEvent({
      day: updatedState.day,
      type: 'info',
      title: 'Day Ended',
      description: `Advanced to day ${updatedState.day}. Budget delta ${snapshot.moneyDelta}.`,
      meta: {
        day: updatedState.day,
        money: snapshot.money,
        moneyDelta: snapshot.moneyDelta,
        popularity: snapshot.popularity,
        reputation: snapshot.companyReputation,
      },
    })

    const loss = get().checkAndApplyLoseCondition()
    if (loss) return toLoseResult(loss)

    return { ok: true, result: { day: state.day + 1 } }
  },

  resolvePaymentDecision: ({ paymentId, decision, bonusPercent = 0 }) => {
    const state = get()
    const blocked = get().ensureGameActive()
    if (blocked) return blocked
    const payment = state.paymentsToMake.find((entry) => entry.id === paymentId)

    if (!payment) return { ok: false, error: 'Payment not found.' }
    if (payment.status !== 'pending') return { ok: false, error: 'Payment already resolved.' }

    const safeBonusPercent = Math.max(0, Number(bonusPercent) || 0)
    let payAmount = payment.amount
    let happinessDelta = 0
    let negotiatedDiscountPercent = 0
    let nextDueDay = payment.dueDay

    if (decision === 'pay-now') {
      happinessDelta = 2
    } else if (decision === 'delay') {
      happinessDelta = -10
      nextDueDay = state.day + 1
    } else if (decision === 'negotiate') {
      negotiatedDiscountPercent = Math.round(randomBetween(0, 20))
      payAmount = Math.round(payment.amount * (1 - negotiatedDiscountPercent / 100))
      happinessDelta = -5
    } else if (decision === 'pay-bonus') {
      payAmount = Math.round(payment.amount * (1 + safeBonusPercent / 100))
      happinessDelta = 2 + safeBonusPercent / 10
    } else {
      return { ok: false, error: 'Invalid payment decision.' }
    }

    if (decision !== 'delay' && state.money < payAmount) {
      return { ok: false, error: `Not enough budget. Requires ${payAmount}.` }
    }

    const isSettlement = decision !== 'delay'

    set((current) => ({
      money: decision === 'delay' ? current.money : current.money - payAmount,
      roster: current.roster.map((model) => {
        if (payment.targetType !== 'model' || model.id !== payment.targetId) return model
        return {
          ...model,
          hapiness: clamp((model.hapiness ?? 70) + happinessDelta),
          awaitingPayment: decision === 'delay' ? true : false,
        }
      }),
      hiredStaff: current.hiredStaff.map((staff) => {
        if (payment.targetType !== 'staff' || staff.hiredId !== payment.targetId) return staff
        return {
          ...staff,
          hapiness: clamp((staff.hapiness ?? 70) + happinessDelta),
          awaitingPayment: decision === 'delay' ? true : false,
        }
      }),
      paymentsToMake: current.paymentsToMake.map((entry) => {
        if (entry.id !== payment.id) return entry

        if (decision === 'delay') {
          return {
            ...entry,
            dueDay: nextDueDay,
            delayCount: (entry.delayCount || 0) + 1,
            lastDecision: decision,
            lastDecisionDay: current.day,
          }
        }

        return {
          ...entry,
          status: 'paid',
          paidAmount: payAmount,
          paidDay: current.day,
          negotiatedDiscountPercent,
          bonusPercent: decision === 'pay-bonus' ? safeBonusPercent : 0,
          lastDecision: decision,
        }
      }),
    }))

    if (decision !== 'delay') {
      get().recordFinanceEntry({
        category: 'payment',
        amount: -payAmount,
        note: `Contract payment settled: ${payment.targetName}`,
        balanceAfter: get().money,
      })
    }

    get().recordGameEvent({
      type: decision === 'delay' ? 'error' : 'info',
      title: 'Payment Decision',
      description: `${payment.targetName} · ${decision} · amount ${decision === 'delay' ? payment.amount : payAmount}.`,
      meta: {
        paymentId,
        decision,
        targetType: payment.targetType,
        targetName: payment.targetName,
        amount: payment.amount,
        paidAmount: decision === 'delay' ? 0 : payAmount,
      },
    })

    const loss = get().checkAndApplyLoseCondition()
    if (loss) return toLoseResult(loss)

    return {
      ok: true,
      result: {
        paymentId: payment.id,
        decision,
        targetType: payment.targetType,
        targetName: payment.targetName,
        amount: payment.amount,
        paidAmount: decision === 'delay' ? 0 : payAmount,
        happinessDelta,
        negotiatedDiscountPercent,
        bonusPercent: decision === 'pay-bonus' ? safeBonusPercent : 0,
        nextDueDay: decision === 'delay' ? nextDueDay : null,
      },
    }
  },

  beginInterviewSession: ({ force = false } = {}) => {
    const state = get()
    const blocked = get().ensureGameActive()
    if (blocked) return blocked
    const availability = getInterviewAvailability(state.day, state.lastInterviewDay)

    if (!force && !availability.isAvailable) {
      return {
        ok: false,
        error: `No interview available. Come back in ${availability.daysUntilNext} day(s).`,
      }
    }

    if (state.lastInterviewDay === state.day) {
      return { ok: false, error: 'Interview already completed for today.' }
    }

    if (state.actionPoints < INTERVIEW_ACTION_POINT_COST) {
      return {
        ok: false,
        error: `Not enough action points. Requires ${INTERVIEW_ACTION_POINT_COST} AP, you have ${state.actionPoints}.`,
      }
    }

    const groupedByContext = interview_1.questions.reduce((acc, question) => {
      const contextId = question.contextId || 'default'
      if (!acc[contextId]) acc[contextId] = []
      acc[contextId].push(question)
      return acc
    }, {})

    const contextIds = Object.keys(groupedByContext).filter(
      (contextId) => groupedByContext[contextId].length >= INTERVIEW_QUESTION_COUNT,
    )

    if (contextIds.length === 0) {
      return { ok: false, error: 'No interview questions available for this session.' }
    }

    const selectedContextId = randomPick(contextIds)
    const contextQuestions = groupedByContext[selectedContextId]
    const randomQuestions = randomizeItems(contextQuestions).slice(0, INTERVIEW_QUESTION_COUNT)
    const contextImagePool = Array.isArray(randomQuestions[0]?.contextImages)
      ? randomQuestions[0].contextImages
      : []
    const randomContextImage = contextImagePool.length > 0
      ? randomPick(contextImagePool)
      : randomQuestions[0]?.contextImage || '/interview/1.jpg'
    const contextMeta = {
      id: selectedContextId,
      label: randomQuestions[0]?.contextLabel || 'Interview Session',
      image: randomContextImage,
    }

    set((current) => ({
      actionPoints: Math.max(0, current.actionPoints - INTERVIEW_ACTION_POINT_COST),
    }))

    return {
      ok: true,
      result: {
        day: state.day,
        context: contextMeta,
        questions: randomQuestions,
        actionPointCost: INTERVIEW_ACTION_POINT_COST,
      },
    }
  },

  submitInterviewSession: ({ day, answers }) => {
    const state = get()
    const blocked = get().ensureGameActive()
    if (blocked) return blocked

    if (!Number.isInteger(day) || day !== state.day) {
      return { ok: false, error: 'Interview session expired. Start a new interview session.' }
    }

    if (state.lastInterviewDay === state.day) {
      return { ok: false, error: 'Interview already completed for today.' }
    }

    if (!Array.isArray(answers) || answers.length !== INTERVIEW_QUESTION_COUNT) {
      return { ok: false, error: `Answer all ${INTERVIEW_QUESTION_COUNT} interview questions.` }
    }

    const parsedAnswers = answers.map((entry) => ({
      questionId: String(entry?.questionId || ''),
      optionId: String(entry?.optionId || ''),
    }))

    if (parsedAnswers.some((entry) => !entry.questionId || !entry.optionId)) {
      return { ok: false, error: 'Each interview answer must include questionId and optionId.' }
    }

    const uniqueQuestionIds = new Set(parsedAnswers.map((entry) => entry.questionId))
    if (uniqueQuestionIds.size !== INTERVIEW_QUESTION_COUNT) {
      return { ok: false, error: 'Interview answers must target 3 unique questions.' }
    }

    const selectedQuestions = parsedAnswers.map((answer) =>
      interview_1.questions.find((entry) => entry.id === answer.questionId),
    )

    if (selectedQuestions.some((question) => !question)) {
      return { ok: false, error: 'Invalid interview question selected.' }
    }

    const contextIds = new Set(selectedQuestions.map((question) => question.contextId || 'default'))
    if (contextIds.size !== 1) {
      return { ok: false, error: 'All interview questions must be from the same interview context.' }
    }

    let popularityChange = 0
    let reputationChange = 0

    for (const answer of parsedAnswers) {
      const question = selectedQuestions.find((entry) => entry.id === answer.questionId)

      const option = question.options.find((entry) => entry.id === answer.optionId)
      if (!option) return { ok: false, error: 'Invalid interview option selected.' }

      popularityChange += option.effect?.popularity || 0
      reputationChange += option.effect?.reputation || 0
    }

    set((current) => ({
      popularity: clampCompanyMetric(current.popularity + popularityChange),
      companyReputation: clampCompanyMetric(current.companyReputation + reputationChange),
      lastInterviewDay: current.day,
    }))

    get().recordGameEvent({
      type: 'info',
      title: 'Interview Completed',
      description: `Interview submitted. Popularity ${popularityChange >= 0 ? '+' : ''}${popularityChange}, reputation ${reputationChange >= 0 ? '+' : ''}${reputationChange}.`,
      meta: { popularityChange, reputationChange },
    })

    const loss = get().checkAndApplyLoseCondition()
    if (loss) return toLoseResult(loss)

    return {
      ok: true,
      result: {
        popularityChange,
        reputationChange,
      },
    }
  },

  skipInterviewSession: ({ day }) => {
    const state = get()
    const blocked = get().ensureGameActive()
    if (blocked) return blocked

    if (!Number.isInteger(day) || day !== state.day) {
      return { ok: false, error: 'Interview session expired. Start a new interview session.' }
    }

    if (state.lastInterviewDay === state.day) {
      return { ok: false, error: 'Interview already completed for today.' }
    }

    const popularityChange = -1
    const reputationChange = -1

    set((current) => ({
      popularity: clampCompanyMetric(current.popularity + popularityChange),
      companyReputation: clampCompanyMetric(current.companyReputation + reputationChange),
      lastInterviewDay: current.day,
    }))

    get().recordGameEvent({
      type: 'error',
      title: 'Interview Skipped',
      description: 'Interview skipped. Popularity -1, reputation -1.',
      meta: { popularityChange, reputationChange },
    })

    const loss = get().checkAndApplyLoseCondition()
    if (loss) return toLoseResult(loss)

    return {
      ok: true,
      result: {
        popularityChange,
        reputationChange,
      },
    }
  },

  organizeParty: (partyKey) => {
    const state = get()
    const blocked = get().ensureGameActive()
    if (blocked) return blocked
    const party = state.partyOptions[partyKey]
    if (!party) return { ok: false, error: 'Invalid party option selected.' }

    const actorCount = state.roster.length
    const staffCount = state.hiredStaff.length

    if (partyKey === 'small' && actorCount === 0) {
      return { ok: false, error: 'No employed actors available for a small party.' }
    }

    if ((partyKey === 'medium' || partyKey === 'massive') && actorCount + staffCount === 0) {
      return { ok: false, error: 'No employed actors or staff available for this party.' }
    }

    if (state.actionPoints < (party.actionPointCost || 0)) {
      return {
        ok: false,
        error: `Not enough action points. Requires ${party.actionPointCost || 0} AP, you have ${state.actionPoints}.`,
      }
    }

    const totalCost = party.cost({ actorCount, staffCount })
    if (state.money < totalCost) {
      return { ok: false, error: 'Not enough budget to organize this party.' }
    }

    set((current) => ({
      actionPoints: Math.max(0, current.actionPoints - (party.actionPointCost || 0)),
      money: current.money - totalCost,
      roster: current.roster.map((model) => ({
        ...model,
        hapiness: clamp((model.hapiness ?? 70) + party.actorHapinessDelta),
      })),
      hiredStaff: current.hiredStaff.map((staff) => ({
        ...staff,
        hapiness: clamp((staff.hapiness ?? 70) + party.staffHapinessDelta),
      })),
    }))

    get().recordGameEvent({
      type: 'info',
      title: 'Party Organized',
      description: `${party.label} organized for ${totalCost}.`,
      meta: { partyKey: party.key, totalCost, actorCount, staffCount },
    })
    get().recordFinanceEntry({
      category: 'party',
      amount: -totalCost,
      note: `Party organized: ${party.label}`,
      balanceAfter: get().money,
    })

    const loss = get().checkAndApplyLoseCondition()
    if (loss) return toLoseResult(loss)

    return {
      ok: true,
      result: {
        partyKey: party.key,
        partyLabel: party.label,
        totalCost,
        actorCount,
        staffCount,
        actionPointCost: party.actionPointCost || 0,
        actorHapinessDelta: party.actorHapinessDelta,
        staffHapinessDelta: party.staffHapinessDelta,
      },
    }
  },

  trainMember: ({ targetType, targetId, intensityKey, ownerSkillKey }) => {
    const state = get()
    const blocked = get().ensureGameActive()
    if (blocked) return blocked
    const option = state.ownerTrainingOptions[intensityKey]
    if (!option) return { ok: false, error: 'Invalid training intensity selected.' }

    const validTargetTypes = new Set(['owner', 'staff', 'model'])
    if (!validTargetTypes.has(targetType)) {
      return { ok: false, error: 'Invalid training target selected.' }
    }

    let currentStat = 0
    let targetLabel = ''
    let ownerSkill = ''

    if (targetType === 'model') {
      const model = state.roster.find((entry) => entry.id === targetId)
      if (!model) return { ok: false, error: 'Selected model is not available.' }
      currentStat = model.quality || 0
      targetLabel = model.name
    }

    if (targetType === 'staff') {
      const staff = state.hiredStaff.find((entry) => entry.hiredId === targetId)
      if (!staff) return { ok: false, error: 'Selected staff member is not available.' }
      currentStat = staff.skill || 0
      targetLabel = staff.name
    }

    if (targetType === 'owner') {
      ownerSkill = String(ownerSkillKey || '').trim()
      if (!ownerSkill || !state.staffCategories.includes(ownerSkill)) {
        return { ok: false, error: 'Select an owner skill to train.' }
      }
      currentStat = state.ownerSkills[ownerSkill] || 0
      targetLabel = 'Owner'
    }

    const moneyCost = Math.round(option.baseCost + currentStat * option.costPerCurrentStat)

    if (state.actionPoints < option.actionPointCost) {
      return {
        ok: false,
        error: `Not enough action points. Requires ${option.actionPointCost} AP, you have ${state.actionPoints}.`,
      }
    }

    if (state.money < moneyCost) {
      return {
        ok: false,
        error: `Not enough budget. Requires ${moneyCost}.`,
      }
    }

    set((current) => ({
      actionPoints: Math.max(0, current.actionPoints - option.actionPointCost),
      money: current.money - moneyCost,
      ownerStamina:
        targetType === 'owner'
          ? clamp((current.ownerStamina ?? 100) - option.staminaLoss)
          : current.ownerStamina,
      ownerSkills:
        targetType === 'owner'
          ? Object.fromEntries(
              Object.entries(current.ownerSkills).map(([skillKey, value]) => [
                skillKey,
                skillKey === ownerSkill ? clamp((value || 0) + option.statIncrease) : value,
              ]),
            )
          : current.ownerSkills,
      hiredStaff:
        targetType === 'staff'
          ? current.hiredStaff.map((staff) => {
              if (staff.hiredId !== targetId) return staff
              return {
                ...staff,
                skill: clamp((staff.skill || 0) + option.statIncrease),
                stamina: clamp((staff.stamina ?? 100) - option.staminaLoss),
              }
            })
          : current.hiredStaff,
      roster:
        targetType === 'model'
          ? current.roster.map((model) => {
              if (model.id !== targetId) return model
              return {
                ...model,
                quality: clamp((model.quality || 0) + option.statIncrease),
                stamina: clamp((model.stamina ?? 100) - option.staminaLoss),
              }
            })
          : current.roster,
    }))

    get().recordGameEvent({
      type: 'info',
      title: 'Training Completed',
      description: `${targetLabel}${ownerSkill ? ` (${ownerSkill})` : ''} trained with ${option.label}.`,
      meta: {
        targetType,
        targetId,
        intensity: option.key,
        moneyCost,
        statIncrease: option.statIncrease,
      },
    })
    get().recordFinanceEntry({
      category: 'training',
      amount: -moneyCost,
      note: `Training expense: ${targetLabel} (${option.label})`,
      balanceAfter: get().money,
    })

    const loss = get().checkAndApplyLoseCondition()
    if (loss) return toLoseResult(loss)

    const updatedStat = clamp(currentStat + option.statIncrease)

    return {
      ok: true,
      result: {
        targetType,
        targetLabel,
        ownerSkill: ownerSkill || null,
        intensity: option.label,
        actionPointCost: option.actionPointCost,
        moneyCost,
        statIncrease: option.statIncrease,
        staminaLoss: option.staminaLoss,
        statBefore: currentStat,
        statAfter: updatedStat,
      },
    }
  },

  renewStaffContract: (hiredId, term) => {
    const state = get()
    const blocked = get().ensureGameActive()
    if (blocked) return blocked
    const validTerm = ['day', 'week', 'month'].includes(term) ? term : null
    if (!validTerm) return { ok: false, error: 'Invalid contract term.' }

    const staff = state.hiredStaff.find((item) => item.hiredId === hiredId)
    if (!staff) return { ok: false, error: 'Staff member not found.' }

    const hasPendingPayment = state.paymentsToMake.some(
      (entry) => entry.status === 'pending' && entry.targetType === 'staff' && entry.targetId === hiredId,
    )
    if (hasPendingPayment || staff.awaitingPayment) {
      return { ok: false, error: 'Settle pending payment before renewing contract.' }
    }

    const feeField = contractKeysByType[validTerm]
    const agreedFee = staff[feeField]

    set((current) => ({
      hiredStaff: current.hiredStaff.map((item) => {
        if (item.hiredId !== hiredId) return item
        return {
          ...item,
          hireType: validTerm === 'day' ? 'daily' : validTerm === 'week' ? 'weekly' : 'monthly',
          contractDaysLeft: contractDaysByType[validTerm],
          agreedFee,
          awaitingPayment: false,
        }
      }),
    }))

    get().recordGameEvent({
      type: 'info',
      title: 'Staff Contract Renewed',
      description: `${staff.name} renewed for ${validTerm}. Deferred payment ${agreedFee}.`,
      meta: { hiredId, term: validTerm, deferredPayment: agreedFee },
    })

    return {
      ok: true,
      result: {
        name: staff.name,
        term: validTerm,
        contractDaysLeft: contractDaysByType[validTerm],
        deferredPayment: agreedFee,
      },
    }
  },

  renewModelContract: (modelId, term) => {
    const state = get()
    const blocked = get().ensureGameActive()
    if (blocked) return blocked
    const validTerm = ['day', 'week', 'month'].includes(term) ? term : null
    if (!validTerm) return { ok: false, error: 'Invalid contract term.' }

    const model = state.roster.find((item) => item.id === modelId)
    if (!model) return { ok: false, error: 'Model not found.' }

    const hasPendingPayment = state.paymentsToMake.some(
      (entry) => entry.status === 'pending' && entry.targetType === 'model' && entry.targetId === modelId,
    )
    if (hasPendingPayment || model.awaitingPayment) {
      return { ok: false, error: 'Settle pending payment before renewing contract.' }
    }

    const agreedFee = getModelContractFee(model, validTerm)

    set((current) => ({
      roster: current.roster.map((item) => {
        if (item.id !== modelId) return item
        return {
          ...item,
          hireType: validTerm,
          contractDaysLeft: contractDaysByType[validTerm],
          agreedFee,
          awaitingPayment: false,
        }
      }),
    }))

    get().recordGameEvent({
      type: 'info',
      title: 'Model Contract Renewed',
      description: `${model.name} renewed for ${validTerm}. Deferred payment ${agreedFee}.`,
      meta: { modelId, term: validTerm, deferredPayment: agreedFee },
    })

    return {
      ok: true,
      result: {
        name: model.name,
        term: validTerm,
        contractDaysLeft: contractDaysByType[validTerm],
        deferredPayment: agreedFee,
      },
    }
  },
}))
