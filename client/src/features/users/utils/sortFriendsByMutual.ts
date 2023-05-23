import { UserInterface } from '../types/user';

interface SortFriendsByMutualProps {
  friends: UserInterface[];
  myFriends: string[];
}

const sortFriendsByMutual = (props: SortFriendsByMutualProps) => {
  const { friends, myFriends } = props;

  friends.sort((a: UserInterface, b: UserInterface) => {
    const aIsInMyFriends = myFriends.includes(a.id);
    const bIsInMyFriends = myFriends.includes(b.id);
    if (aIsInMyFriends && !bIsInMyFriends) {
      return -1;
    }
    if (!aIsInMyFriends && bIsInMyFriends) {
      return 1;
    }
    return 0;
  });
};

export default sortFriendsByMutual;
