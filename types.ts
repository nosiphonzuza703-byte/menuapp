export type MenuCategory = 'Starters' | 'Mains' | 'Desserts' | 'Beverages';
export type CategoryFilter = 'All' | MenuCategory;
export type OrderType = 'Dine in' | 'Delivery';

export interface MenuDish {
  id: string;
  name: string;
  description: string;
  category: MenuCategory;
  price: number;
  emoji: string;
  color: string;
  tag?: string;
  dietary?: string;
  isSushi?: boolean;
}

export type RootStackParamList = {
  Home: undefined;
  Starters: undefined;
  Mains: undefined;
  Desserts: undefined;
  Beverages: undefined;
  Order: undefined;
};
