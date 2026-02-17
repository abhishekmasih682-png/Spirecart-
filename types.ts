export enum CategoryType {
  FASHION = 'Fashion',
  GROCERY = 'Grocery',
  FOOD_DELIVERY = 'Food',
  PHARMACY = 'Pharmacy',
  ELECTRONICS = 'Electronics',
  BEAUTY = 'Beauty',
  HOME = 'Home & Kitchen',
  TOYS = 'Toys & Baby'
}

export interface Product {
  id: string;
  name: string;
  description: string;
  details?: string; // Long description
  seller?: string;  // Seller name
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  category: CategoryType;
  subCategory?: string; // e.g., "Smartphones", "Curries", "Vegetables"
  deliveryTime: string; // e.g., "10 mins", "2 days"
  isPrime?: boolean;
  discount?: number;
  // Food specific
  restaurantName?: string;
  cuisine?: string;
  isVeg?: boolean;
  // Grocery specific
  weight?: string;
  // Pharmacy specific
  requiresPrescription?: boolean;
  safeLogo?: boolean;
  // Fashion specific
  brand?: string;
  colors?: string[];
  sizes?: string[];
}

export interface CartItem extends Product {
  quantity: number;
  cartItemId: string;
  selectedColor?: string;
  selectedSize?: string;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  status: 'Delivered' | 'On the way' | 'Cancelled' | 'Processing';
  deliveryFee: number;
  platformFee: number;
  gst: number;
  treeContribution: number;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  helpfulCount: number;
  verifiedPurchase: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  relatedProducts?: Product[];
  groundingLinks?: { title: string; uri: string }[];
  feedback?: 'up' | 'down';
}

export interface QuickCategory {
  id: string;
  label: string;
  image: string;
  color?: string;
}

export interface Address {
  id: string;
  tag: 'Home' | 'Work' | 'Other';
  street: string;
  area: string;
  city: string;
  state: string;
  zip: string;
  isDefault: boolean;
}