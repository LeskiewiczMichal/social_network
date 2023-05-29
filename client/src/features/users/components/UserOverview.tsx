import { Link } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../../../hooks';
import StandardButton from '../../../components/StandardButton';
import sendFriendRequest from '../services/sendFriendRequest';
import { useSocket, UserSlice } from '../../authentication';
import addFriend from '../services/addFriend';
import removeFriend from '../services/removeFriend';
import * as ProfilePageSlice from '../reducers/profilePageReducer';

export default function UserOverview() {
  const dispatch = useAppDispatch();
  const loggedUser = useAppSelector((state) => state.user);
  const displayedProfile = useAppSelector((state) => state.profilePage);
  const socket = useSocket();

  const handleAddFriend = () => {
    dispatch(ProfilePageSlice.addFriend(loggedUser.id!));
    dispatch(UserSlice.addFriend(displayedProfile.id));
    dispatch(UserSlice.removeFriendRequest(displayedProfile.id));
    addFriend({ newFriendId: displayedProfile.id, socket });
  };

  const handleRemoveFriend = () => {
    dispatch(ProfilePageSlice.removeFriend(loggedUser.id!));
    dispatch(UserSlice.removeFriend(displayedProfile.id));
    removeFriend({ friendToRemove: displayedProfile.id });
  };

  const handleSendFriendRequest = () => {
    dispatch(ProfilePageSlice.addFriendRequest(loggedUser.id!));
    sendFriendRequest({ newFriendId: displayedProfile.id, socket });
  };

  // When accepting request, remove id from friend requests

  let befriendButton: JSX.Element;
  if (displayedProfile.friends.includes(loggedUser.id!)) {
    befriendButton = (
      <StandardButton
        text="Remove friend"
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        handleClick={(e: React.MouseEvent<HTMLButtonElement>) => {
          handleRemoveFriend();
        }}
      />
    );
  } else if (loggedUser.friendRequests?.includes(displayedProfile.id)) {
    befriendButton = (
      <StandardButton
        text="Add friend"
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        handleClick={(e: React.MouseEvent<HTMLButtonElement>) => {
          handleAddFriend();
        }}
      />
    );
  } else if (!displayedProfile.friendRequests.includes(loggedUser.id!)) {
    befriendButton = (
      <StandardButton
        text="Send request"
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        handleClick={(e: React.MouseEvent<HTMLButtonElement>) => {
          handleSendFriendRequest();
        }}
      />
    );
  } else {
    befriendButton = (
      <span className="w-full bg-primary text-white flex items-center justify-center font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-150">
        Request sent
      </span>
    );
  }
  return (
    <div className="w-full max-w-md bg-white border border-gray-200 rounded-lg shadow shadow-primary dark:bg-gray-800 dark:border-gray-700">
      <div className="flex flex-col items-center pb-10 mt-5">
        {/* Profile picture */}
        <img
          className="w-24 h-24 mb-3 rounded-full shadow-lg"
          src={`${process.env.REACT_APP_SERVER_URL}${displayedProfile.profilePicture}`}
          alt={`${displayedProfile.firstName} ${displayedProfile.lastName}`}
        />
        {/* Name */}
        <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
          {displayedProfile.firstName} {displayedProfile.lastName}
        </h5>
        {/* About user */}
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {displayedProfile.about}
        </span>
        {loggedUser.id !== displayedProfile.id && (
          <div className="flex w-full px-8 mt-4 space-x-3 md:mt-6">
            {/* Remove or add friend button */}
            {befriendButton}
            {/* Message button */}
            <Link
              to={`/chat/${displayedProfile.id}`}
              className="w-full px-4 py-2 border flex justify-center gap-2 border-slate-300 rounded-lg dark:text-white text-slate-700 hover:border-slate-400 hover:text-slate-900 hover:shadow transition duration-150"
            >
              Message
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
