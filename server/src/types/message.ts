import { Request, Response } from 'express';
import { MessageInterface } from '../models';

interface GetMessagesRequest extends Request {
  query: {
    friendId: string;
    limit?: string;
    offset?: string;
    sortOrder?: string;
  };
}

type GetMessagesResponse = Response<{ messages: MessageInterface[] }>;

export { GetMessagesRequest, GetMessagesResponse };
