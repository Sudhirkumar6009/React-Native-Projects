import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Button } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface FlagModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectFlag: (id: string) => void;
  selectedFlagId: string | null;
}

const FlagModal: React.FC<FlagModalProps> = ({ visible, onClose, onSelectFlag, selectedFlagId }) => {
  const flags = [
    { id: '1', text: 'Priority 1' },
    { id: '2', text: 'Priority 2' },
    { id: '3', text: 'Priority 3' },
    { id: '4', text: 'Priority 4' },
    { id: '5', text: 'Priority 5' },
    { id: '6', text: 'Priority 6' },
  ];

  const colors = ['blue', 'green', 'red', 'purple', 'orange', 'cyan'];

  const handlePress = (id: string) => {
    onSelectFlag(id);
  };

  const renderItem = ({ item }: { item: { id: string; text: string } }) => {
    const index = parseInt(item.id, 10) - 1;
    const color = colors[index];
    const isSelected = selectedFlagId === item.id;

    return (
      <>
        <View style={styles.itemContainer}>
          <Text style={styles.itemText}>{item.text}</Text>
          <TouchableOpacity style={styles.iconContainer} onPress={() => handlePress(item.id)}>
            <Icon
              name={isSelected ? 'checkmark-circle' : 'close-circle-sharp'}
              size={30}
              color={isSelected ? color : '#cccccc'}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.separator} />
      </>
    );
  };

  return (
    visible ? (
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <FlatList
            data={flags}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
          />
          <Button title="Close" onPress={onClose} />
        </View>
      </View>
    ) : null
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  listContainer: {
    paddingBottom: 20,
  },
  itemContainer: {
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  itemText: {
    fontSize: 18,
    color: 'black',
  },
  iconContainer: {
    paddingHorizontal: 10,
  },
  separator: {
    height: 0.7,
    backgroundColor: 'black',
    opacity: 0.1,
    width: '100%',
  },
});

export default FlagModal;
