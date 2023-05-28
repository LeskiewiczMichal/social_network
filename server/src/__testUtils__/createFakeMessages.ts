import mongoose from 'mongoose';
import { Message, MessageInterface } from '../models';

type CreateFakeMessagesPros = {
  messageOne: any;
  messageTwo: any;
  messageThree: any;
  messageIds: {
    one: mongoose.Types.ObjectId;
    two: mongoose.Types.ObjectId;
    three: mongoose.Types.ObjectId;
  };
  senderId: mongoose.Types.ObjectId;
  receiverId: mongoose.Types.ObjectId;
  userThreeId: mongoose.Types.ObjectId;
};

const createFakeMessages = async (props: CreateFakeMessagesPros) => {
  const {
    messageOne: MessageOneProps,
    messageTwo: MessageTwoProps,
    messageThree: MessageThreeProps,
    messageIds,
    senderId,
    receiverId,
    userThreeId,
  } = props;

  const defaultMessageOne: MessageInterface = {
    _id: messageIds.one,
    body: 'Testing message number one',
    sender: senderId,
    receiver: receiverId,
    ...MessageOneProps,
  };

  const defaultMessageTwo: MessageInterface = {
    _id: messageIds.two,
    body: 'Testing message number two',
    sender: senderId,
    receiver: receiverId,
    ...MessageTwoProps,
  };

  const defaultMessageThree: MessageInterface = {
    _id: messageIds.three,
    body: 'Testing message number three',
    sender: userThreeId,
    receiver: userThreeId,
    ...MessageThreeProps,
  };

  const messageOne: MessageInterface = new Message(defaultMessageOne);
  const messageTwo: MessageInterface = new Message(defaultMessageTwo);
  const messageThree: MessageInterface = new Message(defaultMessageThree);

  await messageOne.save();
  await messageTwo.save();
  await messageThree.save();

  return {
    one: {
      ...defaultMessageOne,
      _id: messageIds.one.toString(),
      sender: senderId.toString(),
      receiver: receiverId.toString(),
    },
    two: {
      ...defaultMessageTwo,
      _id: messageIds.two.toString(),
      sender: senderId.toString(),
      receiver: receiverId.toString(),
    },
    three: {
      ...defaultMessageThree,
      _id: messageIds.three.toString(),
      sender: userThreeId.toString(),
      receiver: userThreeId.toString(),
    },
  };
};

export default createFakeMessages;
