import { Document, Schema, Model, model } from 'mongoose';

export interface PostInterface extends Document {
  title: string;
  body: string;
  author: Schema.Types.ObjectId;
  comments: Schema.Types.ObjectId[];
  likes: Schema.Types.ObjectId[];
  photo: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const postSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    photo: { type: String, default: null },
  },
  { timestamps: true },
);

const Post: Model<PostInterface> = model<PostInterface>('Post', postSchema);

export default Post;
