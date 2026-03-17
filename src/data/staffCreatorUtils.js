export const STAFF_CREATOR_STORAGE_KEY = 'tycoon-staff-creator-v1'
export const STAFF_IMAGE_COUNT_PER_CATEGORY = 10

export const STAFF_CREATOR_CATEGORIES = [
  {
    key: 'director',
    label: 'Director',
    role: 'Director',
    imageFolder: 'director',
    baseDailyFee: 140,
    feePerSkill: 16,
  },
  {
    key: 'camera',
    label: 'Camera',
    role: 'Camera Operator',
    imageFolder: 'camera',
    baseDailyFee: 90,
    feePerSkill: 12,
  },
  {
    key: 'lighting',
    label: 'Lighting',
    role: 'Lighting Specialist',
    imageFolder: 'light',
    baseDailyFee: 100,
    feePerSkill: 11,
  },
  {
    key: 'sound',
    label: 'Sound',
    role: 'Sound Engineer',
    imageFolder: 'sound',
    baseDailyFee: 95,
    feePerSkill: 11,
  },
  {
    key: 'editor',
    label: 'Editor',
    role: 'Editor',
    imageFolder: 'editor',
    baseDailyFee: 110,
    feePerSkill: 13,
  },
]

const clamp = (value, min, max) => Math.max(min, Math.min(max, value))

const calculatePerShootFee = (dailyFee, reputation) =>
  Number((dailyFee / 10 + reputation * 2).toFixed(2))

const getTierByReputation = (reputation) => {
  if (reputation <= 25) return 'beginner'
  if (reputation <= 50) return 'pro'
  if (reputation <= 75) return 'experienced'
  return 'elite'
}

const normalizeStaffForm = (form) => {
  const safeName = String(form?.name || '').trim()
  const safeAge = clamp(Number(form?.age) || 21, 18, 70)
  const safeReputation = clamp(Number(form?.reputation) || 20, 1, 100)

  return {
    name: safeName,
    age: safeAge,
    reputation: safeReputation,
  }
}

export const createStaffCreatorQueue = () =>
  STAFF_CREATOR_CATEGORIES.flatMap((category) =>
    Array.from({ length: STAFF_IMAGE_COUNT_PER_CATEGORY }, (_, index) => {
      const ordinal = index + 1
      return {
        id: `staff-${category.key}-${ordinal}`,
        category: category.key,
        categoryLabel: category.label,
        role: category.role,
        imageFolder: category.imageFolder,
        ordinal,
        imageUrl: `/staff/${category.imageFolder}/${ordinal}.jpg`,
      }
    }),
  )

export const buildStaffFromCreatorForm = (meta, form) => {
  const normalized = normalizeStaffForm(form)
  const config = STAFF_CREATOR_CATEGORIES.find((category) => category.key === meta.category)

  if (!config || !normalized.name) return null

  const reputation = normalized.reputation
  const tier = getTierByReputation(reputation)
  const skill = clamp(Math.round(reputation * 0.9 + config.feePerSkill), 16, 99)
  const dailyFee = Math.max(40, Math.round(config.baseDailyFee + skill * config.feePerSkill))
  const weeklyDiscountPercent = clamp(8 + Math.floor(reputation / 8), 8, 20)
  const monthlyDiscountPercent = clamp(12 + Math.floor(reputation / 7), 12, 24)
  const weeklyBase = dailyFee * 5
  const weeklyFee = Math.round(weeklyBase - weeklyBase * (weeklyDiscountPercent / 100))
  const monthlyBase = weeklyFee * 5
  const monthlyFee = Math.round(monthlyBase - monthlyBase * (monthlyDiscountPercent / 100))
  const perShootFee = calculatePerShootFee(dailyFee, reputation)

  return {
    id: meta.id,
    name: normalized.name,
    age: normalized.age,
    reputation,
    role: config.role,
    category: config.key,
    tier,
    skill,
    dailyFee,
    perShootFee,
    weeklyFee,
    monthlyFee,
    weeklyDiscountPercent,
    monthlyDiscountPercent,
    imageUrl: meta.imageUrl,
  }
}

const getCategoryConfig = (categoryKey) =>
  STAFF_CREATOR_CATEGORIES.find((category) => category.key === categoryKey)

export const recalculateStaffBySkill = (staffEntry, nextSkillValue) => {
  const config = getCategoryConfig(staffEntry?.category)
  if (!config) return staffEntry

  const normalizedSkill = clamp(Number(nextSkillValue) || 1, 1, 100)
  const reputation = Number((normalizedSkill / 2).toFixed(1))
  const tier = getTierByReputation(reputation)
  const dailyFee = Math.max(40, Math.round(config.baseDailyFee + normalizedSkill * config.feePerSkill))
  const weeklyDiscountPercent = clamp(8 + Math.floor(reputation / 8), 8, 20)
  const monthlyDiscountPercent = clamp(12 + Math.floor(reputation / 7), 12, 24)
  const weeklyBase = dailyFee * 5
  const weeklyFee = Math.round(weeklyBase - weeklyBase * (weeklyDiscountPercent / 100))
  const monthlyBase = weeklyFee * 5
  const monthlyFee = Math.round(monthlyBase - monthlyBase * (monthlyDiscountPercent / 100))
  const perShootFee = calculatePerShootFee(dailyFee, reputation)

  return {
    ...staffEntry,
    role: config.role,
    skill: normalizedSkill,
    reputation,
    tier,
    dailyFee,
    perShootFee,
    weeklyFee,
    monthlyFee,
    weeklyDiscountPercent,
    monthlyDiscountPercent,
  }
}
