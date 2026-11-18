import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, SafeAreaView, ListRenderItemInfo } from 'react-native';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
}

const desertItems: MenuItem[] = [
  { id: '1', name: 'Chocolate Lava Cake', description: 'Warm chocolate cake with a molten chocolate center and vanilla ice cream.', price: 75 },
  { id: '2', name: 'Tiramisu', description: 'Classic Italian dessert with espresso-soaked ladyfingers and mascarpone.', price: 80 },
  { id: '3', name: 'Artisanal Ice Cream', description: 'Three scoops of handcrafted ice cream (Vanilla, Chocolate, Strawberry).', price: 55 },
  { id: '4', name: 'Cheesecake', description: 'Creamy cheesecake with a graham cracker crust and berry compote.', price: 70 },
  { id: '5', name: 'Fruit Tart', description: 'Crispy tart shell filled with custard and topped with fresh seasonal fruits.', price: 65 },
  { id: '6', name: 'Panna Cotta', description: 'Silky smooth Italian dessert made with cream and gelatin, served with berry sauce.', price: 60 },
  { id: '7', name: 'Banoffee Pie', description: 'A delightful pie made with bananas, cream, and toffee on a biscuit base.', price: 68 },
];

export default function DesertScreen(): React.JSX.Element {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerTitle}>Desserts</Text>
      <Text style={styles.subTitle}>Select or manage sweet treats</Text>

      <FlatList
        data={desertItems}
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
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#c2185b', textAlign: 'center', marginTop: 10 },
  subTitle: { fontSize: 13, color: '#666', textAlign: 'center', marginBottom: 15 },
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 12, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dishName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  dishPrice: { fontSize: 16, fontWeight: 'bold', color: '#c2185b' },
  dishDescription: { fontSize: 13, color: '#666', marginVertical: 8 },
  addButton: { backgroundColor: '#c2185b', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 5, alignSelf: 'flex-start' },
  addButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
});