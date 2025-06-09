import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Product } from '../types';
import { products as initialProducts } from '../data/products';

interface ProductsState {
  items: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  items: initialProducts,
  loading: false,
  error: null,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    updateInventory: (state, action: PayloadAction<{ productId: string; quantity: number }>) => {
      const product = state.items.find(item => item.id === action.payload.productId);
      if (product) {
        product.inventory -= action.payload.quantity;
      }
    },
  },
});

export const { updateInventory } = productsSlice.actions;
export default productsSlice.reducer; 