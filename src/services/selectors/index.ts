import type { RootState } from '../store';

export const selectIngredients = (state: RootState) => state.ingredients.ingredients;
export const selectIngredientsLoading = (state: RootState) =>
  state.ingredients.isLoading;
export const selectIngredientsError = (state: RootState) => state.ingredients.error;

export const selectBurgerConstructor = (state: RootState) => state.burgerConstructor;

export const selectOrderRequest = (state: RootState) => state.order.orderRequest;
export const selectOrderModalData = (state: RootState) => state.order.orderModalData;
export const selectCurrentOrder = (state: RootState) => state.order.currentOrder;

export const selectFeed = (state: RootState) => state.feed;
export const selectFeedOrders = (state: RootState) => state.feed.orders;
export const selectFeedLoading = (state: RootState) => state.feed.isLoading;
export const selectFeedHasLoaded = (state: RootState) => state.feed.hasLoaded;

export const selectUser = (state: RootState) => state.user.user;
export const selectIsAuthChecked = (state: RootState) => state.user.isAuthChecked;
export const selectUserError = (state: RootState) => state.user.error;

export const selectUserOrders = (state: RootState) => state.userOrders.orders;
export const selectUserOrdersLoading = (state: RootState) => state.userOrders.isLoading;
