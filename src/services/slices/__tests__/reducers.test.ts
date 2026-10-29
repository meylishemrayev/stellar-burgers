import { ingredientsSlice, getIngredients } from '../ingredients-slice';
import { constructorSlice } from '../constructor-slice';
import type { TIngredient } from '@utils-types';

const mockIngredient: TIngredient = {
  _id: '1',
  name: 'Тестовая булка',
  type: 'bun',
  proteins: 10,
  fat: 10,
  carbohydrates: 10,
  calories: 100,
  price: 200,
  image: 'image.png',
  image_large: 'image_large.png',
  image_mobile: 'image_mobile.png',
};

const mockFilling: TIngredient = {
  ...mockIngredient,
  _id: '2',
  name: 'Тестовая начинка',
  type: 'main',
};

describe('ingredientsSlice reducer', () => {
  const initialState = ingredientsSlice.getInitialState();

  it('должен возвращать начальное состояние при вызове с undefined и UNKNOWN экшеном', () => {
    expect(ingredientsSlice.reducer(undefined, { type: 'UNKNOWN' })).toEqual(
      initialState
    );
  });

  it('должен обрабатывать getIngredients.pending', () => {
    const action = { type: getIngredients.pending.type };
    const state = ingredientsSlice.reducer(initialState, action);
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('должен обрабатывать getIngredients.rejected', () => {
    const action = {
      type: getIngredients.rejected.type,
      error: { message: 'Ошибка сети' },
    };
    const state = ingredientsSlice.reducer(initialState, action);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка сети');
  });

  it('должен обрабатывать getIngredients.fulfilled', () => {
    const action = {
      type: getIngredients.fulfilled.type,
      payload: [mockIngredient],
    };
    const state = ingredientsSlice.reducer(initialState, action);
    expect(state.isLoading).toBe(false);
    expect(state.ingredients).toEqual([mockIngredient]);
  });
});

describe('constructorSlice reducer', () => {
  const initialState = constructorSlice.getInitialState();

  it('должен возвращать начальное состояние при вызове с undefined и UNKNOWN экшеном', () => {
    expect(constructorSlice.reducer(undefined, { type: 'UNKNOWN' })).toEqual(
      initialState
    );
  });

  it('должен добавлять булку (addIngredient)', () => {
    const action = constructorSlice.actions.addIngredient(mockIngredient);
    const state = constructorSlice.reducer(initialState, action);

    expect(state.bun).toBeDefined();
    expect(state.bun?.name).toBe('Тестовая булка');
    expect(state.bun?.id).toBeDefined();
  });

  it('должен добавлять начинку (addIngredient)', () => {
    const action = constructorSlice.actions.addIngredient(mockFilling);
    const state = constructorSlice.reducer(initialState, action);

    expect(state.ingredients.length).toBe(1);
    expect(state.ingredients[0].name).toBe('Тестовая начинка');
    expect(state.ingredients[0].id).toBeDefined();
  });

  it('должен удалять ингредиент (removeIngredient)', () => {
    const addedAction = constructorSlice.actions.addIngredient(mockFilling);
    const stateWithIngredient = constructorSlice.reducer(initialState, addedAction);
    const idToRemove = stateWithIngredient.ingredients[0].id;

    const removeAction = constructorSlice.actions.removeIngredient(idToRemove);
    const state = constructorSlice.reducer(stateWithIngredient, removeAction);

    expect(state.ingredients.length).toBe(0);
  });

  it('должен перемещать ингредиенты (moveIngredientUp, moveIngredientDown)', () => {
    const stateWithTwoIngredients = {
      bun: null,
      ingredients: [
        { ...mockFilling, id: 'id1', name: 'Первый' },
        { ...mockFilling, id: 'id2', name: 'Второй' },
      ],
    };

    const upAction = constructorSlice.actions.moveIngredientUp(1);
    const stateUp = constructorSlice.reducer(stateWithTwoIngredients, upAction);
    expect(stateUp.ingredients[0].name).toBe('Второй');

    const downAction = constructorSlice.actions.moveIngredientDown(0);
    const stateDown = constructorSlice.reducer(stateWithTwoIngredients, downAction);
    expect(stateDown.ingredients[0].name).toBe('Второй');
  });

  it('должен очищать конструктор (clearConstructor)', () => {
    const stateWithIngredients = {
      bun: { ...mockIngredient, id: '1' },
      ingredients: [{ ...mockFilling, id: '2' }],
    };
    const action = constructorSlice.actions.clearConstructor();
    const state = constructorSlice.reducer(stateWithIngredients, action);

    expect(state.bun).toBeNull();
    expect(state.ingredients.length).toBe(0);
  });
});
