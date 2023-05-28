import { MessageInterface } from '../types/message';

interface DataToMessageObjectProps extends MessageInterface {
  _id: string;
}

const dataToMessageObject = (
  props: DataToMessageObjectProps,
): MessageInterface => {
  const { _id: id, body, sender, createdAt, receiver } = props;

  const message: MessageInterface = {
    id,
    body,
    sender,
    receiver,
    createdAt,
  };

  return message;
};

export default dataToMessageObject;
