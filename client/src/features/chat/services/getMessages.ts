import axios from 'axios';

import { getToken } from '../../../utils';
import { DbQueries } from '../../../types';
import dataToMessageObject from '../utils/dataToMessageObject';
import { MessageInterface } from '../types/message';

interface GetMessagesProps {
  friendId: string;
  sortOrder?: DbQueries.SortOrder;
  limit?: number;
  offset?: number;
}

const getMessages = async (
  props: GetMessagesProps,
): Promise<MessageInterface[]> => {
  try {
    const {
      friendId,
      sortOrder = DbQueries.SortOrder.DESCENDING,
      limit = 10,
      offset = 0,
    } = props;

    axios.defaults.headers.common.Authorization = getToken();

    const apiUrl = `/api/messages/`;

    const request = await axios.get(apiUrl, {
      params: { friendId, sortOrder, limit, offset },
    });

    const { messages: messagesData } = request.data;
    const messageObjects: MessageInterface[] = messagesData.map(
      (message: any) => {
        return dataToMessageObject(message);
      },
    );

    return messageObjects;
  } catch (err: any) {
    console.error(err);
    return [];
  }
};

export default getMessages;
