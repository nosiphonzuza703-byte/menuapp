import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { CategoryFilter } from './types';

const categories: CategoryFilter[] = ['All', 'Starters', 'Mains', 'Desserts', 'Beverages'];
const icons: Record<CategoryFilter, string> = {
  All: '🍽️',
  Starters: '🥗',
  Mains: '🍲',
  Desserts: '🍰',
  Beverages: '🥤',
};

interface CategoryTabBarProps {
  active: CategoryFilter;
  counts: Record<CategoryFilter, number>;
  onSelect: (category: CategoryFilter) => void;
}

export default function CategoryTabBar({
  active,
  counts,
  onSelect,
}: CategoryTabBarProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      {categories.map((category) => {
        const selected = active === category;
        return (
          <Pressable
            key={category}
            accessibilityRole="button"
            accessibilityLabel={`${category}, ${counts[category]} dishes`}
            accessibilityState={{ selected }}
            onPress={() => onSelect(category)}
            style={[styles.tab, selected && styles.selectedTab]}
          >
            <Text style={styles.icon}>{icons[category]}</Text>
            <Text style={[styles.label, selected && styles.selectedLabel]}>
              {category === 'Beverages' ? 'Drinks' : category}
            </Text>
            <Text style={[styles.count, selected && styles.selectedLabel]}>
              {counts[category]}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E5DCCF',
    paddingHorizontal: 6,
    paddingTop: 7,
    paddingBottom: 5,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
    borderRadius: 10,
    marginHorizontal: 2,
  },
  selectedTab: {
    backgroundColor: '#EAECDD',
  },
  icon: {
    fontSize: 16,
    marginBottom: 2,
  },
  label: {
    color: '#73685B',
    fontSize: 8,
    fontWeight: '700',
  },
  count: {
    color: '#8B8174',
    fontSize: 7,
    marginTop: 2,
  },
  selectedLabel: {
    color: '#365A3D',
    fontWeight: '800',
  },
});
