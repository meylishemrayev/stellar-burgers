import { BurgerConstructorUI } from '@ui';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { clearConstructor } from '../../services/slices/constructor-slice';
import {
  orderBurger,
  closeOrderModal as closeOrderModalAction,
} from '../../services/slices/order-slice';
import { useDispatch, useSelector } from '../../services/store';

import type { TConstructorIngredient } from '@utils-types';
import {
  selectBurgerConstructor,
  selectOrderModalData,
  selectOrderRequest,
  selectUser,
} from '@/services/selectors';

export const BurgerConstructor = (): React.JSX.Element | null => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const constructorItems = useSelector(selectBurgerConstructor);
  const orderRequest = useSelector(selectOrderRequest);
  const orderModalData = useSelector(selectOrderModalData);
  const user = useSelector(selectUser);

  const onOrderClick = (): void => {
    if (!constructorItems.bun || orderRequest) return;

    if (!user) {
      void navigate('/login');
      return;
    }

    const ids = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((item) => item._id),
      constructorItems.bun._id,
    ];

    void dispatch(orderBurger(ids))
      .unwrap()
      .then(() => {
        dispatch(clearConstructor());
      })
      .catch(console.error);
  };

  const closeOrderModal = (): void => {
    dispatch(closeOrderModalAction());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
