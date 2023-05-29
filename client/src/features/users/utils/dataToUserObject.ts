import { UserInterface } from '../types/user';

type DataToUserObjectProps = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  friends: string[];
  birthday: string;
  country: string;
  city: string;
  postalCode: string;
  about: string;
  profilePicture: string;
  friendRequests?: string[];
};

const dataToUserObject = (props: DataToUserObjectProps): UserInterface => {
  const {
    _id: id,
    firstName,
    lastName,
    email,
    friends,
    birthday,
    country,
    city,
    postalCode,
    about,
    profilePicture,
    friendRequests,
  } = props;

  const user: UserInterface = {
    id,
    firstName,
    lastName,
    email,
    friends,
    birthday: new Date(birthday).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    country,
    city,
    postalCode,
    about,
    profilePicture,
  };

  if (friendRequests) {
    user.friendRequests = friendRequests;
  }

  return user;
};

export default dataToUserObject;
