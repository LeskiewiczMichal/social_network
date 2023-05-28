import { Message, MessageInterface, UserInterface } from '../models';
import { ErrorTypes, MessageTypes } from '../types';
import { handleError } from '../utils';

const getMessages = async (
  req: MessageTypes.GetMessagesRequest,
  res: MessageTypes.GetMessagesResponse,
): Promise<MessageTypes.GetMessagesResponse> => {
  try {
    const { id: userId } = req.user as UserInterface;
    const { friendId, limit, offset, sortOrder } = req.query;

    if (!userId || !friendId) {
      throw new ErrorTypes.BadRequestError('No user id or friend id provided');
    }

    const dbQuery = Message.find()
      .or([
        { sender: userId, receiver: friendId },
        { sender: friendId, receiver: userId },
      ])
      .sort({ createdAt: 1 });

    if (limit) {
      dbQuery.limit(parseInt(limit as string, 10));
    }
    if (offset) {
      dbQuery.skip(parseInt(offset as string, 10));
    }
    if (sortOrder) {
      dbQuery.sort({ createdAt: sortOrder === 'asc' ? 1 : -1 });
    }

    const messages: MessageInterface[] =
      (await dbQuery.exec()) as MessageInterface[];

    return res.json({ messages });
  } catch (err: any) {
    return handleError(err, res);
  }
};

// eslint-disable-next-line import/prefer-default-export
export { getMessages };
