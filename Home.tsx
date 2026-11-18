import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
} from 'react';
import {
  FlatList,
  Linking,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import CategoryTabBar from './CategoryTabBar';
import { CategoryFilter, MenuCategory, MenuDish, OrderType, RootStackParamList } from './types';

const initialMenu: MenuDish[] = [
  {
    id: '1',
    name: 'Mushroom Soup',
    description: 'Creamy wild mushroom soup with garlic croutons and fresh herbs.',
    category: 'Starters',
    price: 75,
    emoji: '🍄',
    color: '#F0E7DB',
  },
  {
    id: '2',
    name: 'Caesar Salad',
    description: 'Cos lettuce, parmesan, croutons, and creamy dressing.',
    category: 'Mains',
    price: 95,
    emoji: '🥗',
    color: '#F1E8DA',
  },
  {
    id: '3',
    name: 'Avocado Toast',
    description: 'Fresh avocado on toasted sourdough with chilli flakes and feta.',
    category: 'Mains',
    price: 85,
    emoji: '🥑',
    color: '#E5EBDD',
  },
  {
    id: '4',
    name: 'Garlic Butter Bread',
    description: 'Toasted baguette with garlic butter and melted mozzarella.',
    category: 'Starters',
    price: 60,
    emoji: '🥖',
    color: '#EFE6D9',
  },
  {
    id: '5',
    name: 'Classic Cheeseburger',
    description: 'Flame-grilled beef patty, cheddar cheese, pickles, and house sauce.',
    category: 'Mains',
    price: 120,
    emoji: '🍔',
    color: '#E8ECDD',
  },
  {
    id: '6',
    name: 'Sirloin Steak',
    description: '300g sirloin steak cooked to perfection with garlic herb butter.',
    category: 'Mains',
    price: 195,
    emoji: '🥩',
    color: '#EEE5D8',
  },
  {
    id: '7',
    name: 'Classic Spicy Tuna Roll',
    description: 'Fresh tuna, spicy mayo, scallions, avocado, and chilli in nori rice.',
    category: 'Mains',
    price: 250,
    emoji: '🍣',
    color: '#E5EBDD',
    isSushi: true,
  },
  {
    id: '8',
    name: 'California Roll',
    description: 'Crab, avocado, and cucumber rolled in seasoned rice and nori.',
    category: 'Mains',
    price: 180,
    emoji: '🍣',
    color: '#F0E7DA',
    isSushi: true,
  },
  {
    id: '9',
    name: 'Linguine Carbonara',
    description: 'Traditional Italian pasta with pancetta, egg yolk, and parmesan.',
    category: 'Mains',
    price: 140,
    emoji: '🍝',
    color: '#EFE5D7',
  },
  {
    id: '10',
    name: 'Chocolate Lava Cake',
    description: 'Warm chocolate cake with a molten centre and vanilla ice cream.',
    category: 'Desserts',
    price: 75,
    emoji: '🍫',
    color: '#F0E7DA',
  },
  {
    id: '11',
    name: 'Tiramisu',
    description: 'Espresso-soaked ladyfingers layered with mascarpone.',
    category: 'Desserts',
    price: 80,
    emoji: '🍰',
    color: '#EFE5D7',
  },
  {
    id: '12',
    name: 'Artisanal Ice Cream',
    description: 'Three scoops of handcrafted vanilla, chocolate, or strawberry.',
    category: 'Desserts',
    price: 55,
    emoji: '🍨',
    color: '#EFE6D9',
  },
  {
    id: '13',
    name: 'Fresh Orange Juice',
    description: 'Freshly squeezed 100% natural orange juice.',
    category: 'Beverages',
    price: 35,
    emoji: '🍊',
    color: '#EEE5D8',
  },
  {
    id: '14',
    name: 'Espresso / Cappuccino',
    description: 'Freshly brewed coffee with hot milk.',
    category: 'Beverages',
    price: 32,
    emoji: '☕',
    color: '#EFE5D7',
  },
  {
    id: '15',
    name: 'Iced Lemon Tea',
    description: 'Home-brewed tea with lemon slices and mint.',
    category: 'Beverages',
    price: 38,
    emoji: '🍋',
    color: '#E9EBDD',
  },
  {
    id: '16',
    name: 'Sparkling Mineral Water',
    description: '500ml chilled sparkling water.',
    category: 'Beverages',
    price: 25,
    emoji: '💧',
    color: '#E8ECDD',
  },
];

const filters: CategoryFilter[] = ['All', 'Starters', 'Mains', 'Desserts', 'Beverages'];
const menuCourses: MenuCategory[] = ['Starters', 'Mains', 'Desserts', 'Beverages'];
type ExtraDish = [name: string, description: string, price: number, emoji: string];
const extraDishes: Record<MenuCategory, ExtraDish[]> = {
  Starters: [
    ['Tomato Bruschetta', 'Toasted sourdough topped with ripe tomato, basil, and olive oil.', 68, '🍅'],
    ['Caprese Skewers', 'Cherry tomatoes, mozzarella, and basil finished with balsamic glaze.', 72, '🍅'],
    ['Crispy Calamari', 'Golden calamari rings with lemon and a creamy garlic dip.', 88, '🦑'],
    ['Roasted Pumpkin Soup', 'Smooth roasted pumpkin soup with a hint of nutmeg.', 65, '🎃'],
    ['Prawn Cocktail', 'Chilled prawns with crisp lettuce and tangy cocktail sauce.', 105, '🍤'],
    ['Vegetable Spring Rolls', 'Crispy rolls filled with seasonal vegetables and sweet chilli dip.', 62, '🥟'],
    ['Grilled Halloumi', 'Warm halloumi slices with honey, lemon, and fresh herbs.', 82, '🧀'],
    ['Chicken Satay', 'Grilled chicken skewers served with a rich peanut sauce.', 89, '🍢'],
    ['Beetroot Carpaccio', 'Thinly sliced beetroot with whipped feta and toasted seeds.', 70, '🥗'],
    ['Stuffed Mushrooms', 'Baked mushrooms filled with herbed cream cheese and breadcrumbs.', 76, '🍄'],
    ['Crispy Chicken Wings', 'Sticky barbecue-glazed wings served with a cooling dip.', 92, '🍗'],
    ['Smoked Salmon Crostini', 'Crisp crostini with smoked salmon, cream cheese, and dill.', 98, '🍞'],
    ['Sweet Potato Wedges', 'Oven-roasted sweet potato with paprika and garlic aioli.', 64, '🍠'],
    ['Greek Salad', 'Cucumber, tomato, olives, red onion, and creamy feta.', 78, '🥗'],
    ['Golden Corn Fritters', 'Crisp sweetcorn fritters with a fresh herb yoghurt dip.', 69, '🌽'],
    ['Beef Empanadas', 'Flaky pastry parcels filled with spiced beef and herbs.', 84, '🥟'],
    ['Chilli Edamame', 'Steamed soybeans tossed with sea salt and a touch of chilli.', 58, '🫛'],
    ['Chicken Liver Pâté', 'Silky chicken liver pâté with toasted bread and onion relish.', 86, '🍞'],
  ],
  Mains: [
    ['Grilled Chicken Bowl', 'Grilled chicken, brown rice, greens, and lemon dressing.', 135, '🍗'],
    ['Classic Fish and Chips', 'Battered hake with golden chips, lemon, and tartar sauce.', 145, '🐟'],
    ['Margherita Pizza', 'Stone-baked pizza with tomato, mozzarella, and fresh basil.', 125, '🍕'],
    ['Garden Veggie Burger', 'A hearty vegetable patty with lettuce and house sauce.', 115, '🍔'],
    ['Slow-Roasted Lamb', 'Tender lamb with rosemary gravy and seasonal vegetables.', 210, '🍖'],
    ['Chicken Alfredo', 'Creamy parmesan sauce tossed with pasta and grilled chicken.', 148, '🍝'],
    ['Prawn Curry', 'Fragrant coconut curry with prawns, served with steamed rice.', 185, '🍛'],
    ['Beef Tacos', 'Three soft tacos with seasoned beef, salsa, and avocado.', 138, '🌮'],
    ['Grilled Salmon', 'Pan-seared salmon with greens and a citrus butter sauce.', 205, '🐟'],
    ['Wild Mushroom Risotto', 'Slow-stirred arborio rice with wild mushrooms and parmesan.', 152, '🍚'],
    ['BBQ Pork Ribs', 'Slow-cooked ribs glazed with smoky barbecue sauce and slaw.', 198, '🍖'],
    ['Vegetable Stir-Fry', 'Seasonal vegetables wok-tossed with ginger and soy.', 118, '🥦'],
    ['Chicken Schnitzel', 'Crumbed chicken breast with warm potato salad and lemon.', 142, '🍗'],
  ],
  Desserts: [
    ['New York Cheesecake', 'Baked vanilla cheesecake with a buttery biscuit base.', 78, '🍰'],
    ['Brownie Sundae', 'Warm chocolate brownie with vanilla ice cream and sauce.', 82, '🍨'],
    ['Crème Brûlée', 'Vanilla custard under a crisp caramelised sugar topping.', 76, '🍮'],
    ['Lemon Meringue Tart', 'Tangy lemon curd in pastry topped with toasted meringue.', 72, '🍋'],
    ['Sticky Toffee Pudding', 'Date sponge cake with warm toffee sauce and cream.', 79, '🍮'],
    ['Berry Pavlova', 'Crisp meringue topped with cream and fresh seasonal berries.', 85, '🍓'],
    ['Cinnamon Churros', 'Warm cinnamon sugar churros with chocolate dipping sauce.', 68, '🍩'],
    ['Apple Crumble', 'Baked spiced apples under a crisp oat crumble topping.', 70, '🍎'],
    ['Red Velvet Cake', 'Soft red velvet sponge with cream cheese frosting.', 84, '🍰'],
    ['Chocolate Profiteroles', 'Choux pastry puffs filled with cream and chocolate sauce.', 81, '🍫'],
    ['Mango Sorbet', 'Refreshing dairy-free mango sorbet made with ripe fruit.', 58, '🥭'],
    ['Malva Pudding', 'Warm South African sponge pudding with custard.', 74, '🍮'],
    ['Waffle and Berries', 'Warm Belgian waffle with berries and maple syrup.', 88, '🧇'],
    ['Creamy Rice Pudding', 'Slow-cooked cinnamon rice pudding served warm.', 62, '🍚'],
    ['Honey Baklava', 'Crisp filo layers with chopped nuts and fragrant honey.', 77, '🍯'],
    ['Carrot Cake', 'Spiced carrot cake with walnuts and cream cheese icing.', 79, '🥕'],
    ['Vanilla Affogato', 'Vanilla ice cream finished with a shot of hot espresso.', 65, '☕'],
  ],
  Beverages: [
    ['Still Mineral Water', 'Chilled 500ml still mineral water.', 22, '💧'],
    ['Fresh Lemonade', 'House-made lemonade with freshly squeezed lemons.', 34, '🍋'],
    ['Iced Coffee', 'Chilled espresso with milk over ice.', 39, '🧋'],
    ['Hot Chocolate', 'Rich cocoa blended with steamed milk.', 36, '☕'],
    ['Rooibos Tea', 'A soothing cup of South African rooibos tea.', 28, '🍵'],
    ['Green Tea', 'Lightly brewed green tea served hot.', 28, '🍵'],
    ['Vanilla Milkshake', 'Classic vanilla ice cream blended into a creamy shake.', 42, '🥤'],
    ['Chocolate Milkshake', 'Chocolate ice cream blended with chilled milk.', 45, '🥤'],
    ['Strawberry Milkshake', 'Strawberry ice cream blended with fresh milk.', 45, '🍓'],
    ['Sparkling Lemonade', 'Bubbly house lemonade with fresh lemon.', 38, '🍋'],
    ['Mango Smoothie', 'Ripe mango blended with yoghurt and a little honey.', 48, '🥭'],
    ['Berry Smoothie', 'Mixed berries blended with yoghurt and banana.', 48, '🫐'],
    ['Ginger Beer', 'Refreshing non-alcoholic ginger beer, served chilled.', 32, '🥤'],
    ['Classic Cola', 'A chilled, sparkling cola.', 25, '🥤'],
    ['Tonic Water', 'Chilled tonic water with a slice of lime.', 25, '🍸'],
    ['Cucumber Mint Cooler', 'Cucumber, mint, and lime over sparkling water.', 40, '🥒'],
  ],
};
const extraMenu: MenuDish[] = menuCourses.flatMap((category) =>
  extraDishes[category].map(([name, description, price, emoji], index) => ({
    id: `extra-${category.toLowerCase()}-${index + 1}`,
    name,
    description,
    category,
    price,
    emoji,
    color: '#F0E7DB',
  })),
);
const DELIVERY_FEE = 35;
const TAX_RATE = 0.05;

interface MenuAppContextValue {
  menu: MenuDish[];
  setMenu: Dispatch<SetStateAction<MenuDish[]>>;
  quantities: Record<string, number>;
  setQuantities: Dispatch<SetStateAction<Record<string, number>>>;
}

const MenuAppContext = createContext<MenuAppContextValue | null>(null);

export function MenuAppProvider({ children }: PropsWithChildren): React.JSX.Element {
  const [menu, setMenu] = useState<MenuDish[]>([...initialMenu, ...extraMenu]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  return (
    <MenuAppContext.Provider value={{ menu, setMenu, quantities, setQuantities }}>
      {children}
    </MenuAppContext.Provider>
  );
}

export function useMenuApp(): MenuAppContextValue {
  const context = useContext(MenuAppContext);
  if (!context) {
    throw new Error('useMenuApp must be used inside MenuAppProvider.');
  }
  return context;
}

export default function HomeScreen({
  navigation,
}: {
  navigation: StackNavigationProp<RootStackParamList, 'Home'>;
}): React.JSX.Element {
  const { menu, setMenu, quantities, setQuantities } = useMenuApp();
  const [searchText, setSearchText] = useState('');
  const [isManagingMenu, setIsManagingMenu] = useState(false);
  const [isMenuFormOpen, setIsMenuFormOpen] = useState(false);
  const [editingDish, setEditingDish] = useState<MenuDish | null>(null);
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formCategory, setFormCategory] = useState<MenuCategory>('Mains');
  const [formPrice, setFormPrice] = useState('');
  const [formError, setFormError] = useState('');
  const [menuNotice, setMenuNotice] = useState('');
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const [orderType, setOrderType] = useState<OrderType>('Dine in');
  const [tableNumber, setTableNumber] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoMessage, setPromoMessage] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [customizingDish, setCustomizingDish] = useState<MenuDish | null>(null);
  const [customQuantity, setCustomQuantity] = useState(1);
  const [condiments, setCondiments] = useState({ wasabi: false, soya: true, ginger: true });
  const [spiceLevel, setSpiceLevel] = useState('Mild');
  const [riceType, setRiceType] = useState('White');
  const [dishOptions, setDishOptions] = useState<Record<string, string>>({});
  const [dishToDelete, setDishToDelete] = useState<MenuDish | null>(null);
  const [orderError, setOrderError] = useState('');
  const [orderReceipt, setOrderReceipt] = useState<{ number: string; details: string; total: number } | null>(null);
  const averagePrice = menu.length
    ? menu.reduce((sum, dish) => sum + dish.price, 0) / menu.length
    : 0;

  const filteredMenu = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    return menu.filter((dish) => {
      const matchesSearch =
        !query ||
        dish.name.toLowerCase().includes(query) ||
        dish.description.toLowerCase().includes(query) ||
        dish.dietary?.toLowerCase().includes(query);
      return matchesSearch;
    });
  }, [menu, searchText]);

  const cartItems = menu.filter((dish) => (quantities[dish.id] ?? 0) > 0);
  const itemCount = cartItems.reduce((total, dish) => total + quantities[dish.id], 0);
  const subtotal = cartItems.reduce(
    (total, dish) => total + dish.price * quantities[dish.id],
    0,
  );
  const deliveryFee = orderType === 'Delivery' ? DELIVERY_FEE : 0;
  const discount = promoApplied ? Math.round(subtotal * 0.05 * 100) / 100 : 0;
  const tax = Math.round((subtotal - discount + deliveryFee) * TAX_RATE * 100) / 100;
  const total = subtotal - discount + deliveryFee + tax;
  const categoryCounts = {
    All: menu.length,
    Starters: menu.filter((dish) => dish.category === 'Starters').length,
    Mains: menu.filter((dish) => dish.category === 'Mains').length,
    Desserts: menu.filter((dish) => dish.category === 'Desserts').length,
    Beverages: menu.filter((dish) => dish.category === 'Beverages').length,
  };

  const changeQuantity = (dishId: string, change: number) => {
    setQuantities((current) => {
      const nextQuantity = (current[dishId] ?? 0) + change;
      const next = { ...current };
      if (nextQuantity <= 0) {
        delete next[dishId];
      } else {
        next[dishId] = nextQuantity;
      }
      return next;
    });
  };

  const selectCategory = (category: CategoryFilter) => {
    navigation.navigate(category === 'All' ? 'Home' : category);
  };

  const openContactEmail = async () => {
    try {
      await Linking.openURL('mailto:gatherhere207@gmail.com');
    } catch {
      setMenuNotice('Email us at gatherhere207@gmail.com');
    }
  };

  const openRestaurantAddress = async () => {
    try {
      await Linking.openURL(
        `https://maps.google.com/?q=${encodeURIComponent('54 Saints Georges Drive')}`,
      );
    } catch {
      setMenuNotice('Restaurant address: 54 Saints Georges Drive');
    }
  };

  const openAddDish = () => {
    setEditingDish(null);
    setFormName('');
    setFormDescription('');
    setFormCategory('Mains');
    setFormPrice('');
    setFormError('');
    setIsMenuFormOpen(true);
  };

  const openEditDish = (dish: MenuDish) => {
    setEditingDish(dish);
    setFormName(dish.name);
    setFormDescription(dish.description);
    setFormCategory(dish.category);
    setFormPrice(String(dish.price));
    setFormError('');
    setIsMenuFormOpen(true);
  };

  const saveDish = () => {
    const price = Number(formPrice);
    if (!formName.trim()) {
      setFormError('Enter a dish name.');
      return;
    }
    if (!formDescription.trim()) {
      setFormError('Enter a dish description.');
      return;
    }
    if (!Number.isFinite(price) || price <= 0) {
      setFormError('Enter a price greater than R0.');
      return;
    }

    const dish: MenuDish = {
      id: editingDish?.id ?? `${Date.now()}`,
      name: formName.trim(),
      description: formDescription.trim(),
      category: formCategory,
      price,
      emoji: editingDish?.emoji ?? '🍽️',
      color: editingDish?.color ?? '#F0E7DB',
      isSushi: editingDish?.isSushi,
      tag: editingDish?.tag,
      dietary: editingDish?.dietary,
    };

    setMenu((current) =>
      editingDish
        ? current.map((item) => (item.id === editingDish.id ? dish : item))
        : [...current, dish],
    );
    setMenuNotice(editingDish ? `${dish.name} updated.` : `${dish.name} added to the menu.`);
    setIsMenuFormOpen(false);
    setEditingDish(null);
  };

  const deleteDish = (dish: MenuDish) => {
    setDishToDelete(dish);
  };

  const confirmDeleteDish = () => {
    if (!dishToDelete) return;
    const deletedDish = dishToDelete;
    setMenu((current) => current.filter((item) => item.id !== deletedDish.id));
    setQuantities((current) => {
      const next = { ...current };
      delete next[deletedDish.id];
      return next;
    });
    setDishOptions((current) => {
      const next = { ...current };
      delete next[deletedDish.id];
      return next;
    });
    setMenuNotice(`${deletedDish.name} removed from the menu.`);
    setDishToDelete(null);
  };

  const openSushiOptions = (dish: MenuDish) => {
    setCustomizingDish(dish);
    setCustomQuantity(1);
    setCondiments({ wasabi: false, soya: true, ginger: true });
    setSpiceLevel('Mild');
    setRiceType('White');
  };

  const addCustomizedSushi = () => {
    if (!customizingDish) {
      return;
    }

    const selectedCondiments = [
      condiments.wasabi ? 'Wasabi' : '',
      condiments.soya ? 'Soya Sauce' : '',
      condiments.ginger ? 'Ginger' : '',
    ].filter(Boolean);
    const options = `${selectedCondiments.length > 0 ? selectedCondiments.join(', ') : 'No condiments'} · ${spiceLevel} · ${riceType} rice`;
    setDishOptions((current) => ({ ...current, [customizingDish.id]: options }));
    changeQuantity(customizingDish.id, customQuantity);
    setCustomizingDish(null);
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

    const orderNumber = String(Date.now()).slice(-5);
    const serviceDetails =
      orderType === 'Dine in'
        ? `Dine in · Table ${tableNumber.trim()}`
        : `Delivery · ${deliveryAddress.trim()}`;
    const instructionDetails = specialInstructions.trim()
      ? ` · Notes: ${specialInstructions.trim()}`
      : '';

    setOrderReceipt({
      number: orderNumber,
      details: `${serviceDetails}${instructionDetails}`,
      total,
    });
    setIsOrderOpen(false);
    setQuantities({});
    setDishOptions({});
    setTableNumber('');
    setDeliveryAddress('');
    setPromoCode('');
    setPromoApplied(false);
    setPromoMessage('');
    setSpecialInstructions('');
  };

  const applyPromoCode = () => {
    if (promoCode.trim().toLowerCase() === 'summer5') {
      setPromoApplied(true);
      setPromoMessage('Summer5 applied · 5% off');
    } else {
      setPromoApplied(false);
      setPromoMessage('That promo code is not valid.');
    }
  };

  const renderDish = ({ item }: { item: MenuDish }) => {
    const quantity = quantities[item.id] ?? 0;
    return (
      <View style={styles.dishCard}>
        <View style={[styles.dishArtwork, { backgroundColor: item.color }]}>
          <Text style={styles.dishEmoji}>{item.emoji}</Text>
          <Text style={styles.artworkCaption}>MADE WITH CARE</Text>
        </View>
        <View style={styles.dishContent}>
          <View style={styles.dishHeading}>
            <Text style={styles.dishName}>{item.name}</Text>
            <Text style={styles.dishPrice}>R{item.price}</Text>
          </View>
          <Text style={styles.dishDescription}>{item.description}</Text>
          <View style={styles.dishFooter}>
            <View style={styles.badgeGroup}>
              {item.tag ? <Text style={styles.featuredBadge}>{item.tag}</Text> : null}
              {item.dietary ? <Text style={styles.dietaryBadge}>{item.dietary}</Text> : null}
            </View>
            {isManagingMenu ? (
              <View style={styles.manageActions}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Edit ${item.name}`}
                  onPress={() => openEditDish(item)}
                  style={styles.manageButton}
                >
                  <Text style={styles.manageButtonText}>Edit</Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Delete ${item.name}`}
                  onPress={() => deleteDish(item)}
                  style={styles.deleteButton}
                >
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </Pressable>
              </View>
            ) : quantity === 0 ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`${item.isSushi ? 'Customize' : 'Add'} ${item.name}${item.isSushi ? '' : ' to order'}`}
                onPress={() => item.isSushi ? openSushiOptions(item) : changeQuantity(item.id, 1)}
                style={styles.addButton}
              >
                <Text style={styles.addButtonText}>{item.isSushi ? '⚙' : '＋'}</Text>
                <Text style={styles.addButtonLabel}>{item.isSushi ? 'Options' : 'Add'}</Text>
              </Pressable>
            ) : (
              <View style={styles.quantityAndOptions}>
                <View style={styles.quantityControl}>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Remove one ${item.name}`}
                    onPress={() => changeQuantity(item.id, -1)}
                    style={styles.quantityButton}
                  >
                    <Text style={styles.quantityButtonText}>−</Text>
                  </Pressable>
                  <Text accessibilityLabel={`${quantity} in order`} style={styles.quantityValue}>
                    {quantity}
                  </Text>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Add one ${item.name}`}
                    onPress={() => changeQuantity(item.id, 1)}
                    style={styles.quantityButton}
                  >
                    <Text style={styles.quantityButtonText}>＋</Text>
                  </Pressable>
                </View>
                {item.isSushi ? (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Customize ${item.name}`}
                    onPress={() => openSushiOptions(item)}
                    style={styles.optionsLink}
                  >
                    <Text style={styles.optionsLinkText}>Options</Text>
                  </Pressable>
                ) : null}
              </View>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.page}>
        <FlatList
          data={filteredMenu}
          keyExtractor={(item) => item.id}
          renderItem={renderDish}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <View>
              <View style={styles.topBar}>
                <View style={styles.brandMark}>
                  <Text style={styles.brandMarkText}>T</Text>
                </View>
                <View style={styles.brandCopy}>
                  <Text style={styles.brandName}>THE GATHER TABLE</Text>
                  <Text style={styles.brandLocation}>FRESH FOOD, MADE FOR YOU</Text>
                </View>
                <View style={styles.openBadge}>
                  <View style={styles.openDot} />
                  <Text style={styles.openBadgeText}>MENU LIVE</Text>
                </View>
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ selected: isManagingMenu }}
                  onPress={() => setIsManagingMenu((current) => !current)}
                  style={[styles.manageToggle, isManagingMenu && styles.manageToggleActive]}
                >
                  <Text style={[styles.manageToggleText, isManagingMenu && styles.manageToggleTextActive]}>
                    {isManagingMenu ? 'Done' : 'Manage'}
                  </Text>
                </Pressable>
              </View>

              <View style={styles.hero}>
                <View style={styles.heroCopy}>
                  <Text style={styles.eyebrow}>GOOD FOOD. GOOD COMPANY.</Text>
                  <Text style={styles.heroTitle}>A seat at{'\n'}our table.</Text>
                  <Text style={styles.heroDescription}>
                    Seasonal favourites, thoughtfully made. Find something you love.
                  </Text>
                  <View style={styles.heroFootnote}>
                    <Text style={styles.heroFootnoteText}>DINE IN</Text>
                    <View style={styles.footnoteDivider} />
                    <Text style={styles.heroFootnoteText}>ONLINE DELIVERY</Text>
                  </View>
                </View>
                <View style={styles.heroIllustration}>
                  <View style={styles.plateOuter}>
                    <View style={styles.plateInner}>
                      <Text style={styles.heroEmoji}>🥗</Text>
                    </View>
                  </View>
                  <View style={styles.heroSparkle}>
                    <Text style={styles.sparkleText}>✳</Text>
                  </View>
                </View>
                <View style={styles.heroAccent} />
              </View>

              <View style={styles.statsPanel}>
                <View style={styles.statsTopRow}>
                  <View style={styles.statBlock}>
                    <Text style={styles.statLabel}>MENU ITEMS</Text>
                    <Text style={styles.statValue}>{menu.length}</Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statBlock}>
                    <Text style={styles.statLabel}>AVERAGE PRICE</Text>
                    <Text style={styles.statValue}>R{averagePrice.toFixed(2)}</Text>
                  </View>
                  {isManagingMenu ? (
                    <Pressable
                      accessibilityRole="button"
                      onPress={openAddDish}
                      style={styles.addDishButton}
                    >
                      <Text style={styles.addDishButtonText}>＋ Add dish</Text>
                    </Pressable>
                  ) : null}
                </View>
                <View style={styles.courseStats}>
                  {menuCourses.map((course) => (
                    <View key={course} style={styles.courseStat}>
                      <Text style={styles.courseStatCount}>
                        {menu.filter((dish) => dish.category === course).length}
                      </Text>
                      <Text style={styles.courseStatName}>{course}</Text>
                    </View>
                  ))}
                </View>
              </View>
              {menuNotice ? (
                <Text accessibilityLiveRegion="polite" style={styles.menuNotice}>
                  {menuNotice}
                </Text>
              ) : null}

              <View style={styles.sectionHeading}>
                <View>
                  <Text style={styles.sectionEyebrow}>FROM OUR KITCHEN</Text>
                  <Text style={styles.sectionTitle}>The menu</Text>
                </View>
                <Text style={styles.menuCount}>{menu.length} GOOD THINGS</Text>
              </View>

              <View style={styles.searchBar}>
                <Text style={styles.searchIcon}>⌕</Text>
                <TextInput
                  accessibilityLabel="Search dishes"
                  placeholder="Find your new favourite..."
                  placeholderTextColor="#8B8174"
                  value={searchText}
                  onChangeText={setSearchText}
                  returnKeyType="search"
                  style={styles.searchInput}
                />
                {searchText.length > 0 ? (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Clear search"
                    onPress={() => setSearchText('')}
                  >
                    <Text style={styles.clearSearch}>×</Text>
                  </Pressable>
                ) : null}
              </View>

              <View style={styles.listIntro}>
                <Text style={styles.listIntroText}>
                  {searchText ? 'Search results' : 'A little something for everyone'}
                </Text>
                <View style={styles.listIntroRight}>
                  <Text style={styles.listIntroNote}>
                    {filteredMenu.length} DISHES · ALL PRICES IN ZAR
                  </Text>
                  {searchText ? (
                    <Pressable
                      accessibilityRole="button"
                      onPress={() => {
                        setSearchText('');
                        selectCategory('All');
                      }}
                    >
                      <Text style={styles.clearFiltersText}>Clear</Text>
                    </Pressable>
                  ) : null}
                </View>
              </View>
            </View>
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>🍽️</Text>
              <Text style={styles.emptyTitle}>Nothing on the menu just yet</Text>
              <Text style={styles.emptyDescription}>Try another search or choose a different course.</Text>
            </View>
          }
          ListFooterComponent={
            <View style={styles.restaurantSections}>
              <View style={styles.sectionHeading}>
                <View>
                  <Text style={styles.sectionEyebrow}>A LITTLE MORE TO EXPLORE</Text>
                  <Text style={styles.sectionTitle}>From our table</Text>
                </View>
              </View>

              <Text style={styles.infoSectionTitle}>Gallery</Text>
              <Text style={styles.infoSectionDescription}>
                A taste of what you will find on the menu.
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.galleryList}
              >
                {menu.slice(0, 6).map((dish) => (
                  <View key={dish.id} style={styles.galleryCard}>
                    <View style={[styles.galleryArtwork, { backgroundColor: dish.color }]}>
                      <Text style={styles.galleryEmoji}>{dish.emoji}</Text>
                    </View>
                    <Text numberOfLines={1} style={styles.galleryDishName}>{dish.name}</Text>
                    <Text style={styles.galleryDishCategory}>{dish.category.toUpperCase()}</Text>
                  </View>
                ))}
              </ScrollView>

              <View style={styles.restaurantInfoRow}>
                <View style={styles.restaurantInfoCard}>
                  <Text style={styles.infoIcon}>⌖</Text>
                  <Text style={styles.infoSectionTitle}>Location</Text>
                  <Text style={styles.infoPlaceholder}>54 Saints Georges Drive</Text>
                  <Pressable
                    accessibilityRole="link"
                    accessibilityLabel="Open map for 54 Saints Georges Drive"
                    onPress={openRestaurantAddress}
                  >
                    <Text style={styles.contactEmail}>Get directions</Text>
                  </Pressable>
                </View>
                <View style={styles.restaurantInfoCard}>
                  <Text style={styles.infoIcon}>✉</Text>
                  <Text style={styles.infoSectionTitle}>Contact</Text>
                  <Text style={styles.infoPlaceholder}>Questions or bookings?</Text>
                  <Pressable
                    accessibilityRole="link"
                    accessibilityLabel="Email gatherhere207@gmail.com"
                    onPress={openContactEmail}
                  >
                    <Text style={styles.contactEmail}>gatherhere207@gmail.com</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          }
        />

        <CategoryTabBar active="All" counts={categoryCounts} onSelect={selectCategory} />

        <View style={styles.cartDock}>
          <View style={styles.cartSummary}>
            <View style={styles.cartIconWrap}>
              <Text style={styles.cartIcon}>🛍</Text>
              {itemCount > 0 ? (
                <View style={styles.cartCountBadge}>
                  <Text style={styles.cartCountText}>{itemCount}</Text>
                </View>
              ) : null}
            </View>
            <View style={styles.cartCopy}>
              <Text style={styles.cartTitle}>
                {itemCount === 0 ? 'Choose from the menu' : `${itemCount} ${itemCount === 1 ? 'item' : 'items'} in your order`}
              </Text>
              <Text style={styles.cartSubtitle}>
                {itemCount === 0 ? 'Browse dishes from every category' : 'A lovely choice, if we say so'}
              </Text>
            </View>
          </View>
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              setOrderError('');
              navigation.navigate('Order');
            }}
            style={styles.reviewButton}
          >
            <Text style={styles.reviewButtonText}>
              {itemCount === 0 ? 'Full menu' : `Review  ·  R${subtotal}`}
            </Text>
            <Text style={styles.reviewArrow}>→</Text>
          </Pressable>
        </View>
      </View>

      <Modal
        animationType="slide"
        onRequestClose={() => setIsMenuFormOpen(false)}
        transparent
        visible={isMenuFormOpen}
      >
        <View style={styles.modalBackdrop}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close menu item form"
            onPress={() => setIsMenuFormOpen(false)}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.orderSheet}>
            <View style={styles.sheetHandle} />
            <View style={styles.sheetHeader}>
              <View>
                <Text style={styles.sectionEyebrow}>CHEF'S MENU</Text>
                <Text style={styles.sheetTitle}>{editingDish ? 'Edit dish' : 'Add a dish'}</Text>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close menu item form"
                onPress={() => setIsMenuFormOpen(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>×</Text>
              </Pressable>
            </View>

            <ScrollView style={styles.menuFormScroll} keyboardShouldPersistTaps="handled">
              <Text style={styles.formLabel}>DISH NAME *</Text>
              <TextInput
                accessibilityLabel="Dish name"
                onChangeText={(text) => {
                  setFormName(text);
                  setFormError('');
                }}
                placeholder="e.g. Grilled salmon"
                placeholderTextColor="#8B8174"
                value={formName}
                style={styles.formInput}
              />

              <Text style={styles.formLabel}>DESCRIPTION *</Text>
              <TextInput
                accessibilityLabel="Dish description"
                multiline
                onChangeText={(text) => {
                  setFormDescription(text);
                  setFormError('');
                }}
                placeholder="Describe the dish and its ingredients"
                placeholderTextColor="#8B8174"
                textAlignVertical="top"
                value={formDescription}
                style={[styles.formInput, styles.formDescriptionInput]}
              />

              <Text style={styles.formLabel}>COURSE *</Text>
              <View style={styles.formCourseRow}>
                {menuCourses.map((course) => {
                  const selected = formCategory === course;
                  return (
                    <Pressable
                      key={course}
                      accessibilityRole="button"
                      accessibilityState={{ selected }}
                      onPress={() => {
                        setFormCategory(course);
                        setFormError('');
                      }}
                      style={[styles.formCourseButton, selected && styles.formCourseButtonSelected]}
                    >
                      <Text style={[styles.formCourseText, selected && styles.formCourseTextSelected]}>
                        {course}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              <Text style={styles.formLabel}>PRICE (R) *</Text>
              <TextInput
                accessibilityLabel="Dish price in rand"
                keyboardType="decimal-pad"
                onChangeText={(text) => {
                  setFormPrice(text);
                  setFormError('');
                }}
                placeholder="e.g. 95"
                placeholderTextColor="#8B8174"
                value={formPrice}
                style={styles.formInput}
              />
              {formError ? (
                <Text accessibilityLiveRegion="polite" style={styles.formError}>
                  {formError}
                </Text>
              ) : null}
            </ScrollView>

            <View style={styles.formActions}>
              <Pressable onPress={() => setIsMenuFormOpen(false)} style={styles.cancelFormButton}>
                <Text style={styles.cancelFormText}>Cancel</Text>
              </Pressable>
              <Pressable accessibilityRole="button" onPress={saveDish} style={styles.saveFormButton}>
                <Text style={styles.saveFormText}>{editingDish ? 'Save changes' : 'Add to menu'}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        onRequestClose={() => setIsOrderOpen(false)}
        transparent
        visible={isOrderOpen}
      >
        <View style={styles.modalBackdrop}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close order summary"
            onPress={() => setIsOrderOpen(false)}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.orderSheet}>
            <View style={styles.sheetHandle} />
            <View style={styles.sheetHeader}>
              <View>
                <Text style={styles.sectionEyebrow}>LOOKING GOOD</Text>
                <Text style={styles.sheetTitle}>Your order</Text>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close order summary"
                onPress={() => setIsOrderOpen(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>×</Text>
              </Pressable>
            </View>

            <ScrollView style={styles.orderItems} showsVerticalScrollIndicator={false}>
              {cartItems.map((dish) => (
                <View key={dish.id} style={styles.orderLine}>
                  <View style={styles.orderQuantity}>
                    <Text style={styles.orderQuantityText}>{quantities[dish.id]}×</Text>
                  </View>
                  <View style={styles.orderDishDetails}>
                    <Text style={styles.orderDishName}>{dish.name}</Text>
                    {dishOptions[dish.id] ? (
                      <Text style={styles.orderOptions}>{dishOptions[dish.id]}</Text>
                    ) : null}
                  </View>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Remove one ${dish.name}`}
                    onPress={() => changeQuantity(dish.id, -1)}
                    style={styles.orderQuantityAction}
                  >
                    <Text style={styles.orderQuantityActionText}>−</Text>
                  </Pressable>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Add one ${dish.name}`}
                    onPress={() => changeQuantity(dish.id, 1)}
                    style={styles.orderQuantityAction}
                  >
                    <Text style={styles.orderQuantityActionText}>＋</Text>
                  </Pressable>
                  <Text style={styles.orderDishPrice}>R{dish.price * quantities[dish.id]}</Text>
                </View>
              ))}

              <View style={styles.orderTotalRow}>
                <View>
                  <Text style={styles.orderTotalLabel}>Subtotal</Text>
                  <Text style={styles.inclusiveNote}>Items before fees and tax</Text>
                </View>
                <Text style={styles.orderTotalPrice}>R{subtotal}</Text>
              </View>

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
                <Text style={[styles.promoMessage, !promoApplied && styles.promoError]}>
                  {promoMessage}
                </Text>
              ) : null}

              <View style={styles.costRow}>
                <Text style={styles.costLabel}>Delivery</Text>
                <Text style={styles.costValue}>{deliveryFee === 0 ? 'R0' : `R${deliveryFee}`}</Text>
              </View>
              {discount > 0 ? (
                <View style={styles.costRow}>
                  <Text style={styles.discountLabel}>Summer5 discount (5%)</Text>
                  <Text style={styles.discountLabel}>−R{discount.toFixed(2)}</Text>
                </View>
              ) : null}
              <View style={styles.costRow}>
                <Text style={styles.costLabel}>Tax (5%)</Text>
                <Text style={styles.costValue}>R{tax.toFixed(2)}</Text>
              </View>
              <View style={styles.finalTotalRow}>
                <Text style={styles.orderTotalLabel}>Total</Text>
                <Text style={styles.finalTotalPrice}>R{total.toFixed(2)}</Text>
              </View>

              <Text style={styles.serviceLabel}>HOW WOULD YOU LIKE TO ENJOY?</Text>
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
                      style={[styles.orderTypeButton, selected && styles.orderTypeButtonSelected]}
                    >
                      <Text style={[styles.orderTypeText, selected && styles.orderTypeTextSelected]}>
                        {type === 'Dine in' ? '♧  Dine in' : '⌂  Delivery'}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              {orderType === 'Dine in' ? (
                <View style={styles.tableInputGroup}>
                  <Text style={styles.tableLabel}>YOUR TABLE NUMBER</Text>
                  <TextInput
                    accessibilityLabel="Table number"
                    keyboardType="number-pad"
                    maxLength={4}
                    onChangeText={(text) => {
                      setTableNumber(text);
                      setOrderError('');
                    }}
                    placeholder="e.g. 12"
                    placeholderTextColor="#8B8174"
                    value={tableNumber}
                    style={styles.tableInput}
                  />
                </View>
              ) : (
                <View style={styles.tableInputGroup}>
                  <Text style={styles.tableLabel}>DELIVERY ADDRESS</Text>
                  <TextInput
                    accessibilityLabel="Delivery address"
                    autoCapitalize="words"
                    onChangeText={(text) => {
                      setDeliveryAddress(text);
                      setOrderError('');
                    }}
                    placeholder="Street address and suburb"
                    placeholderTextColor="#8B8174"
                    value={deliveryAddress}
                    style={styles.tableInput}
                  />
                  <Text style={styles.deliveryNote}>Delivery fee is R{DELIVERY_FEE}.</Text>
                </View>
              )}

              <View style={styles.tableInputGroup}>
                <Text style={styles.tableLabel}>SPECIAL INSTRUCTIONS</Text>
                <TextInput
                  accessibilityLabel="Special instructions"
                  multiline
                  onChangeText={setSpecialInstructions}
                  placeholder="Allergies or requests for the kitchen"
                  placeholderTextColor="#8B8174"
                  textAlignVertical="top"
                  value={specialInstructions}
                  style={[styles.tableInput, styles.instructionsInput]}
                />
              </View>
            </ScrollView>

            {orderError ? (
              <Text accessibilityLiveRegion="polite" style={styles.inlineError}>
                {orderError}
              </Text>
            ) : null}
            <Pressable accessibilityRole="button" onPress={placeOrder} style={styles.placeOrderButton}>
              <Text style={styles.placeOrderText}>
                {orderType === 'Dine in' ? 'Confirm dine-in order' : 'Confirm delivery order'}
              </Text>
              <Text style={styles.placeOrderPrice}>R{total.toFixed(2)}  →</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        onRequestClose={() => setCustomizingDish(null)}
        transparent
        visible={customizingDish !== null}
      >
        <View style={styles.modalBackdrop}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close dish options"
            onPress={() => setCustomizingDish(null)}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.orderSheet}>
            <View style={styles.sheetHandle} />
            <View style={styles.sheetHeader}>
              <View>
                <Text style={styles.sectionEyebrow}>MAKE IT YOURS</Text>
                <Text style={styles.sheetTitle}>{customizingDish?.name}</Text>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close dish options"
                onPress={() => setCustomizingDish(null)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>×</Text>
              </Pressable>
            </View>
            <Text style={styles.customizationDescription}>
              Choose your condiments, spice level and rice.
            </Text>

            <Text style={styles.tableLabel}>CONDIMENTS</Text>
            <View style={styles.optionRow}>
              {([
                ['wasabi', 'Wasabi'],
                ['soya', 'Soya Sauce'],
                ['ginger', 'Ginger'],
              ] as const).map(([key, label]) => {
                const selected = condiments[key];
                return (
                  <Pressable
                    key={key}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    onPress={() =>
                      setCondiments((current) => ({ ...current, [key]: !current[key] }))
                    }
                    style={[styles.optionPill, selected && styles.optionPillSelected]}
                  >
                    <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
                      {selected ? '✓ ' : ''}{label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={[styles.tableLabel, styles.optionLabel]}>SPICE LEVEL</Text>
            <View style={styles.optionRow}>
              {['Mild', 'Medium', 'Hot', 'Extra Hot'].map((level) => {
                const selected = spiceLevel === level;
                return (
                  <Pressable
                    key={level}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    onPress={() => setSpiceLevel(level)}
                    style={[styles.optionPill, selected && styles.optionPillSelected]}
                  >
                    <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
                      {level}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={[styles.tableLabel, styles.optionLabel]}>RICE TYPE</Text>
            <View style={styles.optionRow}>
              {['White', 'Brown'].map((rice) => {
                const selected = riceType === rice;
                return (
                  <Pressable
                    key={rice}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    onPress={() => setRiceType(rice)}
                    style={[styles.optionPill, selected && styles.optionPillSelected]}
                  >
                    <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
                      {rice} rice
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.customQuantityRow}>
              <Text style={styles.orderTotalLabel}>Quantity</Text>
              <View style={styles.quantityControl}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Remove one"
                  disabled={customQuantity <= 1}
                  onPress={() => setCustomQuantity((quantity) => Math.max(1, quantity - 1))}
                  style={styles.quantityButton}
                >
                  <Text style={styles.quantityButtonText}>−</Text>
                </Pressable>
                <Text style={styles.quantityValue}>{customQuantity}</Text>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Add one"
                  onPress={() => setCustomQuantity((quantity) => quantity + 1)}
                  style={styles.quantityButton}
                >
                  <Text style={styles.quantityButtonText}>＋</Text>
                </Pressable>
              </View>
            </View>

            <Pressable accessibilityRole="button" onPress={addCustomizedSushi} style={styles.placeOrderButton}>
              <Text style={styles.placeOrderText}>Add to order</Text>
              <Text style={styles.placeOrderPrice}>
                R{(customizingDish?.price ?? 0) * customQuantity}  →
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        onRequestClose={() => setDishToDelete(null)}
        transparent
        visible={dishToDelete !== null}
      >
        <View style={styles.modalBackdrop}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Cancel delete"
            onPress={() => setDishToDelete(null)}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.orderSheet}>
            <View style={styles.sheetHeader}>
              <View>
                <Text style={styles.sectionEyebrow}>MENU MANAGEMENT</Text>
                <Text style={styles.sheetTitle}>Remove dish?</Text>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Cancel delete"
                onPress={() => setDishToDelete(null)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>×</Text>
              </Pressable>
            </View>
            <Text style={styles.receiptDetails}>
              {`Remove ${dishToDelete?.name ?? 'this dish'} from the menu? This cannot be undone.`}
            </Text>
            <View style={styles.formActions}>
              <Pressable onPress={() => setDishToDelete(null)} style={styles.cancelFormButton}>
                <Text style={styles.cancelFormText}>Keep dish</Text>
              </Pressable>
              <Pressable onPress={confirmDeleteDish} style={styles.destructiveFormButton}>
                <Text style={styles.destructiveFormText}>Remove</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        onRequestClose={() => setOrderReceipt(null)}
        transparent
        visible={orderReceipt !== null}
      >
        <View style={styles.modalBackdrop}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close order confirmation"
            onPress={() => setOrderReceipt(null)}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.orderSheet}>
            <View style={styles.sheetHeader}>
              <View>
                <Text style={styles.sectionEyebrow}>DEMO CHECKOUT</Text>
                <Text style={styles.sheetTitle}>Order preview</Text>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close order confirmation"
                onPress={() => setOrderReceipt(null)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>×</Text>
              </Pressable>
            </View>
            <Text style={styles.receiptDetails}>Reference #{orderReceipt?.number}</Text>
            <Text style={styles.receiptDetails}>{orderReceipt?.details}</Text>
            <Text style={styles.receiptTotal}>
              Total: R{orderReceipt?.total.toFixed(2)}
            </Text>
            <Text style={styles.inlineError}>
              This is a local order preview; it has not been sent to a restaurant.
            </Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => setOrderReceipt(null)}
              style={[styles.saveFormButton, styles.receiptDoneButton]}
            >
              <Text style={styles.saveFormText}>Done</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF7F1',
  },
  page: {
    flex: 1,
    width: '100%',
    maxWidth: 720,
    alignSelf: 'center',
  },
  listContent: {
    paddingHorizontal: 22,
    paddingBottom: 24,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 20,
  },
  brandMark: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#365A3D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandMarkText: {
    color: '#FFF9EF',
    fontSize: 24,
    fontFamily: 'Georgia',
    fontWeight: '700',
  },
  brandCopy: {
    flex: 1,
    marginLeft: 11,
  },
  brandName: {
    color: '#352A20',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  brandLocation: {
    color: '#82776A',
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 1.25,
    marginTop: 4,
  },
  openBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAECDD',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  openDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#6C7D4E',
    marginRight: 6,
  },
  openBadgeText: {
    color: '#365A3D',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  hero: {
    minHeight: 208,
    backgroundColor: '#365A3D',
    borderRadius: 22,
    overflow: 'hidden',
    padding: 21,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 27,
  },
  heroCopy: {
    flex: 1,
    zIndex: 1,
  },
  eyebrow: {
    color: '#E7D7BE',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1.6,
    marginBottom: 10,
  },
  heroTitle: {
    color: '#FFF9EF',
    fontFamily: 'Georgia',
    fontSize: 32,
    lineHeight: 35,
    letterSpacing: -0.5,
  },
  heroDescription: {
    color: '#E9E3D7',
    fontSize: 11,
    lineHeight: 17,
    maxWidth: 195,
    marginTop: 8,
  },
  heroFootnote: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
  },
  heroFootnoteText: {
    color: '#EAECDD',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1,
  },
  footnoteDivider: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#D6B77D',
    marginHorizontal: 8,
  },
  heroIllustration: {
    width: 132,
    height: 148,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -3,
  },
  plateOuter: {
    width: 116,
    height: 116,
    borderRadius: 58,
    backgroundColor: '#F8F1E5',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '-9deg' }],
    shadowColor: '#493B2D',
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  plateInner: {
    width: 87,
    height: 87,
    borderRadius: 44,
    borderColor: '#E4D9C9',
    borderWidth: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroEmoji: {
    fontSize: 43,
  },
  heroSparkle: {
    width: 29,
    height: 29,
    borderRadius: 15,
    backgroundColor: '#BA6A45',
    position: 'absolute',
    top: 3,
    right: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sparkleText: {
    color: '#FFF9EF',
    fontSize: 18,
  },
  heroAccent: {
    position: 'absolute',
    right: -48,
    bottom: -100,
    width: 174,
    height: 174,
    borderRadius: 90,
    borderWidth: 1,
    borderColor: 'rgba(238, 230, 205, 0.14)',
  },
  sectionHeading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 14,
  },
  sectionEyebrow: {
    color: '#7D7957',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  sectionTitle: {
    color: '#352A20',
    fontFamily: 'Georgia',
    fontSize: 25,
    marginTop: 3,
  },
  menuCount: {
    color: '#8B8174',
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 0.9,
    paddingBottom: 4,
  },
  searchBar: {
    minHeight: 46,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 13,
    backgroundColor: '#fff',
    borderColor: '#E5DCCF',
    borderWidth: 1,
    borderRadius: 12,
  },
  searchIcon: {
    color: '#897E6F',
    fontSize: 26,
    lineHeight: 30,
    marginRight: 7,
  },
  searchInput: {
    flex: 1,
    color: '#352A20',
    fontSize: 12,
    paddingVertical: 10,
  },
  clearSearch: {
    color: '#817568',
    fontSize: 22,
    paddingHorizontal: 4,
  },
  listIntro: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  listIntroText: {
    color: '#514538',
    fontFamily: 'Georgia',
    fontSize: 15,
  },
  listIntroNote: {
    color: '#8B8174',
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  dishCard: {
    flexDirection: 'row',
    alignItems: 'stretch',
    minHeight: 129,
    backgroundColor: '#fff',
    borderRadius: 15,
    marginBottom: 11,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E8DFD3',
    shadowColor: '#4A3F33',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.035,
    shadowRadius: 5,
    elevation: 1,
  },
  dishArtwork: {
    width: 91,
    minHeight: 107,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dishEmoji: {
    fontSize: 38,
  },
  artworkCaption: {
    color: '#756E55',
    fontSize: 6,
    fontWeight: '800',
    letterSpacing: 0.6,
    marginTop: 8,
  },
  dishContent: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: 13,
    paddingVertical: 2,
  },
  dishHeading: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 6,
  },
  dishName: {
    flex: 1,
    color: '#352A20',
    fontFamily: 'Georgia',
    fontSize: 15,
    lineHeight: 19,
  },
  dishPrice: {
    color: '#365A3D',
    fontSize: 12,
    fontWeight: '800',
    paddingTop: 2,
  },
  dishDescription: {
    color: '#7B7062',
    fontSize: 10,
    lineHeight: 15,
    marginTop: 4,
  },
  dishFooter: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 5,
    marginTop: 9,
  },
  badgeGroup: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 4,
  },
  featuredBadge: {
    color: '#756E55',
    fontSize: 7,
    fontWeight: '800',
    letterSpacing: 0.25,
  },
  dietaryBadge: {
    color: '#596D43',
    backgroundColor: '#EEE7D8',
    borderRadius: 4,
    overflow: 'hidden',
    paddingHorizontal: 5,
    paddingVertical: 3,
    fontSize: 6,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  addButton: {
    minWidth: 58,
    height: 29,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#365A3D',
    borderRadius: 8,
    paddingHorizontal: 8,
    gap: 3,
  },
  addButtonText: {
    color: '#FFF9EF',
    fontSize: 14,
    fontWeight: '600',
  },
  addButtonLabel: {
    color: '#FFF9EF',
    fontSize: 9,
    fontWeight: '700',
  },
  quantityControl: {
    height: 29,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0E7DB',
    borderRadius: 8,
    paddingHorizontal: 3,
  },
  quantityAndOptions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  optionsLink: {
    paddingHorizontal: 5,
    paddingVertical: 6,
  },
  optionsLinkText: {
    color: '#365A3D',
    fontSize: 8,
    fontWeight: '700',
  },
  quantityButton: {
    width: 25,
    height: 27,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButtonText: {
    color: '#365A3D',
    fontSize: 17,
    fontWeight: '700',
  },
  quantityValue: {
    color: '#365A3D',
    minWidth: 18,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '800',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 36,
    paddingHorizontal: 20,
  },
  emptyEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  emptyTitle: {
    color: '#352A20',
    fontFamily: 'Georgia',
    fontSize: 17,
    textAlign: 'center',
  },
  emptyDescription: {
    color: '#7B7062',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 5,
  },
  cartDock: {
    minHeight: 77,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderTopColor: '#E5DCCF',
    borderTopWidth: 1,
    paddingHorizontal: 22,
    paddingVertical: 12,
  },
  categoryNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E5DCCF',
    paddingHorizontal: 6,
    paddingTop: 7,
    paddingBottom: 5,
  },
  categoryTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
    borderRadius: 10,
    marginHorizontal: 2,
  },
  categoryTabSelected: {
    backgroundColor: '#EAECDD',
  },
  categoryTabIcon: {
    fontSize: 16,
    marginBottom: 2,
  },
  categoryTabText: {
    color: '#73685B',
    fontSize: 8,
    fontWeight: '700',
  },
  categoryTabCount: {
    color: '#8B8174',
    fontSize: 7,
    marginTop: 2,
  },
  categoryTabTextSelected: {
    color: '#365A3D',
    fontWeight: '800',
  },
  cartSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  cartIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#EFE5D7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  cartIcon: {
    fontSize: 17,
  },
  cartCountBadge: {
    position: 'absolute',
    right: -3,
    top: -4,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#B85C38',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  cartCountText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: '800',
  },
  cartCopy: {
    flex: 1,
  },
  cartTitle: {
    color: '#352A20',
    fontFamily: 'Georgia',
    fontSize: 13,
  },
  cartSubtitle: {
    color: '#83786A',
    fontSize: 9,
    marginTop: 4,
  },
  reviewButton: {
    minHeight: 43,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#365A3D',
    borderRadius: 11,
    paddingHorizontal: 14,
  },
  reviewButtonDisabled: {
    backgroundColor: '#B8AA96',
  },
  reviewButtonText: {
    color: '#FFF9EF',
    fontSize: 10,
    fontWeight: '700',
  },
  reviewArrow: {
    color: '#F2E6D3',
    fontSize: 15,
    fontWeight: '700',
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(22, 32, 25, 0.48)',
  },
  orderSheet: {
    width: '100%',
    maxWidth: 720,
    maxHeight: '88%',
    alignSelf: 'center',
    backgroundColor: '#FAF7F1',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 10,
    paddingHorizontal: 22,
    paddingBottom: 20,
  },
  sheetHandle: {
    width: 35,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E4DCCF',
    alignSelf: 'center',
    marginBottom: 17,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sheetTitle: {
    color: '#352A20',
    fontFamily: 'Georgia',
    fontSize: 26,
    marginTop: 3,
  },
  closeButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#EEE5D8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    color: '#5D5143',
    fontSize: 23,
    lineHeight: 25,
  },
  orderItems: {
    flexShrink: 1,
  },
  orderLine: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
    borderBottomWidth: 1,
    borderBottomColor: '#E5DCCF',
  },
  orderQuantity: {
    minWidth: 31,
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EAECDD',
    borderRadius: 7,
    marginRight: 9,
  },
  orderQuantityText: {
    color: '#476b8c',
    fontSize: 10,
    fontWeight: '800',
  },
  orderDishName: {
    color: '#5D5143',
    fontSize: 11,
  },
  orderDishDetails: {
    flex: 1,
  },
  orderOptions: {
    color: '#7B7062',
    fontSize: 8,
    lineHeight: 12,
    marginTop: 2,
  },
  orderDishPrice: {
    color: '#4A5E3D',
    fontSize: 11,
    fontWeight: '700',
  },
  orderTotalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 15,
    paddingBottom: 19,
  },
  orderTotalLabel: {
    color: '#352A20',
    fontFamily: 'Georgia',
    fontSize: 16,
  },
  inclusiveNote: {
    color: '#8B8174',
    fontSize: 9,
    marginTop: 3,
  },
  orderTotalPrice: {
    color: '#365A3D',
    fontFamily: 'Georgia',
    fontSize: 20,
  },
  serviceLabel: {
    color: '#807466',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1.1,
    marginBottom: 9,
  },
  orderTypeRow: {
    flexDirection: 'row',
    gap: 9,
  },
  orderTypeButton: {
    flex: 1,
    minHeight: 42,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderColor: '#E5DCCF',
    borderWidth: 1,
    borderRadius: 10,
  },
  orderTypeButtonSelected: {
    backgroundColor: '#EEE7D8',
    borderColor: '#7A6B45',
  },
  orderTypeText: {
    color: '#807466',
    fontSize: 11,
    fontWeight: '600',
  },
  orderTypeTextSelected: {
    color: '#3E5A3B',
    fontWeight: '800',
  },
  tableInputGroup: {
    marginTop: 14,
    marginBottom: 8,
  },
  tableLabel: {
    color: '#73685B',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 6,
  },
  tableInput: {
    height: 43,
    color: '#352A20',
    backgroundColor: '#fff',
    borderColor: '#E5DCCF',
    borderWidth: 1,
    borderRadius: 9,
    paddingHorizontal: 12,
    fontSize: 13,
  },
  placeOrderButton: {
    minHeight: 49,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#365A3D',
    borderRadius: 12,
    paddingHorizontal: 15,
    marginTop: 14,
  },
  placeOrderText: {
    color: '#FFF9EF',
    fontSize: 11,
    fontWeight: '700',
  },
  placeOrderPrice: {
    color: '#F2E6D3',
    fontSize: 11,
    fontWeight: '800',
  },
  restaurantSections: {
    marginTop: 24,
    paddingBottom: 8,
  },
  infoSectionTitle: {
    color: '#352A20',
    fontFamily: 'Georgia',
    fontSize: 17,
    marginTop: 3,
  },
  infoSectionDescription: {
    color: '#7B7062',
    fontSize: 11,
    marginTop: 4,
  },
  galleryList: {
    gap: 10,
    paddingTop: 12,
    paddingBottom: 22,
  },
  galleryCard: {
    width: 130,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 8,
    borderWidth: 1,
    borderColor: '#E8DFD3',
  },
  galleryArtwork: {
    height: 92,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  galleryEmoji: {
    fontSize: 34,
  },
  galleryDishName: {
    color: '#352A20',
    fontSize: 10,
    fontWeight: '700',
    marginTop: 8,
  },
  galleryDishCategory: {
    color: '#7B7062',
    fontSize: 7,
    fontWeight: '700',
    letterSpacing: 0.6,
    marginTop: 4,
  },
  restaurantInfoRow: {
    flexDirection: 'row',
    gap: 10,
  },
  restaurantInfoCard: {
    flex: 1,
    minHeight: 150,
    backgroundColor: '#fff',
    borderRadius: 13,
    borderWidth: 1,
    borderColor: '#E8DFD3',
    padding: 14,
  },
  infoIcon: {
    color: '#365A3D',
    fontSize: 21,
    marginBottom: 5,
  },
  infoPlaceholder: {
    color: '#5D5143',
    fontSize: 11,
    lineHeight: 16,
    marginTop: 8,
  },
  contactEmail: {
    color: '#365A3D',
    fontSize: 11,
    fontWeight: '700',
    textDecorationLine: 'underline',
    marginTop: 8,
  },
  infoSetupNote: {
    color: '#7B7062',
    fontSize: 9,
    lineHeight: 13,
    marginTop: 5,
  },
  orderQuantityAction: {
    width: 21,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0E7DB',
    borderRadius: 6,
    marginRight: 3,
  },
  orderQuantityActionText: {
    color: '#365A3D',
    fontSize: 13,
    fontWeight: '700',
  },
  promoRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 5,
  },
  promoInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5DCCF',
    borderRadius: 9,
    paddingHorizontal: 11,
    color: '#352A20',
    fontSize: 11,
  },
  promoButton: {
    minWidth: 66,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#365A3D',
    borderRadius: 9,
  },
  promoButtonText: {
    color: '#FFF9EF',
    fontSize: 10,
    fontWeight: '700',
  },
  promoMessage: {
    color: '#476b8c',
    fontSize: 9,
    marginBottom: 7,
  },
  promoError: {
    color: '#b04a4a',
  },
  costRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  costLabel: {
    color: '#73685B',
    fontSize: 10,
  },
  costValue: {
    color: '#5D5143',
    fontSize: 10,
  },
  discountLabel: {
    color: '#476b8c',
    fontSize: 10,
    fontWeight: '700',
  },
  finalTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E5DCCF',
    paddingTop: 10,
    marginTop: 4,
    marginBottom: 17,
  },
  finalTotalPrice: {
    color: '#365A3D',
    fontFamily: 'Georgia',
    fontSize: 20,
  },
  deliveryNote: {
    color: '#7B7062',
    fontSize: 9,
    marginTop: 5,
  },
  instructionsInput: {
    height: 72,
    paddingTop: 10,
  },
  customizationDescription: {
    color: '#7B7062',
    fontSize: 11,
    marginBottom: 19,
  },
  optionLabel: {
    marginTop: 16,
  },
  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
    marginTop: 8,
  },
  optionPill: {
    minHeight: 34,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5DCCF',
    borderRadius: 18,
    paddingHorizontal: 12,
  },
  optionPillSelected: {
    backgroundColor: '#EAECDD',
    borderColor: '#7A6B45',
  },
  optionText: {
    color: '#73685B',
    fontSize: 10,
    fontWeight: '600',
  },
  optionTextSelected: {
    color: '#3E5A3B',
    fontWeight: '800',
  },
  customQuantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    marginTop: 8,
  },
  manageToggle: {
    marginLeft: 8,
    minHeight: 34,
    justifyContent: 'center',
    paddingHorizontal: 10,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#d8e1e9',
    backgroundColor: '#fff',
  },
  manageToggleActive: {
    backgroundColor: '#365A3D',
    borderColor: '#365A3D',
  },
  manageToggleText: {
    color: '#365A3D',
    fontSize: 9,
    fontWeight: '700',
  },
  manageToggleTextActive: {
    color: '#FFF9EF',
  },
  statsPanel: {
    backgroundColor: '#fff',
    borderColor: '#E5DCCF',
    borderWidth: 1,
    borderRadius: 15,
    padding: 14,
    marginBottom: 23,
  },
  statsTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statBlock: {
    flex: 1,
  },
  statDivider: {
    height: 34,
    width: 1,
    backgroundColor: '#E5DCCF',
    marginHorizontal: 12,
  },
  statLabel: {
    color: '#7B7062',
    fontSize: 7,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  statValue: {
    color: '#365A3D',
    fontFamily: 'Georgia',
    fontSize: 18,
    marginTop: 4,
  },
  addDishButton: {
    minHeight: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#365A3D',
    borderRadius: 9,
    paddingHorizontal: 10,
    marginLeft: 8,
  },
  addDishButtonText: {
    color: '#FFF9EF',
    fontSize: 9,
    fontWeight: '700',
  },
  courseStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopColor: '#E5DCCF',
    borderTopWidth: 1,
    marginTop: 12,
    paddingTop: 10,
  },
  courseStat: {
    alignItems: 'center',
    flex: 1,
  },
  courseStatCount: {
    color: '#352A20',
    fontSize: 13,
    fontWeight: '800',
  },
  courseStatName: {
    color: '#7B7062',
    fontSize: 7,
    marginTop: 3,
  },
  menuNotice: {
    color: '#365A3D',
    backgroundColor: '#EAECDD',
    borderRadius: 8,
    fontSize: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginTop: -13,
    marginBottom: 17,
  },
  listIntroRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  clearFiltersText: {
    color: '#365A3D',
    fontSize: 9,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  manageActions: {
    flexDirection: 'row',
    gap: 6,
  },
  manageButton: {
    minHeight: 30,
    justifyContent: 'center',
    paddingHorizontal: 10,
    backgroundColor: '#EAECDD',
    borderRadius: 8,
  },
  manageButtonText: {
    color: '#365A3D',
    fontSize: 9,
    fontWeight: '700',
  },
  deleteButton: {
    minHeight: 30,
    justifyContent: 'center',
    paddingHorizontal: 9,
    backgroundColor: '#F8E9E2',
    borderRadius: 8,
  },
  deleteButtonText: {
    color: '#a64b4b',
    fontSize: 9,
    fontWeight: '700',
  },
  menuFormScroll: {
    flexShrink: 1,
  },
  formLabel: {
    color: '#5D5143',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.9,
    marginTop: 13,
    marginBottom: 6,
  },
  formInput: {
    minHeight: 42,
    color: '#352A20',
    backgroundColor: '#fff',
    borderColor: '#E8DED2',
    borderWidth: 1,
    borderRadius: 9,
    paddingHorizontal: 11,
    fontSize: 11,
  },
  formDescriptionInput: {
    minHeight: 76,
    paddingTop: 10,
  },
  formCourseRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
  },
  formCourseButton: {
    minHeight: 32,
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderColor: '#E8DED2',
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 10,
  },
  formCourseButtonSelected: {
    backgroundColor: '#EAECDD',
    borderColor: '#7A6B45',
  },
  formCourseText: {
    color: '#73685B',
    fontSize: 8,
    fontWeight: '600',
  },
  formCourseTextSelected: {
    color: '#365A3D',
    fontWeight: '800',
  },
  formError: {
    color: '#b04a4a',
    fontSize: 10,
    marginTop: 9,
  },
  inlineError: {
    color: '#a64b4b',
    fontSize: 10,
    marginBottom: 8,
  },
  receiptDetails: {
    color: '#5D5143',
    fontSize: 12,
    lineHeight: 19,
    marginBottom: 8,
  },
  receiptTotal: {
    color: '#365A3D',
    fontSize: 18,
    fontWeight: '700',
    marginVertical: 8,
  },
  receiptDoneButton: {
    marginTop: 10,
  },
  formActions: {
    flexDirection: 'row',
    gap: 9,
    marginTop: 14,
  },
  cancelFormButton: {
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEE5D8',
    borderRadius: 10,
    paddingHorizontal: 16,
  },
  cancelFormText: {
    color: '#5D5143',
    fontSize: 10,
    fontWeight: '700',
  },
  saveFormButton: {
    flex: 1,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#365A3D',
    borderRadius: 10,
  },
  saveFormText: {
    color: '#FFF9EF',
    fontSize: 10,
    fontWeight: '700',
  },
  destructiveFormButton: {
    flex: 1,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#a64b4b',
    borderRadius: 10,
  },
  destructiveFormText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
});
