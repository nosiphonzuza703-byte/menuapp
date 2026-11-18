import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, SafeAreaView, ListRenderItemInfo } from 'react-native';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
}

const starterItems: MenuItem[] = [
  { id: '1', name: 'Mushroom Soup', description: 'Creamy wild mushroom soup with garlic croutons and fresh herbs.', price: 75 },
  { id: '2', name: 'Caesar Salad', description: 'Fresh cos lettuce, parmesan cheese, crispy croutons, and creamy dressing.', price: 95 },
  { id: '3', name: 'Avocado Toast', description: 'Fresh avocado on toasted sourdough with chilli flakes and feta.', price: 85 },
  { id: '4', name: 'Garlic Butter Bread', description: 'Toasted baguette with garlic butter and melted mozzarella.', price: 60 },
];

export default function StarterScreen(): React.JSX.Element {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerTitle}>Starter Course</Text>
      <Text style={styles.subTitle}>Select or manage starter dishes</Text>

      <FlatList
        data={starterItems}
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
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#2e7d32', textAlign: 'center', marginTop: 10 },
  subTitle: { fontSize: 13, color: '#666', textAlign: 'center', marginBottom: 15 },
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 12, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dishName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  dishPrice: { fontSize: 16, fontWeight: 'bold', color: '#2e7d32' },
  dishDescription: { fontSize: 13, color: '#666', marginVertical: 8 },
  addButton: { backgroundColor: '#2e7d32', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 5, alignSelf: 'flex-start' },
  addButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
});