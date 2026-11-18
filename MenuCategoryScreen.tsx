import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import CategoryTabBar from './CategoryTabBar';
import { useMenuApp } from './Home';
import type { CategoryFilter, MenuCategory, MenuDish, RootStackParamList } from './types';

type CategoryNavigation = StackNavigationProp<RootStackParamList>;

function MenuCategoryScreen({
  category,
  navigation,
}: {
  category: MenuCategory;
  navigation: CategoryNavigation;
}): React.JSX.Element {
  const { menu, quantities, setQuantities } = useMenuApp();
  const [searchText, setSearchText] = useState('');
  const categoryItems = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    return menu.filter((item) =>
      item.category === category &&
      (!query || item.name.toLowerCase().includes(query) || item.description.toLowerCase().includes(query)),
    );
  }, [category, menu, searchText]);
  const cartItemCount = Object.values(quantities).reduce((sum, quantity) => sum + quantity, 0);
  const counts: Record<CategoryFilter, number> = {
    All: menu.length,
    Starters: menu.filter((item) => item.category === 'Starters').length,
    Mains: menu.filter((item) => item.category === 'Mains').length,
    Desserts: menu.filter((item) => item.category === 'Desserts').length,
    Beverages: menu.filter((item) => item.category === 'Beverages').length,
  };

  const changeQuantity = (dishId: string, change: number) => {
    setQuantities((current) => {
      const next = { ...current };
      const quantity = (next[dishId] ?? 0) + change;
      if (quantity > 0) next[dishId] = quantity;
      else delete next[dishId];
      return next;
    });
  };

  const selectCategory = (selected: CategoryFilter) => {
    navigation.navigate(selected === 'All' ? 'Home' : selected);
  };

  const renderDish = ({ item }: { item: MenuDish }) => {
    const quantity = quantities[item.id] ?? 0;
    return (
      <View style={styles.dishCard}>
        <View style={[styles.artwork, { backgroundColor: item.color }]}>
          <Text style={styles.emoji}>{item.emoji}</Text>
        </View>
        <View style={styles.dishDetails}>
          <View style={styles.dishHeading}>
            <Text style={styles.dishName}>{item.name}</Text>
            <Text style={styles.price}>R{item.price.toFixed(2)}</Text>
          </View>
          <Text style={styles.description}>{item.description}</Text>
          {quantity === 0 ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Add ${item.name} to order`}
              onPress={() => changeQuantity(item.id, 1)}
              style={styles.addButton}
            >
              <Text style={styles.addButtonText}>＋ Add to order</Text>
            </Pressable>
          ) : (
            <View style={styles.quantityControl}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Remove one ${item.name}`}
                onPress={() => changeQuantity(item.id, -1)}
                style={styles.quantityButton}
              >
                <Text style={styles.quantityButtonText}>−</Text>
              </Pressable>
              <Text style={styles.quantity}>{quantity} in order</Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Add one ${item.name}`}
                onPress={() => changeQuantity(item.id, 1)}
                style={styles.quantityButton}
              >
                <Text style={styles.quantityButtonText}>＋</Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          onPress={() => navigation.navigate('Home')}
          style={styles.homeButton}
        >
          <Text style={styles.homeButtonText}>‹  Menu home</Text>
        </Pressable>
        <Text style={styles.courseTitle}>{category}</Text>
        <Text style={styles.courseCount}>{counts[category]} dishes · All prices in ZAR</Text>
      </View>

      <TextInput
        accessibilityLabel={`Search ${category.toLowerCase()}`}
        placeholder={`Search ${category.toLowerCase()}...`}
        placeholderTextColor="#8B8174"
        value={searchText}
        onChangeText={setSearchText}
        style={styles.searchInput}
      />

      <FlatList
        data={categoryItems}
        keyExtractor={(item) => item.id}
        renderItem={renderDish}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No dishes found</Text>
            <Text style={styles.emptyMessage}>Try another search.</Text>
          </View>
        }
      />

      <CategoryTabBar active={category} counts={counts} onSelect={selectCategory} />
      <View style={styles.cartDock}>
        <View style={styles.cartCopy}>
          <Text style={styles.cartTitle}>
            {cartItemCount ? `${cartItemCount} ${cartItemCount === 1 ? 'item' : 'items'} in your order` : 'Explore the full menu'}
          </Text>
          <Text style={styles.cartSubtitle}>
            {cartItemCount ? 'Your basket is shared across menu screens' : 'Browse all dishes and add your favourites'}
          </Text>
        </View>
        <Pressable
          accessibilityRole="button"
          onPress={() => navigation.navigate('Order')}
          style={styles.reviewButton}
        >
          <Text style={styles.reviewButtonText}>{cartItemCount ? 'Review order  →' : 'See full menu  →'}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

export function StartersScreen({
  navigation,
}: StackScreenProps<RootStackParamList, 'Starters'>): React.JSX.Element {
  return <MenuCategoryScreen category="Starters" navigation={navigation} />;
}

export function MainsScreen({
  navigation,
}: StackScreenProps<RootStackParamList, 'Mains'>): React.JSX.Element {
  return <MenuCategoryScreen category="Mains" navigation={navigation} />;
}

export function DessertsScreen({
  navigation,
}: StackScreenProps<RootStackParamList, 'Desserts'>): React.JSX.Element {
  return <MenuCategoryScreen category="Desserts" navigation={navigation} />;
}

export function BeveragesScreen({
  navigation,
}: StackScreenProps<RootStackParamList, 'Beverages'>): React.JSX.Element {
  return <MenuCategoryScreen category="Beverages" navigation={navigation} />;
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAF7F1' },
  header: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 10 },
  homeButton: { alignSelf: 'flex-start', paddingVertical: 6, paddingRight: 12 },
  homeButtonText: { color: '#365A3D', fontSize: 13, fontWeight: '700' },
  courseTitle: { color: '#352A20', fontFamily: 'Georgia', fontSize: 29, marginTop: 7 },
  courseCount: { color: '#7B7062', fontSize: 11, marginTop: 4 },
  searchInput: {
    marginHorizontal: 20,
    marginBottom: 12,
    paddingHorizontal: 14,
    minHeight: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5DCCF',
    backgroundColor: '#fff',
    color: '#352A20',
    fontSize: 13,
  },
  listContent: { paddingHorizontal: 18, paddingBottom: 12 },
  dishCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E8DFD3',
    borderRadius: 15,
    marginBottom: 10,
    padding: 10,
  },
  artwork: {
    width: 76,
    minHeight: 80,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  emoji: { fontSize: 30 },
  dishDetails: { flex: 1, justifyContent: 'center' },
  dishHeading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  dishName: { flex: 1, color: '#352A20', fontSize: 14, fontWeight: '700', marginRight: 8 },
  price: { color: '#365A3D', fontSize: 13, fontWeight: '800' },
  description: { color: '#7B7062', fontSize: 10, lineHeight: 15, marginTop: 5, marginBottom: 8 },
  addButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#365A3D',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  addButtonText: { color: '#FFF9EF', fontSize: 10, fontWeight: '700' },
  quantityControl: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start' },
  quantityButton: {
    width: 30,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EAECDD',
    borderRadius: 8,
  },
  quantityButtonText: { color: '#365A3D', fontSize: 17, fontWeight: '700' },
  quantity: { color: '#352A20', fontSize: 10, fontWeight: '700', marginHorizontal: 9 },
  emptyState: { alignItems: 'center', padding: 36 },
  emptyTitle: { color: '#352A20', fontFamily: 'Georgia', fontSize: 18 },
  emptyMessage: { color: '#7B7062', fontSize: 12, marginTop: 5 },
  cartDock: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E5DCCF',
    paddingHorizontal: 18,
    paddingVertical: 11,
  },
  cartCopy: { flex: 1, marginRight: 8 },
  cartTitle: { color: '#352A20', fontFamily: 'Georgia', fontSize: 13 },
  cartSubtitle: { color: '#7B7062', fontSize: 9, marginTop: 3 },
  reviewButton: {
    minHeight: 42,
    justifyContent: 'center',
    backgroundColor: '#365A3D',
    borderRadius: 10,
    paddingHorizontal: 13,
  },
  reviewButtonText: { color: '#FFF9EF', fontSize: 10, fontWeight: '700' },
});
