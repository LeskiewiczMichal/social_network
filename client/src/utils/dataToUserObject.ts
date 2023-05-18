import { UserTypes } from '../types';

type DataToUserObjectProps = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  friends: string[];
  friendRequests: string[];
  birthday: string;
  country: string;
  city: string;
  postalCode: string;
  about: string;
  profilePicture: string;
  googleId?: string;
};

const dataToUserObject = (props: DataToUserObjectProps): UserTypes.User => {
  const {
    _id: id,
    firstName,
    lastName,
    email,
    friends,
    friendRequests,
    birthday,
    country,
    city,
    postalCode,
    about,
    profilePicture,
    googleId,
  } = props;

  const user: UserTypes.User = {
    id,
    firstName,
    lastName,
    email,
    friends,
    friendRequests,
    birthday,
    country,
    city,
    postalCode,
    about,
    profilePicture,
  };
  if (googleId) {
    user.googleId = googleId;
  }

  return user;
};

export default dataToUserObject;
