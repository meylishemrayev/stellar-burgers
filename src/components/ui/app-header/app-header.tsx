import {
  BurgerIcon,
  ListIcon,
  ProfileIcon,
  Logo,
} from '@krgaa/react-developer-burger-ui-components';

import type { TAppHeaderUIProps } from './type';

import styles from './app-header.module.css';
import { Link, NavLink } from 'react-router-dom';

export const AppHeaderUI = ({ userName }: TAppHeaderUIProps): React.JSX.Element => (
  <header className={styles.header}>
    <nav className={`${styles.menu} p-4`}>
      <div className={styles.menu_part_left}>
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `${styles.link} ${isActive ? styles.link_active : undefined}`
          }
        >
          <BurgerIcon type={'primary'} />
          <p className="text text_type_main-default ml-2 mr-10">Конструктор</p>
        </NavLink>
        <NavLink
          to="/feed"
          className={({ isActive }) =>
            `${styles.link} ${isActive ? styles.link_active : undefined}`
          }
        >
          <ListIcon type={'primary'} />
          <p className="text text_type_main-default ml-2">Лента заказов</p>
        </NavLink>
      </div>
      <div className={styles.logo}>
        <Link to="/">
          <Logo className="" />
        </Link>
      </div>
      <div className={styles.link_position_last}>
        <ProfileIcon type={'primary'} />
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `${styles.link} ${
              isActive ? `${styles.link_active}` : styles.link_position_last
            }`
          }
        >
          <p className="text text_type_main-default ml-2">
            {userName ?? 'Личный кабинет'}
          </p>
        </NavLink>
      </div>
    </nav>
  </header>
);
