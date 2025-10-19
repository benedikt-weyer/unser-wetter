// German cities with their DWD station IDs
export interface City {
  id: string;
  name: string;
  state: string;
}

export const GERMAN_CITIES: City[] = [
  { id: '10147', name: 'Aachen', state: 'Nordrhein-Westfalen' },
  { id: '10379', name: 'Berlin', state: 'Berlin' },
  { id: '10506', name: 'Bremen', state: 'Bremen' },
  { id: '10708', name: 'Dresden', state: 'Sachsen' },
  { id: '10223', name: 'Düsseldorf', state: 'Nordrhein-Westfalen' },
  { id: '10338', name: 'Erfurt', state: 'Thüringen' },
  { id: '10637', name: 'Frankfurt am Main', state: 'Hessen' },
  { id: '10946', name: 'Freiburg', state: 'Baden-Württemberg' },
  { id: '10184', name: 'Greifswald', state: 'Mecklenburg-Vorpommern' },
  { id: '10147', name: 'Hamburg', state: 'Hamburg' },
  { id: '10616', name: 'Hannover', state: 'Niedersachsen' },
  { id: '10738', name: 'Kassel', state: 'Hessen' },
  { id: '10729', name: 'Köln', state: 'Nordrhein-Westfalen' },
  { id: '10870', name: 'Leipzig', state: 'Sachsen' },
  { id: '10299', name: 'Magdeburg', state: 'Sachsen-Anhalt' },
  { id: '10908', name: 'München', state: 'Bayern' },
  { id: '10427', name: 'Nürnberg', state: 'Bayern' },
  { id: '10169', name: 'Rostock', state: 'Mecklenburg-Vorpommern' },
  { id: '10738', name: 'Stuttgart', state: 'Baden-Württemberg' },
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

