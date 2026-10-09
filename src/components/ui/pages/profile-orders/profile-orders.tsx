import { ProfileMenu, OrdersList } from '@components';
import { Preloader } from '@ui';

import type { ProfileOrdersUIProps } from './type';

import styles from './profile-orders.module.css';

export const ProfileOrdersUI = ({
  orders,
  isLoading,
}: ProfileOrdersUIProps): React.JSX.Element => (
  <main className={`${styles.main}`}>
    <div className={`mt-30 mr-15 ${styles.menu}`}>
      <ProfileMenu />
    </div>
    <div className={`mt-10 ${styles.orders}`}>
      {isLoading ? (
        <Preloader />
      ) : orders.length === 0 ? (
        <p className="text text_type_main-default text_color_inactive">
          У вас пока нет заказов
        </p>
      ) : (
        <OrdersList orders={orders} />
      )}
    </div>
  </main>
);
