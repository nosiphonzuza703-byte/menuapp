import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, SafeAreaView, ListRenderItemInfo } from 'react-native';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
}

const beverageItems: MenuItem[] = [
  { id: '1', name: 'Fresh Orange Juice', description: 'Freshly squeezed 100% natural orange juice.', price: 35 },
  { id: '2', name: 'Espresso / Cappuccino', description: 'Freshly brewed artisanal coffee with hot milk.', price: 32 },
  { id: '3', name: 'Iced Lemon Tea', description: 'Refreshing home-brewed tea with fresh lemon slices and mint.', price: 38 },
  { id: '4', name: 'Sparkling Mineral Water', description: '500ml chilled sparkling water.', price: 25 },
];

export default function BeveragesScreen(): React.JSX.Element {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerTitle}>Beverages</Text>
      <Text style={styles.subTitle}>Select or manage drinks and beverages</Text>

      <FlatList
        data={beverageItems}
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
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#f57c00', textAlign: 'center', marginTop: 10 },
  subTitle: { fontSize: 13, color: '#666', textAlign: 'center', marginBottom: 15 },
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 12, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dishName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  dishPrice: { fontSize: 16, fontWeight: 'bold', color: '#f57c00' },
  dishDescription: { fontSize: 13, color: '#666', marginVertical: 8 },
  addButton: { backgroundColor: '#f57c00', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 5, alignSelf: 'flex-start' },
  addButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
});