import axios from 'axios';

import { getToken } from '../../../utils';
import { DbQueries } from '../../../types';

import { NotificationInterface, NotificationType } from '../types/notification';
import dataToNotificationObject from '../utils/dataToNotificationObject';

interface GetNotificationsProps {
  type?: NotificationType;
  excludeType?: NotificationType;
  sortOrder?: DbQueries.SortOrder;
  limit?: number;
  offset?: number;
}

const getNotifications = async (
  props: GetNotificationsProps,
): Promise<NotificationInterface[]> => {
  try {
    const {
      sortOrder = DbQueries.SortOrder.DESCENDING,
      limit = 10,
      offset = 0,
      type,
      excludeType,
    } = props;

    axios.defaults.headers.common.Authorization = getToken();
    const apiUrl = `${process.env.REACT_APP_SERVER_URL}/api/notifications/`;

    const request = await axios.get(apiUrl, {
      params: { sortOrder, limit, offset, type, excludeType },
    });

    const { notifications: notificationsData } = request.data;
    const notificationObjects: NotificationInterface[] = notificationsData.map(
      (notification: any) => {
        return dataToNotificationObject(notification);
      },
    );

    return notificationObjects;
  } catch (err: any) {
    console.error(err);
    return [];
  }
};

export default getNotifications;
