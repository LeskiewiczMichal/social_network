import { Message } from '../models';

const deleteAllMessages = async () => {
  try {
    await Message.deleteMany({});
  } catch (error) {
    console.error(error);
  }
};

export default deleteAllMessages;
