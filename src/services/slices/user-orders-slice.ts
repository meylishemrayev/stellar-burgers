import { getOrdersApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import type { TOrder } from '@utils-types';

export const getUserOrders = createAsyncThunk('userOrders/getUserOrders', getOrdersApi);

type TUserOrdersState = {
  orders: TOrder[];
  isLoading: boolean;
  error: string | null;
};

const initialState: TUserOrdersState = {
  orders: [],
  isLoading: false,
  error: null,
};

export const userOrdersSlice = createSlice({
  name: 'userOrders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Ошибка загрузки заказов';
      })
      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      });
  },
});

export const ordersReducer = userOrdersSlice.reducer;
