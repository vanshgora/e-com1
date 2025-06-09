import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Order, OrderItem } from '../types';

interface OrdersState {
  items: Order[];
  loading: boolean;
  error: string | null;
}

const initialState: OrdersState = {
  items: [],
  loading: false,
  error: null,
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    addOrder: (state, action: PayloadAction<Order>) => {
      state.items.push(action.payload);
    },
    updateOrderStatus: (state, action: PayloadAction<{ orderId: string; status: Order['status'] }>) => {
      const order = state.items.find(item => item.id === action.payload.orderId);
      if (order) {
        order.status = action.payload.status;
      }
    },
  },
});

export const { addOrder, updateOrderStatus } = ordersSlice.actions;
export default ordersSlice.reducer; 