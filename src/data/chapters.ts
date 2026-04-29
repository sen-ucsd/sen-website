// Approximate chapter locations.
// Coordinates are [longitude, latitude] in degrees, projected with equirectangular.
// "founding" / "active" / "launching" / "applying"
export type ChapterStatus = "founding" | "active" | "launching" | "applying";

export interface School {
  name: string;
  abbreviation: string;
  // Optional: custom mark variant. "ucsd" renders the UCSD trident. Others fall back
  // to a clean monogram of the abbreviation.
  mark?: "ucsd";
}

export interface Chapter {
  id: string;
  city: string;
  university?: string; // legacy display label; kept for back-compat in places that still use it
  schools: School[];
  country: string;
  lng: number;
  lat: number;
  status: ChapterStatus;
}

export const CHAPTERS: Chapter[] = [
  // Founding
  {
    id: "san-diego",
    city: "San Diego",
    university: "UC San Diego",
    schools: [{ name: "UC San Diego", abbreviation: "UCSD", mark: "ucsd" }],
    country: "USA",
    lng: -117.16,
    lat: 32.71,
    status: "founding",
  },

  // U.S. — second wave
  {
    id: "los-angeles",
    city: "Los Angeles",
    university: "UCLA, USC",
    schools: [
      { name: "UCLA", abbreviation: "UCLA" },
      { name: "USC", abbreviation: "USC" },
    ],
    country: "USA",
    lng: -118.24,
    lat: 34.05,
    status: "launching",
  },
  {
    id: "berkeley",
    city: "Berkeley",
    university: "UC Berkeley, Stanford",
    schools: [
      { name: "UC Berkeley", abbreviation: "Cal" },
      { name: "Stanford", abbreviation: "SU" },
    ],
    country: "USA",
    lng: -122.27,
    lat: 37.87,
    status: "launching",
  },
  {
    id: "seattle",
    city: "Seattle",
    university: "University of Washington",
    schools: [{ name: "University of Washington", abbreviation: "UW" }],
    country: "USA",
    lng: -122.33,
    lat: 47.6,
    status: "applying",
  },
  {
    id: "austin",
    city: "Austin",
    university: "UT Austin",
    schools: [{ name: "UT Austin", abbreviation: "UT" }],
    country: "USA",
    lng: -97.74,
    lat: 30.27,
    status: "launching",
  },
  {
    id: "ann-arbor",
    city: "Ann Arbor",
    university: "University of Michigan",
    schools: [{ name: "University of Michigan", abbreviation: "UM" }],
    country: "USA",
    lng: -83.74,
    lat: 42.28,
    status: "applying",
  },
  {
    id: "atlanta",
    city: "Atlanta",
    university: "Georgia Tech",
    schools: [{ name: "Georgia Tech", abbreviation: "GT" }],
    country: "USA",
    lng: -84.39,
    lat: 33.75,
    status: "applying",
  },
  {
    id: "boston",
    city: "Boston",
    university: "MIT, Harvard",
    schools: [
      { name: "MIT", abbreviation: "MIT" },
      { name: "Harvard", abbreviation: "HU" },
    ],
    country: "USA",
    lng: -71.06,
    lat: 42.36,
    status: "launching",
  },
  {
    id: "nyc",
    city: "New York",
    university: "Columbia, NYU",
    schools: [
      { name: "Columbia", abbreviation: "CU" },
      { name: "NYU", abbreviation: "NYU" },
    ],
    country: "USA",
    lng: -74.01,
    lat: 40.71,
    status: "launching",
  },

  // International
  {
    id: "toronto",
    city: "Toronto",
    university: "University of Toronto",
    schools: [{ name: "University of Toronto", abbreviation: "UofT" }],
    country: "Canada",
    lng: -79.38,
    lat: 43.65,
    status: "applying",
  },
  {
    id: "mexico-city",
    city: "Mexico City",
    university: "Tecnológico de Monterrey",
    schools: [{ name: "Tec de Monterrey", abbreviation: "TEC" }],
    country: "Mexico",
    lng: -99.13,
    lat: 19.43,
    status: "applying",
  },
  {
    id: "sao-paulo",
    city: "São Paulo",
    university: "USP",
    schools: [{ name: "Universidade de São Paulo", abbreviation: "USP" }],
    country: "Brazil",
    lng: -46.63,
    lat: -23.55,
    status: "applying",
  },
  {
    id: "london",
    city: "London",
    university: "LSE, Imperial",
    schools: [
      { name: "LSE", abbreviation: "LSE" },
      { name: "Imperial College", abbreviation: "ICL" },
    ],
    country: "UK",
    lng: -0.13,
    lat: 51.51,
    status: "launching",
  },
  {
    id: "paris",
    city: "Paris",
    university: "HEC, Polytechnique",
    schools: [
      { name: "HEC Paris", abbreviation: "HEC" },
      { name: "Polytechnique", abbreviation: "X" },
    ],
    country: "France",
    lng: 2.35,
    lat: 48.86,
    status: "applying",
  },
  {
    id: "berlin",
    city: "Berlin",
    university: "TU Berlin",
    schools: [{ name: "TU Berlin", abbreviation: "TU" }],
    country: "Germany",
    lng: 13.4,
    lat: 52.52,
    status: "applying",
  },
  {
    id: "lagos",
    city: "Lagos",
    university: "University of Lagos",
    schools: [{ name: "University of Lagos", abbreviation: "UL" }],
    country: "Nigeria",
    lng: 3.39,
    lat: 6.52,
    status: "applying",
  },
  {
    id: "bangalore",
    city: "Bangalore",
    university: "IISc, IIM-B",
    schools: [
      { name: "IISc", abbreviation: "IISc" },
      { name: "IIM Bangalore", abbreviation: "IIMB" },
    ],
    country: "India",
    lng: 77.59,
    lat: 12.97,
    status: "applying",
  },
  {
    id: "singapore",
    city: "Singapore",
    university: "NUS",
    schools: [{ name: "National University of Singapore", abbreviation: "NUS" }],
    country: "Singapore",
    lng: 103.82,
    lat: 1.35,
    status: "launching",
  },
  {
    id: "tokyo",
    city: "Tokyo",
    university: "Waseda",
    schools: [{ name: "Waseda University", abbreviation: "WU" }],
    country: "Japan",
    lng: 139.69,
    lat: 35.69,
    status: "launching",
  },
  {
    id: "sydney",
    city: "Sydney",
    university: "University of Sydney",
    schools: [{ name: "University of Sydney", abbreviation: "USyd" }],
    country: "Australia",
    lng: 151.21,
    lat: -33.87,
    status: "applying",
  },
];

// Equirectangular projection: lng/lat (degrees) -> normalized [0..1]
export function project(lng: number, lat: number) {
  // x: -180..180 -> 0..1
  // y:  90..-90 -> 0..1
  const x = (lng + 180) / 360;
  const y = (90 - lat) / 180;
  return { x, y };
}
