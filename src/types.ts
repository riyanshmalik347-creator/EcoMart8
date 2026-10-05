export type ProductCategory = 
  | 'Home' 
  | 'Kitchen' 
  | 'Personal Care' 
  | 'Fashion' 
  | 'Reusable Goods';

export interface ScoreBreakdown {
  material: number;      // max 25
  durability: number;    // max 20
  reusability: number;   // max 25
  packaging: number;     // max 15
  recyclability: number; // max 15
}

export interface Product {
  id: string;
  name: string;
  tagline: string;
  category: ProductCategory;
  price: number; // in INR (₹)
  originalPrice?: number;
  description: string;
  material: string;
  materialTag: string; // simplified tag for filtering e.g. "Organic Cotton", "Bamboo", "Stainless Steel", "Clay", "Reclaimed Wood", "Glass", "Natural Wax"
  durability: string;
  reusability: string;
  isReusable: boolean;
  packaging: string;
  recyclability: string;
  ecoScore: number; // 0-100
  scoreBreakdown: ScoreBreakdown;
  image: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  featured: boolean;
  popular: boolean;
  badge?: string;
  certifications: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type EcoCause = 
  | 'tree_plantation' 
  | 'ocean_cleanup' 
  | 'waste_reduction' 
  | 'wildlife_conservation';

export interface CauseDetails {
  id: EcoCause;
  name: string;
  iconName: string;
  tagline: string;
  impactMetric: string;
  organization: string;
}

export interface CheckoutForm {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  contributionAmount: number;
  selectedCause: EcoCause;
}

export interface OrderConfirmationData {
  orderId: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  contributionAmount: number;
  total: number;
  selectedCause: EcoCause;
  customer: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  createdAt: string;
  impactStats: {
    averageEcoScore: number;
    sustainableProductsCount: number;
    reusableItemsCount: number;
    plasticBottlesAvoided: number;
    carbonOffsetKg: number;
    contributionAmount: number;
    causeName: string;
  };
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent' | 'system';
  text: string;
  recommendedProductIds?: string[];
  suggestedQuestions?: string[];
  timestamp: string;
  isError?: boolean;
}

export type ThemeMode = 'light' | 'dark' | 'system';
export type AccentColor = 'forest' | 'sage' | 'terracotta' | 'amber';
