import { configureStore } from '@reduxjs/toolkit';
import {
  type TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook,
} from 'react-redux';

import { rootReducer } from './root-reducer';

const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
