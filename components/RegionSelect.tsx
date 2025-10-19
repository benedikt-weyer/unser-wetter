import React, { useEffect, useState } from 'react';
import { FlatList, Pressable, View } from 'react-native';
import { City, findNearestStation, getPopularCities, searchGermanCities } from '../services/cityService';
import { DWDStation, fetchStationList } from '../services/stationService';
import { Button, ButtonText } from './ui/button';
import { Card } from './ui/card';
import { Input, InputField } from './ui/input';
import { Modal, ModalBackdrop, ModalBody, ModalContent, ModalHeader } from './ui/modal';
import { Spinner } from './ui/spinner';
import { Text } from './ui/text';

interface RegionSelectProps {
  selectedCity: { city: City; station: DWDStation; distance: number } | null;
  onSelectCity: (data: { city: City; station: DWDStation; distance: number }) => void;
}

export const RegionSelect: React.FC<RegionSelectProps> = ({ selectedCity, onSelectCity }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [allStations, setAllStations] = useState<DWDStation[]>([]);
  const [searchResults, setSearchResults] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    const loadStations = async () => {
      setLoading(true);
      const stations = await fetchStationList();
      setAllStations(stations);
      setSearchResults(getPopularCities());
      setLoading(false);
    };
    
    if (modalVisible && allStations.length === 0) {
      loadStations();
    }
  }, [modalVisible, allStations.length]);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    
    if (query.length < 2) {
      setSearchResults(getPopularCities());
      return;
    }
    
    setSearching(true);
    const cities = await searchGermanCities(query);
    setSearchResults(cities);
    setSearching(false);
  };

  const handleSelectCity = (city: City) => {
    const nearestStation = findNearestStation(
      city.latitude,
      city.longitude,
      allStations
    );
    
    if (!nearestStation) {
      return;
    }
    
    const station = allStations.find(s => s.id === nearestStation.stationId);
    if (!station) {
      return;
    }
    
    onSelectCity({
      city,
      station,
      distance: nearestStation.distance,
    });
    
    setModalVisible(false);
    setSearchQuery('');
    setSearchResults(getPopularCities());
  };

  return (
    <View className="w-full mb-6">
      <Button
        size="lg"
        className="w-full"
        onPress={() => setModalVisible(true)}
      >
        <ButtonText>
          {selectedCity ? selectedCity.city.name : 'Stadt wählen'}
        </ButtonText>
      </Button>

      <Modal
        isOpen={modalVisible}
        onClose={() => setModalVisible(false)}
        size="lg"
      >
        <ModalBackdrop />
        <ModalContent className="max-h-[80%]">
          <ModalHeader>
            <View className="flex-row justify-between items-center w-full">
              <Text className="text-2xl font-bold">Stadt wählen</Text>
              <Button
                variant="link"
                action="secondary"
                onPress={() => setModalVisible(false)}
              >
                <ButtonText>Schließen</ButtonText>
              </Button>
            </View>
          </ModalHeader>
          
          <ModalBody>
            <Input className="mb-4" size="lg">
              <InputField
                placeholder="Suche Stadt in Deutschland..."
                value={searchQuery}
                onChangeText={handleSearch}
              />
            </Input>

            {loading ? (
              <View className="items-center justify-center p-8">
                <Spinner size="large" />
                <Text className="text-gray-600 mt-4">Lade Wetterstationen...</Text>
              </View>
            ) : searching ? (
              <View className="items-center justify-center p-8">
                <Spinner size="large" />
                <Text className="text-gray-600 mt-4">Suche Städte...</Text>
              </View>
            ) : (
              <View>
                {searchQuery.length < 2 && (
                  <Text className="text-sm text-gray-600 mb-2">Beliebte Städte:</Text>
                )}
                <FlatList
                  data={searchResults}
                  keyExtractor={(item, index) => `${item.latitude}-${item.longitude}-${index}`}
                  renderItem={({ item }) => (
                    <Pressable onPress={() => handleSelectCity(item)}>
                      <Card className="p-4 mb-2">
                        <Text className="text-lg font-semibold">{item.name}</Text>
                        <Text className="text-gray-600 text-sm">
                          {item.state || ''} • {item.type}
                        </Text>
                      </Card>
                    </Pressable>
                  )}
                  ListEmptyComponent={
                    <Text className="text-gray-500 text-center mt-4">
                      Keine Städte gefunden
                    </Text>
                  }
                />
              </View>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </View>
  );
};

