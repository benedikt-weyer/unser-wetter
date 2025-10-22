// Service to search for German cities and find nearest weather stations

export interface City {
  name: string;
  displayName: string;
  latitude: number;
  longitude: number;
  state?: string;
  type: string;
}

const NOMINATIM_API = 'https://nominatim.openstreetmap.org/search';

// Calculate distance between two coordinates using Haversine formula
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const findNearestStation = (
  cityLat: number,
  cityLon: number,
  stations: { id: string; latitude: number; longitude: number; name: string }[]
): { stationId: string; distance: number; stationName: string } | null => {
  if (!stations || stations.length === 0) {
    return null;
  }

  let nearest = stations[0];
  let minDistance = calculateDistance(cityLat, cityLon, nearest.latitude, nearest.longitude);

  for (const station of stations) {
    const distance = calculateDistance(cityLat, cityLon, station.latitude, station.longitude);
    if (distance < minDistance) {
      minDistance = distance;
      nearest = station;
    }
  }

  return {
    stationId: nearest.id,
    distance: minDistance,
    stationName: nearest.name,
  };
};

export const searchGermanCities = async (query: string): Promise<City[]> => {
  if (!query || query.length < 2) {
    return [];
  }

  try {
    const response = await fetch(
      `${NOMINATIM_API}?` +
      new URLSearchParams({
        q: query,
        countrycodes: 'de',
        format: 'json',
        limit: '20',
        addressdetails: '1',
      }),
      {
        headers: {
          'User-Agent': 'UnserWetter-App/1.0',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch cities');
    }

    const data = await response.json();

    return data
      .filter((item: any) => {
        // Filter for cities, towns, villages
        const relevantTypes = ['city', 'town', 'village', 'municipality', 'administrative'];
        return relevantTypes.some(type => item.type?.includes(type) || item.class === 'place');
      })
      .map((item: any) => ({
        name: item.name || item.address?.city || item.address?.town || item.address?.village,
        displayName: item.display_name,
        latitude: parseFloat(item.lat),
        longitude: parseFloat(item.lon),
        state: item.address?.state,
        type: item.type,
      }))
      .filter((city: City) => city.name); // Remove entries without names
  } catch (error) {
    console.error('Error searching cities:', error);
    return [];
  }
};

// Get popular German cities as defaults
export const getPopularCities = (): City[] => {
  return [
    { name: 'Berlin', displayName: 'Berlin, Deutschland', latitude: 52.52, longitude: 13.405, state: 'Berlin', type: 'city' },
    { name: 'Hamburg', displayName: 'Hamburg, Deutschland', latitude: 53.5511, longitude: 9.9937, state: 'Hamburg', type: 'city' },
    { name: 'München', displayName: 'München, Bayern, Deutschland', latitude: 48.1351, longitude: 11.582, state: 'Bayern', type: 'city' },
    { name: 'Köln', displayName: 'Köln, Nordrhein-Westfalen, Deutschland', latitude: 50.9375, longitude: 6.9603, state: 'Nordrhein-Westfalen', type: 'city' },
    { name: 'Frankfurt am Main', displayName: 'Frankfurt am Main, Hessen, Deutschland', latitude: 50.1109, longitude: 8.6821, state: 'Hessen', type: 'city' },
    { name: 'Stuttgart', displayName: 'Stuttgart, Baden-Württemberg, Deutschland', latitude: 48.7758, longitude: 9.1829, state: 'Baden-Württemberg', type: 'city' },
    { name: 'Düsseldorf', displayName: 'Düsseldorf, Nordrhein-Westfalen, Deutschland', latitude: 51.2277, longitude: 6.7735, state: 'Nordrhein-Westfalen', type: 'city' },
    { name: 'Leipzig', displayName: 'Leipzig, Sachsen, Deutschland', latitude: 51.3397, longitude: 12.3731, state: 'Sachsen', type: 'city' },
    { name: 'Dresden', displayName: 'Dresden, Sachsen, Deutschland', latitude: 51.0504, longitude: 13.7373, state: 'Sachsen', type: 'city' },
    { name: 'Bremen', displayName: 'Bremen, Deutschland', latitude: 53.0793, longitude: 8.8017, state: 'Bremen', type: 'city' },
  ];
};

