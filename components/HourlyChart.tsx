import React from 'react';
import { Dimensions, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { HourlyForecast as HourlyForecastType } from '../services/weatherService';
import { Card } from './ui/card';
import { Text } from './ui/text';

interface HourlyChartProps {
  hourlyData: HourlyForecastType[];
}

const screenWidth = Dimensions.get('window').width;

export const HourlyChart: React.FC<HourlyChartProps> = ({ hourlyData }) => {
  if (!hourlyData || hourlyData.length === 0) {
    return null;
  }

  // Prepare data for the chart
  const labels = hourlyData.map((hour, index) => {
    // Show every 3rd hour to avoid crowding
    if (index % 3 === 0) {
      return hour.time.getHours().toString().padStart(2, '0') + ':00';
    }
    return '';
  });

  const temperatureData = hourlyData.map(h => h.temperature);
  const precipitationData = hourlyData.map(h => h.precipitation);

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: '#3B82F6',
    },
  };

  const data = {
    labels,
    datasets: [
      {
        data: temperatureData,
        color: (opacity = 1) => `rgba(239, 68, 68, ${opacity})`, // Red for temperature
        strokeWidth: 2,
      },
      {
        data: precipitationData,
        color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`, // Blue for precipitation
        strokeWidth: 2,
      },
    ],
    legend: ['Temperatur (°C)', 'Niederschlag (mm)'],
  };

  return (
    <View className="w-full mt-6">
      <Text className="text-xl font-bold mb-2 text-white">Verlaufsgrafik</Text>
      
      <Card className="p-4" variant="elevated">
        <LineChart
          data={data}
          width={screenWidth - 64}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={{
            borderRadius: 16,
          }}
          withInnerLines={true}
          withOuterLines={true}
          withVerticalLines={false}
          withHorizontalLines={true}
          withVerticalLabels={true}
          withHorizontalLabels={true}
          fromZero={false}
        />
        
        <View className="flex-row justify-around mt-4">
          <View className="flex-row items-center">
            <View className="w-4 h-4 bg-red-500 rounded-full mr-2" />
            <Text className="text-xs text-gray-600">Temperatur</Text>
          </View>
          <View className="flex-row items-center">
            <View className="w-4 h-4 bg-blue-500 rounded-full mr-2" />
            <Text className="text-xs text-gray-600">Niederschlag</Text>
          </View>
        </View>
      </Card>
    </View>
  );
};

