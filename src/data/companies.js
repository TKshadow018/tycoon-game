const prefixes = [
  'Apex', 'Nova', 'Prime', 'Vertex', 'Blue', 'Silver', 'Golden', 'Urban', 'Next', 'Pulse',
  'Echo', 'Iron', 'Royal', 'Vivid', 'Summit', 'Orbit', 'Quantum', 'Vision', 'Crown', 'Future',
  'Aero', 'Zenith', 'Omni', 'Synth', 'Hyper', 'Nexus', 'Stellar', 'Aura', 'Titan', 'Vanguard',
  'Aurora', 'Lumina', 'Ignite', 'Cobalt', 'Crimson', 'Onyx', 'Equinox', 'Solstice', 'Stratus'
];

const suffixes = [
  'Studios', 'Media', 'Collective', 'Productions', 'Network', 'Brands', 'Group', 'House', 
  'Works', 'Labs', 'Ventures', 'Dynamics', 'Solutions', 'Partners', 'Holdings', 'Innovations', 
  'Enterprises', 'Systems', 'Global', 'Corp', 'Syndicate', 'Alliance', 'Concepts', 'Creative'
];

const sectors = [
  { key: 'fashion', label: 'Fashion' },
  { key: 'beauty', label: 'Beauty' },
  { key: 'tech', label: 'Technology' },
  { key: 'automotive', label: 'Automotive' },
  { key: 'sports', label: 'Sports' },
  { key: 'lifestyle', label: 'Lifestyle' },
  { key: 'travel', label: 'Travel' },
  { key: 'finance', label: 'Finance' },
  { key: 'gaming', label: 'Gaming' },
  { key: 'food', label: 'Food & Beverage' },
  { key: 'health', label: 'HealthTech' },
  { key: 'green_energy', label: 'Green Energy' },
  { key: 'aerospace', label: 'Aerospace' },
  { key: 'education', label: 'Education' },
  { key: 'real_estate', label: 'Real Estate' },
  { key: 'logistics', label: 'Logistics' },
  { key: 'robotics', label: 'Robotics' },
  { key: 'entertainment', label: 'Entertainment' }
];

/**
 * A simple deterministic Pseudo-Random Number Generator.
 * Using a seed ensures that mock data looks random but stays consistent across renders.
 */
const prng = (seed) => {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
};

// Helper to pick a random item from an array using our PRNG
const getRandomItem = (array, seed) => array[Math.floor(prng(seed) * array.length)];

export const createCompany = (index, options = {}) => {
  const { minValuation = 1_000_000, maxValuation = 500_000_000 } = options;

  const prefix = getRandomItem(prefixes, index * 13);
  const suffix = getRandomItem(suffixes, index * 27);
  const sector = getRandomItem(sectors, index * 41);

  // Vary the naming conventions for realism
  const nameFormatSeed = prng(index * 59);
  let name;
  if (nameFormatSeed > 0.7) {
    name = `${prefix} ${sector.label} ${suffix}`; // e.g., Apex Tech Dynamics
  } else if (nameFormatSeed > 0.3) {
    name = `${prefix} ${suffix}`; // e.g., Nova Ventures
  } else {
    name = `${prefix} ${sector.label}`; // e.g., Prime Logistics
  }

  // Calculate realistic pseudo-random values
  const valuation = minValuation + Math.floor(prng(index * 73) * (maxValuation - minValuation));
  const minPopularity = Math.floor(prng(index * 89) * 100);
  const relation = Math.floor(prng(index * 97) * 100);

  return {
    id: `company-${index + 1}`,
    name,
    valuation,
    minimumPopularity: minPopularity,
    sectorKey: sector.key,     // Added the key in case your frontend needs it for icons/filtering
    sectorLabel: sector.label, // Kept the label for display
    relation,
  };
};

/**
 * Generates an array of mock companies.
 * @param {number} count - Number of companies to generate.
 * @param {object} options - Configuration for company generation.
 */
export const createCompanies = (count = 200, options = {}) => {
  return Array.from({ length: count }, (_, index) => createCompany(index, options));
};
