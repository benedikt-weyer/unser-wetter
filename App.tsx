import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { RegionSelect } from './components/RegionSelect';
import { GluestackUIProvider } from './components/ui/gluestack-ui-provider';
import { Text } from './components/ui/text';
import { WeatherForecast } from './components/WeatherForecast';
import { City } from './services/cityService';
import { DWDStation } from './services/stationService';
import { fetchWeatherForecast, WeatherForecast as WeatherForecastType } from './services/weatherService';

import './global.css';

export default function App() {
  const [selectedCity, setSelectedCity] = useState<{ city: City; station: DWDStation; distance: number } | null>(null);
  const [forecast, setForecast] = useState<WeatherForecastType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCitySelect = async (data: { city: City; station: DWDStation; distance: number }) => {
    setSelectedCity(data);
    setLoading(true);
    setError(null);
    
    console.log(`📍 Selected: ${data.city.name}`);
    console.log(`🎯 Nearest station: ${data.station.name} (${data.distance.toFixed(1)}km away)`);
    
    try {
      const weatherData = await fetchWeatherForecast(data.station.id);
      if (weatherData) {
        setForecast(weatherData);
      } else {
        setError('Wetterdaten konnten nicht geladen werden');
      }
    } catch (err) {
      setError('Fehler beim Laden der Wetterdaten');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <GluestackUIProvider mode="light">
      <View className="flex-1 bg-blue-400">
        <ScrollView className="flex-1">
          <View className="items-center justify-start p-6 pt-16 min-h-screen">
            <Text className="text-4xl font-bold text-white mb-2">Unser Wetter</Text>
            <Text className="text-lg text-white/90 mb-2">Deutsche Wettervorhersage</Text>
            <Text className="text-xs text-white/70 mb-6">Daten vom Deutschen Wetterdienst (DWD)</Text>
            
            <RegionSelect selectedCity={selectedCity} onSelectCity={handleCitySelect} />
            
            {selectedCity && (
              <Text className="text-sm text-white/80 mt-2 mb-4">
                Station: {selectedCity.station.name} ({selectedCity.distance.toFixed(1)} km entfernt)
              </Text>
            )}
            
            <WeatherForecast forecast={forecast} loading={loading} error={error} />
          </View>
        </ScrollView>
        <StatusBar style="light" />
      </View>
    </GluestackUIProvider>
  );
}
