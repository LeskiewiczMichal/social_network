import { Document, Schema, Model, model } from 'mongoose';

export interface UserInterface extends Document {
  firstName: string;
  lastName: string;
  password: string;
  email: string;
  friends: Schema.Types.ObjectId[];
  posts: Schema.Types.ObjectId[];
  friendRequests: Schema.Types.ObjectId[];
  birthday: Date;
}

const userSchema: Schema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
  friendRequests: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  birthday: { type: Date, required: true },
});

const User: Model<UserInterface> = model<UserInterface>('User', userSchema);

export default User;
