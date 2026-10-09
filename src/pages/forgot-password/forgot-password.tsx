import { ForgotPasswordUI } from '@ui-pages';
import { type SyntheticEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { clearError, forgotPassword } from '../../services/slices/user-slice';
import { useDispatch, useSelector } from '../../services/store';
import { selectUserError } from '@/services/selectors';

export const ForgotPassword = (): React.JSX.Element => {
  const [email, setEmail] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const error = useSelector(selectUserError);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();
    void dispatch(forgotPassword({ email })).then((res) => {
      if (res.meta.requestStatus === 'fulfilled') {
        localStorage.setItem('resetPassword', 'true');
        void navigate('/reset-password', { replace: true });
      }
    });
  };

  return (
    <ForgotPasswordUI
      errorText={error ?? ''}
      email={email}
      setEmail={setEmail}
      handleSubmit={handleSubmit}
    />
  );
};
