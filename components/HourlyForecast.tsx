import React from 'react';
import { ScrollView, View } from 'react-native';
import { HourlyForecast as HourlyForecastType } from '../services/weatherService';
import { Card } from './ui/card';
import { Text } from './ui/text';

interface HourlyForecastProps {
  hourlyData: HourlyForecastType[];
}

const getWeatherEmoji = (iconId: number): string => {
  const emojiMap: { [key: number]: string } = {
    1: '☀️', 2: '🌤️', 3: '⛅', 4: '☁️', 5: '🌫️', 6: '🌫️', 7: '🌦️', 8: '🌧️',
    9: '⛈️', 10: '🌦️', 11: '⛈️', 12: '🌨️', 13: '🌨️', 14: '🌨️', 15: '❄️',
    16: '❄️', 17: '🌩️', 18: '🌦️', 19: '⛈️', 20: '🌨️', 21: '🌨️', 22: '🌨️',
    23: '❄️', 24: '🌩️', 25: '🌩️', 26: '⚡', 27: '⛈️', 28: '⛈️', 29: '🌩️',
    30: '🌩️', 31: '💨',
  };
  return emojiMap[iconId] || '🌡️';
};

export const HourlyForecast: React.FC<HourlyForecastProps> = ({ hourlyData }) => {
  if (!hourlyData || hourlyData.length === 0) {
    return null;
  }

  // Calculate temperature range for visualization
  const temperatures = hourlyData.map(h => h.temperature);
  const minTemp = Math.floor(Math.min(...temperatures));
  const maxTemp = Math.ceil(Math.max(...temperatures));
  const tempRange = maxTemp - minTemp || 10;
  
  // Calculate max precipitation for visualization
  const precipitations = hourlyData.map(h => h.precipitation);
  const maxPrecip = Math.max(...precipitations, 1); // At least 1mm for scale

  return (
    <View className="w-full mt-6">
      <Text className="text-xl font-bold mb-2 text-white">Stündliche Vorhersage</Text>
      
      <Card className="p-4" variant="elevated">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row">
            {hourlyData.map((hour, index) => {
              const hourLabel = hour.time.getHours().toString().padStart(2, '0');
              const precipHeight = (hour.precipitation / maxPrecip) * 80; // Max 80px height
              
              return (
                <View key={index} className="items-center mx-1" style={{ width: 65 }}>
                  {/* Time */}
                  <Text className="text-xs text-gray-600 mb-1 font-semibold">{hourLabel}:00</Text>
                  
                  {/* Weather icon */}
                  <Text className="text-2xl mb-1">{getWeatherEmoji(hour.icon)}</Text>
                  
                  {/* Temperature */}
                  <Text className="text-base font-bold text-gray-800 mb-2">
                    {Math.round(hour.temperature)}°C
                  </Text>
                  
                  {/* Precipitation bar */}
                  <View className="w-full items-center mb-2">
                    <View className="w-8 bg-blue-100 rounded-full justify-end overflow-hidden" style={{ height: 80 }}>
                      <View 
                        className="w-full bg-blue-500"
                        style={{ 
                          height: Math.max(precipHeight, hour.precipitation > 0 ? 2 : 0),
                        }}
                      />
                    </View>
                    <Text className="text-xs text-blue-600 mt-1">
                      💧 {hour.precipitation > 0.1 ? `${hour.precipitation.toFixed(1)}` : '0'}mm
                    </Text>
                  </View>
                  
                  {/* Wind speed */}
                  <Text className="text-xs text-gray-500">
                    💨 {Math.round(hour.windSpeed)}km/h
                  </Text>
                </View>
              );
            })}
          </View>
        </ScrollView>
        
        {/* Legend */}
        <View className="mt-4 pt-4 border-t border-gray-200">
          <View className="flex-row justify-between">
            <Text className="text-xs text-gray-600">Temperaturbereich: {minTemp}°C - {maxTemp}°C</Text>
            <Text className="text-xs text-gray-600">Max. Niederschlag: {maxPrecip.toFixed(1)}mm</Text>
          </View>
        </View>
      </Card>
    </View>
  );
};

