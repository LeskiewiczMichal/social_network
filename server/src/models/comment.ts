import { Document, Schema, Model, model } from 'mongoose';

export interface CommentInterface extends Document {
  body: string;
  author: Schema.Types.ObjectId;
  likes: Schema.Types.ObjectId[];
  post: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema: Schema = new Schema(
  {
    body: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User' },
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    post: { type: Schema.Types.ObjectId, ref: 'Post' }
  },
  { timestamps: true },
);

const Comment: Model<CommentInterface> = model<CommentInterface>(
  'Comment',
  commentSchema,
);

export default Comment;
