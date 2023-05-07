import mongoose from 'mongoose';
import * as jwt from 'jsonwebtoken';
import { UserInterface, User } from '../models';

/// NOTE: Can't change user's birthday ///

type CreateFakeUsersProps = {
  userOne: any;
  userTwo: any;
  userThree: any;
  ids: {
    one: mongoose.Types.ObjectId;
    two: mongoose.Types.ObjectId;
    three: mongoose.Types.ObjectId;
  };
};

const createFakeUsers = async (props: CreateFakeUsersProps) => {
  const defaultUserOne: Partial<UserInterface> = {
    _id: props.ids.one,
    firstName: 'John',
    lastName: 'Doe',
    password: 'password123',
    email: 'john.doe@example.com',
    friends: [],
    friendRequests: [],
    birthday: new Date('1990-01-01'),
    ...props.userOne,
  };

  const defaultUserTwo: Partial<UserInterface> = {
    _id: props.ids.two,
    firstName: 'Jane',
    lastName: 'Doe',
    password: 'password456',
    email: 'jane.doe@example.com',
    friends: [],
    friendRequests: [],
    birthday: new Date('1995-05-04'),
    googleId: '5234553455',
    ...props.userTwo,
  };

  const defaultUserThree: Partial<UserInterface> = {
    _id: props.ids.three,
    firstName: 'Marry',
    lastName: 'Christmas',
    password: 'password90',
    email: 'marry.christmas@example.com',
    friends: [],
    friendRequests: [],
    birthday: new Date('2000-03-09'),
    ...props.userThree,
  };

  const userOne: UserInterface = new User(defaultUserOne);
  const userTwo: UserInterface = new User(defaultUserTwo);
  const userThree: UserInterface = new User(defaultUserThree);

  const userOneToken = jwt.sign({ id: props.ids.one }, process.env.SECRET!, {
    expiresIn: '1h',
  });
  const userTwoToken = jwt.sign({ id: props.ids.two }, process.env.SECRET!, {
    expiresIn: '1h',
  });

  const userThreeToken = jwt.sign(
    { id: props.ids.three },
    process.env.SECRET!,
    {
      expiresIn: '1h',
    },
  );

  await userOne.save();
  await userTwo.save();
  await userThree.save();

  const expectedUserOne = {
    ...defaultUserOne,
    _id: props.ids.one.toString(),
    birthday: '1990-01-01T00:00:00.000Z',
  };

  const expectedUserTwo = {
    ...defaultUserTwo,
    _id: props.ids.two.toString(),
    birthday: '1995-05-04T00:00:00.000Z',
  };

  const expectedUserThree = {
    ...defaultUserThree,
    _id: props.ids.three.toString(),
    birthday: '2000-03-09T00:00:00.000Z',
  };

  return {
    one: expectedUserOne,
    two: expectedUserTwo,
    three: expectedUserThree,
    tokens: { one: userOneToken, two: userTwoToken, three: userThreeToken },
  };
};

export default createFakeUsers;
