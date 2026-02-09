import { create } from 'zustand';
import { Order } from '../types';

interface OrdersState {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;
  
  // Actions
  setOrders: (orders: Order[]) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  updateOrder: (updatedOrder: Order) => void;
  removeOrder: (orderId: string) => void;
  reset: () => void;
}

export const useOrdersStore = create<OrdersState>((set) => ({
  orders: [],
  isLoading: false,
  error: null,
  lastFetched: null,

  setOrders: (orders) => set({ 
    orders, 
    lastFetched: Date.now(),
    isLoading: false 
  }),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error, isLoading: false }),
  
  updateOrder: (updatedOrder) => set((state) => ({
    orders: state.orders.map((o) => (o.id === updatedOrder.id ? updatedOrder : o))
  })),

  removeOrder: (orderId) => set((state) => ({
    orders: state.orders.filter((o) => o.id !== orderId)
  })),
  
  reset: () => set({ 
    orders: [], 
    isLoading: false, 
    error: null,
    lastFetched: null
  }),
}));
