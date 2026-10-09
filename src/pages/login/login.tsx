import { LoginUI } from '@ui-pages';
import { type SyntheticEvent, useEffect, useState } from 'react';

import { loginUser, clearError } from '../../services/slices/user-slice';
import { useDispatch, useSelector } from '../../services/store';
import { selectUserError } from '@/services/selectors';

export const Login = (): React.JSX.Element => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const error = useSelector(selectUserError);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();
    void dispatch(loginUser({ email, password }));
  };

  return (
    <LoginUI
      errorText={error ?? ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
