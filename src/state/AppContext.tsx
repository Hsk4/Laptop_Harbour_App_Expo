import { createContext, useContext, useEffect, useState } from 'react';
import { getDbClient } from '../database/client';
import { seedDatabase } from '../database/seed';
import { AuthRepository } from '../repositories/authRepository';
import { CartRepository } from '../repositories/cartRepository';
import { FavoriteRepository } from '../repositories/favoriteRepository';
import { OrderRepository } from '../repositories/orderRepository';
import { ProductRepository } from '../repositories/productRepository';
import { CartLine, CatalogFilters, Order, Product, User } from '../types/domain';
import { calculateCartTotal } from '../utils/cart';

interface AppContextValue {
  loading: boolean;
  error?: string;
  currentUser: User | null;
  products: Product[];
  brands: string[];
  favorites: Set<string>;
  cart: CartLine[];
  orders: Order[];
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => void;
  refreshCatalog: (filters?: CatalogFilters) => Promise<void>;
  toggleFavorite: (productId: string) => Promise<void>;
  addToCart: (productId: string, quantity: number) => Promise<void>;
  updateCartQuantity: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  placeOrder: (payload: { address: string; paymentMethod: Order['paymentMethod'] }) => Promise<string>;
  updateProfileName: (name: string) => Promise<void>;
  cartTotal: number;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

const makeOrderId = () => `ord-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [cart, setCart] = useState<CartLine[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  const [repos, setRepos] = useState<{
    auth: AuthRepository;
    products: ProductRepository;
    favorites: FavoriteRepository;
    cart: CartRepository;
    orders: OrderRepository;
  } | null>(null);

  const loadUserData = async (user: User, repositories = repos) => {
    if (!repositories) return;
    const [favoriteIds, cartItems, userOrders] = await Promise.all([
      repositories.favorites.listIds(user.id),
      repositories.cart.list(user.id),
      repositories.orders.listByUser(user.id),
    ]);

    setFavorites(new Set(favoriteIds));
    setCart(cartItems);
    setOrders(userOrders);
  };

  const refreshCatalog = async (filters: CatalogFilters = { query: '' }) => {
    if (!repos) return;
    const [nextProducts, nextBrands] = await Promise.all([
      repos.products.list(filters),
      repos.products.listBrands(),
    ]);
    setProducts(nextProducts);
    setBrands(nextBrands);
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const db = await getDbClient();
        await seedDatabase(db);
        const nextRepos = {
          auth: new AuthRepository(db),
          products: new ProductRepository(db),
          favorites: new FavoriteRepository(db),
          cart: new CartRepository(db),
          orders: new OrderRepository(db),
        };
        setRepos(nextRepos);

        const [nextProducts, nextBrands] = await Promise.all([
          nextRepos.products.list({ query: '' }),
          nextRepos.products.listBrands(),
        ]);

        setProducts(nextProducts);
        setBrands(nextBrands);
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const signIn = async (email: string, password: string) => {
    if (!repos) return;
    const user = await repos.auth.signIn(email, password);
    setCurrentUser(user);
    await loadUserData(user, repos);
  };

  const signUp = async (name: string, email: string, password: string) => {
    if (!repos) return;
    const user = await repos.auth.signUp(email, password, name);
    setCurrentUser(user);
    await loadUserData(user, repos);
  };

  const signOut = () => {
    setCurrentUser(null);
    setFavorites(new Set());
    setCart([]);
    setOrders([]);
  };

  const toggleFavorite = async (productId: string) => {
    if (!repos || !currentUser) return;
    await repos.favorites.toggle(currentUser.id, productId);
    const latest = await repos.favorites.listIds(currentUser.id);
    setFavorites(new Set(latest));
  };

  const addToCart = async (productId: string, quantity: number) => {
    if (!repos || !currentUser) return;
    await repos.cart.add(currentUser.id, productId, quantity);
    setCart(await repos.cart.list(currentUser.id));
  };

  const updateCartQuantity = async (productId: string, quantity: number) => {
    if (!repos || !currentUser) return;
    await repos.cart.updateQuantity(currentUser.id, productId, quantity);
    setCart(await repos.cart.list(currentUser.id));
  };

  const removeFromCart = async (productId: string) => {
    if (!repos || !currentUser) return;
    await repos.cart.remove(currentUser.id, productId);
    setCart(await repos.cart.list(currentUser.id));
  };

  const placeOrder = async (payload: { address: string; paymentMethod: Order['paymentMethod'] }) => {
    if (!repos || !currentUser) throw new Error('Please sign in to place an order.');
    if (!cart.length) throw new Error('Cart is empty.');

    const orderId = makeOrderId();
    await repos.orders.createOrder({
      id: orderId,
      userId: currentUser.id,
      total: calculateCartTotal(cart),
      address: payload.address,
      paymentMethod: payload.paymentMethod,
      items: cart,
    });
    await repos.cart.clear(currentUser.id);
    const [nextOrders, nextCart] = await Promise.all([
      repos.orders.listByUser(currentUser.id),
      repos.cart.list(currentUser.id),
    ]);
    setOrders(nextOrders);
    setCart(nextCart);
    return orderId;
  };

  const updateProfileName = async (name: string) => {
    if (!repos || !currentUser) return;
    await repos.auth.updateName(currentUser.id, name);
    const next = await repos.auth.getById(currentUser.id);
    if (next) setCurrentUser(next);
  };

  const value: AppContextValue = {
    loading,
    error,
    currentUser,
    products,
    brands,
    favorites,
    cart,
    orders,
    signIn,
    signUp,
    signOut,
    refreshCatalog,
    toggleFavorite,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    placeOrder,
    updateProfileName,
    cartTotal: calculateCartTotal(cart),
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = (): AppContextValue => {
  const value = useContext(AppContext);
  if (!value) throw new Error('useApp must be used within AppProvider.');
  return value;
};
