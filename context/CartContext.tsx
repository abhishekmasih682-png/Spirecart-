import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, Product, Order } from '../types';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, options?: { color?: string; size?: string; quantity?: number }) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  placeOrder: (details: { deliveryFee: number, platformFee: number, gst: number, treeContribution: number, total: number }) => void;
  orders: Order[];
  cartTotal: number;
  cartCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);

  // Load orders from local storage on mount
  useEffect(() => {
    const savedOrders = localStorage.getItem('spire_orders');
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  }, []);

  const addToCart = (product: Product, options?: { color?: string; size?: string; quantity?: number }) => {
    const quantityToAdd = options?.quantity || 1;
    
    setItems(prev => {
      // Check for identical variant
      const existing = prev.find(item => 
        item.id === product.id && 
        item.selectedColor === options?.color && 
        item.selectedSize === options?.size
      );

      if (existing) {
        return prev.map(item => 
          item.cartItemId === existing.cartItemId 
            ? { ...item, quantity: item.quantity + quantityToAdd } 
            : item
        );
      }

      // Add new item with unique cartItemId
      const newItem: CartItem = { 
        ...product, 
        quantity: quantityToAdd,
        cartItemId: `${product.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        selectedColor: options?.color,
        selectedSize: options?.size
      };
      
      return [...prev, newItem];
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setItems(prev => prev.filter(item => item.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(cartItemId);
      return;
    }
    setItems(prev => prev.map(item => 
      item.cartItemId === cartItemId ? { ...item, quantity } : item
    ));
  };

  const clearCart = () => setItems([]);

  const placeOrder = (details: { deliveryFee: number, platformFee: number, gst: number, treeContribution: number, total: number }) => {
    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      date: new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      items: [...items],
      total: details.total,
      status: 'Processing',
      deliveryFee: details.deliveryFee,
      platformFee: details.platformFee,
      gst: details.gst,
      treeContribution: details.treeContribution
    };

    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    localStorage.setItem('spire_orders', JSON.stringify(updatedOrders));
    clearCart();
  };

  const cartTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      placeOrder,
      orders,
      cartTotal,
      cartCount,
      isCartOpen,
      setIsCartOpen
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};