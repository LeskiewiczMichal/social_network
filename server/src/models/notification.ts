import { Document, Schema, Model, model } from 'mongoose';

export enum NotificationTypes {
  FRIEND_REQUEST = 'friendRequest',
  NEW_FRIEND = 'newFriend',
  POST_LIKED = 'postLiked',
}

export interface NotificationInterface extends Document {
  sender: Schema.Types.ObjectId;
  receiver: Schema.Types.ObjectId;
  createdAt: Date;
  type: NotificationTypes;
}

const notificationSchema: Schema = new Schema(
  {
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
      type: String,
      enum: Object.values(NotificationTypes),
      required: true,
    },
  },
  { timestamps: true },
);

const Notification: Model<NotificationInterface> = model<NotificationInterface>(
  'Notification',
  notificationSchema,
);

export default Notification;
