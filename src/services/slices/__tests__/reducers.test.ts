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
  const expectedInitialState = {
    ingredients: [],
    isLoading: false,
    error: null,
  };

  it('должен возвращать начальное состояние при вызове с undefined и UNKNOWN экшеном', () => {
    expect(ingredientsSlice.reducer(undefined, { type: 'UNKNOWN' })).toEqual(
      expectedInitialState
    );
  });

  it('должен обрабатывать getIngredients.pending', () => {
    const stateWithError = {
      ingredients: [],
      isLoading: false,
      error: 'Предыдущая ошибка',
    };
    const action = { type: getIngredients.pending.type };

    const state = ingredientsSlice.reducer(stateWithError, action);

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('должен обрабатывать getIngredients.rejected', () => {
    const stateLoading = {
      ingredients: [],
      isLoading: true,
      error: null,
    };
    const action = {
      type: getIngredients.rejected.type,
      error: { message: 'Ошибка сети' },
    };

    const state = ingredientsSlice.reducer(stateLoading, action);

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка сети');
  });

  it('должен обрабатывать getIngredients.fulfilled', () => {
    const stateLoading = {
      ingredients: [],
      isLoading: true,
      error: null,
    };
    const action = {
      type: getIngredients.fulfilled.type,
      payload: [mockIngredient],
    };

    const state = ingredientsSlice.reducer(stateLoading, action);

    expect(state.isLoading).toBe(false);
    expect(state.ingredients).toEqual([mockIngredient]);
  });
});

describe('constructorSlice reducer', () => {
  const expectedInitialState = {
    bun: null,
    ingredients: [],
  };

  it('должен возвращать начальное состояние при вызове с undefined и UNKNOWN экшеном', () => {
    expect(constructorSlice.reducer(undefined, { type: 'UNKNOWN' })).toEqual(
      expectedInitialState
    );
  });

  it('должен добавлять булку (addIngredient)', () => {
    const action = constructorSlice.actions.addIngredient(mockIngredient);
    const state = constructorSlice.reducer(expectedInitialState, action);

    expect(state.bun).toBeDefined();
    expect(state.bun?.name).toBe('Тестовая булка');
    expect(state.bun?.id).toBeDefined();
  });

  it('должен добавлять начинку (addIngredient)', () => {
    const action = constructorSlice.actions.addIngredient(mockFilling);
    const state = constructorSlice.reducer(expectedInitialState, action);

    expect(state.ingredients.length).toBe(1);
    expect(state.ingredients[0].name).toBe('Тестовая начинка');
    expect(state.ingredients[0].id).toBeDefined();
  });

  it('должен удалять ингредиент (removeIngredient)', () => {
    const ingredientToKeep = { ...mockFilling, id: 'id1', name: 'Оставить' };
    const ingredientToRemove = { ...mockFilling, id: 'id2', name: 'Удалить' };

    const stateWithTwoIngredients = {
      bun: null,
      ingredients: [ingredientToKeep, ingredientToRemove],
    };

    const removeAction = constructorSlice.actions.removeIngredient(
      ingredientToRemove.id
    );
    const state = constructorSlice.reducer(stateWithTwoIngredients, removeAction);

    expect(state.ingredients.length).toBe(1);

    expect(state.ingredients[0].id).toBe('id1');
    expect(state.ingredients[0].name).toBe('Оставить');

    const removedItem = state.ingredients.find((item) => item.id === 'id2');
    expect(removedItem).toBeUndefined();
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

    expect(stateUp.ingredients.length).toBe(2);
    expect(stateUp.ingredients).toEqual([
      { ...mockFilling, id: 'id2', name: 'Второй' },
      { ...mockFilling, id: 'id1', name: 'Первый' },
    ]);

    const downAction = constructorSlice.actions.moveIngredientDown(0);
    const stateDown = constructorSlice.reducer(stateWithTwoIngredients, downAction);

    expect(stateDown.ingredients.length).toBe(2);
    expect(stateDown.ingredients).toEqual([
      { ...mockFilling, id: 'id2', name: 'Второй' },
      { ...mockFilling, id: 'id1', name: 'Первый' },
    ]);
  });

  it('должен очищать конструктор (clearConstructor)', () => {
    const stateWithIngredients = {
      bun: { ...mockIngredient, id: '1' },
      ingredients: [{ ...mockFilling, id: '2' }],
    };
    const action = constructorSlice.actions.clearConstructor();
    const state = constructorSlice.reducer(stateWithIngredients, action);

    expect(state).toEqual(expectedInitialState);
  });
});
