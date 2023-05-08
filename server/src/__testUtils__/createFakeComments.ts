import mongoose from 'mongoose';
import { CommentInterface, Post, Comment, PostInterface } from '../models';

type CreateFakeCommentsProps = {
  commentOne: any;
  commentTwo: any;
  commentThree: any;
  commentIds: {
    one: mongoose.Types.ObjectId;
    two: mongoose.Types.ObjectId;
    three: mongoose.Types.ObjectId;
  };
  postId: mongoose.Types.ObjectId;
  authorId: mongoose.Types.ObjectId;
};

const createFakeComments = async (props: CreateFakeCommentsProps) => {
  const defaultCommentOne: CommentInterface = {
    _id: props.commentIds.one,
    body: 'Testing comment number one',
    author: props.authorId,
    post: props.postId,
    likes: [],
    ...props.commentOne,
  };

  const defaultCommentTwo: CommentInterface = {
    _id: props.commentIds.two,
    body: 'Testing comment number two',
    author: props.authorId,
    post: props.postId,
    likes: [],
    ...props.commentTwo,
  };

  const defaultCommentThree: CommentInterface = {
    _id: props.commentIds.three,
    body: 'Testing comment number three',
    author: props.authorId,
    post: props.postId,
    likes: [],
    ...props.commentThree,
  };

  const commentOne: CommentInterface = new Comment(defaultCommentOne);
  const commentTwo: CommentInterface = new Comment(defaultCommentTwo);
  const commentThree: CommentInterface = new Comment(defaultCommentThree);

  await commentOne.save();
  await commentTwo.save();
  await commentThree.save();

  const newPost: PostInterface = new Post({
    _id: props.postId,
    body: 'Testing comments post',
    title: 'Testing',
    author: props.authorId,
    likes: [],
    comments: [
      props.commentIds.one,
      props.commentIds.two,
      props.commentIds.three,
    ],
  });

  await newPost.save();

  return {
    one: {
      ...defaultCommentOne,
      _id: props.commentIds.one.toString(),
      author: commentOne.author.toString(),
      post: commentOne.post.toString(),
    },
    two: {
      ...defaultCommentTwo,
      _id: props.commentIds.two.toString(),
      author: commentTwo.author.toString(),
      post: commentTwo.post.toString(),
    },
    three: {
      ...defaultCommentThree,
      _id: props.commentIds.three.toString(),
      author: commentThree.author.toString(),
      post: commentThree.post.toString(),
    },
    post: {
      _id: props.postId,
      body: 'Testing comments post',
      title: 'Testing',
      author: props.authorId,
      post: props.postId,
      likes: [],
      comment: [
        props.commentIds.one,
        props.commentIds.two,
        props.commentIds.three,
      ],
    },
  };
};

export default createFakeComments;
