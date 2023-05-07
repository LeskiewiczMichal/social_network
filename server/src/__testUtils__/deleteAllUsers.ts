import { User } from '../models';

const deleteAllUsers = async () => {
  try {
    await User.deleteMany({});
  } catch (error) {
    console.error(error);
  }
};

export default deleteAllUsers;
