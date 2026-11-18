import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, SafeAreaView, ListRenderItemInfo } from 'react-native';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
}

const mainItems: MenuItem[] = [
  { id: '1', name: 'Classic Cheeseburger', description: 'Flame-grilled beef patty, cheddar cheese, pickles, and house sauce.', price: 120 },
  { id: '2', name: 'Sirloin Steak', description: '300g sirloin steak cooked to perfection with garlic herb butter.', price: 195 },
  { id: '3', name: 'Classic Spicy Tuna Roll', description: 'Fresh tuna, spicy mayo, scallions, avocado, and chilli in nori rice.', price: 250 },
  { id: '4', name: 'Linguine Carbonara', description: 'Traditional Italian pasta with pancetta, egg yolk, and parmesan.', price: 140 },
];

export default function MainsScreen(): React.JSX.Element {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerTitle}>Main Courses</Text>
      <Text style={styles.subTitle}>Select or manage main course meals</Text>

      <FlatList
        data={mainItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }: ListRenderItemInfo<MenuItem>) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.dishName}>{item.name}</Text>
              <Text style={styles.dishPrice}>R{item.price}</Text>
            </View>
            <Text style={styles.dishDescription}>{item.description}</Text>
            <TouchableOpacity style={styles.addButton}>
              <Text style={styles.addButtonText}>+ Add to Order</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 15 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#1565c0', textAlign: 'center', marginTop: 10 },
  subTitle: { fontSize: 13, color: '#666', textAlign: 'center', marginBottom: 15 },
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 12, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dishName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  dishPrice: { fontSize: 16, fontWeight: 'bold', color: '#1565c0' },
  dishDescription: { fontSize: 13, color: '#666', marginVertical: 8 },
  addButton: { backgroundColor: '#1565c0', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 5, alignSelf: 'flex-start' },
  addButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
});