const femaleFirstNames = [
  'Aiko', 'Mina', 'Yara', 'Sofia', 'Nadia', 'Lina', 'Tara', 'Ivy', 'Maya', 'Rina',
  'Chloe', 'Amara', 'Zara', 'Elena', 'Noor', 'Hana', 'Kiara', 'Leila', 'Mei', 'Anya',
]

const maleFirstNames = [
  'Luca', 'Kenji', 'Arjun', 'Mateo', 'Noah', 'Elias', 'Omar', 'Ravi', 'Hugo', 'Dylan',
  'Aiden', 'Jae', 'Niko', 'Samir', 'Felix', 'Kiran',
]

const lastNames = [
  'Moreno', 'Ishikawa', 'Rahman', 'Petrov', 'Santos', 'Kim', 'Haddad', 'Novak', 'Silva', 'Mensah',
  'Khan', 'Ivanov', 'Ortega', 'Nakamura', 'Yildiz', 'Park', 'Farah', 'Costa', 'Lee', 'Adeyemi',
]

const regions = [
  { area: 'East Asia', ethnicity: 'East Asian', skinColor: 'Light' },
  { area: 'South Asia', ethnicity: 'South Asian', skinColor: 'Brown' },
  { area: 'Southeast Asia', ethnicity: 'Southeast Asian', skinColor: 'Tan' },
  { area: 'Europe', ethnicity: 'European', skinColor: 'Light' },
  { area: 'Middle East', ethnicity: 'Middle Eastern', skinColor: 'Olive' },
  { area: 'Africa', ethnicity: 'African', skinColor: 'Dark' },
  { area: 'Latin America', ethnicity: 'Latina/Latino', skinColor: 'Brown' },
  { area: 'North America', ethnicity: 'Mixed', skinColor: 'Light' },
]

const bodyTypes = ['Slim', 'Athletic', 'Curvy', 'Lean', 'Fit']

const getUnlockReputation = (quality) => {
  if (quality <= 25) return 0
  if (quality <= 40) return 15
  if (quality <= 55) return 30
  if (quality <= 70) return 45
  if (quality <= 85) return 60
  return 80
}

const makeModel = (index, gender) => {
  const first =
    gender === 'female'
      ? femaleFirstNames[index % femaleFirstNames.length]
      : maleFirstNames[index % maleFirstNames.length]
  const last = lastNames[(index * 3) % lastNames.length]
  const region = regions[index % regions.length]
  const bodyType = bodyTypes[(index + 2) % bodyTypes.length]
  const quality = 8 + ((index * 9) % 89)

  return {
    id: `${gender}-${index + 1}`,
    gender,
    name: `${first} ${last} ${index + 1}`,
    age: 19 + (index % 18),
    ethnicity: `${region.ethnicity} (${region.area})`,
    height: 155 + (index % 30),
    weight: 48 + ((index * 2) % 42),
    bodyType,
    skinColor: region.skinColor,
    quality,
    unlockReputation: getUnlockReputation(quality),
    popularity: Math.max(3, Math.floor(quality / 5)),
    totalSpecialVideo: 0,
    totalBodyShoot: 0,
    totalBasicShoot: 0,
    totalMovie: 0,
    totalAdShoot: 0,
    money: 0,
    fitness: 20 + ((index * 3) % 60),
    stamina: 100,
    hapiness: 45 + ((index * 4) % 45),
    imageUrl: `https://picsum.photos/seed/model-${gender}-${index + 1}/420/560`,
  }
}

export const createInitialModels = () => {
  const femaleModels = Array.from({ length: 70 }, (_, idx) => makeModel(idx, 'female'))
  const maleModels = Array.from({ length: 30 }, (_, idx) => makeModel(idx + 70, 'male'))
  return [...femaleModels, ...maleModels]
}
