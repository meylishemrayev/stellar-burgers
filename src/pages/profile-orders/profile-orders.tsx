import { ProfileOrdersUI } from '@ui-pages';
import { useEffect } from 'react';

import { getUserOrders } from '../../services/slices/user-orders-slice';
import { useDispatch, useSelector } from '../../services/store';
import { selectUserOrders, selectUserOrdersLoading } from '@/services/selectors';

export const ProfileOrders = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const orders = useSelector(selectUserOrders);
  const isLoading = useSelector(selectUserOrdersLoading);
  useEffect(() => {
    void dispatch(getUserOrders());
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} isLoading={isLoading} />;
};
