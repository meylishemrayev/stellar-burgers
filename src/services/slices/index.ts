export { ingredientsReducer, getIngredients } from './ingredients-slice';

export {
  burgerConstructorReducer,
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  clearConstructor,
} from './constructor-slice';

export {
  orderReducer,
  orderBurger,
  closeOrderModal,
  getOrderByNumber,
} from './order-slice';

export { userReducer, loginUser, registerUser, logoutUser, getUser } from './user-slice';

export { feedReducer, getFeeds } from './feed-slice';

export { ordersReducer, getUserOrders } from './user-orders-slice';
