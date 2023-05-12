import { Document, Schema, Model, model } from 'mongoose';

export interface UserInterface extends Document {
  firstName: string;
  lastName: string;
  password: string;
  email: string;
  country: string;
  city: string;
  postalCode: string;
  about: string;
  friends: Schema.Types.ObjectId[];
  friendRequests: Schema.Types.ObjectId[];
  birthday: Date;
  profilePicture: string;
  googleId?: string;
  socketId?: string | null;
}

const userSchema: Schema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  password: { type: String, required: false },
  email: { type: String, required: true },
  country: { type: String, required: true },
  city: { type: String, required: true },
  postalCode: { type: String, required: true },
  about: { type: String, required: true },
  friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  friendRequests: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  birthday: { type: Date, required: false },
  profilePicture: {
    type: String,
    default: '/photos/profilePictures/default.png',
  },
  googleId: { type: String, requried: false },
  socketId: { type: String, required: false, default: null },
});

const User: Model<UserInterface> = model<UserInterface>('User', userSchema);

export default User;
