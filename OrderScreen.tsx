import React, { useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { StackScreenProps } from '@react-navigation/stack';
import CategoryTabBar from './CategoryTabBar';
import { useMenuApp } from './Home';
import type { CategoryFilter, MenuCategory, OrderType, RootStackParamList } from './types';

const DELIVERY_FEE = 35;
const TAX_RATE = 0.05;

export default function OrderScreen({
  navigation,
}: StackScreenProps<RootStackParamList, 'Order'>): React.JSX.Element {
  const { menu, quantities, setQuantities } = useMenuApp();
  const [orderType, setOrderType] = useState<OrderType>('Dine in');
  const [tableNumber, setTableNumber] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [promoMessage, setPromoMessage] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [receipt, setReceipt] = useState<{ number: string; details: string; total: number } | null>(null);

  const cartItems = useMemo(
    () => menu.filter((dish) => (quantities[dish.id] ?? 0) > 0),
    [menu, quantities],
  );
  const itemCount = cartItems.reduce((sum, dish) => sum + quantities[dish.id], 0);
  const subtotal = cartItems.reduce((sum, dish) => sum + dish.price * quantities[dish.id], 0);
  const deliveryFee = orderType === 'Delivery' ? DELIVERY_FEE : 0;
  const discount = promoApplied ? Math.round(subtotal * 0.05 * 100) / 100 : 0;
  const tax = Math.round((subtotal - discount + deliveryFee) * TAX_RATE * 100) / 100;
  const total = subtotal - discount + deliveryFee + tax;
  const counts: Record<CategoryFilter, number> = {
    All: menu.length,
    Starters: menu.filter((dish) => dish.category === 'Starters').length,
    Mains: menu.filter((dish) => dish.category === 'Mains').length,
    Desserts: menu.filter((dish) => dish.category === 'Desserts').length,
    Beverages: menu.filter((dish) => dish.category === 'Beverages').length,
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

  const selectCategory = (category: CategoryFilter) => {
    navigation.navigate(category === 'All' ? 'Home' : category);
  };

  const applyPromoCode = () => {
    const isValid = promoCode.trim().toLowerCase() === 'summer5';
    setPromoApplied(isValid);
    setPromoMessage(isValid ? 'Summer5 applied · 5% off' : 'That promo code is not valid.');
  };

  const placeOrder = () => {
    setOrderError('');
    if (itemCount === 0) {
      setOrderError('Add something from the menu before checking out.');
      return;
    }
    if (orderType === 'Dine in' && !tableNumber.trim()) {
      setOrderError('Please enter your table number to continue.');
      return;
    }
    if (orderType === 'Delivery' && !deliveryAddress.trim()) {
      setOrderError('Please enter a delivery address to continue.');
      return;
    }

    const serviceDetails = orderType === 'Dine in'
      ? `Dine in · Table ${tableNumber.trim()}`
      : `Delivery · ${deliveryAddress.trim()}`;
    const notes = specialInstructions.trim() ? ` · Notes: ${specialInstructions.trim()}` : '';
    setReceipt({
      number: String(Date.now()).slice(-5),
      details: `${serviceDetails}${notes}`,
      total,
    });
    setQuantities({});
    setTableNumber('');
    setDeliveryAddress('');
    setSpecialInstructions('');
    setPromoCode('');
    setPromoApplied(false);
    setPromoMessage('');
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
        <Text style={styles.title}>Your order</Text>
        <Text style={styles.subtitle}>Review your choices and place a local order preview.</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {cartItems.length === 0 ? (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Explore our menu</Text>
            <Text style={styles.menuIntro}>Choose from today’s favourites below.</Text>
            {(['Starters', 'Mains', 'Desserts', 'Beverages'] as MenuCategory[]).map((category) => (
              <View key={category} style={styles.menuSection}>
                <Text style={styles.menuCategory}>{category}</Text>
                {menu.filter((dish) => dish.category === category).map((dish) => (
                  <View key={dish.id} style={styles.menuDish}>
                    <View style={[styles.menuDishIcon, { backgroundColor: dish.color }]}>
                      <Text style={styles.dishEmoji}>{dish.emoji}</Text>
                    </View>
                    <View style={styles.menuDishInfo}>
                      <Text style={styles.dishName}>{dish.name}</Text>
                      <Text style={styles.menuDishDescription}>{dish.description}</Text>
                    </View>
                    <View style={styles.menuDishAction}>
                      <Text style={styles.menuDishPrice}>R{dish.price.toFixed(2)}</Text>
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel={`Add ${dish.name} to order`}
                        onPress={() => changeQuantity(dish.id, 1)}
                        style={styles.menuAddButton}
                      >
                        <Text style={styles.menuAddText}>＋ Add</Text>
                      </Pressable>
                    </View>
                  </View>
                ))}
              </View>
            ))}
          </View>
        ) : (
          <>
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Your dishes</Text>
              {cartItems.map((dish) => (
                <View key={dish.id} style={styles.orderLine}>
                  <View style={[styles.dishIcon, { backgroundColor: dish.color }]}>
                    <Text style={styles.dishEmoji}>{dish.emoji}</Text>
                  </View>
                  <View style={styles.dishInfo}>
                    <Text style={styles.dishName}>{dish.name}</Text>
                    <Text style={styles.dishUnitPrice}>R{dish.price.toFixed(2)} each</Text>
                  </View>
                  <View style={styles.quantityControl}>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={`Remove one ${dish.name}`}
                      onPress={() => changeQuantity(dish.id, -1)}
                      style={styles.quantityButton}
                    >
                      <Text style={styles.quantityButtonText}>−</Text>
                    </Pressable>
                    <Text style={styles.quantity}>{quantities[dish.id]}</Text>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={`Add one ${dish.name}`}
                      onPress={() => changeQuantity(dish.id, 1)}
                      style={styles.quantityButton}
                    >
                      <Text style={styles.quantityButtonText}>＋</Text>
                    </Pressable>
                  </View>
                  <Text style={styles.lineTotal}>R{(dish.price * quantities[dish.id]).toFixed(2)}</Text>
                </View>
              ))}

              <View style={styles.promoRow}>
                <TextInput
                  accessibilityLabel="Promo code"
                  autoCapitalize="characters"
                  onChangeText={(text) => {
                    setPromoCode(text);
                    setPromoApplied(false);
                    setPromoMessage('');
                  }}
                  placeholder="Promo code"
                  placeholderTextColor="#8B8174"
                  value={promoCode}
                  style={styles.promoInput}
                />
                <Pressable accessibilityRole="button" onPress={applyPromoCode} style={styles.promoButton}>
                  <Text style={styles.promoButtonText}>Apply</Text>
                </Pressable>
              </View>
              {promoMessage ? (
                <Text style={[styles.promoMessage, !promoApplied && styles.errorText]}>{promoMessage}</Text>
              ) : null}
            </View>

            <View style={styles.card}>
              <Text style={styles.sectionTitle}>How would you like to enjoy?</Text>
              <View style={styles.orderTypeRow}>
                {(['Dine in', 'Delivery'] as OrderType[]).map((type) => {
                  const selected = orderType === type;
                  return (
                    <Pressable
                      key={type}
                      accessibilityRole="button"
                      accessibilityState={{ selected }}
                      onPress={() => {
                        setOrderType(type);
                        setOrderError('');
                      }}
                      style={[styles.orderTypeButton, selected && styles.orderTypeSelected]}
                    >
                      <Text style={[styles.orderTypeText, selected && styles.orderTypeTextSelected]}>
                        {type === 'Dine in' ? '♧  Dine in' : '⌂  Delivery'}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
              {orderType === 'Dine in' ? (
                <TextInput
                  accessibilityLabel="Table number"
                  keyboardType="number-pad"
                  onChangeText={setTableNumber}
                  placeholder="Table number"
                  placeholderTextColor="#8B8174"
                  value={tableNumber}
                  style={styles.input}
                />
              ) : (
                <TextInput
                  accessibilityLabel="Delivery address"
                  onChangeText={setDeliveryAddress}
                  placeholder="Delivery address"
                  placeholderTextColor="#8B8174"
                  value={deliveryAddress}
                  style={styles.input}
                />
              )}
              <TextInput
                accessibilityLabel="Special instructions"
                onChangeText={setSpecialInstructions}
                placeholder="Special instructions (optional)"
                placeholderTextColor="#8B8174"
                value={specialInstructions}
                style={[styles.input, styles.multilineInput]}
                multiline
              />
            </View>

            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Cost summary</Text>
              <SummaryLine label={`Subtotal · ${itemCount} ${itemCount === 1 ? 'item' : 'items'}`} value={`R${subtotal.toFixed(2)}`} />
              <SummaryLine label="Delivery" value={`R${deliveryFee.toFixed(2)}`} />
              {discount > 0 ? <SummaryLine label="Summer5 discount (5%)" value={`−R${discount.toFixed(2)}`} /> : null}
              <SummaryLine label="Tax (5%)" value={`R${tax.toFixed(2)}`} />
              <View style={styles.totalLine}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>R{total.toFixed(2)}</Text>
              </View>
              {orderError ? <Text style={styles.errorText}>{orderError}</Text> : null}
              <Pressable accessibilityRole="button" onPress={placeOrder} style={styles.placeOrderButton}>
                <Text style={styles.placeOrderText}>Place order · R{total.toFixed(2)}</Text>
              </Pressable>
              <Text style={styles.demoNote}>This creates a local order preview only; no payment is taken.</Text>
            </View>
          </>
        )}
      </ScrollView>

      <CategoryTabBar active="All" counts={counts} onSelect={selectCategory} />

      <Modal
        animationType="fade"
        onRequestClose={() => setReceipt(null)}
        transparent
        visible={receipt !== null}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.receiptCard}>
            <Text style={styles.receiptEyebrow}>ORDER PREVIEW</Text>
            <Text style={styles.receiptTitle}>Thank you!</Text>
            <Text style={styles.receiptDetails}>Reference #{receipt?.number}</Text>
            <Text style={styles.receiptDetails}>{receipt?.details}</Text>
            <Text style={styles.receiptTotal}>Total: R{receipt?.total.toFixed(2)}</Text>
            <Text style={styles.demoNote}>This order has not been sent to a restaurant.</Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => {
                setReceipt(null);
                navigation.navigate('Home');
              }}
              style={styles.placeOrderButton}
            >
              <Text style={styles.placeOrderText}>Done</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function SummaryLine({ label, value }: { label: string; value: string }): React.JSX.Element {
  return (
    <View style={styles.summaryLine}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={styles.summaryValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAF7F1' },
  header: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8 },
  homeButton: { alignSelf: 'flex-start', paddingVertical: 6, paddingRight: 12 },
  homeButtonText: { color: '#365A3D', fontSize: 13, fontWeight: '700' },
  title: { color: '#352A20', fontFamily: 'Georgia', fontSize: 29, marginTop: 7 },
  subtitle: { color: '#7B7062', fontSize: 11, marginTop: 4 },
  content: { paddingHorizontal: 16, paddingBottom: 20 },
  card: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E8DFD3',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  sectionTitle: { color: '#352A20', fontFamily: 'Georgia', fontSize: 17, marginBottom: 11 },
  orderLine: { flexDirection: 'row', alignItems: 'center', paddingVertical: 9, borderBottomWidth: 1, borderBottomColor: '#F0E9DF' },
  dishIcon: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 9 },
  dishEmoji: { fontSize: 20 },
  dishInfo: { flex: 1, marginRight: 5 },
  dishName: { color: '#352A20', fontSize: 11, fontWeight: '700' },
  dishUnitPrice: { color: '#8B8174', fontSize: 9, marginTop: 3 },
  quantityControl: { flexDirection: 'row', alignItems: 'center' },
  quantityButton: { width: 25, height: 25, borderRadius: 7, alignItems: 'center', justifyContent: 'center', backgroundColor: '#EAECDD' },
  quantityButtonText: { color: '#365A3D', fontSize: 15, fontWeight: '700' },
  quantity: { color: '#352A20', fontSize: 11, fontWeight: '700', marginHorizontal: 6 },
  lineTotal: { color: '#365A3D', fontSize: 10, fontWeight: '800', minWidth: 49, textAlign: 'right', marginLeft: 5 },
  promoRow: { flexDirection: 'row', marginTop: 12 },
  promoInput: { flex: 1, height: 40, borderWidth: 1, borderColor: '#E5DCCF', borderRadius: 9, paddingHorizontal: 11, color: '#352A20', fontSize: 11 },
  promoButton: { marginLeft: 7, paddingHorizontal: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: '#EAECDD', borderRadius: 9 },
  promoButtonText: { color: '#365A3D', fontSize: 10, fontWeight: '800' },
  promoMessage: { color: '#365A3D', fontSize: 10, marginTop: 6 },
  orderTypeRow: { flexDirection: 'row', marginBottom: 11 },
  orderTypeButton: { flex: 1, alignItems: 'center', justifyContent: 'center', minHeight: 40, borderWidth: 1, borderColor: '#E5DCCF', borderRadius: 9, marginRight: 6 },
  orderTypeSelected: { backgroundColor: '#EAECDD', borderColor: '#365A3D' },
  orderTypeText: { color: '#73685B', fontSize: 11, fontWeight: '700' },
  orderTypeTextSelected: { color: '#365A3D' },
  input: { minHeight: 42, borderWidth: 1, borderColor: '#E5DCCF', borderRadius: 9, paddingHorizontal: 11, color: '#352A20', fontSize: 11, marginBottom: 9, backgroundColor: '#FFFEFC' },
  multilineInput: { minHeight: 64, paddingTop: 11, textAlignVertical: 'top', marginBottom: 0 },
  summaryLine: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 },
  summaryLabel: { color: '#73685B', fontSize: 11 },
  summaryValue: { color: '#352A20', fontSize: 11, fontWeight: '600' },
  totalLine: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#E5DCCF', marginTop: 5, paddingTop: 10 },
  totalLabel: { color: '#352A20', fontFamily: 'Georgia', fontSize: 17 },
  totalValue: { color: '#365A3D', fontSize: 17, fontWeight: '800' },
  errorText: { color: '#A04432', fontSize: 10, marginTop: 7 },
  placeOrderButton: { minHeight: 43, alignItems: 'center', justifyContent: 'center', backgroundColor: '#365A3D', borderRadius: 10, marginTop: 12 },
  placeOrderText: { color: '#FFF9EF', fontSize: 11, fontWeight: '800' },
  demoNote: { color: '#8B8174', fontSize: 9, lineHeight: 14, marginTop: 8, textAlign: 'center' },
  menuIntro: { color: '#7B7062', fontSize: 11, marginTop: -5, marginBottom: 9 },
  menuSection: { marginTop: 9 },
  menuCategory: { color: '#A76649', fontSize: 10, fontWeight: '800', letterSpacing: 0.8, marginBottom: 3, textTransform: 'uppercase' },
  menuDish: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F0E9DF' },
  menuDishIcon: { width: 36, height: 36, borderRadius: 9, alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  menuDishInfo: { flex: 1, marginRight: 6 },
  menuDishDescription: { color: '#8B8174', fontSize: 9, lineHeight: 13, marginTop: 3 },
  menuDishAction: { alignItems: 'flex-end' },
  menuDishPrice: { color: '#365A3D', fontSize: 10, fontWeight: '800', marginBottom: 5 },
  menuAddButton: { minWidth: 48, alignItems: 'center', backgroundColor: '#365A3D', borderRadius: 7, paddingHorizontal: 7, paddingVertical: 5 },
  menuAddText: { color: '#FFF9EF', fontSize: 9, fontWeight: '700' },
  modalBackdrop: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: 'rgba(32, 27, 21, 0.55)' },
  receiptCard: { backgroundColor: '#FAF7F1', borderRadius: 18, padding: 22 },
  receiptEyebrow: { color: '#A76649', fontSize: 9, fontWeight: '800', letterSpacing: 1.4 },
  receiptTitle: { color: '#352A20', fontFamily: 'Georgia', fontSize: 25, marginTop: 6, marginBottom: 12 },
  receiptDetails: { color: '#62584D', fontSize: 12, lineHeight: 18, marginBottom: 5 },
  receiptTotal: { color: '#365A3D', fontSize: 15, fontWeight: '800', marginTop: 8 },
});
