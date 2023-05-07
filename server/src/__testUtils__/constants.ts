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

const DEFAULT_USERS_PROPS = {
  userOne: {},
  userTwo: {},
  userThree: {},
  ids: USER_IDS,
};

export { USER_IDS, POST_IDS, DEFAULT_USERS_PROPS };
