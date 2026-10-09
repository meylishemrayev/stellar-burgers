import { Preloader, OrderInfoUI } from '@ui';
import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { getOrderByNumber } from '../../services/slices/order-slice';
import { useDispatch, useSelector } from '../../services/store';

import type { TIngredient } from '@utils-types';
import {
  selectCurrentOrder,
  selectFeedOrders,
  selectIngredients,
  selectUserOrders,
} from '@/services/selectors';

export const OrderInfo = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const { number } = useParams();

  const orderNumber = Number(number);

  const currentOrder = useSelector(selectCurrentOrder);
  const feedOrders = useSelector(selectFeedOrders);
  const userOrders = useSelector(selectUserOrders);
  const ingredients = useSelector(selectIngredients);

  const orderData =
    feedOrders.find((o) => o.number === orderNumber) ??
    userOrders.find((o) => o.number === orderNumber) ??
    (currentOrder?.number === orderNumber ? currentOrder : null);

  useEffect(() => {
    if (!number || orderData) return;
    void dispatch(getOrderByNumber(orderNumber));
  }, [dispatch, number, orderNumber, orderData]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = Record<string, TIngredient & { count: number }>;

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = { ...ingredient, count: 1 };
          }
        } else {
          acc[item].count++;
        }
        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return { ...orderData, ingredientsInfo, date, total };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
