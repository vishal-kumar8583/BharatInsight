// Simulated large dataset based on Indian public data (data.gov.in structure)
// In production, replace with actual API calls to data.gov.in

export type DataRecord = {
  id: number;
  state: string;
  district: string;
  year: number;
  department: string;
  metric: string;
  value: number;
  unit: string;
  category: string;
  growth: number;
  rank: number;
};

const STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
];

const DISTRICTS_BY_STATE: Record<string, string[]> = {
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool", "Tirupati", "Kakinada"],
  "Arunachal Pradesh": ["Itanagar", "Naharlagun", "Pasighat", "Tawang", "Ziro", "Bomdila"],
  "Assam": ["Guwahati", "Dibrugarh", "Jorhat", "Silchar", "Tezpur", "Nagaon", "Tinsukia"],
  "Bihar": ["Patna", "Gaya", "Muzaffarpur", "Bhagalpur", "Darbhanga", "Purnia", "Arrah"],
  "Chhattisgarh": ["Raipur", "Bhilai", "Bilaspur", "Korba", "Durg", "Rajnandgaon", "Jagdalpur"],
  "Goa": ["Panaji", "Margao", "Vasco da Gama", "Mapusa", "Ponda", "Bicholim"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Gandhinagar"],
  "Haryana": ["Faridabad", "Gurugram", "Panipat", "Ambala", "Yamunanagar", "Rohtak", "Hisar"],
  "Himachal Pradesh": ["Shimla", "Dharamshala", "Solan", "Mandi", "Kullu", "Hamirpur", "Bilaspur"],
  "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Deoghar", "Hazaribagh", "Giridih"],
  "Karnataka": ["Bengaluru", "Mysuru", "Hubli", "Mangaluru", "Belagavi", "Kalaburagi", "Davanagere"],
  "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam", "Palakkad", "Alappuzha"],
  "Madhya Pradesh": ["Bhopal", "Indore", "Jabalpur", "Gwalior", "Ujjain", "Sagar", "Rewa"],
  "Maharashtra": ["Mumbai", "Pune", "Nashik", "Nagpur", "Aurangabad", "Solapur", "Kolhapur"],
  "Manipur": ["Imphal", "Thoubal", "Bishnupur", "Churachandpur", "Senapati", "Ukhrul"],
  "Meghalaya": ["Shillong", "Tura", "Jowai", "Nongstoin", "Baghmara", "Williamnagar"],
  "Mizoram": ["Aizawl", "Lunglei", "Champhai", "Serchhip", "Kolasib", "Lawngtlai"],
  "Nagaland": ["Kohima", "Dimapur", "Mokokchung", "Tuensang", "Wokha", "Zunheboto"],
  "Odisha": ["Bhubaneswar", "Cuttack", "Rourkela", "Berhampur", "Sambalpur", "Puri", "Balasore"],
  "Punjab": ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda", "Mohali", "Firozpur"],
  "Rajasthan": ["Jaipur", "Jodhpur", "Kota", "Bikaner", "Ajmer", "Udaipur", "Bharatpur"],
  "Sikkim": ["Gangtok", "Namchi", "Gyalshing", "Mangan", "Rangpo", "Jorethang"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Salem", "Tiruchirappalli", "Tirunelveli", "Vellore"],
  "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam", "Ramagundam", "Nalgonda"],
  "Tripura": ["Agartala", "Udaipur", "Dharmanagar", "Kailasahar", "Belonia", "Ambassa"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Agra", "Varanasi", "Allahabad", "Meerut", "Ghaziabad"],
  "Uttarakhand": ["Dehradun", "Haridwar", "Roorkee", "Haldwani", "Rudrapur", "Kashipur", "Rishikesh"],
  "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri", "Bardhaman", "Malda"],
};

const HEALTH_METRICS = [
  { metric: "Infant Mortality Rate", unit: "per 1000", category: "Health" },
  { metric: "Maternal Mortality Rate", unit: "per 100k", category: "Health" },
  { metric: "Immunization Coverage", unit: "%", category: "Health" },
  { metric: "Hospital Beds", unit: "per 10k", category: "Health" },
  { metric: "Doctor Ratio", unit: "per 10k", category: "Health" },
];

const AGRI_METRICS = [
  { metric: "Crop Yield (Rice)", unit: "kg/hectare", category: "Agriculture" },
  { metric: "Crop Yield (Wheat)", unit: "kg/hectare", category: "Agriculture" },
  { metric: "Irrigation Coverage", unit: "%", category: "Agriculture" },
  { metric: "Fertilizer Usage", unit: "kg/hectare", category: "Agriculture" },
  { metric: "Farmer Income", unit: "₹/year", category: "Agriculture" },
];

const FINANCE_METRICS = [
  { metric: "GDP Growth", unit: "%", category: "Finance" },
  { metric: "Tax Revenue", unit: "₹ Crore", category: "Finance" },
  { metric: "FDI Inflow", unit: "USD Million", category: "Finance" },
  { metric: "Unemployment Rate", unit: "%", category: "Finance" },
  { metric: "Per Capita Income", unit: "₹", category: "Finance" },
];

const EDU_METRICS = [
  { metric: "Literacy Rate", unit: "%", category: "Education" },
  { metric: "Gross Enrollment Ratio", unit: "%", category: "Education" },
  { metric: "School Dropout Rate", unit: "%", category: "Education" },
  { metric: "Teacher-Student Ratio", unit: "ratio", category: "Education" },
  { metric: "Digital Literacy", unit: "%", category: "Education" },
];

const ENERGY_METRICS = [
  { metric: "Solar Capacity", unit: "MW", category: "Energy" },
  { metric: "Wind Energy Output", unit: "MW", category: "Energy" },
  { metric: "Electrification Rate", unit: "%", category: "Energy" },
  { metric: "Per Capita Power Consumption", unit: "kWh", category: "Energy" },
  { metric: "Renewable Energy Share", unit: "%", category: "Energy" },
];

const WATER_METRICS = [
  { metric: "Safe Water Access", unit: "%", category: "Water" },
  { metric: "Sanitation Coverage", unit: "%", category: "Water" },
  { metric: "Groundwater Level", unit: "meters", category: "Water" },
  { metric: "Irrigation Water Use", unit: "BCM", category: "Water" },
  { metric: "Tap Water Connections", unit: "per 1000", category: "Water" },
];

const DEPT_METRICS: Record<string, typeof HEALTH_METRICS> = {
  health: HEALTH_METRICS,
  agriculture: AGRI_METRICS,
  finance: FINANCE_METRICS,
  education: EDU_METRICS,
  energy: ENERGY_METRICS,
  water: WATER_METRICS,
};

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function generateDataset(department: string, count = 2000): DataRecord[] {
  const metrics = DEPT_METRICS[department] || HEALTH_METRICS;
  const records: DataRecord[] = [];

  for (let i = 0; i < count; i++) {
    const seed = i * 7 + department.length;
    const stateIdx = Math.floor(seededRandom(seed) * STATES.length);
    const state = STATES[stateIdx];
    const districtList = DISTRICTS_BY_STATE[state] || ["District A", "District B", "District C"];
    const districtIdx = Math.floor(seededRandom(seed + 1) * districtList.length);
    const metricIdx = Math.floor(seededRandom(seed + 2) * metrics.length);
    const year = 2018 + Math.floor(seededRandom(seed + 3) * 6);
    const baseValue = 20 + seededRandom(seed + 4) * 980;
    const growth = (seededRandom(seed + 5) - 0.3) * 30;

    records.push({
      id: i + 1,
      state,
      district: districtList[districtIdx],
      year,
      department,
      metric: metrics[metricIdx].metric,
      value: parseFloat(baseValue.toFixed(2)),
      unit: metrics[metricIdx].unit,
      category: metrics[metricIdx].category,
      growth: parseFloat(growth.toFixed(1)),
      rank: Math.floor(seededRandom(seed + 6) * 28) + 1,
    });
  }

  return records;
}

// Cache generated datasets
const cache = new Map<string, DataRecord[]>();

export function getDataset(department: string): DataRecord[] {
  if (!cache.has(department)) {
    cache.set(department, generateDataset(department, 5000));
  }
  return cache.get(department)!;
}

export const INDIAN_STATES = STATES;
export const YEARS = [2018, 2019, 2020, 2021, 2022, 2023];
