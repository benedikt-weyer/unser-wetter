import React from 'react';
import { FlatList, View } from 'react-native';
import { WeatherForecast as WeatherForecastType, getWeatherDescription } from '../services/weatherService';
import { Card } from './ui/card';
import { Spinner } from './ui/spinner';
import { Text } from './ui/text';

interface WeatherForecastProps {
  forecast: WeatherForecastType | null;
  loading: boolean;
  error: string | null;
}

const getWeatherEmoji = (iconId: number): string => {
  const emojiMap: { [key: number]: string } = {
    1: '☀️',
    2: '🌤️',
    3: '⛅',
    4: '☁️',
    5: '🌫️',
    6: '🌫️',
    7: '🌦️',
    8: '🌧️',
    9: '⛈️',
    10: '🌦️',
    11: '⛈️',
    12: '🌨️',
    13: '🌨️',
    14: '🌨️',
    15: '❄️',
    16: '❄️',
    17: '🌩️',
    18: '🌦️',
    19: '⛈️',
    20: '🌨️',
    21: '🌨️',
    22: '🌨️',
    23: '❄️',
    24: '🌩️',
    25: '🌩️',
    26: '⚡',
    27: '⛈️',
    28: '⛈️',
    29: '🌩️',
    30: '🌩️',
    31: '💨',
  };
  return emojiMap[iconId] || '🌡️';
};

const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { weekday: 'short', day: '2-digit', month: '2-digit' };
    return date.toLocaleDateString('de-DE', options);
  } catch {
    return dateString;
  }
};

export const WeatherForecast: React.FC<WeatherForecastProps> = ({ forecast, loading, error }) => {
  if (loading) {
    return (
      <View className="items-center justify-center p-8">
        <Spinner size="large" />
        <Text className="text-gray-600 mt-4">Wetterdaten werden geladen...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <Card className="bg-red-100 p-4">
        <Text className="text-red-800 text-center">{error}</Text>
      </Card>
    );
  }

  if (!forecast) {
    return (
      <View className="items-center justify-center p-8">
        <Text className="text-gray-600 text-center">
          Wählen Sie eine Stadt aus, um die Wettervorhersage zu sehen
        </Text>
      </View>
    );
  }

  return (
    <View className="w-full">
      <Text className="text-2xl font-bold mb-4 text-center text-white">{forecast.stationName}</Text>
      
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={forecast.forecast}
        keyExtractor={(item, index) => `${item.dayDate}-${index}`}
        renderItem={({ item: day }) => (
          <Card
            className="p-4 mr-3 items-center min-w-[140px]"
            variant="elevated"
          >
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              {formatDate(day.dayDate)}
            </Text>
            <Text className="text-4xl mb-2">{getWeatherEmoji(day.icon)}</Text>
            <Text className="text-2xl font-bold text-gray-800 mb-1">
              {day.temperatureMax !== undefined ? `${Math.round(day.temperatureMax)}°` : `${Math.round(day.temperature)}°`}
            </Text>
            {day.temperatureMin !== undefined && (
              <Text className="text-sm text-gray-600 mb-2">
                Min: {Math.round(day.temperatureMin)}°
              </Text>
            )}
            <Text className="text-xs text-gray-600 text-center">
              {getWeatherDescription(day.icon)}
            </Text>
            {day.precipitation !== undefined && day.precipitation > 0 && (
              <Text className="text-xs text-blue-600 mt-2">
                💧 {Math.round(day.precipitation)} mm
              </Text>
            )}
            {day.windSpeed !== undefined && (
              <Text className="text-xs text-gray-600 mt-1">
                💨 {Math.round(day.windSpeed)} km/h
              </Text>
            )}
          </Card>
        )}
      />
    </View>
  );
};

