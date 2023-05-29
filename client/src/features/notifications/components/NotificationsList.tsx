import { useState, useEffect } from 'react';

import Notification from './Notification';
import { LoadingSpinner } from '../../../components';
import { NotificationInterface } from '../types/notification';
import getNotifications from '../services/getNotifications';

export default function NotificationsList() {
  const [notifications, setNotifications] = useState<NotificationInterface[]>(
    [],
  );
  const [offset, setOffset] = useState<number>(10);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [noMoreNotificationsTextActive, setNoMoreNotificationsTextActive] =
    useState<boolean>(false);

  useEffect(() => {
    // Get posts from the server
    const handleGetNotifications = async () => {
      try {
        setNoMoreNotificationsTextActive(false);
        const limit = 20;
        setIsLoading(true);
        const queriedNotifications = await getNotifications({
          offset: 0,
          limit,
        });
        setNotifications(queriedNotifications);
        setIsLoading(false);
      } catch (err: any) {
        console.error(err);
      }
    };

    handleGetNotifications();
  }, []);

  // When scrolled to the bottom, query more posts
  const handleScroll = async () => {
    try {
      if (
        window.innerHeight + document.documentElement.scrollTop ===
        document.documentElement.offsetHeight
      ) {
        const limit = 10;
        const queriedNotifications = await getNotifications({
          offset,
          limit,
        });
        setOffset((oldOffset) => oldOffset + limit);
        setNotifications((oldNotifications) => {
          return [...oldNotifications, ...queriedNotifications];
        });
        // If no posts added, show text
        if (queriedNotifications.length === 0) {
          setNoMoreNotificationsTextActive(true);
        }
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  // Attach scroll event
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [offset]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <section className="bg-slate-50 min-h-screen flex md:col-span-2 flex-col items-center">
      {notifications.map((notification: NotificationInterface) => {
        return (
          <Notification
            key={notification.id}
            sender={notification.sender}
            receiver={notification.receiver}
            id={notification.id}
            createdAt={notification.createdAt}
            type={notification.type}
          />
        );
      })}
      {noMoreNotificationsTextActive && (
        <p className="mb-4">No more notifications to show</p>
      )}
    </section>
  );
}
