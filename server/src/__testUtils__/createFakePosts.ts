import mongoose from 'mongoose';
import { PostInterface, Post } from '../models';

type CreateFakePostsProps = {
  postOne: any;
  postTwo: any;
  postThree: any;
  postIds: {
    one: mongoose.Types.ObjectId;
    two: mongoose.Types.ObjectId;
    three: mongoose.Types.ObjectId;
  };
  authorId: mongoose.Types.ObjectId;
};

const createFakeUsers = async (props: CreateFakePostsProps) => {
  const defaultPostOne: PostInterface = {
    _id: props.postIds.one,
    title: 'Testing',
    body: 'Testing post number one',
    author: props.authorId,
    comments: [],
    likes: [],
    ...props.postOne,
  };

  const defaultPostTwo: PostInterface = {
    _id: props.postIds.two,
    title: 'TesterPost',
    body: 'Testing post number two',
    author: props.authorId,
    comments: [],
    likes: [],
    ...props.postTwo,
  };

  const defaultPostThree: PostInterface = {
    _id: props.postIds.three,
    title: 'TesterPost',
    body: 'Testing post number three',
    author: props.authorId,
    comments: [],
    likes: [],
    ...props.postThree,
  };

  const postOne: PostInterface = new Post(defaultPostOne);
  const postTwo: PostInterface = new Post(defaultPostTwo);
  const postThree: PostInterface = new Post(defaultPostThree);

  await postOne.save();
  await postTwo.save();
  await postThree.save();

  const expectedPostOne = {
    ...defaultPostOne,
    _id: props.postIds.one.toString(),
    author: postOne.author.toString(),
  };

  const expectedPostTwo = {
    ...defaultPostTwo,
    _id: props.postIds.two.toString(),
    author: postTwo.author.toString(),
  };

  const expectedPostThree = {
    ...defaultPostThree,
    _id: props.postIds.three.toString(),
    author: postThree.author.toString(),
  };

  return {
    one: expectedPostOne,
    two: expectedPostTwo,
    three: expectedPostThree,
  };
};

export default createFakeUsers;
