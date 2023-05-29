import { dataToUserObject } from '../../users';
import { NotificationInterface, NotificationType } from '../types/notification';

interface DataToNotificationObjectProps extends NotificationInterface {
  _id: string;
  sender: any;
}

const dataToNotificationObject = (
  props: DataToNotificationObjectProps,
): NotificationInterface => {
  const { _id: id, sender, createdAt, receiver, type } = props;

  const senderObject = dataToUserObject({ ...sender });
  const newType: NotificationType = type;

  const notification: NotificationInterface = {
    id,
    sender: senderObject,
    receiver,
    createdAt,
    type: newType,
  };

  return notification;
};

export default dataToNotificationObject;
