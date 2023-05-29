import { Request, Response } from 'express';
import { NotificationInterface } from '../models';

interface GetNotificationsRequest extends Request {}

type GetNotificationsResponse = Response<{
  notifications: NotificationInterface[];
}>;

export { GetNotificationsRequest, GetNotificationsResponse };
