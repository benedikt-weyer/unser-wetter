// Deutsche Wetterdienst API Service
const API_BASE_URL = 'https://s3.eu-central-1.amazonaws.com/app-prod-static.warnwetter.de/v16';

export interface WeatherForecast {
  stationId: string;
  stationName: string;
  forecast: ForecastDay[];
  hourlyForecast: HourlyForecast[];
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

export interface HourlyForecast {
  time: Date;
  temperature: number;
  precipitation: number;
  windSpeed: number;
  icon: number;
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
          icon: day.icon1 || day.icon || 1,
          temperature: day.temperatureMax ? day.temperatureMax / 10 : 0,
          temperatureMin: day.temperatureMin !== undefined ? day.temperatureMin / 10 : undefined,
          temperatureMax: day.temperatureMax !== undefined ? day.temperatureMax / 10 : undefined,
          precipitation: day.precipitation !== undefined ? day.precipitation / 10 : undefined,
          // Wind speed is in tenths of m/s, convert to km/h: (value / 10) * 3.6
          windSpeed: day.windSpeed !== undefined ? (day.windSpeed / 10) * 3.6 : undefined,
          humidity: day.humidity,
        });
      });
    }
    
    console.log('📊 Parsed forecast:', forecast);
    
    // Parse hourly forecast data
    const hourlyForecast: HourlyForecast[] = [];
    
    if (data.forecast) {
      const startTime = data.forecast.start;
      const temperatures = data.forecast.temperature || [];
      const precipitation = data.forecast.precipitationTotal || [];
      const windSpeeds = data.forecast.windSpeed || [];
      const icons = data.forecast.icon || [];
      
      // Take next 24 hours
      const hoursToShow = Math.min(24, temperatures.length);
      
      for (let i = 0; i < hoursToShow; i++) {
        hourlyForecast.push({
          time: new Date(startTime + i * 3600000), // Add hours in milliseconds
          temperature: temperatures[i] !== undefined ? temperatures[i] / 10 : 0,
          precipitation: precipitation[i] !== undefined ? precipitation[i] / 10 : 0,
          windSpeed: windSpeeds[i] !== undefined ? (windSpeeds[i] / 10) * 3.6 : 0,
          icon: icons[i] || 1,
        });
      }
    }
    
    console.log('📊 Parsed hourly forecast:', hourlyForecast);
    
    return {
      stationId,
      stationName: data.stationName || 'Unbekannt',
      forecast,
      hourlyForecast,
    };
  } catch (error) {
    console.error('Error fetching weather forecast:', error);
    return null;
  }
};

