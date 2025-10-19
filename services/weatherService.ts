// Deutsche Wetterdienst API Service
const API_BASE_URL = 'https://s3.eu-central-1.amazonaws.com/app-prod-static.warnwetter.de/v16';

export interface WeatherForecast {
  stationId: string;
  stationName: string;
  forecast: ForecastDay[];
}

export interface ForecastDay {
  dayDate: string;
  icon: number;
  temperature: number;
  temperatureMin?: number;
  temperatureMax?: number;
  precipitation?: number;
  windSpeed?: number;
  humidity?: number;
}

export const getWeatherDescription = (iconId: number): string => {
  const descriptions: { [key: number]: string } = {
    1: 'Sonnig',
    2: 'Sonne, leicht bewölkt',
    3: 'Sonne, bewölkt',
    4: 'Wolkig',
    5: 'Nebel',
    6: 'Nebel, Rutschgefahr',
    7: 'Leichter Regen',
    8: 'Regen',
    9: 'Starker Regen',
    10: 'Leichter Regen, Rutschgefahr',
    11: 'Starker Regen, Rutschgefahr',
    12: 'Regen, vereinzelt Schneefall',
    13: 'Regen, vermehrt Schneefall',
    14: 'Leichter Schneefall',
    15: 'Schneefall',
    16: 'Starker Schneefall',
    17: 'Wolken (Hagel)',
    18: 'Sonne, leichter Regen',
    19: 'Sonne, starker Regen',
    20: 'Sonne, Regen, vereinzelter Schneefall',
    21: 'Sonne, Regen, vermehrter Schneefall',
    22: 'Sonne, vereinzelter Schneefall',
    23: 'Sonne, vermehrter Schneefall',
    24: 'Sonne (Hagel)',
    25: 'Sonne (starker Hagel)',
    26: 'Gewitter',
    27: 'Gewitter, Regen',
    28: 'Gewitter, starker Regen',
    29: 'Gewitter (Hagel)',
    30: 'Gewitter (starker Hagel)',
    31: 'Wind',
  };
  return descriptions[iconId] || 'Unbekannt';
};

export const fetchWeatherForecast = async (stationId: string): Promise<WeatherForecast | null> => {
  try {
    const url = `${API_BASE_URL}/forecast_mosmix_${stationId}.json`;
    console.log('🌤️ Fetching weather from:', url);
    console.log('📍 Station ID:', stationId);
    
    const response = await fetch(url);
    
    console.log('📡 Response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Parse the forecast data
    const forecast: ForecastDay[] = [];
    
    if (data.days) {
      data.days.forEach((day: any) => {
        forecast.push({
          dayDate: day.dayDate,
          icon: day.icon || 1,
          temperature: day.temperatureMax || day.temperature || 0,
          temperatureMin: day.temperatureMin,
          temperatureMax: day.temperatureMax,
          precipitation: day.precipitation,
          windSpeed: day.windSpeed,
          humidity: day.humidity,
        });
      });
    }
    
    return {
      stationId,
      stationName: data.stationName || 'Unbekannt',
      forecast,
    };
  } catch (error) {
    console.error('Error fetching weather forecast:', error);
    return null;
  }
};

