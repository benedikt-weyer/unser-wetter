// Service to fetch and parse DWD MOSMIX station catalog
const STATION_LIST_URL = 'https://www.dwd.de/DE/leistungen/met_verfahren_mosmix/mosmix_stationskatalog.cfg?view=nasPublication&nn=16102';

export interface DWDStation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  height: number;
  icao: string;
  active: boolean;
}

let cachedStations: DWDStation[] | null = null;

// Parse the MOSMIX station catalog format
const parseStationList = (text: string): DWDStation[] => {
  const lines = text.split('\n');
  const stations: DWDStation[] = [];
  
  // Skip header line
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Parse format: ID ICAO NAME LAT LON ELEV
    // Example: 10184 ---- GREIFSWALD 54.06 13.24 5
    const parts = line.split(/\s+/);
    if (parts.length < 6) continue;
    
    const stationId = parts[0];
    const icao = parts[1];
    
    // Name can have multiple words, so we need to find where lat/lon start
    // Last 3 parts are always LAT LON ELEV
    const elevation = parseFloat(parts[parts.length - 1]);
    const longitude = parseFloat(parts[parts.length - 2]);
    const latitude = parseFloat(parts[parts.length - 3]);
    
    // Name is everything between ICAO and latitude
    const nameEndIndex = parts.length - 3;
    const stationName = parts.slice(2, nameEndIndex).join(' ');
    
    if (!isNaN(latitude) && !isNaN(longitude) && stationId) {
      stations.push({
        id: stationId,
        icao: icao,
        name: stationName,
        latitude,
        longitude,
        height: elevation,
        active: true, // MOSMIX catalog only contains active stations
      });
    }
  }
  
  return stations;
};

export const fetchStationList = async (): Promise<DWDStation[]> => {
  // Return cached data if available
  if (cachedStations) {
    return cachedStations;
  }
  
  try {
    const response = await fetch(STATION_LIST_URL);
    if (!response.ok) {
      throw new Error('Failed to fetch station list');
    }
    
    const text = await response.text();
    const stations = parseStationList(text);
    
    // Filter for active stations only
    cachedStations = stations.filter(s => s.active);
    
    return cachedStations;
  } catch (error) {
    console.error('Error fetching station list:', error);
    return [];
  }
};

export const searchStations = (stations: DWDStation[], query: string): DWDStation[] => {
  if (!query) {
    return stations;
  }
  
  const lowerQuery = query.toLowerCase();
  return stations.filter(
    (station) =>
      station.name.toLowerCase().includes(lowerQuery) ||
      station.id.toLowerCase().includes(lowerQuery) ||
      station.icao.toLowerCase().includes(lowerQuery)
  );
};

// Get German stations for quick access (filtering out international ones)
export const getMajorCities = (stations: DWDStation[]): DWDStation[] => {
  // Major German city keywords
  const majorCityNames = [
    'BERLIN',
    'HAMBURG',
    'MUENCHEN',
    'KOELN',
    'FRANKFURT',
    'STUTTGART',
    'DUESSELDORF',
    'DRESDEN',
    'LEIPZIG',
    'BREMEN',
    'HANNOVER',
    'NUERNBERG',
    'MAGDEBURG',
    'ERFURT',
    'FREIBURG',
    'AACHEN',
    'KASSEL',
    'ROSTOCK',
    'GREIFSWALD',
    'KARLSRUHE',
    'MANNHEIM',
    'WIESBADEN',
    'KIEL',
    'POTSDAM',
  ];
  
  // Filter for German stations (ID starts with 1, 4, or 5 typically for Germany)
  // and match city names
  return stations.filter(station => {
    const isGerman = /^[145]/.test(station.id);
    const matchesCity = majorCityNames.some(city => 
      station.name.toUpperCase().includes(city)
    );
    return isGerman && matchesCity;
  }).slice(0, 50); // Limit to first 50 matches
};

