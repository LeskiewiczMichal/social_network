import { useState, useEffect } from 'react';

import { NotificationInterface, NotificationType } from '../types/notification';
import getNotifications from '../services/getNotifications';
import NotificationsOneTypeList from './NotificationsOneTypeList';

export default function NotificationsList() {
  const [otherNotifications, setOtherNotifications] = useState<
    NotificationInterface[]
  >([]);
  const [offsetFriendRequests, setOffsetFriendRequests] = useState<number>(0);
  const [offsetOthers, setOffsetOthers] = useState<number>(0);
  const [friendRequestLoading, setFriendRequestLoading] =
    useState<boolean>(true);
  const [notificationsLoading, setNotificationsLoading] =
    useState<boolean>(true);
  const [noMoreRequestsTextActive, setNoMoreRequestsTextActive] =
    useState<boolean>(false);
  const [noMoreNotificationsTextActive, setNoMoreNotificationsTextActive] =
    useState<boolean>(false);
  const [friendRequests, setFriendRequests] = useState<NotificationInterface[]>(
    [],
  );

  const handleGetFriendRequests = async (limit: number, initial: boolean) => {
    try {
      setNoMoreRequestsTextActive(false);
      setFriendRequestLoading(true);
      const queriedRequestsNotifications = await getNotifications({
        type: NotificationType.FRIEND_REQUEST,
        offset: offsetFriendRequests,
        limit,
      });
      if (queriedRequestsNotifications.length === 0) {
        setNoMoreRequestsTextActive(true);
      }
      if (initial) {
        setFriendRequests(queriedRequestsNotifications);
        setOffsetFriendRequests(limit);
      } else {
        setOffsetFriendRequests((oldOffset: number) => oldOffset + limit);
        // Exclude notifications witch already are added (needed when created new notificationn)
        setFriendRequests((oldState) => {
          const oldFriendRequests = oldState.map(
            (notification) => notification.id,
          );
          const uniqueQueriedNotifications =
            queriedRequestsNotifications.filter(
              (notification) => !oldFriendRequests.includes(notification.id),
            );
          return [...oldState, ...uniqueQueriedNotifications];
        });
      }
      setFriendRequestLoading(false);
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleGetNotifications = async (limit: number, initial: boolean) => {
    try {
      setNoMoreNotificationsTextActive(false);
      setNotificationsLoading(true);
      const queriedOtherNotifications = await getNotifications({
        excludeType: NotificationType.FRIEND_REQUEST,
        offset: offsetOthers,
        limit,
      });
      if (queriedOtherNotifications.length === 0) {
        setNoMoreNotificationsTextActive(true);
      }
      if (initial) {
        setOtherNotifications(queriedOtherNotifications);
        setOffsetOthers(limit);
      } else {
        setOffsetOthers((oldOffset: number) => oldOffset + limit);
        // Exclude notifications witch already are added (needed when created new notificationn)
        setOtherNotifications((oldState) => {
          const oldNotifications = oldState.map(
            (notification) => notification.id,
          );
          const uniqueQueriedNotifications = queriedOtherNotifications.filter(
            (notification) => !oldNotifications.includes(notification.id),
          );
          return [...oldState, ...uniqueQueriedNotifications];
        });
      }
      setNotificationsLoading(false);
    } catch (err: any) {
      console.error(err);
    }
  };

  useEffect(() => {
    handleGetFriendRequests(5, true);
    handleGetNotifications(5, true);
  }, []);

  return (
    <section className="flex flex-col md:flex-row justify-around w-full ">
      <NotificationsOneTypeList
        notificationsToShow={friendRequests}
        noMoreRequestsTextActive={noMoreRequestsTextActive}
        getMoreNotifications={handleGetFriendRequests}
        isLoading={friendRequestLoading}
        header="Friends Requests"
      />
      <NotificationsOneTypeList
        notificationsToShow={otherNotifications}
        noMoreRequestsTextActive={noMoreNotificationsTextActive}
        getMoreNotifications={handleGetNotifications}
        isLoading={notificationsLoading}
        header="Other Notifications"
      />
    </section>
  );
}
