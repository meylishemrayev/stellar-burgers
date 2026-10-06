import { combineReducers } from '@reduxjs/toolkit';

import { ingredientsSlice } from './slices/ingredients-slice';
import { constructorSlice } from './slices/constructor-slice';
import { orderSlice } from './slices/order-slice';
import { feedSlice } from './slices/feed-slice';
import { userSlice } from './slices/user-slice';
import { userOrdersSlice } from './slices/user-orders-slice';

export const rootReducer = combineReducers({
  ingredients: ingredientsSlice.reducer,
  burgerConstructor: constructorSlice.reducer,
  order: orderSlice.reducer,
  feed: feedSlice.reducer,
  user: userSlice.reducer,
  userOrders: userOrdersSlice.reducer,
});
