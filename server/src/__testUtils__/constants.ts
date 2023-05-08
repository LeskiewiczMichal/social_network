import mongoose from 'mongoose';

const USER_IDS = {
  one: new mongoose.Types.ObjectId(),
  two: new mongoose.Types.ObjectId(),
  three: new mongoose.Types.ObjectId(),
};

const POST_IDS = {
  one: new mongoose.Types.ObjectId(),
  two: new mongoose.Types.ObjectId(),
  three: new mongoose.Types.ObjectId(),
};

const COMMENT_IDS = {
  one: new mongoose.Types.ObjectId(),
  two: new mongoose.Types.ObjectId(),
  three: new mongoose.Types.ObjectId(),
};

const DEFAULT_USERS_PROPS = {
  userOne: {},
  userTwo: {},
  userThree: {},
  ids: USER_IDS,
};

const DEFAULT_POSTS_PROPS = {
  postOne: {},
  postTwo: {},
  postThree: {},
  postIds: POST_IDS,
  authorId: USER_IDS.one,
};

export {
  USER_IDS,
  POST_IDS,
  DEFAULT_USERS_PROPS,
  DEFAULT_POSTS_PROPS,
  COMMENT_IDS,
};
