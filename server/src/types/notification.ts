import { Request, Response } from 'express';
import { NotificationInterface, NotificationTypes } from '../models';

interface GetNotificationsRequest extends Request {
  query: {
    type?: NotificationTypes;
    excludeType?: NotificationTypes;
    limit?: string;
    offset?: string;
    sortOrder?: string;
  };
}

type GetNotificationsResponse = Response<{
  notifications: NotificationInterface[];
}>;

export { GetNotificationsRequest, GetNotificationsResponse };
