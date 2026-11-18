import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import type { MenuCategory, MenuDish } from './types';

export default function AddEditItemScreen({
  navigation,
  route,
}: {
  navigation: { goBack: () => void };
  route: { params?: { itemToEdit?: MenuDish } };
}): React.JSX.Element {
  const itemToEdit = route.params?.itemToEdit;
  const isEditMode = !!itemToEdit;
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [course, setCourse] = useState<MenuCategory>('Mains');
  const [price, setPrice] = useState('');
  const [nameError, setNameError] = useState('');
  const [priceError, setPriceError] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (itemToEdit) {
      setName(itemToEdit.name);
      setDescription(itemToEdit.description);
      setCourse(itemToEdit.category);
      setPrice(itemToEdit.price.toString());
    }
  }, [itemToEdit]);

  const validateForm = () => {
    let valid = true;
    setNameError('');
    setPriceError('');
    if (!name.trim()) {
      setNameError('Dish name is required.');
      valid = false;
    }
    const parsedPrice = Number(price);
    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      setPriceError('Enter a valid price greater than zero.');
      valid = false;
    }
    return valid;
  };

  const handleSaveItem = () => {
    if (!validateForm()) return;
    setProcessing(true);
    Alert.alert(
      'Menu item saved',
      isEditMode ? 'Your menu item was updated.' : 'Your menu item was added.',
      [{ text: 'OK', onPress: () => navigation.goBack() }],
    );
    setProcessing(false);
  };

  const courseOptions: MenuCategory[] = ['Starters', 'Mains', 'Desserts', 'Beverages'];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Dish Name*</Text>
          <TextInput
            style={[styles.input, nameError && styles.errorInput]}
            placeholder="e.g. Traditional Spicy Tuna"
            value={name}
            onChangeText={(text) => {
              setName(text);
              setNameError('');
            }}
          />
          {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describe the dish"
            value={description}
            onChangeText={setDescription}
            multiline
            textAlignVertical="top"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Menu Category*</Text>
          <View style={styles.courseRow}>
            {courseOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={[styles.courseBtn, course === option && styles.activeCourseBtn]}
                onPress={() => setCourse(option)}
              >
                <Text style={[styles.courseBtnText, course === option && styles.activeCourseBtnText]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Price (R)*</Text>
          <TextInput
            style={[styles.input, priceError && styles.errorInput]}
            placeholder="e.g. 250"
            value={price}
            onChangeText={(text) => {
              setPrice(text);
              setPriceError('');
            }}
            keyboardType="numeric"
          />
          {priceError ? <Text style={styles.errorText}>{priceError}</Text> : null}
        </View>

        {processing ? (
          <ActivityIndicator size="large" color="#315d82" style={{ marginTop: 20 }} />
        ) : (
          <TouchableOpacity style={styles.primaryActionBtn} onPress={handleSaveItem}>
            <Text style={styles.primaryActionBtnText}>
              {isEditMode ? 'Update Menu Item' : 'Add to Menu'}
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.secondaryActionBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.secondaryActionBtnText}>Cancel</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { padding: 20 },
  inputGroup: { marginBottom: 15 },
  label: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    height: 45,
    fontSize: 14,
    color: '#333',
  },
  textArea: { height: 100, paddingVertical: 10 },
  errorInput: { borderColor: '#d32f2f' },
  errorText: { fontSize: 11, color: '#d32f2f', marginTop: 4, marginLeft: 5 },
  courseRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  courseBtn: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeCourseBtn: { backgroundColor: '#e7edf3', borderColor: '#315d82' },
  courseBtnText: { fontSize: 12, fontWeight: 'bold', color: '#666' },
  activeCourseBtnText: { color: '#315d82' },
  primaryActionBtn: {
    backgroundColor: '#315d82',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
  },
  primaryActionBtnText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  secondaryActionBtn: { paddingVertical: 12, alignItems: 'center', marginTop: 10 },
  secondaryActionBtnText: { color: '#666', fontSize: 14, fontWeight: 'bold' },
});
