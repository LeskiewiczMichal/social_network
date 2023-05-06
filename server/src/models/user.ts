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
  googleId: string;
}

const userSchema: Schema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  password: { type: String, required: false },
  email: { type: String, required: true },
  friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
  friendRequests: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  birthday: { type: Date, required: false },
  googleId: { type: String, requried: false },
});

const User: Model<UserInterface> = model<UserInterface>('User', userSchema);

export default User;
