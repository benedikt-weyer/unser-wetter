import React, { useState } from 'react';
import { FlatList, Pressable, View } from 'react-native';
import { City, GERMAN_CITIES, searchCities } from '../data/germanCities';
import { Button, ButtonText } from './ui/button';
import { Card } from './ui/card';
import { Input, InputField } from './ui/input';
import { Modal, ModalBackdrop, ModalBody, ModalContent, ModalHeader } from './ui/modal';
import { Text } from './ui/text';

interface RegionSelectProps {
  selectedCity: City | null;
  onSelectCity: (city: City) => void;
}

export const RegionSelect: React.FC<RegionSelectProps> = ({ selectedCity, onSelectCity }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCities, setFilteredCities] = useState<City[]>(GERMAN_CITIES);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setFilteredCities(searchCities(query));
  };

  const handleSelectCity = (city: City) => {
    onSelectCity(city);
    setModalVisible(false);
    setSearchQuery('');
    setFilteredCities(GERMAN_CITIES);
  };

  return (
    <View className="w-full mb-6">
      <Button
        size="lg"
        className="w-full"
        onPress={() => setModalVisible(true)}
      >
        <ButtonText>
          {selectedCity ? `${selectedCity.name}, ${selectedCity.state}` : 'Stadt wählen'}
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
                placeholder="Suche Stadt oder Bundesland..."
                value={searchQuery}
                onChangeText={handleSearch}
              />
            </Input>

            <FlatList
              data={filteredCities}
              keyExtractor={(item) => `${item.id}-${item.name}`}
              renderItem={({ item }) => (
                <Pressable onPress={() => handleSelectCity(item)}>
                  <Card className="p-4 mb-2">
                    <Text className="text-lg font-semibold">{item.name}</Text>
                    <Text className="text-gray-600 text-sm">{item.state}</Text>
                  </Card>
                </Pressable>
              )}
              ListEmptyComponent={
                <Text className="text-gray-500 text-center mt-4">Keine Städte gefunden</Text>
              }
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </View>
  );
};

