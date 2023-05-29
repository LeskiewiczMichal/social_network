import { Notification, NotificationInterface, UserInterface } from '../models';
import { NotificationTypes } from '../types';
import { handleError } from '../utils';

const getNotifications = async (
  req: NotificationTypes.GetNotificationsRequest,
  res: NotificationTypes.GetNotificationsResponse,
): Promise<NotificationTypes.GetNotificationsResponse> => {
  try {
    const { id: userId } = req.user as UserInterface;
    const { limit, offset, sortOrder } = req.query;

    const dbQuery = Notification.find()
      .where({ receiver: userId })
      .sort({ createdAt: 1 })
      .populate('sender');

    if (limit) {
      dbQuery.limit(parseInt(limit as string, 10));
    }
    if (offset) {
      dbQuery.skip(parseInt(offset as string, 10));
    }
    if (sortOrder) {
      dbQuery.sort({ createdAt: sortOrder === 'asc' ? 1 : -1 });
    }

    const notifications: NotificationInterface[] =
      (await dbQuery.exec()) as NotificationInterface[];

    return res.json({ notifications });
  } catch (err: any) {
    return handleError(err, res);
  }
};

// eslint-disable-next-line import/prefer-default-export
export { getNotifications };
