interface CountMutualFriendsProps {
  myFriends: string[];
  usersFriends: string[];
}

const countMutualFriends = (props: CountMutualFriendsProps): number => {
  const { myFriends, usersFriends } = props;
  let count = 0;
  myFriends.forEach((friend) => {
    if (usersFriends.includes(friend)) {
      count += 1;
    }
  });
  return count;
};

export default countMutualFriends;
