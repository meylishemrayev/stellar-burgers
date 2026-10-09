import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { useEffect } from 'react';

import { getFeeds } from '../../services/slices/feed-slice';
import { useDispatch, useSelector } from '../../services/store';
import {
  selectFeedHasLoaded,
  selectFeedLoading,
  selectFeedOrders,
} from '@/services/selectors';

export const Feed = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const orders = useSelector(selectFeedOrders);
  const isLoading = useSelector(selectFeedLoading);
  const hasLoaded = useSelector(selectFeedHasLoaded);

  useEffect(() => {
    void dispatch(getFeeds());
  }, [dispatch]);

  const handleGetFeeds = (): void => {
    void dispatch(getFeeds());
  };

  if (!hasLoaded && isLoading) {
    return <Preloader />;
  }

  if (hasLoaded && orders.length === 0) {
    return <FeedUI orders={[]} handleGetFeeds={handleGetFeeds} />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
