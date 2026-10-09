import { AppHeaderUI } from '@ui';

import { useSelector } from '../../services/store';
import { selectUser } from '@/services/selectors';

export const AppHeader = (): React.JSX.Element => {
  const user = useSelector(selectUser);

  return <AppHeaderUI userName={user?.name} />;
};
