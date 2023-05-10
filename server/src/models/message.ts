import { Document, Schema, Model, model } from 'mongoose';

export interface MessageInterface extends Document {
  body: string;
  sender: Schema.Types.ObjectId;
  receiver: Schema.Types.ObjectId;
  createdAt: Date;
}

const messageSchema: Schema = new Schema(
  {
    body: { type: String, required: true },
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true },
);

const Message: Model<MessageInterface> = model<MessageInterface>(
  'Message',
  messageSchema,
);

export default Message;
