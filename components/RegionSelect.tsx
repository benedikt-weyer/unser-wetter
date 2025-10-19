import React, { useEffect, useState } from 'react';
import { FlatList, Pressable, View } from 'react-native';
import { DWDStation, fetchStationList, getMajorCities, searchStations } from '../services/stationService';
import { Button, ButtonText } from './ui/button';
import { Card } from './ui/card';
import { Input, InputField } from './ui/input';
import { Modal, ModalBackdrop, ModalBody, ModalContent, ModalHeader } from './ui/modal';
import { Spinner } from './ui/spinner';
import { Text } from './ui/text';

interface RegionSelectProps {
  selectedCity: DWDStation | null;
  onSelectCity: (city: DWDStation) => void;
}

export const RegionSelect: React.FC<RegionSelectProps> = ({ selectedCity, onSelectCity }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [allStations, setAllStations] = useState<DWDStation[]>([]);
  const [filteredStations, setFilteredStations] = useState<DWDStation[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadStations = async () => {
      setLoading(true);
      const stations = await fetchStationList();
      const majorCities = getMajorCities(stations);
      setAllStations(stations);
      setFilteredStations(majorCities);
      setLoading(false);
    };
    
    if (modalVisible && allStations.length === 0) {
      loadStations();
    }
  }, [modalVisible, allStations.length]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length > 0) {
      setFilteredStations(searchStations(allStations, query));
    } else {
      // Show major cities when search is empty
      setFilteredStations(getMajorCities(allStations));
    }
  };

  const handleSelectCity = (city: DWDStation) => {
    onSelectCity(city);
    setModalVisible(false);
    setSearchQuery('');
    setFilteredStations(getMajorCities(allStations));
  };

  return (
    <View className="w-full mb-6">
      <Button
        size="lg"
        className="w-full"
        onPress={() => setModalVisible(true)}
      >
        <ButtonText>
          {selectedCity ? `${selectedCity.name} (${selectedCity.state})` : 'Wetterstation wählen'}
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
              <Text className="text-2xl font-bold">Wetterstation wählen</Text>
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
                placeholder="Suche Station oder Bundesland..."
                value={searchQuery}
                onChangeText={handleSearch}
              />
            </Input>

            {loading ? (
              <View className="items-center justify-center p-8">
                <Spinner size="large" />
                <Text className="text-gray-600 mt-4">Lade Stationsliste...</Text>
              </View>
            ) : (
              <FlatList
                data={filteredStations}
                keyExtractor={(item) => `${item.id}-${item.name}`}
                renderItem={({ item }) => (
                  <Pressable onPress={() => handleSelectCity(item)}>
                    <Card className="p-4 mb-2">
                      <Text className="text-lg font-semibold">{item.name}</Text>
                      <Text className="text-gray-600 text-sm">
                        {item.height}m • ID: {item.id} • {item.icao !== '----' ? item.icao : ''}
                      </Text>
                    </Card>
                  </Pressable>
                )}
                ListEmptyComponent={
                  <Text className="text-gray-500 text-center mt-4">
                    {allStations.length === 0 
                      ? 'Keine Stationen verfügbar' 
                      : 'Keine Stationen gefunden'}
                  </Text>
                }
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </View>
  );
};

