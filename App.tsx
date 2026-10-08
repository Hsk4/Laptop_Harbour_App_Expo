import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { AppProvider, useApp } from './src/state/AppContext';
import { allCategories } from './src/data/seedProducts';
import { theme } from './src/constants/theme';
import { Order, Product } from './src/types/domain';

const money = (value: number) => `$${value.toFixed(2)}`;

type Tab = 'Home' | 'Catalog' | 'Wishlist' | 'Cart' | 'Profile';

const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
});

const AuthScreen = () => {
  const { signIn, signUp } = useApp();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!email || !password || (mode === 'signup' && !name)) {
      Alert.alert('Missing fields', 'Please complete all required fields.');
      return;
    }
    setBusy(true);
    try {
      if (mode === 'signin') {
        await signIn(email, password);
      } else {
        await signUp(name, email, password);
      }
    } catch (e) {
      Alert.alert('Authentication failed', (e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.authBox}>
        <Text style={styles.brand}>Laptop Harbour</Text>
        {mode === 'signup' && (
          <TextInput value={name} onChangeText={setName} placeholder="Name" style={styles.input} />
        )}
        <TextInput value={email} onChangeText={setEmail} placeholder="Email" autoCapitalize="none" style={styles.input} />
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          secureTextEntry
          autoCapitalize="none"
          style={styles.input}
        />
        <Pressable style={styles.primaryButton} onPress={submit} disabled={busy}>
          <Text style={styles.primaryButtonText}>{busy ? 'Loading...' : mode === 'signin' ? 'Sign In' : 'Create Account'}</Text>
        </Pressable>
        <Pressable onPress={() => setMode(mode === 'signin' ? 'signup' : 'signin')}>
          <Text style={styles.linkText}>
            {mode === 'signin' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const ProductCard = ({
  product,
  favorite,
  onToggleFavorite,
  onOpen,
}: {
  product: Product;
  favorite: boolean;
  onToggleFavorite: () => void;
  onOpen: () => void;
}) => (
  <Pressable style={cardStyles.card} onPress={onOpen}>
    <Image source={{ uri: product.imageUrl }} style={{ width: '100%', height: 120, borderRadius: 8 }} />
    <Text style={styles.productName}>{product.name}</Text>
    <Text style={styles.productMeta}>{product.brand} • {product.category}</Text>
    <Text style={styles.price}>{money(product.price)}</Text>
    <Pressable onPress={onToggleFavorite} style={styles.smallButton}>
      <Text style={styles.smallButtonText}>{favorite ? '♥ Remove Favorite' : '♡ Add Favorite'}</Text>
    </Pressable>
  </Pressable>
);

const CatalogScreen = ({ onOpen }: { onOpen: (product: Product) => void }) => {
  const { products, brands, favorites, refreshCatalog, toggleFavorite } = useApp();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<(typeof allCategories)[number]>('All');
  const [brand, setBrand] = useState<string>('All');

  useEffect(() => {
    refreshCatalog({ query, category, brand }).catch(() => undefined);
  }, [query, category, brand]);

  return (
    <View style={styles.screen}>
      <TextInput value={query} onChangeText={setQuery} placeholder="Search laptops" style={styles.input} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 8 }}>
        {allCategories.map((item) => (
          <Pressable
            key={item}
            style={[styles.chip, category === item && styles.chipActive]}
            onPress={() => setCategory(item)}
          >
            <Text style={category === item ? styles.chipTextActive : styles.chipText}>{item}</Text>
          </Pressable>
        ))}
      </ScrollView>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 8 }}>
        {['All', ...brands].map((item) => (
          <Pressable key={item} style={[styles.chip, brand === item && styles.chipActive]} onPress={() => setBrand(item)}>
            <Text style={brand === item ? styles.chipTextActive : styles.chipText}>{item}</Text>
          </Pressable>
        ))}
      </ScrollView>
      {!products.length ? (
        <Text style={styles.emptyText}>No laptops found for your filters.</Text>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              favorite={favorites.has(item.id)}
              onToggleFavorite={() => toggleFavorite(item.id)}
              onOpen={() => onOpen(item)}
            />
          )}
        />
      )}
    </View>
  );
};

const ProductDetailScreen = ({ product, onBack }: { product: Product; onBack: () => void }) => {
  const { addToCart, favorites, toggleFavorite, currentUser } = useApp();
  const [quantity, setQuantity] = useState(1);

  return (
    <ScrollView style={styles.screen}>
      <Pressable onPress={onBack}><Text style={styles.linkText}>← Back</Text></Pressable>
      <Image source={{ uri: product.imageUrl }} style={{ width: '100%', height: 220, borderRadius: 12, marginBottom: 12 }} />
      <Text style={styles.title}>{product.name}</Text>
      <Text style={styles.productMeta}>{product.brand} • {product.category}</Text>
      <Text style={styles.price}>{money(product.price)}</Text>
      <Text style={{ marginVertical: 12 }}>{product.description}</Text>
      <View style={styles.row}>
        <Pressable style={styles.qtyButton} onPress={() => setQuantity((v) => Math.max(1, v - 1))}><Text>-</Text></Pressable>
        <Text style={{ marginHorizontal: 12 }}>{quantity}</Text>
        <Pressable style={styles.qtyButton} onPress={() => setQuantity((v) => v + 1)}><Text>+</Text></Pressable>
      </View>
      <Pressable style={styles.primaryButton} onPress={() => addToCart(product.id, quantity)}>
        <Text style={styles.primaryButtonText}>Add to Cart</Text>
      </Pressable>
      <Pressable style={styles.secondaryButton} onPress={() => toggleFavorite(product.id)}>
        <Text>{favorites.has(product.id) ? 'Remove Favorite' : 'Add Favorite'}</Text>
      </Pressable>
      {!currentUser && <Text style={styles.emptyText}>Sign in to keep cart/favorites linked to your account.</Text>}
    </ScrollView>
  );
};

const WishlistScreen = ({ onOpen }: { onOpen: (product: Product) => void }) => {
  const { products, favorites, toggleFavorite } = useApp();
  const favoriteProducts = useMemo(() => products.filter((p) => favorites.has(p.id)), [products, favorites]);

  if (!favoriteProducts.length) {
    return <Text style={styles.emptyText}>Your wishlist is empty.</Text>;
  }

  return (
    <FlatList
      style={styles.screen}
      data={favoriteProducts}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <ProductCard
          product={item}
          favorite
          onToggleFavorite={() => toggleFavorite(item.id)}
          onOpen={() => onOpen(item)}
        />
      )}
    />
  );
};

const CartScreen = () => {
  const { cart, cartTotal, updateCartQuantity, removeFromCart, placeOrder } = useApp();
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<Order['paymentMethod']>('Cash on Delivery');

  const checkout = async () => {
    if (!address.trim()) {
      Alert.alert('Address required', 'Please provide a delivery address.');
      return;
    }
    try {
      const orderId = await placeOrder({ address: address.trim(), paymentMethod });
      setAddress('');
      Alert.alert('Order placed', `Order ${orderId} created successfully.`);
    } catch (e) {
      Alert.alert('Checkout failed', (e as Error).message);
    }
  };

  if (!cart.length) return <Text style={styles.emptyText}>Your cart is empty.</Text>;

  return (
    <ScrollView style={styles.screen}>
      {cart.map((line) => (
        <View key={line.productId} style={cardStyles.card}>
          <Text style={styles.productName}>{line.product.name}</Text>
          <Text style={styles.productMeta}>{money(line.product.price)} each</Text>
          <View style={[styles.row, { marginTop: 8 }]}>
            <Pressable style={styles.qtyButton} onPress={() => updateCartQuantity(line.productId, line.quantity - 1)}><Text>-</Text></Pressable>
            <Text style={{ marginHorizontal: 12 }}>{line.quantity}</Text>
            <Pressable style={styles.qtyButton} onPress={() => updateCartQuantity(line.productId, line.quantity + 1)}><Text>+</Text></Pressable>
            <Pressable onPress={() => removeFromCart(line.productId)} style={{ marginLeft: 'auto' }}><Text style={{ color: theme.colors.danger }}>Remove</Text></Pressable>
          </View>
        </View>
      ))}
      <Text style={styles.title}>Total: {money(cartTotal)}</Text>
      <TextInput value={address} onChangeText={setAddress} placeholder="Delivery address" multiline style={styles.input} />
      <View style={styles.row}>
        <Pressable
          style={[styles.chip, paymentMethod === 'Cash on Delivery' && styles.chipActive]}
          onPress={() => setPaymentMethod('Cash on Delivery')}
        >
          <Text style={paymentMethod === 'Cash on Delivery' ? styles.chipTextActive : styles.chipText}>Cash on Delivery</Text>
        </Pressable>
        <Pressable
          style={[styles.chip, paymentMethod === 'Credit Card' && styles.chipActive]}
          onPress={() => setPaymentMethod('Credit Card')}
        >
          <Text style={paymentMethod === 'Credit Card' ? styles.chipTextActive : styles.chipText}>Credit Card</Text>
        </Pressable>
      </View>
      <Pressable style={styles.primaryButton} onPress={checkout}>
        <Text style={styles.primaryButtonText}>Place Order</Text>
      </Pressable>
    </ScrollView>
  );
};

const ProfileScreen = ({ onOpenOrders }: { onOpenOrders: () => void }) => {
  const { currentUser, signOut, updateProfileName } = useApp();
  const [name, setName] = useState(currentUser?.name ?? '');

  useEffect(() => setName(currentUser?.name ?? ''), [currentUser?.name]);

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Welcome, {currentUser?.name}</Text>
      <Text style={styles.productMeta}>Email: {currentUser?.email}</Text>
      <TextInput value={name} onChangeText={setName} placeholder="Update name" style={styles.input} />
      <Pressable style={styles.primaryButton} onPress={() => updateProfileName(name.trim())}>
        <Text style={styles.primaryButtonText}>Update Profile</Text>
      </Pressable>
      <Pressable style={styles.secondaryButton} onPress={onOpenOrders}><Text>View Order History</Text></Pressable>
      <Pressable style={styles.secondaryButton} onPress={signOut}><Text>Sign Out</Text></Pressable>
    </View>
  );
};

const OrdersScreen = ({ onBack }: { onBack: () => void }) => {
  const { orders } = useApp();

  return (
    <ScrollView style={styles.screen}>
      <Pressable onPress={onBack}><Text style={styles.linkText}>← Back to Profile</Text></Pressable>
      <Text style={styles.title}>Order History</Text>
      {!orders.length ? <Text style={styles.emptyText}>No orders yet.</Text> : null}
      {orders.map((order) => (
        <View key={order.id} style={cardStyles.card}>
          <Text style={styles.productName}>Order {order.id}</Text>
          <Text style={styles.productMeta}>{new Date(order.createdAt).toLocaleString()}</Text>
          <Text style={styles.productMeta}>{order.paymentMethod} • {money(order.total)}</Text>
          <Text style={styles.productMeta}>Address: {order.address}</Text>
          {order.items.map((line) => (
            <Text key={line.productId} style={styles.productMeta}>• {line.product.name} x{line.quantity}</Text>
          ))}
        </View>
      ))}
    </ScrollView>
  );
};

const HomeScreen = ({ onGoCatalog }: { onGoCatalog: () => void }) => (
  <ScrollView style={styles.screen}>
    <View style={[cardStyles.card, { backgroundColor: '#fee2e2' }]}>
      <Text style={styles.title}>Welcome to Laptop Harbour</Text>
      <Text style={styles.productMeta}>Where quality laptops dock for less.</Text>
      <Pressable style={styles.primaryButton} onPress={onGoCatalog}>
        <Text style={styles.primaryButtonText}>Explore Catalog</Text>
      </Pressable>
    </View>
    <Text style={styles.title}>Featured Categories</Text>
    {allCategories.filter((c) => c !== 'All').map((c) => (
      <View key={c} style={cardStyles.card}><Text>{c}</Text></View>
    ))}
  </ScrollView>
);

const AppShell = () => {
  const { loading, error, currentUser } = useApp();
  const [tab, setTab] = useState<Tab>('Home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showOrders, setShowOrders] = useState(false);

  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text>Initializing Laptop Harbour...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={{ color: theme.colors.danger }}>Error: {error}</Text>
      </SafeAreaView>
    );
  }

  if (!currentUser) return <AuthScreen />;

  if (selectedProduct) {
    return <ProductDetailScreen product={selectedProduct} onBack={() => setSelectedProduct(null)} />;
  }

  if (showOrders) {
    return <OrdersScreen onBack={() => setShowOrders(false)} />;
  }

  const tabContent = {
    Home: <HomeScreen onGoCatalog={() => setTab('Catalog')} />,
    Catalog: <CatalogScreen onOpen={setSelectedProduct} />,
    Wishlist: <WishlistScreen onOpen={setSelectedProduct} />,
    Cart: <CartScreen />,
    Profile: <ProfileScreen onOpenOrders={() => setShowOrders(true)} />,
  }[tab];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={{ flex: 1 }}>{tabContent}</View>
      <View style={styles.tabs}>
        {(['Home', 'Catalog', 'Wishlist', 'Cart', 'Profile'] as Tab[]).map((item) => (
          <Pressable key={item} onPress={() => setTab(item)} style={[styles.tab, tab === item && styles.activeTab]}>
            <Text style={tab === item ? styles.activeTabText : styles.tabText}>{item}</Text>
          </Pressable>
        ))}
      </View>
    </SafeAreaView>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10 },
  screen: { flex: 1, padding: 14 },
  authBox: { margin: 16, padding: 16, backgroundColor: 'white', borderRadius: 12, gap: 10 },
  brand: { fontSize: 28, fontWeight: '700', color: theme.colors.primary, textAlign: 'center', marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
    backgroundColor: 'white',
  },
  primaryButton: { backgroundColor: theme.colors.primary, borderRadius: 8, padding: 12, alignItems: 'center', marginTop: 6 },
  primaryButtonText: { color: 'white', fontWeight: '600' },
  secondaryButton: { backgroundColor: '#f3f4f6', borderRadius: 8, padding: 12, alignItems: 'center', marginTop: 8 },
  linkText: { color: theme.colors.primary, marginTop: 8 },
  tabs: { flexDirection: 'row', backgroundColor: 'white', borderTopWidth: 1, borderColor: '#e5e7eb' },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  tabText: { color: theme.colors.muted },
  activeTab: { backgroundColor: '#fee2e2' },
  activeTabText: { color: theme.colors.primary, fontWeight: '700' },
  title: { fontSize: 20, fontWeight: '700', color: theme.colors.text, marginBottom: 6 },
  productName: { fontSize: 16, fontWeight: '700', color: theme.colors.text, marginTop: 8 },
  productMeta: { color: theme.colors.muted, marginTop: 2 },
  price: { color: theme.colors.success, fontWeight: '700', marginTop: 4, fontSize: 16 },
  emptyText: { color: theme.colors.muted, padding: 20, textAlign: 'center' },
  smallButton: { marginTop: 8, padding: 8, borderRadius: 8, backgroundColor: '#f3f4f6' },
  smallButtonText: { color: theme.colors.text },
  chip: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6, marginRight: 8 },
  chipActive: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
  chipText: { color: theme.colors.text },
  chipTextActive: { color: 'white' },
  row: { flexDirection: 'row', alignItems: 'center' },
  qtyButton: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#e5e7eb', alignItems: 'center', justifyContent: 'center' },
});
