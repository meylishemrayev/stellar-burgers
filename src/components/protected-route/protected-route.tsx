import { Navigate, useLocation } from 'react-router-dom';

import { useSelector } from '../../services/store';

import type { TLocationState } from '@/utils/types';
import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { selectIsAuthChecked, selectUser } from '@/services/selectors';

type TProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.JSX.Element;
};

export const ProtectedRoute = ({
  onlyUnAuth = false,
  children,
}: TProtectedRouteProps): React.JSX.Element => {
  const user = useSelector(selectUser);
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const location = useLocation();
  const state = location.state as TLocationState | null;

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (onlyUnAuth && user) {
    const from = state?.from?.pathname ?? '/';
    return <Navigate to={from} replace />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};
