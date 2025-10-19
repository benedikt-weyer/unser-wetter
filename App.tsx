import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { RegionSelect } from './components/RegionSelect';
import { GluestackUIProvider } from './components/ui/gluestack-ui-provider';
import { Text } from './components/ui/text';
import { WeatherForecast } from './components/WeatherForecast';
import { City } from './data/germanCities';
import { fetchWeatherForecast, WeatherForecast as WeatherForecastType } from './services/weatherService';

import './global.css';

export default function App() {
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [forecast, setForecast] = useState<WeatherForecastType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCitySelect = async (city: City) => {
    setSelectedCity(city);
    setLoading(true);
    setError(null);
    
    try {
      const weatherData = await fetchWeatherForecast(city.id);
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
            <Text className="text-lg text-white mb-8">Deutsche Wettervorhersage</Text>
            
            <RegionSelect selectedCity={selectedCity} onSelectCity={handleCitySelect} />
            
            <WeatherForecast forecast={forecast} loading={loading} error={error} />
          </View>
        </ScrollView>
        <StatusBar style="light" />
      </View>
    </GluestackUIProvider>
  );
}
