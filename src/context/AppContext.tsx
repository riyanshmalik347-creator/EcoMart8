import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Product, 
  CartItem, 
  ThemeMode, 
  AccentColor, 
  OrderConfirmationData,
  ProductCategory 
} from '../types.ts';
import { PRODUCTS } from '../data/products.ts';

interface AppContextType {
  // Theme & Accent
  theme: ThemeMode;
  setTheme: (mode: ThemeMode) => void;
  accent: AccentColor;
  setAccent: (accent: AccentColor) => void;

  // View Navigation
  currentView: 'home' | 'shop' | 'compare' | 'cart' | 'checkout' | 'confirmation';
  setCurrentView: (view: 'home' | 'shop' | 'compare' | 'cart' | 'checkout' | 'confirmation') => void;
  
  // Filter state passed from search/hero
  selectedCategory: ProductCategory | 'All';
  setSelectedCategory: (cat: ProductCategory | 'All') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartItemCount: number;
  averageCartEcoScore: number;
  totalReusableCartItems: number;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;

  // Product Comparison (max 3)
  comparedIds: string[];
  addToComparison: (productId: string) => void;
  removeFromComparison: (productId: string) => void;
  isInComparison: (productId: string) => boolean;
  clearComparison: () => void;

  // Modals & Panels
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  isEcoAgentOpen: boolean;
  setIsEcoAgentOpen: (open: boolean) => void;
  agentInitialPrompt: string;
  setAgentInitialPrompt: (prompt: string) => void;
  isScoreExplainerOpen: boolean;
  setIsScoreExplainerOpen: (open: boolean) => void;

  // Order Confirmation
  confirmedOrder: OrderConfirmationData | null;
  setConfirmedOrder: (order: OrderConfirmationData | null) => void;

  // Toast feedback
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'ecomart_cart_v1';
const THEME_STORAGE_KEY = 'ecomart_theme_v1';
const ACCENT_STORAGE_KEY = 'ecomart_accent_v1';
const COMPARE_STORAGE_KEY = 'ecomart_compare_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode;
      return saved === 'light' || saved === 'dark' || saved === 'system' ? saved : 'system';
    } catch {
      return 'system';
    }
  });

  // Accent state
  const [accent, setAccentState] = useState<AccentColor>(() => {
    try {
      const saved = localStorage.getItem(ACCENT_STORAGE_KEY) as AccentColor;
      return saved === 'forest' || saved === 'sage' || saved === 'terracotta' || saved === 'amber' ? saved : 'forest';
    } catch {
      return 'forest';
    }
  });

  // Navigation
  const [currentView, setCurrentView] = useState<'home' | 'shop' | 'compare' | 'cart' | 'checkout' | 'confirmation'>('home');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Cart state
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (!saved) return [];
      const parsed: Array<{ productId: string; quantity: number }> = JSON.parse(saved);
      return parsed
        .map((item) => {
          const product = PRODUCTS.find((p) => p.id === item.productId);
          return product ? { product, quantity: item.quantity } : null;
        })
        .filter((item): item is CartItem => item !== null);
    } catch {
      return [];
    }
  });

  // Comparison
  const [comparedIds, setComparedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(COMPARE_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modals & Panels
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEcoAgentOpen, setIsEcoAgentOpen] = useState(false);
  const [agentInitialPrompt, setAgentInitialPrompt] = useState('');
  const [isScoreExplainerOpen, setIsScoreExplainerOpen] = useState(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  // Confirmed order
  const [confirmedOrder, setConfirmedOrder] = useState<OrderConfirmationData | null>(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3200);
  };

  // Sync theme to DOM
  useEffect(() => {
    const root = document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = () => {
      const isDark = theme === 'dark' || (theme === 'system' && mediaQuery.matches);
      if (isDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    applyTheme();
    mediaQuery.addEventListener('change', applyTheme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {}

    return () => mediaQuery.removeEventListener('change', applyTheme);
  }, [theme]);

  // Sync accent to DOM
  useEffect(() => {
    document.documentElement.setAttribute('data-accent', accent);
    try {
      localStorage.setItem(ACCENT_STORAGE_KEY, accent);
    } catch {}
  }, [accent]);

  // Sync cart to localStorage
  useEffect(() => {
    try {
      const serialized = cart.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
      }));
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(serialized));
    } catch {}
  }, [cart]);

  // Sync comparison to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(comparedIds));
    } catch {}
  }, [comparedIds]);

  const setTheme = (mode: ThemeMode) => {
    setThemeState(mode);
  };

  const setAccent = (acc: AccentColor) => {
    setAccentState(acc);
  };

  // Cart operations
  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showToast(`Added ${product.name} to your cart`);
  };

  const removeFromCart = (productId: string) => {
    const item = cart.find((i) => i.product.id === productId);
    setCart((prev) => prev.filter((i) => i.product.id !== productId));
    if (item) {
      showToast(`Removed ${item.product.name} from cart`);
    }
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const averageCartEcoScore = cart.length > 0
    ? Math.round(
        cart.reduce((sum, item) => sum + item.product.ecoScore * item.quantity, 0) /
        Math.max(1, cartItemCount)
      )
    : 0;

  const totalReusableCartItems = cart
    .filter((item) => item.product.isReusable)
    .reduce((sum, item) => sum + item.quantity, 0);

  // Comparison operations
  const addToComparison = (productId: string) => {
    if (comparedIds.includes(productId)) return;
    if (comparedIds.length >= 3) {
      showToast('You can compare up to 3 products at a time');
      return;
    }
    setComparedIds((prev) => [...prev, productId]);
    showToast('Added to product comparison');
  };

  const removeFromComparison = (productId: string) => {
    setComparedIds((prev) => prev.filter((id) => id !== productId));
  };

  const isInComparison = (productId: string) => comparedIds.includes(productId);

  const clearComparison = () => {
    setComparedIds([]);
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        setTheme,
        accent,
        setAccent,
        currentView,
        setCurrentView,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartSubtotal,
        cartItemCount,
        averageCartEcoScore,
        totalReusableCartItems,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        comparedIds,
        addToComparison,
        removeFromComparison,
        isInComparison,
        clearComparison,
        selectedProduct,
        setSelectedProduct,
        isEcoAgentOpen,
        setIsEcoAgentOpen,
        agentInitialPrompt,
        setAgentInitialPrompt,
        isScoreExplainerOpen,
        setIsScoreExplainerOpen,
        confirmedOrder,
        setConfirmedOrder,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
