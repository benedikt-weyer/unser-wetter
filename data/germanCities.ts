// German cities with their DWD station IDs
export interface City {
  id: string;
  name: string;
  state: string;
}

export const GERMAN_CITIES: City[] = [
  { id: '10513', name: 'Aachen', state: 'Nordrhein-Westfalen' },
  { id: '10379', name: 'Berlin', state: 'Berlin' },
  { id: '10224', name: 'Bremen', state: 'Bremen' },
  { id: '10488', name: 'Dresden', state: 'Sachsen' },
  { id: '10400', name: 'Düsseldorf', state: 'Nordrhein-Westfalen' },
  { id: '10554', name: 'Erfurt', state: 'Thüringen' },
  { id: '10637', name: 'Frankfurt am Main', state: 'Hessen' },
  { id: '10946', name: 'Freiburg', state: 'Baden-Württemberg' },
  { id: '10184', name: 'Greifswald', state: 'Mecklenburg-Vorpommern' },
  { id: '10147', name: 'Hamburg', state: 'Hamburg' },
  { id: '10564', name: 'Hannover', state: 'Niedersachsen' },
  { id: '10438', name: 'Kassel', state: 'Hessen' },
  { id: '10315', name: 'Köln', state: 'Nordrhein-Westfalen' },
  { id: '10469', name: 'Leipzig', state: 'Sachsen' },
  { id: '10259', name: 'Magdeburg', state: 'Sachsen-Anhalt' },
  { id: '10865', name: 'München', state: 'Bayern' },
  { id: '10763', name: 'Nürnberg', state: 'Bayern' },
  { id: '10169', name: 'Rostock', state: 'Mecklenburg-Vorpommern' },
  { id: '10739', name: 'Stuttgart', state: 'Baden-Württemberg' },
];

export const searchCities = (query: string): City[] => {
  if (!query) {
    return GERMAN_CITIES;
  }
  
  const lowerQuery = query.toLowerCase();
  return GERMAN_CITIES.filter(
    (city) =>
      city.name.toLowerCase().includes(lowerQuery) ||
      city.state.toLowerCase().includes(lowerQuery)
  );
};

